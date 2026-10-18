export type ProfileFilterType = "posts" | "saved";

interface ProfileFilterProps {
  active: ProfileFilterType;
  onChange: (filter: ProfileFilterType) => void;
  count: number;
  isMe: boolean;
}

export const ProfileFilter = ({
  active,
  onChange,
  count,
  isMe,
}: ProfileFilterProps) => {
  const tabs: { id: ProfileFilterType; label: string; icon: string }[] = [
    { id: "posts", label: isMe ? "My Posts" : "Posts", icon: "fa-regular fa-file-lines" },
    ...(isMe
      ? [{ id: "saved" as const, label: "Saved", icon: "fa-regular fa-bookmark" }]
      : []),
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="grid w-full grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1.5 sm:inline-flex sm:w-auto sm:gap-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
              active === tab.id
                ? "bg-white text-[#1877f2] shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <i className={tab.icon}></i>
            {tab.label}
          </button>
        ))}
      </div>
      <span className="rounded-full bg-[#e7f3ff] px-3 py-1 text-xs font-bold text-[#1877f2]">
        {count}
      </span>
    </div>
  );
};