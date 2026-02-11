import React from 'react';
 import { Input, Tooltip } from 'antd';
 import {
   ErrorText,
   Label,
   Wrapper,
   FieldWrapper,
   LabelRow,
   HelperText,
 } from './style';
 
 const { TextArea } = Input;
 
 const AitTextAreaBox = ({
   name = '',
   placeholder = '',
   label = '',
   value,
   rows = 4,
   labelFontSize = '14px',
   labelSpacingBottom,
   required = false,
   error = false,
   errorMessage = '',
   helperText = '', // ✅ Optional helper text
   labelIcon = null, // ✅ Optional label icon
   tooltipText = '', // Optional tooltip
   ...rest
 }) => {
   return (
     <Wrapper>
       {label && (
         <LabelRow>
           <Label
             labelFontSize={labelFontSize}
             labelSpacingBottom={labelSpacingBottom}
           >
             {label} {required && <span className="field-required">*</span>}
           </Label>
           {labelIcon && (
             <Tooltip title={tooltipText}>
               <span style={{ marginLeft: 8, cursor: 'pointer' }}>
                 {labelIcon}
               </span>
             </Tooltip>
           )}
         </LabelRow>
       )}
 
       <FieldWrapper>
         <TextArea
           id={name}
           name={name}
           placeholder={placeholder}
           value={value}
           rows={rows}
           status={error ? 'error' : ''}
           {...rest}
         />
       </FieldWrapper>
 
       {/* ✅ Show helper text when available */}
       {!error && helperText && <HelperText>{helperText}</HelperText>}
 
       {/* ✅ Show error message when error exists */}
       {error && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
     </Wrapper>
   );
 };
 
	 export default AitTextAreaBox;