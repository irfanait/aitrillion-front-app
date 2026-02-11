import axiosClient from '@/utils/axios';

export const getListDataService = async (payload) => {
  const response = await axiosClient('/api/lytsetting', payload, 'GET');
  return response?.data;
};

export const addProductRewardService = async (payload) => {
  const response = await axiosClient(
    '/loyalty/reward/saverewardformremote',
    payload,
    'POST'
  );
  return response?.data;
};

export const editProductRewardService = async (payload) => {
  const response = await axiosClient(
    '/loyalty/reward/updaterewardformremote',
    payload,
    'POST'
  );
  return response?.data;
};

export const deleteProductRewardService = async (payload) => {
  const response = await axiosClient(
    '/loyalty/reward/deleterewardremote',
    payload,
    'POST'
  );
  return response?.data;
};
