import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreKey } from "../constant";

// 定义状态的接口
export interface AccessControlStore {
    llamaUrl: string;

  fetch: () => void;
}

let fetchState = 0; // 0 代表未发起请求，1 代表正在请求，2 代表请求完成

export const useAccessStore = create<AccessControlStore>()(
  persist(
    (set, get) => ({

        llamaUrl: "/api/llama/",

      // 从服务器获取数据
      fetch() {
        if (fetchState > 0) return;
        fetchState = 1;
        fetch("/api/config", {
          method: "post",
          body: null,
        })
          .then((res) => res.json())
          .finally(() => {
            fetchState = 2;
          });
      },
    }),
    {
      name: StoreKey.Access,
      version: 1,
    },
  ),
);
