// atoms/StatCard.tsx
import { StyledText, StyledTextWrapper } from './style';

const AitText = ({
  size,
  lineheight,
  weight = 400,
  bottommargin,
  topmargin,
  children,
  type,
  ...rest
}) => (
  <StyledTextWrapper
    type={type}
    lineheight={lineheight}
    bottommargin={bottommargin}
    topmargin={topmargin}
  >
    <StyledText type={type} size={size} weight={weight} {...rest}>
      {children}
    </StyledText>
  </StyledTextWrapper>
);

export default AitText;
