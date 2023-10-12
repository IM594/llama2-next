// 导入必要的库和模块
import { create } from "zustand";
import { persist } from "zustand/middleware";
import Fuse from "fuse.js";
import { getLang } from "../locales";
import { StoreKey } from "../constant";

// 定义提示对象的接口
export interface Prompt {
  id?: number;
  isUser?: boolean;
  title: string;
  content: string;
}

// 定义状态管理器的接口
export interface PromptStore {
  counter: number;
  latestId: number;
  prompts: Record<number, Prompt>;

  add: (prompt: Prompt) => number;
  get: (id: number) => Prompt | undefined;
  remove: (id: number) => void;
  search: (text: string) => Prompt[];
  update: (id: number, updater: (prompt: Prompt) => void) => void;

  getUserPrompts: () => Prompt[];
}

// 搜索服务对象
export const SearchService = {
  ready: false,
  builtinEngine: new Fuse<Prompt>([], { keys: ["title"] }),
  userEngine: new Fuse<Prompt>([], { keys: ["title"] }),
  count: {
    builtin: 0,
  },
  allPrompts: [] as Prompt[],
  builtinPrompts: [] as Prompt[],

  // 初始化搜索服务
  init(builtinPrompts: Prompt[], userPrompts: Prompt[]) {
    if (this.ready) {
      return;
    }
    this.allPrompts = userPrompts.concat(builtinPrompts);
    this.builtinPrompts = builtinPrompts.slice();
    this.builtinEngine.setCollection(builtinPrompts);
    this.userEngine.setCollection(userPrompts);
    this.ready = true;
  },

  // 删除提示
  remove(id: number) {
    this.userEngine.remove((doc) => doc.id === id);
  },

  // 添加提示
  add(prompt: Prompt) {
    this.userEngine.add(prompt);
  },

  // 搜索提示
  search(text: string) {
    const userResults = this.userEngine.search(text);
    const builtinResults = this.builtinEngine.search(text);
    return userResults.concat(builtinResults).map((v) => v.item);
  },
};

// 创建 Zustand 状态管理器
export const usePromptStore = create<PromptStore>()(
  // 应用 persist 中间件，用于状态的持久化存储
  persist(
    (set, get) => ({
      counter: 0,
      latestId: 0,
      prompts: {},

      // 添加提示
      add(prompt) {
        const prompts = get().prompts;
        prompt.id = get().latestId + 1;
        prompt.isUser = true;
        prompts[prompt.id] = prompt;

        set(() => ({
          latestId: prompt.id!,
          prompts: prompts,
        }));

        return prompt.id!;
      },

      // 获取提示
      get(id) {
        const targetPrompt = get().prompts[id];

        if (!targetPrompt) {
          return SearchService.builtinPrompts.find((v) => v.id === id);
        }

        return targetPrompt;
      },

      // 删除提示
      remove(id) {
        const prompts = get().prompts;
        delete prompts[id];
        SearchService.remove(id);

        set(() => ({
          prompts,
          counter: get().counter + 1,
        }));
      },

      // 获取用户提示列表
      getUserPrompts() {
        const userPrompts = Object.values(get().prompts ?? {});
        userPrompts.sort((a, b) => (b.id && a.id ? b.id - a.id : 0));
        return userPrompts;
      },

      // 更新提示
      update(id: number, updater) {
        const prompt = get().prompts[id] ?? {
          title: "",
          content: "",
          id,
        };

        SearchService.remove(id);
        updater(prompt);
        const prompts = get().prompts;
        prompts[id] = prompt;
        set(() => ({ prompts }));
        SearchService.add(prompt);
      },

      // 搜索提示
      search(text) {
        if (text.length === 0) {
          // 返回所有提示
          return SearchService.allPrompts.concat([...get().getUserPrompts()]);
        }
        return SearchService.search(text) as Prompt[];
      },
    }),
    {
      // 持久化存储的配置
      name: StoreKey.Prompt,
      version: 1,
      onRehydrateStorage(state) {
        const PROMPT_URL = "./prompts.json";

        type PromptList = Array<[string, string]>;

        fetch(PROMPT_URL)
          .then((res) => res.json())
          .then((res) => {
            let fetchPrompts = [res.en, res.cn];
            if (getLang() === "cn") {
              fetchPrompts = fetchPrompts.reverse();
            }
            const builtinPrompts = fetchPrompts.map(
              (promptList: PromptList) => {
                return promptList.map(
                  ([title, content]) =>
                    ({
                      id: Math.random(),
                      title,
                      content,
                    } as Prompt),
                );
              },
            );

            const userPrompts =
              usePromptStore.getState().getUserPrompts() ?? [];

            const allPromptsForSearch = builtinPrompts
              .reduce((pre, cur) => pre.concat(cur), [])
              .filter((v) => !!v.title && !!v.content);
            SearchService.count.builtin = res.en.length + res.cn.length;
            SearchService.init(allPromptsForSearch, userPrompts);
          });
      },
    },
  ),
);
