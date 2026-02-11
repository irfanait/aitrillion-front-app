import { Tag, Typography } from 'antd';
import styled from 'styled-components';
const { Title, Text } = Typography;

export const StyledTitle = styled(Title)({
  margin: '0px !important',
});

export const StyledTag = styled(Tag)({
  // margin: '6px 0px auto 0px',
});

export const StylePageHeader = styled.div`
  margin-bottom: ${({ bottomspacing }) => bottomspacing || '15px'};
`;

export const StyleTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  ${({ titlewrappermargin }) =>
    titlewrappermargin && `margin: ${titlewrappermargin};`}

  .page-heading {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 28px;
    ${({ titlemargin }) =>
      titlemargin
        ? `margin: ${titlemargin};`
        : 'margin-top:auto;margin-bottom:auto;'}
  }

  @media (max-width: 768px) {
    .page-heading {
      font-size: 24px;
    }
  }
`;

export const StyleSubTitleWrapper = styled.div`
  margin-top: 6px;
`;

export const StyleSubTitle = styled(Text)`
  ${({ screens }) =>
    !screens?.lg
      ? `font-size: 14px; line-height: 18px;`
      : 'font-size: 16px; line-height: 22px;'}
`;

export const CreateAbTag = styled(Tag)`
  // margin-top: auto;
  font-size: 16px;
  background-color: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
  padding: 6px 10px 6px 10px;
  margin: 0px 0px 3px 0px;
  // position: absolute;
  // top: 12px;
  // right: 12px;
`;

export const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledText = styled(Text)`
  font-size: 16px;
  color: rgba(0, 0, 0, 0.45); /* equivalent to antd's 'secondary' type */
  margintop: 10px !important;
`;

export const StyledRightText = styled(Text)`
  font-size: 13px;
  cursor: pointer;
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
  width: 71%;
`;

export const Label = styled.span`
  font-size: 16px;
  font-weight: 500;
`;
