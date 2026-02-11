import axiosClient from '@/utils/axios';

export const getEarnPointsDataService = async () => {
  const response = await axiosClient(
    '/loyalty/rule/getearnpointactivitylist',
    {},
    'GET'
  );
  return response?.data;
};

export const getActivitiesDetailsByIdService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/rule/getactivitydetails`,
    payload,
    'GET'
  );
  return response?.data;
};

export const updateActivitiesService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/rule/updateactivityruleformremote`,
    payload,
    'POST'
  );
  return response?.data;
};

export const saveActivitiesService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/rule/saveactivityruleformremote`,
    payload,
    'POST'
  );
  return response?.data;
};

export const updateActivitiesStatusService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/rule/updaterulestatusremote`,
    payload,
    'POST'
  );
  return response?.data;
};

export const getProductAndCollectionService = async (payload, apiEndPoint) => {
  const response = await axiosClient(
    `/loyalty/reward/${apiEndPoint}`,
    payload,
    'POST'
  );
  return response;
};
