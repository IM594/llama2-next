import { createParser } from "eventsource-parser";
import { NextRequest } from "next/server";


// 创建一个异步函数来生成一个可读流
async function createStream(payload: ReadableStream<Uint8Array>) {
  // 创建编码器和解码器来处理文本数据
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  // 发起带有有效负载的 POST 请求到 OpenAI 服务
  const res = await fetch("http://region-8.autodl.pro:47847/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: payload,
  });

  // 创建一个可读流，它会从上面的 HTTP 响应中读取数据并处理它
  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: any) {
        if (event.type === "event") {
          const data = event.data;
          // 如果数据为 "[DONE]"，则关闭流
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            // 解析 JSON 数据，获取文本内容并编码成字节数组
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            // 如果解析或处理出错，报错并关闭流
            controller.error(e);
          }
        }
      }

      // 创建事件解析器，用于将流中的数据解析成事件
      const parser = createParser(onParse);
      for await (const chunk of res.body as any) {
        // 解码并处理每个数据块
        parser.feed(decoder.decode(chunk));
      }
    },
  });
  return stream;
}

// 处理 POST 请求的处理程序
export async function POST(req: NextRequest) {
  try {
    // 创建流并将其返回作为响应
    const stream = await createStream(req.body!);
    return new Response(stream);
  } catch (error) {
    // 如果出现错误，记录错误信息
    console.error("[Chat Stream]", error);
  }
}

// 定义 Next.js 配置
export const config = {
  runtime: "edge",
};