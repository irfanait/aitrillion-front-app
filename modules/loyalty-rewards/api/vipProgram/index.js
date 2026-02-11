import axiosClient from '@/utils/axios';

export const getVIPProgramDataService = async (payload) => {
  const response = await axiosClient(`/loyalty/tier`, payload, 'GET');
  return response;
};

export const statusChangeVIPProgramService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/tier/enbledisabletier`,
    payload,
    'POST'
  );
  return response;
};

export const saveMileStoneService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/tier/savetiermilestonesetting`,
    payload,
    'POST'
  );
  return response;
};

export const shortingTierService = async (payload) => {
  const response = await axiosClient(`/loyalty/tier/sorttier`, payload, 'POST');
  return response;
};

export const saveTierRemoteService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/tier/savetierremote`,
    payload,
    'POST'
  );
  return response;
};

export const updateTierRemoteService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/tier/updatetierremote`,
    payload,
    'POST'
  );
  return response;
};

export const deleteTierService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/tier/deletetier`,
    payload,
    'POST'
  );
  return response;
};

export const syncCustomerService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/tier/setcronfortagbasedtier`,
    payload,
    'POST'
  );
  return response;
};

export const changeTierStatusService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/tier/activedeactivetierremote`,
    payload,
    'POST'
  );
  return response;
};
