import React from "react";

export const CardLayout = ({ children, title }: { children: React.ReactNode; title?: string }) => {
  return (
    <div className="max-w-3xs w-full absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 bg-white p-4 rounded shadow-sm border border-gray-200">
      {title && <h1 className="text-xl font-bold mb-3">{title}</h1>}
      <div className="overflow-y-auto max-h-[60vh] -mx-4 px-4 pb-2">
        {children}
      </div>
    </div>
  );
};
