import { moduleRoute } from '@/modules/layouts/routeControl/route';

// ✅ Define friendly names for each email-marketing route
export const PAGE_TITLES = {
  // ---------- Dashboard ----------
  '/email-marketing/dashboard': 'Email Dashboard',

  // ---------- Campaigns ----------
  '/email-marketing/campaign/list': 'Campaign List',
  '/email-marketing/campaign/create-campaign': 'Create Campaign',
  '/email-marketing/campaign/[id]/edit-campaign': 'Edit Campaign',
  '/email-marketing/campaign/[id]/createAB': 'Create A/B Campaign',
  '/email-marketing/campaign/[id]': 'Campaign Details',

  // ---------- Templates ----------
  '/email-marketing/templates/list': 'Templates List',
  '/email-marketing/templates/editorv2': 'Email Template Editor',
  '/email-marketing/templates/dashboard': 'Templates Dashboard',
  '/email-marketing/templates/report': 'Templates Report',

  // ---------- Coupons ----------
  '/email-marketing/coupons/list': 'Coupons List',
  '/email-marketing/coupons/add': 'Add Coupon',
  '/email-marketing/coupons/[id]': 'Edit Coupon',

  // ---------- Settings ----------
  '/email-marketing/settings/dkimsetting': 'DKIM Settings',
  '/email-marketing/settings/generalsettings': 'General Settings',
  '/email-marketing/settings/languagesetting': 'Language Settings',

  // ---------- Orders / Reports ----------
  '/email-marketing/orders': 'Orders',
  '/email-marketing/reports': 'Email Reports',

  // ---------- Popup ----------
  '/email-marketing/popup': 'Popup Settings',

  [moduleRoute.loyalty_rewards.dashboard]: 'Loyalty Dashboard',
  [moduleRoute.loyalty_rewards.earn_points]: 'Earn Points',
  [moduleRoute.loyalty_rewards.redeem_points]: 'Redeem Points',
  [moduleRoute.loyalty_rewards.vip_program]: 'VIP Program',
  [moduleRoute.loyalty_rewards.gift_code]: 'Gift Code',
  [moduleRoute.loyalty_rewards.reward_order]: 'Loyalty',
  [moduleRoute.loyalty_rewards.free_product_reward_gallary]:
    'Free Product Reward Gallary',
  [moduleRoute.loyalty_rewards.free_product_reward_setting]:
    'Free Product Reward Settings',
  [moduleRoute.loyalty_rewards.point_expiry]: 'Point Expiry',
  [moduleRoute.loyalty_rewards.loyalty_members]: 'Loyalty Members',
  [moduleRoute.loyalty_rewards.import_members]: 'Import Members',
  [moduleRoute.loyalty_rewards.activity_report]: 'Activity Report',
  [moduleRoute.loyalty_rewards.discount_report]: 'Discount Report',
  [moduleRoute.loyalty_rewards.email_settings]: 'Email Settings',
  [moduleRoute.loyalty_rewards.language_settings]: 'Language Settings',
  [moduleRoute.loyalty_rewards.general_settings]: 'General Settings',
  [moduleRoute.loyalty_rewards.display_on_store]: 'Display On Store',

  //----------customers/ all-customer
  '/customers/all-customers/list': 'Customers List',
  '/customers/segment/list': 'Segment List',
  '/customers/list/list': 'List',
  '/customers/custom-fields/custom-fields-list': 'Custom Fields',

  '/customers/all-customers/customer-details/[id]': 'Customer Details',
};
