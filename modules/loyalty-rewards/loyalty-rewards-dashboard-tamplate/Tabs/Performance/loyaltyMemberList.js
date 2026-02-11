import { Button, Card, Empty, Table } from 'antd';
import Link from 'next/link';

function LoyaltyMemberList() {
  const latestMembers = [
    {
      key: 1,
      name: 'Shopifi10 User10',
      points: '100 Points',
      lastOrderDate: '09/15/2025 10:53 AM',
      lastAmount: '$0',
      lastActivity: 'Sign-Up Bonus',
      totalOrders: 0,
    },
    {
      key: 2,
      name: 'Shopifi09 User09',
      points: '100 Points',
      lastOrderDate: '09/15/2025 10:53 AM',
      lastAmount: '$0',
      lastActivity: 'Sign-Up Bonus',
      totalOrders: 0,
    },
    {
      key: 3,
      name: 'Shopifi08 User08',
      points: '100 Points',
      lastOrderDate: '09/15/2025 10:53 AM',
      lastAmount: '$0',
      lastActivity: 'Sign-Up Bonus',
      totalOrders: 0,
    },
    {
      key: 4,
      name: 'Sharique Anwar',
      points: '100 Points',
      lastOrderDate: '09/15/2025 10:53 AM',
      lastAmount: '$69.99',
      lastActivity: 'Make a Purchase',
      totalOrders: 1,
    },
    {
      key: 5,
      name: 'Shopifi07 User07',
      points: '150 Points',
      lastOrderDate: '09/15/2025 10:53 AM',
      lastAmount: '$0',
      lastActivity: 'Visit store',
      totalOrders: 0,
    },
    {
      key: 6,
      name: 'Shopifi06 User06',
      points: '150 Points',
      lastOrderDate: '09/15/2025 10:53 AM',
      lastAmount: '$0',
      lastActivity: 'Visit store',
      totalOrders: 0,
    },
  ];

  const latestMembersCols = [
    {
      title: 'Members name',
      dataIndex: 'name',
      key: 'name',
      render: (t) => <Link href="#">{t}</Link>,
    },
    { title: 'Lifetime points', dataIndex: 'points', key: 'points' },
    {
      title: 'Last order date',
      dataIndex: 'lastOrderDate',
      key: 'lastOrderDate',
    },
    { title: 'Last order amount', dataIndex: 'lastAmount', key: 'lastAmount' },
    { title: 'Last activity', dataIndex: 'lastActivity', key: 'lastActivity' },
    { title: 'Total orders', dataIndex: 'totalOrders', key: 'totalOrders' },
  ];
  return (
    <>
      <Card
        title="Latest loyalty members"
        extra={<Button type="link">View all</Button>}
      >
        <Table
          size="small"
          pagination={false}
          dataSource={latestMembers}
          columns={latestMembersCols}
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

export default LoyaltyMemberList;
