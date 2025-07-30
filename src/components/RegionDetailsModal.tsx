import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { Region } from '../types';
import { Badge } from './ui/badge';

interface RegionDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    region: Region | null;
}

const RegionDetailsModal: React.FC<RegionDetailsModalProps> = ({
    open,
    onOpenChange,
    region,
}) => {
    const { t } = useLanguage();

    if (!region) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px] bg-card">
                <DialogHeader>
                    <DialogTitle className="text-card-foreground">{t('regionDetails')}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <p className="text-sm font-medium text-muted-foreground">{t('name')}:</p>
                            <p className="col-span-2 text-sm text-foreground">{region.name}</p>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <p className="text-sm font-medium text-muted-foreground">{t('parent')}:</p>
                            <p className="col-span-2 text-sm text-foreground">{region.parentName || t('none')}</p>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <p className="text-sm font-medium text-muted-foreground">{t('status')}:</p>
                            <div className="col-span-2">
                                <Badge
                                    variant={region.isActive ? 'default' : 'destructive'}
                                    className={
                                        region.isActive
                                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                            : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                                    }
                                >
                                    {t(region.isActive ? 'active' : 'inactive')}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RegionDetailsModal; 