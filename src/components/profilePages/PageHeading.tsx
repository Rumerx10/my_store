// Title block used at the top of each account page.
const PageHeading = ({
  title,
  desc,
  action,
}: {
  title: string;
  desc?: string;
  action?: React.ReactNode;
}) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 className="text-2xl text-gray-900 md:text-3xl">{title}</h1>
      {desc && <p className="mt-1 text-sm text-gray-600">{desc}</p>}
    </div>
    {action}
  </div>
);

export default PageHeading;
