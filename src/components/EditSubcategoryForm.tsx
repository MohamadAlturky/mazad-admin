import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import axios from 'axios';
import { toast } from 'sonner';
import { Riple } from 'react-loading-indicators';
import { Category } from '@/types';

interface EditSubcategoryFormData {
  nameArabic: string;
  nameEnglish: string;
}

interface EditSubcategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: EditSubcategoryFormData) => void;
  id: number;
  categoriesList: Category[];
}

const EditSubcategoryForm: React.FC<EditSubcategoryFormProps> = ({ open, onOpenChange, onSubmit, id, categoriesList }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useLanguage();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditSubcategoryFormData>({
    defaultValues: {
      nameArabic: '',
      nameEnglish: '',
    }
  });

  useEffect(() => {
    if (id) {
      const fetchSubcategory = async () => {
        try {
          const response = await axios.get(`http://localhost:5032/api/categories/${id}`, {
            headers: {
              'Accept-Language': language,
            },
          });

          if (response.data.success) {
            const subcategory = response.data.data;
            reset({
              nameArabic: subcategory.nameArabic,
              nameEnglish: subcategory.nameEnglish,
            });
          }
        } catch (error) {
          console.error('Error fetching subcategory:', error);
          toast.error(t('errorFetchingSubcategory'));
        }
      };

      fetchSubcategory();
    }
  }, [id, language, reset, t]);

  const handleFormSubmit = (data: EditSubcategoryFormData) => {
    const requestData = {
      id: id,
      nameArabic: data.nameArabic,
      nameEnglish: data.nameEnglish,
    };

    setIsLoading(true);
    axios.put(`http://localhost:5032/api/categories`, requestData, {
      headers: {
        'Accept-Language': language,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.data.success) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
        onSubmit(data);
        reset();
        onOpenChange(false);
      })
      .catch(error => {
        console.error('Error updating subcategory:', error);
        toast.error(t('errorUpdatingSubcategory'));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">{t('editSubcategory')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nameArabic" className="text-foreground text-base font-medium">{t('nameArabic')}</Label>
            <Input
              id="nameArabic"
              {...register('nameArabic', { required: t('nameArabicRequired') })}
              className="border-border focus:border-primary focus:ring-primary rounded-md p-2 text-foreground bg-background"
              placeholder={t('enterNameArabic')}
            />
            {errors.nameArabic && (
              <p className="text-destructive text-sm mt-1">{errors.nameArabic.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nameEnglish" className="text-foreground text-base font-medium">{t('nameEnglish')}</Label>
            <Input
              id="nameEnglish"
              {...register('nameEnglish', { required: t('nameEnglishRequired') })}
              className="border-border focus:border-primary focus:ring-primary rounded-md p-2 text-foreground bg-background"
              placeholder={t('enterNameEnglish')}
            />
            {errors.nameEnglish && (
              <p className="text-destructive text-sm mt-1">{errors.nameEnglish.message}</p>
            )}
          </div>

          <DialogFooter className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                reset();
              }}
              className="border-border text-foreground hover:bg-accent px-4 py-2 rounded-md transition-colors duration-200 ml-3"
            >
              {t('cancel')}
            </Button>
            {isLoading ? (
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors duration-200"
              >
                {t('loading')} ...
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors duration-200"
              >
                {t('save')}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubcategoryForm;