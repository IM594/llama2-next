// 路径枚举
export enum Path {
  Home = "/", // 主页路径
  Chat = "/chat", // 聊天页面路径
  Settings = "/settings", // 设置页面路径
  NewChat = "/new-chat", // 新聊天页面路径
  MaskChat = "/mask-chat", // 面具聊天页面路径
  // Masks = "/masks", // 面具页面路径
}

// 插槽 ID 枚举
export enum SlotID {
  AppBody = "app-body", // 应用主体插槽
}

// // 文件名枚举
// export enum FileName {
//   Masks = "masks.json", // 面具文件名
//   Prompts = "prompts.json", // 提示文件名
// }

// 存储键枚举
export enum StoreKey {
  Chat = "cs51-1-nextllama2", // 聊天存储键
  Access = "access-control", // 访问控制存储键
  Config = "app-config", // 应用配置存储键
  Mask = "mask-store", // 面具存储键
  Prompt = "prompt-store", // 提示存储键
  // Update = "chat-update",   // 更新存储键
}

// 侧边栏宽度常量
export const MAX_SIDEBAR_WIDTH = 500; // 侧边栏最大宽度
export const MIN_SIDEBAR_WIDTH = 230; // 侧边栏最小宽度
export const NARROW_SIDEBAR_WIDTH = 100; // 窄侧边栏宽度
