// import CustomAitTable from '@/components/molecules/custom-ait-table';

import { Card, Row, Layout, Typography } from 'antd';
import styled from 'styled-components';

// const { Card, Button, Layout, Row, Table, Typography } = require('antd');
// const { default: styled } = require('styled-components');

const { Text } = Typography;

export const PageWrapper = styled(Layout)`
  background-color: #fafcff;
`;

export const SummaryCard = styled(Card)`
  text-align: center;
  height: 100%;
  .ant-card-body {
    padding: 20px;
  }
  h2 {
    color: #2b2b2b;
    margin-bottom: 5px;
  }
  span {
    font-size: 14px;
    color: #888;
  }
`;

export const TableContainer = styled(Card)`
  margin-top: 24px;
  border-radius: 10px;
  overflow: hidden;
  .ant-card-body {
    padding: 9px 0px 0px 24px;
    .ant-typography {
      line-height: 0.4;
    }
    .ant-row-space-between {
      margin: 0 !important;
    }
  }
`;

export const Wrapper = styled.div``;

export const Header = styled.div`
  text-align: center;
  border-bottom: 1px solid #e4e4e7;
  padding-bottom: 10px;
  margin-bottom: 15px;

  h2 {
    font-size: 18px;
    font-weight: 500;
    color: #333;
  }
`;

export const AvatarCircle = styled.div`
  background-color: #f4b400;
  color: #fff;
  font-size: 28px;
  font-weight: 600;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CenterContent = styled.div`
  text-align: center;
  margin-bottom: 20px;
  max-width: 310px;
  margin-left: auto;
  margin-right: auto;

  p {
    margin: 0;
    color: #666;
  }
`;

export const PointsCard = styled(Card)`
  text-align: center;
  border-radius: 10px;
  border: 1px solid #e4e4e7;
  margin: 15px auto;
  max-width: 250px;
  background: #fff;

  .ant-card-body {
    padding: 16px;
  }

  h2 {
    color: #1a1a1a;
    margin-bottom: 4px;
  }

  p {
    color: #3b82f6;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  svg {
    font-size: 18px;
    color: #f4b400;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  max-width: 250px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  margin-top: 10px;
  .ant-btn {
    flex: 1 1 auto;
    width: 100%;
  }

  @media (max-width: 400px) {
    flex-direction: column;

    .ant-btn {
      flex: 1 1 auto;
      width: 100%;
    }
  }
`;

export const InfoSection = styled.div`
  border-top: 1px solid #e4e4e7;
  padding: 15px 20px;
  font-size: 14px;
  color: #333;

  p {
    display: flex;
    justify-content: space-between;
    margin: 0px 0px 10px 0px;
  }

  button {
    width: 100%;
    margin-top: 5px;
  }
`;

export const SwitchRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0px 0px 10px 0px;
  .ant-switch {
    width: 35px;
  }
`;

export const AlertBox = styled.div`
  background-color: ${(props) => props.backgroundColor || '#fef9e4'};
  color: #4f4f4f;
  padding: ${(props) => props.padding || ' 8px'};
  border-left: ${(props) => props.borderLeft || ' 5px solid #ffcc00'};
  font-family: Arial, sans-serif;
  font-size: 12px;
  max-width: auto;
  margin: 10px auto;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  display: flex;
  align-items: flex-start; /* Align icon to the top of the text */
  line-height: 1.4;
`;

export const HistoryWrapper = styled.div`
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    //padding: 20px;
  }

  h3 {
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 15px;
  }
`;

export const InfoGroup = styled.div`
  margin-bottom: 20px;

  .ant-typography {
    font-size: 14px;
  }
`;

export const DetailRow = styled(Row)`
  margin-bottom: 15px;
  padding: 0px 0px;
`;

export const Label = styled(Text)`
  font-weight: 600;
  color: #576f7c;
`;

export const Value = styled(Text)`
  color: #576f7c;
`;
