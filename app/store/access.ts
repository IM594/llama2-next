// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { queryMeta } from "../utils";

// // 定义访问控制相关的状态和操作
// export interface AccessControlStore {
//   accessCode: string; // 访问控制的代码

//   // 更新访问控制代码
//   updateCode: (code: string) => void;

//   // 检查是否启用了访问控制
//   enabledAccessControl: () => boolean;
// }

// // 用于在本地存储中标识访问控制状态的键
// export const ACCESS_KEY = "cs51-1";

// // 创建一个名为 useAccessStore 的状态管理器
// export const useAccessStore = create<AccessControlStore>()(
//   // 使用 persist 中间件将状态持久化到本地存储
//   persist(
//     // 状态和操作的定义
//     (set, get) => ({
//       accessCode: "",

//       // 检查是否启用了访问控制
//       enabledAccessControl() {
//         return queryMeta("access") === "enabled";
//       },

//       // 更新访问控制代码
//       updateCode(code: string) {
//         set((state) => ({ accessCode: code }));
//       },
//     }),
//     // 配置持久化的参数
//     {
//       name: ACCESS_KEY, // 持久化的键名
//       version: 1,       // 持久化数据的版本号
//     }
//   )
// );
