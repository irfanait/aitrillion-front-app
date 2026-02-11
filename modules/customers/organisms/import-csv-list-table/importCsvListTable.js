import React from 'react';
import { Tag, Typography } from 'antd';
import AitTable from '@/components/molecules/ait-table/aitTable';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import moment from 'moment';
import { setAllCustomerFilters } from '@/redux/customers-slice/all-customers-slices/all-customers-slice';
import AitLink from '@/components/atoms/ait-link/aitLink';
const { Text } = Typography;

const ImportCsvListTable = () => {
  const { filters, importCsvList, importCsvListLoading, totalRecords } =
    useSelector((state) => state.importCsvState);
  const dispatch = useDispatch();

  const importCsvColumns = [
    {
      title: 'File name',
      dataIndex: 'file_name',
      key: 'file_name',
      width: 250,
      sorter: true,
      render: (_, record) => {
        return (
          <div>
            <Text>{record.file_name}</Text>
          </div>
        );
      },
    },
    {
      title: 'Created count',
      key: 'createdCount',
      dataIndex: 'createdCount',
      width: 130,
      sorter: true,
      render: (_, record) => (
        <>
          <Text>{record.createdCount}</Text>
        </>
      ),
    },
    {
      title: 'Updated count',
      key: 'updatedCount',
      dataIndex: 'updatedCount',
      width: 135,
      sorter: true,
      render: (_, record) => (
        <>
          <Text>{record.updatedCount}</Text>
        </>
      ),
    },
    {
      title: 'Error count',
      key: 'errorCount',
      dataIndex: 'errorCount',
      width: 120,
      sorter: true,
      render: (_, record) => (
        <>
          <Text>{record.errorCount}</Text>
        </>
      ),
    },
    {
      title: 'Custom error count',
      key: 'errorCustomCount',
      dataIndex: 'errorCustomCount',
      width: 170,
      sorter: true,
      render: (_, record) => (
        <>
          <Text>{record.errorCustomCount}</Text>
        </>
      ),
    },
    {
      title: 'Failed CSV',
      key: 'failed_csv_url',
      dataIndex: 'failed_csv_url',
      width: 150,
      sorter: true,
      render: (_, record) => (
        <>
          {record?.failed_csv_url ? (
            <AitLink weight={500} href={record?.failed_csv_url}>
              Download failed CSV
            </AitLink>
          ) : (
            <Text>Not available</Text>
          )}
        </>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      width: 130,
      sorter: true,
      render: (_, record) => {
        const statusMap = {
          0: { color: 'gold', label: 'Pending' },
          2: { color: 'green', label: 'Done' },
        };

        const statusConfig = statusMap[record?.status];

        if (statusConfig) {
          return <Tag color={statusConfig.color}>{statusConfig.label}</Tag>;
        }
      },
    },
    {
      title: 'Created date',
      key: 'created_date',
      dataIndex: 'created_date',
      width: 150,
      sorter: true,
      render: (_, record) => (
        <>
          <Text>{moment(record.created_date).format('DD-MM-YYYY HH:MM')}</Text>
        </>
      ),
    },
    {
      title: 'Updated date',
      key: 'updated_date',
      dataIndex: 'updated_date',
      width: 150,
      sorter: true,
      render: (_, record) => {
        const raw = record.updated_date;

        const isValid =
          raw &&
          raw !== '00-0000000' &&
          raw !== '0000-00-00' &&
          raw !== '0000-00-00 00:00:00' &&
          moment(raw, moment.ISO_8601, true).isValid();

        return (
          <Text>{isValid ? moment(raw).format('DD-MM-YYYY HH:mm') : '—'}</Text>
        );
      },
    },
  ];
  return (
    <>
      <AitTable
        rowKey={(record) => record.id || record.key}
        heading=""
        dataSource={importCsvList}
        loading={importCsvListLoading}
        columns={importCsvColumns}
        showFilters={false}
        filterheaderbottomspace="0px"
        pagination={{
          pageSize: filters.limit,
          current: filters.currentPage,
          total: totalRecords,
        }}
        onChange={(pagination) => {
          dispatch(
            setAllCustomerFilters({
              currentPage: pagination.current,
              limit: pagination.pageSize,
            })
          );
        }}
        scroll={{ x: 'max-content', y: 100 * 5 }}
        marginleft="-10px"
        marginright="-10px"
      />
    </>
  );
};

export default ImportCsvListTable;
