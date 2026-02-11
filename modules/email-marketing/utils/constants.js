import { store } from '@/redux';
const state = store.getState();
const getDashboardStats =
  state?.emailMarketingDashboardState?.getDashboardStats || null;

export const campaignListTabItems = [
  'All',
  'Sent',
  'Scheduled',
  'Draft',
  'Pending',
  'Failed',
];

export const templateListTabItems = ['Pre-made templates', 'Saved'];

export const templateFilterOptions = [
  { key: 'aiTemplate', label: 'All' },
  { key: 'BFCM', label: 'BFCM' },
  { key: 'Welcome_emails', label: 'Welcome Emails' },
  { key: 'New_products', label: 'New Products' },
  { key: 'Abandoned_cart', label: 'Abandoned Cart' },
  { key: 'Holiday', label: 'Holiday' },
  { key: 'Offers', label: 'Offers' },
  { key: 'Best_selling_products', label: 'Best Selling Products' },
  { key: 'Thank_you_emails', label: 'Thank You Emails' },
  { key: 'Loyalty_emails', label: 'Loyalty Emails' },
  { key: 'Winback_customers', label: 'Winback Customers' },
  { key: 'Membership', label: 'Membership' },
  { key: 'Valentine_special', label: 'Valentine Special' },
  { key: 'New_Year', label: 'New Year' },
];

export const detailsTabItems = [
  { key: 'overview', label: 'Overview' },
  { key: 'ab-test', label: 'A/B test results' },
  { key: 'recipient-activity', label: 'Recipient activity' },
  { key: 'message', label: 'Message' },
  { key: 'audience', label: 'Audience' },
  { key: 'orders', label: 'Orders' },
  { key: 'link-activity', label: 'Link activity' },
];

export const emailSettingsConfig = [
  {
    key: 'accept_email_marketing',
    act: 'set_email_accept_marketing',
    title: 'Send mail to accept marketing',
    description:
      'Limit email marketing to customers who have granted consent for email marketing on Shopify.',
    kb_link:
      'https://docs.aitrillion.com/portal/en/kb/articles/filter-customers-based-on-their-email-subscription-status-subscribed-unsubscribed#Introduction',
  },
  {
    key: 'email_marketing_shopify_consent',
    act: 'set_email_marketing_shopify_consent',
    title:
      'Sync AiTrillion email marketing unsubscribed consent for customers in the Shopify store.',
    description:
      'Update the AiTrillion email marketing unsubscribed status in the Shopify store when someone unsubscribes from AiTrillion Marketing Emails.',
    kb_link: '',
  },
  {
    key: 'is_open_bot_filter_enable',
    act: 'set_open_bot_filter',
    title: 'Aggressive machine email open bot filter',
    description:
      'An aggressive machine email open bot filter detects machine opens and only counts actual human interactions as valid opens. By enabling this setting, your total email clicks may exceed your total email opens, as we currently lack the ability to identify machines clicks.',
    kb_link:
      'https://docs.aitrillion.com/portal/en/kb/articles/aggressive-machine-email-open-bot-filter',
  },
];
