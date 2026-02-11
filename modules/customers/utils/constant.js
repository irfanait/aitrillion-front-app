export const segmentListTabItems = [
  { label: 'All segments', key: 'all' },
  { label: 'Custom', key: 'custom' },
  { label: 'Pre-built', key: 'default' },
];

export const fieldTypeOptions = [
  {
    label: 'Text - Any text containing letters up to 250 characters.',
    value: 'text',
  },
  {
    label: 'Text Area - A larger multi-line textbox',
    value: 'textarea',
  },
  {
    label: 'Checkbox - Select true or false',
    value: 'checkbox',
  },
  {
    label: 'Radio Button - Select one option',
    value: 'radio',
  },
  {
    label: 'Select Box - Choose one value',
    value: 'select',
  },
  {
    label: 'Number - 10 digit whole number ≤ 2147483647',
    value: 'number',
  },
  {
    label: 'Decimal - Number with decimal',
    value: 'decimal',
  },
  { label: 'Date - Choose date', value: 'date' },
  { label: 'Datetime - Date with time', value: 'datetime' },
];

export const filterGroupOptions = [
  { label: 'Custom Field', value: 'Custom Field' },
  { label: 'Customer', value: 'Customer' },
  { label: 'Loyalty', value: 'Loyalty' },
  { label: 'Push', value: 'Push' },
  { label: 'Email', value: 'Email' },
  { label: 'Review', value: 'Review' },
  { label: 'Tracking', value: 'Tracking' },
  { label: 'Shop', value: 'Shop' },
  { label: 'Address', value: 'Address' },
];

export const keyValueTooltip = (
  <div style={{ maxWidth: 220 }}>
    <div style={{ fontWeight: 600, marginBottom: 6 }}>Notes</div>
    <div>Key1: value1</div>
    <div>Key2: value1</div>
    <div>Key3: value1</div>
  </div>
);

export const continuousStringTooltip = (
  <div style={{ maxWidth: 240 }}>
    <div style={{ fontWeight: 600, marginBottom: 6 }}>Notes</div>
    <div>
      This is one continuous string synced as a single value with AiTrillion.
    </div>
  </div>
);

export const customerDetailsTabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'orders', label: 'Orders' },
  { key: 'membership', label: 'Membership' },
  { key: 'list', label: 'List' },
  { key: 'affiliate', label: 'Affiliate G' },
  { key: 'visited', label: 'Visited products' },
];

export const FIELD_TYPE_OPTIONS = [
  { key: 'text', value: 'Text - Any combination of letters and numbers' },
  { key: 'textarea', value: 'Text Area - A larger multi-line textbox' },
  {
    key: 'number',
    value:
      'Number - Any 10 digit whole number less than or equal to 2147483647',
  },
  { key: 'decimal', value: 'Decimal - Any positive or negative number' },
  { key: 'checkbox', value: 'Checkbox - True or false value' },
  {
    key: 'radio',
    value: 'Radio Button - Select a single value from a defined list',
  },
  {
    key: 'select',
    value: 'Select Box - Select a single value from a defined list',
  },
  { key: 'date', value: 'Date - Calendar date selection' },
  {
    key: 'datetime',
    value: 'DateTime - Calendar date with time selection',
  },
];
