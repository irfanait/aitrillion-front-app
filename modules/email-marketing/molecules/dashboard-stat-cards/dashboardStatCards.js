import AitStatCard from '@/components/atoms/ait-stats-card/aitStatCard';
import { Col, Row } from 'antd';
import Link from 'next/link';
import React from 'react';

const DashboardStatCards = ({
  data = [],
  xs,
  sm,
  md,
  loading,
  iconheight,
  iconwidth,
}) => {
  return (
    <Row gutter={[20, 10]} style={{ marginBottom: 12 }}>
      {data?.map(({ label, icon, value, link }) => (
        <Col xs={xs || 12} sm={sm || 12} md={md || 6} key={label}>
          {link ? (
            <Link href={link}>
              <AitStatCard
                label={label}
                icon={icon}
                value={value}
                loading={loading}
                iconheight={iconheight}
                iconwidth={iconwidth}
              />
            </Link>
          ) : (
            <AitStatCard
              label={label}
              icon={icon}
              value={value}
              extraloading={loading}
              iconheight={iconheight}
              iconwidth={iconwidth}
            />
          )}
        </Col>
      ))}
    </Row>
  );
};
export default DashboardStatCards;
