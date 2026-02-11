import AitCard from '@/components/atoms/ait-card/aitCard';
import { Flex, Radio } from 'antd';

const { default: styled } = require('styled-components');

export const TextContainer = styled.div`
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: auto;
  }

  @media (max-width: 480px) {
    width: auto;
  }
`;

export const StyledRadioGroup = styled(Radio.Group)`
  .ant-radio-wrapper {
    display: flex;
    align-items: flex-start !important; /* move radio to top */
    line-height: 1.4;
  }

  .ant-radio {
    // transform: translateY(-8px);

    @media (min-width: 1200px) {
      // transform: translateY(-10px);
    }
  }
  .ant-radio + span {
    display: inline-block;
    margin-left: 8px;
  }
`;

export const RowItem = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  cursor: pointer;
  border-radius: 10px;
  border: 1px solid #f1f3f5;
  flex-wrap: nowrap;

  &:first-child {
  }

  &:hover {
    background: #f8fafc !important;
    border: 1px solid #c3d5f1 !important;
    box-shadow: -4px 4px 18px 0px rgba(0, 28, 72, 0.13) !important;
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
`;

export const IconWrap = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7ff;

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
export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: var(--ant-color-text-label-primary);
  display: block;
  margin-bottom: 4px;
`;

export const HelperText = styled.div`
  font-size: 12px;
  color: #8090ad;
  margin-bottom: ${({ marginBottom }) => marginBottom || '7px'};
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

export const TitleWrapper = styled(Flex)`
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
  row-gap: 12px;
  column-gap: 16px;
  width: 100%;
`;

export const LeftSection = styled.div`
  flex: 1;
  min-width: 250px;

  label {
    font-size: clamp(14px, 2vw, 16px);
    font-weight: 500;
  }

  p {
    font-size: clamp(12px, 1.6vw, 14px);
    color: #666;
    line-height: 1.4;
    margin: 4px 0 0;
    word-break: break-word;
  }
`;

export const SyncLink = styled.div`
  font-size: clamp(12px, 1.5vw, 14px);
  font-family: 'Roboto';
  font-style: italic;
  color: ${({ disabled }) => (disabled ? 'gray' : 'var(--ant-color-primary)')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  text-decoration: ${({ hovered, disabled }) =>
    hovered && !disabled ? 'underline' : 'none'};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  transition: all 0.2s ease;

  @media (max-width: 600px) {
    width: 100%;
    text-align: left;
    margin-top: 8px;
  }
`;

export const CustomAitCard = styled(AitCard)`
  @media (max-width: 768px) {
    .status-right {
      align-items: flex-start !important;
    }
  }
`;

export const TierIconStyle = styled.span`
  > img {
    width: 46px;
    height: 46px;
    padding: 3px;
    box-shadow: 0px 0px 3px #576f7c30;
    border: 1px solid #fff;
    border-radius: 4px;
    font-size: 10px;
    text-indent: 2px;
    object-fit: contain;
  }
`;
