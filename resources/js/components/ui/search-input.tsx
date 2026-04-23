import { Search, X } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import { useTranslation } from 'react-i18next';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (clearSearch?: boolean) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ 
  value, 
  onChange, 
  onSearch, 
  placeholder,
  className = "w-full"
}: SearchInputProps) {
  const { t } = useTranslation();
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="flex w-full items-stretch gap-2">
      <div className="relative min-w-0 flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder || t('Search...')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`h-11 w-full rounded-xl border-border bg-background pl-10 pr-10 shadow-sm transition-shadow focus-visible:ring-2 focus-visible:ring-primary/30 ${className}`}
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange('');
            }}
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button type="button" onClick={() => onSearch()} className="h-11 shrink-0 rounded-xl px-4 font-semibold shadow-sm sm:px-5">
        {t('Search')}
      </Button>
    </div>
  );

}
