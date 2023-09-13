import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

const MarkdownEditor = ({ markdownText }) => {
  const renderers = {
    code: ({ language, value }) => {
      // 使用 react-syntax-highlighter 渲染代码块
      return <SyntaxHighlighter language={language}>{value}</SyntaxHighlighter>;
    },
  };

  return (
    <div className="markdown-editor">
      <ReactMarkdown renderers={renderers} children={markdownText} />
    </div>
  );
};

export default MarkdownEditor;
