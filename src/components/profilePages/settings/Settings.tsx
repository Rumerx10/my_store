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
import { Bell, Lock, Eye, Shield, Trash2, LogOut, Save } from 'lucide-react';

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
    console.log('[v0] Preferences saved:', preferences);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="mt-2 text-muted-foreground">Manage your account preferences and security</p>
        </div>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="border-border bg-muted/50 w-full justify-start">
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
          <TabsContent value="notifications" className="space-y-4">
            <Card className="border-border">
              <div className="border-b border-border px-6 py-4">
                <h2 className="font-semibold text-foreground">Email Notifications</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose what emails you&apos;d like to receive
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notif" className="text-foreground font-medium">
                      Email Notifications
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
                      Order Updates
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
                      Product Updates
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
                      Weekly Digest
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

            <Card className="border-border">
              <div className="border-b border-border px-6 py-4">
                <h2 className="font-semibold text-foreground">Push Notifications</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Get real-time notifications on your device
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notif" className="text-foreground font-medium">
                      Push Notifications
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
                      Security Alerts
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
              Save Notification Preferences
            </Button>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card className="border-border">
              <div className="border-b border-border px-6 py-4">
                <h2 className="font-semibold text-foreground">Two-Factor Authentication</h2>
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

            <Card className="border-border">
              <div className="border-b border-border px-6 py-4">
                <h2 className="font-semibold text-foreground">Change Password</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Update your password regularly for security
                </p>
              </div>

              <div className="p-6">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Eye size={16} />
                  Change Password
                </Button>
              </div>
            </Card>

            <Card className="border-border">
              <div className="border-b border-border px-6 py-4">
                <h2 className="font-semibold text-foreground">Active Sessions</h2>
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
                  <Badge className="bg-green-100 text-green-800 border border-green-200">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                  <div>
                    <p className="font-medium text-foreground">Safari on iPhone</p>
                    <p className="text-sm text-muted-foreground">2 days ago</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Logout
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-4">
            <Card className="border-border">
              <div className="border-b border-border px-6 py-4">
                <h2 className="font-semibold text-foreground">Account Information</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  View and manage your account details
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                  <p className="mt-2 font-medium text-foreground">john.doe@example.com</p>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                  <p className="mt-2 font-medium text-foreground">January 15, 2023</p>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm font-medium text-muted-foreground">Account Status</p>
                  <p className="mt-2 flex items-center gap-2 font-medium text-foreground">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Active
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-border border-red-200 bg-red-50/30">
              <div className="border-b border-red-200 px-6 py-4">
                <h2 className="font-semibold text-red-900">Danger Zone</h2>
                <p className="text-sm text-red-800 mt-1">Irreversible actions</p>
              </div>

              <div className="p-6 space-y-3">
                <Button
                  variant="outline"
                  className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                  onClick={() => setShowLogoutDialog(true)}
                >
                  <LogOut size={16} />
                  Logout All Sessions
                </Button>

                <Button
                  variant="outline"
                  className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 size={16} />
                  Delete Account
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Account Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Account</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove
                all your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-3">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete Account
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        {/* Logout Dialog */}
        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Logout All Sessions</AlertDialogTitle>
              <AlertDialogDescription>
                You will be logged out from all devices. You&apos;ll need to sign in again to access your
                account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-3">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Logout All</AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default Settings;
