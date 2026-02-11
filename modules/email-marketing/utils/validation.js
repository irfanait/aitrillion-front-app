import * as Yup from 'yup';
import dayjs from 'dayjs';

import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export const validateFetchAudienceCounts = (
  values,
  includeAudienceList = [], // kept for signature compatibility
  includeSegmentList = [] // kept for signature compatibility
) => {
  const errors = {};

  // --- Helpers --------------------------------------------------------------
  const toIdArray = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr
      .map((item) => {
        // tolerate different option shapes: id/value/key/string/number/object
        if (item == null) return '';
        if (typeof item === 'string' || typeof item === 'number')
          return String(item).trim();
        if (typeof item === 'object') {
          // common patterns from Autocomplete/select libraries
          const cand =
            item.value ??
            item.id ??
            item.key ??
            item._id ??
            (typeof item.label === 'string' ? item.label : '');
          return cand != null ? String(cand).trim() : '';
        }
        return '';
      })
      .filter(Boolean); // drop "", null, undefined
  };

  const {
    include_lists = [],
    include_segments = [],
    exclude_lists = [],
    exclude_segments = [],
  } = values ?? {};

  // Normalize to comparable string IDs
  const includeListIds = toIdArray(include_lists);
  const includeSegIds = toIdArray(include_segments);
  const excludeListIds = toIdArray(exclude_lists);
  const excludeSegIds = toIdArray(exclude_segments);

  const hasInclude = includeListIds.length > 0 || includeSegIds.length > 0;

  const hasExclude = excludeListIds.length > 0 || excludeSegIds.length > 0;

  // --- Rule 1: Require at least one include --------------------------------
  if (!hasInclude) {
    const msg = 'At least one list or segment must be selected';
    // set both so UI can highlight either control
    errors.include_lists = msg;
    errors.include_segments = msg;
  }

  // --- Rule 2: Cannot exclude if no includes are selected -------------------
  // Only add this message if we didn’t already add Rule 1’s include error,
  // to avoid confusing double messages about the same cause.
  if (hasExclude && !hasInclude) {
    const msg = 'Include selection required before using exclude';
    errors.include_lists = msg;
    errors.include_segments = msg;
    // No need to continue (conflicts check depends on having includes)
    return errors;
  }

  // --- Rule 3: Exclude cannot contain included items -----------------------
  if (hasInclude && hasExclude) {
    const includedIds = new Set([...includeListIds, ...includeSegIds]);
    const excludedIds = [...excludeListIds, ...excludeSegIds];

    const conflicts = excludedIds.filter((id) => includedIds.has(id));

    if (conflicts.length > 0) {
      if (excludeListIds.some((id) => includedIds.has(id))) {
        errors.exclude_lists =
          'You cannot exclude an audience already included';
      }
      if (excludeSegIds.some((id) => includedIds.has(id))) {
        errors.exclude_segments =
          'You cannot exclude a segment already included';
      }
    }
  }

  return errors;
};

export const sendNowValidationSchema = Yup.object().shape({
  campaignName: Yup.string()
    .trim()
    .required('Campaign name is required')
    .max(256, 'Campaign name must be at most 256 characters'),

  EmailNotificationfromSubject: Yup.string().required('Subject is required'),

  include_lists: Yup.array()
    .of(Yup.string())
    .test(
      'include-required',
      'At least one list or segment must be selected',
      function (_, context) {
        const { include_lists = [], include_segments = [] } = this.parent;
        return (
          (include_lists?.length || 0) > 0 ||
          (include_segments?.length || 0) > 0
        );
      }
    ),

  include_segments: Yup.array()
    .of(Yup.string())
    .test(
      'include-required',
      'At least one list or segment must be selected',
      function (_, context) {
        const { include_lists = [], include_segments = [] } = this.parent;
        return (
          (include_lists?.length || 0) > 0 ||
          (include_segments?.length || 0) > 0
        );
      }
    ),

  exclude_lists: Yup.array()
    .of(Yup.string())
    .test(
      'exclude-not-in-include',
      'You cannot exclude an audience already included',
      function (value) {
        const {
          include_lists = [],
          include_segments = [],
          exclude_lists = [],
        } = this.parent;
        const included = [...include_lists, ...include_segments].map(String);
        const excluded = [...exclude_lists].map(String);
        const conflicts = excluded.filter((id) => included.includes(id));
        return conflicts.length === 0;
      }
    ),

  exclude_segments: Yup.array()
    .of(Yup.string())
    .test(
      'exclude-not-in-include',
      'You cannot exclude a segment already included',
      function (value) {
        const {
          include_lists = [],
          include_segments = [],
          exclude_segments = [],
        } = this.parent;
        const included = [...include_lists, ...include_segments].map(String);
        const excluded = [...exclude_segments].map(String);
        const conflicts = excluded.filter((id) => included.includes(id));
        return conflicts.length === 0;
      }
    ),

  emailNotificationfromName: Yup.string().required('Sender name is required'),

  // ✅ New field: sender email validation
  emailNotificationfromEmail: Yup.string()
    .trim()
    .required("Sender's email address is required")
    .matches(
      /^[A-Za-z0-9._%+-]+$/,
      'Only letters, numbers, dots, underscores, or hyphens are allowed before @'
    )
    .test(
      'no-at-symbol',
      'Do not include @ or domain name here — it’s added automatically',
      (value) => !value?.includes('@')
    ),

  emailNotificationfromReplyTo: Yup.string()
    .email('Invalid email')
    .required('Reply-to email is required'),

  whenToSend: Yup.string().required('Sending option is required'),

  sentDate: Yup.mixed().when('whenToSend', {
    is: 'scheduled',
    then: (schema) =>
      Yup.date()
        .typeError('Invalid date')
        .required('Scheduled date is required'),
    otherwise: (schema) => schema.nullable(),
  }),

  selectedTimezone: Yup.string().when('when_to_send', {
    is: 'scheduled',
    then: (schema) => Yup.string().required('Please select a timezone'),
    otherwise: (schema) => schema.nullable(),
  }),
});

export const reviewModalValidationSchema = Yup.object().shape({
  // ----------------------
  // Sending option
  // ----------------------
  when_to_send: Yup.string()
    .oneOf(['now', 'scheduled', 'draft'], 'Invalid option')
    .required('Please select when to send'),

  // ----------------------
  // Conditional sentDate validation
  // ----------------------
  sentDate: Yup.mixed().when('when_to_send', {
    is: 'scheduled',
    then: (schema) =>
      Yup.date()
        .typeError('Please select a valid date')
        .required('Scheduled date is required'),
    otherwise: (schema) => schema.nullable(),
  }),

  // ----------------------
  // Conditional timezone validation
  // ----------------------
  selectedTimezone: Yup.string().when('when_to_send', {
    is: 'scheduled',
    then: (schema) => Yup.string().required('Please select a timezone'),
    otherwise: (schema) => schema.nullable(),
  }),
});

export const createCouponValidationSchema = Yup.object().shape({
  coupon_code: Yup.string()
    .required('Coupon code is required')
    .matches(/^[a-zA-Z0-9]+$/, 'Only letters and numbers are allowed')
    .max(32, 'Coupon code must be at most 32 characters long'),

  discount_type: Yup.string().required('Discount type is required'),

  discount_amount: Yup.number()
    .nullable()
    .when('discount_type', (discount_type, schema) =>
      discount_type !== 'freeshipping'
        ? schema.required('Discount amount is required')
        : schema
    ),

  minimum_purchase: Yup.number()
    .typeError('Minimum purchase must be a number')
    .nullable()
    .when('minimum_purchase_status', {
      is: true,
      then: (schema) =>
        schema
          .required('Minimum purchase amount is required')
          .min(1, 'Minimum purchase must be greater than 0'),
      otherwise: (schema) => schema.notRequired(),
    }),

  usage_limit: Yup.number()
    .typeError('Usage limit must be a number') // prevents strings like "abc"
    .when('is_discount_code_limit', {
      is: true,
      then: (schema) =>
        schema
          .required('Usage limit is required')
          .integer('Usage limit must be an integer')
          .min(1, 'Usage limit must be greater than 0'),
      otherwise: (schema) => schema.notRequired(),
    }),

  discount_activation_date: Yup.mixed()
    .transform(function (value, originalValue) {
      if (this.isType(value)) return value;
      const parsed = dayjs(originalValue, 'DD-MM-YYYY HH:mm');
      return parsed.isValid() ? parsed.toDate() : new Date('');
    })
    .when('discount_activation_type', {
      is: 'selectedDate',
      then: (schema) => schema.required('Activation date is required'),
      otherwise: (schema) => schema.notRequired(),
    }),

  discount_expiration_date: Yup.mixed()
    .transform(function (value, originalValue) {
      if (this.isType(value)) return value;
      const parsed = dayjs(originalValue, 'DD-MM-YYYY HH:mm');
      return parsed.isValid() ? parsed.toDate() : new Date('');
    })
    .when('discount_expiration_type', {
      is: 'selectedDate',
      then: (schema) => schema.required('Expiration date is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
});

export const domainSchema = Yup.object().shape({
  domainName: Yup.string()
    .required('Domain name is required')
    .matches(
      /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/,
      'Enter a valid domain (e.g., example.com)'
    ),
});

export const saveDkimValidationSchema = Yup.object({
  fromEmail: Yup.string().email('Invalid email').required('Required'),
  fromName: Yup.string().required('Required'),
  replyTo: Yup.string().email('Invalid email').required('Required'),
});

export const validateDates = (start, end) => {
  if (start && !end) return 'Please select an end date';
  if (!start && end) return 'Please select a start date';
  if (start && end && new Date(start) > new Date(end)) {
    return 'From date cannot be later than To date';
  }
  return null;
};

export const templateSaveExitValidationSchema = Yup.object().shape({
  title: Yup.string().required('Template name is required'),
  subject: Yup.string().required('Email subject is required'),
  customUtm: Yup.boolean(),
  utm_campaign: Yup.string().when('customUtm', {
    is: true,
    then: (schema) => schema.required('UTM campaign is required'),
    otherwise: (schema) => schema.nullable(),
  }),
  utm_term: Yup.string().when('customUtm', {
    is: true,
    then: (schema) => schema.required('UTM term is required'),
    otherwise: (schema) => schema.nullable(),
  }),
  utm_content: Yup.string().when('customUtm', {
    is: true,
    then: (schema) => schema.required('UTM content is required'),
    otherwise: (schema) => schema.nullable(),
  }),
  utm_medium: Yup.string().when('customUtm', {
    is: true,
    then: (schema) => schema.required('UTM medium is required'),
    otherwise: (schema) => schema.nullable(),
  }),
});
