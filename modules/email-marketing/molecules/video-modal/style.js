import styled from 'styled-components';
import { Row } from 'antd';

export const StyleVideoWrapper = styled.div`
  margin-top:10px;
  text-align:center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding:0px 8px;

  .videoIframe{
  width:100%;
  }

  .modal-subtitle{
   font-size:16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

export const ButtonWrapper = styled(Row)`
  margin-top: 8px;
`;
