// Helpers

import AitDatePicker from '@/components/atoms/ait-date-picker/aitDatePicker';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import {
  EyeOutlined,
  FileTextOutlined,
  GiftOutlined,
  MailOutlined,
  SendOutlined,
  StarFilled,
  StopOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import moment from 'moment';

export const isHtml = (val) =>
  typeof val === 'string' && /<\s*(a|span|div|p|strong|em|br)[\s>]/i.test(val);

export const stripHtml = (html) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
};

// utils/normalizeFields.js
export const normalizeFieldsForFilters = (fields = []) =>
  fields
    .filter((f) => f.is_filter === '1')
    .map((f) => {
      const type = f.datatype_name?.toLowerCase() || '';
      let source = null;

      // determine API source dynamically based on field name / group
      if (type === 'select') {
        const name = f.field_name.toLowerCase();

        if (name.includes('campaign')) source = 'campaignList';
        else if (name.includes('segment')) source = 'segmentList';
        else if (name.includes('country')) source = 'countryList';
        else if (name.includes('tag')) source = 'tagList';
        // add more mapping rules as needed
      }

      return {
        id: f.id,
        name: f.field_name,
        type,
        columnType: f.db_column_type,
        operators: f.operators || [],
        source, // <-- tag for dynamic API
        options: [],
      };
    });

// export const isOperatorValueRequired = (field, operator) => {
//   if (!operator) return false;

//   const label = operator.label?.toLowerCase() || '';
//   const sql = operator.sqloperator?.toLowerCase() || '';

//   // No input required
//   if (label.includes('empty') || sql.includes('null')) return false;

//   return true;
// };

export const isOperatorValueRequired = (field, operator) => {
  if (!operator || !field) return false;
  if (operator?.has_value === false) return false;

  const sql = operator.sqloperator?.trim();

  // 🔒 Fixed boolean operators (no value needed)
  const isFixedBooleanSql =
    sql === '=1' || sql === '=0' || sql === '!=1' || sql === '!=0';

  const isBooleanLikeField =
    field?.datatypeId === '6' || // reviews, engagement flags
    field?.datatypeId === '4' ||
    field?.datatypeId === '9' ||
    field?.datatype_name?.toLowerCase() === 'boolean';

  if (isFixedBooleanSql && isBooleanLikeField) {
    return false;
  }

  // empty / not empty
  if (
    operator.label?.toLowerCase().includes('empty') ||
    operator.sqloperator?.toLowerCase().includes('null')
  ) {
    return false;
  }

  return true;
};

export const isOperatorValueValid = (field, operator, value) => {
  if (!operator) return false;

  // ✅ Relative date operators (within / before / not within)
  if (operator?.sqloperator?.includes('VARDAY')) {
    const v = String(value ?? '').trim();
    return v !== '' && Number(v) > 0;
  }

  // ✅ Operators that do not need any value
  if (!isOperatorValueRequired(field, operator)) return true;

  // ✅ Boolean fields
  const isBoolean =
    (field?.datatype_name?.toLowerCase() === 'boolean' ||
      field?.db_column_type === '4' ||
      field?.db_column_type === '9') &&
    (!Array.isArray(field.options) || field.options.length === 0);

  if (isBoolean) {
    return value === '1' || value === '0';
  }

  // ✅ DatePicker (dayjs)
  if (dayjs.isDayjs(value)) {
    return value.isValid();
  }

  // ✅ Select / dropdown object
  if (typeof value === 'object' && value !== null) {
    return Boolean(value?.value);
  }

  // ✅ Text / number input
  return String(value ?? '').trim().length > 0;
};

export const resolveLabelFromOptions = (options = [], value) => {
  if (!Array.isArray(options)) return value;

  const match = options.find(
    (opt) => String(opt.value ?? opt.id) === String(value)
  );

  return match?.label ?? match?.name ?? match?.title ?? value;
};

export const renderInlineOperatorInput = ({
  field,
  operator,
  value,
  setValue,
  loading,
}) => {
  if (!field || !operator) return null;

  const datatype = field?.datatype_name?.toLowerCase();

  const labelLower = operator.label?.toLowerCase() || '';
  const sqlLower = operator.sqloperator?.toLowerCase() || '';

  const isFixedBooleanSql =
    sqlLower === '=1' ||
    sqlLower === '=0' ||
    sqlLower === '!=1' ||
    sqlLower === '!=0';

  const isBooleanLikeField =
    field?.datatypeId === '6' ||
    field?.datatypeId === '4' ||
    field?.datatypeId === '9' ||
    field?.datatype_name?.toLowerCase() === 'boolean';

  if (isFixedBooleanSql && isBooleanLikeField) {
    return null;
  }

  // ⛔ No value required
  if (labelLower.includes('empty') || sqlLower.includes('null')) {
    return null;
  }

  if (operator?.sqloperator?.includes('VARDAY')) {
    const days = Number(value);
    const calculatedDate =
      !Number.isNaN(days) && days > 0
        ? dayjs().subtract(days, 'day').format('MM/DD/YYYY')
        : null;

    return (
      <div style={{ marginTop: 5 }}>
        <AitInputBox
          size="small"
          type="number"
          placeholder="Enter days (e.g., 30)"
          value={value ?? ''}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  }

  if (!operator?.sqloperator?.includes('{VAR}')) {
    return null;
  }

  // ✅ TRUE boolean (system only)
  if (isTrueBooleanField(field)) {
    return null;
  }

  // ============================
  // ✅ RADIO / SELECT (SINGLE)
  // ============================
  if (
    ['radio', 'select', 'checkbox'].includes(datatype) &&
    Array.isArray(field.options) &&
    field.options.length > 0
  ) {
    return (
      <div style={{ marginTop: 5 }}>
        <AitSelectBox
          showSearch
          allowClear
          style={{ width: '100%', marginTop: 6 }}
          placeholder={`Select ${field.field_name}`}
          loading={loading}
          value={typeof value === 'object' ? value.value : value}
          options={normalizeSelectOptions(field.options)}
          onChange={(val) => {
            const label = resolveLabelFromOptions(field.options, val);

            setValue({
              value: val,
              label,
            });
          }}
        />
      </div>
    );
  }

  // ============================
  // ✅ DATE
  // ============================
  if (
    ['date', 'datetime', '2'].includes(datatype) &&
    !operator?.sqloperator?.includes('VARDAY')
  ) {
    const isDateTime = field.field_type === 'datetime';

    const dateValue = dayjs.isDayjs(value)
      ? value
      : value
        ? dayjs(
            value,
            isDateTime
              ? ['MM/DD/YYYY HH:mm:ss', 'YYYY-MM-DD HH:mm:ss']
              : ['MM/DD/YYYY', 'YYYY-MM-DD'],
            true
          )
        : null;
    return (
      <AitDatePicker
        size="small"
        style={{ width: '100%', marginTop: 6 }}
        value={dateValue && dateValue.isValid() ? dateValue : null}
        picker="date"
        format={isDateTime ? 'MM/DD/YYYY hh:mm A' : 'MM/DD/YYYY'}
        showTime={
          isDateTime
            ? {
                format: 'hh:mm A',
                use12Hours: true,
              }
            : false
        }
        onChange={(val) => {
          setValue(val && val.isValid() ? val : null);
        }}
      />
    );
  }

  // ============================
  // ✅ NUMBER
  // ============================
  if (
    ['int', 'integer', 'float', 'decimal', 'number', '3'].includes(datatype)
  ) {
    return (
      <div style={{ marginTop: 5 }}>
        <AitInputBox
          size="small"
          type="number"
          placeholder="Enter number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  }

  // ============================
  // ✅ DEFAULT TEXT
  // ============================
  return (
    <div style={{ marginTop: 5 }}>
      <AitInputBox
        size="small"
        placeholder={`Enter ${field.field_name}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export const safeParseFilterJson = (jsonLike) => {
  try {
    const parsed =
      typeof jsonLike === 'string' ? JSON.parse(jsonLike) : jsonLike;
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
};

export const debounce = (fn, delay = 500) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const getFieldValue = (value, fallback = '–') => {
  if (value === null || value === undefined || value === '') return fallback;
  return value;
};

export const getFormattedDate = (
  value,
  format = 'MM-DD-YYYY',
  fallback = '–'
) => {
  if (!value) return fallback;

  // ✅ Remove duplicate AM/PM part if present
  const cleanedValue =
    typeof value === 'string'
      ? value.replace(/\s\d{1,2}:\d{2}\s?(AM|PM)$/i, '')
      : value;

  const m = moment(cleanedValue, 'YYYY-MM-DD HH:mm:ss', true);

  return m.isValid() ? m.format(format) : fallback;
};

export const getBoolean = (value) => {
  return Boolean(Number(value));
};

export const getTimelineIconConfig = (css) => {
  switch (css) {
    case 'bg-marketing_email_unsubscribed':
      return {
        icon: <StopOutlined />,
        bg: '#FF6B6B',
        badge: '#FFE3E3',
      };

    case 'bg-loyalty_email_unsubscribed':
      return {
        icon: <GiftOutlined />,
        bg: '#B388FF',
        badge: '#EAD7FF',
      };

    case 'bg-newsletter_email_unsubscribed':
      return {
        icon: <FileTextOutlined />,
        bg: '#4A90E2',
        badge: '#D6E9FF',
      };

    case 'bg-email_opened_marketing':
      return {
        icon: <EyeOutlined />,
        bg: '#FF80AB',
        badge: '#FFD6E7',
      };

    case 'bg-email_sent_marketing':
      return {
        icon: <SendOutlined />,
        bg: '#1A73E8',
        badge: '#DCEBFF',
      };

    case 'bg-visited_products':
      return {
        icon: <StarFilled />,
        bg: '#F9A825',
        badge: '#FFF3C0',
      };

    default:
      return {
        icon: <MailOutlined />,
        bg: '#9E9E9E',
        badge: '#E8E8E8',
      };
  }
};
export const formatDateSafe = (
  primaryDate,
  fallbackDate,
  format = 'DD-MM-YYYY'
) => {
  const isInvalid = (d) =>
    !d || d === '–' || d === '0000-00-00 00:00:00' || d === 'null';

  const dateToUse = !isInvalid(primaryDate)
    ? primaryDate
    : !isInvalid(fallbackDate)
      ? fallbackDate
      : null;

  if (!dateToUse) return '–';

  // ✅ Remove duplicate AM/PM part if present (e.g., "2025-08-10 19:03:06 07:03 PM")
  const cleanedDate =
    typeof dateToUse === 'string'
      ? dateToUse.replace(/\s\d{1,2}:\d{2}\s?(AM|PM)$/i, '')
      : dateToUse;

  const m = moment(cleanedDate);
  return m.isValid() ? m.format(format) : '–';
};

export const getDisplayValue = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    return value.label ?? value.value ?? '';
  }
  return value;
};

export const MODULE_ID_TO_GROUP_TITLE = {
  0: 'Customer',
  1: 'Loyalty',
  2: 'Email',
  3: 'Push',
  4: 'Review',
  5: 'Tracking',
  7: 'Shop',
  8: 'Address',
  9: 'Custom Fields',
  10: 'Orders',
  11: 'Affiliate',
  12: 'Smartpopup',
  13: 'SMS',
  14: 'Membership',
};

export const resolveFieldOptions = (
  field,
  dynamicOptions,
  customFieldOptions
) => {
  if (!field) return [];

  // ✅ Custom fields
  if (field.is_custom) {
    return customFieldOptions?.[field.db_column_name] || [];
  }

  // ✅ API based system fields
  if (field.api_source) {
    return dynamicOptions?.[field.api_source] || [];
  }

  // fallback
  return field.options || [];
};

export const isTrueBooleanField = (field) => {
  const datatype = field?.datatype_name?.toLowerCase();
  const isBooleanType =
    datatype === 'boolean' ||
    field?.db_column_type === '4' ||
    field?.db_column_type === '9';

  const hasOptions = Array.isArray(field?.options) && field.options.length > 0;

  return isBooleanType && !hasOptions;
};

export const normalizeSelectOptions = (options = []) => {
  if (!Array.isArray(options)) return [];

  return options.map((opt) => ({
    label:
      opt.label ??
      opt.option_label ??
      opt.name ??
      opt.title ??
      String(opt.value ?? opt.option_value ?? opt.id ?? ''),
    value: opt.value ?? opt.option_value ?? opt.id ?? opt.label ?? '',
  }));
};

export const normalizeOperatorValue = (value) => {
  if (typeof value === 'object' && value !== null) {
    return {
      stored: value.value,
      display: value.label,
      local: value,
    };
  }

  return {
    stored: value,
    display: value,
    local: value, // ✅ keep string for input fields
  };
};

export const normalizeDateOperatorValue = (payload) => {
  const { moduleFieldOperator, operatorValue } = payload || {};

  // Relative date (VARDAY) stores days (e.g., "30")
  if (
    typeof moduleFieldOperator === 'string' &&
    moduleFieldOperator.includes('VARDAY')
  ) {
    const days = Number(operatorValue);
    if (Number.isNaN(days) || days <= 0) return null;
    return dayjs().subtract(days, 'day');
  }

  // Absolute date stored as string
  if (operatorValue) {
    const formats =
      field_type === 'datetime'
        ? ['MM/DD/YYYY HH:mm:ss', 'YYYY-MM-DD HH:mm:ss']
        : ['MM/DD/YYYY', 'YYYY-MM-DD'];

    const d = dayjs(operatorValue, formats, true);
    return d.isValid() ? d : null;
  }

  return null;
};

export const normalizeLabel = (label = '') => label.trim().toLowerCase();

// Helper function to convert camelCase to sentence case
export const toSentenceCase = (str) => {
  if (!str) return '';

  // List of acronyms that should remain in uppercase
  const acronyms = [
    'SKU',
    'SMS',
    'URL',
    'ID',
    'API',
    'HTML',
    'CSS',
    'JSON',
    'XML',
    'HTTP',
    'HTTPS',
    'FTP',
    'IP',
    'GPS',
    'PDF',
    'CSV',
    'UTC',
    'GMT',
    'USD',
    'EUR',
    'GBP',
    'SEO',
    'SLA',
    'KPI',
    'ROI',
    'CRM',
    'ERP',
    'AI',
    'ML',
    'UI',
    'UX',
    'FAQ',
    'QR',
    'PIN',
    'OTP',
    'VIP',
    'B2B',
    'B2C',
    'POS',
    'EOD',
    'ETA',
    'RSVP',
  ];

  // Add space before capital letters that follow lowercase letters (camelCase boundaries)
  // Also add space before a capital letter followed by lowercase if it's after an uppercase (for acronyms like "SMSBounced" -> "SMS Bounced")
  const withSpaces = str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .trim();

  // Convert to lowercase and capitalize first letter
  const lowercase = withSpaces.toLowerCase();
  const capitalized = lowercase.charAt(0).toUpperCase() + lowercase.slice(1);

  // Replace acronyms with uppercase versions
  let result = capitalized;
  acronyms.forEach((acronym) => {
    const lowerAcronym = acronym.toLowerCase();
    // Match the acronym as a whole word (with word boundaries)
    const regex = new RegExp(`\\b${lowerAcronym}\\b`, 'gi');
    result = result.replace(regex, acronym);
  });

  return result;
};

// export const getOperatorIdentity = (op) => {
//   if (!op) return '';
//   return op.has_value === false ? op.label : op.sqloperator;
// };
export const getOperatorIdentity = (op) => {
  if (!op) return '';
  return op.sqloperator; // always use sqloperator
};

export const getBooleanOperatorDisplayValue = (operator) => {
  if (!operator?.label) return '';
  return operator.label;
};

export const normalizeGroupTitle = (group, groups) => {
  if (!group || !Array.isArray(groups)) return null;

  const normalized = group.trim().toLowerCase();

  const matched = groups.find(
    (g) => g.title?.trim().toLowerCase() === normalized
  );

  return matched ? matched.title : null;
};

export const isRelativeDateOperator = (operator) => {
  const label = operator?.label?.toLowerCase() || '';
  return label === 'within' || label === 'not within';
};

export const isEmptyDateOperator = (operator) => {
  const label = operator?.label?.toLowerCase() || '';
  return label === 'is empty' || label === 'is not empty';
};

export const getBooleanOperatorLabel = (field, operator) => {
  if (!field || !operator) return operator?.label;

  const col = field.db_column_name;

  if (col === 'verified_email') {
    return operator.sqloperator === '=1'
      ? 'is verified email'
      : 'is not verified email';
  }

  if (col === 'is_subscribe') {
    return operator.sqloperator === '=1'
      ? 'is subscribed'
      : 'is not subscribed';
  }

  if (col === 'is_push_access') {
    return operator.sqloperator === '=1' ? 'is available' : 'is not available';
  }

  if (col === 'review_email') {
    return operator.sqloperator === '=1'
      ? 'is subscribed'
      : 'is not subscribed';
  }

  return operator.label;
};

export const isEmptyOperator = (op) =>
  String(op?.label || '')
    .trim()
    .toLowerCase()
    .includes('empty');

// export const isEmailField = (field) => {
//   if (!field) return false;

//   return (
//     String(field.db_column_name || '')
//       .toLowerCase()
//       .includes('email') ||
//     String(field.datatypeName || '').toLowerCase() === 'email'
//   );
// };

// export const EMAIL_ALLOWED_OPERATOR_NAMES = [
//   'is',
//   "isn't",
//   'is empty',
//   'is not empty',
// ];

export const isShopGroup = (title) =>
  String(title || '')
    .trim()
    .toLowerCase() === 'shop';

export const isBirthdayField = (field) => {
  const name = String(field?.field_name || '').toLowerCase();
  const col = String(field?.db_column_name || '').toLowerCase();

  return name.includes('birthday') || col.includes('birthday');
};

export const isDateLikeField = (payload) => {
  const type = String(
    payload?.datatypeName ||
      payload?.datatype_name ||
      payload?.datatypeId ||
      payload?.db_column_type ||
      ''
  ).toLowerCase();

  return (
    type === 'date' || type === 'datetime' || type === '2' // db_column_type = 2
  );
};

export const normalizeDateValue = (value, isDateTime = false) => {
  if (!value) return { stored: '', display: '', local: null };

  const parsed = dayjs(value, [
    'MM/DD/YYYY',
    'MM/DD/YYYY HH:mm:ss',
    'YYYY-MM-DD HH:mm:ss',
  ]);

  if (!parsed.isValid()) {
    return { stored: value, display: value, local: value };
  }

  return {
    stored: isDateTime
      ? parsed.format('YYYY-MM-DD HH:mm:ss') // API
      : parsed.format('MM/DD/YYYY'),
    display: parsed.format('MM/DD/YYYY'), // CHIP ALWAYS DATE
    local: parsed, // DatePicker
  };
};
