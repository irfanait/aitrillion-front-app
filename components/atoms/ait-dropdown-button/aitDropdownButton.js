import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { StyledDropdownButton } from './style';

const AitDropdownButton = ({
  title = 'Action',
  onClick,
  menuItems = [],
  loading = false,
  icon = <DownOutlined />,
  variant = 'outlined',
  danger = false,
  disabled = false,
  ...props
}) => {
  const menu = {
    items: menuItems,
    onClick: ({ key }) => {
      const selectedItem = menuItems.find((item) => item.key === key);
      selectedItem?.onClick?.();
    },
  };

  return (
    <StyledDropdownButton
      trigger={['click']}
      variant={variant}
      danger={danger}
      disabled={disabled}
      icon={icon}
      loading={loading}
      menu={menu}
      onClick={onClick}
      className="ait-dropdown-button"
      {...props}
    >
      {title}
    </StyledDropdownButton>
  );
};

export default AitDropdownButton;
