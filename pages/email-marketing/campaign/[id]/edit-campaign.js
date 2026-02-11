/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import {
  clearEmailMarketingCampaigns,
  setCampaignDetailsByIdFilters,
} from '@/redux/email-marketing-slices/campaignSlice/email-marketing-campaign-slice';
import { fetchCampaignDetailsById } from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { resetCustomerCount } from '@/redux/email-marketing-slices/campaignSlice/fetchAudienceCountSlice';
import CreateCampaignTemplateNew from '@/modules/email-marketing/templates/create-campaign-template-new/createCampaignTemplateNew';

export default function EditCampaignPage({ id }) {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!router.isReady) return;
    dispatch(resetCustomerCount());
    if (id) {
      dispatch(setCampaignDetailsByIdFilters({ message_id: id }));
      dispatch(fetchCampaignDetailsById());
    }

    return () => {
      dispatch(clearEmailMarketingCampaigns());
      if (!router?.query?.segmentId || !router?.query?.id) {
        dispatch(resetCustomerCount());
      }
    };
  }, [router.isReady, router?.query?.segmentId, id, dispatch]);

  return <CreateCampaignTemplateNew isEditMode={true} />;
}

// ✅ This allows SSR-based loading and works on hard reload
export async function getServerSideProps(context) {
  const { id } = context.params;

  return {
    props: {
      id,
    },
  };
}
