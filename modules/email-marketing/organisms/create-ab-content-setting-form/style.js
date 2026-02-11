import { Card, Typography } from 'antd';
import styled from 'styled-components';
const { Title, Text } = Typography;

export const Wrapper = styled.div`
  background: #fff;
  border-radius: 8px;
`;

export const SectionTitle = styled(Title)`
  margin-bottom: 15px;
`;

export const FieldGroup = styled.div`
  margin-bottom: 32px;
`;

export const InlineGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  label{
  margin-bottom:0px;
  }
  @media (max-width:576px){
  justify-content:space-between
  }
`;

export const PreviewCard = styled(Card)`
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
`;

export const PreviewTitle = styled(Title)`
  margin-bottom: 15px !important;
  display: block;
`;

export const PreviewRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eaeaea;

  &:last-child {
    border-bottom: none;
  }
`;

export const ColorBox = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: ${(props) => props.color};
  margin-right: 8px;
`;

export const LabelText = styled(Text)`
  display: flex;
  align-items: center;
`;
