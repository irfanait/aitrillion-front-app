import React from 'react';
import { Typography } from 'antd';
import { useSelector } from 'react-redux';
import AitPopover from '@/components/atoms/ait-popver/aitPopover';
import { EllipsisOutlined } from '@ant-design/icons';
import AitTable from '@/components/molecules/ait-table/aitTable';
import { useRouter } from 'next/router';
import SegmentActionContent from '../../molecules/segment-action-content/segmentActionContent';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { StyledTag } from './style';
const { Text, Title } = Typography;

const SegmentListTable = (props) => {
  const {
    handleSearch,
    handleTableChange,
    handleDeleteSegmentClick,
    handleExportSegmentClick,
  } = props;
  const router = useRouter();

  const segmentState = useSelector((state) => state.segmentState);
  const { filters, totalCustomersCount, segmentList, segmentListLoading } =
    segmentState;

  const segmentListTableColumns = [
    {
      title: 'Segment name',
      dataIndex: 'title',
      key: 'title',
      width: 150,
      sorter: true,
      render: (_, record) => {
        const handleSegmentNameClick = () => {
          router.push(`/customers/all-customers/list?segment_id=${record?.id}`);
        };

        return (
          <div>
            <Text
              onClick={handleSegmentNameClick}
              style={{
                color: 'rgb(26, 115, 232)',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {record.title}
            </Text>
          </div>
        );
      },
    },
    {
      title: 'Description',
      key: 'description',
      dataIndex: 'description',
      width: 300,
      sorter: true,
      render: (_, record) => (
        <>
          <Text>{record.description}</Text>
        </>
      ),
    },
    {
      title: 'Created date',
      key: 'created_date',
      dataIndex: 'created_date',
      width: 150,
      sorter: true,
      render: (_, record) => (
        <>
          <Text>{record.created_date}</Text>
        </>
      ),
    },
    {
      title: 'Updated date',
      key: 'modified_date',
      dataIndex: 'modified_date',
      width: 150,
      sorter: true,
      render: (_, record) => (
        <>
          <Text>{record.modified_date}</Text>
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <AitPopover
          content={
            <SegmentActionContent
              record={record}
              handleDeleteSegmentClick={(segmentId) => {
                handleDeleteSegmentClick(segmentId);
              }}
              handleExportSegmentClick={(segmentId) =>
                handleExportSegmentClick(segmentId)
              }
            />
          }
          trigger="click"
          placement="bottomRight"
          overlayClassName="action-dropdown"
        >
          <AitButton
            type="text"
            color="primary"
            shape="circle"
            size={'large'}
            height= "40px"
            width= "40px"
            padding="0px"
            icon={<EllipsisOutlined />}
          />
        </AitPopover>
      ),
    },
  ];

  return (
    <>
      <Title type="primary" level={4} style={{ margin: 0 }}>
        Segments 
     
      <StyledTag>
        {totalCustomersCount}
        </StyledTag>
         </Title>
      <AitTable
        rowKey={(record) => record.id || record.key}
        heading=""
        dataSource={segmentList}
        loading={segmentListLoading}
        columns={segmentListTableColumns}
        onSearch={handleSearch}
        onChange={handleTableChange}
        showSearchInput={true}
        searchInputLabel="Search segments"
        showFilters={false}
        pagination={{
          current: Number(filters.currentPage),
          pageSize: Number(filters.limit),
          total: Number(totalCustomersCount) || 0, // ← instead of totalCustomersCount?.All
          showSizeChanger: true,
        }}
        scroll={{ x: 'max-content', y: 100 * 6 }}
        marginleft="-10px"
        marginright="-10px"
      />
    </>
  );
};

export default SegmentListTable;
