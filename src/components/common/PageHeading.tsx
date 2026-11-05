// Title block used at the top of each account page. Above the seller centre's sun (z-25,
// globals.css .sun-admin), which reaches the action buttons' corner, so they keep their own
// colours, as the shop's header does over its sun. It has no background: the sun shows behind it.
const PageHeading = ({
  title,
  desc,
  action,
}: {
  title: string;
  desc?: string;
  action?: React.ReactNode;
}) => (
  <div className="relative z-26 mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 className="text-2xl text-gray-900 dark:text-slate-100 md:text-3xl">{title}</h1>
      {desc && <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">{desc}</p>}
    </div>
    {action}
  </div>
);

export default PageHeading;
