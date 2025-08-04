import React, { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import DataTable from '@/components/DataTable';
import AdminLayout from '@/components/AdminLayout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BaseTable } from '@/types';

interface ApiUser extends BaseTable {
  name: string;
  email: string;
  phoneNumber: string;
  userType: number;
  profilePhotoUrl: string;
  createdAt: string;
}

const Users: React.FC = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  // const [userType, setUserType] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        Page: String(page),
        PageSize: String(pageSize),
      });
      if (debouncedSearchTerm) {
        params.append('Search', debouncedSearchTerm);
      }

      const response = await fetch(`http://localhost:5000/api/AdminUser/users?${params.toString()}`);
      const result = await response.json();
      console.log(result);
      if (result.success) {
        setUsers(result.data.items);
        setTotalCount(result.data.TotalCount);
      } else {
        console.error(result.message);
        setUsers([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns = [
    {
      key: 'profilePhoto',
      label: t('profilePhoto'),
      render: (_: unknown, row: ApiUser) => (
        <img
          src={`http://localhost:5000/uploads/${row.profilePhotoUrl ?? ''}`}
          alt={row.name}
          className="w-10 h-10 rounded-full"
        />
      )
    },
    { key: 'name', label: t('name') },
    { key: 'phoneNumber', label: t('phoneNumber') },
    {
      key: 'createdAt', label: t('createdAt')
    },
  ];

  const handleAdd = () => {
    console.log('Add new user');
  };

  const handleEdit = (user: ApiUser) => {
    console.log('Edit user:', user);
  };

  const handleDelete = (user: ApiUser) => {
    console.log('Delete user:', user);
  };

  const handleView = (user: ApiUser) => {
    console.log('View user:', user);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  return (
    <AdminLayout loading={loading}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t('users')}</h1>
        </div>
        <DataTable
          title={t('users')}
          columns={columns}
          data={users}
          isLoading={loading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          addButtonText={t('addUser')}
          currentPage={page}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          showtree={false}
          showActions={false}
          onSearchChange={(s)=>{
            setSearchTerm(s);
          }}
        />
      </div>
    </AdminLayout>
  );
};

export default Users;
