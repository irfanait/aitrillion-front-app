import styled from "styled-components";

export const CardContainer = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fff;

   @media (max-width:992px){
    .feature-right-section button{
    margin-left:calc(48px + 16px);
    }
  }

  @media (max-width:768px){
    padding: 20px 20px;

    .feature-right-section button{
    margin-left:calc(48px + 16px);
    }
  }
  @media (max-width:576px){
    .feature-right-section button{
    margin-left:calc(48px + 16px);
    width:calc(100% - 48px - 16px) !important;
    }
  }
  @media (max-width:364px){
    .feature-right-section button{
    margin-left:0;
    width:100% !important;
    }
  }

  &:last-of-type{
  border-bottom:none
  }
  
`;

export const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 50%;
  background-color: ${(bgColor) => bgColor || "#f5f5f5"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 16px;

  @media (max-width:364px){
    width: 32px;
    height: 32px;
    min-width: 32px;
    margin-right: 10px;
  }
`;


export const ContentWrapper = styled.div`
  flex: 1;
`;
