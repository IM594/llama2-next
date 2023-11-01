// import { SubmitKey } from "../store/config";
import type { LocaleType } from "./index";

const en: LocaleType = {
  // WIP: "Coming Soon...",
  // Error: {
  //   Unauthorized:
  //     "Unauthorized access, please enter access code in settings page.",
  // },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} messages`,
  },
  Chat: {
    SubTitle: (count: number) => `${count} Messages`,
    Actions: {
      ChatList: "Go To Conversation List",
      // CompressedHistory: "Compressed History Memory Prompt",
      Export: "Export Messages",
      Copy: "Copy",
      Stop: "Stop",
      Retry: "Retry",
      Delete: "Delete",
    },
    Rename: "Rename Conversation",
    // Typing: "Typing…",
    Input: (submitKey: string) => {
      return `Send a message`
    },
    Send: "Send",
    Config: {
      Reset: "Reset to Default",
      SaveAs: "Save as Mask",
    },
  },
  Export: {
    Title: "All Messages",
    Copy: "Copy All",
    Download: "Download",
    MessageFromYou: "You",
    MessageFromChatGPT: "Next-Llama-2",
  },
  Memory: {
    Title: "Memory Prompt",
    EmptyContent: "Nothing yet.",
    Send: "Send Memory",
    Copy: "Copy Memory",
    Reset: "Reset Session",
    ResetConfirm:
      "Resetting will clear the current conversation history and historical memory. Are you sure you want to reset?",
  },
  Home: {
    NewChat: "New Chat",
    MaskChat: "Chat Mask",
    DeleteChat: "Confirm to delete the selected conversation?",
    DeleteToast: "Chat Deleted",
    Revert: "Revert",
  },
  Settings: {
    Title: "Settings",
    // SubTitle: "All Settings",
    Actions: {
      ClearAll: "Clear All Data",
      ResetAll: "Reset All Settings",
      Close: "Close",
      ConfirmResetAll: "Are you sure you want to reset all configurations?",
      ConfirmClearAll: "Are you sure you want to reset all data?",
    },
    Lang: {
      Name: "Language", // ATTENTION: if you wanna add a new translation, please do not translate this value, leave it as `Language`
      All: "All Languages",
      Options: {
        cn: "简体中文",
        en: "English",
        // tw: "繁體中文",
        // es: "Español",
        // it: "Italiano",
        // tr: "Türkçe",
        // jp: "日本語",
        // de: "Deutsch",
      },
    },
    // Avatar: "Avatar",
    // FontSize: {
    //   Title: "Font Size",
    //   SubTitle: "Adjust font size of chat content",
    // },
    // Update: {
    //   Version: (x: string) => `Version: ${x}`,
    //   IsLatest: "Latest version",
    //   CheckUpdate: "Check Update",
    //   IsChecking: "Checking update...",
    //   FoundUpdate: (x: string) => `Found new version: ${x}`,
    //   GoToUpdate: "Update",
    // },
    // SendKey: "Send Key",
    Theme: "Theme",
    TightBorder: "Full Screen",
    // SendPreviewBubble: {
    //   Title: "Send Preview Bubble",
    //   SubTitle: "Preview markdown in bubble",
    // },
    Mask: {
      Title: "Display Mask Screen",
      // SubTitle: "Show a mask splash screen before starting new chat",
    },
    // Prompt: {
    //   Disable: {
    //     Title: "Disable auto-completion",
    //     SubTitle: "Input / to trigger auto-completion",
    //   },
    //   List: "Prompt List",
    //   ListCount: (builtin: number, custom: number) =>
    //     `${builtin} built-in, ${custom} user-defined`,
    //   Edit: "Edit",
    //   Modal: {
    //     Title: "Prompt List",
    //     Add: "Add One",
    //     Search: "Search Prompts",
    //   },
    //   EditModal: {
    //     Title: "Edit Prompt",
    //   },
    // },
    HistoryCount: {
      Title: "Attached Messages Count",
      SubTitle: "How many previous messages to use for context. They will take up some tokens",
    },
    CompressThreshold: {
      Title: "History Compression Threshold",
      SubTitle:
        "Will shorten the previous messages if they exceed the value you set",
    },
    Model: "Model",
    Temperature: {
      Title: "Temperature",
      SubTitle: "Controls the randomness of the output, higher means more uncertain",
    },
    MaxTokens: {
      Title: "Max Tokens",
      SubTitle: "Limits the maximum length of the input and output, larger means longer",
    },
    PresencePenalty: {
      Title: "Presence Penalty",
      SubTitle:
        "Punishes repeated words in the output, higher means less repetition",
    },
    TopP: {
        Title: "Top P",
    },
    FrequencyPenalty: {
        Title: "Frequency Penalty",
    }
  },
  Store: {
    DefaultTopic: "New Conversation",
    BotHello: "Hello! How can I assist you today?",
    Error: "Something went wrong...",
    Prompt: {
      History: (content: string) =>
        "This is a summary of the chat history between the AI and the user as a recap: " +
        content,
      Topic:
        "Generate a 4 to 5 word title to summarize the conversation without any lead-in, punctuation, quotation marks, periods, symbols, or additional text. Remove enclosing quotation marks.",
      Summarize:
        "Summarize our discussion briefly in 200 words or less to use as a prompt for future context.",
    },
  },
  // Copy: {
  //   Success: "Copied to clipboard",
  //   Failed: "Copy failed, please grant permission to access clipboard",
  // },
  Context: {
    Toast: (x: any) => `With ${x} contextual prompts`,
    Edit: "Current Chat Settings",
    Add: "Add a Prompt",
  },
  // Plugin: {
  //   Name: "Plugin",
  // },
  // Mask: {
  //   Name: "Mask",
  //   Page: {
  //     Title: "Prompt Template",
  //     SubTitle: (count: number) => `${count} prompt templates`,
  //     Search: "Search Templates",
  //     Create: "Create",
  //   },
  //   Item: {
  //     Info: (count: number) => `${count} prompts`,
  //     Chat: "Chat",
  //     View: "View",
  //     Edit: "Edit",
  //     Delete: "Delete",
  //     DeleteConfirm: "Confirm to delete?",
  //   },
  //   EditModal: {
  //     Title: (readonly: boolean) =>
  //       `Edit Prompt Template ${readonly ? "(readonly)" : ""}`,
  //     Download: "Download",
  //     Clone: "Clone",
  //   },
  //   Config: {
  //     Avatar: "Bot Avatar",
  //     Name: "Bot Name",
  //   },
  // },
  NewChat: {
    Return: "Return",
    Skip: "Skip",
    Title: "New Chat",
    SubTitle: "Pick a Mask & Chat with it",
    // More: "Find More",
    NotShow: "Don't Show this Page Again",
    ConfirmNoShow: "Confirm to disable？You can enable it in settings later.",
  },

  UI: {
    Confirm: "Confirm",
    Cancel: "Cancel",
    Close: "Close",
    Create: "Create",
    Edit: "Edit",
  },
};

export default en;
