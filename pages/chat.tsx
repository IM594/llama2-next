import React, { useState, useEffect } from "react";
import { Card } from "antd";
import MessageList from "../components/MessageList";
import ChatInput from "../components/ChatInput";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    const eventSource = new EventSource("http://127.0.0.1:6006/v1/chat/completions");

    eventSource.onmessage = (event) => {
      const assistantMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [
        ...prevMessages,
        assistantMessage
      ]);
    };

    eventSource.onerror = (error) => {
      console.error("Error with EventSource:", error);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleSubmit = async () => {
    const userMessage = { role: "user", content: inputText };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText("");

    await fetch("http://127.0.0.1:6006/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userMessage)
    });
  };

  // 清空对话历史
  const handleClear = async () => {
    setMessages([]);
    await fetch("https://u212727-bf3c-ddcb5d53.beijinga.seetacloud.com/clear", {
      method: "POST",
    });
  };

  return (
    <Card title="Next Llama 2" style={{ width: "80%", height: "80%", margin: "auto" }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ flex: 3, padding: "10px" }}>
          <div style={{ overflowY: "auto" }}>
            <MessageList messages={messages} />
          </div>
          <br />
          <div style={{ height: "auto" }}>
            <ChatInput
              inputText={inputText}
              setInputText={setInputText}
              handleSubmit={handleSubmit}
              handleClear={handleClear}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Chat;
