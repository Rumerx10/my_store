'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Panel from '@/components/common/Panel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { ApiStoreSettings } from '@/lib/api/types';
import { useUpdateStoreSettings } from '@/lib/query/admin';

// VAT, the installation service and the stock level that counts as low.
const CheckoutPanel = ({ settings }: { settings: ApiStoreSettings }) => {
  const update = useUpdateStoreSettings();
  const [taxRate, setTaxRate] = useState(String(Number(settings.taxRate)));
  const [offersInstallation, setOffersInstallation] = useState(settings.installationFee !== null);
  const [installationFee, setInstallationFee] = useState(
    settings.installationFee !== null ? String(Number(settings.installationFee)) : '',
  );
  const [lowStock, setLowStock] = useState(String(settings.lowStockThreshold));
  const [error, setError] = useState('');

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const tax = Number(taxRate);
    const fee = Number(installationFee);
    const low = Number(lowStock);
    if (taxRate.trim() === '' || !(tax >= 0 && tax <= 100)) {
      return setError('VAT must be between 0 and 100 percent.');
    }
    if (offersInstallation && (installationFee.trim() === '' || !(fee >= 0))) {
      return setError('Enter the installation fee, or turn installation off.');
    }
    if (!Number.isInteger(low) || low < 0) {
      return setError('The low-stock level must be a whole number, 0 or more.');
    }
    setError('');
    update.mutate(
      {
        taxRate: Math.round(tax * 100) / 100,
        installationFee: offersInstallation ? Math.round(fee * 100) / 100 : null,
        lowStockThreshold: low,
      },
      { onSuccess: () => toast.success('Checkout settings saved') },
    );
  };

  return (
    <Panel title="Checkout">
      <form onSubmit={submit} noValidate className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="tax-rate">VAT (%)</Label>
            <Input
              id="tax-rate"
              type="number"
              inputMode="decimal"
              min={0}
              max={100}
              step="0.01"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
            />
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Added to the goods after any discount.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="low-stock">Low stock at</Label>
            <Input
              id="low-stock"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={lowStock}
              onChange={(e) => setLowStock(e.target.value)}
            />
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Products with this many units or fewer show as low stock.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-4 dark:border-white/10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="offers-installation" className="font-medium">
                Offer installation
              </Label>
              <p className="mt-0.5 text-sm text-gray-600 dark:text-slate-400">
                Shoppers can add professional installation in the cart.
              </p>
            </div>
            <Switch
              id="offers-installation"
              checked={offersInstallation}
              onCheckedChange={setOffersInstallation}
            />
          </div>
          {offersInstallation && (
            <div className="mt-4 max-w-xs space-y-1.5">
              <Label htmlFor="installation-fee">Installation fee (৳)</Label>
              <Input
                id="installation-fee"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                value={installationFee}
                onChange={(e) => setInstallationFee(e.target.value)}
              />
            </div>
          )}
        </div>

        {error && (
          <p role="alert" className="text-sm text-red">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={update.isPending}
          className="h-10 w-full rounded-lg bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:opacity-60 sm:w-auto"
        >
          {update.isPending ? 'Saving…' : 'Save checkout settings'}
        </button>
      </form>
    </Panel>
  );
};

export default CheckoutPanel;
