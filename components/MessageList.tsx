// MessageList.js
import React from 'react';
import Message from './Message';

function MessageList({ messages, setMarkdownText }) {
  return (
    <div style={{ maxHeight: '450px', overflowY: 'auto' }}> {/* 设置最大高度并添加滚动 */}
      {messages.map((message, index) => (
        <div key={index} style={{ marginBottom: '8px' }}>
          <Message
            message={message}
            setMarkdownText={setMarkdownText}
            alignRight={message.role === 'user'}
          />
        </div>
      ))}
    </div>
  );
}

export default MessageList;
