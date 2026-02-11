import React, { useEffect, useState } from 'react';
import { Row, Col, Space, App } from 'antd';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { EditOutlined } from '@ant-design/icons';

import AitButton from '@/components/atoms/ait-button/aitButton';
import AitRadioButton from '@/components/atoms/ait-radio-button/aitRadioButton';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import { saveSegmentApi } from '@/redux/apis/customers-api/customersApi';
import { useDispatch, useSelector } from 'react-redux';
import { resetSaveSegment } from '@/redux/customers-slice/segment-slices/segment-slice';
import { toSentenceCase } from '../../utils/helper';

// Props:
// visible, setVisible, chips (array), filtersOperator (string), isApplied (bool),
// selectedSegmentChip, setSelectedSegmentChip
const SaveSegmentModal = ({
  visible,
  setVisible,
  chips = [],
  filtersOperator = 'and',
  isApplied = false,
  selectedSegmentChip = null,
  setSelectedSegmentChip = () => {},
  setSelected,
  setLocalSegments,
  setAfterhandleApplyFiltersClicks,
  setChipsFromSegment,
  setChips,
}) => {
  const dispatch = useDispatch();

  const { notification } = App.useApp();
  const hasSelectedSegment = Boolean(selectedSegmentChip?.id);
  const segmentState = useSelector((state) => state.segmentState);
  const {
    saveSegmentApiState,
    saveSegmentLoading,
    saveSegmentError,
    saveSegmentMessage,
    saveSegmentId,
    saveSegmentData,
  } = segmentState;
  const [segmentOption, setSegmentOption] = useState('create');
  const [isEditing, setIsEditing] = useState(false);
  const [formKey, setFormKey] = useState(Date.now());

  // Normalize incoming chips into an array of filter-objects suitable for API
  const normalizeChipsToMasterFilter = (rawChips) => {
    // rawChips expected shape: [{ key, label, payload }, ...]
    if (!rawChips) return [];
    if (Array.isArray(rawChips)) {
      return rawChips
        .map((c) => c?.payload || null)
        .filter(Boolean)
        .map((p) => {
          // ✅ Better datatypeId resolution treating empty string as missing
          const datatypeId =
            p.datatypeId && p.datatypeId !== ''
              ? p.datatypeId
              : p.datatype_id && p.datatype_id !== ''
                ? p.datatype_id
                : p.db_column_type || '';

          // Ensure each object has the fields your backend expects.
          return {
            db_table: p.db_table || 'tbl_customers',
            db_table_alias: p.db_table_alias || 'c',
            db_column_name: p.db_column_name || p.field_name || '',
            datatypeName: p.datatypeName || p.field_name || '',
            datatypeId, // ✅ Use properly resolved datatypeId
            moduleFieldOperator: p.moduleFieldOperator || p.operator || '',
            moduleFieldoperatorlabel:
              p.moduleFieldoperatorlabel || p.operatorLabel || '',
            operatorValue: p.operatorValue || '',
            is_converted_utc: p.is_converted_utc || 0,
            operatorValueLocal: p.operatorValueLocal || p.operatorValue || '',
          };
        });
    }

    // if object, try convert values
    if (typeof rawChips === 'object') {
      try {
        return Object.values(rawChips)
          .map((c) => c?.payload || c)
          .filter(Boolean);
      } catch {
        return [];
      }
    }

    // fallback
    return [];
  };

  // formik initial values builder
  const getInitialValues = () => {
    if (segmentOption === 'existing' && hasSelectedSegment && isEditing) {
      return {
        segmentName: selectedSegmentChip?.title || '',
        description: selectedSegmentChip?.description || '',
      };
    }
    return { segmentName: '', description: '' };
  };

  const validationSchema = Yup.object({
    segmentName: Yup.string().trim().required('Segment name is required'),
    description: Yup.string().max(
      250,
      'Description cannot exceed 250 characters'
    ),
  });

  useEffect(() => {
    if (saveSegmentApiState === 'success') {
      notification.success({ message: saveSegmentMessage });

      // 🔹 Get updated segment from API response
      let newSegment = null;

      if (Array.isArray(saveSegmentData)) {
        const targetId = String(saveSegmentId || selectedSegmentChip?.id);

        newSegment = saveSegmentData.find(
          (item) => String(item.id) === targetId
        );
      } else {
        newSegment = saveSegmentData;
      }

      if (newSegment) {
        // 1️⃣ Update localSegments (for immediate UI replacement)
        setLocalSegments((prev) => {
          const exists = prev.some(
            (s) => String(s.id) === String(newSegment.id)
          );

          if (exists) {
            return prev.map((s) =>
              String(s.id) === String(newSegment.id) ? newSegment : s
            );
          }

          return [newSegment, ...prev];
        });

        // 2️⃣ Update selected segment reference
        setSelectedSegmentChip(newSegment);
        setSelected(newSegment.id);

        // 3️⃣ 🔥 REBUILD CHIPS FROM UPDATED SEGMENT FILTER_JSON
        if (newSegment.filter_json) {
          try {
            const parsedFilters = JSON.parse(newSegment.filter_json);

            const rebuiltChips = Array.isArray(parsedFilters)
              ? parsedFilters.map((f) => {
                  const operatorValue =
                    f.operatorValue ?? f.operatorValueLocal ?? '';

                  return {
                    key: `${f.db_column_name}_${f.moduleFieldOperator}_${operatorValue}`,
                    label: `${toSentenceCase(f.datatypeName || f.field_name || '')} ${toSentenceCase(
                      f.moduleFieldoperatorlabel || ''
                    )}${operatorValue ? ' ' + operatorValue : ''}`,
                    payload: {
                      ...f,
                      operatorValue,
                      operatorValueLocal: operatorValue,
                    },
                    fromSegment: true,
                    modified: false,
                  };
                })
              : [];

            setChips(rebuiltChips);
          } catch (err) {
            console.error(
              'Failed to rebuild chips from segment filter_json',
              err
            );
          }
        }
      }

      // 4️⃣ Reset apply state
      setChipsFromSegment(true);
      setAfterhandleApplyFiltersClicks(false);

      // 5️⃣ Close modal and cleanup
      setVisible(false);
      setIsEditing(false);
      setFormKey(Date.now());

      dispatch(resetSaveSegment());
    }

    if (saveSegmentApiState === 'error') {
      notification.error({ message: saveSegmentMessage });
      dispatch(resetSaveSegment());
    }
  }, [saveSegmentApiState, saveSegmentMessage, saveSegmentData, saveSegmentId]);

  useEffect(() => {
    if (!visible) {
      setIsEditing(false);
      return;
    }

    // 🚫 Primary (default) segment → FORCE create mode
    if (hasSelectedSegment && String(selectedSegmentChip?.is_default) === '1') {
      setSegmentOption('create');
      setIsEditing(true);
    }
    // ✅ Editable custom segment
    else if (hasSelectedSegment) {
      setSegmentOption('existing');
      setIsEditing(true);
    }
    // ➕ No segment selected
    else {
      setSegmentOption('create');
      setIsEditing(true);
    }

    setFormKey(Date.now());
  }, [visible, hasSelectedSegment, selectedSegmentChip]);

  // When the external selectedSegmentChip changes, re-sync
  useEffect(() => {
    if (selectedSegmentChip?.id) {
      setSegmentOption('existing');
      setIsEditing(false);
    } else {
      setSegmentOption('create');
      setIsEditing(true);
    }
    setFormKey(Date.now());
  }, [selectedSegmentChip]);

  const handleRadioChange = (e) => {
    const value = e.target.value;
    setSegmentOption(value);
    // if user picks create, show fields; if existing and not editing, hide fields until edit clicked
    // setIsEditing(value === 'create');

    // 🔥 IMPORTANT FIX
    setIsEditing(true);
    setFormKey(Date.now());
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setSegmentOption('existing');
    setIsEditing(true);
    setFormKey(Date.now());
  };

  const handleSubmit = (values) => {
    if (
      segmentOption === 'existing' &&
      String(selectedSegmentChip?.is_default) === '1'
    ) {
      notification.warning({
        message:
          'Default segments cannot be edited. Please create a new segment.',
      });
      return;
    }
    // normalize chips to masterFilter array
    const masterFilterArray = normalizeChipsToMasterFilter(chips);

    // Some existing segment payloads you showed had `null` placeholders in the masterFilter array.
    // If you must preserve the same length with nulls, adapt here. By default we strip nulls.
    const masterFilterString = JSON.stringify(masterFilterArray);

    // build payload
    const base = {
      act: 'insert_segment_into_db',
      masterFilter: masterFilterString,
      filters_operator: filtersOperator || 'and',
      isSendEmailOrSMS: '',
    };

    let payload;
    if (segmentOption === 'existing' && hasSelectedSegment) {
      payload = {
        ...base,
        newOrExisting: 'existing',
        title: values.segmentName.trim(),
        description: values.description.trim(),
        selectedSegment: String(selectedSegmentChip?.id || ''),
        default_segment_id: String(selectedSegmentChip?.id || ''),
      };
    } else {
      // create new
      payload = {
        ...base,
        newOrExisting: 'new',
        title: values.segmentName.trim(),
        description: values.description.trim(),
        selectedSegment: 0,
        default_segment_id: 0,
      };
    }

    // Replace the following with your real API call / dispatch
    dispatch(saveSegmentApi(payload));

    // Close modal and preserve parent selectedSegmentChip only if we updated existing;
    // if we created new, we may want to clear parent selection (depends on UX). Here: clear when create new
    // setVisible(false);
    // setIsEditing(false);
    // setFormKey(Date.now());

    // if (segmentOption === 'new' || payload.newOrExisting === 'new') {
    //   // created a new segment — clear selectedSegmentChip in parent
    //   try {
    //     setSelectedSegmentChip({});
    //   } catch {}
    // }
  };

  const handleCancel = () => {
    setVisible(false);
    setIsEditing(false);
    setFormKey(Date.now());
  };

  const isEditableSegment =
    Boolean(selectedSegmentChip?.id) &&
    String(selectedSegmentChip?.is_default) === '0';

  return (
    <AitModal
      open={visible}
      centered
      headerTitleLevel={3}
      footer={false}
      headerVisible
      closeIconVisible
      width={600}
      title="Save segment"
      setVisible={setVisible}
      destroyOnClose
      maskClosable
      headerPadding={'0px 0px 16px 0px'}
    >
      <Formik
        key={formKey}
        enableReinitialize
        initialValues={getInitialValues()}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => {
          return (
            <Form>
              <Space
                direction="vertical"
                //  size="large"
                style={{ width: '100%' }}
              >
                {/* show existing only when a segment chip exists */}
                {isEditableSegment && (
                  <AitRadioButton
                    name="segmentOption"
                    className="vertical"
                    value={segmentOption}
                    onChange={handleRadioChange}
                    options={[
                      {
                        label: (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            <span>
                              Save changes to segment{' '}
                              <strong>{selectedSegmentChip?.title}</strong>
                            </span>
                            {segmentOption === 'create' &&
                              hasSelectedSegment && (
                                <EditOutlined
                                  style={{
                                    cursor: 'pointer',
                                    color: '#1677ff',
                                    fontSize: 16,
                                  }}
                                  onClick={handleEditClick}
                                />
                              )}
                          </div>
                        ),
                        value: 'existing',
                      },
                    ]}
                  />
                )}

                {/* always show create option */}
                <AitRadioButton
                  name="segmentOption"
                  className="vertical"
                  value={segmentOption}
                  onChange={handleRadioChange}
                  options={[{ label: 'Create new segment', value: 'create' }]}
                  marginbottom={10}
                />

                {/* show form when creating or editing */}
                {(segmentOption === 'create' ||
                  (segmentOption === 'existing' && isEditing)) && (
                  <Row gutter={[16, 24]}>
                    <Col span={24}>
                      <AitInputBox
                        name="segmentName"
                        label="Segment name"
                        placeholder="Enter segment name"
                        value={values.segmentName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        error={touched.segmentName && errors.segmentName}
                        errorMessage={errors.segmentName}
                      />
                    </Col>

                    <Col span={24}>
                      <AitInputBox
                        textArea
                        name="description"
                        label="Description"
                        placeholder="Describe this segment"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={250}
                        rows={5}
                        labelSubText="You can describe the purpose of this segment here."
                        helperText={
                          touched.description && errors.description
                            ? errors.description
                            : ''
                        }
                      />
                    </Col>

                    <Col span={24}>
                      {/* footer buttons */}
                      <Row gutter={[12, 12]}>
                        <Col span={12}>
                          <AitButton
                            type="primary"
                            htmlType="submit"
                            loading={saveSegmentLoading}
                            title={
                              segmentOption === 'create'
                                ? 'Create segment'
                                : 'Save segment'
                            }
                            block
                            fontweight={500}
                          />
                        </Col>
                        <Col span={12}>
                          <AitButton
                            title="Cancel"
                            variant="filled"
                            color="default"
                            block
                            fontweight={500}
                            onClick={handleCancel}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                )}
              </Space>
            </Form>
          );
        }}
      </Formik>
    </AitModal>
  );
};

export default SaveSegmentModal;
