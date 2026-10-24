'use client';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Bell, Lock, KeyRound, Shield, Trash2, LogOut, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeading from '../PageHeading';

interface Preferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  productUpdates: boolean;
  orderUpdates: boolean;
  securityAlerts: boolean;
  weeklyDigest: boolean;
  darkMode: boolean;
  twoFactor: boolean;
}

const Settings = () => {
  const [preferences, setPreferences] = useState<Preferences>({
    emailNotifications: true,
    pushNotifications: true,
    productUpdates: false,
    orderUpdates: true,
    securityAlerts: true,
    weeklyDigest: false,
    darkMode: false,
    twoFactor: true,
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handlePreferenceChange = (key: keyof Preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSavePreferences = () => {
    toast.success('Notification preferences saved');
  };

  return (
    <div>
      <PageHeading title="Settings" desc="Notifications, security and account options." />

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="w-full justify-start sm:w-auto">
          <TabsTrigger value="notifications" className="gap-2">
            <Bell size={16} />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield size={16} />
            Security
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <Lock size={16} />
            Account
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-5 space-y-4">
          <Card className="glass bg-white/60 dark:bg-slate-900/60">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-semibold text-foreground">Email notifications</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Choose what emails you&apos;d like to receive
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notif" className="text-foreground font-medium">
                    Email notifications
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Receive all notification emails from us
                  </p>
                </div>
                <Switch
                  id="email-notif"
                  checked={preferences.emailNotifications}
                  onCheckedChange={() => handlePreferenceChange('emailNotifications')}
                />
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-between">
                <div>
                  <Label htmlFor="order-updates" className="text-foreground font-medium">
                    Order updates
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get notifications about your orders
                  </p>
                </div>
                <Switch
                  id="order-updates"
                  checked={preferences.orderUpdates}
                  onCheckedChange={() => handlePreferenceChange('orderUpdates')}
                />
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-between">
                <div>
                  <Label htmlFor="product-updates" className="text-foreground font-medium">
                    Product updates
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Receive news about new products and sales
                  </p>
                </div>
                <Switch
                  id="product-updates"
                  checked={preferences.productUpdates}
                  onCheckedChange={() => handlePreferenceChange('productUpdates')}
                />
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-digest" className="text-foreground font-medium">
                    Weekly digest
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get a weekly summary of your activity
                  </p>
                </div>
                <Switch
                  id="weekly-digest"
                  checked={preferences.weeklyDigest}
                  onCheckedChange={() => handlePreferenceChange('weeklyDigest')}
                />
              </div>
            </div>
          </Card>

          <Card className="glass bg-white/60 dark:bg-slate-900/60">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-semibold text-foreground">Push notifications</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Get real-time notifications on your device
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notif" className="text-foreground font-medium">
                    Push notifications
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enable notifications on your device
                  </p>
                </div>
                <Switch
                  id="push-notif"
                  checked={preferences.pushNotifications}
                  onCheckedChange={() => handlePreferenceChange('pushNotifications')}
                />
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-between">
                <div>
                  <Label htmlFor="security-alerts" className="text-foreground font-medium">
                    Security alerts
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Important alerts about your account security
                  </p>
                </div>
                <Switch
                  id="security-alerts"
                  checked={preferences.securityAlerts}
                  onCheckedChange={() => handlePreferenceChange('securityAlerts')}
                />
              </div>
            </div>
          </Card>

          <Button onClick={handleSavePreferences} className="gap-2">
            <Save size={16} />
            Save preferences
          </Button>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-5 space-y-4">
          <Card className="glass bg-white/60 dark:bg-slate-900/60">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-semibold text-foreground">Two-factor authentication</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Add an extra layer of security to your account
              </p>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium text-foreground">
                    {preferences.twoFactor ? 'Enabled' : 'Disabled'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {preferences.twoFactor
                      ? 'Your account is protected with two-factor authentication'
                      : 'Enable 2FA for enhanced security'}
                  </p>
                </div>
                <Switch
                  checked={preferences.twoFactor}
                  onCheckedChange={() => handlePreferenceChange('twoFactor')}
                />
              </div>
            </div>
          </Card>

          <Card className="glass bg-white/60 dark:bg-slate-900/60">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-semibold text-foreground">Change password</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Update your password regularly for security
              </p>
            </div>

            <div className="p-6">
              <Button variant="outline" className="gap-2 bg-transparent">
                <KeyRound size={16} />
                Change password
              </Button>
            </div>
          </Card>

          <Card className="glass bg-white/60 dark:bg-slate-900/60">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-semibold text-foreground">Active sessions</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your active login sessions
              </p>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                <div>
                  <p className="font-medium text-foreground">Chrome on Windows</p>
                  <p className="text-sm text-muted-foreground">Current session</p>
                </div>
                <Badge className="bg-green-100 dark:bg-green-500/15 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-500/30">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                <div>
                  <p className="font-medium text-foreground">Safari on iPhone</p>
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                </div>
                <Button variant="ghost" size="sm">
                  Log out
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="mt-5 space-y-4">
          <Card className="glass bg-white/60 dark:bg-slate-900/60">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-semibold text-foreground">Account information</h2>
              <p className="text-sm text-muted-foreground mt-1">
                View and manage your account details
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email address</p>
                <p className="mt-2 font-medium text-foreground">tanvir.hasan@example.com</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm font-medium text-muted-foreground">Member since</p>
                <p className="mt-2 font-medium text-foreground">January 15, 2023</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm font-medium text-muted-foreground">Account status</p>
                <p className="mt-2 flex items-center gap-2 font-medium text-foreground">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Active
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-red-200 dark:border-red-500/30 bg-red-50/30 dark:bg-red-500/10 shadow-none">
            <div className="border-b border-red-200 dark:border-red-500/30 px-6 py-4">
              <h2 className="font-semibold text-red-900 dark:text-red-200">Danger zone</h2>
              <p className="text-sm text-red-800 dark:text-red-300 mt-1">Irreversible actions</p>
            </div>

            <div className="p-6 space-y-3">
              <Button
                variant="outline"
                className="w-full gap-2 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 bg-transparent"
                onClick={() => setShowLogoutDialog(true)}
              >
                <LogOut size={16} />
                Log out of all devices
              </Button>

              <Button
                variant="outline"
                className="w-full gap-2 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 bg-transparent"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 size={16} />
                Delete account
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete account</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all
              your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete account
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Logout Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out of all devices</AlertDialogTitle>
            <AlertDialogDescription>
              You will be logged out from all devices. You&apos;ll need to sign in again to access
              your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Log out everywhere</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
