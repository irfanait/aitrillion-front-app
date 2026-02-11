import React, { useState } from 'react';
import { Dropdown, Menu } from 'antd';
import AitButton from '../ait-button/aitButton';

function AntDropdown({ items, btnText = '', type = '', placement = '' }) {
  const [selectedValue, setSelectedValue] = useState(null);

  const handleSelect = (e) => {
    setSelectedValue(e.key);
  };

  const menu = (
    <Menu onSelect={handleSelect}>
      {items.map((item) => (
        <Menu.Item key={item.key}>{item.label}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']} placement={placement}>
      <AitButton
        title={btnText}
        type={type}
        onClick={(e) => console.log('eeeee--->', e)}
      />
    </Dropdown>
  );
}

export default AntDropdown;
