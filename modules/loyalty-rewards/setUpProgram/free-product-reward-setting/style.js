import { Button, Card, ColorPicker, Flex, Input } from 'antd';
import styled from 'styled-components';

export const Wrapper = styled(Card)`
  border-radius: 8px;
  padding: 24px;
  .ant-card-body {
    padding: 0;
  }
`;

export const Label = styled.label`
  font-weight: 500;
  display: block;
  margin-bottom: 6px;
  color: var(--ant-color-text-label-primary);
`;

export const ColorNote = styled.div`
  font-size: 12px;
  color: #6e809d;
  margin-top: 4px;
`;

export const GreyBox = styled.div`
  background: #f5f5f5;
  border-radius: 0.25rem;
  padding: 1rem;
  height: 50%; /* Default height for large screens */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  /* Large tablets / small laptops */
  @media (max-width: 1200px) {
    padding: 1.5rem;
    height: 60%; /* Slightly taller for smaller screens */
  }

  /* Tablets */
  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 0.2rem;
    height: auto; /* Let it grow naturally on smaller screens */
  }

  /* Mobile devices */
  @media (max-width: 480px) {
    padding: 0.75rem;
    height: auto; /* Prevent overflowing small screens */
  }
`;

export const UpdateButton = styled(Button)`
  margin-top: 12px;
  width: 120px;
`;

export const CustomColorPicker = styled(ColorPicker)`
  width: 180px;
  display: flex;
  alignitems: center;
  justify-content: start;
  padding: 6.5px 12px;
  .ant-color-picker-color-block {
    width: 25px !important;
    height: 25px !important;
  }
`;

export const RewardFlex = styled(Flex)`
  width: 100%;
  align-items: flex-start;
  gap: 16px;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    display: block;
  }
`;

export const RewardItem = styled.div`
  flex: 1 1 auto;
  @media (max-width: 768px) {
    width: 100%;
    display: block;
  }
`;

export const RewardSign = styled.div`
  font-weight: bold;
  text-align: center;
  margin-top: 29px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    text-align: left;
    margin-top: -12px;
    display: flex;
    justify-content: center;
  }
`;
