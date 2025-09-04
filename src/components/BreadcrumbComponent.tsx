"use client";

import { CapFirstLetter } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const BreadcrumbComponent = () => {
  const pathName = usePathname();
  const segments = pathName.split("/").filter(Boolean);
  const breadcrumbItems = segments.map((segment, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    return {
      href,
      label: CapFirstLetter(segment),
    };
  });
  return (
    <div className="text-2xl font-semibold h-16 py-5 px-4">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, idx) => (
            <BreadcrumbItem key={item.href}>
              {idx === breadcrumbItems.length - 1 ? (
                <BreadcrumbPage className="font-bold text-sm">
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbComponent;
