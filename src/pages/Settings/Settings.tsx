import { ChangePasswordForm } from "../../components/settings/ChangePasswordForm";

export const Settings = () => {
  return (
    <>
      <div className="mx-auto max-w-7xl px-3 py-3.5">
        <main className="mx-auto min-w-0 max-w-3xl space-y-5">
          <ChangePasswordForm />
        </main>
      </div>
    </>
  );
};
