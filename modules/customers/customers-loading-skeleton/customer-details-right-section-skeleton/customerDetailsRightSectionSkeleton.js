import React from 'react';
import { Col, Row, Skeleton } from 'antd';
import {
  RightContentScroll,
  RightSectionWrapper,
  SkeletonCard,
  SkeletonCol,
  SkeletonRow,
  SkeletonTitle,
} from './style';
import AitCard from '@/components/atoms/ait-card/aitCard';

const { Input, Button } = Skeleton;

const CustomerDetailsRightSkeleton = () => {
  return (
    <AitCard
      hascustomheader
      hastabs
      custombodypadding={{ xs: '0px', sm: '0px', md: '0px' }}
      customheaderleft={
        <div
          style={{ marginBottom: 10, marginTop: 10, display: 'flex', gap: 40 }}
        >
          <Input
            active
            size="small"
            style={{ width: '80%', marginBottom: 12 }}
            block={true}
          />
          <Input
            active
            size="small"
            style={{ width: '80%', marginBottom: 12 }}
            block={true}
          />
          <Input
            active
            size="small"
            style={{ width: '80%', marginBottom: 12 }}
            block={true}
          />
        </div>
      }
    >
      <RightSectionWrapper>
        <RightContentScroll>
          <SkeletonCard>
            <Row>
              <Col xs={24} md={12}>
                <SkeletonTitle>
                  <Input active size="small" />
                </SkeletonTitle>
                <Row>
                  {[...Array(6)].map((_, i) => (
                    <Col xs={24} md={12}>
                      <Input
                        key={i}
                        active
                        size="small"
                        style={{ width: '80%', marginBottom: 12 }}
                      />
                    </Col>
                  ))}
                </Row>
              </Col>
              <Col xs={24} md={12}>
                <SkeletonTitle>
                  <Input active size="small" style={{ width: 160 }} />
                </SkeletonTitle>
                <Row>
                  {[...Array(6)].map((_, i) => (
                    <Col xs={24} md={12}>
                      <Input
                        key={i}
                        active
                        size="small"
                        style={{ width: '80%', marginBottom: 12 }}
                      />
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </SkeletonCard>
          <SkeletonCard>
            <Row>
              <Col xs={24} md={24} style={{ marginBottom: 20 }}>
                <SkeletonTitle>
                  <Input
                    active
                    size="small"
                    style={{ width: 300, marginBottom: 10 }}
                  />
                </SkeletonTitle>
                <SkeletonTitle>
                  <Input
                    active
                    size="small"
                    style={{ width: 400, marginBottom: 10 }}
                  />
                </SkeletonTitle>
                <Row>
                  {[...Array(2)].map((_, i) => (
                    <>
                      <Col xs={24} md={10}>
                        <Input
                          key={i}
                          active
                          size="small"
                          block={true}
                          style={{ marginBottom: 16 }}
                        />
                      </Col>
                      <Col xs={24} md={2}></Col>
                      <Col xs={24} md={10}>
                        <Input
                          key={i}
                          active
                          size="small"
                          block={true}
                          style={{ marginBottom: 16 }}
                        />
                      </Col>
                    </>
                  ))}
                </Row>
              </Col>
            </Row>
          </SkeletonCard>
        </RightContentScroll>
      </RightSectionWrapper>
    </AitCard>
  );
};

export default CustomerDetailsRightSkeleton;
