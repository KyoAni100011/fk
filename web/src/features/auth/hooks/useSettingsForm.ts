import { useState } from "react";
import { updateUsername, updatePassword } from "../../../core/services/user";
import { useAuth } from "../../../core/AuthProvider";
import { useAlert } from "../../../core/AlertContext";

export const useSettingsForm = () => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const submitGeneralSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim()) return;
    setLoading(true);
    try {
      await updateUsername(formData.username);
      showAlert("Username updated successfully! Reloading to apply changes.", "Success");
      setTimeout(() => window.location.reload(), 1500);
    } catch {
      showAlert("Failed to update username", "Error", "danger");
    } finally {
      setLoading(false);
    }
  };

  const submitSecuritySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return showAlert("New passwords do not match.", "Error", "danger");
    }
    setLoading(true);
    try {
      await updatePassword(formData.oldPassword, formData.newPassword);
      showAlert("Password updated securely!", "Success");
      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch {
      showAlert("Failed to update password. Please check your current password.", "Error", "danger");
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    formData,
    loading,
    updateField,
    submitGeneralSettings,
    submitSecuritySettings,
  };
};
