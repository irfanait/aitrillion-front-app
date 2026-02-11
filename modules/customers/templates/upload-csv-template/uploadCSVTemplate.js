import React, { useEffect, useState } from 'react';
import { LayoutContainer } from '../all-customers-template/style';
import MainWrapper from '@/components/atoms/main-wrapper/mainWrapper';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';

import { Formik } from 'formik';

import UploadCsvStep1 from '../../molecules/upload-csv-step-1/uploadCsvStep1';
import UploadCsvStep2 from '../../molecules/upload-csv-step-2/uploadCsvStep2';
import UploadCsvStep3 from '../../molecules/upload-csv-step-3/uploadCsvStep3';
import UploadCsvStep4 from '../../molecules/upload-csv-step-4/uploadCsvStep4';

import {
  uploadCsvStep1Schema,
  uploadCsvStep2Schema,
  uploadCsvStep3Schema,
  uploadCsvStep4Schema,
} from '../../utils/upload-csv-step-form-validation/uploadCsvStepFormvalidation';

import AitCard from '@/components/atoms/ait-card/aitCard';
import { useDispatch, useSelector } from 'react-redux';
import { getListApi } from '@/redux/apis/customers-api/customersApi';

const UploadCSVTemplate = () => {
  const dispatch = useDispatch();
  const [uiState, setUiState] = useState(1);
  const { login_auth } = useSelector((s) => s.jwtState);

  const initialValues = {
    // Step 1 fields
    term_service: false,
    obtain_from: '',
    source_desc: '',
    double_obtain_customer: false,

    // File fields
    file: null,
    file_name: '',
    key: '',

    // Import config
    first_row_header: true,
    upload_action: 'update_existing_add_new_contacts',

    emailMapped: 0,
    isUpdating: 0,
    shop_id: login_auth.shop_id,

    // Step 2 mapping
    mapping: {},

    // Step 3 processed fields
    selectedListId: [],
    removeFromListIds: [],
    createNewList: false,
    internal_name: '',
    external_name: '',
    //step 4
    send_email: false,
    notify_email: '',
  };

  const schema = {
    1: uploadCsvStep1Schema,
    2: uploadCsvStep2Schema,
    3: uploadCsvStep3Schema,
    4: uploadCsvStep4Schema,
  };

  useEffect(() => {
    if (!login_auth?.shop_id) return;
    dispatch(getListApi({ shop_id: login_auth?.shop_id }));
  }, []);

  return (
    <LayoutContainer>
      <MainWrapper>
        <AitPageHeader title={`Import contact (Step ${uiState})`} hideButton />

        <Formik
          initialValues={initialValues}
          validationSchema={schema[uiState]}
          enableReinitialize={false}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={(values) => {
            console.log('Final Submit Data:', values);
          }}
        >
          {(formik) => (
            <AitCard custombodypadding={'12px 24px 24px 24px'}>
              {uiState === 1 && (
                <UploadCsvStep1 formik={formik} next={() => setUiState(2)} />
              )}

              {uiState === 2 && (
                <UploadCsvStep2
                  formik={formik}
                  next={() => setUiState(3)}
                  back={() => setUiState(1)}
                />
              )}

              {uiState === 3 && (
                <UploadCsvStep3
                  formik={formik}
                  next={() => setUiState(4)}
                  back={() => setUiState(2)}
                />
              )}

              {uiState === 4 && (
                <UploadCsvStep4 formik={formik} back={() => setUiState(3)} />
              )}
            </AitCard>
          )}
        </Formik>
      </MainWrapper>
    </LayoutContainer>
  );
};

export default UploadCSVTemplate;
