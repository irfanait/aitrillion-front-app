import styled from 'styled-components';
import { Row, Typography } from 'antd';
import AitButton from '@/components/atoms/ait-button/aitButton';
const { Text, Title } = Typography;

export const WorkflowContentWrapper = styled.div`

`;

export const WorkflowContent = styled.div`
 
`;
export const WorkflowTitle = styled(Title)`
  margin-bottom: 6px !important;
`;
export const WorkflowText = styled(Text)`
  font-size:13px;
  line-height:20px;
`;
export const WorkflowImgWrapper = styled.div`
  margin-top: 15px;
`;

export const ButtonWrapper = styled(Row)`
  margin-top: 15px;
  text-align:center
`;

export const UseTemplateBtn = styled(AitButton)`
margin-left:auto;
margin-right:auto;
`;

export const WorkflowBottomWrapper = styled.div`
  width: 280px;
  position: absolute;
  padding: 20px;
  text-align: center;
  bottom: 0;
  box-shadow:rgba(2, 31, 74, 0.16) 0px -14px 40.9px -6px;

  .ant-btn-icon svg{
      vertical-align: middle;
  }
  ${({ isMobile }) => isMobile && `
    
  transform: translateX(0);
  opacity: 1;
  transition: 0.3s linear;
  left:0;
  right:0;
  width:auto;
 
  &.slide-workflow-btn{
        transform: translateX(-100%);
        opacity: 0;
        transition: 0.3s linear;
        left:0;
        right:auto;
  }
  
  `}

`;
