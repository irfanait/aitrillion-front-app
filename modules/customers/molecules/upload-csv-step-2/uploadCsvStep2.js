import React, { useEffect, useMemo } from 'react';
import { Row, Col, Typography, App } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import AitButton from '@/components/atoms/ait-button/aitButton';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';

import { updateCsvMappingApi } from '@/redux/apis/customers-api/customersApi';
import { imporCsvPartiallyReset } from '@/redux/customers-slice/import-csv-slices/importCsvSlices';

const { Text } = Typography;
const normalize = (v = '') => String(v).toLowerCase().trim();

const UploadCsvStep2 = ({ formik, next, back }) => {
  const dispatch = useDispatch();
  const { notification } = App.useApp();

  const { values, setFieldValue } = formik;

  const {
    uploadCsvData,
    uploadCsvApiState,
    uploadCsvLoading,
    uploadCsvMessage,
  } = useSelector((state) => state.importCsvState);

  const fields = uploadCsvData?.fields || [];
  const rows = uploadCsvData?.CSVRowsData || [];
  const headers = uploadCsvData?.csvHeaders;

  const columns = useMemo(() => {
    if (Array.isArray(headers)) {
      return headers.map((header, index) => ({
        index,
        key: `column_${index}`,
        headerLabel: header,
      }));
    }

    if (typeof headers === 'number') {
      return Array.from({ length: headers }).map((_, index) => ({
        index,
        key: `column_${index}`,
        headerLabel: null,
      }));
    }

    return [];
  }, [headers]);

  // Create select dropdown options
  const fieldOptions = useMemo(
    () => fields.map((f) => ({ label: f.title, value: f.name })),
    [fields]
  );

  useEffect(() => {
    if (!values.first_row_header) return;
    if (!Array.isArray(headers)) return;
    if (Object.keys(values.mapping || {}).length) return;

    const auto = {};

    columns.forEach((col) => {
      const match = fieldOptions.find(
        (f) => normalize(f.label) === normalize(col.headerLabel)
      );
      if (match) {
        auto[col.key] = match.value;
      }
    });

    if (Object.keys(auto).length) {
      setFieldValue('mapping', auto, false);
    }
  }, [values.first_row_header, columns, fieldOptions, headers]);

  useEffect(() => {
    if (uploadCsvApiState === 'success') {
      notification.success({ message: uploadCsvMessage || 'Mapping saved' });
      dispatch(imporCsvPartiallyReset());
      next();
    }

    if (uploadCsvApiState === 'Error' || uploadCsvApiState === 'error') {
      notification.error({
        message: uploadCsvMessage || 'Something went wrong',
      });
      dispatch(imporCsvPartiallyReset());
    }
  }, [uploadCsvApiState]);

  const isOptionDisabled = (value, currentKey) =>
    Object.entries(values.mapping || {}).some(
      ([k, v]) => k !== currentKey && v === value
    );

  // const getPreviewValue = (col) => {
  //   const rows = uploadCsvData?.CSVRowsData || [];
  //   const headers = uploadCsvData?.csvHeaders;

  //   if (!rows.length) return '-';

  //   // CASE 1: csvHeaders is a number → field1, field2
  //   if (typeof headers === 'number') {
  //     const fieldKey = `field${col.index + 1}`;
  //     return rows[0]?.[fieldKey] ?? '-';
  //   }

  //   // CASE 2 & 3: csvHeaders is array
  //   if (Array.isArray(headers)) {
  //     const headerValue = headers[col.index];

  //     // Header checked → show header value as preview
  //     if (values.first_row_header) {
  //       return headerValue ?? '-';
  //     }

  //     // Header unchecked → show row value using header as key
  //     return rows[0]?.[headerValue] ?? '-';
  //   }

  //   return '-';
  // };

  const getPreviewValue = (col) => {
    const rows = uploadCsvData?.CSVRowsData || [];
    const headers = uploadCsvData?.csvHeaders;

    if (!rows.length) return '-';

    // CASE 1: csvHeaders is a number → field1, field2
    if (typeof headers === 'number') {
      const fieldKey = `field${col.index + 1}`;
      return rows[0]?.[fieldKey] ?? '-';
    }

    // CASE 2: csvHeaders is array
    if (Array.isArray(headers)) {
      const headerValue = headers[col.index];
      return rows[0]?.[headerValue] ?? '-';
    }

    return '-';
  };

  const handleSubmitMapping = () => {
    const finalMapping = {};

    Object.entries(values.mapping || {}).forEach(([columnKey, fieldName]) => {
      if (!fieldName) return;

      const index = Number(columnKey.replace('column_', ''));

      // CASE 1: First row is header → use header names
      if (values.first_row_header && Array.isArray(headers)) {
        const headerName = headers[index];
        if (headerName) {
          finalMapping[headerName] = fieldName;
        }
        return;
      }

      // CASE 2: First row is NOT header → use custom1, custom2...
      finalMapping[`custom${index + 1}`] = fieldName;
    });

    const payload = {
      mapping: finalMapping,
      shop_id: Number(values.shop_id),
      csv_id: Number(values.isUpdating),
    };

    dispatch(updateCsvMappingApi(payload));
  };

  const handleBack = () => {
    setFieldValue('file', null);
    setFieldValue('file_name', '');
    setFieldValue('isUpdating', null);
    setFieldValue('mapping', {});

    dispatch(imporCsvPartiallyReset());
    back();
  };

  return (
    <div style={{ maxWidth: 1300 }}>
      <h3 style={{ marginBottom: 24 }}>
        Please map the columns from your CSV file(s) to the fields
      </h3>

      <Row style={{ marginBottom: 12, fontWeight: 600 }}>
        <Col span={6}>Column</Col>
        <Col span={9}>Value</Col>
        <Col span={9}>Mapped to</Col>
      </Row>

      {columns.map((col) => (
        <Row
          key={col.key}
          align="middle"
          style={{
            marginBottom: 16,
            paddingBottom: 8,
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          {/* Column */}
          <Col span={6}>
            <Text strong>
              Column {col.index}
              {values.first_row_header && col.headerLabel
                ? ` (${col.headerLabel})`
                : ''}
            </Text>
          </Col>

          {/* Value */}
          <Col span={9}>
            <Text>{getPreviewValue(col)}</Text>
          </Col>

          {/* Mapping */}
          <Col span={9}>
            <AitSelectBox
              placeholder="- Don't use this column -"
              value={values.mapping?.[col.key] || ''}
              onChange={(val) => setFieldValue(`mapping.${col.key}`, val)}
              options={fieldOptions.map((opt) => ({
                ...opt,
                disabled: isOptionDisabled(opt.value, col.key),
              }))}
              allowClear
            />
          </Col>
        </Row>
      ))}

      <div style={{ marginTop: 30, display: 'flex', gap: 12 }}>
        <AitButton title="Back" onClick={handleBack} />
        <AitButton
          title="Next"
          type="primary"
          loading={uploadCsvLoading}
          onClick={handleSubmitMapping}
        />
      </div>
    </div>
  );
};

export default UploadCsvStep2;
