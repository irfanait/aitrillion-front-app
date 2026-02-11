import { Col, Row, Typography } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';
const { Text } = Typography;

export const StyleWrapper = styled.div``;

export const StyleAllModulesWrapper = styled.div`
  padding: 30px;
  @media (max-width: 768px) {
    padding: 20px 20px;
  }
`;

export const StyleRecommendedSectionWrapper = styled.div`
  padding: 30px;
  background: #f8f8f8;

  @media (max-width: 768px) {
    .ant-collapse .ant-collapse-content > .ant-collapse-content-box {
      padding: 0px 0px 0px 0px !important;
    }
    .ant-collapse .ant-collapse-header {
      padding: 0px 0px 0px 0px !important;
    }
  }
`;

export const StyleDrawerheading = styled(Row)`
  margin-bottom: ${({ spacingbottom }) => spacingbottom || '10px'};
  h5 {
    margin-bottom: 0px;
  }
`;
