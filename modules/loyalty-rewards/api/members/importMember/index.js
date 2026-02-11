import axiosClient from '@/utils/axios';

export const getImportMemberDataService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/members/csvtrackingremote`,
    payload,
    'GET'
  );
  return response;
};

export const uploadCSVService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/members/uploadcsvremotedata`,
    payload,
    'POST'
  );
  return response;
};

export const uploadloyaltyRemoteCSVService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/members/updateloyaltycsvremote`,
    payload,
    'POST'
  );
  return response;
};

export const getNewMemberService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/members/getnewmemberslistcsvremote`,
    payload,
    'GET'
  );
  return response;
};

export const getImportMemberVipTiersDataService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/members/bulktierassignmentcsvlist`,
    payload,
    'GET'
  );
  return response;
};

export const uploadBulkCSVService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/members/uploadmanualltierassignmentcsvremotedata`,
    payload,
    'POST'
  );
  return response;
};

export const getMenualTierNewMemberService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/members/getmanuallterassignmentnewmemberslistcsvremote`,
    payload,
    'GET'
  );
  return response;
};
