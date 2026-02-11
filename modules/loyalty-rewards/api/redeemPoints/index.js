import axiosClient from '@/utils/axios';

export const getCreateRewardsListService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/getrewardremote`,
    payload,
    'GET'
  );
  return response;
};

export const getViewRewardsListService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/getshoprewardremote`,
    payload,
    'GET'
  );
  return response;
};

export const addRewardsService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/saverewardformremote`,
    payload,
    'POST'
  );
  return response;
};

export const updateRewardsService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/updaterewardformremote`,
    payload,
    'POST'
  );
  return response;
};

export const deleteRewardsService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/deleterewardremote`,
    payload,
    'POST'
  );
  return response;
};

export const statusChangeRewardsService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/activedeactiverewardremote`,
    payload,
    'POST'
  );
  return response;
};

export const activedeactivecardwidgetremoteService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/activedeactivecardwidgetremote`,
    payload,
    'POST'
  );
  return response;
};

export const activedeactivestorecreditremoteService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/activedeactivestorecreditremote`,
    payload,
    'POST'
  );
  return response;
};

export const getProductByIdService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/getproductinfobyid?product_id=${payload?.id}&is_api_request=1`,
    {},
    'POST'
  );
  return response;
};

export const addUpdateCartWidgetService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/updatecartwidgetpointsettingremote`,
    payload,
    'POST'
  );
  return response;
};

export const addUpdateStoreCreditService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/updatestorecreditpointsettingremote`,
    payload,
    'POST'
  );
  return response;
};

export const setadditionalloyaltypermissionsService = async (payload) => {
  const response = await axiosClient(
    '/loyalty/reward/setadditionalloyaltypermissions',
    payload,
    'GET'
  );
  return response;
};
