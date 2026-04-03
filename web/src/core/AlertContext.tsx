import React, { createContext, useContext, useState } from "react";
import { Dialog } from "./components/ui/Dialog";

interface AlertContextValue {
  showAlert: (message: string, title?: string, variant?: "default" | "danger") => void;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState<"default" | "danger">("default");

  const showAlert = (message: string, title = "Alert", variant: "default" | "danger" = "default") => {
    setAlertMessage(message);
    setAlertTitle(title);
    setAlertVariant(variant);
    setIsOpen(true);
  };

  const closeAlert = () => {
    setIsOpen(false);
    // Add small delay before clearing text to prevent jarring layout shifts during exit animation
    setTimeout(() => {
      setAlertMessage("");
      setAlertTitle("");
      setAlertVariant("default");
    }, 200);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Dialog 
        isOpen={isOpen} 
        onClose={closeAlert} 
        title={alertTitle} 
        description={alertMessage} 
        confirmText="OK"
        onConfirm={closeAlert}
        variant={alertVariant}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
