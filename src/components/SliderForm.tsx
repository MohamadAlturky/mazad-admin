import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Slider, SliderFormData } from '../types';
import { DatePicker } from '@/components/ui/date-picker';

interface SliderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SliderFormData) => void;
  slider?: Slider | null;
}

const SliderForm: React.FC<SliderFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  slider,
}) => {
  const { t } = useLanguage();
  const [nameArabic, setNameArabic] = useState('');
  const [nameEnglish, setNameEnglish] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (slider) {
      setNameArabic(slider.name);
      setNameEnglish(slider.name);
      setStartDate(new Date(slider.startDate));
      setEndDate(new Date(slider.endDate));
      setImage(null);
    } else {
      setNameArabic('');
      setNameEnglish('');
      setStartDate(undefined);
      setEndDate(undefined);
      setImage(null);
    }
  }, [slider]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    onSubmit({
      nameArabic,
      nameEnglish,
      startDate,
      endDate,
      image,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">{slider ? t('editSlider') : t('addSlider')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nameEnglish" className="text-card-foreground">{t('nameEnglish')}</Label>
            <Input
              id="nameEnglish"
              value={nameEnglish}
              onChange={(e) => setNameEnglish(e.target.value)}
              className="border-input bg-background text-foreground focus:border-primary"
              required
            />
          </div>
          <div>
            <Label htmlFor="nameArabic" className="text-card-foreground">{t('nameArabic')}</Label>
            <Input
              id="nameArabic"
              value={nameArabic}
              onChange={(e) => setNameArabic(e.target.value)}
              className="border-input bg-background text-foreground focus:border-primary"
              required
            />
          </div>
          <div>
            <Label htmlFor="startDate" className="text-card-foreground">{t('startDate')}</Label>
            <DatePicker date={startDate} setDate={setStartDate} />
          </div>
          <div>
            <Label htmlFor="endDate" className="text-card-foreground">{t('endDate')}</Label>
            <DatePicker date={endDate} setDate={setEndDate} />
          </div>
          <div>
            <Label htmlFor="image" className="text-card-foreground">{t('image')}</Label>
            <Input
              id="image"
              type="file"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="border-input bg-background text-foreground focus:border-primary"
            />
          </div>
          <DialogFooter>
            <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-border hover:bg-accent hover:text-accent-foreground"
            >
                {t('cancel')}
            </Button>
            <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
                {slider ? t('update') : t('create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SliderForm; 