import axiosClient from '@/utils/axios';

export const getPointExpiryDataService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/pointexpire`,
    payload,
    'GET'
  );
  return response;
};

export const updatePointExpiryStatusService = async (payload) => {
  const response = await axiosClient(`/api/lytsetting`, payload, 'POST');
  return response;
};
