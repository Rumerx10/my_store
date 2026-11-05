'use client';
import { useState } from 'react';
import { CheckCircle2, Copy, Globe, Loader2, Star, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Panel from '@/components/common/Panel';
import { Input } from '@/components/ui/input';
import { PageLoader } from '@/components/common/QueryState';
import type { ApiStoreSettings } from '@/lib/api/types';
import { useDomainActions, useDomains } from '@/lib/query/admin';
import { useSession } from '@/lib/query/session';

const copy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Copied');
  } catch {
    toast.error(`Couldn't copy. Select the text instead.`);
  }
};

// Custom domains: add one, create the DNS record shown, verify, then make it the primary
// address. Only the owner can change domains.
const DomainsPanel = ({ settings }: { settings: ApiStoreSettings }) => {
  const { user } = useSession();
  const isOwner = user?.role === 'OWNER';
  const { data: domains = [], isPending } = useDomains();
  const actions = useDomainActions();
  const [hostname, setHostname] = useState('');

  const add = (event: React.FormEvent) => {
    event.preventDefault();
    const value = hostname.trim().toLowerCase();
    if (!value) return;
    actions.add.mutate(value, {
      onSuccess: () => {
        setHostname('');
        toast.success('Domain added. Create the DNS record below, then verify.');
      },
    });
  };

  return (
    <Panel title="Domains">
      <p className="-mt-2 mb-4 text-sm text-gray-600 dark:text-slate-400">
        Your store is always at <span className="font-medium">{settings.slug}</span> on the platform
        domain. It&apos;s served at <span className="font-medium">{settings.primaryHost}</span> now.
      </p>

      {isPending ? (
        <PageLoader className="min-h-24" />
      ) : (
        <ul className="space-y-3">
          {domains.map((domain) => (
            <li
              key={domain.id}
              className="rounded-lg border border-gray-200 p-4 dark:border-white/10"
            >
              <div className="flex flex-wrap items-center gap-3">
                <Globe className="size-4 text-gray-400" aria-hidden="true" />
                <p className="min-w-0 flex-1 break-all font-medium text-gray-900 dark:text-slate-100">
                  {domain.hostname}
                </p>
                {domain.isPrimary && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand-ink">
                    <Star className="size-3" aria-hidden="true" />
                    Primary
                  </span>
                )}
                {domain.verifiedAt ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-hGreen">
                    <CheckCircle2 className="size-3.5" aria-hidden="true" />
                    Verified
                  </span>
                ) : (
                  <span className="text-xs font-medium text-sun-ink">Waiting for DNS</span>
                )}
              </div>
              {!domain.verifiedAt && (
                <div className="mt-3 space-y-1 rounded-md bg-gray-50 p-3 text-xs dark:bg-white/5">
                  <p className="text-gray-600 dark:text-slate-400">
                    Add this {domain.verification.type} record at your domain&apos;s DNS provider:
                  </p>
                  {(['name', 'value'] as const).map((part) => (
                    <p key={part} className="flex items-center gap-2">
                      <span className="w-12 shrink-0 text-gray-500 dark:text-slate-400">
                        {part === 'name' ? 'Name' : 'Value'}
                      </span>
                      <code className="min-w-0 flex-1 break-all text-gray-900 dark:text-slate-100">
                        {domain.verification[part]}
                      </code>
                      <button
                        type="button"
                        onClick={() => copy(domain.verification[part])}
                        aria-label={`Copy the record ${part}`}
                        className="rounded p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10"
                      >
                        <Copy className="size-3.5" />
                      </button>
                    </p>
                  ))}
                </div>
              )}
              {isOwner && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {!domain.verifiedAt && (
                    <button
                      type="button"
                      disabled={actions.verify.isPending}
                      onClick={() =>
                        actions.verify.mutate(domain.id, {
                          onSuccess: () => toast.success(`${domain.hostname} is verified`),
                        })
                      }
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand px-3 text-xs font-semibold text-white hover:bg-brand-hover disabled:opacity-60"
                    >
                      {actions.verify.isPending && (
                        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                      )}
                      Verify
                    </button>
                  )}
                  {domain.verifiedAt && !domain.isPrimary && (
                    <button
                      type="button"
                      disabled={actions.makePrimary.isPending}
                      onClick={() =>
                        actions.makePrimary.mutate(domain.id, {
                          onSuccess: () => toast.success(`${domain.hostname} is now primary`),
                        })
                      }
                      className="h-8 rounded-lg border border-gray-300 px-3 text-xs font-medium hover:bg-gray-50 disabled:opacity-60 dark:border-white/15 dark:hover:bg-white/5"
                    >
                      Make primary
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={actions.remove.isPending}
                    onClick={() => {
                      if (
                        window.confirm(
                          `Remove ${domain.hostname}? The store stops answering there.`,
                        )
                      ) {
                        actions.remove.mutate(domain.id, {
                          onSuccess: () => toast.success(`Removed ${domain.hostname}`),
                        });
                      }
                    }}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-gray-600 hover:text-red disabled:opacity-60 dark:text-slate-400"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                    Remove
                  </button>
                </div>
              )}
            </li>
          ))}
          {domains.length === 0 && (
            <li className="text-sm text-gray-600 dark:text-slate-400">No custom domains yet.</li>
          )}
        </ul>
      )}

      {isOwner ? (
        <form onSubmit={add} className="mt-4 flex gap-2">
          <Input
            value={hostname}
            onChange={(e) => setHostname(e.target.value)}
            placeholder="shop.example.com"
            aria-label="Domain to add"
            className="h-10"
          />
          <button
            type="submit"
            disabled={!hostname.trim() || actions.add.isPending}
            className="h-10 shrink-0 rounded-lg bg-brand px-4 text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-60"
          >
            Add domain
          </button>
        </form>
      ) : (
        <p className="mt-4 text-xs text-gray-500 dark:text-slate-400">
          Only the store owner can change domains.
        </p>
      )}
    </Panel>
  );
};

export default DomainsPanel;
