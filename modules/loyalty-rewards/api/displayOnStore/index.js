import axiosClient from '@/utils/axios';

export const getDisplayOnStoreService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/loyalty/getwidgetsettingremote`,
    payload,
    'GET'
  );
  return response;
};

export const saveDisplayOnStoreService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/loyalty/savesettingremote`,
    payload,
    'POST'
  );
  return response;
};

export const generateShortcodeService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/loyalty/savepanelshortcodewidgetsetting`,
    payload,
    'POST'
  );
  return response;
};
