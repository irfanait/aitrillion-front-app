import React from 'react';
import AitButton from '@/components/atoms/ait-button/aitButton';

import AitTable from '@/components/molecules/ait-table/aitTable';
import { DeleteFilled } from '@ant-design/icons';
import { Space } from 'antd';
import { useSelector } from 'react-redux';

const ManageOptionsListTable = (props) => {
  const { handleDeleteClick } = props;
  //   const dispatch = useDispatch();

  const { getCustomFieldOptionsLoading, getCustomFieldOptionsList } =
    useSelector((state) => state.customFieldsState);

  const columns = [
    {
      title: 'Option name',
      dataIndex: 'option_lable',
      key: 'option_lable',
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
      title: 'Option value',
      dataIndex: 'option_value',
      key: 'option_value',
      width: 200,
      sorter: true,
    },
    {
      title: 'Default',
      sorter: true,
      dataIndex: 'is_default',
      key: 'is_default',
      width: 100,
      render: (_, value) => (value === 1 || value === '1' ? 'Yes' : 'No'),
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 80,
      render: (_, record) => (
        <Space direction="vertical">
          <AitButton
            color="primary"
            variant="text"
            title=""
            danger
            icon={<DeleteFilled />}
            onClick={() => handleDeleteClick(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <AitTable
      rowKey="id"
      heading=""
      loading={getCustomFieldOptionsLoading}
      columns={columns}
      dataSource={getCustomFieldOptionsList}
      showFilters={false}
      pagination={false}
      showSorterTooltip={false}
      scroll={{ x: 'max-content', y: 100 * 5 }}
      marginleft="-10px"
      marginright="-10px"
    />
  );
};

export default ManageOptionsListTable;
