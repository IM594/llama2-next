import {createParser} from "eventsource-parser";
import {NextRequest, NextResponse} from "next/server";
import {BASE_URL, requestLlama2Base, requestLlama2Medical, requestLlama2Finance} from "../../common";
import {useChatStore} from "@/app/store";

async function createStream(res: Response) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
        async start(controller) {
            function onParse(event: any) {
                if (event.type === "event") {
                    const data = event.data;
                    if (data === "[DONE]") {
                        controller.close();
                        return;
                    }
                    try {
                        const json = JSON.parse(data);
                        const text = json.choices[0].delta.content;
                        const queue = encoder.encode(text);
                        controller.enqueue(queue);
                        console.log("!!!" + text);
                    } catch (e) {
                        controller.error(e);
                    }
                }
            }

            const parser = createParser(onParse);
            for await (const chunk of res.body as any) {
                parser.feed(decoder.decode(chunk, {stream: true}));
            }
        },
    });
    return stream;
}

function formatResponse(msg: any) {
    const jsonMsg = ["```json\n", JSON.stringify(msg, null, "  "), "\n```"].join(
        "",
    );
    console.log("[Llama 2 Response] ", jsonMsg);
    return new Response(jsonMsg);
}

async function handle(
    req: NextRequest,
    {params}: { params: { path: string[] } },
    currentModel: string // 传递 currentModel 作为参数
) {
    console.log("[Llama 2 Route] params ", params);


    const authResult = true;
    // if (authResult.error) {
    //   return NextResponse.json(authResult, {
    //     status: 401,
    //   });
    // }


    // 根据config的model值，请求不同的方法函数
    // const currentModel = useChatStore.getState().currentSession().mask.modelConfig.model;

    let requestFunction;
    switch (params.path[3]) {
        case "LLaMA-2-13B-BaseGPT":
            requestFunction = requestLlama2Base;
            break;
        case "LLaMA-2-13B-Healthcare":
            requestFunction = requestLlama2Medical;
            break;
        case "LLaMA-2-13B-Finance":
            requestFunction = requestLlama2Finance;
            break;
        default:
            // 默认请求函数
            requestFunction = requestLlama2Base;
            break;
    }

    try {

        const api = await requestFunction(req);

        const contentType = api.headers.get("Content-Type") ?? "";

        // streaming response
        if (contentType.includes("stream")) {
            console.log("[Llama 2 Response] streaming");
            const stream = await createStream(api);
            const res = new Response(stream);
            res.headers.set("Content-Type", contentType);
            return res;
        }

        // try to parse error msg
        try {
            const mayBeErrorBody = await api.json();
            if (mayBeErrorBody.error) {
                console.error("[Llama 2 Response] ", mayBeErrorBody);
                // return formatResponse(mayBeErrorBody);
                return formatResponse("Something went wrong... Please check if the backend is turned on.")
            } else {
                const res = new Response(JSON.stringify(mayBeErrorBody));
                res.headers.set("Content-Type", "application/json");
                res.headers.set("Cache-Control", "no-cache");
                return res;
            }
        } catch (e) {
            console.error("[Llama 2 Parse] ", e);
            return formatResponse({
                msg: "invalid response from llama server",
                error: e,
            });
        }
    } catch (e) {
        console.error("[Llama 2] ", e);
        // return formatResponse(e);
        return formatResponse("Something went wrong... Please check if the backend "+requestFunction+" is turned on.");
        // 返回params的第三个参数
        // return formatResponse("" + requestFunction);

    }
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
