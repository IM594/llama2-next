import { NextRequest } from "next/server";


// 创建多个请求地址，分别对应不同的机器: BASE_URL, MEDICAL_URL, FINANCE_URL
const BASE_URL = "http://region-31.seetacloud.com:46766/v1/chat/completions"; // 内蒙A区 / 385机 3090
const MEDICAL_URL = "http://region-31.seetacloud.com:46411/v1/chat/completions"; // 内蒙A区 / 384机 3090
const FINANCE_URL = "http://region-31.seetacloud.com:30342/v1/chat/completions"; // 内蒙A区 / 386机 3090

//暴露BASE_URL
export { BASE_URL, MEDICAL_URL, FINANCE_URL };

// 请求 BASE_URL
export async function requestLlama2Base(req: NextRequest) {
  console.log("请求了Base", BASE_URL);

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

// 请求 MEDICAL_URL
export async function requestLlama2Medical(req: NextRequest) {
    console.log("请求了Finance", MEDICAL_URL);

    return fetch(MEDICAL_URL, {
        headers: {
        "Content-Type": "application/json",
        // 如果需要其他请求头，可以在这里添加
        },
        cache: "no-store",
        method: req.method,
        body: req.body,
    });
}


// 请求 FINANCE_URL
export async function requestLlama2Finance(req: NextRequest) {
    console.log("请求了Finance", FINANCE_URL);

    return fetch(FINANCE_URL, {
        headers: {
        "Content-Type": "application/json",
        // 如果需要其他请求头，可以在这里添加
        },
        cache: "no-store",
        method: req.method,
        body: req.body,
    });
}