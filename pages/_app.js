import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AuthWrapper from '@/utils/authWrapper';
import MainLayout from '@/modules/layouts/mainLayout/mainLayout';
import AnalyticsBootstrap from '@/components/analytics/AnalyticsBootstrap';
import SalesIQWidget from '@/components/support/salesIQWidget';
import { NotificationProvider } from '@/components/molecules/notification-provider/notificationProvider';
import { wrapper } from '@/redux';
import { Provider } from 'react-redux';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { PAGE_TITLES } from '@/utils/pageTitle';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const authRoutes = ['/auth/login', '/auth/signup']; // Pages without layout
  const { store } = wrapper.useWrappedStore(pageProps);

  return (
    <>
      <Head>
        <title>
          {`${PAGE_TITLES[router.pathname] || 'AiTrillion'} | AiTrillion`}
        </title>
        <meta
          name="description"
          content="AiTrillion - All-in-One Shopify Growth Platform"
        />
      </Head>
      <Provider store={store}>
        <AntdRegistry>
          <NotificationProvider>
            {authRoutes.includes(router.pathname) ? (
              <Component {...pageProps} />
            ) : (
              <AuthWrapper>
                <MainLayout>
                  <AnalyticsBootstrap />
                  <SalesIQWidget />
                  <Component {...pageProps} />
                </MainLayout>
              </AuthWrapper>
            )}
          </NotificationProvider>
        </AntdRegistry>
      </Provider>
    </>
  );
}

export default MyApp;
