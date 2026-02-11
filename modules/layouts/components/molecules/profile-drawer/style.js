import AitButton from '@/components/atoms/ait-button/aitButton';
import { Col, Row, Typography } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';
const { Text } = Typography;

export const StyleProfileWrapper = styled.div`
  .user-info-dropdown {
    width: 296px;
    bottom: 0;
  }
  .user_profile_image {
    padding-bottom: 12px;
  }
  .user_profile {
    background: #7c9de8;
    padding: 23px;
    color: #fff;
  }
  .fir-las-alphanew {
    width: 37px;
    height: 37px;
    display: flex;
    padding: 2px 2px 0px 0px !important;
    text-align: center;
    justify-content: center;
    align-items: center;
    border-radius: 50px;
    background: #ffc225;
    color: #fff;
    font-weight: 500;
    font-size: 13px;
    line-height: 15px;
    font-family: 'Roboto', sans-serif;
    position: relative;
    text-transform: uppercase;
  }
  .user_profile_name {
    font-size: 19px;
    font-weight: 500;
    letter-spacing: -0.01em;
    line-height: 22px;
    margin-bottom: 5px;
  }
  .user_profile_email {
    font-size: 13px;
    line-height: 15px;
    margin-bottom: 17px;
  }
  .visit_store a {
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
  .visit_store a .caret_right {
    margin-left: 5px;
  }
  .visit_store a,
  .visit_store a:hover {
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    color: #fff;
    padding: 7px 10px;
    border: 1px solid #c2d4fe;
    border-radius: 2px;
    text-decoration: none;
  }
  .btn-wrapper {
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.06);
  }

  .applogout {
    cursor: pointer;
  }
`;

export const StyleProfileBotSec = styled(Row)`
  padding: 30px;
  .icon_dollar {
    margin-right: 13px;
  }
`;

export const StyleProfileMenu = styled.div`
  padding-top: 30px;
  width: 100%;
  li {
    margin-bottom: 4px;
    display: block !important;
    text-align: left;
    vertical-align: middle;
  }
  li > a {
    display: inline-flex;
    align-items: center;
    padding: 3px 0px;
    cursor: pointer;
  }
  li > a span {
    font-size: 13px;
    line-height: 18px;
  }
  li a span.icon_svg {
    width: 25px;
  }
  a svg {
    margin-right: 5px;
    vertical-align: sub;
  }
`;

export const StyleEarnBonus = styled(Link)`
  background: #ffffff;
  border: 1px solid #eeeeee;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.06);
  border-radius: 3px;
  padding: 10px 15px;
  width: 100%;
  margin-top: 30px;

  .arrow-icon {
    margin-left: auto;
  }
`;

export const StyleEarnBonusText = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  line-height: 25px;
  letter-spacing: -0.01em;
`;
