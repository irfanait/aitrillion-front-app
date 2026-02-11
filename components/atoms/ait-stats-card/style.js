// style.js (for AitSelectBox)
import Card from 'antd/es/card/Card';
import styled from 'styled-components';

export const StyleCard = styled(Card)`
  text-align: center;
  height: 100%;
  & svg {
    margin-left: auto;
    margin-right: auto;
    ${({ iconheight }) => iconheight && `height: ${iconheight}px;`}
    ${({ iconwidth }) => iconwidth && `width: ${iconwidth}px;`}
  }

  @media (min-width: 992px) {
    text-align: left;
    & svg {
      margin-left: auto;
      margin-right: 0;
    }
  }
  @media (max-width: 991px) {
    & .ant-card-body {
      padding: 16px 11px 18px 11px;
    }

    & h3 {
      font-size: 22px;
    }

    & svg {
      margin-left: auto;
      margin-right: auto;
    }
  }

  @media (max-width: 400px) {
    & h3 {
      font-size: 16px;
    }
  }
`;
