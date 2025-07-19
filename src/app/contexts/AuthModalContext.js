'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const AuthModalContext = createContext({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
  modalContent: {
    title: '',
    description: '',
    redirectTo: '/',
  },
});

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}

export function AuthModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: 'Authentication Required',
    description: 'Please sign in to continue.',
    redirectTo: '/',
  });

  const openModal = useCallback((content = {}) => {
    setModalContent(prev => ({ ...prev, ...content }));
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = {
    isOpen,
    openModal,
    closeModal,
    modalContent,
  };

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
} 