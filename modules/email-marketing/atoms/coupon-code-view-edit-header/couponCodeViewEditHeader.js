import React from 'react';
import { Row, Col, Typography, Button, Card } from 'antd';
import AitButton from '@/components/atoms/ait-button/aitButton';

const { Title } = Typography;

const CouponCodeViewEditHeader = ({
  title = 'View coupon info',
  onDelete,
  onBack,
  showDelete = true,
  showBack = true,
  deleteText = 'Delete',
  backText = 'Back to list',
}) => {
  return (
    <Card
      style={{
        marginBottom: 24,
      }}
    >
      <Row align="middle" justify="space-between" gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Title
            level={3}
            style={{
              fontWeight: 500,
            }}
          >
            {title}
          </Title>
        </Col>
        <Col
          xs={24}
          md={12}
          style={{
            textAlign: 'right',
          }}
        >
          {showDelete && (
            <AitButton
              htmlType="button"
              variant="outlined"
              color="primary"
              title={deleteText}
              style={{ marginRight: 8 }}
              onClick={onDelete}
            />
          )}
          {showBack && (
            <AitButton
              htmlType="button"
              variant="outlined"
              color="primary"
              title={backText}
              onClick={onBack}
            />
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default CouponCodeViewEditHeader;
