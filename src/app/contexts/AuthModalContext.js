'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const AuthModalContext = createContext({
  isOpen: false,
  openModal: () => { },
  closeModal: () => { },
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
    onClose: null,
  });

  const openModal = useCallback((content = {}) => {
    // If a new redirectTo path is provided, update sessionStorage.
    // Otherwise, if no path is given, clear it to prevent stale redirects.
    if (content.redirectTo) {
      sessionStorage.setItem('redirectTo', content.redirectTo);
    } else {
      sessionStorage.removeItem('redirectTo');
    }
    setModalContent(prev => ({ ...prev, ...content }));
    setIsOpen(true);
  }, []);

  const closeModal = useCallback((options = {}) => {
    // Only call onClose if not explicitly skipped (e.g., after successful auth)
    if (!options.skipOnClose && modalContent.onClose) {
      modalContent.onClose();
    }
    setIsOpen(false);
    // Reset to default after a short delay to allow for animations
    setTimeout(() => {
      setModalContent({
        title: 'Authentication Required',
        description: 'Please sign in to continue.',
        redirectTo: '/',
        onClose: null,
      });
    }, 300);
  }, [modalContent]);

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