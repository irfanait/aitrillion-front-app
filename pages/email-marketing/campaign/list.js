//email-marketing/campaign/list
import React from 'react';
import { Table, Typography, Collapse, Card } from 'antd';
import { fetchEmailMarketingCampaignList } from '@/redux/email-marketing-slices/campaignSlice/email-marketing-campaign-slice';
import { wrapper } from '@/redux';
import { useDispatch, useSelector } from 'react-redux';
import CampaignListTemplate from '@/modules/email-marketing/templates/campaign-list-template/campaignListTemplate';
import { useRouter } from 'next/router';

export default function Page({ data }) {
  // const dispatch = useDispatch();
  // console.log(data, 'data');

  // const emailMarketingCampaignState = useSelector(
  //   (state) => state.emailMarketingCampaignState
  // );

  // console.log(emailMarketingCampaignState, 'emailMarketingCampaignState');

  return (
    <>
      <CampaignListTemplate />
    </>
  );
}

// Fetch on server side and inject to store
// export const getServerSideProps = wrapper.getServerSideProps(
//   (store) => async (context) => {
//     // const token = context.req.cookies.auth_token || '';
//     const token =
//       '2c56b14d4184302d06dfe763d94821d4dd578e76c11b5c6650b191732895c529';
//     await store.dispatch(fetchEmailMarketingCampaignList({ token }));
//     return { props: {} }; // no need to return data manually, it's already in Redux
//   }
// );
