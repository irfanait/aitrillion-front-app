import * as Yup from 'yup';

export const createListValidationSchema = Yup.object().shape({
  internal_name: Yup.string()
    .trim()
    .required('Internal name is required')
    .max(100, 'Internal name must be at most 100 characters'),

  external_name: Yup.string()
    .trim()
    .required('External name is required')
    .max(100, 'External name must be at most 100 characters'),

  description: Yup.string()
    .trim()
    .max(1000, 'Description can be up to 1000 characters only'),
});

export const customFieldValidationSchema = Yup.object({
  field_label: Yup.string().trim().required('Label name is required'),

  field_type: Yup.string().required('Please select a field type'),
  group: Yup.string().required('Please select a filter group'),

  note_attribute_feild_name: Yup.string().when('map_type', {
    is: (val) => val === 'key_value',
    then: (schema) => schema.trim().required('Key name is required'),
    otherwise: (schema) => schema.notRequired(),
  }),

  is_show_in_my_account: Yup.boolean(),
});

export const addMembershipSchema = Yup.object().shape({
  plan_id: Yup.string().required('Required'),
  subscription_date: Yup.string().required('Required'),
  expire_date: Yup.string().required('Required'),
});
