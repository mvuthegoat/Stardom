import { cn } from "../../lib/utils"; 

interface SearchTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SearchTabs: React.FC<SearchTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => onTabChange('inspiration')}
          className={cn(
            "px-6 py-2 rounded-full text-base font-bold cursor-pointer",
            "transition-all duration-200 ease-in",
            "inline-flex items-center justify-center",
            "bg-transparent text-black border-none shadow-none",
            activeTab === 'inspiration' && "bg-black text-white"
          )}
        >
          Inspiration
        </button>
        <button
          onClick={() => onTabChange('memecoin')}
          className={cn(
            "px-6 py-2 rounded-full text-base font-bold cursor-pointer",
            "transition-all duration-200 ease-in",
            "inline-flex items-center justify-center",
            "bg-transparent text-black border-none shadow-none",
            activeTab === 'memecoin' && "bg-black text-white"
          )}
        >
          Memecoin
        </button>
      </div>
    </div>
  );
};

export default SearchTabs;