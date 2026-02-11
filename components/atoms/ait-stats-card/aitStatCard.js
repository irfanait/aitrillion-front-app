// atoms/StatCard.tsx
import { Card, Col, Row, Skeleton, Typography } from 'antd';
import { StyleCard } from './style';

const { Title, Text } = Typography;

const AitStatCard = ({
  icon,
  label,
  value,
  loading = false,
  iconheight = '',
  iconwidth = '',
}) => (
  <StyleCard>
    <Row
      gutter={[
        { xs: 10, sm: 10, lg: 0 },
        { xs: 7, sm: 10, lg: 0 },
      ]}
      justify={{ xs: 'center', sm: 'center', lg: 'space-between' }}
      align={'middle'}
    >
      <Col
        xs={{ span: 24, order: 2, justify: 'center' }}
        sm={{ span: 24, order: 2, justify: 'center' }}
        lg={{ span: 16, order: 1 }}
      >
        <Title type="primary" level={3} style={{ margin: 0 }}>
          {loading ? (
            <div style={{ width: '100%', maxWidth: 400 }}>
              <Skeleton.Button
                block
                active
                style={{
                  width: '2%',
                  height: 20,
                }}
              />
            </div>
          ) : (
            value
          )}
        </Title>
        <Text type="secondary">{label}</Text>
      </Col>
      <Col
        xs={{ span: 24, order: 1, justify: 'center' }}
        sm={{ span: 24, order: 1, justify: 'center' }}
        lg={{ span: 8, order: 2 }}
      >
        {icon}
      </Col>
    </Row>
  </StyleCard>
);

export default AitStatCard;
