const cn = {
    ChatItem: {
        ChatItemCount: (count: number) => `${count} 条对话`,
    },
    Chat: {
        SubTitle: (count: number) => `${count} 条对话`,
        Actions: {
            ChatList: "返回消息列表",
            Export: "导出聊天记录",
            Copy: "复制",
            Stop: "停止",
            Retry: "重试",
            Delete: "删除",
        },
        Rename: "重命名",
        Input: (submitKey: string) => {
            return "输入消息";
        },
        Send: "发送",
        Config: {
            Reset: "重置默认",
            SaveAs: "另存为面具",
        },
    },
    Export: {
        Title: "导出聊天记录",
        Copy: "全部复制",
        Download: "下载文件",
        MessageFromYou: "你",
        MessageFromChatGPT: "Next-Llama-2",
    },
    Memory: {
        Title: "历史摘要",
        EmptyContent: "对话内容过短，无需总结",
        Send: "自动压缩聊天记录并作为上下文发送",
        Copy: "复制摘要",
        Reset: "重置对话",
        ResetConfirm: "重置后将清空当前对话记录以及历史摘要，确认重置？",
    },
    Home: {
        NewChat: "新的聊天",
        MaskChat: "面具聊天",
        DeleteChat: "确认删除选中的对话吗？",
        DeleteToast: "已删除会话",
        Revert: "撤销",
    },
    Settings: {
        Title: "设置",
        Actions: {
            ClearAll: "清除所有数据",
            ResetAll: "重置所有设置选项",
            Close: "关闭",
            ConfirmClearAll: "确认清除所有数据吗？",
            ConfirmResetAll: "确认重置所有设置选项吗？",
        },
        Lang: {
            Name: "语言",
            All: "所有语言",
            Options: {
                cn: "简体中文",
                en: "English",
            },
        },

        Theme: "主题",
        TightBorder: "全屏显示",
        Mask: {
            Title: "展示面具页",
        },
        HistoryCount: {
            Title: "附带历史消息数",
            SubTitle: "使用多少个之前的消息作为上下文。它们会占用一些令牌",
        },
        CompressThreshold: {
            Title: "历史消息压缩阈值",
            SubTitle: "如果之前的消息超过您设置的值，将自动压缩它们",
        },
        Model: "模型",
        Temperature: {
            Title: "随机性",
            SubTitle: "控制输出的随机性，越高越不确定",
        },
        MaxTokens: {
            Title: "最大令牌数",
            SubTitle: "限制输入和输出的最大长度，越大越长",
        },
        PresencePenalty: {
            Title: "存在惩罚",
            SubTitle: "惩罚输出中重复的词语，越高越少重复",
        },
        TopP: {
            Title: "TopP",
        },
        FrequencyPenalty: {
            Title: "FrequencyPenalty",
        }
    },
    Store: {
        DefaultTopic: "新的对话",
        BotHello: "您好，请问有什么需要帮忙的吗？",
        Error: "出错了……",
        Prompt: {
            History: (content: string) =>
                "这是 ai 和用户的历史聊天总结作为前情提要：" + content,
            Topic:
                "请你使用四到五个字直接返回这句话的简要主题，不要解释、不要标点、不要语气词、不要多余文本。如果没有主题，请直接返回“闲聊”",
            Summarize:
                "简要总结一下你和用户的对话，用作后续的上下文提示 prompt，控制在 200 字以内",
        },
    },
    Context: {
        Toast: (x: any) => `已设置 ${x} 条前置上下文`,
        Edit: "当前聊天设置",
        Add: "新增预设对话",
    },
    NewChat: {
        Return: "返回",
        Skip: "直接新建对话",
        NotShow: "不再展示此页面",
        ConfirmNoShow: "确认禁用？禁用后可以随时在设置中重新启用。",
        Title: "开始对话",
        SubTitle: "请挑选一个面具，然后开始对话",
    },

    UI: {
        Confirm: "确认",
        Cancel: "取消",
        Close: "关闭",
        Create: "新建",
        Edit: "编辑",
    },
};

export type LocaleType = typeof cn;

export default cn;
