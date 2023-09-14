import * as React from "react";

import styles from "./button.module.scss";

/**
 * IconButton 组件是一个带有图标和文本的按钮。
 *
 * @param {Object} props - 组件属性
 * @param {function} props.onClick - 按钮点击时的回调函数
 * @param {JSX.Element} props.icon - 按钮上的图标元素
 * @param {string} props.text - 按钮上的文本
 * @param {boolean} props.bordered - 是否带边框样式
 * @param {string} props.className - 自定义 CSS 类名
 * @param {string} props.title - 按钮的标题提示文本
 * @returns {JSX.Element} 渲染的 IconButton 组件
 */
export function IconButton(props: {
  onClick?: () => void;
  icon: JSX.Element;
  text?: string;
  bordered?: boolean;
  className?: string;
  title?: string;
}) {
  return (
    <div
      className={
        // 根据传入的属性动态设置 CSS 类名
        styles["icon-button"] +
        ` ${props.bordered && styles.border} ${props.className ?? ""}`
      }
      onClick={props.onClick}
      title={props.title}
    >
      <div className={styles["icon-button-icon"]}>{props.icon}</div>
      {props.text && (
        <div className={styles["icon-button-text"]}>{props.text}</div>
      )}
    </div>
  );
}
