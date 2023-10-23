import DeleteIcon from "../icons/delete.svg";
import BotIcon from "../icons/bot.svg";

import styles from "./home.module.scss";
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";

import { useChatStore } from "../store";

import Locale from "../locales";
import { Link, useNavigate } from "react-router-dom";
import { Path } from "../constant";
// import { MaskAvatar } from "./mask";
import { Mask } from "../store/mask";
import {func} from "prop-types";

export function ChatItem(props: {
    onClick?: () => void;
    onDelete?: () => void;
    title: string;
    count: number;
    createTime: string;
    lastMessageTime: string;
    selected: boolean;
    id: number;
    index: number;
    narrow?: boolean;
    mask: Mask;
}) {
    const formatTime = (dateString: string) => {
        const today = new Date();
        const date = new Date(dateString);

        if (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        ) {
            return `Today ${date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
            })}`;
        } else {
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);

            if (
                date.getDate() === yesterday.getDate() &&
                date.getMonth() === yesterday.getMonth() &&
                date.getFullYear() === yesterday.getFullYear()
            ) {
                return `Yesterday ${date.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                })}`;
            } else {
                return date.toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                });
            }
        }
    };

    return (
        <Draggable draggableId={`${props.id}`} index={props.index}>
            {(provided) => (
                <div
                    className={`${styles["chat-item"]} ${
                        props.selected && styles["chat-item-selected"]
                    }`}
                    onClick={props.onClick}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    title={`${props.title}\n${Locale.ChatItem.ChatItemCount(
                        props.count
                    )}`}
                >
                    {props.narrow ? (
                        <div className={styles["chat-item-narrow"]}>
                            <div className={styles["chat-item-narrow-count"]}>
                                {props.count}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={styles["chat-item-title"]}>{props.title}</div>
                            <div className={styles["chat-item-info"]}>
                                <div className={styles["chat-item-date"]}>
                                    {formatTime(props.createTime)}
                                </div>
                                <div className={styles["chat-item-count"]}>
                                    {Locale.ChatItem.ChatItemCount(props.count)}
                                </div>
                            </div>
                        </>
                    )
                    }

                    <div
                        className={styles["chat-item-delete"]}
                        onClickCapture={props.onDelete}
                    >
                        <DeleteIcon />
                    </div>
                </div>
            )}
        </Draggable>
    );
}

export function ChatList(props: { narrow?: boolean }) {
  const [sessions, selectedIndex, selectSession, moveSession] = useChatStore(
    (state) => [
      state.sessions,
      state.currentSessionIndex,
      state.selectSession,
      state.moveSession,
    ],
  );
  const chatStore = useChatStore();
  const navigate = useNavigate();

  const onDragEnd: OnDragEndResponder = (result) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    moveSession(source.index, destination.index);
  };

  // function isValidDate(dateString: string | number | Date) {
  //   const date = new Date(dateString);
  //   console.log("date: ", date);
  //   console.log("dateString: ", dateString);
  //   console.log("date.getTime(): ", date.getTime());
  //   console.log("isNaN(date.getTime()): ", isNaN(date.getTime()));
  //   return !isNaN(date.getTime());
  // }

  // 判断item中是否有createTime
    function hasCreateTime() {
        for (let i = 0; i < sessions.length; i++) {
            if (sessions[i].createTime) {
            return true;
            }
        }
        return false;
    }





  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chat-list">
        {(provided) => (
          <div
            className={styles["chat-list"]}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {sessions.map((item, i) => (
              <ChatItem
                title={item.topic}
                // time={hasCreateTime()? new Date(item.createTime).toLocaleString("en-US", {timeZone: "Australia/Sydney"}) : new Date(item.lastUpdate).toLocaleString("en-US", {timeZone: "Australia/Sydney"})}
                createTime={new Date(item.createTime).toLocaleString("en-US", {timeZone: "Australia/Sydney"})}
                lastMessageTime={new Date(item.lastUpdate).toLocaleString("en-US", {timeZone: "Australia/Sydney"})}
                count={item.messages.length}
                key={item.id}
                id={item.id}
                index={i}
                selected={i === selectedIndex}
                onClick={() => {
                  navigate(Path.Chat);
                  selectSession(i);
                }}
                onDelete={() => {
                  if (!props.narrow || confirm(Locale.Home.DeleteChat)) {
                    chatStore.deleteSession(i);
                  }
                }}
                narrow={props.narrow}
                mask={item.mask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
