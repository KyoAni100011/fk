import { Button } from "../../../core/components/ui/Button";
import { Input } from "../../../core/components/ui/Input";
import { Label } from "../../../core/components/ui/Label";
import { Card } from "../../../core/components/ui/Card";
import { useSettingsForm } from "../hooks/useSettingsForm";
import { TabsContent } from "../../../core/components/ui/Tabs";

export const SettingsPane = () => {
  const { formData, updateField, submitGeneralSettings, submitSecuritySettings, loading, user, isUploadingAvatar, handleAvatarUpload } = useSettingsForm();

  return (
    <Card className="flex-1 p-6 md:p-8">
      <TabsContent value="general">
        <h3 className="text-xl font-bold text-black mb-2">General Account Settings</h3>
        <p className="text-sm text-black opacity-70 mb-6">Manage your basic profile information.</p>
        
        <div className="mb-8 flex items-center gap-6">
          <div className="relative group w-20 h-20 shrink-0">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover border border-[#333333] bg-[#f0f0f0]" />
            ) : (
              <div className="w-full h-full border border-[#333333] bg-[#f0f0f0] flex items-center justify-center font-bold text-black text-2xl">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            )}
            {loading || isUploadingAvatar ? (
               <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <span className="w-6 h-6 border-2 border-[#333333] border-t-transparent rounded-full animate-spin"></span>
               </div>
            ) : (
              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white font-bold text-xs cursor-pointer">
                EDIT
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploadingAvatar} />
              </label>
            )}
          </div>
          <div className="text-sm text-black">
            <h4 className="font-bold">Profile Picture</h4>
            <p className="opacity-70 mt-1 max-w-xs">Upload a new avatar. Recommended size is 256x256px.</p>
          </div>
        </div>

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
