import type { ChatRequest, ChatResponse } from "./api/llama/typing";
import {
  Message,
  ModelConfig,
  ModelType,
  useAccessStore,
  useAppConfig,
  useChatStore,
} from "./store";

// 请求超时时间（毫秒）
const TIME_OUT_MS = 60000;

// 构造 ChatRequest 请求对象
const makeRequestParam = (
  messages: Message[],
  options?: {
    stream?: boolean;
    // overrideModel?: ModelType;
  },
): ChatRequest => {
  let sendMessages = messages.map((v) => ({
    role: v.role,
    content: v.content,
  }));

  const modelConfig = {
    ...useAppConfig.getState().modelConfig,
    ...useChatStore.getState().currentSession().mask.modelConfig,
  };

  // 覆盖模型配置
  // if (options?.overrideModel) {
  //   modelConfig.model = options.overrideModel;
  // }

  return {
    messages: sendMessages,
    stream: options?.stream,
    model: modelConfig.model,
    temperature: modelConfig.temperature,
    presence_penalty: modelConfig.presence_penalty,
    max_tokens: modelConfig.max_tokens,
  };
};

// 获取请求头信息
// function getHeaders() {
//   // const accessStore = useAccessStore.getState();
//   // const headers = {
//   //   Authorization: "",
//   // };
//
//   // const makeBearer = (token: string) => `Bearer ${token.trim()}`;
//   // const validString = (x: string) => x && x.length > 0;
//
//   // 首先使用用户的 API 密钥
//   // if (validString(accessStore.token)) {
//   //   headers.Authorization = makeBearer(accessStore.token);
//   // } else if (
//   //     accessStore.enabledAccessControl() &&
//   //     validString(accessStore.accessCode)
//   // ) {
//   //   headers.Authorization = makeBearer(accessStore.accessCode);
//   // }
//
//   return headers;
// }

// 创建用于发起 OpenAI 客户端请求的函数
export function requestLlama2Client(path: string) {
  console.log("使用了requestLlama2Client")
  const llamaUrl = useAccessStore.getState().llamaUrl;
  return (body: any, method = "POST") =>
    fetch(llamaUrl + path, {
      method,
      body: body && JSON.stringify(body),
      // headers: getHeaders(),
    });
}

// 请求 LLaMa 模型，用于生成标题等
export async function requestChat(
  messages: Message[],
  options?: {
    model?: ModelType;
  },
) {

  console.log("使用了requestChat")
  const req: ChatRequest = makeRequestParam(messages);

  const res = await requestLlama2Client("v1/chat/completions")(req);

  console.log("!!!![Request body] ", req);
  console.log("!!!![Request URL] ", res.url);

  try {
    return (await res.json()) as ChatResponse;
  } catch (error) {
    console.error("[Request Chat] ", error, res.body);
  }
}

// 请求 LLaMA 模型的流式输出，用于对话
export async function requestChatStream(
  messages: Message[],
  options?: {
    modelConfig?: ModelConfig;
    // overrideModel?: ModelType;
    onMessage: (message: string, done: boolean) => void;
    onError: (error: Error, statusCode?: number) => void;
    onController?: (controller: AbortController) => void;
  },
) {
  console.log("使用了requestChatStream");
  const req = makeRequestParam(messages, {
    stream: true,
    // overrideModel: options?.overrideModel,
  });

  console.log("[Request] ", req);

  const controller = new AbortController();
  const reqTimeoutId = setTimeout(() => controller.abort(), TIME_OUT_MS);

  try {
    const llamaUrl = useAccessStore.getState().llamaUrl;

    const currentModel = useChatStore.getState().currentSession().mask.modelConfig.model;
    // 打印当前Mask的model

    // console.log("!!!!!request:", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(req),
    //   signal: controller.signal,
    // });

    console.log("request: "+ JSON.stringify(req));

    const res = await fetch(llamaUrl + "v1/chat/completions/" + currentModel, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ...getHeaders(),
      },
      body: JSON.stringify(req),
      signal: controller.signal,
    });

    clearTimeout(reqTimeoutId);

    let responseText = "";

    const finish = () => {
      options?.onMessage(responseText, true);
      controller.abort();
    };

    if (res.ok) {
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      options?.onController?.(controller);

      while (true) {
        const resTimeoutId = setTimeout(() => finish(), TIME_OUT_MS);
        const content = await reader?.read();
        clearTimeout(resTimeoutId);

        if (!content || !content.value) {
          break;
        }

        const text = decoder.decode(content.value, { stream: true });
        responseText += text;

        const done = content.done;
        options?.onMessage(responseText, false);

        if (done) {
          break;
        }
      }

      finish();
    }
    // else if (res.status === 401) {
    //   console.error("Unauthorized");
    //   options?.onError(new Error("Unauthorized"), res.status);
    // }
    else {
      console.error("Stream Error", res.body);
      options?.onError(new Error("Stream Error"), res.status);
    }
  } catch (err) {
    console.error("NetWork Error", err);
    options?.onError(err as Error);
  }
}

// 请求 llama2 模型并使用指定提示进行对话
export async function requestWithPrompt(
  messages: Message[],
  prompt: string,
  options?: {
    model?: ModelType;
  },
) {
  console.log("使用了requestWithPrompt")
  messages = messages.concat([
    {
      role: "user",
      content: prompt,
      date: new Date().toLocaleString(),
    },
  ]);

  const res = await requestChat(messages, options);

  return res?.choices?.at(0)?.message?.content ?? "";
}

// 用于存储消息流的控制器
export const ControllerPool = {
  controllers: {} as Record<string, AbortController>,

  // 添加控制器
  addController(
    sessionIndex: number,
    messageId: number,
    controller: AbortController,
  ) {
    const key = this.key(sessionIndex, messageId);
    this.controllers[key] = controller;
    return key;
  },

  // 停止指定控制器
  stop(sessionIndex: number, messageId: number) {
    const key = this.key(sessionIndex, messageId);
    const controller = this.controllers[key];
    controller?.abort();
  },

  // 停止所有控制器
  stopAll() {
    Object.values(this.controllers).forEach((v) => v.abort());
  },

  // 检查是否存在待处理的控制器
  hasPending() {
    return Object.values(this.controllers).length > 0;
  },

  // 移除指定控制器
  remove(sessionIndex: number, messageId: number) {
    const key = this.key(sessionIndex, messageId);
    delete this.controllers[key];
  },

  // 生成唯一键
  key(sessionIndex: number, messageIndex: number) {
    return `${sessionIndex},${messageIndex}`;
  },
};
