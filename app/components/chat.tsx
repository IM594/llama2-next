import dynamic from "next/dynamic";
import {useDebouncedCallback} from "use-debounce";
import {useState, useRef, useEffect, useLayoutEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";

import SendIcon from "../icons/send.svg";
import EditIcon from "../icons/edit.svg";
import ExportIcon from "../icons/share.svg";
import ReturnIcon from "../icons/return.svg";
import CopyIcon from "../icons/copy.svg";
import DownloadIcon from "../icons/download.svg";
import LoadingIcon from "../icons/three-dots.svg";
import BottomIcon from "../icons/bottom.svg";
import StopIcon from "../icons/pause.svg";

import {ControllerPool} from "../requests";
import Locale from "../locales";

import styles from "./home.module.scss";
import chatStyle from "./chat.module.scss";
import {Input, List, ListItem, Modal, showModal} from "./ui-lib";
import {InputRange} from "@/app/components/input-range";
import {IconButton} from "@/app/components/button";


import {Path} from "../constant";
import {
    Message,
    SubmitKey,
    useChatStore,
    BOT_HELLO,
    createMessage,
    useAppConfig,
    DEFAULT_TOPIC, ModalConfigValidator, ALL_MODELS,
} from "../store";

import {
    copyToClipboard,
    downloadAs,
    autoGrowTextArea,
    useMobileScreen,
} from "../utils";

const Markdown = dynamic(async () => (await import("./markdown")).Markdown, {
    loading: () => <LoadingIcon/>,
});

// 用来导出聊天记录
function exportMessages(messages: Message[], topic: string) {
    const mdText =
        `# ${topic}\n\n` +
        messages
            .map((m) => {
                return m.role === "user"
                    ? `## ${Locale.Export.MessageFromYou}:\n${m.content}`
                    : `## ${Locale.Export.MessageFromChatGPT}:\n${m.content.trim()}`;
            })
            .join("\n\n");
    const filename = `${topic}.md`;

    showModal({
        title: Locale.Export.Title,
        children: (
            <div className="markdown-body">
                <pre className={styles["export-content"]}>{mdText}</pre>
            </div>
        ),
        actions: [
            <IconButton
                key="copy"
                icon={<CopyIcon/>}
                bordered
                text={Locale.Export.Copy}
                onClick={() => copyToClipboard(mdText)}
            />,
            <IconButton
                key="download"
                icon={<DownloadIcon/>}
                bordered
                text={Locale.Export.Download}
                onClick={() => downloadAs(mdText, filename)}
            />,

        ],
    });
}

export function SessionConfigModel(props: { onClose: () => void }) {
    const chatStore = useChatStore();
    const session = chatStore.currentSession();

    return (
        <div className="modal-mask">
            <Modal
                title={Locale.Context.Edit}
                onClose={() => props.onClose()}
            >
                <List>
                    <ListItem title={Locale.Settings.Model}>
                        <select
                            value={session.mask.modelConfig.model}
                            onChange={(e) => {
                                chatStore.updateCurrentSession(
                                    (session) =>
                                        (session.mask.modelConfig.model = ModalConfigValidator.model(
                                            e.currentTarget.value,
                                        )),
                                );
                            }}
                        >
                            {ALL_MODELS.map((v) => (
                                <option value={v.name} key={v.name} disabled={!v.available}>
                                    {v.name}
                                </option>
                            ))}
                        </select>
                    </ListItem>
                    <ListItem title={Locale.Settings.Temperature.Title}>
                        <InputRange
                            value={session.mask.modelConfig.temperature?.toFixed(1)}
                            min="0"
                            max="1" // lets limit it to 0-1
                            step="0.1"
                            onChange={(e) => {
                                chatStore.updateCurrentSession(
                                    (session) =>
                                        (session.mask.modelConfig.temperature = ModalConfigValidator.temperature(
                                            e.currentTarget.valueAsNumber,
                                        )),
                                );
                            }}
                        ></InputRange>
                    </ListItem>
                    <ListItem title={Locale.Settings.MaxTokens.Title}>
                        <InputRange
                            min="100"
                            max="4096"
                            step="50"
                            value={session.mask.modelConfig.max_tokens}
                            onChange={(e) =>
                                chatStore.updateCurrentSession(
                                    (session) =>
                                        (session.mask.modelConfig.max_tokens = ModalConfigValidator.max_tokens(
                                            e.currentTarget.valueAsNumber,
                                        )),
                                )
                            }
                        ></InputRange>
                    </ListItem>
                    <ListItem title={Locale.Settings.PresencePenalty.Title}>
                        <InputRange
                            min="0"
                            max="1"
                            step="0.1"
                            value={session.mask.modelConfig.presence_penalty}
                            onChange={(e) =>
                                chatStore.updateCurrentSession(
                                    (session) =>
                                        (session.mask.modelConfig.presence_penalty =
                                            ModalConfigValidator.presence_penalty(
                                                e.currentTarget.valueAsNumber,
                                            )),
                                )
                            }
                        ></InputRange>
                    </ListItem>
                    <ListItem title={Locale.Settings.HistoryCount.Title}>
                        <InputRange
                            min="0"
                            max="10"
                            step="1"
                            value={session.mask.modelConfig.historyMessageCount}
                            onChange={(e) =>
                                chatStore.updateCurrentSession(
                                    (session) =>
                                        (session.mask.modelConfig.historyMessageCount = e.currentTarget.valueAsNumber),
                                )
                            }
                        ></InputRange>
                    </ListItem>
                    <ListItem title={Locale.Settings.CompressThreshold.Title}>
                        <InputRange
                            min="500"
                            max="4000"
                            step="100"

                            value={session.mask.modelConfig.compressMessageLengthThreshold}
                            onChange={(e) =>
                                chatStore.updateCurrentSession(
                                    (session) =>
                                        (session.mask.modelConfig.compressMessageLengthThreshold=e.currentTarget.valueAsNumber),
                                )
                            }
                        ></InputRange>
                    </ListItem>
                </List>

                <List>
                    <ListItem title={Locale.Chat.Rename}>
                        <Input
                            value={session.topic}
                            rows={1}
                            onChange={(e) => {
                                chatStore.updateCurrentSession(
                                    (session) =>
                                        (session.topic = e.currentTarget.value),
                                );
                            }}
                        ></Input>
                    </ListItem>
                </List>
            </Modal>
        </div>
    );
}

function useSubmitHandler() {
    const config = useAppConfig();
    const submitKey = config.submitKey;

    const shouldSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key !== "Enter") return false;
        if (e.key === "Enter" && e.nativeEvent.isComposing) return false;
        return (
            (config.submitKey === SubmitKey.AltEnter && e.altKey) ||
            (config.submitKey === SubmitKey.CtrlEnter && e.ctrlKey) ||
            (config.submitKey === SubmitKey.ShiftEnter && e.shiftKey) ||
            (config.submitKey === SubmitKey.MetaEnter && e.metaKey) ||
            (config.submitKey === SubmitKey.Enter &&
                !e.altKey &&
                !e.ctrlKey &&
                !e.shiftKey &&
                !e.metaKey)
        );
    };

    return {
        submitKey,
        shouldSubmit,
    };
}

function useScrollToBottom() {
    // for auto-scroll
    const scrollRef = useRef<HTMLDivElement>(null);
    const [autoScroll, setAutoScroll] = useState(true);
    const scrollToBottom = () => {
        const dom = scrollRef.current;
        if (dom) {
            setTimeout(() => (dom.scrollTop = dom.scrollHeight), 1);
        }
    };

    // auto scroll
    useLayoutEffect(() => {
        autoScroll && scrollToBottom();
    });

    return {
        scrollRef,
        autoScroll,
        setAutoScroll,
        scrollToBottom,
    };
}

export function ChatActions(props: {
    scrollToBottom: () => void;
    hitBottom: boolean;
}) {

    // stop all responses
    const couldStop = ControllerPool.hasPending();
    const stopAll = () => {
        ControllerPool.stopAll()
    }
    return (
        <div className={chatStyle["chat-input-actions"]}>
            {couldStop && (
                <div
                    className={`${chatStyle["chat-input-action"]} clickable`}
                    onClick={stopAll}
                >
                    <StopIcon/>
                </div>
            )}

            {!props.hitBottom && (
                <div
                    className={`${chatStyle["chat-input-action"]} clickable`}
                    onClick={props.scrollToBottom}
                >
                    <BottomIcon/>
                </div>
            )}
        </div>
    );
}

function SessionSettings(props: {
    showModal?: boolean;
    setShowModal: (_: boolean) => void;
}) {
    const chatStore = useChatStore();
    const session = chatStore.currentSession();

    return (
        <div className={chatStyle["prompt-toast"]} key="prompt-toast">
            {props.showModal && (
                <SessionConfigModel onClose={() => props.setShowModal(false)}/>
            )}
        </div>
    );
}

export function Chat() {
    type RenderMessage = Message & { preview?: boolean };

    const chatStore = useChatStore();
    const [session, sessionIndex] = useChatStore((state) => [
        state.currentSession(),
        state.currentSessionIndex,
    ]);
    const config = useAppConfig();
    const fontSize = config.fontSize;

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [userInput, setUserInput] = useState("");
    const [beforeInput, setBeforeInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const {submitKey, shouldSubmit} = useSubmitHandler();
    const {scrollRef, setAutoScroll, scrollToBottom} = useScrollToBottom();
    const [hitBottom, setHitBottom] = useState(true);
    const [sendButtonDisabled, setSendButtonDisabled] = useState(false);

    const isMobileScreen = useMobileScreen();
    const navigate = useNavigate();

    const onChatBodyScroll = (e: HTMLElement) => {
        const isTouchBottom = e.scrollTop + e.clientHeight >= e.scrollHeight - 100;
        setHitBottom(isTouchBottom);
    };

    // auto grow input
    const [inputRows, setInputRows] = useState(2);
    const measure = useDebouncedCallback(
        () => {
            const rows = inputRef.current ? autoGrowTextArea(inputRef.current) : 1;
            const inputRows = Math.min(
                20,
                Math.max(2 + Number(!isMobileScreen), rows),
            );
            setInputRows(inputRows);
        },
        100,
        {
            leading: true,
            trailing: true,
        },
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(measure, [userInput]);

    const onInput = (text: string) => {
        setUserInput(text);
        const n = text.trim().length;
    };

    // submit user input
    const onUserSubmit = () => {
        if (userInput.length <= 0 || couldStop || sendButtonDisabled) {
            return; // 不允许提交
        }


        // 在提交之前禁用发送按钮
        setSendButtonDisabled(true); // 禁用发送按钮

        setIsLoading(true);
        chatStore.onUserInput(userInput).then(() => {
            setIsLoading(false);
        });

        setBeforeInput(userInput);
        setUserInput("");
        if (!isMobileScreen) inputRef.current?.focus();
        setAutoScroll(true);


    };

    // stop response
    const onUserStop = (messageId: number) => {
        ControllerPool.stop(sessionIndex, messageId);
    };

    // check if you should send message
    const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // if ArrowUp and no userInput
        if (e.key === "ArrowUp" && userInput.length <= 0) {
            setUserInput(beforeInput);
            e.preventDefault();
            return;
        }
        if (shouldSubmit(e)) {
            onUserSubmit();
            e.preventDefault();
        }
    };

    const findLastUserIndex = (messageId: number) => {
        // find last user input message and resend
        let lastUserMessageIndex: number | null = null;
        for (let i = 0; i < session.messages.length; i += 1) {
            const message = session.messages[i];
            if (message.id === messageId) {
                break;
            }
            if (message.role === "user") {
                lastUserMessageIndex = i;
            }
        }

        return lastUserMessageIndex;
    };

    const deleteMessage = (userIndex: number) => {
        chatStore.updateCurrentSession((session) =>
            session.messages.splice(userIndex, 2),
        );
    };

    const onDelete = (botMessageId: number) => {
        const userIndex = findLastUserIndex(botMessageId);
        if (userIndex === null) return;
        deleteMessage(userIndex);
    };

    const onResend = (botMessageId: number) => {
        // find last user input message and resend
        const userIndex = findLastUserIndex(botMessageId);
        if (userIndex === null) return;

        setIsLoading(true);
        const content = session.messages[userIndex].content;
        deleteMessage(userIndex);
        chatStore.onUserInput(content).then(() => setIsLoading(false));
        inputRef.current?.focus();
    };

    const context: RenderMessage[] = session.mask.context.slice();

    if (
        context.length === 0 &&
        session.messages.at(0)?.content !== BOT_HELLO.content
    ) {
        const copiedHello = Object.assign({}, BOT_HELLO);
        context.push(copiedHello);
    }

    // preview messages
    const messages = context
        .concat(session.messages as RenderMessage[])
        .concat(
            isLoading
                ? [
                    {
                        ...createMessage({
                            role: "assistant",
                            content: "……",
                        }),
                        preview: true,
                    },
                ]
                : [],
        )
    const [showPromptModal, setShowPromptModal] = useState(false);

    const renameSession = () => {
        const newTopic = prompt(Locale.Chat.Rename, session.topic);
        if (newTopic && newTopic !== session.topic) {
            chatStore.updateCurrentSession((session) => (session.topic = newTopic!));
        }
    };

    const location = useLocation();
    const isChat = location.pathname === Path.Chat;
    const autoFocus = !isMobileScreen || isChat; // only focus in chat page

    // stop all responses
    const couldStop = ControllerPool.hasPending();

    useEffect(() => {
        // 监听 couldStop 状态的变化
        if (!couldStop) {
            // 当 couldStop 变为 false 时重新启用发送按钮
            setSendButtonDisabled(false);
        }
    }, [couldStop]);

    function formatLastUpdate(lastUpdate: string | number | Date) {
        const lastUpdateDate = new Date(lastUpdate);
        const currentDate = new Date();

        const options: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
        };

        const timeFormat = lastUpdateDate.toLocaleTimeString('en-US', options);

        if (
            lastUpdateDate.getDate() === currentDate.getDate() &&
            lastUpdateDate.getMonth() === currentDate.getMonth() &&
            lastUpdateDate.getFullYear() === currentDate.getFullYear()
        ) {
            return `Today ${timeFormat}`;
        } else {
            currentDate.setDate(currentDate.getDate() - 1); // Go back 1 day
            if (
                lastUpdateDate.getDate() === currentDate.getDate() &&
                lastUpdateDate.getMonth() === currentDate.getMonth() &&
                lastUpdateDate.getFullYear() === currentDate.getFullYear()
            ) {
                return `Yesterday ${timeFormat}`;
            } else {
                return `${lastUpdateDate.toLocaleDateString('en-US', {timeZone: 'Australia/Sydney'})} ${timeFormat}`;
            }
        }
    }


    function formatTime(id: number | undefined) {
        if (id !== undefined) {
            const time = new Date(id);
            const currentDate = new Date();

            const options: Intl.DateTimeFormatOptions = {
                hour: '2-digit',
                minute: '2-digit',
            };

            const timeFormat = time.toLocaleTimeString('en-US', options);

            if (
                time.getDate() === currentDate.getDate() &&
                time.getMonth() === currentDate.getMonth() &&
                time.getFullYear() === currentDate.getFullYear()
            ) {
                return `Today ${timeFormat}`;
            } else {
                currentDate.setDate(currentDate.getDate() - 1); // Go back 1 day
                if (
                    time.getDate() === currentDate.getDate() &&
                    time.getMonth() === currentDate.getMonth() &&
                    time.getFullYear() === currentDate.getFullYear()
                ) {
                    return `Yesterday ${timeFormat}`;
                } else {
                    return `${time.toLocaleDateString('en-US', {timeZone: 'Australia/Sydney'})} ${timeFormat}`;
                }
            }
        } else {
            return 'Invalid date';
        }
    }

    return (
        <div className={styles.chat} key={session.id}>
            <div className="window-header">
                <div className="window-header-title">
                    <div
                        className={`window-header-main-title " ${styles["chat-body-title"]}`}
                        onClickCapture={renameSession}
                    >
                        {!session.topic ? DEFAULT_TOPIC : session.topic}
                    </div>
                    <div className="window-header-lastupdatedate">
                        Last Message: {formatLastUpdate(session.lastUpdate)}

                    </div>
                </div>
                <div className="window-actions">

                    <div className="window-action-button">
                        <IconButton
                            icon={<EditIcon/>}
                            bordered
                            onClick={() => setShowPromptModal(true)}
                        />
                    </div>
                    <div className="window-action-button">
                        <IconButton
                            icon={<ExportIcon/>}
                            bordered
                            title={Locale.Chat.Actions.Export}
                            onClick={() => {
                                exportMessages(
                                    session.messages.filter((msg) => !msg.isError),
                                    session.topic,
                                );
                            }}
                        />
                    </div>
                    <div className={"window-action-button" + " " + styles.mobile}>
                        <IconButton
                            icon={<ReturnIcon/>}
                            bordered
                            title={Locale.Chat.Actions.ChatList}
                            onClick={() => navigate(Path.Home)}
                        />
                    </div>
                    <SessionSettings
                        showModal={showPromptModal}
                        setShowModal={setShowPromptModal}
                    />
                </div>

            </div>

            <div
                className={styles["chat-body"]}
                ref={scrollRef}
                onScroll={(e) => onChatBodyScroll(e.currentTarget)}
                onMouseDown={() => inputRef.current?.blur()}
                onWheel={(e) => setAutoScroll(hitBottom && e.deltaY > 0)}
                onTouchStart={() => {
                    inputRef.current?.blur();
                    setAutoScroll(false);
                }}
            >
                {messages.map((message, i) => {
                    const isUser = message.role === "user";
                    const showActions =
                        !isUser &&
                        i > 0 &&
                        !(message.preview || message.content.length === 0);

                    return (
                        <div
                            key={i}
                            className={
                                isUser ? styles["chat-message-user"] : styles["chat-message"]
                            }
                        >
                            <div className={styles["chat-message-container"]}>
                                <div className={styles["chat-message-item"]}>
                                    {showActions && (
                                        <div className={styles["chat-message-top-actions"]}>
                                            {sendButtonDisabled ? (
                                                <div
                                                    className={styles["chat-message-top-action"]}
                                                    onClick={() => onUserStop(message.id ?? i)}
                                                >
                                                    {Locale.Chat.Actions.Stop}
                                                </div>
                                            ) : (
                                                <>
                                                    <div
                                                        className={styles["chat-message-top-action"]}
                                                        onClick={() => onDelete(message.id ?? i)}
                                                    >
                                                        {Locale.Chat.Actions.Delete}
                                                    </div>
                                                    <div
                                                        className={styles["chat-message-top-action"]}
                                                        onClick={() => onResend(message.id ?? i)}
                                                    >
                                                        {Locale.Chat.Actions.Retry}
                                                    </div>
                                                </>
                                            )}

                                            <div
                                                className={styles["chat-message-top-action"]}
                                                onClick={() => copyToClipboard(message.content)}
                                            >
                                                {Locale.Chat.Actions.Copy}
                                            </div>

                                            <div
                                                className={styles["chat-message-action-date"]}
                                            >
                                                {formatTime(message.id)}
                                            </div>
                                        </div>
                                    )}
                                    <Markdown
                                        content={message.content}
                                        loading={
                                            (message.preview || message.content.length === 0) &&
                                            !isUser
                                        }
                                        fontSize={fontSize}
                                        parentRef={scrollRef}
                                        defaultShow={i >= messages.length - 10}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={styles["chat-input-panel"]}>
                <ChatActions
                    scrollToBottom={scrollToBottom}
                    hitBottom={hitBottom}
                />
                <div className={styles["chat-input-panel-inner"]}>
          <textarea
              ref={inputRef}
              className={styles["chat-input"]}
              placeholder={Locale.Chat.Input(submitKey)}
              onInput={(e) => onInput(e.currentTarget.value)}
              value={userInput}
              onKeyDown={onInputKeyDown}
              onBlur={() => setAutoScroll(false)}
              rows={inputRows}
              autoFocus={autoFocus}
          />
                    {/*couldStop说明现在的状态是正在运行中，所以不能发送*/}
                    {/*{couldStop ? (*/}
                    {/*    <IconButton*/}
                    {/*        icon={<SendIcon/>}*/}
                    {/*        className={styles["chat-input-send-disabled"]}*/}
                    {/*        type="primary"*/}
                    {/*        disabled={true}*/}
                    {/*    />*/}
                    {/*) : (*/}
                    {/*    <IconButton*/}
                    {/*        icon={<SendIcon/>}*/}
                    {/*        className={styles["chat-input-send"]}*/}
                    {/*        type="primary"*/}
                    {/*        onClick={onUserSubmit}*/}
                    {/*        disabled={sendButtonDisabled} // 设置按钮是否禁用*/}
                    {/*    />*/}

                    {/*)}*/}
                    <IconButton
                        icon={<SendIcon/>}
                        className={styles["chat-input-send"]}
                        type="primary"
                        onClick={onUserSubmit}
                        disabled={sendButtonDisabled} // 设置按钮是否禁用
                    />
                </div>
            </div>
        </div>
    );
}
