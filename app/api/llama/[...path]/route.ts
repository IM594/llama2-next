import { createParser } from "eventsource-parser";
import { NextRequest, NextResponse } from "next/server";
import { requestOpenai } from "../../common";

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
        parser.feed(decoder.decode(chunk, { stream: true }));
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
  { params }: { params: { path: string[] } },
) {
  console.log("[Llama 2 Route] params ", params);

  const authResult = true;
  // if (authResult.error) {
  //   return NextResponse.json(authResult, {
  //     status: 401,
  //   });
  // }

  try {
    const api = await requestOpenai(req);

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
    return formatResponse("Something went wrong... Please check if the backend is turned on.")
  }
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
