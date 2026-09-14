"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ConfirmationOptions = {
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

/** Await confirm(message, options) before running an action; render confirmationDialog once. */
export function useConfirmation() {
  const [request, setRequest] = useState<({ message: string } & ConfirmationOptions) | null>(null);
  const pending = useRef<((confirmed: boolean) => void) | null>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);

  const settle = useCallback((confirmed: boolean) => {
    const resolve = pending.current;
    pending.current = null;
    setRequest(null);
    resolve?.(confirmed);
  }, []);

  const confirm = useCallback((message: string, options: ConfirmationOptions = {}) => {
    // Ignore repeat clicks while a confirmation is already awaiting a decision.
    if (pending.current) return Promise.resolve(false);
    return new Promise<boolean>((resolve) => {
      pending.current = resolve;
      setRequest({ message, ...options });
    });
  }, []);

  useEffect(() => () => {
    pending.current?.(false);
    pending.current = null;
  }, []);

  const confirmationDialog = (
    <Dialog open={request !== null} onOpenChange={(open) => { if (!open) settle(false); }}>
      <DialogContent showCloseButton={false} initialFocus={cancelButton}>
        <DialogHeader>
          <DialogTitle>{request?.title ?? "Confirm action"}</DialogTitle>
          <DialogDescription>{request?.message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button ref={cancelButton} type="button" variant="outline" onClick={() => settle(false)}>{request?.cancelLabel ?? "Cancel"}</Button>
          <Button type="button" variant={request?.destructive ? "destructive" : "default"} onClick={() => settle(true)}>{request?.confirmLabel ?? "Confirm"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return { confirm, confirmationDialog };
}
