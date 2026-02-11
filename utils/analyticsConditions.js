// ✅ Define constants
export const PLAN_142 = 142;
export const ALLOW_CHAT_OPTION = 100;

// ✅ True only in production
export const isProd = () =>
  process.env.NEXT_PUBLIC_APPLICATION_ENV === 'production';

/**
 * Returns whether analytics tracking should be allowed
 */
export function shouldTrack({ is_bkac, is_dummey_shop, login_id }) {
  // Allow all in non-prod for testing
  if (!isProd()) return true;

  // Skip tracking for system/bulk/dummy stores
  if (is_bkac) return false;
  if (is_dummey_shop) return false;

  // Allow specific internal IDs (matching PHP parity)
  if ([12600, 13380].includes(Number(login_id))) return true;

  return true; // default: allow all legit shops
}

/**
 * Optional helper for gated actions
 */
export function checkIsActivatedContact(plan_id, customer_count, action) {
  if (Number(plan_id) === PLAN_142) {
    if (action === 'notifycharge') return true;
    return Number(customer_count) >= ALLOW_CHAT_OPTION;
  }
  return true;
}
