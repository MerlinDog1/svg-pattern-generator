import { Download } from 'lucide-react';

interface HeaderProps {
  onExport: () => void;
  customPatternsCount: number;
}

export function Header({ onExport, customPatternsCount }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-neutral-200 z-50">
      <div className="h-full px-4 md:px-8 flex items-center justify-between">
        <h1 className="text-lg md:text-heading-lg font-bold text-neutral-900 truncate">
          SVG Pattern Generator
          {customPatternsCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
              {customPatternsCount} custom
            </span>
          )}
        </h1>
        <button
          type="button"
          onClick={onExport}
          className="h-10 md:h-12 px-4 md:px-6 bg-primary-500 text-white font-semibold rounded-md shadow-sm 
                     hover:bg-primary-600 hover:-translate-y-0.5 hover:shadow-md 
                     active:bg-primary-900 active:translate-y-0 
                     transition-all duration-fast flex items-center gap-2 text-small md:text-body
                     touch-manipulation min-w-[80px] md:min-w-[120px] justify-center"
        >
          <Download size={18} className="md:w-5 md:h-5" />
          <span className="hidden sm:inline">Export SVG</span>
          <span className="sm:hidden">Export</span>
        </button>
      </div>
    </header>
  );
}
