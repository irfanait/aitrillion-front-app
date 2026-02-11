import * as Yup from 'yup';

export const uploadCsvStep1Schema = Yup.object().shape({
  term_service: Yup.boolean().oneOf([true], 'This Field is required.'),

  obtain_from: Yup.string().required('This Field is required.'),

  source_desc: Yup.string()
    .min(20, 'Minimum 20 characters required')
    .required('This Field is required.'),

  double_obtain_customer: Yup.boolean().oneOf(
    [true],
    'This Field is required.'
  ),

  file: Yup.mixed()
    .nullable()
    .test(
      'file-required',
      'CSV file is required',
      (value) => value instanceof File
    )
    .test('file-type', 'Only CSV files are allowed', (value) => {
      if (!(value instanceof File)) return false;

      const validMimeTypes = ['text/csv', 'application/vnd.ms-excel'];

      const isCsvByMime = validMimeTypes.includes(value.type);
      const isCsvByName = value.name?.toLowerCase().endsWith('.csv');

      return isCsvByMime || isCsvByName;
    }),

  first_row_header: Yup.boolean().required(),

  upload_action: Yup.string().required('Please select an action'),
});

export const uploadCsvStep2Schema = Yup.object().shape({
  mapping: Yup.object().test(
    'has-mapping',
    'Please complete the field mapping',
    (v) => v && Object.keys(v).length > 0
  ),
});

export const uploadCsvStep3Schema = Yup.object().shape({
  createNewList: Yup.boolean(),

  internal_name: Yup.string().when('createNewList', {
    is: true,
    then: (schema) => schema.trim().required('Internal name is required'),
    otherwise: (schema) => schema.notRequired(),
  }),

  external_name: Yup.string().when('createNewList', {
    is: true,
    then: (schema) => schema.trim().required('External name is required'),
    otherwise: (schema) => schema.notRequired(),
  }),

  selectedListId: Yup.array().when('createNewList', {
    is: false,
    then: (schema) =>
      schema.test(
        'at-least-one-action',
        'Please add or remove contacts from at least one list',
        function (value) {
          const { removeFromListIds } = this.parent;
          return (
            (value && value.length > 0) ||
            (removeFromListIds && removeFromListIds.length > 0)
          );
        }
      ),
  }),

  removeFromListIds: Yup.array(),
});

export const uploadCsvStep4Schema = Yup.object().shape({
  send_email: Yup.boolean(),

  notify_email: Yup.string().when('send_email', {
    is: true,
    then: (schema) =>
      schema.required('Email is required').email('Enter a valid email address'),
    otherwise: (schema) => schema.notRequired(),
  }),
});
