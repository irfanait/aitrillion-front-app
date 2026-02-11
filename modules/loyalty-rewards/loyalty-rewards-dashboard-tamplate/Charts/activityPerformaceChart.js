import {
  Card,
  Col,
  ConfigProvider,
  Divider,
  Empty,
  Flex,
  Row,
  Space,
  Table,
  Typography,
  Grid,
} from 'antd';
import {
  ChartBox,
  DonutCard,
  Icon,
  IconContainer,
  IconLabel,
  IconWrapper,
  // MiniStat,
  CustomDivider,
} from '../style';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
} from 'recharts';
import { checkValidCount, checkValidData } from '@/utils/common.util';
import AitCard from '@/components/atoms/ait-card/aitCard';
import CustomAitTable from '@/components/molecules/custom-ait-table';
const { useBreakpoint } = Grid;

const { Title, Text } = Typography;

export default function ActivityPerformanceChart({
  performanceTabData,
  chartData,
}) {
  const screens = useBreakpoint();
  const perfCols = [
    {
      title: 'Activities',
      dataIndex: 'activity_name',
      key: 'activity_name',
      render: (row, cell) => (
        <IconWrapper>
          <IconContainer>
            <Icon
              src={`${process.env.NEXT_PUBLIC_APP_URL}/${cell?.icon}`}
              alt="icon"
            />
          </IconContainer>
          <IconLabel>{checkValidData(row)}</IconLabel>{' '}
        </IconWrapper>
      ),
    },
    {
      title: 'Total activities',
      dataIndex: 'total_activity_count',
      key: 'total_activity_count',
      width: 140,
    },
    {
      title: 'Unique members',
      dataIndex: 'unique_customers',
      key: 'unique_customers',
      width: 160,
    },
    {
      title: 'Earned points',
      dataIndex: 'total_points',
      key: 'total_points',
      width: 140,
    },
  ];
  const defaultPieData = [{ name: 'No Data', value: 100, color: '#d7e7efff' }];

  let pieData =
    chartData?.length > 0
      ? chartData.map(([name, value, color]) => ({ name, value, color }))
      : defaultPieData;

  let arr = performanceTabData?.report
    ?.map((item) => (parseFloat(item?.total_points) > 0 ? item : null))
    .filter(Boolean);

  return (
    <>
      <Col xs={24} md={8}>
        <DonutCard>
          <ChartBox>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={100}
                  paddingAngle={1}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ReTooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartBox>
          <ConfigProvider
            theme={{
              token: {
                colorBgContainer: '#F5F5F5',
                colorBorderSecondary: '#EAEBED',
                colorSplit: '#EAEBED',
                marginXS: 8,
              },
            }}
          >
            <AitCard
              bodypadding={{
                md: '16px 16px 10px 16px',
                sm: '16px 16px 10px 16px',
                sm: '16px 16px 10px 16px',
              }}
            >
              <Row gutter={12}>
                <Col xs={{ span: 24 }} sm={{ flex: 'auto' }}>
                  <Flex justify="center" align="center" vertical gap={0}>
                    <Title
                      level={4}
                      style={{ marginTop: '0', marginBlock: '0' }}
                    >
                      {checkValidCount(performanceTabData?.total_unique_member)}
                    </Title>
                    <Text type="default">Unique members</Text>
                  </Flex>
                </Col>
                <Col xs={{ span: 24 }} sm={{ flex: 'auto' }}>
                  <CustomDivider
                    orientation="vertical"
                    colorSplit="red"
                    screens={screens}
                  />
                </Col>
                <Col xs={{ span: 24 }} sm={{ flex: 'auto' }}>
                  <Flex justify="center" align="center" vertical gap={0}>
                    <Title
                      level={4}
                      style={{ marginTop: '0', marginBlock: '0' }}
                    >
                      {checkValidCount(performanceTabData?.total_earned_points)}
                    </Title>
                    <Text type="default">Earned points</Text>
                  </Flex>
                </Col>
              </Row>
            </AitCard>
          </ConfigProvider>
        </DonutCard>
      </Col>

      <Col xs={24} md={16}>
        <AitCard bodypadding={{ xs: '0px 0px', sm: '0px 0px', md: '0px 0px' }}>
          <CustomAitTable
            showTotalCount={false}
            headerbgcolor="#F5F5F5"
            marginleft={'0px'}
            marginright={'0px'}
            locale={{
              emptyText: (
                <Empty
                  description="No data available"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
            size="small"
            pagination={false}
            columns={perfCols}
            tableData={arr}
            bodycellpadddingtopbottom={'10px'}
          />
        </AitCard>
      </Col>
    </>
  );
}
