'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ModalContent {
  title: string;
  description: string;
  redirectTo: string;
  onClose?: (() => void) | null;
}

interface AuthModalContextType {
  isOpen: boolean;
  openModal: (content?: Partial<ModalContent>) => void;
  closeModal: (options?: { skipOnClose?: boolean }) => void;
  modalContent: ModalContent;
}

const AuthModalContext = createContext<AuthModalContextType>({
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

interface AuthModalProviderProps {
  children: ReactNode;
}

export function AuthModalProvider({ children }: AuthModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent>({
    title: 'Authentication Required',
    description: 'Please sign in to continue.',
    redirectTo: '/',
    onClose: null,
  });

  const openModal = useCallback((content: Partial<ModalContent> = {}) => {
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

  const closeModal = useCallback((options: { skipOnClose?: boolean } = {}) => {
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

  const value: AuthModalContextType = {
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
