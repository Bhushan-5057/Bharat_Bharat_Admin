import React from "react";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; 
  desc?: string;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white ${className}`}
    >
      <div className="px-4 py-3 sm:px-5">
        <h3 className="text-base font-semibold text-gray-800">
          {title}
        </h3>
        {desc && (
          <p className="mt-1 text-sm text-gray-500">
            {desc}
          </p>
        )}
      </div>

      <div className="border-t border-gray-100 px-2 py-2 sm:px-4 sm:py-3">
        <div className="space-y-1">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
