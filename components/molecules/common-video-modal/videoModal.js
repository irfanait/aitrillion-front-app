/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { Row, Col, Typography } from 'antd';
const { Text } = Typography;
import {
  StyledCard,
  ModalTitleRow,
  PlayBadge,
  StyleVideoWrapper,
  ButtonWrapper,
  VideoFrameWrap,
  IFrame,
} from './style';
import { BookOutlined, PlayCircleFilled } from '@ant-design/icons';

const CommonVideoModal = ({
  visible,
  setVisible,
  thumbnailSrc,
  title = '',
  modalSubTitle = '',
  videoUrl,
  knowledgeBaseUrl,
}) => {
  return (
    <>
      <StyledCard
        hoverable
        cover={<img src={thumbnailSrc} alt={title} />}
        onClick={() => setVisible(true)}
      >
        <ModalTitleRow>
          <PlayBadge>
            <PlayCircleFilled style={{ fontSize: 22 }} />
          </PlayBadge>
          <Text strong>{title}</Text>
        </ModalTitleRow>
      </StyledCard>

      <AitModal
        width={760}
        open={visible}
        footer={false}
        headerVisible={true}
        closeIconVisible={true}
        centered
        title={title}
        isHeaderAtCenter={true}
        setVisible={() => setVisible(false)}
        headerTitleLevel={3}
        cover={<img src={thumbnailSrc} alt={title} />}
      >
        <StyleVideoWrapper>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Text type="secondary" className="modal-subtitle">
                {modalSubTitle}
              </Text>
            </Col>
            <Col span={24}>
              <VideoFrameWrap>
                <IFrame
                  src={videoUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </VideoFrameWrap>
            </Col>
          </Row>
          <ButtonWrapper gutter={[16, 16]}>
            <Col span={24}>
              <AitButton
                title="Go to Knowledge Base"
                type="link"
                variant="outlined"
                color="primary"
                target="_blank"
                href={knowledgeBaseUrl}
                icon={<BookOutlined />}
              />
            </Col>
          </ButtonWrapper>
        </StyleVideoWrapper>
      </AitModal>
    </>
  );
};

export default CommonVideoModal;
