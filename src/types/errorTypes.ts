interface ErrorContextType {
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface ErrorMessageProps {
  message: string;
}

export type { ErrorContextType, ErrorMessageProps };
