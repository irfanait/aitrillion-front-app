// components/molecules/notification-provider/notificationProvider.tsx
"use client";
import { App as AntdApp, ConfigProvider } from "antd";

export const NotificationProvider = ({ children }) => {
  return (
    <ConfigProvider>
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
};
