"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import Image from 'next/image';
import { useUser } from "@/contexts/UserContext";

const groq = createGroq({
  apiKey: "", // Setup your API key here
});

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AiChatPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streamingMessage, setStreamingMessage] = useState<string>("");

  // Check authentication and load chat history
  useEffect(() => {
    if (loading) return;
    
    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }

    // Load chat history from sessionStorage for this user
    const chatKey = `ai-chat-${user.id}`;
    const savedMessages = sessionStorage.getItem(chatKey);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, [user, isAuthenticated, loading, router]);

  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    if (user && messages.length > 0) {
      const chatKey = `ai-chat-${user.id}`;
      sessionStorage.setItem(chatKey, JSON.stringify(messages));
    }
  }, [messages, user]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setStreamingMessage("");

    try {
      // Build conversation history for context
      const conversationHistory = [...messages, userMessage]
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');

      const systemPrompt = `You are an English teacher AI assistant. Your purpose is to help users learn and improve their English language skills. You can:
- Answer questions about English grammar, vocabulary, and usage
- Explain English concepts and rules
- Help with pronunciation and spelling
- Provide examples and practice exercises
- Correct mistakes and offer suggestions
- Discuss English literature and culture
- Your name is Vodka, you are the mascot of the app.

You should politely decline requests that are not related to English language learning and redirect the conversation back to English education topics.`;

      const fullPrompt = `${systemPrompt}\n\nConversation:\n${conversationHistory}\n\nAssistant:`;

      const result = streamText({
        model: groq('llama-3.1-8b-instant'),
        prompt: fullPrompt,
      });

      let fullResponse = '';
      // Stream the response character by character
      for await (const textPart of result.textStream) {
        fullResponse += textPart;
        setStreamingMessage(fullResponse);
      }

      const assistantMessage: Message = { role: 'assistant', content: fullResponse };
      setMessages(prev => [...prev, assistantMessage]);
      setStreamingMessage("");
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
      setStreamingMessage("");
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, isLoading]);

  const handleClearChat = useCallback(() => {
    if (user) {
      const chatKey = `ai-chat-${user.id}`;
      sessionStorage.removeItem(chatKey);
      setMessages([]);
    }
  }, [user]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Redirecting to login...</p>
      </div>
    );
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--dark-purple)' }}>English Learning AI Chat</h1>
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="text-sm text-red-500 hover:text-red-700 underline transition"
          >
            Clear Chat
          </button>
        )}
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 rounded-3xl p-6 shadow-inner min-h-[600px]" style={{ background: 'var(--lightest-purple)' }}>
        {messages.length === 0 ? (
          <div className="text-center mt-16" style={{ color: 'var(--medium-grey)' }}>
            <div className="mb-4 flex justify-center">
              <Image src="/vodka-for-ai.png" alt="AI Assistant" width={80} height={80} />
            </div>
            <p className="text-xl font-semibold" style={{ color: 'var(--not-black-black)' }}>Welcome to your English Learning Assistant!</p>
            <p className="mt-2" style={{ color: 'var(--medium-grey)' }}>Ask me anything about English grammar, vocabulary, or practice your English skills.</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden mb-1">
                  <Image src="/vodka-for-ai.png" alt="AI" width={32} height={32} className="object-cover" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-3xl p-4 shadow-md ${
                  message.role === 'user'
                    ? ''
                    : 'bg-white'
                }`}
                style={message.role === 'user' ? { 
                  background: 'var(--dark-purple)', 
                  color: 'white' 
                } : {
                  border: '1px solid var(--medium-purple)'
                }}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm mb-1" style={{ background: 'var(--medium-grey)' }}>
                  👤
                </div>
              )}
            </div>
          ))
        )}
        {/* Streaming message */}
        {streamingMessage && (
          <div className="flex justify-start items-end gap-2">
            <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden mb-1">
              <Image src="/vodka-for-ai.png" alt="AI" width={32} height={32} className="object-cover" />
            </div>
            <div className="max-w-[75%] bg-white rounded-3xl p-4 shadow-md" style={{ border: '1px solid var(--medium-purple)' }}>
              <p className="whitespace-pre-wrap leading-relaxed">{streamingMessage}</p>
              <span className="inline-block w-2 h-4 ml-1 animate-pulse" style={{ background: 'var(--dark-purple)' }}></span>
            </div>
          </div>
        )}
        {/* Loading dots */}
        {isLoading && !streamingMessage && (
          <div className="flex justify-start items-end gap-2">
            <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden mb-1">
              <Image src="/vodka-for-ai.png" alt="AI" width={32} height={32} className="object-cover" />
            </div>
            <div className="bg-white rounded-3xl p-4 shadow-md" style={{ border: '1px solid var(--medium-purple)' }}>
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--medium-grey)', animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--medium-grey)', animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--medium-grey)', animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          disabled={isLoading}
          rows={3}
          className="flex-1 bg-white rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 disabled:bg-gray-100 resize-none shadow-sm"
          style={{ 
            border: '2px solid var(--medium-purple)',
            '--tw-ring-color': 'var(--dark-purple)'
          } as React.CSSProperties}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="text-white px-8 py-3 rounded-2xl transition-all shadow-md font-semibold disabled:cursor-not-allowed"
          style={{
            background: isLoading || !input.trim() ? 'var(--medium-grey)' : 'var(--dark-purple)',
          }}
          onMouseEnter={(e) => {
            if (!isLoading && input.trim()) {
              e.currentTarget.style.opacity = '0.9';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
