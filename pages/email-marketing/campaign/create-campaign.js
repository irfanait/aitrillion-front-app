/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef } from 'react';
import CreateCampaignTemplateNew from '@/modules/email-marketing/templates/create-campaign-template-new/createCampaignTemplateNew';
import { useDispatch } from 'react-redux';
import {
  clearEmailMarketingCampaigns,
  sendEmailCreateAbReset,
} from '@/redux/email-marketing-slices/campaignSlice/email-marketing-campaign-slice';
import { resetCustomerCount } from '@/redux/email-marketing-slices/campaignSlice/fetchAudienceCountSlice';
import { useRouter } from 'next/router';
import { App } from 'antd';

export default function Page() {
  const dispatch = useDispatch();
  const router = useRouter();
  const formikRef = useRef(null);
  const { modal } = App.useApp();

  const handleRouteChangeStart = useCallback(
    (url) => {
      const normalizePath = (fullUrl) => {
        try {
          // Support absolute + relative URLs
          const parsed = new URL(fullUrl, window.location.origin);
          return parsed.pathname.replace(/\/+$/, '');
        } catch {
          return fullUrl.replace(/\/+$/, '');
        }
      };

      const currentPath = normalizePath(router.asPath);
      const nextPath = normalizePath(url);

      // ✅ Only trigger modal if the *path* changes
      if (currentPath === nextPath) return;

      if (formikRef?.current?.dirty) {
        modal.confirm({
          title: 'Unsaved Changes',
          content:
            'You have unsaved changes. Are you sure you want to leave this page?',
          okText: 'Leave Page',
          cancelText: 'Stay on Page',
          onOk: () => {
            const basePath = router.basePath || '';
            const cleanPath = url.replace(new RegExp(`^${basePath}`), '');
            dispatch(clearEmailMarketingCampaigns());
            dispatch(sendEmailCreateAbReset());
            dispatch(resetCustomerCount());
            router.events.off('routeChangeStart', handleRouteChangeStart);
            router.push(cleanPath);
          },
        });
        router.events.emit('routeChangeError');
        throw 'Abort route change. User has unsaved changes.';
      }
    },
    [dispatch, router, modal]
  );

  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChangeStart);
    return () => router.events.off('routeChangeStart', handleRouteChangeStart);
  }, [router, handleRouteChangeStart]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (formikRef?.current?.dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    // Wait until router is ready
    if (!router.isReady) return;
    return () => {
      dispatch(clearEmailMarketingCampaigns());
      dispatch(sendEmailCreateAbReset());
      // dispatch(resetCustomerCount());
      if (
        !router?.query?.segmentId ||
        !router?.query?.id ||
        !router?.query?.listId
      ) {
        dispatch(resetCustomerCount());
      }
    };
  }, [router.isReady, router?.query?.segmentId, dispatch]);

  return (
    <CreateCampaignTemplateNew
      ref={formikRef}
      handleRouteChangeStart={handleRouteChangeStart}
    />
  );
}
