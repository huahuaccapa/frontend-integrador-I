// AlertDialogContext.jsx
"use client";
import { createContext, useReducer, useRef, useCallback, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Separator } from "@radix-ui/react-dropdown-menu";

export const AlertDialogContext = createContext(() => null);

export const alertDialogReducer = (state, action) => {
  switch (action.type) {
    case "close":
      return { ...state, open: false };
    case "alert":
    case "confirm":
    case "prompt":
      return {
        ...state,
        open: true,
        ...action,
        cancelButton:
          action.cancelButton || (action.type === "alert" ? "Okay" : "Cancel"),
        actionButton:
          ("actionButton" in action && action.actionButton) || "Okay",
      };
    default:
      return state;
  }
};

export function AlertDialogProvider({ children }) {
  const [state, dispatch] = useReducer(alertDialogReducer, {
    open: false,
    title: "",
    body: "",
    type: "alert",
    cancelButton: "Cancel",
    actionButton: "Okay",
    icon: null,
  });

  const resolveRef = useRef();

  function close() {
    dispatch({ type: "close" });
    resolveRef.current?.(false);
  }

  function confirm(value) {
    dispatch({ type: "close" });
    resolveRef.current?.(value ?? true);
  }

  const dialog = useCallback(async (params) => {
    dispatch(params);

    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  return (
    <AlertDialogContext.Provider value={dialog}>
      {children}
      <AlertDialog
        open={state.open}
        onOpenChange={(open) => {
          if (!open) close();
          return;
        }}
      >
        <AlertDialogContent asChild>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              confirm(event.currentTarget.prompt?.value);
            }}
          >
            <AlertDialogHeader className="flex flex-col items-center text-center">
              {state.icon && <div className="mb-4">{state.icon}</div>}
              <AlertDialogTitle className="mb-4">{state.title}</AlertDialogTitle>
              {state.body ? (
                <AlertDialogDescription>{state.body}</AlertDialogDescription>
              ) : null}
            </AlertDialogHeader>
            {state.type === "prompt" && (
              <Input
                name="prompt"
                defaultValue={state.defaultValue}
                {...state.inputProps}
              />
            )}
            <Separator/>
            <AlertDialogFooter>
              <Button type="button" onClick={close}>
                {state.cancelButton}
              </Button>
              {state.type === "alert" ? null : (
                <Button type="submit" variant="success">
                  {state.actionButton}
                </Button>
              )}
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialogContext.Provider>
  );
}

export function useConfirm() {
  const dialog = useContext(AlertDialogContext);

  return useCallback(
    (params) => {
      return dialog({
        ...(typeof params === "string" ? { title: params } : params),
        type: "confirm",
      });
    },
    [dialog]
  );
}

export function usePrompt() {
  const dialog = useContext(AlertDialogContext);

  return (params) =>
    dialog({
      ...(typeof params === "string" ? { title: params } : params),
      type: "prompt",
    });
}

export function useAlert() {
  const dialog = useContext(AlertDialogContext);
  return (params) =>
    dialog({
      ...(typeof params === "string" ? { title: params } : params),
      type: "alert",
    });
}
