'use client';

import React from 'react';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, Phone, MoreVertical, Send, Paperclip } from 'lucide-react';

interface ChatContact {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isOnline: boolean;
  unreadCount: number;
}

interface Message {
  id: number;
  sender: 'user' | 'contact';
  text: string;
  timestamp: string;
}

interface MobileChatViewProps {
  chat: ChatContact;
  onBack: () => void;
}

const MobileChatView = ({ chat, onBack }: MobileChatViewProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'contact',
      text: 'Hey, how are you doing?',
      timestamp: '10:30 AM',
    },
    {
      id: 2,
      sender: 'user',
      text: "I'm doing great! Just finished the project.",
      timestamp: '10:31 AM',
    },
    {
      id: 3,
      sender: 'contact',
      text: 'That sounds amazing! When can we review it?',
      timestamp: '10:32 AM',
    },
    {
      id: 4,
      sender: 'user',
      text: 'How about tomorrow at 2 PM?',
      timestamp: '10:33 AM',
    },
    {
      id: 5,
      sender: 'contact',
      text: 'Perfect! See you then. Thanks for your help!',
      timestamp: '10:34 AM',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }, 0);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: 'user',
        text: inputMessage,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages([...messages, newMessage]);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col bg-white h-full w-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-900" />
          </button>

          <div className="relative">
            <Image
              src={chat.avatar || '/placeholder.svg'}
              alt={chat.name}
              width={40}
              height={40}
              className="rounded-full w-10 h-10 object-cover"
            />
            {chat.isOnline && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 text-sm">{chat.name}</h2>
            <p className="text-xs text-gray-500">{chat.isOnline ? 'Active now' : 'Inactive'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Phone size={18} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
              }`}
            >
              <p className="text-sm break-words">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-4 py-3 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <button className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
            <Paperclip size={18} className="text-gray-600" />
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message..."
            className="flex-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
          />

          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} className={inputMessage.trim() ? 'text-blue-600' : 'text-gray-400'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileChatView;
