import clsx from "clsx";

interface TabSwitcherProps {
  tabs: string[]; 
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabSwitcher({ tabs, currentTab, onTabChange }: TabSwitcherProps) {

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 rounded-lg bg-midblck/80 p-1 w-full max-w-full sm:w-fit sm:mx-auto shadow overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={clsx(
            "px-4 py-2 rounded-md font-heading text-sm md:text-base transition-colors focus:outline-none whitespace-nowrap",
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