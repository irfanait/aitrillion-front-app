import React from 'react';
import { Skeleton, Space, Divider } from 'antd';
import styled from 'styled-components';

const Section = styled.div`
  margin-bottom: 24px;
`;

const FullWidthSkeletonInput = styled(Skeleton.Input)`
  width: 100% !important;
`;

const HalfWidthRow = styled.div`
  display: flex;
  margin-top: 20px;
  width:"100%;
  gap: 16px;
`;

const CreateCampaignLeftSkeleton = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h3>
        <Skeleton.Input style={{ width: 200 }} active size="small" />
      </h3>

      {/* Campaign Name */}
      <Section style={{ marginTop: '20px' }}>
        {/* <Skeleton paragraph={false} active title={{ width: 120 }} /> */}
        <FullWidthSkeletonInput active size="default" />
      </Section>

      {/* Subject */}
      <Section style={{ marginTop: '20px' }}>
        <FullWidthSkeletonInput
          active
          size="default"
          style={{ marginTop: 16 }}
        />
        <FullWidthSkeletonInput
          active
          size="default"
          style={{ marginTop: 12 }}
        />
        <FullWidthSkeletonInput
          active
          size="default"
          style={{ marginTop: 12 }}
        />
      </Section>

      {/* Shortcode */}
      <Section>
        <Skeleton paragraph={false} active title={{ width: 100 }} />
        <FullWidthSkeletonInput active size="default" />
      </Section>

      <Divider />

      {/* Target audience */}
      <Section>
        <Skeleton.Input style={{ width: 160 }} active size="small" />
        <FullWidthSkeletonInput
          active
          size="default"
          style={{ marginTop: 16 }}
        />
        <FullWidthSkeletonInput
          active
          size="default"
          style={{ marginTop: 12 }}
        />
        <FullWidthSkeletonInput
          active
          size="default"
          style={{ marginTop: 12 }}
        />
      </Section>

      <Divider />

      {/* Email settings */}
      <Section>
        <Skeleton paragraph={false} active title={{ width: 120 }} />
        <FullWidthSkeletonInput
          active
          size="default"
          style={{ marginTop: 8 }}
        />
        <FullWidthSkeletonInput
          active
          size="default"
          style={{ marginTop: 12 }}
        />

        {/* Buttons */}
        <Section>
          <HalfWidthRow>
            <FullWidthSkeletonInput
              active
              size="default"
              style={{ marginTop: 8 }}
            />
            <FullWidthSkeletonInput
              active
              size="default"
              style={{ marginTop: 12 }}
            />
            <FullWidthSkeletonInput
              active
              size="default"
              style={{ marginTop: 12 }}
            />
          </HalfWidthRow>
        </Section>
      </Section>
    </div>
  );
};

export default CreateCampaignLeftSkeleton;
