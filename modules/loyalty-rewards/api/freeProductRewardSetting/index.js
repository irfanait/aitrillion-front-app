import axiosClient from '@/utils/axios';

export const getRewardDataService = async (payload) => {
  const response = await axiosClient(
    '/loyalty/reward/loadfreeproductinitdataremote',
    payload,
    'GET'
  );
  return response?.data;
};

export const saveAndUpdateRewardSettingService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/submitfreeproductsettingremote?buy_btn_color=${payload?.buy_btn_color}&buy_btn_lang=${payload?.buy_btn_lang}&buy_btn_txt_color=${payload?.buy_btn_txt_color}&column_count=${payload?.column_count}&id=${payload?.id}&no_reward=${payload?.no_reward}&reward_title=${payload?.reward_title}&row_count=${payload?.row_count}&status=${payload?.status}`,
    {},
    'POST'
  );
  return response?.data;
};

export const updateRewardSettingStatusService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/updatestatusremote?status=${payload?.status}`,
    {},
    'POST'
  );
  return response?.data;
};
