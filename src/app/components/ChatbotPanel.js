// src/components/ChatbotPanel.js

// Enhanced ChatbotPanel.js with unified design

'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../lib/auth/AuthProvider';
import { useAuthModal } from '../contexts/AuthModalContext';
import { useChatStore } from '../../stores/chatStore';
import ReactMarkdown from 'react-markdown';
import { createClient } from '../../lib/supabase/client';

export default function ChatbotPanel({ isMobile = false }) {
  const { user, loading, signOut } = useAuth();
  const { openModal } = useAuthModal();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    addMessage,
    incrementMessageCount,
    setCurrentUser,
    copyGuestToUser,
    setPendingQuestion,
    getPendingQuestion,
    clearPendingQuestion
  } = useChatStore();

  const conversation = useChatStore((state) => {
    const currentConversation = state.conversations[state.currentUserId];
    if (!currentConversation) {
      // Return a default structure if the conversation for the current user doesn't exist yet
      return { messages: [], messageCount: 0 };
    }
    return currentConversation;
  });

  const { messages: msgs, messageCount } = conversation;

  // Helper function to get user's first name
  const getUserFirstName = (user) => {
    if (!user) return '';
    
    // Try to get name from user metadata (Google OAuth typically stores this)
    if (user.user_metadata) {
      if (user.user_metadata.first_name) {
        return user.user_metadata.first_name;
      }
      if (user.user_metadata.full_name) {
        return user.user_metadata.full_name.split(' ')[0];
      }
      if (user.user_metadata.name) {
        return user.user_metadata.name.split(' ')[0];
      }
    }
    
    // Fallback: extract first name from email
    if (user.email) {
      const emailPrefix = user.email.split('@')[0];
      // If email has dots, take first part; otherwise take first 10 chars
      return emailPrefix.includes('.') 
        ? emailPrefix.split('.')[0] 
        : emailPrefix.substring(0, 10);
    }
    
    return user.email || 'User';
  };

  const [input, setInput] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);
  const [highlightedQuestions, setHighlightedQuestions] = useState(new Set());
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const textareaRef = useRef(null);
  
  // Handle hydration to prevent SSR/client mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  
  // Animate preset questions with breathing highlights
  useEffect(() => {
    const animateQuestions = () => {
      const totalQuestions = presetQuestions.length;
      const numHighlighted = 1; // Number of questions to highlight at once
      
      // Create a wave effect by highlighting different questions
      const startIndex = Math.floor(Math.random() * totalQuestions);
      const highlighted = new Set();
      
      for (let i = 0; i < numHighlighted; i++) {
        highlighted.add((startIndex + i) % totalQuestions);
      }
      
      setHighlightedQuestions(highlighted);
    };

    // Initial animation
    animateQuestions();
    
    // Continue animating every 3 seconds
    const interval = setInterval(animateQuestions, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const presetQuestions = [
    "What are OZs?",
    "What are QOFs?",
    "Tax benefits explained",
    "Best performing states",
    "How to invest in OZs",
    "2025 market outlook"
  ];
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [msgs]);

  // Handle user auth state changes
  useEffect(() => {
    if (user) {
      const state = useChatStore.getState();
      const userHasConversation = state.conversations[user.id];
      const guestConversation = state.conversations.guest;
      
      const hasGuestContent = guestConversation && guestConversation.messages.length > 1;
      
      if (!userHasConversation && hasGuestContent) {
        copyGuestToUser(user.id);
      } else {
        setCurrentUser(user.id);
      }
      
      const pendingQuestion = getPendingQuestion();
      if (pendingQuestion) {
        handleSend(null, pendingQuestion);
        clearPendingQuestion();
        setInput(''); // Clear the input field after sending pending question
        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = isMobile ? '44px' : '48px';
        }
      }
    }
  }, [user]);

  const handlePresetClick = (question) => {
    handleSend(null, question);
  };

  // Replace generateBotResponse with an async API call
  const generateBotResponse = async (messageText) => {
    // Add a loading message with proper ID
    const loadingMsg = { 
      text: 'Ozzie is thinking...', 
      sender: 'bot', 
      isLoading: true,
      id: crypto?.randomUUID ? crypto.randomUUID() : `loading-${Date.now()}-${Math.random()}`
    };
    addMessage(loadingMsg);

    // Prepare payload
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    let userId;
    if (authUser) {
      userId = authUser.id;
    } else {
      let guestId = sessionStorage.getItem('guestUserId');
      if (!guestId) {
        guestId = crypto.randomUUID();
        sessionStorage.setItem('guestUserId', guestId);
      }
      userId = guestId;
    }
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, message: messageText })
      });
      
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        console.error('API error response:', data);
        throw new Error(data.error || `HTTP error! status: ${res.status}`);
      }
      
      // Remove the loading message and add the actual response
      // We need to remove the loading message first, then add the real response
      const currentConversation = useChatStore.getState().conversations[useChatStore.getState().currentUserId];
      const messagesWithoutLoading = currentConversation.messages.filter(msg => !msg.isLoading);
      
      // Create the response message with a proper ID
      const responseMessage = {
        text: data.response,
        sender: 'bot',
        id: crypto?.randomUUID ? crypto.randomUUID() : `msg-${Date.now()}-${Math.random()}`
      };
      
      // Update the store with messages without loading, then add the response
      useChatStore.setState((state) => ({
        conversations: {
          ...state.conversations,
          [state.currentUserId]: {
            ...state.conversations[state.currentUserId],
            messages: [...messagesWithoutLoading, responseMessage]
          }
        }
      }));
      
    } catch (err) {
      console.error('Ozzie chat error:', err);
      
      // Remove loading message and add error message
      const currentConversation = useChatStore.getState().conversations[useChatStore.getState().currentUserId];
      const messagesWithoutLoading = currentConversation.messages.filter(msg => !msg.isLoading);
      
      // Determine error message based on error type
      let errorText = 'Sorry, Ozzie is having trouble responding right now. Please try again later.';
      
      // Handle network errors on mobile
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorText = 'Network connection issue. Please check your internet connection and try again.';
      } else if (err.message && typeof err.message === 'string') {
        // Use the custom error message from our API
        errorText = err.message;
      }
      
      // Create the error message with a proper ID
      const errorMessage = {
        text: errorText,
        sender: 'bot',
        id: crypto?.randomUUID ? crypto.randomUUID() : `msg-${Date.now()}-${Math.random()}`
      };
      
      useChatStore.setState((state) => ({
        conversations: {
          ...state.conversations,
          [state.currentUserId]: {
            ...state.conversations[state.currentUserId],
            messages: [...messagesWithoutLoading, errorMessage]
          }
        }
      }));
    }
  };

  const handleSend = (e, presetQuestion = null) => {
    if (e) e.preventDefault();
    const question = presetQuestion || input.trim();
    if (!question) return;

    if (!user && messageCount >= 1) {
      setPendingQuestion(question);
      openModal({
        title: 'Unlock the full conversation',
        description: 'Sign up to continue chatting with Ozzie and save your conversation history.\n\n🔐 Password-free login\n✨ One-time signup, lifetime access',
        redirectTo: '/invest'
      });
      return;
    }

    // Add user message immediately to the UI
    addMessage({
      text: question,
      sender: 'user',
      id: crypto?.randomUUID ? crypto.randomUUID() : `msg-${Date.now()}-${Math.random()}`
    });
    incrementMessageCount();
    if (!presetQuestion) {
      setInput('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = '48px';
      }
    }
    
    // Generate bot response
    generateBotResponse(question);
  };

  // Get returnTo from URL params or sessionStorage
  const getReturnTo = () => {
    const returnFromUrl = searchParams.get('returnTo');
    const returnFromSession = typeof window !== 'undefined' ? sessionStorage.getItem('returnTo') : null;
    const authFlowReturnTo = typeof window !== 'undefined' ? sessionStorage.getItem('authFlow_returnTo') : null;
    const result = returnFromUrl || returnFromSession || authFlowReturnTo || '/';
    
    // Store returnTo in both locations for persistence
    if (returnFromUrl && returnFromUrl !== '/') {
      sessionStorage.setItem('returnTo', returnFromUrl);
      sessionStorage.setItem('authFlow_returnTo', returnFromUrl);
    }
    
    return result;
  };

  return (
    <aside className={`h-full flex flex-col relative overflow-hidden ${
      isMobile 
        ? 'bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-black dark:to-blue-950/30' 
        : 'bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:from-slate-900 dark:via-black dark:to-blue-950/50 border-l border-slate-200/50 dark:border-slate-700/50'
    } backdrop-blur-xl`}>
      <style jsx>{`
        @keyframes breathe {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
          }
          50% { 
            transform: scale(1.02);
            box-shadow: 0 0 0 12px rgba(59, 130, 246, 0.1);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(1deg); }
          50% { transform: translateY(-5px) rotate(0deg); }
          75% { transform: translateY(-2px) rotate(-1deg); }
        }
        
        @keyframes sparkle-spin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        
        @keyframes avatar-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .breathing {
          animation: breathe 3s ease-in-out infinite;
        }
        
        .floating-avatar {
          animation: float 6s ease-in-out infinite, avatar-pulse 8s ease-in-out infinite;
        }
        
        .sparkle-rotate {
          animation: sparkle-spin 6s linear infinite;
        }
        
        .gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
        
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        .glass-effect {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        
        .message-bubble {
          position: relative;
          overflow: hidden;
        }
        
        .message-bubble::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          pointer-events: none;
        }
      `}</style>
      
      {/* Animated background particles */}
      {/* Removed animated particles to eliminate circle remnants */}
      
      <header className={`${isMobile ? 'p-4' : 'p-6'} relative z-10 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-white/80 to-blue-50/30 dark:from-slate-900/80 dark:to-blue-950/30 glass-effect`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 floating-avatar">
            <div className="relative">
              <div className="p-2.5 bg-[#1e88e5] rounded-xl shadow-lg shadow-[#1e88e5]/25 transition-all duration-300 hover:shadow-[#1e88e5]/40">
                <SparklesIcon className="h-5 w-5 text-white sparkle-rotate"/>
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></div>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                {user ? (
                  <span>
                    <span><span className="text-[#1e88e5]">OZ</span><span className="text-black dark:text-white">zie</span></span>, <span className="text-black dark:text-white">{getUserFirstName(user)}</span>
                  </span>
                ) : (
                  <span><span className="text-[#1e88e5]">OZ</span><span className="text-black dark:text-white">zie</span></span>
                )}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Your OZ Investment Expert</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user && !isMobile && (
              <button
                onClick={async () => {
                  await signOut();
                  if (window.location.pathname === '/raise') {
                    window.location.href = '/';
                  } else {
                    window.location.reload();
                  }
                }}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 relative group"
                title="Log out"
              >
                <LogOut className="h-4 w-4 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"/>
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Log out
                </span>
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* Preset Questions */}
      <div className={`${isMobile ? 'p-4' : 'p-6'} border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-white/60 to-blue-50/20 dark:from-slate-900/60 dark:to-blue-950/20 glass-effect`}>
        <div className="grid grid-cols-2 gap-2">
          {presetQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handlePresetClick(question)}
              className={`${isMobile ? 'p-2.5 text-xs min-h-[40px]' : 'p-3 text-base min-h-[48px]'} text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all duration-200 text-left font-medium bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-600 shadow-sm hover:shadow-md ${
                highlightedQuestions.has(index) ? 'breathing bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-300 dark:border-blue-600' : ''
              }`}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
      
      <div 
        ref={messagesContainerRef}
        className={`flex-1 overflow-y-auto ${isMobile ? 'p-5' : 'p-6'} space-y-4 bg-gradient-to-b from-transparent to-blue-50/20 dark:to-blue-950/20`}
      >
        {!isHydrated ? (
          <div className="flex justify-start animate-fadeIn">
            <div className="max-w-[85%] message-bubble text-slate-700 dark:text-slate-300 rounded-2xl rounded-tl-lg px-5 py-4 bg-white/90 dark:bg-slate-800/90 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
              <p className="text-sm leading-relaxed font-medium">Loading conversation...</p>
            </div>
          </div>
        ) : (
          msgs.map((m, index) => (
            <div key={m.id || `fallback-${index}`} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
              <div className={`max-w-[85%] message-bubble ${
                m.sender === 'user'
                  ? 'bg-[#1e88e5] text-white rounded-2xl rounded-tr-lg px-5 py-4 shadow-lg shadow-[#1e88e5]/25'
                  : 'text-slate-700 dark:text-slate-300 rounded-2xl rounded-tl-lg px-5 py-4 bg-white/90 dark:bg-slate-800/90 border border-slate-200/50 dark:border-slate-700/50 shadow-sm'
              }`}>
                <div className="text-sm leading-relaxed font-medium">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <span>{children}</span>,
                      strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>
                    }}
                  >
                    {m.text}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Form */}
      <div className={`${isMobile ? 'p-4' : 'p-6'} border-t border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-white/80 to-blue-50/30 dark:from-slate-900/80 dark:to-blue-950/30 glass-effect`}>
        <div className={`flex ${isMobile ? 'gap-2' : 'gap-4'} items-center`}>
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              className={`w-full ${isMobile ? 'px-3 py-2.5' : 'px-5 py-3.5'} rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm font-medium transition-all duration-200 bg-white/90 dark:bg-slate-800/90 border border-slate-200/50 dark:border-slate-700/50 resize-none overflow-hidden ${isMobile ? 'h-[44px]' : 'h-[48px]'} max-h-[120px] shadow-sm hover:shadow-md`}
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Ask Ozzie anything about OZs..."
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              onInput={(e) => {
                // Auto-resize textarea
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            />
          </div>
          <button 
            onClick={(e) => handleSend(e)}
            disabled={!input.trim()} 
            className={`${isMobile ? 'w-[44px] h-[44px]' : 'w-[48px] h-[48px]'} flex items-center justify-center bg-[#1e88e5] hover:bg-[#1976d2] disabled:bg-slate-300 dark:disabled:bg-slate-600 rounded-full transition-all duration-200 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex-shrink-0 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40`}
          >
            <PaperAirplaneIcon className="h-4 w-4 text-white"/>
          </button>
        </div>
      </div>
    </aside>
  );
}