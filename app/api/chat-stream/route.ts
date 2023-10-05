import { createParser } from "eventsource-parser";
import {NextRequest, NextResponse} from "next/server";

async function createStream(payload: ReadableStream<Uint8Array>) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  console.log("Before sending request");

  const res = await fetch("http://region-31.seetacloud.com:39349/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: 'usyd-cs51-1',
    },
    method: "POST",
    body: payload,
  });
  console.log("After sending request");

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
          } catch (e) {
            controller.error(e);
          }
        }
      }

      const parser = createParser(onParse);
      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });
  return stream;
}

export async function POST(req: NextRequest) {
  try {
    const stream = await createStream(req.body!);
    return new NextResponse(stream, { headers: { 'Content-Type': 'text/event-stream' } });
  } catch (error) {
    console.error("[Chat Stream]", error);
    if (error instanceof Error) { // 添加类型保护
      return new NextResponse(`Error: ${error.message}`, { status: 500 }); // 现在可以安全地访问 error.message
    }
    return new NextResponse('Error', { status: 500 });
  }
}

export const config = {
  runtime: "edge",
};
