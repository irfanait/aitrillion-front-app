import axiosClient from '@/utils/axios';

export const getLoyaltyMemberDataService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/members/getmemberslistremote`,
    payload,
    'GET'
  );
  return response;
};

export const getAllActivitiesDataService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/members/getallactivities`,
    payload,
    'GET'
  );
  return response;
};

export const getAllMembersDataService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/members/getallcusotmerlistremote?act=get_allmember_list`,
    payload,
    'GET'
  );
  return response;
};
