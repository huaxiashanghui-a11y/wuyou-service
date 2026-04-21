'use client';

import { useState, useRef, useEffect } from 'react';
import UserLayout from '@/components/user/UserLayout';
import {
  Send,
  MessageCircle,
  User,
  Bot,
  RefreshCw,
  Phone,
  Mail
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'service';
  content: string;
  time: string;
}

export default function ServicePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'service',
      content: '您好！欢迎来到无忧服务客服中心，请问有什么可以帮到您？',
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // 模拟客服回复
    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'service',
        content: '感谢您的咨询，您的问题我们已经收到，正在为您处理中...如有其他问题，请随时联系我们的在线客服。',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, replyMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">客服中心</h1>

        <div className="bg-[#252525] rounded-xl overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
          {/* 聊天头部 */}
          <div className="bg-[#1e1e1e] px-4 py-3 border-b border-[#333] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-white font-medium">在线客服</p>
                <p className="text-green-500 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  在线
                </p>
              </div>
            </div>
            <button className="p-2 text-[#ccc] hover:text-white hover:bg-[#333] rounded-lg transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {/* 消息区域 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100% - 140px)' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.type === 'service' && (
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-green-500" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                    msg.type === 'user'
                      ? 'bg-orange-500 text-white rounded-br-md'
                      : 'bg-[#333] text-white rounded-bl-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-xs mt-1 ${
                    msg.type === 'user' ? 'text-orange-200' : 'text-[#888]'
                  }`}>
                    {msg.time}
                  </p>
                </div>
                {msg.type === 'user' && (
                  <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-orange-500" />
                  </div>
                )}
              </div>
            ))}

            {/* 正在输入指示器 */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-green-500" />
                </div>
                <div className="bg-[#333] px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#888] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-[#888] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-[#888] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}

            {/* 空状态 */}
            {messages.length === 1 && !isTyping && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 bg-[#333] rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-10 h-10 text-[#666]" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">开始对话</h3>
                <p className="text-[#888] text-sm max-w-xs">
                  输入您的问题，我们的客服将尽快为您解答
                </p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div className="bg-[#1e1e1e] px-4 py-3 border-t border-[#333]">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入您的问题..."
                className="flex-1 py-3 px-4 bg-[#333] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={handleSend}
                disabled={!inputMessage.trim()}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  inputMessage.trim()
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-[#333] text-[#666] cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 联系方式 */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-[#252525] rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-white font-medium">电话客服</p>
              <p className="text-[#888] text-sm">400-888-8888</p>
            </div>
          </div>
          <div className="bg-[#252525] rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-white font-medium">邮箱联系</p>
              <p className="text-[#888] text-sm">support@wysz88.com</p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
