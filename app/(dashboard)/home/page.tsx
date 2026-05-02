'use client';

import { useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useTasks } from '@/hooks/useTasks';
import { useChatTaskSync } from '@/hooks/useChatTaskSync';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';

export default function Home() {
  const { messages, status, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addLocalTask, tasks } = useTasks();

  useChatTaskSync(messages, tasks, addLocalTask);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isLoading = (status as string) === 'in_progress' || (status as string) === 'submitted' || (status as string) === 'streaming' || (status as string) === 'submitting';

  return (
    <div className={`flex flex-col h-full max-w-3xl mx-auto w-full p-4 md:p-8 transition-all duration-700 ${messages.length === 0 ? 'justify-center' : 'justify-end'}`}>
      
      <AnimatePresence>
        {messages.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex p-4 rounded-full bg-primary/10 mb-6"
            >
              <Sparkles className="w-10 h-10 text-primary" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-light text-text-primary mb-4 tracking-tight">
              Feeling overwhelmed?
            </h1>
            <p className="text-xl text-text-secondary font-light max-w-lg mx-auto leading-relaxed">
              Let's break your big task into something gentle and manageable. 
              <span className="block mt-2 opacity-60 text-sm">One tiny step at a time.</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`overflow-y-auto overflow-x-hidden rounded-3xl transition-all duration-700 ${messages.length === 0 ? 'h-0 opacity-0 mb-0' : 'flex-1 bg-surface/30 border border-surface/50 p-4 md:p-8 mb-6 relative'}`}>
        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((message) => {
              const msgAny = message as any;
              const toolInvocations = msgAny.toolInvocations || msgAny.parts?.filter((p:any) => p.type === 'tool-invocation')?.map((p:any) => p.toolInvocation);
              
              return (
                <div key={message.id}>
                  <ChatMessage 
                    role={msgAny.role} 
                    content={String(msgAny.content || '')} 
                  />
                  
                  {toolInvocations?.map((tool: any) => {
                    if (tool.toolName === 'createTask' && tool.args) {
                      const taskId = tool.toolCallId || 'temp-id';
                      return (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          key={tool.toolCallId}
                          className="mt-2 flex self-start"
                        >
                          <Link href={`/tasks/${taskId}`} className="group bg-primary/10 hover:bg-primary/20 border border-primary/20 px-6 py-4 rounded-3xl transition-all flex items-center gap-4">
                            <div className="bg-primary/20 p-2 rounded-full group-hover:scale-110 transition-transform">
                              <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="text-primary font-semibold text-sm">Gentle plan created!</span>
                              <span className="text-text-primary/70 text-xs">Click here to view your steps</span>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    }
                    return null;
                  })}
                </div>
              );
            })}
          </AnimatePresence>
          
          {isLoading && (messages[messages.length - 1] as any)?.role === 'user' && (
            <div className="flex justify-start">
               <div className="bg-surface px-5 py-4 rounded-3xl rounded-tl-sm flex gap-1">
                <div className="w-1.5 h-1.5 bg-text-secondary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-text-secondary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-text-secondary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput 
        onSend={(msg) => sendMessage({ role: 'user', content: msg } as any)}
        isLoading={isLoading}
      />

      <div className="text-center mt-4 text-xs text-text-secondary/60">
        Every little bit helps. You are doing great.
      </div>
    </div>
  );
}
