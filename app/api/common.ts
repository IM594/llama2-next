import { NextRequest } from "next/server";

const BASE_URL = "http://region-31.seetacloud.com:39349/v1/chat/completions"; // 直接写死请求地址.内蒙A区 / 367机
// http://region-31.seetacloud.com:46766/

// const BASE_URL = "http://region-31.seetacloud.com:46766/v1/chat/completions"; // 直接写死请求地址.内蒙A区 / 385机

export async function requestOpenai(req: NextRequest) {
  console.log("[Base Url]", BASE_URL);

  return fetch(BASE_URL, {
    headers: {
      "Content-Type": "application/json",
      // 如果需要其他请求头，可以在这里添加
    },
    cache: "no-store",
    method: req.method,
    body: req.body,
  });
}
