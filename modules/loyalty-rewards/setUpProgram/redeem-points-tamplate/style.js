import { Card, Select, Tabs } from 'antd';
import styled from 'styled-components';

export const RowItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px;
  cursor: ${(props) => props.cursor || 'pointer'};
  border-top: 1px solid #f1f3f5;
  flex-wrap: nowrap;

  &:first-child {
    border-top: 0;
  }

  &:hover {
    background: #f4f4f4;

    & .icon {
      background: #1a73e8;
      transform: scale(1.1);
    }
  }

  @media (max-width: 1024px) {
    padding: 18px 14px;
  }

  @media (max-width: 768px) {
    padding: 16px 12px;
    flex-direction: row;
  }

  @media (max-width: 480px) {
    padding: 12px 8px;
    flex-direction: row;
    &:hover {
      background: #f8fafc;

      & .icon {
        background: #1a73e8;
        transform: scale(1.1);
      }
    }
  }
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 10px;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

export const IconWrap = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7ff;
  border-radius: 9999px;

  /* Responsive Styles */
  @media (max-width: 768px) {
    width: 38px;
    height: 38px;
  }

  @media (max-width: 480px) {
    width: 34px;
    height: 34px;
  }
`;

export const TitleWrap = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    align-items: flex-start;
  }
`;

export const ChildrenText = styled.span`
  color: #8a98a7;
  font-size: 12px;

  @media (max-width: 768px) {
    font-size: 11px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

export const StyledIcon = styled.span`
  width: 32px;
  height: 32px;
  background: #dce3f2;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-size: 22px;
  transition:
    background 0.3s ease,
    transform 0.2s ease;

  &:hover {
    background: #1a73e8;
    transform: scale(1.1);
  }

  @media (max-width: 1024px) {
    width: 28px;
    height: 28px;
    font-size: 18px;
  }

  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
    font-size: 16px;
  }

  @media (max-width: 480px) {
    width: 20px;
    height: 20px;
    font-size: 14px;
  }
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: var(--ant-color-text-label-primary); /* Or customize as needed */
  display: block;
`;

export const HelperText = styled.div`
  font-size: 12px;
  color: #8090ad;
  margin-bottom: ${({ marginBottom }) => marginBottom || '7px'};
`;

export const EditIcon = styled.span`
  color: #c5ced6;
  font-size: 16px;
`;
export const PointsText = styled.span`
  color: #8a98a7;
  font-size: 12px;
`;

export const AlertBox = styled.div`
  background-color: ${(props) => props.backgroundColor || '#fef9e4'};
  color: #4f4f4f;
  padding: ${(props) => props.padding || ' 8px'};
  font-family: Arial, sans-serif;
  font-size: 13px;
  max-width: auto;
  margin: 10px 0px 24px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  display: flex;
  align-items: flex-start; /* Align icon to the top of the text */
  line-height: 1.4;
`;

export const CustomCard = styled(Card)`
  .ant-card-body {
    padding: 0px 0px 0px 0px !important;
    .ant-tabs-nav {
      margin: 0 0 0px 0;
      .ant-tabs-nav-wrap {
        .ant-tabs-nav-list {
          padding: 10px 0px 10px 18px;
          .ant-tabs-tab {
            &:hover {
              color: var(--ant-color-text-primary);
            }
            .ant-tabs-tab-btn {
              font-size: 16px;
              font-weight: 500;
            }
          }
        }
      }
    }
  }
`;

export const StyledSelect = styled(Select)`
  width: ${(props) => props.width || '220px !important'};
  .ant-select-selection-overflow-item {
    padding: ${(props) => props.selectValuePadding || ''};
  }
  .ant-select-selection-item {
    color: var(--ant-color-text-label-primary) !important;
  }
`;
