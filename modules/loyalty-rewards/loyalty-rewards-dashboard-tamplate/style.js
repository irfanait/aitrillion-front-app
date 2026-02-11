//import AitCardCustom from '@/components/atoms/custom/ait-card/aitCardCustom';
import {
  Button,
  Card,
  Space,
  Typography,
  Tabs,
  Collapse,
  Modal,
  Checkbox,
  Divider,
} from 'antd';
import styled, { keyframes } from 'styled-components';
const { Title, Text } = Typography;
const { Panel } = Collapse;

export const Banner = styled.div`
  // background: #f4f8ff;
  border: 1px solid #cfe0ff;
  border-radius: 10px;
  padding: 12px 12px;
  position: relative;
  //display: flex;
  //align-items: center;
  //gap: 12px;
  margin-bottom: 20px;

  .acivate_module_link {
    color: var(--ant-color-primary);
    font-weight: 500;
  }
  .acivate_module_link:hover {
    color: var(--ant-color-primary-bg-hover);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

export const IconBox = styled.div`
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  border-radius: 10px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  flex: 1;
  line-height: 20px;
  font-size: 14px;

  /* Tighter typography inside the banner */
  .ant-typography {
    line-height: 18px;
    margin-bottom: 0;
    color: var(--ant-color-text-default);
  }

  @media (max-width: 768px) {
    justify-content: center;
    gap: 4px;
  }
`;

export const LinkA = styled.a``;

export const Right = styled.div`
  flex: 0 0 auto;
`;

export const SetupLink = styled.a``;

export const CloseIconBtn = styled(Button)`
  opacity: 0.5;
  .anticon.anticon-close {
    vertical-align: top;
  }

  &:hover {
    background: none !important;
    opacity: 1;
  }
`;

export const EnableCard = styled(Card)`
  .ant-card-body {
    padding: 16px;
  }
`;

export const EnablePanel = styled(Panel)`
  & {
    border-radius: 8px !important;
    overflow: hidden;
    margin-bottom: 10px;
    border: 1px solid #e5e7eb;
    background: #fff;
  }
  & > .ant-collapse-header {
    min-height: 60px;
    padding: 10px 14px !important;
    .ant-collapse-header-text {
      margin-top: 8px !important;
    }
    .ant-collapse-expand-icon {
      margin-top: 8px !important;
    }
  }
`;

export const RowWrap = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

export const LeftRadio = styled.div`
  display: flex;
  align-items: center;
  padding-top: 2px;
`;

export const ContentCol = styled.div`
  flex: 1;
  min-width: 0;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TitleText = styled(Text)`
  font-weight: 600;
  color: #1f2937;
`;

export const Desc = styled(Text)`
  display: block;
  color: #6b7280;
  margin-top: 6px;
`;

export const HelperLink = styled(Button)`
  padding: 0;
  height: auto;
  margin-top: 10px;
`;

export const Actions = styled.div`
  margin-top: 12px;
`;

export const Wrap = styled.div``;

export const PagePad = styled.div`
  // padding: 8px 12px;
`;

export const Section = styled.div`
  margin-top: 20px;
`;

export const CardBodyTight = styled(Card)`
  .ant-card-body {
    padding: 16px;
  }
`;

export const ChartContainer = styled.div`
  width: 100%;
  height: ${(p) => (p.$height ? `${p.$height}px` : '280px')};
`;

export const SectionTitle = styled(Title)`
  && {
    margin-top: 0;
  }
`;

export const SmallCard = styled(Card)`
  && {
    margin-top: 8px;
  }
`;

export const SpacedBlock = styled.div`
  margin-top: 12px;
`;

export const KPIRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const KPICard = styled.button`
  border: 1px solid
    ${(p) => (p.active ? 'var(--ant-color-primary)' : '#e5e7eb')};
  background: ${(p) => (p.active ? 'var(--ant-color-primary)' : '#fff')};
  color: ${(p) => (p.active ? '#fff' : '#111827')};
  border-radius: 8px;
  padding: 10px 10px;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .value {
    font-size: 16px;
    font-weight: 700;
    line-height: 1;
  }
  .label {
    margin-top: 2px;
    font-size: 12px;
    color: ${(p) => (p.active ? 'rgba(255,255,255,0.85)' : '#6b7280')};
    white-space: normal;
  }

  @media (max-width: 768px) {
    padding: 12px 10px;
  }
`;

export const DonutCard = styled(Card)`
  .ant-card-body {
    padding: 16px;
  }
`;

export const ChartBox = styled.div`
  width: 100%;
  height: 240px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    height: 200px;
  }
`;

export const CustomDivider = styled(Divider)`
  ${({ screens }) =>
    !screens?.xs ? `position: relative;transform: rotate(90deg);` : ``}
`;

export const Bar = styled.div``;

export const MenuWrap = styled.div`
  width: 340px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
  padding: 15px;

  @media (max-width: 768px) {
    width: 300px;
  }

  @media (max-width: 576px) {
    width: calc(100vw - 32px);
    max-width: 420px;
  }
`;

export const MenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 16px;
`;
export const MenuBody = styled.div`
  .ant-picker {
    min-height: 40px;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 400;
    color: #000;
    line-height: 1.5715;
    border-radius: 6px;
    width: 100%;
  }

  .ant-picker-input > input::placeholder {
    color: var(--ant-color-text-placeholder);
    font-size: 14px;
  }

  .ant-picker-status-error {
    border-color: var(--ant-color-text-error) !important;
    box-shadow: none !important;
  }

  .ant-picker-status-error .ant-picker-input > input {
    color: var(--ant-color-text-error);
  }
  .ant-form-item-additional {
    margin-bottom: 10px;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  color: var(--ant-color-text-label-primary);
`;

export const FullWidthButton = styled(Button)`
  width: 100%;
`;

export const ButtonInlineGroup = styled.div`
  display: inline-flex;
  gap: 12px;

  @media (max-width: 576px) {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;
export const TopNoticeBar = styled.div`
  background: #cdd8ea;
  border-radius: 6px;
  padding: 4.5px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
`;

export const CompactCollapse = styled(Collapse)`
  border: 0;
  background: transparent;
  .ant-collapse-item {
    border: 0;
    margin-bottom: 8px;
    border-radius: 10px;
    background: #fafafa;
    box-shadow: inset 0 0 0 1px #f0f0f0;
  }
  .ant-collapse-header {
    padding: 10px 14px !important;
  }
  .ant-collapse-content {
    border: 0;
    border-radius: 10px;
  }
  .ant-collapse-content-box {
    padding: 12px 14px 14px 14px;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const HeaderText = styled.div`
  ${({ as }) =>
    as === 'div' &&
    `
    margin-right: 8px; 
  font-size: 1.25rem;
  `}

  ${({ as }) =>
    as === 'h4' &&
    `
    margin-right:3px !important;
    font-weight: 500;
    margin-top:0;
     margin-bottom:0;
     color:var( --ant-color-text-primary);
  `}
  ${({ as }) =>
    !as &&
    `  font-size: 13px;
    display: inline;
  `}
`;

export const HeaderTextBold = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: var(--ant-color-text-primary);
  margin-top: 5px;
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const IconContainer = styled.span`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  //background-color: #ffe6f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  flex-shrink: 0;
`;

export const Icon = styled.img`
  // width: 16px;
  // height: 16px;
`;

export const IconLabel = styled.span`
  font-size: 14px;
  color: #333;
  line-height: 1;
`;
export const DateRangeNotice = styled.div`
  margin-top: 1px;
  color: #ff4d4f;
  font-size: 13px;
  display: flex;
  justify-content: flex-end;

  strong {
    margin: 0 4px;
  }
`;

export const ColoredCheckbox = styled(Checkbox)`
  .ant-checkbox-inner {
    background-color: ${({ color }) => color || 'transparent'};
    border-color: ${({ color }) => color || '#d9d9d9'};
  }
  .ant-checkbox-label {
    padding-right: 5px !important;
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${({ checkedColor }) =>
      checkedColor || 'var(--ant-color-primary)'};
    border-color: ${({ checkedColor }) =>
      checkedColor || 'var(--ant-color-primary)'};
  }
`;

export const Container = styled.div`
  margin-bottom: 10px;
`;

export const Titles = styled.h4`
  font-size: 1.25rem;
  margin: 0; // Optional: to remove default margin
`;

export const FilterSection = styled.div``;

export const CloseBarButton = styled(Button)`
  position: absolute;
  top: 1px;
  right: 5px;
`;

export const LytDashboardIconWrap = styled.div`
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  border-radius: 8px;
  background: #f1f5fe;
  display: flex;
  align-items: center;
  justify-content: center;
`;
