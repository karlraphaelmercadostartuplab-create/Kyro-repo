import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';

interface TranslationItemProps {
    translationKey: string;
    value: string;
    onChange: (key: string, value: string) => void;
}

export function TranslationItem({ translationKey, value, onChange }: TranslationItemProps) {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 gap-2 border-b p-3 transition-colors hover:bg-muted/30 sm:grid-cols-5 sm:gap-4 sm:items-start">
            <div className="sm:col-span-2">
                <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:hidden">
                    {t('Translation Key')}
                </div>
                <div className="break-words text-sm font-medium text-foreground sm:truncate" title={translationKey}>
                    {translationKey}
                </div>
            </div>
            <div className="sm:col-span-3">
                <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:hidden">
                    {t('Translation Value')}
                </div>
                {value.length > 100 ? (
                    <Textarea
                        value={value}
                        onChange={(e) => onChange(translationKey, e.target.value)}
                        className="min-h-[60px] text-sm resize-none"
                        rows={2}
                        placeholder="Enter translation value..."
                    />
                ) : (
                    <Input
                        value={value}
                        onChange={(e) => onChange(translationKey, e.target.value)}
                        className="text-sm"
                        placeholder="Enter translation value..."
                    />
                )}
            </div>
        </div>
    );
}