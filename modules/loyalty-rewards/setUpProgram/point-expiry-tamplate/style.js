import AitCard from '@/components/atoms/ait-card/aitCard';
import styled from 'styled-components';

export const AlertBox = styled.div`
  background-color: ${(props) => props.backgroundColor || '#fef9e4'};
  color: #4f4f4f;
  padding: ${(props) => props.padding || ' 8px'};
  font-family: Arial, sans-serif;
  font-size: 13px;
  max-width: auto;
  margin: 10px auto;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  display: flex;
  align-items: flex-start; /* Align icon to the top of the text */
  line-height: 1.4;
`;

export const TitleText = styled.div`
  font-weight: 500;
  font-size: 18px;
  color: var(--ant-button-color-text-default);
  line-height: 21px;
  letter-spacing: -0.01em;
  margin-bottom: 18px;
`;

export const DescriptionText = styled.div`
  font-weight: 400;
  font-size: 14px;
  color: var(--ant-color-text-secondary);
  line-height: 20px;
  letter-spacing: -0.01em;
  margin-bottom: 18px;
`;

export const LabelText = styled.span`
  font-weight: 500;
  font-size: 17px;
  color: var(--ant-button-color-text-default);
  line-height: 19px;
  letter-spacing: -0.01em;
`;

export const StyledAlertBox = styled.div`
  background-color: ${({ backgroundColor }) => backgroundColor || '#fffbe6'};
  border-left: ${({ borderLeft }) => borderLeft || '4px solid #faad14'};
  padding: ${({ padding }) => padding || '6px 10px'};
  display: flex;
  align-items: flex-start;
  border-radius: 4px;
  font-size: 13px;
  color: var(--ant-color-text-secondary);
`;

export const FooterCard = styled(AitCard)`
  background: #fafcff;
  margin-top: 20px;
`;

export const FooterTextTitle = styled.div`
  font-weight: 500;
  font-size: 16px;
  color: var(--ant-button-color-text-default);
  line-height: 19px;
  letter-spacing: -0.01em;
  margin-top: 4px;
  margin-bottom: 6px;
`;

export const FooterTextSub = styled.div`
  font-weight: 400;
  font-size: 14px;
  color: var(--ant-color-text-contol);
  line-height: 18px;
  letter-spacing: -0.01em;
  margin-top: 4px;
`;
