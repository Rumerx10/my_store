'use client';
import PageHeading from '@/components/common/PageHeading';
import { ErrorState, PageLoader } from '@/components/common/QueryState';
import { useStoreSettings } from '@/lib/query/admin';
import AlertsPanel from './settings/AlertsPanel';
import BrandPanel from './settings/BrandPanel';
import CheckoutPanel from './settings/CheckoutPanel';
import DeliveryPanel from './settings/DeliveryPanel';
import DomainsPanel from './settings/DomainsPanel';
import InvoicePanel from './settings/InvoicePanel';
import StoreDetailsPanel from './settings/StoreDetailsPanel';

// The store's own settings, from GET /store/settings: details, checkout, alerts, invoices,
// delivery and domains. Each panel saves on its own.
const SellerSettings = () => {
  const { data: settings, isPending, error, refetch } = useStoreSettings();

  if (isPending) return <PageLoader label="Loading settings" />;
  if (!settings) return <ErrorState error={error} onRetry={() => refetch()} />;

  return (
    <div>
      <PageHeading
        title="Settings"
        desc="Store details, brand colour, checkout, invoices, delivery and domains."
      />
      <div className="space-y-4">
        <StoreDetailsPanel settings={settings} />
        <BrandPanel key={`brand-${settings.updatedAt}`} settings={settings} />
        <div className="grid grid-cols-[minmax(0,1fr)] gap-4 xl:grid-cols-2">
          <CheckoutPanel key={settings.updatedAt} settings={settings} />
          <AlertsPanel settings={settings} />
        </div>
        <InvoicePanel key={`invoice-${settings.updatedAt}`} settings={settings} />
        <DeliveryPanel />
        <DomainsPanel settings={settings} />
      </div>
    </div>
  );
};

export default SellerSettings;
