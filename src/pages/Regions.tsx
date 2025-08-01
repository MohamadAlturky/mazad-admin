import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import DataTable from '@/components/DataTable';
import RegionForm from '@/components/RegionForm';
import AdminLayout from '@/components/AdminLayout';
import axios from 'axios';
import { Region, RegionFormData } from '../types';
import { toast } from 'sonner';
import RegionDetailsModal from '@/components/RegionDetailsModal';

const Regions: React.FC = () => {
  const { t, language } = useLanguage();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isRefetching, setIsRefetching] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    const fetchRegions = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/regions?pageNumber=${currentPage}&pageSize=${pageSize}`, {
          headers: {
            'Accept-Language': language,
          },
        });
        console.log(response.data.data.items);

        if (response.data.success) {
          setRegions(response.data.data.items);
          setTotalCount(response.data.data.totalCount);
        } else {
          toast.error(t('errorFetchingRegions'));
        }
      } catch (error) {
        toast.error(t('errorFetchingRegions'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegions();
  }, [language, t, currentPage, pageSize, isRefetching]);

  const columns = [
    { key: 'name', label: t('name') },
    { key: 'parentName', label: t('parent') },
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
    setSelectedRegion(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: RegionFormData) => {
    const requestData = {
        nameEnglish: data.nameEnglish,
        nameArabic: data.nameArabic,
        parentId: data.parentId
    }

    try {
      setIsLoading(true);
      const url = editMode && selectedRegion
        ? `http://localhost:5000/api/admin/regions/update/${selectedRegion.id}`
        : 'http://localhost:5000/api/admin/regions/create';
      const method = editMode ? 'put' : 'post';

      const response = await axios[method](url, requestData, {
        headers: {
          'Accept-Language': language,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setIsRefetching(isRefetching => !isRefetching);
        setIsFormOpen(false);
        setEditMode(false);
        setSelectedRegion(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(t(editMode ? 'errorUpdatingRegion' : 'errorCreatingRegion'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (region: Region) => {
    setEditMode(true);
    setSelectedRegion(region);
    setIsFormOpen(true);
  };

  const handleView = (region: Region) => {
    setSelectedRegion(region);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = async (region: Region) => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`http://localhost:5000/api/admin/regions/delete/${region.id}`, {
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
      toast.error(t('errorDeletingRegion'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActivation = async (region: Region) => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`http://localhost:5000/api/admin/regions/toggle-activation/${region.id}`, null, {
        headers: {
          'Accept-Language': language,
        },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setRegions((prevRegions) =>
          prevRegions.map((r) =>
            r.id === region.id ? { ...r, isActive: !r.isActive } : r
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
          title={t('regions')}
          columns={columns}
          data={regions}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onToggleActivation={handleToggleActivation}
          addButtonText={t('addRegion')}
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          showtree={false}
          showRegionsTree={true}
        />
        <RegionForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleFormSubmit}
          region={selectedRegion}
        />
        <RegionDetailsModal
            open={isDetailsModalOpen}
            onOpenChange={setIsDetailsModalOpen}
            region={selectedRegion}
        />
      </>
    </AdminLayout>
  );
};

export default Regions;
