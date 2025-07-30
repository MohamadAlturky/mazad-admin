
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Region, RegionFormData } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import axios from 'axios';
import { toast } from 'sonner';

interface DropdownRegion {
  id: number;
  name: string;
}

interface RegionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RegionFormData) => void;
  region: Region | null;
}

const RegionForm: React.FC<RegionFormProps> = ({ open, onOpenChange, onSubmit, region }) => {
  const { t, language } = useLanguage();
  const form = useForm<RegionFormData>();
  const [dropdownRegions, setDropdownRegions] = React.useState<DropdownRegion[]>([]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/regions/dropdown', {
          headers: {
            'Accept-Language': language,
          },
        });
        if (response.data.success) {
          setDropdownRegions(response.data.data);
        } else {
          toast.error('Failed to fetch regions');
        }
      } catch (error) {
        toast.error('Failed to fetch regions');
      }
    };

    fetchRegions();
  }, [language, open]);

  useEffect(() => {
    if (region) {
      form.setValue('nameEnglish', region.name);
      form.setValue('nameArabic', region.name);
      form.setValue('parentId', region.parentId);
    } else {
      form.reset();
    }
  }, [region, form]);

  const handleFormSubmit = (data: RegionFormData) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">{region ? t('editRegion') : t('addRegion')}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nameEnglish"
              rules={{ required: 'English name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-card-foreground">{t('nameEnglish')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-input bg-background text-foreground focus:border-primary"
                      placeholder="Enter English name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nameArabic"
              rules={{ required: 'Arabic name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-card-foreground">{t('nameArabic')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-input bg-background text-foreground focus:border-primary"
                      placeholder="Enter Arabic name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-card-foreground">{t('parent')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger className="border-input bg-background text-foreground focus:border-primary">
                        <SelectValue placeholder="Select a parent region" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dropdownRegions.map((r) => (
                        <SelectItem key={r.id} value={r.id.toString()}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                {region ? t('update') : t('create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RegionForm;
