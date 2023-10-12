/* eslint-disable @next/next/no-page-custom-font */
// 禁用 Next.js 的自定义字体页面警告

// 导入样式文件
import "./styles/globals.scss";
import "./styles/markdown.scss";
import "./styles/highlight.scss";

// 网站的元数据
export const metadata = {
  title: "Next Llama 2", // 网站标题
  description: "CS51-1", // 网站描述
  appleWebApp: {
    title: "Next Llama 2",
    statusBarStyle: "default",
  },
  themeColor: "#fafafa", // 主题颜色
};

// 根布局组件
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* 设置视口 */}
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        />
        {/* 设置主题颜色 */}
        <meta
          name="theme-color"
          content="#151515"
          media="(prefers-color-scheme: dark)"
        />
        {/* 链接到 web manifest 文件 */}
        <link rel="manifest" href="/site.webmanifest"></link>
        {/* 预连接到 Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        {/* 引入自定义字体 */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;700;900&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body>{children}</body>
    </html>
  );
}
