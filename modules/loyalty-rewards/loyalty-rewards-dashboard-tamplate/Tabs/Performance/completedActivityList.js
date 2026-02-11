import { Button, Card, Empty, Table, Tag } from 'antd';
import Link from 'next/link';

function CompletedActivityList() {
  const latestActivityCols = [
    {
      title: 'Members',
      dataIndex: 'member',
      key: 'member',
      render: (t) => <Link href="#">{t}</Link>,
    },
    { title: 'Activity', dataIndex: 'activity', key: 'activity' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (t) => <Tag color="green">{t}</Tag>,
    },
    { title: 'Duration', dataIndex: 'duration', key: 'duration' },
  ];

  const latestActivity = [
    {
      key: 1,
      member: 'Shopifi10 User10',
      activity: 'Create an account',
      status: 'Approved',
      duration: '1 week ago',
    },
    {
      key: 2,
      member: 'Shopifi09 User09',
      activity: 'Create an account',
      status: 'Approved',
      duration: '1 week ago',
    },
  ];
  return (
    <>
      <Card
        title="Latest completed activity"
        extra={<Button type="link">View all</Button>}
      >
        <Table
          size="small"
          pagination={false}
          dataSource={latestActivity}
          columns={latestActivityCols}
          locale={{
            emptyText: (
              <Empty
                description="No data available"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Card>
    </>
  );
}

export default CompletedActivityList;
