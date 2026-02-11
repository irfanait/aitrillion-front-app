import axiosClient from '@/utils/axios';

export const getRewardOrderService = async (payload) => {
  const response = await axiosClient('/api/lytsetting', payload, 'GET');
  return response?.data;
};
