import styles from "./ui-lib.module.scss";
import LoadingIcon from "../icons/three-dots.svg";
import CloseIcon from "../icons/close.svg";
import { createRoot } from "react-dom/client";
import React, { ReactNode } from "react";

// Popover 组件用于显示一个弹出窗口，包含触发器和内容。
export function Popover(props: {
  children: ReactNode;
  content: ReactNode;
  open?: boolean;
  onClose?: () => void;
}) {
  return (
    <div className={styles.popover}>
      {props.children}
      {props.open && (
        <div className={styles["popover-content"]}>
          <div className={styles["popover-mask"]} onClick={props.onClose}></div>
          {props.content}
        </div>
      )}
    </div>
  );
}

// Card 组件用于渲染一个卡片容器，可以包含子元素。
export function Card(props: { children: ReactNode[]; className?: string }) {
  return (
    <div className={styles.card + " " + props.className}>
      {props.children}
    </div>
  );
}

// ListItem 组件用于渲染一个列表项容器，可以包含最多两个子元素。
export function ListItem(props: { children: ReactNode[] }) {
  if (React.Children.count(props.children) > 2) {
    throw new Error("Only Support Two Children");
  }

  return <div className={styles["list-item"]}>{props.children}</div>;
}

// List 组件用于渲染一个列表容器，可以包含多个子元素。
export function List(props: { children: ReactNode[] }) {
  return <div className={styles.list}>{props.children}</div>;
}

// Loading 组件用于显示加载中的状态，通常在数据加载时使用。
export function Loading() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoadingIcon />
    </div>
  );
}

// ModalProps 接口定义了 Modal 组件的属性。
interface ModalProps {
  title: string;
  children?: ReactNode;
  actions?: ReactNode[];
  onClose?: () => void;
}

// Modal 组件用于显示一个模态框弹窗，包含标题、内容和操作按钮。
export function Modal(props: ModalProps) {
  return (
    <div className={styles["modal-container"]}>
      <div className={styles["modal-header"]}>
        <div className={styles["modal-title"]}>{props.title}</div>

        <div className={styles["modal-close-btn"]} onClick={props.onClose}>
          <CloseIcon />
        </div>
      </div>

      <div className={styles["modal-content"]}>{props.children}</div>

      <div className={styles["modal-footer"]}>
        <div className={styles["modal-actions"]}>
          {props.actions?.map((action, i) => (
            <div key={i} className={styles["modal-action"]}>
              {action}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// showModal 函数用于在页面上显示一个模态框弹窗。
export function showModal(props: ModalProps) {
  const div = document.createElement("div");
  div.className = "modal-mask";
  document.body.appendChild(div);

  const root = createRoot(div);
  const closeModal = () => {
    props.onClose?.();
    root.unmount();
    div.remove();
  };

  div.onclick = (e) => {
    if (e.target === div) {
      closeModal();
    }
  };

  root.render(<Modal {...props} onClose={closeModal}></Modal>);
}

// ToastProps 接口定义了 Toast 组件的属性。
export interface ToastProps {
  content: string;
}

// Toast 组件用于显示一个简短的提示消息。
export function Toast(props: ToastProps) {
  return (
    <div className={styles["toast-container"]}>
      <div className={styles["toast-content"]}>{props.content}</div>
    </div>
  );
}

// showToast 函数用于在页面上显示一个提示消息。
export function showToast(content: string, delay = 3000) {
  const div = document.createElement("div");
  div.className = styles.show;
  document.body.appendChild(div);

  const root = createRoot(div);
  const close = () => {
    div.classList.add(styles.hide);

    setTimeout(() => {
      root.unmount();
      div.remove();
    }, 300);
  };

  setTimeout(() => {
    close();
  }, delay);

  root.render(<Toast content={content} />);
}
