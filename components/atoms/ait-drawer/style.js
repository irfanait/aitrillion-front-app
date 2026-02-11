import styled from 'styled-components';
import { Drawer, Typography } from 'antd';

const { Title } = Typography;

export const DrawerWrapper = styled(Drawer)``;

export const DrawerContainer = styled.div`
  width: ${({ width }) => width || 'auto'};
  padding: ${({ padding }) =>
    typeof padding === 'number' ? `${padding}px` : padding || '0'};
  height: 100%;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: ${({ forMobileResponsive }) =>
      forMobileResponsive ? '100%' : 'auto'};
    padding: 0;
  }
`;

export const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  height: ${({ headerHeight }) => headerHeight || '60px'};
  justify-content: space-between;
  background: ${({ headerBg }) => headerBg || '#fff'};

  border-bottom: ${({ headerBorderBottom }) =>
    headerBorderBottom ? '1px solid #e8e8e8' : 'none'};
  padding: 0 16px;
`;

export const DrawerTitle = styled(Title)`
  && {
    margin: 0;
    text-align: ${({ isHeaderAtCenter }) =>
      isHeaderAtCenter ? 'center' : 'left'};
    flex: 1;
  }
`;
