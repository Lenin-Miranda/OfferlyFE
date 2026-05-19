interface ErrorContextType {
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface ErrorMessageProps {
  message?: string;
  onClose?: () => void;
}

export type { ErrorContextType, ErrorMessageProps };
