'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Panel from '@/components/common/Panel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ApiStoreSettings } from '@/lib/api/types';
import { useUpdateStoreSettings } from '@/lib/query/admin';

const NOTE_LIMIT = 500;

// What the printed invoices add to the store details: the VAT registration and a closing note.
const InvoicePanel = ({ settings }: { settings: ApiStoreSettings }) => {
  const update = useUpdateStoreSettings();
  const [taxId, setTaxId] = useState(settings.taxId ?? '');
  const [note, setNote] = useState(settings.invoiceNote ?? '');
  const changed =
    taxId.trim() !== (settings.taxId ?? '') || note.trim() !== (settings.invoiceNote ?? '');

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    update.mutate(
      { taxId: taxId.trim() || null, invoiceNote: note.trim() || null },
      { onSuccess: () => toast.success('Invoice settings saved') },
    );
  };

  return (
    <Panel title="Invoices">
      <p className="-mt-2 mb-5 text-sm text-gray-600 dark:text-slate-400">
        Invoices print your logo, name, address and phone from Store details, with the label for the
        parcel on top. Print them from an order, or all at once from the orders being packed.
      </p>
      <form onSubmit={submit} noValidate className="space-y-5">
        <div className="max-w-sm space-y-1.5">
          <Label htmlFor="tax-id">VAT registration (BIN)</Label>
          <Input
            id="tax-id"
            value={taxId}
            maxLength={40}
            onChange={(e) => setTaxId(e.target.value)}
            placeholder="000123456-0101"
          />
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Leave it empty if the store isn&apos;t VAT registered.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="invoice-note">Note at the foot of every invoice</Label>
          <Textarea
            id="invoice-note"
            value={note}
            maxLength={NOTE_LIMIT}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Keep this invoice for warranty claims. Returns within 7 days, in the original box."
            className="min-h-24"
          />
          <p className="text-xs tabular-nums text-gray-500 dark:text-slate-400">
            Warranty, returns or a thank-you. {note.length}/{NOTE_LIMIT}
          </p>
        </div>
        <button
          type="submit"
          disabled={!changed || update.isPending}
          className="h-10 w-full rounded-lg bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 dark:disabled:bg-white/15 dark:disabled:text-slate-400 sm:w-auto"
        >
          {update.isPending ? 'Saving…' : 'Save invoice settings'}
        </button>
      </form>
    </Panel>
  );
};

export default InvoicePanel;
