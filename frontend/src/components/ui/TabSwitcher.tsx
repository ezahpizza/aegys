// src/components/ui/TabSwitcher.tsx
import clsx from "clsx";

interface TabSwitcherProps {
  tabs: string[]; // <-- expects mutable string[]
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabSwitcher({ tabs, currentTab, onTabChange }: TabSwitcherProps) {



  return (
    <nav className="flex gap-2 rounded-lg bg-midblck/80 p-1 w-fit mx-auto shadow">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={clsx(
            "px-5 py-2 rounded-md font-heading text-lg transition-colors focus:outline-none",
            currentTab === tab
              ? "bg-lavpink text-midblck shadow font-bold"
              : "text-lavpink hover:bg-midblu/60"
          )}
          aria-current={currentTab === tab}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}