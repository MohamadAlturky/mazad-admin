import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { Slider } from '../types';
import { Badge } from './ui/badge';

interface SliderDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    slider: Slider | null;
}

const SliderDetailsModal: React.FC<SliderDetailsModalProps> = ({
    open,
    onOpenChange,
    slider,
}) => {
    const { t } = useLanguage();

    if (!slider) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px] bg-card">
                <DialogHeader>
                    <DialogTitle className="text-card-foreground">{t('sliderDetails')}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <div className="mb-4">
                        <img
                            src={`http://localhost:5000/uploads/${slider.imageUrl}`}
                            alt={slider.name}
                            className="w-full h-auto rounded-lg shadow-lg"
                        />
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <p className="text-sm font-medium text-muted-foreground">{t('name')}:</p>
                            <p className="col-span-2 text-sm text-foreground">{slider.name}</p>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <p className="text-sm font-medium text-muted-foreground">{t('startDate')}:</p>
                            <p className="col-span-2 text-sm text-foreground">{new Date(slider.startDate).toLocaleDateString()}</p>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <p className="text-sm font-medium text-muted-foreground">{t('endDate')}:</p>
                            <p className="col-span-2 text-sm text-foreground">{new Date(slider.endDate).toLocaleDateString()}</p>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <p className="text-sm font-medium text-muted-foreground">{t('status')}:</p>
                            <div className="col-span-2">
                                <Badge
                                    variant={slider.isActive ? 'default' : 'destructive'}
                                    className={
                                        slider.isActive
                                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                            : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                                    }
                                >
                                    {t(slider.isActive ? 'active' : 'inactive')}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SliderDetailsModal;