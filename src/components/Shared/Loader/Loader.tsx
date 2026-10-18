import { Spinner } from "@heroui/react";

export const Loader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Spinner size="xl" />
        <span className="text-xs text-muted">Loading</span>
      </div>
    </div>
  );
};
