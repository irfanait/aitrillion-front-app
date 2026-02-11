import { ColorPicker, Flex, Radio } from 'antd';
import styled from 'styled-components';

export const Wrapper = styled.div`

 
`;

export const LabelRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

export const Label = styled.label`
  font-weight: 500;
  font-size: 14px;
  color: #1c1c1c;
`;

export const FieldWrapper = styled.div`

`;

export const RadioRound = styled(Flex)`
.ant-radio-group{
display:flex;
${({ gap }) => gap && `gap: ${gap}px;`}
}
.ant-radio-button-wrapper{
  border-radius: 50%;
  }

`;
export const RadioRoundChild = styled(Radio.Button)`
  ${({ value }) => value && `background: #${value}!important;`}
  &.radio-selected{
    border: 1px solid #000000 !important; 
    }
`;
export const ColorPickerStyle = styled(ColorPicker)`

`;



export const ErrorText = styled.div`
  color: var(--ant-color-text-error);
  font-size: 12px;
  font-weight: 400;
  margin-top: 4px;
  line-height: 20px;
`;

export const StyledRadio = styled(Radio)`
  color: var(--ant-color-text-label-primary);
  font-size: 14px;
  font-weight: 400;
  gap:10px;
  >.ant-radio{align-self:start;margin-top:3px}
  >.ant-radio-label{padding-inline-start: 0px!important;padding-inline-end: 0px !important;}
`;
