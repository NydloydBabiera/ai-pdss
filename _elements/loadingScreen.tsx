
"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import { Spinner } from "@/components/ui/spinner";

type LoadingContextType = {
  isLoading: boolean;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(
  undefined
);

export function LoadingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("Processing...");

  const startLoading = (loadingMessage = "Processing...") => {
    setMessage(loadingMessage);
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        startLoading,
        stopLoading,
      }}
    >
      {children}

      <Dialog open={isLoading}>
        <DialogContent
          className="sm:max-w-[300px]"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">
            Loading
          </DialogTitle>

          <div className="flex flex-col items-center justify-center gap-4 py-4">
            <Spinner className="size-8" />

            <p className="text-sm text-muted-foreground">
              {message}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error(
      "useLoading must be used within a LoadingProvider"
    );
  }

  return context;
}