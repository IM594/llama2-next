"use client"; // 如果是在 Pages Router 中使用，则不需要加这行

import Home from "../pages/home";
import Chat from "@/pages/chat";

export default async function App() {
  return (
    <>
      <Chat />
    </>
  );
}
