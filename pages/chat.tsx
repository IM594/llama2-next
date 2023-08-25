import React, { useState } from 'react';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const handleSubmit = async () => {
    // 发送用户输入的消息到后端接口
    const response = await fetch('https://u212727-bf3c-ddcb5d53.beijinga.seetacloud.com/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: inputText },
        ],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      // 提取助手生成的回复内容
      const assistantMessage = data.choices[0].message.content;
      // 更新消息列表
      setMessages([...messages, { role: 'user', content: inputText }, { role: 'assistant', content: assistantMessage }]);
      setInputText('');
    }
  };

  // 清空对话历史
  const handleClear = async () => {
    // 清空前端消息列表
    setMessages([]);
    // 调用后端清空对话接口
    await fetch('https://u212727-bf3c-ddcb5d53.beijinga.seetacloud.com/clear', {
      method: 'POST',
    });
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              padding: '8px',
              borderRadius: '8px',
              margin: '4px',
              backgroundColor: message.role === 'user' ? '#E0E0E0' : '#66BB6A',
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSubmit}>Send</button>
        <button onClick={handleClear}>Clear</button> {/* 添加清空按钮 */}
      </div>
    </div>
  );
}

export default Chat;
