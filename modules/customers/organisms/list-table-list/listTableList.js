import AitTable from '@/components/molecules/ait-table/aitTable';
import { DownOutlined, EllipsisOutlined, UpOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Typography } from 'antd';
import AitPopover from '@/components/atoms/ait-popver/aitPopover';
import ListActionContent from '../../molecules/list-action-content/listActionContent';
import moment from 'moment';
import {
  setLimit,
  setPage,
  setSort,
} from '@/redux/customers-slice/list-slices/listSlice';
import { useRouter } from 'next/router';
import { formatDateSafe } from '../../utils/helper';
const { Text } = Typography;

const ListTableList = ({
  handleEdit,
  handleDeleteClick,
  handleExportListClick,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { list, loading, totalRecords, filters } = useSelector(
    (s) => s.listState
  );
  const [openRow, setOpenRow] = useState(null);
  const [popoverVisible, setPopoverVisible] = useState(null);

  const toggleDescription = (id) => {
    setOpenRow(openRow === id ? null : id);
  };

  const columns = [
    {
      title: 'List id',
      dataIndex: 'id',
      sorter: true,
      width: 80,
    },
    // {
    //   title: 'Internal name',
    //   dataIndex: 'internal_name',
    //   key: 'internal_name',
    //   width: 200,
    //   sorter: true,
    //   ellipsis: false,
    //   render: (_, record) => record.internal_name,
    // },
    {
      title: 'External name',
      sorter: true,
      dataIndex: 'external_name',
      width: 200,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      sorter: true,
      width: 200,
      render: (_, record) => record?.description || '--',
    },

    {
      title: 'Contacts',
      dataIndex: 'list_customer_count',
      sorter: true,
      width: 80,
    },
    {
      title: 'Created date',
      sorter: true,
      dataIndex: 'date_created',
      width: 150,
      render: (value) => formatDateSafe(value),
    },
    {
      title: 'Updated date',
      sorter: true,
      dataIndex: 'date_updated',
      width: 150,
      render: (_, record) =>
        formatDateSafe(record.date_updated, record.date_created),
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <AitPopover
          content={
            <ListActionContent
              record={record}
              // status={record.status_text}
              handleEdit={(data) => {
                handleEdit(data);
                setPopoverVisible(null);
              }}
              handleDeleteClick={(data) => {
                handleDeleteClick(data);
                setPopoverVisible(null);
              }}
              handleExportListClick={(data) => {
                handleExportListClick(data);
                setPopoverVisible(null);
              }}
              handleSendCammpaignClick={() => {
                router.push(
                  `/email-marketing/campaign/create-campaign?listId=${record.id}`
                );
                setPopoverVisible(null);
              }}
              handleViewCustomerClick={() => {
                router.push(
                  `/customers/all-customers/list?listId=${record.id}`
                );
              }}
              handleImportContactClick={() => {
                router.push(
                  `/customers/import-csv/upload-csv?listId=${record.id}`
                );
                setPopoverVisible(null);
              }}
            />
          }
          trigger="click"
          placement="bottomRight"
          overlayClassName="action-dropdown"
          open={popoverVisible === record.id}
          onOpenChange={(visible) =>
            setPopoverVisible(visible ? record.id : null)
          }
        >
          <Button type="text" color="primary" shape="circle" size={'large'}>
            <EllipsisOutlined />
          </Button>
        </AitPopover>
      ),
    },
  ];

  return (
    <AitTable
      rowKey="id"
      heading=""
      loading={loading}
      columns={columns}
      dataSource={list}
      showFilters={false}
      pagination={{
        current: filters.currentPage,
        pageSize: filters.limit,
        total: totalRecords,
        showSizeChanger: true,
      }}
      onChange={(pagination, filterData, sorter) => {
        // pagination
        if (pagination?.current !== filters.currentPage) {
          dispatch(setPage(pagination.current));
        }

        if (pagination?.pageSize !== filters.limit) {
          dispatch(setLimit(pagination.pageSize));
        }

        // sorting
        if (sorter && sorter.order) {
          dispatch(
            setSort({
              field: sorter.field,
              order: sorter.order === 'ascend' ? 1 : 0,
            })
          );
        }
      }}
      showSorterTooltip={false}
      scroll={{ x: 'max-content', y: 100 * 5 }}
      marginleft="-10px"
      marginright="-10px"
      filterheaderbottomspace="0px"
    />
  );
};

export default ListTableList;
