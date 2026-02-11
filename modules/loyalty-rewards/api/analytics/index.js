import axiosClient from '@/utils/axios';

export const getClaimedListDataService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/getrewardcoupanbytyperemote`,
    payload,
    'GET'
  );
  return response;
};

export const revertCodeService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/rule/rewardrevertpoints`,
    payload,
    'GET'
  );
  return response;
};

export const getRewardPOSService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/getrewardpos`,
    payload,
    'GET'
  );
  return response;
};

export const getActivityListDataService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/loyalty/getacitivitystreamremote`,
    payload,
    'GET'
  );
  return response;
};

export const getAllActivityService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/members/getallactivities`,
    payload,
    'GET'
  );
  return response;
};

export const checkExportReportPendingService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/loyalty/checkexportreportpending`,
    payload,
    'GET'
  );
  return response;
};

export const saveExportReportPendingService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/loyalty/saveexportcreditbalancerequest`,
    payload,
    'GET'
  );
  return response;
};

export const getDiscountCodesListService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/getrewardcoupanbytyperemoteupdated`,
    payload,
    'GET'
  );
  return response;
};
