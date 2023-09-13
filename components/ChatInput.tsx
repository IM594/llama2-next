import React from 'react';
import { Input, Button } from 'antd';

function ChatInput({ inputText, setInputText, handleSubmit, handleClear }) {
  const handleKeyPress = (e) => {
    // 如果用户按下回车键（键码为 13），触发发送消息操作
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div style={{ height: '30%', display: 'flex', alignItems: 'center' }}>
      <Input
        style={{ flex: '1' }} // 让输入框占满可用空间
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type your message..."
        onKeyPress={handleKeyPress} // 监听键盘事件
      />
      
      <Button type="primary" onClick={handleSubmit}>Send</Button>
      <Button onClick={handleClear}>Clear</Button>
    </div>
  );
}

export default ChatInput;
