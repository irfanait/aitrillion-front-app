import { Col, Radio, Row, Select, Skeleton } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';

export const PagePad = styled.div`
  padding: 8px 12px;
`;

export const ListCard = styled.div`
  background: #ffffff;
  border: 1px solid #e9edf3;
  border-radius: 8px;
  padding: 16px 20px;
`;

export const RowItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px;
  cursor: pointer;
  border-top: 1px solid #f1f3f5;

  &:first-child {
    border-top: 0;
  }

  &:hover {
    background: #f4f4f4;
  }
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const IconWrap = styled.div`
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7ff;
  border-radius: 9999px;
`;

export const TitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const PointsText = styled.span`
  color: #8a98a7;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.01em;
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const EditIcon = styled.span`
  color: #c5ced6;
  font-size: 16px;
`;

export const CountTag = styled.span`
  background: #eef7ff;
  color: #1a73e8;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 12px;
`;

export const AlertBox = styled.div`
  background-color: ${(props) => props.backgroundColor || '#fef9e4'};
  color: #4f4f4f;
  padding: ${(props) => props.padding || ' 8px'};
  border-left: ${(props) => props.borderLeft || ' 5px solid #ffcc00'};
  font-family: Arial, sans-serif;
  font-size: 13px;
  max-width: auto;
  margin: 0px 0px 24px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  display: flex;
  align-items: flex-start; /* Align icon to the top of the text */
  line-height: normal;
`;

export const IconWrapper = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #fff3cd; /* Light yellow like tooltip */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  flex-shrink: 0;
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
  color: var(--ant-color-text-secondary);
  margin-bottom: 4px;
`;

export const LinkStyle = styled(Link)`
  display: inline-block;
  position: relative;
  top: auto;
`;

export const CustomButton = styled.button`
  background-color: ${(props) => props.bgColor} !important;
  color: ${(props) => props.textColor} !important;
  line-height: 14px;
  padding: 11px 19px;
  border-radius: 50px;
  position: absolute;
  bottom: 17px;
  text-align: center;
  border: none;
  height: 36px;

  ${(props) =>
    props.position === 'left-center' &&
    `
    left: 0;
    right: auto;
    top: 38%;
    transform: translateY(-50%) rotate(90deg);

    @media (max-width: 1200px) { /* For large screens like laptops */
      top: 40%;
    }

    @media (max-width: 768px) { /* For tablets */
      top: 50%;
    }

    @media (max-width: 480px) { /* For mobile screens */
      top: 55%;
    }
  `}

  ${(props) =>
    props.position === 'right-center' &&
    `
    left: auto;
    right: 0;
    top: 38%;
    transform: translateY(-50%) rotate(90deg);

    @media (max-width: 1200px) { /* For large screens like laptops */
      top: 30%;
    }

    @media (max-width: 768px) { /* For tablets */
      top: 50%;
    }

    @media (max-width: 480px) { /* For mobile screens */
      top: 55%;
    }
  `}

${(props) =>
    props.position === 'right' &&
    `
    left: auto;
    right: 38px;
    bottom: 155px;

    @media (max-width: 1200px) { /* For large screens like laptops */
      right: 30px;
      bottom: 140px;
    }

    @media (max-width: 768px) { /* For tablets */
      right: 40px;
      bottom: 9px;
    }

    @media (max-width: 480px) { /* For mobile screens */
      right: 20px;
      bottom: 10px;
    }
  `}

${(props) =>
    props.position === 'left' &&
    `
    left: 38px;
    right: auto;
    bottom: 155px;

    @media (max-width: 1200px) { /* For large screens like laptops */
      left: 30px;
      bottom: 140px;
    }

    @media (max-width: 768px) { /* For tablets */
         left: 85px;
      bottom: 9px;
    }

    @media (max-width: 480px) { /* For mobile screens */
      left: 20px;
      bottom: 10px;
    }
  `}
`;

export const ButtonImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  img {
    width: 100%;
    //  max-width: 300px;
  }
`;

export const RadioItem = styled(Radio)`
  display: flex;
  align-items: center;

  .ant-radio,
  .ant-wave-target {
    margin-bottom: 22px;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .ant-radio,
    .ant-wave-target {
      margin-bottom: 18px;
    }
  }

  @media (max-width: 480px) {
    .ant-radio,
    .ant-wave-target {
      margin-bottom: 14px;
    }
  }
`;

export const StyledRow = styled(Row)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;
export const StyledCol = styled(Col)`
  margin-bottom: 16px;
  margin-top: ${(props) => (props.isImage ? '13px' : '0')};
  width: 100%;
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

export const ImageWrapper = styled(Col)`
  display: flex;
  justify-content: flex-start; /* Align image to the left */
  align-items: center; /* Vertically align image */
  margin-top: 24px; /* Default margin-top for larger screens */
  margin-bottom: 16px; /* Ensure space between fields */

  /* Adjust for tablet screens (max-width: 1024px) */
  @media (max-width: 1024px) {
    margin-top: 0 !important; /* Remove top margin for tablets */
    justify-content: flex-start; /* Align image to the left */
  }

  /* Adjust for very small screens (mobiles) */
  @media (max-width: 480px) {
    margin-top: 0 !important; /* Remove top margin for small screens */
    margin-left: 0 !important; /* Remove any unnecessary left margin */
    justify-content: flex-start; /* Ensure image aligns to the start */
  }
`;

export const Image = styled.img`
  width: 40px;
  flex: 0 0 40px;
`;

export const ActivitiesText = styled.h4`
  font-weight: 500 !important;
  font-size: 15px !important;
  line-height: 18px;
  letter-spacing: -0.01em;
  color: var(--ant-color-text-primary) !important;
`;
