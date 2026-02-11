import styled from 'styled-components';
import { Typography } from 'antd';

export const LabelText = styled(Typography.Text)`
  font-weight: 500;
  color: #888;
`;

export const ValueText = styled(Typography.Text)`
  font-weight: 400;
  color: #000;
`;

export const Container = styled.div`
  background-color: #fff;
  padding: 14px;
  border-radius: 8px;
`;

export const Section = styled.div`
  margin-bottom: 12px;
`;

export const HorizontalLine = styled.hr`
  border: none;
  border-top: 1px solid #f0f0f0;
  margin: 24px 0;
`;

export const Bold = styled.span`
  font-weight: 600;
`;

export const FooterButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 32px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: flex-start;
  }
`;
