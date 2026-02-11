import { Alert, Card, Tag } from 'antd';
import styled from 'styled-components';

export const ScrollContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ContentWrapper = styled.div`
  max-width: 700px;
  width: 100%;
  h5.ant-typography {
    margin-bottom: 24px;
    color: var(--ant-color-text-primary);
  }
`;

export const OptionCard = styled(Card)`
  .ant-card-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
  }

  &:hover {
    border-color: var(--ant-color-primary);
    box-shadow: 0px 13px 18px rgba(0, 0, 0, 0.08);
  }
`;

export const IconWrapper = styled.div`
  font-size: 32px;
  margin-bottom: 16px;
`;

export const Description = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
  color: var(--ant-color-text-secondary);
`;

export const PopularTag = styled(Tag)`
  margin-top: auto;
  font-size: 12px;
  background-color: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
  position: absolute;
  top: 12px;
  right: 12px;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--ant-color-text-primary);
`;

export const AlertWrapper = styled.div`
  display: flex;
  justifycontent: center;
  alignitems: center;
`;
export const StyledAlert = styled(Alert)`
  margin-bottom: 10px;
  width: 700px;
`;

export const SpinWrapper = styled.div`
  display: flex;
  justifycontent: center;
  alignitems: center;
  height: 120;
`;
