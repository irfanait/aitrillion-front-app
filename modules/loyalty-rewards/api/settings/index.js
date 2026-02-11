import axiosClient from '@/utils/axios';

export const getGeneralSettingDataService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/generalsettings`,
    payload,
    'GET'
  );
  return response;
};
export const updateSettingService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/updateloyaltygeneralsettings`,
    payload,
    'POST'
  );
  return response;
};

export const updateCustomerBlockTagService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/updatecustomerblocktags`,
    payload,
    'POST'
  );
  return response;
};
export const getUnBlockCustomersService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/getunblockedcustomers?is_api_request=1`,
    payload,
    'POST'
  );
  return response;
};

export const getSegmentListService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/getsegmentlist?is_api_request=1`,
    payload,
    'POST'
  );
  return response;
};

export const getBlockCustomerCountryTagService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/getblockcustomercountbytag`,
    payload,
    'POST'
  );
  return response;
};

export const blockCustomersService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/blockcustomerbytag`,
    payload,
    'POST'
  );
  return response;
};

export const updateSegmentBsdLytParticipation = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/updatesegmentbasedloyltyparticipation`,
    payload,
    'POST'
  );
  return response;
};

export const updateLytDiscountSettings = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/updateloyaltydiscountsettings`,
    payload,
    'POST'
  );
  return response;
};

export const syncCustomerBirthdayService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/reward/updatemapdobwithloyaltyfromgeneralforms`,
    payload,
    'POST'
  );
  return response;
};

export const getEmailSettingService = async (payload) => {
  const response = await axiosClient(`/api/lytsetting`, payload, 'GET');
  return response;
};

export const saveEmailSettingService = async (payload) => {
  const response = await axiosClient(`/api/lytsetting`, payload, 'POST');
  return response;
};

export const getLanguageSettingService = async (payload) => {
  const response = await axiosClient(`/loyalty/language/setup`, payload, 'GET');
  return response;
};

export const changeLanguageSettingService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/language/selectlanguage`,
    payload,
    'POST'
  );
  return response;
};

export const saveLanguageSettingService = async (payload) => {
  const response = await axiosClient(
    `/loyalty/language/savelanguagesremote`,
    payload,
    'POST'
  );
  return response;
};
