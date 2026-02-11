import styled from 'styled-components';
import { Card, Row, Space } from 'antd';

export const StyleVideoWrapper = styled.div`
  margin-top: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0px 8px;

  .videoIframe {
    width: 100%;
  }

  .modal-subtitle {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

export const ButtonWrapper = styled(Row)`
  margin-top: 8px;
`;

export const StyledCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;

  .ant-card-cover img {
    width: 100%;
    transition: transform 1s ease-in-out;
    transform: scale(1);
  }
  .ant-card-cover:hover {
    overflow: hidden;
  }
  .ant-card-cover:hover img {
    transition: transform 1s ease-in-out;
    transform: scale(1.1);
  }
  .ant-card-body {
    padding: 12px 16px 16px 16px;
  }

  @media (max-width: 768px) {
    .ant-card-body {
      padding: 12px;
    }
  }
`;

export const ModalTitleRow = styled(Space)`
  width: 100%;
  display:flex;
  align-items: center;
  gap: 12px !important;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

export const PlayBadge = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: #eef4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ant-color-primary);
  flex: 0 0 auto;

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`;

export const VideoFrameWrap = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 */
  border-radius: 8px;
  overflow: hidden;
  background: #000;

  @media (max-width: 768px) {
    padding-top: 75%; /* Adjusting for smaller screens */
  }
`;

export const IFrame = styled.iframe`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
`;
