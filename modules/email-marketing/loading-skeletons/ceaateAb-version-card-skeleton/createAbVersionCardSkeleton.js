import React from 'react';
import { Card, Col, Row, Skeleton, Input } from 'antd';
import styled from 'styled-components';

const FormBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const PreviewBlock = styled.div`
  border-left: 1px solid #eee;
  padding-left: 24px;
  height: 100%;
`;

const VersionCardSkeleton = () => {
  return (
    <Card style={{ marginBottom: 24 }}>
      <Row gutter={[30, 24]}>
        <Col span={9}>
          <FormBlock>
            <div>
              <Skeleton.Input style={{ width: 350 }} active size="large" />
            </div>
            <div>
              <Skeleton.Input style={{ width: 350 }} active size="large" />
            </div>
            <div>
              <Skeleton.Input style={{ width: 350 }} active size="large" />
            </div>
            <div>
              <Skeleton.Input style={{ width: 350 }} active size="large" />
            </div>
            <div>
              <Skeleton.Input style={{ width: 350 }} active size="large" />
            </div>
            <div>
              <Skeleton.Input
                style={{ width: 350, marginBottom: 6 }}
                active
                size="large"
              />
            </div>
          </FormBlock>
        </Col>

        <Col span={15}>
          <PreviewBlock style={{justifyContent:'center',display: 'flex',flexWrap: 'wrap'}}>
            <Skeleton.Input active style={{ width: 500, marginBottom: 6, }} />
            <Skeleton.Image style={{ height: 300, width: 350, }} active />
          </PreviewBlock>
        </Col>
      </Row>
    </Card>
  );
};

export default VersionCardSkeleton;
