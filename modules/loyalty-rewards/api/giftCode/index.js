import axiosClient from '@/utils/axios';

export const getGiftCodeDataService = async (payload) => {
  const response = await axiosClient(`/api/lytsetting`, payload, 'GET');
  return response;
};

export const exportRewardCodeDataService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/loyalty/exportrewardcode`,
    payload,
    'GET'
  );
  return response;
};

export const getUploadGiftCodeDataService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/loyalty/csvpurchasecodetrackingremote`,
    payload,
    'GET'
  );
  return response;
};

export const getReferralCodeDataService = async (payload) => {
  const response = await axiosClient(
    `/api/referrewardscoupons`,
    payload,
    'GET'
  );
  return response;
};

export const getDetailsDataService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/members/getcustomertierinfo`,
    payload,
    'GET'
  );
  return response;
};

export const getDetailsHistoryDataService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/members/getmemberhistorydetailremote?keyword=&messageFilter=all&reset=false`,
    payload,
    'GET'
  );
  return response;
};

export const getDetailsOrdersDataService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/members/getmemberorderdetailremote`,
    payload,
    'GET'
  );
  return response;
};

export const getsHistoryDataService = async (payload) => {
  const response = await axiosClient(`/api/order`, payload, 'GET');
  return response;
};

export const addPointService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/members/addpoints`,
    payload,
    'POST'
  );
  return response;
};

export const removePointService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/members/removepoints`,
    payload,
    'POST'
  );
  return response;
};

export const blockCustomerService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/members/blockcustomer`,
    payload,
    'POST'
  );
  return response;
};

export const assignedTierService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/members/assigntiermanually`,
    payload,
    'POST'
  );
  return response;
};

export const uploadFileService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/loyalty/uploadpurchasecoderemotedata`,
    payload,
    'POST'
  );
  return response;
};
