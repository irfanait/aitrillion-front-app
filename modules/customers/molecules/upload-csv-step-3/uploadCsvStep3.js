import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, App } from 'antd';
import { Field } from 'formik';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitCheckboxButton from '@/components/atoms/ait-checkbox/aitCheckbox';
import AitButton from '@/components/atoms/ait-button/aitButton';
import AitAutocomplete from '@/components/atoms/ait-autocomplete/aitAutocomplete';
import { StyledWrapperStep3 } from './style';
import { useDispatch, useSelector } from 'react-redux';
import { updateListImportStep3Api } from '@/redux/apis/customers-api/customersApi';
import { imporCsvPartiallyReset } from '@/redux/customers-slice/import-csv-slices/importCsvSlices';
import { useRouter } from 'next/router';

const { Title } = Typography;

const UploadCsvStep3 = ({ formik, next, back }) => {
  const { values, setFieldValue, touched, errors } = formik;
  const dispatch = useDispatch();
  const router = useRouter();
  const { notification } = App.useApp();

  const listIdFromUrl = router.query?.listId
    ? Number(router.query.listId)
    : null;

  const {
    uploadCsvApiState,
    uploadCsvLoading,
    uploadCsvMessage,
    list,
    listApiState,
  } = useSelector((state) => state.importCsvState);

  const [listOptions, setListOptions] = useState([]);
  const [preselectApplied, setPreselectApplied] = useState(false);

  useEffect(() => {
    if (listApiState === 'success' && list?.length > 0) {
      const includeAudienceList = list?.map((item) => ({
        label: item.external_name,
        value: item.id,
      }));
      setListOptions(includeAudienceList);
    }
  }, [listApiState]);

  useEffect(() => {
    if (
      listIdFromUrl &&
      listOptions.length > 0 &&
      !preselectApplied &&
      !values.selectedListId?.length
    ) {
      const exists = listOptions.some(
        (opt) => Number(opt.value) === Number(listIdFromUrl)
      );

      if (exists) {
        setFieldValue('selectedListId', [listIdFromUrl]);
        setPreselectApplied(true);
      }
    }
  }, [listIdFromUrl, listOptions, preselectApplied]);

  useEffect(() => {
    if (uploadCsvApiState === 'success') {
      notification.success({ message: uploadCsvMessage || 'Mapping saved' });
      dispatch(imporCsvPartiallyReset());
      next();
    }

    if (uploadCsvApiState === 'error') {
      notification.error({
        message: uploadCsvMessage || 'Something went wrong',
      });
      dispatch(imporCsvPartiallyReset());
    }
  }, [uploadCsvApiState]);

  const handleClickStep3 = async () => {
    const errors = await formik.validateForm();

    formik.setTouched({
      internal_name: values.createNewList,
      external_name: values.createNewList,
      selectedListId: true,
      removeFromListIds: true,
    });

    if (Object.keys(errors).length > 0) return;

    let payload;

    if (values.createNewList) {
      // ✅ CREATE NEW LIST PAYLOAD
      payload = {
        create_list: true,
        list: {
          internal_name: values.internal_name,
          external_name: values.external_name,
        },
        shop_id: Number(values.shop_id),
        csv_id: Number(values.isUpdating),
      };
    } else {
      // ✅ EXISTING LIST PAYLOAD
      payload = {
        create_list: false,
        include_list: values.selectedListId || [],
        exclude_list: values.removeFromListIds || [],
        shop_id: Number(values.shop_id),
        csv_id: Number(values.isUpdating),
      };
    }

    dispatch(updateListImportStep3Api(payload));
  };

  return (
    <StyledWrapperStep3>
      <Title level={5}>
        1. Do you want to add these contacts to any lists?
      </Title>

      <Field
        as={AitAutocomplete}
        mode="multiple"
        name="selectedListId"
        placeholder="Choose list"
        label="Add your lists"
        value={values.selectedListId}
        onChange={(value) =>
          setFieldValue('selectedListId', value?.length ? value : [])
        }
        options={listOptions}
        noDataMessage="No results found"
        error={touched.selectedListId && Boolean(errors.selectedListId)}
        errorMessage={touched.selectedListId ? errors.selectedListId : ''}
      />

      <div style={{ marginTop: 40 }}>
        <Title level={5}>2. Do you want to add contacts to a new list?</Title>

        <AitCheckboxButton
          name="createNewList"
          label="Create new list"
          checked={values.createNewList}
          onChange={(e) => setFieldValue('createNewList', e.target.checked)}
        />

        {values.createNewList && (
          <Row gutter={[24, 24]} style={{ marginTop: 20 }}>
            <Col xs={24} md={12}>
              <Field
                as={AitInputBox}
                name="internal_name"
                label="Internal name*"
                placeholder="Enter internal name"
                value={values.internal_name}
                onChange={(e) => setFieldValue('internal_name', e.target.value)}
                error={touched.internal_name && errors.internal_name}
                errorMessage={errors.internal_name}
              />
            </Col>

            <Col xs={24} md={12}>
              <Field
                as={AitInputBox}
                name="external_name"
                label="External name*"
                placeholder="Enter external name"
                value={values.external_name}
                onChange={(e) => setFieldValue('external_name', e.target.value)}
                error={touched.external_name && errors.external_name}
                errorMessage={errors.external_name}
              />
            </Col>
          </Row>
        )}
      </div>

      <div style={{ marginTop: 40 }}>
        <Title level={5}>
          3. Do you want to remove these contacts from any lists?
        </Title>

        <Field
          as={AitAutocomplete}
          mode="multiple"
          name="removeFromListIds"
          placeholder="Choose list"
          label="Remove your lists"
          value={values.removeFromListIds}
          onChange={(value) =>
            setFieldValue('removeFromListIds', value?.length ? value : [])
          }
          options={listOptions}
          noDataMessage="No results found"
          error={touched.removeFromListIds && Boolean(errors.removeFromListIds)}
          errorMessage={
            touched.removeFromListIds ? errors.removeFromListIds : ''
          }
        />
      </div>

      {/* Buttons */}
      <div style={{ marginTop: 40, display: 'flex', gap: 12 }}>
        <AitButton title="Back" onClick={back} />
        <AitButton
          type="primary"
          title="Next"
          loading={uploadCsvLoading}
          onClick={handleClickStep3}
        />
      </div>
    </StyledWrapperStep3>
  );
};

export default UploadCsvStep3;
