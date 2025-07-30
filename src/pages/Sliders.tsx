import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import DataTable from '@/components/DataTable';
import SliderForm from '@/components/SliderForm';
import AdminLayout from '@/components/AdminLayout';
import axios from 'axios';
import { Slider, SliderFormData } from '../types';
import { toast } from 'sonner';
import SliderDetailsModal from '@/components/SliderDetailsModal';

const Sliders: React.FC = () => {
  const { t, language } = useLanguage();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [selectedSlider, setSelectedSlider] = useState<Slider | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isRefetching, setIsRefetching] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    const fetchSliders = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/sliders?pageNumber=${currentPage}&pageSize=${pageSize}`, {
          headers: {
            'Accept-Language': language,
          },
        });
        console.log(response.data.data.items);

        if (response.data.success) {
          setSliders(response.data.data.items);
          setTotalCount(response.data.data.totalCount);
        } else {
          toast.error(t('errorFetchingSliders'));
        }
      } catch (error) {
        toast.error(t('errorFetchingSliders'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSliders();
  }, [language, t, currentPage, pageSize, isRefetching]);

  const columns = [
    {
      key: 'imageUrl',
      label: t('image'),
      render: (imageUrl: string) => (
        <img src={`http://localhost:5000/uploads/${imageUrl}`} alt="slider" className="w-12 h-12 rounded-full" />
      ),
    },
    { key: 'name', label: t('name') },
    { key: 'startDate', label: t('startDate') },
    { key: 'endDate', label: t('endDate') },
    {
      key: 'isActive',
      label: t('status'),
      render: (status: boolean) => (
        <Badge
          variant={status === true ? 'default' : 'secondary'}
          className={status === true ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}
        >
          {t(status ? 'active' : 'inactive')}
        </Badge>
      ),
    }
  ];

  const handleAdd = () => {
    setEditMode(false);
    setSelectedSlider(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: SliderFormData) => {
    const formData = new FormData();
    formData.append('NameAr', data.nameArabic);
    formData.append('NameEn', data.nameEnglish);
    formData.append('StartDate', data.startDate.toISOString());
    formData.append('EndDate', data.endDate.toISOString());
    if (data.image) {
      formData.append('Image', data.image);
    }

    try {
      setIsLoading(true);
      const url = editMode && selectedSlider
        ? `http://localhost:5000/api/admin/sliders/update/${selectedSlider.id}`
        : 'http://localhost:5000/api/admin/sliders/create';
      const method = editMode ? 'put' : 'post';

      const response = await axios[method](url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept-Language': language,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setIsRefetching(isRefetching => !isRefetching);
        setIsFormOpen(false);
        setEditMode(false);
        setSelectedSlider(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(t(editMode ? 'errorUpdatingSlider' : 'errorCreatingSlider'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (slider: Slider) => {
    setEditMode(true);
    setSelectedSlider(slider);
    setIsFormOpen(true);
  };

  const handleView = (slider: Slider) => {
    setSelectedSlider(slider);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = async (slider: Slider) => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`http://localhost:5000/api/admin/sliders/delete/${slider.id}`, {
        headers: {
          'Accept-Language': language,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setIsRefetching(isRefetching => !isRefetching);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(t('errorDeletingSlider'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActivation = async (slider: Slider) => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`http://localhost:5000/api/admin/sliders/toggle-activation/${slider.id}`, null, {
        headers: {
          'Accept-Language': language,
        },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setSliders((prevSliders) =>
          prevSliders.map((s) =>
            s.id === slider.id ? { ...s, isActive: !s.isActive } : s
          )
        );
      } else {
        toast.error(t('errorTogglingActivation'));
      }
    } catch (error) {
      toast.error(t('errorTogglingActivation'));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <AdminLayout loading={isLoading}>
      <>
        <DataTable
          title={t('sliders')}
          columns={columns}
          data={sliders}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onToggleActivation={handleToggleActivation}
          addButtonText={t('addSlider')}
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          showtree={false}
        />
        <SliderForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleFormSubmit}
          slider={selectedSlider}
        />
        <SliderDetailsModal
            open={isDetailsModalOpen}
            onOpenChange={setIsDetailsModalOpen}
            slider={selectedSlider}
        />
      </>
    </AdminLayout>
  );
};

export default Sliders; 