// utils/faToAntIcon.js
import React from 'react';
import {
  AppstoreOutlined,
  ShoppingCartOutlined,
  AimOutlined,
  CreditCardOutlined,
  UserOutlined,
  ArrowDownOutlined,
  EllipsisOutlined,
  TagsOutlined,
  BarChartOutlined,
  ProfileOutlined,
} from '@ant-design/icons';

// Map the FA token (e.g. "cart-plus") to an AntD icon component
const ICON_MAP = {
  'list-alt': ProfileOutlined,
  'cart-plus': ShoppingCartOutlined,
  'mouse-pointer': AimOutlined,
  'credit-card': CreditCardOutlined,
  'user-circle': UserOutlined,
  'arrow-alt-circle-down': ArrowDownOutlined,
  'menu-h': AppstoreOutlined,
  tag: TagsOutlined,
  tags: TagsOutlined,
  'chart-bar': BarChartOutlined,
  'more-icon': AppstoreOutlined,
};

export function faToAntIcon(iconClass) {
  // get the last "fa-..." token and strip the prefix
  const tokens = [...String(iconClass || '').matchAll(/fa-([a-z0-9-]+)/gi)];
  const key = tokens.length ? tokens[tokens.length - 1][1] : '';
  const Cmp = ICON_MAP[key] || ProfileOutlined; // fallback
  return <Cmp />;
}
