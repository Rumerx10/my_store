import AdminShell from '@/components/admin/AdminShell';

// The seller-centre pages, inside the store's frame (menu, account, staff only).
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
