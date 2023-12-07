import {NextRequest} from "next/server";

// const BASE_URL = "http://region-31.seetacloud.com:46766/v1/chat/completions"; // 内蒙A区 / 385机 3090 13b
const BASE_URL = "http://region-3.seetacloud.com:30160//v1/chat/completions"; // 内蒙A区 / 094机 RTX A5000 13b
const MEDICAL_URL = "http://region-31.seetacloud.com:46411/v1/chat/completions"; // 内蒙A区 / 384机 3090
const FINANCE_URL = "http://region-31.seetacloud.com:30342/v1/chat/completions"; // 内蒙A区 / 386机 3090

export {BASE_URL, MEDICAL_URL, FINANCE_URL};

export async function requestLlama2Base(req: NextRequest) {
    console.log("请求了Base", BASE_URL);

    return fetch(BASE_URL, {
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
        method: req.method,
        body: req.body,
    });
}

export async function requestLlama2Medical(req: NextRequest) {
    console.log("请求了Finance", MEDICAL_URL);

    return fetch(MEDICAL_URL, {
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
        method: req.method,
        body: req.body,
    });
}

export async function requestLlama2Finance(req: NextRequest) {
    console.log("请求了Finance", FINANCE_URL);

    return fetch(FINANCE_URL, {
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
        method: req.method,
        body: req.body,
    });
}
