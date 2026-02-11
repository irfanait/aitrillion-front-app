import { Children } from 'react';

import { getToken } from '@/utils/authHelpers';
import { store } from '@/redux';
export const token = getToken();
const state = store.getState();
export const { login_auth } = state.jwtState;
export const encodedShopId = login_auth?.encoded_shop_id || null;
export const is_bkac = login_auth?.is_bkac ? 1 : 0;
export const shopType = login_auth?.shop_type?.toLowerCase() || null;


