import React from 'react';
import { Skeleton, Row, Col, Divider, Card } from 'antd';

const { Button, Input } = Skeleton;

const CreateCouponFormSkeleton = () => {
  return (
    <Card
      style={{
        borderRadius: '10px',
        background: '#fff',
        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
        padding: 24,
      }}
    >
      <Row gutter={[24, 16]}>
        {/* Header radio buttons */}
        <Col xs={24}>
          <Button active size="large" style={{ width: '100%', height: 80 }} />
        </Col>
        <Col xs={24}>
          <Button active size="large" style={{ width: '100%', height: 80 }} />
        </Col>

        <Divider />

        {/* General Info Heading */}
        <Col xs={24}>
          <Input active style={{ width: 180, height: 20 }} />
        </Col>

        {/* Coupon Name / Prefix */}
        <Col xs={24} md={12}>
          <Input active style={{ width: '100%', height: 40 }} />
        </Col>
        <Col xs={24} md={12}>
          <Input active style={{ width: '100%', height: 40 }} />
        </Col>

        <Divider />

        {/* Discount type & amount */}
        <Col xs={24} md={4}>
          <Input active style={{ width: '100%', height: 40 }} />
        </Col>
        <Col xs={24} md={8}>
          <Input active style={{ width: '100%', height: 40 }} />
        </Col>
        <Col xs={24} md={8}>
          <Input active style={{ width: '100%', height: 40 }} />
        </Col>

        <Divider />

        {/* Applies To Section */}
        <Col xs={24}>
          <Input active style={{ width: 160, height: 20 }} />
        </Col>
        <Col xs={24}>
          <Button active style={{ width: '100%', height: 70 }} />
        </Col>
        <Col xs={24} md={6}>
          <Input active style={{ width: '100%', height: 40 }} />
        </Col>

        <Divider />

        {/* Activation Section */}
        <Col xs={24}>
          <Input active style={{ width: 120, height: 20 }} />
        </Col>
        <Col xs={24}>
          <Button active style={{ width: '100%', height: 70 }} />
        </Col>
        <Col xs={24} md={6}>
          <Input active style={{ width: '100%', height: 40 }} />
        </Col>

        <Divider />

        {/* Usage Limits Section */}
        <Col xs={24}>
          <Input active style={{ width: 160, height: 20 }} />
        </Col>
        <Col xs={24}>
          <Button active style={{ width: '100%', height: 50 }} />
        </Col>
        <Col xs={24} md={6}>
          <Input active style={{ width: '100%', height: 40 }} />
        </Col>

        <Divider />

        {/* Expiration Section */}
        <Col xs={24}>
          <Input active style={{ width: 160, height: 20 }} />
        </Col>
        <Col xs={24}>
          <Button active style={{ width: '100%', height: 70 }} />
        </Col>
        <Col xs={24} md={6}>
          <Input active style={{ width: '100%', height: 40 }} />
        </Col>

        <Divider />

        {/* Time Zone */}
        <Col xs={24} md={6}>
          <Input active style={{ width: '100%', height: 40 }} />
        </Col>

        {/* Buttons */}
        <Col xs={24} style={{ display: 'flex', gap: 12 }}>
          <Button active size="large" style={{ width: 150, height: 40 }} />
          <Button active size="large" style={{ width: 100, height: 40 }} />
        </Col>
      </Row>
    </Card>
  );
};

export default CreateCouponFormSkeleton;
