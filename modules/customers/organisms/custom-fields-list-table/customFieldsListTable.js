import React, { useState } from 'react';
import AitTable from '@/components/molecules/ait-table/aitTable';
import AitPopover from '@/components/atoms/ait-popver/aitPopover';
import { Button, Space } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import {
  setCustomFieldLimit,
  setCustomFieldPage,
  setCustomFieldSort,
} from '@/redux/customers-slice/custom-fields-slices/customFieldsSlices';
import moment from 'moment';
import AitButton from '@/components/atoms/ait-button/aitButton';

const CustomFieldsListTable = (props) => {
  const { handleEdit, handleDeleteClick, handleManageOptionsClick } = props;
  const dispatch = useDispatch();
  const optionTypes = [
    'select',
    'radio',
    'checkbox',
    'dropdown',
    'multiselect',
  ];

  const [popoverVisible, setPopoverVisible] = useState(null);

  const { list, loading, filters, totalRecords } = useSelector(
    (state) => state.customFieldsState
  );

  const columns = [
    {
      title: 'Label name',
      dataIndex: 'field_label',
      key: 'field_type',
      sorter: true,
      width: 200,
      onCell: () => ({
        style: {
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        },
      }),
    },
    {
      title: 'Type',
      dataIndex: 'field_type',
      key: 'field_type',
      width: 150,
      sorter: true,
    },
    {
      title: 'Group',
      sorter: true,
      dataIndex: 'group',
      width: 150,
    },
    {
      title: 'Created date',
      sorter: true,
      dataIndex: 'created_date',
      render: (value) => moment(value).format('MM-DD-YYYY'),
      width: 150,
    },
    {
      title: 'Updated date',
      sorter: true,
      dataIndex: 'modified_date',
      render: (value) => moment(value).format('MM-DD-YYYY'),
      width: 150,
    },
    {
      title: 'Manage option',
      key: 'manage_options',
      sorter: true,
      // dataIndex: 'manage',
      width: 150,
      render: (_, record) => (
        <div>
          {/* Show only for option-based field types */}
          {optionTypes.includes(record.field_type?.toLowerCase()) ? (
            <AitButton
              color="primary"
              variant="outlined"
              title="Manage options"
              padding={'3px 6px'}
              onClick={() => handleManageOptionsClick(record)}
              // style={{ minHeight: '29px', padding: '0px 6px 0px 6px' }}
            />
          ) : (
            <>
              <div>{'No options'}</div>
            </>
          )}
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <AitPopover
          content={
            <>
              <Space direction="vertical">
                <AitButton
                  color="primary"
                  variant="text"
                  title="Edit"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record)}
                />

                <AitButton
                  color="primary"
                  variant="text"
                  title="Delete"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteClick(record)}
                />
              </Space>
            </>
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
        if (pagination?.current !== filters.currentPage) {
          dispatch(setCustomFieldPage(pagination.current));
        }

        if (pagination?.pageSize !== filters.limit) {
          dispatch(setCustomFieldLimit(pagination.pageSize));
        }

        if (sorter && sorter.order) {
          dispatch(
            setCustomFieldSort({
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
      paginationbottomspace="0px"
    />
  );
};

export default CustomFieldsListTable;
