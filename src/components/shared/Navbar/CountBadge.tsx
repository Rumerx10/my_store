// Small item count shown on the cart and wishlist icons; hidden when empty.
const CountBadge = ({ count }: { count: number }) => {
  if (count <= 0) return null;
  return (
    <span
      aria-hidden="true"
      className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red px-1 text-[11px] font-semibold tabular-nums leading-none text-white ring-2 ring-white"
    >
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default CountBadge;
