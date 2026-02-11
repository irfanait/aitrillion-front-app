import { Skeleton } from 'antd';
import { StyledSkelton } from './style';

const AitSkeleton = ({
  type = 'default', // default | button | input | avatar | image
  wrapperStyle = {},

  skeletonProps = {},
  buttonProps = {},
  inputProps = {},
  avatarProps = {},
  imageProps = {},
}) => {
  return (
    <StyledSkelton style={wrapperStyle}>
      {type === 'button' && <Skeleton.Button active {...buttonProps} />}

      {type === 'input' && <Skeleton.Input active {...inputProps} />}

      {type === 'avatar' && <Skeleton.Avatar active {...avatarProps} />}

      {type === 'image' && <Skeleton.Image {...imageProps} />}

      {type === 'default' && <Skeleton active {...skeletonProps} />}
    </StyledSkelton>
  );
};

export default AitSkeleton;
