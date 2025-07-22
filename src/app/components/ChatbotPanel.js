// src/components/ChatbotPanel.js

// Enhanced ChatbotPanel.js with unified design

'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { SparklesIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
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
        redirectTo: '/dashboard'
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
    <aside className={`h-full glass-card flex flex-col bg-white dark:bg-black/70 backdrop-blur-2xl ${
      isMobile ? 'border-0' : 'border-l border-black/10 dark:border-white/20'
    } relative`}>
      <style jsx>{`
        @keyframes breathe {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(0, 113, 227, 0.4);
          }
          50% { 
            transform: scale(1.02);
            box-shadow: 0 0 0 8px rgba(0, 113, 227, 0.1);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
        
        @keyframes sparkle-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes avatar-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        .breathing {
          animation: breathe 3s ease-in-out infinite;
        }
        
        .floating-avatar {
          animation: float 4s ease-in-out infinite, avatar-pulse 6s ease-in-out infinite;
        }
        
        .sparkle-rotate {
          animation: sparkle-spin 8s linear infinite;
        }
      `}</style>
      
      <header className={`${isMobile ? 'p-4' : 'p-6'} border-b border-black/10 dark:border-white/20 relative overflow-hidden`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 floating-avatar">
            <div 
              className="p-2.5 bg-[#0071e3] rounded-2xl transition-all duration-75 ease-linear"
            >
              <SparklesIcon className="h-5 w-5 text-white sparkle-rotate"/>
            </div>
            <div>
              <h3 className="font-semibold text-black dark:text-white text-lg">
                {user ? (
                  <span>
                    Ozzie, <span className="text-[#0071e3]">{getUserFirstName(user)}</span>
                  </span>
                ) : (
                  'Ozzie'
                )}
              </h3>
              <p className="text-xs text-black/50 dark:text-white/70 font-light">Your OZ Investment Expert</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <button
                onClick={async () => {
                  await signOut();
                  window.location.reload();
                }}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-all relative group"
                title="Log out"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 text-black/40 dark:text-white/60 hover:text-black/60 dark:hover:text-white/80"/>
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Log out
                </span>
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* Preset Questions */}
      <div className={`${isMobile ? 'p-4' : 'p-6'} border-b border-black/10 dark:border-white/20`}>
        <div className="grid grid-cols-2 gap-2">
          {presetQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handlePresetClick(question)}
              className={`${isMobile ? 'p-3.5' : 'p-3'} text-xs text-black/60 dark:text-white/80 hover:text-black dark:hover:text-white rounded-2xl transition-all text-left font-light bg-white/80 dark:bg-black/80 hover:bg-black/5 dark:hover:bg-black/60 border border-black/10 dark:border-white/20 ${isMobile ? 'min-h-[48px]' : ''} ${
                highlightedQuestions.has(index) ? 'breathing' : ''
              }`}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
      
      <div 
        ref={messagesContainerRef}
        className={`flex-1 overflow-y-auto ${isMobile ? 'p-4' : 'p-6'} space-y-4`}
      >
        {!isHydrated ? (
          <div className="flex justify-start animate-fadeIn">
            <div className="max-w-[85%] glass-card text-black/90 dark:text-white/95 rounded-3xl rounded-tl-lg px-5 py-3 bg-black/5 dark:bg-black/80 border border-black/10 dark:border-white/20">
              <p className="text-sm leading-relaxed font-light">Loading conversation...</p>
            </div>
          </div>
        ) : (
          msgs.map((m, index) => (
            <div key={m.id || `fallback-${index}`} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
              <div className={`max-w-[85%] ${
                m.sender === 'user'
                  ? 'bg-[#0071e3] text-white rounded-3xl rounded-tr-lg px-5 py-3'
                  : 'glass-card text-black/90 dark:text-white/95 rounded-3xl rounded-tl-lg px-5 py-3 bg-black/5 dark:bg-black/80 border border-black/10 dark:border-white/20'
              }`}>
                <div className="text-sm leading-relaxed font-light">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <span>{children}</span>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      em: ({ children }) => <em>{children}</em>
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
      <div className={`${isMobile ? 'p-4' : 'p-6'} border-t border-black/10 dark:border-white/20`}>
        <div className={`flex ${isMobile ? 'gap-2' : 'gap-3'} items-end`}>
          <textarea
            ref={textareaRef}
            className={`flex-1 ${isMobile ? 'px-4 py-3' : 'px-5 py-3'} rounded-2xl text-black dark:text-white placeholder-black/30 dark:placeholder-white/50 focus:outline-none focus:border-black/20 dark:focus:border-white/30 text-sm font-light transition-all bg-black/5 dark:bg-black/80 border border-black/10 dark:border-white/20 resize-none overflow-hidden min-h-[48px] max-h-[120px]`}
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
          <button 
            onClick={(e) => handleSend(e)}
            disabled={!input.trim()} 
            className={`${isMobile ? 'p-3.5' : 'p-3'} bg-[#0071e3] hover:bg-[#0077ed] disabled:bg-black/10 dark:disabled:bg-white/20 rounded-full transition-all disabled:cursor-not-allowed hover:scale-105 flex-shrink-0 ${isMobile ? 'min-w-[48px] min-h-[48px]' : ''}`}
          >
            <PaperAirplaneIcon className="h-5 w-5 text-white"/>
          </button>
        </div>
      </div>
    </aside>
  );
}