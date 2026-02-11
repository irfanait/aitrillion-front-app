import { Radio } from 'antd';
import styled from 'styled-components';

export const AlertBox = styled.div`
  background-color: ${(props) => props.backgroundColor || '#FFF5EB'};
  color: #4f4f4f;
  padding: ${(props) => props.padding || ' 8px'};
  border: 1px solid #efdcc7;
  font-family: Arial, sans-serif;
  font-size: 12px;
  max-width: auto;
  margin: 10px auto;
  box-shadow: none;
  border-radius: 10px;
  display: flex;
  align-items: flex-start; /* Align icon to the top of the text */
  line-height: 1.4;
`;

export const SyncLink = styled.div`
  font-size: clamp(12px, 1.5vw, 14px);
  color: ${({ disabled }) => (disabled ? 'gray' : 'var(--ant-color-primary)')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  span {
    position: relative;
    top: 11px;
  }
`;
