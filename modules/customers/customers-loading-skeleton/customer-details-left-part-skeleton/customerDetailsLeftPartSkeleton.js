import React from 'react';
import { Skeleton } from 'antd';
import AitCard from '@/components/atoms/ait-card/aitCard';
import {
  LeftScrollableWrapper,
  SkeletonHeaderWrapper,
  SkeletonSection,
  SkeletonRow,
  SkeletonLeft,
  SkeletonRight,
} from './style';

const { Input, Avatar, Button } = Skeleton;

const CustomerDetailsLeftSkeleton = () => {
  return (
    <LeftScrollableWrapper>
      <AitCard
        bodyBorderTop="none"
        headerpadding={{
          xs: '15px 20px',
          sm: '15px 20px',
          md: '15px 20px',
        }}
        bodypadding={{
          xs: 'px 0px 20px 0px',
          sm: '0px 0px 20px 0px',
          md: '0px 0px 20px 0px',
        }}
        style={{ borderRadius: 12 }}
      >
        {/* PROFILE HEADER */}
        <SkeletonHeaderWrapper style={{ borderRadius: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar active size={48} shape="circle" />

            <div style={{ flex: 1 }}>
              <Input
                active
                size="small"
                style={{ width: '100%', marginTop: 6 }}
              />
            </div>

            <Button active size="large" style={{ width: 80, height: '20px' }} />
          </div>
        </SkeletonHeaderWrapper>

        {/* DETAILS SECTION */}
        <SkeletonSection>
          <Input active size="small" style={{ width: 140, marginBottom: 12 }} />

          {[...Array(10)].map((_, i) => (
            <SkeletonRow key={i}>
              <SkeletonLeft>
                <Input active size="small" />
              </SkeletonLeft>
              <SkeletonRight>
                <Input active size="small" />
              </SkeletonRight>
            </SkeletonRow>
          ))}
        </SkeletonSection>

        {/* ADDRESS SECTION */}
        <SkeletonSection>
          <Input active size="small" style={{ width: 140, marginBottom: 12 }} />

          {[...Array(5)].map((_, i) => (
            <SkeletonRow key={i}>
              <SkeletonLeft>
                <Input active size="small" />
              </SkeletonLeft>
              <SkeletonRight>
                <Input active size="small" />
              </SkeletonRight>
            </SkeletonRow>
          ))}
        </SkeletonSection>

        {/* TAG SECTION */}
        <SkeletonSection>
          <SkeletonRow>
            <Input active size="small" style={{ marginTop: 10 }} />
            <Input active size="small" style={{ marginTop: 10 }} />
          </SkeletonRow>
        </SkeletonSection>
      </AitCard>
    </LeftScrollableWrapper>
  );
};

export default CustomerDetailsLeftSkeleton;
