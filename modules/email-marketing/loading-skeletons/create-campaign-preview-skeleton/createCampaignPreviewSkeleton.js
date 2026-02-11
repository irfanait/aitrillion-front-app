import React from 'react';
import { Skeleton, Space } from 'antd';
import styled from 'styled-components';

const PreviewWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentContainer = styled.div`
  width: 100%;
  padding: 32px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ImageSkeleton = styled(Skeleton.Image)`
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 4px;
`;

const ButtonSkeleton = styled(Skeleton.Button)`
  width: 160px;
  height: 48px;
  margin-top: 24px;
`;

const SectionBlock = styled.div`
  margin-bottom: 48px;
  text-align: center;
`;

const CreateCampaignPreviewSkeleton = () => {
  return (
    <PreviewWrapper>
      <ContentContainer>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {/* Top Hero Section */}
          <SectionBlock>
            <ImageSkeleton active />
            <Skeleton
              active
              title={{ width: '70%' }}
              paragraph={{ rows: 2, width: ['90%', '95%'] }}
              style={{ marginTop: 24 }}
            />
            <ButtonSkeleton active />
          </SectionBlock>

          {/* Subheadline + Paragraph */}
          <SectionBlock>
            <Skeleton.Input active style={{ width: '50%', height: 32 }} />
            <Skeleton
              active
              paragraph={{ rows: 2, width: ['95%', '90%'] }}
              style={{ marginTop: 24 }}
            />
          </SectionBlock>

          {/* Image + Description Block */}
          <SectionBlock>
            <ImageSkeleton active />
            <Skeleton
              active
              paragraph={{ rows: 3, width: ['85%', '75%', '80%'] }}
              style={{ marginTop: 24 }}
            />
          </SectionBlock>
        </Space>
      </ContentContainer>
    </PreviewWrapper>
  );
};

export default CreateCampaignPreviewSkeleton;
