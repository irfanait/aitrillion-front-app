// atoms/StatCard.tsx
import { StyledLink } from './style';

const AitLink = ({
  title,
  size,
  color = 'primary',
  weight,
  children,
  target,
  hoverline = true,
  onClick,
  href = '',
  ...rest
}) => (
  <StyledLink
    title={title}
    size={size}
    color={color}
    weight={weight}
    target={target}
    hoverline={hoverline}
    onClick={onClick}
    href={href}
    {...rest}
  >
    {children}
  </StyledLink>
);

export default AitLink;
