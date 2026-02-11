import React, { useEffect } from 'react';
import CreateCouponTemplate from '@/modules/email-marketing/templates/create-coupon-template/createCouponTemplate';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

export default function Page() {
  const router = useRouter();
  // const dispatch = useDispatch();
  // const { id, type } = router.query;

  // useEffect(() => {
  //   // return () => {
  //   //   // ✅ Reset Redux states when navigating away
  //   //   dispatch(clearEmailMarketingCampaigns());
  //   //   dispatch(resetCustomerCount());
  //   // };
  // }, [id, dispatch]);

  return (
    <>
      <CreateCouponTemplate />
    </>
  );
}
