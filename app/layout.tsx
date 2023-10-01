/* eslint-disable @next/next/no-page-custom-font */
import "./styles/globals.scss"; // 导入全局样式文件
import "./styles/markdown.scss"; // 导入 Markdown 样式文件
// import "./styles/prism.scss"; // 导入 Prism 代码高亮样式文件
import "./styles/highlight.scss";
import process from "child_process";
// import { ACCESS_CODES } from "./api/access";
import { Analytics } from "@vercel/analytics/react";


// 注意：下面这行代码尚未解开注释，如果需要启用，请取消注释。
// const COMMIT_ID = process
//   .execSync("git rev-parse --short HEAD")
//   .toString()
//   .trim();

// 定义元数据对象，包括标题和描述
export const metadata = {
  title: "Next Llama 2", // 网站标题
  description: "CS51-1", // 网站描述
};

// Meta 组件用于生成 HTML 页面的元数据
// function Meta() {
//   const metas = {
//     // 注意：下面这行代码尚未解开注释，如果需要启用，请取消注释。
//     // version: COMMIT_ID, // Git 提交版本信息
//     access: ACCESS_CODES.size > 0 ? "enabled" : "disabled", // 访问控制状态
//   };

//   return (
//     <>
//       {Object.entries(metas).map(([k, v]) => (
//         <meta name={k} content={v} key={k} />
//       ))}
//     </>
//   );
// }

// RootLayout 组件是整个页面的根布局，包含了页面的头部和子组件。
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        />
        {/* 渲染 Meta 组件以生成页面元数据 */}
        {/* <Meta />  */}
        <link rel="manifest" href="/site.webmanifest"></link> {/* Web App 清单 */}
        <link rel="preconnect" href="https://fonts.googleapis.com"></link> {/* 预连接到 Google 字体服务器 */}
        <link rel="preconnect" href="https://fonts.gstatic.com"></link> {/* 预连接到 Google 字体服务器 */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;700;900&display=swap"
          rel="stylesheet"
        ></link> {/* 导入 Google 字体样式表 */}
      </head>
      <body>{children}</body> {/* 渲染子组件 */}
      <Analytics />
    </html>
  );
}
