import AitButton from '@/components/atoms/ait-button/aitButton';
import styled from 'styled-components';

export const StickySubHeader = styled.div`
  position: sticky;
  z-index: 1000;
  background: #fff;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  border-bottom: 1px solid #eaebed;
  .left {
    flex: 1;
    min-width: 200px;
  }

  .right {
    display: flex;
    align-items: center;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const StyleAitButton = styled(AitButton)`
  background: #ddecff !important;
  display: inline-flex;
  align-items: center;

  .ant-btn-icon svg {
    vertical-align: middle;
  }
`;
