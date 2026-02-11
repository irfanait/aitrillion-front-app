import axiosClient from '@/utils/axios';

export const getDashboardDataService = async () => {
  const response = await axiosClient(
    '/loyalty/index/homedataremote?is_api_request=1',
    {},
    'POST'
  );
  return response?.data;
};

export const updateModuleService = async (payload) => {
  // let headers = {
  //   'Content-Type': 'multipart/form-data',
  // };
  const response = await axiosClient(
    '//loyalty/index/enablemoduleremote',
    payload,
    'POST'
  );
  return response?.data;
};

export const getPerformanceCountService = async (payload) => {
  let headers = {
    'Content-Type': 'multipart/form-data',
  };
  const response = await axiosClient(
    '/loyalty/loyalty/getfilterdataremote',
    payload,
    'POST',
    headers
  );
  return response;
};

export const getChartDataService = async (payload) => {
  let headers = {
    'Content-Type': 'multipart/form-data',
  };
  const response = await axiosClient(
    '/loyalty/loyalty/drawchartremote',
    payload,
    'POST',
    headers
  );

  let res = Array.isArray(response?.data)
    ? response
    : { ...response, data: [] };
  return res;
};

export const getAnalyticChartDataService = async (payload) => {
  let headers = {
    'Content-Type': 'multipart/form-data',
  };
  const response = await axiosClient(
    '/loyalty/loyalty/getanalyticdataremote',
    payload,
    'POST',
    headers
  );
  return response;
};

export const versionChangeService = async (payload) => {
  const response = await axiosClient(
    '/api/startguide?is_api_request=1',
    payload,
    'POST'
  );
  return response?.data;
};
