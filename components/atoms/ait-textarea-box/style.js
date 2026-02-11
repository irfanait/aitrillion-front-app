// style.js (for AitTextAreaBox)
 import styled from 'styled-components';
 
 export const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
 `;
 
 export const Label = styled.label`
   font-weight: 500;
   font-size: ${({ labelFontSize }) => labelFontSize || '14px'};
   margin-bottom: ${({ labelSpacingBottom }) => labelSpacingBottom || '4px'};
   color: var(--ant-color-text-label-primary);
 `;
 
 export const LabelRow = styled.div`
   display: flex;
   align-items: center;
   gap: 8px;
 `;
 
 export const FieldWrapper = styled.div`
   .ant-input {
     padding: 10.8px 12px;
     font-size: 14px;
     font-weight: 400;
     color: var(--ant-color-text-contol);
     line-height: 1;
     border-radius: 6px;
   }
   .ant-input-suffix span {
     color: var(--ant-color-text-placeholder) !important;
   }
 `;
 
 export const ErrorText = styled.div`
   color: var(--ant-color-text-error);
   font-size: 12px;
   font-weight: 400;
   margin-top: 4px;
   line-height: 16px;
 `;
 
 export const HelperText = styled.div`
   font-size: 12px;
   color: #6b7280; /* gray-500 */
   // margin-top: 4px;
	 `;