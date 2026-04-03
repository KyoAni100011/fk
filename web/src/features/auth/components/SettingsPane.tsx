import { Button } from "../../../core/components/ui/Button";
import { Input } from "../../../core/components/ui/Input";
import { Label } from "../../../core/components/ui/Label";
import { Card } from "../../../core/components/ui/Card";
import { useSettingsForm } from "../hooks/useSettingsForm";
import { TabsContent } from "../../../core/components/ui/Tabs";

export const SettingsPane = () => {
  const { formData, updateField, submitGeneralSettings, submitSecuritySettings, loading, user } = useSettingsForm();

  return (
    <Card className="flex-1 p-6 md:p-8">
      <TabsContent value="general">
        <h3 className="text-xl font-bold text-black mb-2">General Account Settings</h3>
        <p className="text-sm text-black opacity-70 mb-6">Manage your basic profile information.</p>
        
        <form onSubmit={submitGeneralSettings} className="max-w-md">
          <div className="mb-5">
            <Label htmlFor="username" text="Username" />
            <Input 
              id="username"
              value={formData.username}
              onChange={(e) => updateField("username", e.target.value)}
              placeholder="Enter a new username"
            />
            <p className="text-xs text-black opacity-60 mt-2">
              Your username is unique and helps friends find your account.
            </p>
          </div>
          <Button 
            type="submit" 
            isLoading={loading} 
            disabled={loading || formData.username === user?.username || !formData.username.trim()}
          >
            Save Changes
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="security">
        <h3 className="text-xl font-bold text-black mb-2">Security and Login</h3>
        <p className="text-sm text-black opacity-70 mb-6">Secure your account by frequently updating your password.</p>
        
        <form onSubmit={submitSecuritySettings} className="max-w-md">
          <div className="mb-4">
            <Label htmlFor="oldPassword" text="Current Password" />
            <Input 
              id="oldPassword"
              type="password" 
              value={formData.oldPassword}
              onChange={(e) => updateField("oldPassword", e.target.value)}
              placeholder="Enter current password"
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="newPassword" text="New Password" />
            <Input 
              id="newPassword"
              type="password" 
              value={formData.newPassword}
              onChange={(e) => updateField("newPassword", e.target.value)}
              placeholder="Create a new password"
              required
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="confirmPassword" text="Re-type New Password" />
            <Input 
              id="confirmPassword"
              type="password" 
              value={formData.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>
          <Button 
            type="submit" 
            isLoading={loading} 
            disabled={loading || !formData.oldPassword || !formData.newPassword || !formData.confirmPassword}
          >
            Update Password
          </Button>
        </form>
      </TabsContent>
    </Card>
  );
};
