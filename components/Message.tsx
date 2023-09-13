// Message.js
import React from 'react';
import MarkdownEditor from './MarkdownEditor';

function Message({ message, setMarkdownText, alignRight }) {
  const messageStyle = {
    padding: '1%', // 添加内边距
    borderRadius: '8px',
    backgroundColor: message.role === 'user' ? '#E0E0E0' : '#66BB6A',
    alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
    textAlign: alignRight ? 'right' : 'left',
    width: '98%',
  };

  const textContainerStyle = {
    display: 'inline-block',
    marginLeft: alignRight ? 'auto' : '0',
    marginRight: alignRight ? '0' : 'auto',
  };

  return (
    <div style={messageStyle}>
      <div style={textContainerStyle}>
        {message.role === 'assistant' ? (
          <>
            <MarkdownEditor markdownText={message.content} />
            {/* Set Markdown text when needed */}
            {setMarkdownText && setMarkdownText(message.content)}
          </>
        ) : (
          message.content
        )}
      </div>
    </div>
  );
}

export default Message;
