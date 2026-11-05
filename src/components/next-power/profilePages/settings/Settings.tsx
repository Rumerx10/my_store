'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { KeyRound, Loader2, Lock, LogOut, Shield, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { ErrorState, PageLoader } from '@/components/common/QueryState';
import {
  useChangePassword,
  useCloseAccount,
  useLogoutEverywhere,
  useMe,
} from '@/lib/query/account';
import { memberSince } from '../AccountShell';
import PageHeading from '@/components/common/PageHeading';

// Matches the server's password rules (PASSWORD_MIN_LENGTH / MAX).
const passwordSchema = yup.object({
  currentPassword: yup.string().required('Enter your current password'),
  newPassword: yup
    .string()
    .required('Choose a new password')
    .min(8, 'Use at least 8 characters')
    .max(128, 'Use at most 128 characters'),
  confirm: yup
    .string()
    .required('Type the new password again')
    .oneOf([yup.ref('newPassword')], 'The passwords don’t match'),
});
type PasswordForm = yup.InferType<typeof passwordSchema>;

const cardHeader = 'border-b border-border px-6 py-4';

const ChangePassword = () => {
  const change = useChangePassword();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordForm>({ resolver: yupResolver(passwordSchema) });

  const onSubmit = (data: PasswordForm) =>
    change.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: () => {
          reset();
          toast.success('Password changed. Your other devices are signed out.');
        },
      },
    );

  const fields = [
    { name: 'currentPassword', label: 'Current password', autoComplete: 'current-password' },
    { name: 'newPassword', label: 'New password', autoComplete: 'new-password' },
    { name: 'confirm', label: 'Confirm new password', autoComplete: 'new-password' },
  ] as const;

  return (
    <Card className="glass bg-white/60 dark:bg-slate-900/60">
      <div className={cardHeader}>
        <h2 className="font-semibold text-foreground">Change password</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Changing it signs you out everywhere else.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 p-6">
        {fields.map((field) => (
          <div key={field.name} className="max-w-sm space-y-1.5">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              type="password"
              autoComplete={field.autoComplete}
              aria-invalid={Boolean(errors[field.name])}
              aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
              {...register(field.name)}
            />
            {errors[field.name] && (
              <p id={`${field.name}-error`} className="text-xs text-red">
                {errors[field.name]?.message}
              </p>
            )}
          </div>
        ))}
        <Button type="submit" disabled={change.isPending} className="gap-2">
          {change.isPending ? (
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          ) : (
            <KeyRound size={16} aria-hidden="true" />
          )}
          Change password
        </Button>
      </form>
    </Card>
  );
};

const Settings = () => {
  const router = useRouter();
  const { data: me, isPending, error, refetch } = useMe();
  const logoutEverywhere = useLogoutEverywhere();
  const closeAccount = useCloseAccount();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  if (isPending) return <PageLoader label="Loading your settings" />;
  if (error || !me) return <ErrorState error={error} onRetry={() => refetch()} />;

  const isOwner = me.role === 'OWNER';

  return (
    <div>
      <PageHeading title="Settings" desc="Security and account options." />

      <Tabs defaultValue="security" className="w-full">
        <TabsList className="w-full justify-start sm:w-auto">
          <TabsTrigger value="security" className="gap-2">
            <Shield size={16} />
            Security
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <Lock size={16} />
            Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="mt-5 space-y-4">
          <ChangePassword />

          <Card className="glass bg-white/60 dark:bg-slate-900/60">
            <div className={cardHeader}>
              <h2 className="font-semibold text-foreground">Signed-in devices</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Lost a phone, or signed in on a shared computer? Sign out of every device, this one
                included.
              </p>
            </div>
            <div className="p-6">
              <Button
                variant="outline"
                className="gap-2 bg-transparent"
                onClick={() => setShowLogoutDialog(true)}
              >
                <LogOut size={16} aria-hidden="true" />
                Log out of all devices
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-5 space-y-4">
          <Card className="glass bg-white/60 dark:bg-slate-900/60">
            <div className={cardHeader}>
              <h2 className="font-semibold text-foreground">Account information</h2>
            </div>
            <dl className="space-y-4 p-6">
              {[
                { label: 'Mobile number', value: me.phone },
                { label: 'Email address', value: me.email || 'Not added' },
                { label: 'Member since', value: memberSince(me.createdAt) },
              ].map((row, index) => (
                <div key={row.label} className={index > 0 ? 'border-t border-border pt-4' : ''}>
                  <dt className="text-sm font-medium text-muted-foreground">{row.label}</dt>
                  <dd className="mt-2 font-medium text-foreground">{row.value}</dd>
                </div>
              ))}
              <div className="border-t border-border pt-4">
                <dt className="text-sm font-medium text-muted-foreground">Account status</dt>
                <dd className="mt-2 flex items-center gap-2 font-medium text-foreground">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Active
                </dd>
              </div>
            </dl>
          </Card>

          <Card className="border-red-200 dark:border-red-500/30 bg-red-50/30 dark:bg-red-500/10 shadow-none">
            <div className="border-b border-red-200 dark:border-red-500/30 px-6 py-4">
              <h2 className="font-semibold text-red-900 dark:text-red-200">Close account</h2>
              <p className="mt-1 text-sm text-red-800 dark:text-red-300">
                {isOwner
                  ? 'The store owner’s account stays open while the store does.'
                  : 'You won’t be able to sign in again. Your orders are kept for the store’s records.'}
              </p>
            </div>
            <div className="p-6">
              <Button
                variant="outline"
                disabled={isOwner}
                className="w-full gap-2 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 bg-transparent sm:w-auto"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 size={16} aria-hidden="true" />
                Close my account
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close your account?</AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;ll be signed out and won&apos;t be able to sign in with {me.phone} again.
              Orders you placed stay with the store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Keep my account</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                closeAccount.mutate(undefined, {
                  onSuccess: () => {
                    toast.success('Your account is closed');
                    router.replace('/next-power');
                  },
                })
              }
            >
              Close account
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out of all devices</AlertDialogTitle>
            <AlertDialogDescription>
              Every device signed in to your account, this one included, will be signed out.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                logoutEverywhere.mutate(undefined, {
                  onSuccess: () => {
                    toast.success('Signed out of every device');
                    router.replace('/next-power/login');
                  },
                })
              }
            >
              Log out everywhere
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
