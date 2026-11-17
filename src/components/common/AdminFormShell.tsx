"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AdminPageActions from "@/components/common/AdminPageActions";

interface AdminFormShellProps {
  pageTitle: string;
  listPath: string;
  listLabel: string;
  cardTitle: string;
  description?: string;
  children: React.ReactNode;
}

export default function AdminFormShell({
  pageTitle,
  listPath,
  listLabel,
  cardTitle,
  description,
  children,
}: AdminFormShellProps) {
  return (
    <div className="w-full mx-auto py-6">
      <PageBreadcrumb
        pageTitle={pageTitle}
        path={listPath}
        label={listLabel}
      />
      <AdminPageActions backHref={listPath} backLabel="Back" />
      <div className="max-w-4xl">
        <ComponentCard title={cardTitle}>
          {description ? (
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          ) : null}
          {children}
        </ComponentCard>
      </div>
    </div>
  );
}
