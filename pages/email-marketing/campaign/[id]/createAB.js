import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import CreateAbTemplate from '@/modules/email-marketing/templates/create-ab-template/createAbTemplate';
import { resetCustomerCount } from '@/redux/email-marketing-slices/campaignSlice/fetchAudienceCountSlice';

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;

  useEffect(() => {
    if (!router.isReady) return;
    return () => {
      dispatch(resetCustomerCount());
    };
  }, [router.isReady, dispatch]);

  return <CreateAbTemplate campaignId={id} />;
}
