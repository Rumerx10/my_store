// The stores this browser has opened in the seller centre, newest first, so the store list at
// /admin can offer them again. Only names, logos and colours: nothing private.

const KEY = 'np.adminStores';
const LIMIT = 12;

export interface RememberedStore {
  slug: string;
  name: string;
  logoUrl: string | null;
  brandColor: string | null;
}

export const rememberedStores = (): RememberedStore[] => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(KEY) ?? '[]') as RememberedStore[];
    return Array.isArray(saved) ? saved.filter((store) => store && store.slug) : [];
  } catch {
    return [];
  }
};

export const rememberStore = (store: RememberedStore) => {
  try {
    const others = rememberedStores().filter((saved) => saved.slug !== store.slug);
    const entry = {
      slug: store.slug,
      name: store.name,
      logoUrl: store.logoUrl,
      brandColor: store.brandColor,
    };
    window.localStorage.setItem(KEY, JSON.stringify([entry, ...others].slice(0, LIMIT)));
  } catch {
    // The list is a convenience; without storage it just stays empty.
  }
};

export const forgetStore = (slug: string) => {
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify(rememberedStores().filter((store) => store.slug !== slug)),
    );
  } catch {
    // Nothing saved to forget.
  }
};
