'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useTasks } from '@/hooks/useTasks';

export default function Home() {
  const { messages, status, stop, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addLocalTask, tasks } = useTasks();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      if (sendMessage) sendMessage({ role: 'user', content: input } as any);
    } catch {}
    setInput('');
  };

  const isLoading = (status as string) === 'in_progress' || (status as string) === 'submitted' || (status as string) === 'streaming' || (status as string) === 'submitting';

  // Sync tools that returned results into our local state
  useEffect(() => {
    const lastMessage = messages[messages.length - 1] as any;
    const toolInvocations = lastMessage?.toolInvocations || lastMessage?.parts?.filter((p:any) => p.type === 'tool-invocation')?.map((p:any) => p.toolInvocation);
    if (toolInvocations) {
      toolInvocations.forEach((tool: any) => {
        if (tool.toolName === 'createTask' && tool.args) {
          const { taskTitle, steps } = tool.args;
          // Generate an ID based on hash or just use the toolCallId
          const taskId = tool.toolCallId || 'temp-id'; 
          
          if (!tasks.find(t => t.id === taskId)) {
            const stepsData = steps.map((stepTitle: string, idx: number) => ({
              id: `${taskId}-s-${idx}`,
              task_id: taskId,
              parent_step_id: null,
              title: stepTitle,
              is_completed: false,
              order_index: idx,
              created_at: new Date().toISOString()
            }));

            addLocalTask({
              id: taskId,
              user_id: 'anonymous',
              title: taskTitle,
              is_completed: false,
              progress_percentage: 0,
              created_at: new Date().toISOString(),
              steps: stepsData
            });
          }
        }
      });
    }
  }, [messages, tasks, addLocalTask]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={`flex flex-col h-full max-w-3xl mx-auto w-full p-4 md:p-8 transition-all duration-700 ${messages.length === 0 ? 'justify-center' : 'justify-end'}`}>
      
      {/* Hero Header - only visible when no messages */}
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
              const ToolInvocations = msgAny.toolInvocations || msgAny.parts?.filter((p:any) => p.type === 'tool-invocation')?.map((p:any) => p.toolInvocation);
              return (
                 <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msgAny.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msgAny.role === 'assistant' ? (
                    <div className="flex flex-col gap-2 max-w-[85%]">
                      <div className="bg-surface text-text-primary px-5 py-4 rounded-3xl rounded-tl-sm text-[15px] leading-relaxed shadow-sm">
                        {String(msgAny.content || '').split('\n').map((line, i) => (
                          <span key={i}>{line}<br /></span>
                        ))}
                      </div>
                      
                      {ToolInvocations?.map((tool: any) => {
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
                                <div className="flex flex-col">
                                  <span className="text-primary font-semibold text-sm">Gentle plan created!</span>
                                  <span className="text-text-primary/70 text-xs">Click here to view your steps</span>
                                </div>
                              </Link>
                            </motion.div>
                          );
                        } else if (tool.toolName === 'createTask') {
                          return (
                             <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              key={tool.toolCallId}
                              className="mt-2 p-4 bg-surface rounded-3xl flex items-center gap-3 text-text-secondary text-sm"
                             >
                              <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                              Creating your gentle plan...
                             </motion.div>
                          )
                        }
                      })}
                    </div>
                  ) : (
                    <div className="bg-primary text-background px-5 py-4 rounded-3xl rounded-tr-sm text-[15px] leading-relaxed shadow-sm max-w-[85%]">
                      {String(msgAny.content || '')}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
          {isLoading && (messages[messages.length - 1] as any)?.role === 'user' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start text-text-secondary w-full"
            >
              <div className="bg-surface px-5 py-4 rounded-3xl rounded-tl-sm flex gap-1">
                <div className="w-1.5 h-1.5 bg-text-secondary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-text-secondary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-text-secondary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative bg-surface rounded-full shadow-lg border border-text-secondary/10 flex items-center pr-2 pl-6 py-2"
      >
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="I need to..."
          className="flex-1 bg-transparent border-none focus:outline-none text-text-primary placeholder:text-text-secondary/50 py-3 text-[15px]"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-primary hover:bg-primary/90 text-background p-3 rounded-full transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          <Send className="w-5 h-5 ml-0.5" />
        </button>
      </form>
      <div className="text-center mt-4 text-xs text-text-secondary/60">
        Every little bit helps. You are doing great.
      </div>
    </div>
  );
}
