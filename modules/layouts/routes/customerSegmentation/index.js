const isCustomerSegmentationRoutesV2 = [
  {
    id: 'customers-all',
    label: 'All customers',
    nav: 'allCustomers',
    feature_id: 'customers',
    ai_module_feature: 'all_customer',
    plan_id: 'customers_all_customers',
    href: `/customers/all-customers/list`,
    eventName: 'left_menu_customers',
  },
  {
    id: 'customers-segment',
    label: 'Segment',
    nav: 'customerSegments',
    ai_module_feature: 'segment',
    feature_id: 'customers',
    plan_id: 'customers_segment',
    href: `/customers/segment/list`,
    eventName: 'left_menu_email_marketing_segment',
  },
  {
    id: 'customers-list',
    label: 'List',
    nav: 'customerList',
    ai_module_feature: 'customer_list',
    feature_id: 'customers',
    plan_id: 'customers_list',
    href: `/customers/list/list`,
    eventName: 'left_menu_email_marketing_list',
  },
  {
    id: 'customers-custom-fields',
    label: 'Custom fields',
    nav: 'customFields',
    ai_module_feature: 'custom_fields',
    feature_id: 'custom_fields',
    plan_id: 'customers_custom_fields',
    href: `/customers/custom-fields/custom-field-list`,
    eventName: 'left_menu_email_marketing_custom_fields',
  },
  {
    id: 'customers-import',
    label: 'Import',
    nav: 'importCustomers',
    ai_module_feature: 'customer_insights_import',
    feature_id: 'customers',
    plan_id: 'customers_import',
    href: `/customers/import-csv/list`,
    eventName: 'left_menu_email_marketing_import',
    createButton: {
      href: `/customers/import-csv/upload-csv`,
      eventName: 'left_menu_email_marketing_create_import',
    },
  },
];

const isCustomerSegmentationRoutesV1 = (token) => [
  {
    id: 'customers-all',
    label: 'All customers',
    nav: 'allCustomers',
    feature_id: 'customers',
    ai_module_feature: 'all_customer',
    plan_id: 'customers_all_customers',
    href: `${process.env.NEXT_PUBLIC_APP_URL}/customers#/list?ai_v2=${token}`,
    eventName: 'left_menu_customers',
  },
  {
    id: 'customers-segment',
    label: 'Segment',
    nav: 'customerSegments',
    ai_module_feature: 'segment',
    feature_id: 'customers',
    plan_id: 'customers_segment',
    href: `${process.env.NEXT_PUBLIC_APP_URL}/customers/segmentlist`,
    eventName: 'left_menu_email_marketing_segment',
  },
  {
    id: 'customers-list',
    label: 'List',
    nav: 'customerList',
    ai_module_feature: 'customer_list',

    feature_id: 'customers',
    plan_id: 'customers_list',
    href: `${process.env.NEXT_PUBLIC_APP_URL}/workflowv1/list?ai_v2=${token}`,
    eventName: 'left_menu_email_marketing_list',
  },
  {
    id: 'customers-custom-fields',
    label: 'Custom Fields',
    nav: 'customFields',
    ai_module_feature: 'custom_fields',
    feature_id: 'custom_fields',
    plan_id: 'customers_custom_fields',
    href: `${process.env.NEXT_PUBLIC_APP_URL}/workflowv1/customfields?ai_v2=${token}`,
    eventName: 'left_menu_email_marketing_custom_fields',
  },
  {
    id: 'customers-import',
    label: 'Import',
    nav: 'importCustomers',
    ai_module_feature: 'customer_insights_import',
    feature_id: 'customers',
    plan_id: 'customers_import',
    href: `${process.env.NEXT_PUBLIC_APP_URL}/workflowv1/view/page/listcsv?ai_v2=${token}`,
    eventName: 'left_menu_email_marketing_import',
    createButton: {
      href: `${process.env.NEXT_PUBLIC_APP_URL}/workflowv1/view/page/importcsv#/import/index?ai_v2=${token}`,
      eventName: 'left_menu_email_marketing_create_import',
    },
  },
];

export const getCustomerSegmentationRoutes = (
  is_enable_customer_segmentation_v2,
  token
) => {
  return is_enable_customer_segmentation_v2
    ? isCustomerSegmentationRoutesV2
    : isCustomerSegmentationRoutesV1(token);
};
