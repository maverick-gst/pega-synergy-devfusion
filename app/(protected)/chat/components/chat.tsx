'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mic, Send, Paperclip, Loader2, User, Bot, Search } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type ChatProps = {
  productId: string;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
};

const CodeBlock: React.FC<{ language: string; children: React.ReactNode }> = ({ language, children }) => {
  return (
    <SyntaxHighlighter
      style={solarizedlight as any}
      language={language}
      PreTag="div"
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  );
};

export default function Chat({ productId, messages, isLoading, onSendMessage }: ChatProps) {
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    onSendMessage(chatInput);
    setChatInput('');
  };

  const handleVoiceInput = () => {
    toast.error('Voice input feature coming soon!');
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast.success(`File "${file.name}" selected. Upload feature coming soon!`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden border border-blue-200">
      <div className="bg-gradient-to-r from-blue-800 to-indigo-800 text-white p-4">
        <h2 className="text-2xl font-bold font-merriweather">AI Assistant for {productId}</h2>
      </div>
      <div className="flex-grow overflow-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`flex max-w-[80%] ${message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${message.role === 'assistant' ? 'bg-blue-500 text-white' : 'bg-indigo-400 text-indigo-800'} mr-2`}>
                  {message.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className={`p-3 rounded-lg ${message.role === 'assistant' ? 'bg-blue-50 text-blue-800' : 'bg-indigo-100 text-indigo-800'}`}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({node, ...props}) => <p className="mb-2" {...props} />,
                      h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-2" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-2" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-2" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2" {...props} />,
                      li: ({node, ...props}) => <li className="mb-1" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-2" {...props} />,
                      a: ({node, ...props}) => <a className="text-blue-500 hover:underline" {...props} />,
                      table: ({node, ...props}) => <table className="border-collapse border border-gray-300 mb-2" {...props} />,
                      th: ({node, ...props}) => <th className="border border-gray-300 px-4 py-2 bg-gray-100" {...props} />,
                      td: ({node, ...props}) => <td className="border border-gray-300 px-4 py-2" {...props} />,
                      code({node, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '');
                        return match ? (
                          <CodeBlock language={match[1]}>
                            {String(children).replace(/\n$/, '')}
                          </CodeBlock>
                        ) : (
                          <code className="bg-gray-100 rounded px-1" {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                    className="prose max-w-none"
                  >
                    {message.content}
                  </ReactMarkdown>
                  <div className={`text-xs mt-1 ${message.role === 'assistant' ? 'text-blue-500' : 'text-indigo-500'}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="flex justify-start"
          >
            <div className="flex max-w-[80%] flex-row">
              <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-blue-500 text-white mr-2">
                <Bot size={20} />
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-blue-800">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>AI is thinking...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="p-4 bg-gray-50 border-t border-blue-200">
        <div className="flex items-center space-x-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              className="w-full pl-10 pr-4 py-2 rounded-full border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
              placeholder="Type your message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleChatSubmit()}
              disabled={isLoading}
            />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={onFileChange}
          />
          <Button onClick={handleFileUpload} className="rounded-full bg-white text-blue-700 border border-blue-300 hover:bg-blue-50 transition-colors duration-300" disabled={isLoading}>
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button onClick={handleVoiceInput} className="rounded-full bg-white text-blue-700 border border-blue-300 hover:bg-blue-50 transition-colors duration-300" disabled={isLoading}>
            <Mic className="h-4 w-4" />
          </Button>
          <Button onClick={handleChatSubmit} className="rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
