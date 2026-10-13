# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is Yarn (`yarn.lock`; CI runs `yarn install`), but scripts are invoked via `npm run`.

- `npm run dev` — Next.js dev server (Turbopack)
- `npm run build` / `npm run start` — production build / serve
- `npm run lint` — ESLint (`next/core-web-vitals` + `next/typescript`)
- `npm run format` — Prettier write
- `npm run spotless` — `lint --fix` then `format`; this is what the PR CI job (`.github/workflows/pr.yml`) runs

There is no test runner or `test` script. The CI test step only runs when `RUN_TESTS=true`, and would fail as-is.

Prettier style: single quotes, semicolons, trailing commas, 100-col width, LF line endings.

## Architecture

This repo is **frontend only**: a Next.js 15 (App Router, React 19, TypeScript, Tailwind v4) storefront branded "TechGen". The README describes a multi-tenant SaaS with a Django/DRF backend, Stripe/PayPal and JWT auth. None of that exists here. There are no API calls, no auth and no backend integration yet.

### Data is mocked and static
- All data lives in `src/docs/` as TypeScript constants (not documentation). `src/docs/api_products.ts` is a snapshot of the dummyjson.com products API, extended with `popular` / `trending` / `latest` flags that the home-page sections filter on. Other files there hold mock orders, reviews, checkout data, nav links and dashboard sidebar config (`dashboard.tsx` → `SidebarItems`).
- Product images come from `cdn.dummyjson.com`. That is the only remote host allowed in `next.config.ts` `images.remotePatterns`, so add any new image host there.

### State: Redux Toolkit
- `src/redux/store.ts` combines the slices `cart`, `products`, `wishlist` and `orderlist` (from `orderSlice`). `RootState` is exported. There are no typed hooks, so components use plain `useSelector((state: RootState) => ...)` / `useDispatch`.
- The `products` slice's initial state is the static `Products` array. Its `addProduct` / `updateProduct` / `removeProduct` reducers are used by the admin product pages. Components read the product catalog from the store rather than importing `docs/api_products.ts` directly.
- Slices hold no persistence. Cart and other state reset when the page reloads, and the cart is pre-seeded with one item.
- `ReduxProvider` (client component) wraps the whole app in `src/app/layout.tsx`, together with the global `Navbar`, `Footer` and the `react-hot-toast` `Toaster`.

### Routing
- Public storefront routes sit at the top level of `src/app/`: `products`, `products/[id]`, `cart`, `checkout`, `order-summary`, `orders`, `wish-list`, `chat`, `profile/*`.
- Static information pages (`/about`, `/shipping`, `/returns`, `/faq`, `/privacy`, `/terms`, `/cookies`) are one route, `src/app/(info)/[slug]/page.tsx`, with copy in `src/docs/infoPages.ts`. Add a page by adding an entry there.
- The route groups `(admin)` → `/admin/*` and `(client)` → `/client/*` both use `src/components/DashboardLayout.tsx`, which picks the navigation from the first path segment via `SidebarItems(role)`. It and the account pages (`profilePages/AccountShell.tsx`) share `components/shared/SideNavShell.tsx`: a sidebar on desktop, a scrolling tab row on mobile.
- Dashboard pages are built from `components/dashboard/Panel.tsx`, `components/DashboardCard.tsx` (stat tile) and `profilePages/PageHeading.tsx`. Admin add and edit product share `components/admin/Products/ProductForm.tsx`.
- Pages in `src/app` are thin wrappers. The real UI lives in `src/components/<feature>/` (e.g. `components/admin/Products/`, `components/products/productDetails/`). Most feature components are client components.

### UI conventions
- shadcn/ui ("new-york" style, lucide icons) primitives are in `src/components/ui/`. Add new ones with the shadcn CLI per `components.json`. Path alias `@/*` → `src/*`.
- `cn()` and shared helpers such as `getStatusIcon` and `capitalize` are in `src/lib/utils.tsx` (note the `.tsx` extension, because it returns JSX).
- Custom Tailwind colors (`base`, `green`, `hGreen`, `red`, `black`, `bgGray`, etc.) are defined in the `@theme` block of `src/app/globals.css`. Tailwind v4 has no `tailwind.config`.
- Forms use `react-hook-form` + `yup` (`@hookform/resolvers`). Tables use `@tanstack/react-table` via `components/DataTable.tsx`. Charts use `recharts`.
- Shared TypeScript types are in `src/types/` (`api_types.ts` holds `IProduct`, `ICartItem`, etc.).
