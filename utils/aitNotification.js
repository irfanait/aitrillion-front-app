// utils/aitNotification.js
import { notification } from 'antd';

export const showNotification = (
  type = 'info', // 'success' | 'error' | 'info' | 'warning'
  message = '',
  description = '',
  placement = 'topRight'
) => {
  notification[type]({
    message,
    description,
    placement,
  });
};
