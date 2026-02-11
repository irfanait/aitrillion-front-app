import React, { useEffect, useMemo, useRef, useState } from 'react';
import AitChip from '@/components/atoms/ait-chip/aitChip';
import { MoreWrap, StyledTag, Wrap } from './style';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Popover, Row, Tooltip } from 'antd';
import SegmentChipLoadingSkeleton from '../../customers-loading-skeleton/segment-chip-loading-skeleton/segmentChipLoadingSkeleton';
import { setAllCustomerFilters } from '@/redux/customers-slice/all-customers-slices/all-customers-slice';
import MoreSegmentModal from '../../molecules/more-segment-modal/moreSegmentModal';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
  PieChartFilled,
  PlusOutlined,
} from '@ant-design/icons';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { Typography } from 'antd';
import AitRadioButton from '@/components/atoms/ait-radio-button/aitRadioButton';
import {
  getBooleanOperatorLabel,
  getOperatorIdentity,
  isBirthdayField,
  isEmptyOperator,
  isOperatorValueValid,
  isShopGroup,
  MODULE_ID_TO_GROUP_TITLE,
  normalizeOperatorValue,
  renderInlineOperatorInput,
  resolveFieldOptions,
  toSentenceCase,
} from '../../utils/helper';
import {
  getCampaignList,
  getGroupList,
  getMemberList,
  getSmartPopupList,
  getTierList,
} from '@/redux/apis/customers-api/customersApi';
import SaveSegmentModal from '../../molecules/save-segment-modal/saveSegmentModal';
import { useRouter } from 'next/router';
import FieldPopover from '../../molecules/fields-popover/fieldPopover';
import OperatorPopover from '../../molecules/operator-popover/operatorPopover';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const SegmentAndFilterSection = (props) => {
  const { onSegmentSelect, showFilters, setShowFilters } = props;

  const dispatch = useDispatch();
  const router = useRouter();
  const tempChipKeyRef = useRef(null);
  const hasUserModifiedRef = useRef(false);
  const isSelectingFieldRef = useRef(false); // Track if field selection is in progress

  const allCustomerState = useSelector((state) => state.allCustomersState);

  const {
    filters,
    getCustomerInItData,
    getCustomerInItDataLoading,
    campaignList,
    getCampaignListLoading,
    getCustomerCustomFields,
    getCustomerCustomFieldOptions,
  } = allCustomerState;

  const { segment_id } = router.query;
  const { login_auth } = useSelector((state) => state.jwtState);

  const [selected, setSelected] = useState('');
  const [moreSegmentsModalVisible, setMoreSegmentsModalVisible] =
    useState(false);
  const [chips, setChips] = useState([]);
  const [operator, setOperator] = useState('and');
  const [selectedField, setSelectedField] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [operatorValue, setOperatorValue] = useState('');
  const [fieldPopoverVisible, setFieldPopoverVisible] = useState(false);
  const [operatorPopoverVisible, setOperatorPopoverVisible] = useState(false);
  const [chipsFromSegment, setChipsFromSegment] = useState(false);
  const [dynamicOptions, setDynamicOptions] = useState({});
  const [afterhandleApplyFiltersClicks, setAfterhandleApplyFiltersClicks] =
    useState(false);
  const [saveSegmentModalVisible, setSaveSegmentModalVisible] = useState(false);
  const [selectedSegmentChip, setSelectedSegmentChip] = useState({});
  const [searchInput, setSearchInput] = useState('');
  const [editingChipKey, setEditingChipKey] = useState(null);
  const [localSegments, setLocalSegments] = useState([]);

  const visibleSegments = useMemo(() => {
    const apiSegments = getCustomerInItData?.defaultSegments ?? [];

    const map = new Map();

    // 1. add API segments first
    apiSegments.forEach((seg) => {
      map.set(String(seg.id), seg);
    });

    // 2. override with locally edited segments
    localSegments.forEach((seg) => {
      map.set(String(seg.id), seg);
    });

    return Array.from(map.values())
      .filter(
        (s) => s && (s.is_show_On_grid === 1 || s.is_show_On_grid === undefined)
      )
      .sort((a, b) => Number(a?.order_by ?? 999) - Number(b?.order_by ?? 999));
  }, [getCustomerInItData?.defaultSegments, localSegments]);

  useEffect(() => {
    if (!selected && visibleSegments.length) {
      const allSeg = visibleSegments.find(
        (s) => String(s.title).toLowerCase() === 'all'
      );
      const toSelect = allSeg || visibleSegments[0];
      setSelected(toSelect.id);
    }
  }, [visibleSegments, selected]);

  useEffect(() => {
    if (!segment_id || !visibleSegments.length) return;

    // Check if already selected
    if (selected === segment_id) return;

    const segToSelect = visibleSegments.find(
      (s) => String(s.id) === String(segment_id)
    );

    if (segToSelect) {
      handleSelectSegmentChip(segToSelect, 'url');
    }
  }, [segment_id, visibleSegments]);

  useEffect(() => {
    if (!filters?.segment_id && filters?.masterFilter === '[]') {
      setOperator('and');
    }
  }, [filters?.segment_id, filters?.masterFilter]);

  const PRIMARY_COUNT = 10;
  const primary = visibleSegments.slice(0, PRIMARY_COUNT);
  const overflow = visibleSegments.slice(PRIMARY_COUNT);

  const selectedOverflowSegment = useMemo(() => {
    return overflow.find((seg) => String(seg.id) === String(selected));
  }, [overflow, selected]);

  const safeParseFilterJson = (jsonLike) => {
    try {
      const parsed =
        typeof jsonLike === 'string' ? JSON.parse(jsonLike) : jsonLike;
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      return [];
    }
  };

  const isAllSegment = (seg) =>
    String(seg?.title || '')
      .trim()
      .toLowerCase() === 'all';

  // ===== Segment Selection =====

  const handleSelectSegmentChip = (seg, source = 'default') => {
    if (isAllSegment(seg)) {
      handleClearFilter();
    }

    hasUserModifiedRef.current = false;
    setOperator(seg.filters_operator || 'and');
    setSelectedSegmentChip(seg);
    setSelected(seg.id);
    onSegmentSelect(seg?.id);
    setChipsFromSegment(true);
    setShowFilters(true);
    setChips([]);

    const base = {
      ...filters,
      currentPage: 1,
      sort: filters?.sort ?? 'c.last_seen_date',
      order: typeof filters?.order === 'boolean' ? filters.order : false,
      selectedpeopleType: filters?.selectedpeopleType ?? 'Customers',
      selectedOperatorType: seg.filters_operator || 'and',
      gridOrMap: filters?.gridOrMap ?? 'grid',
      act: filters?.act ?? 'list_customer',
      is_count_req: 1,
      isRequestForActiveCustomers: filters?.isRequestForActiveCustomers ?? 0,
    };

    const parsedFilters = safeParseFilterJson(seg.filter_json);

    const generatedChips = Array.isArray(parsedFilters)
      ? parsedFilters.map((f) => {
          const fieldMeta =
            getCustomerInItData?.moduleFieldsRows?.find(
              (r) => r.db_column_name === f.db_column_name
            ) || {};

          const isDaysAgoOperator =
            typeof f.moduleFieldOperator === 'string' &&
            f.moduleFieldOperator.includes('VARDAY');

          let operatorValueLocal = f.operatorValue;
          let operatorValueLabel = f.operatorValue;

          if (isDaysAgoOperator) {
            operatorValueLocal = String(f.operatorValue ?? '');
            operatorValueLabel = operatorValueLocal
              ? `${operatorValueLocal} days`
              : '';
          } else if (f.operatorValueLabel) {
            // ✅ Use provided label for select/radio/checkbox fields
            operatorValueLabel = f.operatorValueLabel;
          } else if (
            typeof f.operatorValue === 'object' &&
            f.operatorValue !== null
          ) {
            // ✅ Extract label from object format { label: "Yes", value: "1" }
            operatorValueLabel =
              f.operatorValue.label || f.operatorValue.value || f.operatorValue;
            operatorValueLocal = f.operatorValue.value || f.operatorValue;
          }

          // Check if it's a boolean operator (where operatorValue should not be shown)
          const isBooleanOperator = ['= 0', '= 1', '!= 0', '!= 1'].includes(
            f.moduleFieldOperator
          );

          // ✅ Find the field metadata for proper type resolution
          const fieldMetadata =
            getCustomerInItData?.moduleFieldsRows?.find(
              (r) => r.db_column_name === f.db_column_name
            ) || {};

          // ✅ Resolve db_column_type with proper fallback chain
          const resolvedDbColumnType =
            f.db_column_type || fieldMetadata?.db_column_type || '';

          // ✅ Resolve datatypeId with proper fallback chain, treating empty string as missing
          const resolvedDatatypeId =
            f.datatypeId && f.datatypeId !== ''
              ? f.datatypeId
              : fieldMetadata?.datatype_id || resolvedDbColumnType || '';

          return {
            key: `${f.db_column_name}_${f.moduleFieldOperator}_${f.operatorValue}`,
            label: `${toSentenceCase(f.datatypeName || f.field_name || '')} ${toSentenceCase(
              f.moduleFieldoperatorlabel || ''
            )}${!isBooleanOperator && operatorValueLabel ? ' ' + operatorValueLabel : ''}`,
            payload: {
              ...f,
              fromSegment: true,

              operatorValue: f.operatorValue,

              // display
              operatorValueLabel,

              // ✅ THIS FIXES INVALID DATE
              operatorValueLocal,

              // ✅ Use resolved values
              db_column_type: resolvedDbColumnType,
              datatypeId: resolvedDatatypeId,
            },

            fromSegment: true,
          };
        })
      : [];

    //  Replace all chips with the current segment’s filters
    setChips(generatedChips);

    const next = isAllSegment(seg)
      ? {
          ...base,
          limit: 20,
          isFirstRequest: false,
          get_only_data: 0,
          get_filter_customer_count: 1,
          is_sort_req: 0,
          masterFilter: '[]',
        }
      : {
          ...base,
          limit: 20,
          isFirstRequest: false,
          get_only_data: 0,
          get_filter_customer_count: 1,
          is_sort_req: 0,
          masterFilter: parsedFilters,
        };

    dispatch(
      setAllCustomerFilters({
        ...next,
        isFirstRequest: false,
      })
    );

    // Update URL to include segment_id for navigation state preservation
    if (!isAllSegment(seg)) {
      const newQuery = { ...router.query, segment_id: seg.id };
      router.replace(
        {
          pathname: router.pathname,
          query: newQuery,
        },
        undefined,
        { shallow: true }
      );
    } else {
      // Remove segment_id from URL if "All" segment is selected
      const { segment_id, ...restQuery } = router.query;
      router.replace(
        {
          pathname: router.pathname,
          query: restQuery,
        },
        undefined,
        { shallow: true }
      );
    }
  };

  // ===== Field Selection =====

  const getOperatorsForField = (field) => {
    if (Array.isArray(field?.operators) && field.operators.length > 0) {
      return field.operators;
    }

    return (
      getCustomerInItData?.mappedDatatypeOperators?.[
        String(field?.db_column_type)
      ] || []
    );
  };

  const handleFieldSelect = async (field) => {
    isSelectingFieldRef.current = true; // Mark that field selection is in progress
    setFieldPopoverVisible(false); // close segment list

    // ✅ Remove any previous UNFINALIZED temp chips
    setChips((prev) => {
      const filtered = prev.filter((c) => !c.isTemporary);

      return filtered;
    });

    // ✅ 1. Determine operator source correctly

    const operatorsList = getOperatorsForField(field);
    const defaultOperator = operatorsList[0] || null;

    setSelectedField(field);
    setSelectedOperator(null); // Don't pre-select operator - user must choose
    setChipsFromSegment(false);
    if (defaultOperator?.sqloperator?.includes('VARDAY')) {
      setOperatorValue('');
    } else if (
      field?.datatype_name === 'date' ||
      field?.datatype_name === 'datetime' ||
      String(field?.db_column_type) === '2'
    ) {
      setOperatorValue(dayjs()); // default today (Angular behavior)
    } else {
      setOperatorValue('');
    }

    // 1. Create temp chip with NO operatorValue yet
    const tempKey = `${field.id}_${Date.now()}`;
    tempChipKeyRef.current = tempKey;

    // Temp chip shows ONLY field name (no operator) - user will select operator next
    const tempChipLabel = toSentenceCase(field.field_name);

    const tempChip = {
      key: tempKey,
      label: tempChipLabel,
      isTemporary: true, // ✅ Mark as temporary until confirmed
      payload: {
        ...field,
        moduleFieldOperator: defaultOperator?.sqloperator || '',
        moduleFieldoperatorlabel: defaultOperator?.label || '',
        operatorValue: '',
        operatorValueLabel: '',
      },
    };

    setChips((prev) => {
      const newChips = [...prev, tempChip];

      return newChips;
    });

    // 2. Open operator popover for this chip
    setEditingChipKey(tempKey);
    setOperatorPopoverVisible(true);

    // 3. Fetch API options if select datatype
    if (field.datatype_name?.toLowerCase() === 'select' && field.api_source) {
      await fetchFieldOptions(field);
    }

    // Reset flag after field selection is complete
    isSelectingFieldRef.current = false;
  };

  const resetSelection = () => {
    setSelectedField(null);
    setSelectedOperator(null);
    setOperatorValue('');
    setOperatorPopoverVisible(false);
    setAfterhandleApplyFiltersClicks(false);
    onSegmentSelect(false);
    tempChipKeyRef.current = null;
    setEditingChipKey(null);
  };

  const handleValueConfirm = () => {
    if (selectedField && selectedOperator) {
      const isBooleanField =
        selectedField?.db_column_type === '4' ||
        selectedField?.db_column_type === '9' ||
        selectedField?.datatype_name?.toLowerCase() === 'boolean';

      const isFixedBooleanOperator = [
        '=1',
        '=0',
        '!=1',
        '!=0',
        '= 1',
        '= 0',
        '!= 1',
        '!= 0',
      ].includes(selectedOperator?.sqloperator);

      // 🔒 Force value for boolean operators
      let resolvedOperatorValue = operatorValue;
      if (isBooleanField && isFixedBooleanOperator) {
        resolvedOperatorValue = selectedOperator.sqloperator.includes('!=')
          ? '0'
          : '1';
      }

      if (editingChipKey) {
        // ✅ Editing existing chip
        setChips((prev) => {
          return prev.map((c) => {
            if (c.key !== editingChipKey) return c;

            const isDateField =
              selectedField?.datatype_name === 'date' ||
              selectedField?.datatype_name === 'datetime' ||
              selectedField?.db_column_type === '2';

            const isVarday =
              typeof selectedOperator?.sqloperator === 'string' &&
              selectedOperator.sqloperator.includes('VARDAY');

            let normalized;
            let chipLabel = `${toSentenceCase(selectedField.field_name)}`;

            if (isDateField && !isVarday) {
              // ✅ ABSOLUTE DATE
              const isDateTime =
                selectedField?.datatype_name === 'datetime' ||
                String(selectedField?.db_column_type) === '2';

              const formatted =
                operatorValue && dayjs.isDayjs(operatorValue)
                  ? isDateTime
                    ? operatorValue.format('YYYY-MM-DD HH:mm:ss') // API
                    : operatorValue.format('MM/DD/YYYY')
                  : '';

              const display =
                operatorValue && dayjs.isDayjs(operatorValue)
                  ? isDateTime && !isBirthdayField(selectedField)
                    ? operatorValue.format('MM/DD/YYYY hh:mm A')
                    : operatorValue.format('MM/DD/YYYY')
                  : '';

              normalized = {
                stored: formatted, // API value
                display, // chip label
                local: operatorValue, // dayjs for DatePicker
              };
            } else if (isVarday) {
              // ✅ RELATIVE DATE (30 days)
              const days = String(operatorValue ?? '').trim();

              normalized = {
                stored: days, // API
                display: days,
                local: days,
              };
            } else {
              // ✅ EVERYTHING ELSE
              // normalized = normalizeOperatorValue(operatorValue);
              normalized = normalizeOperatorValue(
                isBooleanField && isFixedBooleanOperator
                  ? resolvedOperatorValue
                  : operatorValue
              );
            }

            const vardayLocal = isVarday
              ? String(normalized.stored || '')
              : null;

            // Check if operator should not display a value
            const shouldHideValue =
              isFixedBooleanOperator ||
              selectedOperator.has_value === false ||
              isEmptyOperator(selectedOperator);

            if (isVarday) {
              chipLabel = `${toSentenceCase(selectedField.field_name)}
${toSentenceCase(selectedOperator.label)} day(s) ${normalized.display}`;
            } else if (shouldHideValue) {
              chipLabel = `${toSentenceCase(selectedField.field_name)}
${toSentenceCase(
  isFixedBooleanOperator
    ? getBooleanOperatorLabel(selectedField, selectedOperator)
    : selectedOperator.label
)}`;
            } else {
              chipLabel = `${toSentenceCase(selectedField.field_name)}
${toSentenceCase(selectedOperator.label)}${normalized.display ? ' ' + normalized.display : ''}`;
            }

            const updatedChip = {
              ...c,
              modified: true,
              fromSegment: false,
              isTemporary: false, // ✅ Mark as finalized
              label: chipLabel,
              payload: {
                ...c.payload,
                moduleFieldOperator:
                  selectedOperator.sqloperator ||
                  selectedOperator.operator ||
                  '',

                moduleFieldoperatorlabel: selectedOperator.label,

                // ✅ DB VALUE
                operatorValue:
                  isBooleanField && isFixedBooleanOperator
                    ? resolvedOperatorValue
                    : normalized.stored,

                // ✅ DISPLAY LABEL
                operatorValueLabel:
                  isBooleanField && isFixedBooleanOperator
                    ? ''
                    : normalized.display,

                // ✅ UI OBJECT (MOST IMPORTANT)
                operatorValueLocal:
                  isBooleanField && isFixedBooleanOperator
                    ? resolvedOperatorValue
                    : isVarday
                      ? vardayLocal
                      : normalized.local,

                datatypeId:
                  selectedField.datatypeId && selectedField.datatypeId !== ''
                    ? selectedField.datatypeId
                    : c.payload.datatypeId && c.payload.datatypeId !== ''
                      ? c.payload.datatypeId
                      : selectedField.db_column_type ||
                        c.payload.db_column_type ||
                        '',

                db_column_type:
                  selectedField.db_column_type || c.payload.db_column_type,

                datatypeName:
                  selectedField.datatypeName || c.payload.datatypeName,
              },
            };

            return updatedChip;
          });
        });

        setEditingChipKey(null);
        setChipsFromSegment(false);
        setAfterhandleApplyFiltersClicks(false);
      } else {
        addChip(
          selectedField,
          selectedOperator,
          isBooleanField && isFixedBooleanOperator
            ? resolvedOperatorValue
            : operatorValue
        );
      }
    }
    resetSelection();
  };

  // Chip builder
  const addChip = (field, op, value) => {
    setChipsFromSegment(false);

    const displayValue =
      typeof value === 'object' && value !== null ? value.label : value;

    const storedValue =
      typeof value === 'object' && value !== null ? value.value : value;

    // Check if it's a boolean operator (where operatorValue should not be shown)
    const isBooleanOperator = [
      '=1',
      '=0',
      '!=1',
      '!=0',
      '= 1',
      '= 0',
      '!= 1',
      '!= 0',
    ].includes(op.sqloperator || op.operator || '');

    const label = `${toSentenceCase(field.field_name)} ${toSentenceCase(op.label)}${
      !isBooleanOperator && displayValue ? ' ' + displayValue : ''
    }`;

    // ✅ Better datatypeId resolution treating empty string as missing
    const chipDatatypeId =
      op?.datatype_id && op.datatype_id !== ''
        ? op.datatype_id
        : field?.datatype_id && field.datatype_id !== ''
          ? field.datatype_id
          : field?.datatypeId && field.datatypeId !== ''
            ? field.datatypeId
            : field?.db_column_type || '';

    const newChip = {
      key: `${field.id}_${op.value}_${storedValue}`,
      label,
      payload: {
        ...field,
        db_column_type: field.db_column_type,
        db_table: field.db_table || 'tbl_customers',
        db_table_alias: field.db_table_alias || 'c',
        db_column_name: field.db_column_name || field.field_name,
        datatypeId: chipDatatypeId, // ✅ Use properly resolved datatypeId
        datatypeName: field.datatypeName || field.field_name,
        moduleFieldOperator: op.sqloperator || op.operator || '',
        moduleFieldoperatorlabel: op.label || '',
        operatorValue: storedValue,
        operatorValueLabel: displayValue,
        is_converted_utc: 0,
        operatorValueLocal: value,
      },
      fromSegment: false,
    };

    //  Add new manual chips while keeping existing segment chips
    setChips((prev) => {
      const exists = prev.some((c) => c.key === newChip.key);
      if (exists) return prev;
      return [...prev, newChip];
    });
    hasUserModifiedRef.current = true;
    setAfterhandleApplyFiltersClicks(false);
  };

  const removeChip = (key) => {
    setChips((prev) =>
      prev
        .filter((c) => c.key !== key)
        .map((c) => ({
          ...c,
          fromSegment: false,
          modified: true,
        }))
    );
    setSelectedField(null);
    setSelectedOperator(null);
    setOperatorValue('');
    setEditingChipKey(null);
    setOperatorPopoverVisible(false);
    tempChipKeyRef.current = null;

    hasUserModifiedRef.current = true;
    setChipsFromSegment(false);
    setAfterhandleApplyFiltersClicks(false);
  };

  const handleApplyFilterClick = () => {
    setAfterhandleApplyFiltersClicks(true);
    //  Build masterFilter array from all chips
    const masterFilter = chips.map((c, index) => {
      const payload = c.payload || {};

      let operatorValue = payload.operatorValue;
      let operatorValueLocal = payload.operatorValue;

      const fieldType =
        payload.field_type ||
        payload.datatype_name ||
        payload.datatypeName ||
        '';

      const normalizedFieldType = fieldType.toLowerCase();

      // 🟢 DATE / DATETIME handling
      if (dayjs.isDayjs(operatorValue)) {
        const rawDayjs = operatorValue;

        // DATETIME
        if (normalizedFieldType === 'datetime') {
          operatorValue = rawDayjs.format('YYYY-MM-DD HH:mm:ss');
          operatorValueLocal = rawDayjs.format('MM/DD/YYYY hh:mm A');
        }

        // DATE
        else if (normalizedFieldType === 'date') {
          operatorValue = rawDayjs.format('MM/DD/YYYY');
          operatorValueLocal = operatorValue;
        }
      }

      // 🟢 Select / object values
      if (
        typeof payload.operatorValue === 'object' &&
        payload.operatorValue !== null &&
        !dayjs.isDayjs(payload.operatorValue)
      ) {
        operatorValue = payload.operatorValue.value ?? '';
        operatorValueLocal =
          payload.operatorValue.label ?? payload.operatorValue.value ?? '';
      }

      // ✅ Better datatypeId resolution treating empty string as missing
      const datatypeId =
        payload.datatypeId && payload.datatypeId !== ''
          ? payload.datatypeId
          : payload.datatype_id && payload.datatype_id !== ''
            ? payload.datatype_id
            : payload.db_column_type || '';

      return {
        db_table: payload.db_table || 'tbl_customers',
        db_table_alias: payload.db_table_alias || 'c',
        db_column_name: payload.db_column_name || payload.field_name || '',
        datatypeName: payload.datatypeName || payload.field_name || '',
        datatypeId, // ✅ Use properly resolved datatypeId
        moduleFieldOperator:
          payload.moduleFieldOperator || payload.operator || '',
        moduleFieldoperatorlabel:
          payload.moduleFieldoperatorlabel || payload.operatorLabel || '',
        operatorValue,
        operatorValueLocal,
        is_converted_utc: 0,
      };
    });

    //  Build full payload
    const next = {
      ...filters,
      currentPage: 1,
      limit: 20,
      sort: filters?.sort ?? 'c.last_seen_date',
      order: typeof filters?.order === 'boolean' ? filters.order : false,
      selectedpeopleType: filters?.selectedpeopleType ?? 'Customers',
      selectedOperatorType: operator,
      gridOrMap: filters?.gridOrMap ?? 'grid',
      act: 'list_customer',
      isFirstRequest: false,
      just_seen: '',
      shop_id: login_auth?.shop_id,
      isRequestForActiveCustomers: filters?.isRequestForActiveCustomers ?? 0,
      moduleField: null,
      moduleFieldOperator: null,
      is_sort_req: 0,
      get_filter_customer_count: 1,
      get_only_data: 0,
      masterFilter,
      is_count_req: 1,
    };

    dispatch(setAllCustomerFilters(next));
  };

  const handleClearFilter = () => {
    setChips([]); // clear all chips from UI
    setChipsFromSegment(false);
    setSelected(''); //  remove active highlight from any segment
    setMoreSegmentsModalVisible(false); // close modal if open
    setSelectedField(null);
    setSelectedOperator(null);
    setOperatorValue('');
    setAfterhandleApplyFiltersClicks(false);
    setSelectedSegmentChip({});
    onSegmentSelect(false);
    setShowFilters(true);

    const clearPayload = {
      currentPage: 1,
      limit: 20,
      sort: 'c.last_seen_date',
      order: false,
      selectedpeopleType: 'Customers',
      selectedOperatorType: 'and',
      gridOrMap: 'grid',
      act: 'list_customer',
      isFirstRequest: false,
      just_seen: '',
      shop_id: login_auth?.shop_id || '',
      isRequestForActiveCustomers: 0,
      moduleField: null,
      moduleFieldOperator: null,
      is_sort_req: 0,
      get_filter_customer_count: 1,
      get_only_data: 0,
      masterFilter: '[]',
      is_count_req: 0,
    };

    dispatch(setAllCustomerFilters(clearPayload));

    // Remove segment_id from URL when clearing all filters
    const { segment_id, ...restQuery } = router.query;
    router.replace(
      {
        pathname: router.pathname,
        query: restQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  const groupedFilters = useMemo(() => {
    // -----------------------------
    // STEP 1: Collect inputs safely
    // -----------------------------
    const groups = getCustomerInItData?.feildGroups || [];
    const systemRows = getCustomerInItData?.moduleFieldsRows || [];

    const customFieldsByModule = getCustomerCustomFields || {};
    const customFieldOptions = getCustomerCustomFieldOptions || {};

    if (!groups.length) return {};

    // -----------------------------
    // STEP 2: Helpers
    // -----------------------------
    const norm = (v) =>
      String(v || '')
        .trim()
        .toLowerCase();

    // customXX fields must always be treated as custom
    const isCustomColumn = (field) =>
      String(field?.db_column_name || '')
        .trim()
        .toLowerCase()
        .startsWith('custom');

    // stable unique key for dedupe across system + custom arrays
    // Use field ID as the primary key to allow multiple fields with same column name
    // Add prefix to distinguish between system and custom fields with same IDs
    const getUniqKey = (field, isCustom = false) => {
      const prefix = isCustom ? 'custom_' : 'sys_';

      // Prefer field ID for true uniqueness
      if (field?.id) return prefix + String(field.id).trim();
      if (field?.field_id) return prefix + String(field.field_id).trim();

      // Fallback to group + column combination
      const columnKey = String(
        field?.db_column_name ||
          field?.db_column_alias ||
          field?.field_name ||
          ''
      ).trim();
      const groupKey = field?.group_id || '';
      return `${prefix}${groupKey}_${columnKey}`;
    };

    // Build group title mapping
    const groupTitleLookup = new Map();
    groups.forEach((g) => {
      const titleRaw = g?.title || '';
      const uiTitle = norm(titleRaw) === 'custom' ? 'Custom Fields' : titleRaw;
      groupTitleLookup.set(norm(titleRaw), uiTitle);
    });

    // Resolve group title for custom fields
    const resolveGroupTitle = (moduleId, field) => {
      // 1) explicit group on the field object
      if (field?.group) {
        const resolved = groupTitleLookup.get(norm(field.group));
        if (resolved) return resolved;
      }

      // 2) module id mapping
      const fromModule = MODULE_ID_TO_GROUP_TITLE?.[String(moduleId)];
      if (fromModule) return fromModule;

      // 3) fallback
      return 'Custom Fields';
    };

    // -----------------------------
    // STEP 3: Prepare result buckets
    // -----------------------------
    const result = {};
    groups.forEach((g) => {
      const titleRaw = g?.title || '';
      // Don't filter out Shop group - V1 shows it
      // if (isShopGroup(titleRaw)) return;

      // Show Membership group only when show_membership_module_v2 is enabled
      const isMembershipGroup = norm(titleRaw) === 'membership';
      if (
        isMembershipGroup &&
        login_auth?.show_membership_module_v2 !== '1' &&
        login_auth?.show_membership_module_v2 !== 1
      )
        return;

      const uiTitle = norm(titleRaw) === 'custom' ? 'Custom Fields' : titleRaw;
      result[uiTitle] = [];
    });

    // -----------------------------
    // STEP 4: Add system fields first (skip customXX here)
    // -----------------------------
    const seen = new Set();

    systemRows.forEach((field) => {
      // IMPORTANT: skip customXX from systemRows
      if (isCustomColumn(field)) return;

      // Filter fields that should be shown in filters
      // Use showin_filter instead of is_filter (matching V1 behavior)
      if (field.showin_filter !== '1' && field.showin_filter !== 1) {
        return;
      }

      const uniq = getUniqKey(field);
      if (!uniq) return;

      // dedupe
      if (seen.has(uniq)) return;
      seen.add(uniq);

      const group = groups.find((g) => String(g.id) === String(field.group_id));
      // Don't filter out Shop group - V1 shows it
      if (!group) return;
      // if (!group || isShopGroup(group?.title)) return;

      // Show Membership group fields only when show_membership_module_v2 is enabled
      const isMembershipGroup = norm(group?.title || '') === 'membership';
      if (
        isMembershipGroup &&
        login_auth?.show_membership_module_v2 !== '1' &&
        login_auth?.show_membership_module_v2 !== 1
      )
        return;

      const titleRaw = group?.title || '';
      const uiTitle = norm(titleRaw) === 'custom' ? 'Custom Fields' : titleRaw;

      if (!result[uiTitle]) result[uiTitle] = [];

      result[uiTitle].push({
        ...field,
        is_custom: false,
      });
    });

    // -----------------------------
    // STEP 5: Add custom fields (only if not already added)
    // -----------------------------
    Object.entries(customFieldsByModule).forEach(([moduleId, fields]) => {
      if (!Array.isArray(fields)) return;

      fields.forEach((field) => {
        // Show all custom fields in filters (removed showin_filter check for custom fields)
        // Only system fields respect showin_filter flag

        const uniq = getUniqKey(field, true); // true = custom field
        if (!uniq) return;

        // if system already has it, skip
        if (seen.has(uniq)) return;
        seen.add(uniq);

        const groupTitle = resolveGroupTitle(moduleId, field);
        // Don't filter out Shop group - V1 shows it
        // if (isShopGroup(groupTitle)) return;

        // Show Membership group custom fields only when show_membership_module_v2 is enabled
        const isMembershipGroup = norm(groupTitle) === 'membership';
        if (
          isMembershipGroup &&
          login_auth?.show_membership_module_v2 !== '1' &&
          login_auth?.show_membership_module_v2 !== 1
        )
          return;

        if (!result[groupTitle]) result[groupTitle] = [];

        result[groupTitle].push({
          ...field,
          field_name: field.field_label,
          datatype_name: field.field_type,
          options: customFieldOptions[field.db_column_name] || [],
          is_custom: true,
          module_id: Number(moduleId),
        });
      });
    });

    // -----------------------------
    // STEP 6: Remove empty groups
    // -----------------------------
    Object.keys(result).forEach((key) => {
      if (!result[key]?.length) delete result[key];
    });

    return result;
  }, [
    getCustomerInItData?.feildGroups,
    getCustomerInItData?.moduleFieldsRows,
    getCustomerCustomFields,
    getCustomerCustomFieldOptions,
    login_auth?.show_membership_module_v2,
  ]);

  const fetchFieldOptions = async (field) => {
    if (!field?.api_source) return;

    // Avoid re-fetching if already loaded
    if (dynamicOptions[field.api_source]) return;

    let data = [];

    switch (field?.api_source) {
      case 'campaignlist':
        if (!campaignList?.length) {
          data = await dispatch(
            getCampaignList({
              act: 'load_message_list',
              currentPage: 1,
              limit: 250,
              list_page_req: 1,
              messageFilter: 'email',
              messageType: 'sent',
              order: false,
              sort: 'mr.id',
            })
          ).unwrap();
        }
        break;
      case 'grouplist':
        data = await dispatch(
          getGroupList({
            act: 'get_list_for_filters',
            is_api_request: 1,
            request_for: 'grouplist',
          })
        ).unwrap();
        break;
      case 'tierlist':
        data = await dispatch(
          getTierList({
            act: 'get_list_for_filters',
            is_api_request: 1,
            request_for: 'tierlist',
          })
        ).unwrap();
        break;
      case 'membershiplist':
        data = await dispatch(
          getMemberList({
            act: 'get_list_for_filters',
            is_api_request: 1,
            request_for: 'memberlist',
          })
        ).unwrap();
        break;
      case 'smartPopupList':
        data = await dispatch(
          getSmartPopupList({
            act: 'get_singupforms_list',
            act2: 'customer_list',
            is_filter: 1,
            is_api_request: 1,
            shop_id: login_auth?.shop_id,
          })
        ).unwrap();
        break;
      default:
        data = [];
    }

    const formatted = (data?.rows || [])?.map((d) => {
      const label = d?.name || d?.title || d?.label || d?.campaign_name || '';

      return {
        label,
        value:
          field.api_source === 'tierlist'
            ? label // ✅ send label instead of id
            : d?.id || d?.value,
      };
    });

    setDynamicOptions((prev) => ({
      ...prev,
      [field.api_source]: formatted,
    }));
  };

  // 🔍 Filter logic using useMemo for performance
  const filteredGroupedFilters = useMemo(() => {
    if (!searchInput.trim()) return groupedFilters;

    const lowerSearch = searchInput.toLowerCase();

    const filtered = Object.entries(groupedFilters).reduce(
      (acc, [groupTitle, fields]) => {
        const matchingFields = fields.filter((field) =>
          field.field_name.toLowerCase().includes(lowerSearch)
        );
        if (matchingFields.length > 0) acc[groupTitle] = matchingFields;
        return acc;
      },
      {}
    );

    return filtered;
  }, [searchInput, groupedFilters]);

  const handleOperatorTypeChange = (value) => {
    // prevent duplicate calls if same value selected
    if (value === operator) return;

    // 1. update local state
    setOperator(value);

    // 2. reset apply state
    hasUserModifiedRef.current = true;
    setAfterhandleApplyFiltersClicks(true);
    setChipsFromSegment(false);

    // 3. update redux filters (this SHOULD trigger API)

    dispatch(
      setAllCustomerFilters({
        selectedOperatorType: value,
      })
    );
  };

  const normalizeText = (v) =>
    String(v ?? '')
      .trim()
      .toLowerCase();

  const isPrimaryEmailField = (field) => {
    if (!field) return false;

    return (
      field.db_column_name === 'email' &&
      field.db_table_alias === 'c' &&
      normalizeText(field.datatype_name) === 'varchar'
    );
  };

  const filterOperatorsForEmail = (ops, field) => {
    if (!isPrimaryEmailField(field)) return ops || [];

    const allowed = new Set(['is', "isn't", 'is empty', 'is not empty']);

    return (ops || []).filter((op) => {
      const label = normalizeText(op.label || op.operator_name);
      return allowed.has(label);
    });
  };

  const activeChip = chips.find((c) => c.key === editingChipKey);

  const activeFieldType = editingChipKey
    ? activeChip?.payload?.db_column_type ||
      activeChip?.payload?.field?.db_column_type
    : selectedField?.db_column_type;

  const rawOperators =
    getCustomerInItData?.mappedDatatypeOperators?.[String(activeFieldType)] ||
    [];

  const operators = useMemo(() => {
    // When creating a new chip, selectedField is the target field
    return filterOperatorsForEmail(rawOperators, selectedField);
  }, [rawOperators, selectedField]);

  const canApplyFilters = useMemo(() => {
    if (!chips.length) return false;

    // Already applied → disable
    if (afterhandleApplyFiltersClicks) return false;

    if (hasUserModifiedRef.current) return true;

    // Has user actually modified anything?
    const hasUserModified = chips.some(
      (chip) => chip.modified || !chip.fromSegment
    );

    if (!hasUserModified) return false;

    // At least one valid chip must exist
    return chips.some((chip) => {
      const payload = chip.payload || {};

      if (!payload.moduleFieldOperator) return false;

      return isOperatorValueValid(
        payload,
        {
          sqloperator: payload.moduleFieldOperator,
          label: payload.moduleFieldoperatorlabel,
        },
        payload.operatorValueLocal ?? payload.operatorValue
      );
    });
  }, [chips, afterhandleApplyFiltersClicks]);

  const resetFieldPopoverSelection = () => {
    setSelectedField(null);
    setSelectedOperator(null);
    setOperatorValue('');
    setEditingChipKey(null);
    setOperatorPopoverVisible(false);

    // ✅ Remove only temporary chips (not finalized chips with empty operatorValue like "is empty")
    setChips((prev) => {
      const filtered = prev.filter((c) => !c.isTemporary);
      return filtered;
    });
  };

  const showApplyButton = !afterhandleApplyFiltersClicks;
  const showSaveSegment = afterhandleApplyFiltersClicks;

  const isOperatorValid =
    selectedOperator && isEmptyOperator(selectedOperator)
      ? true
      : isOperatorValueValid(selectedField, selectedOperator, operatorValue);

  return (
    <>
      <Wrap className="filter-wrap">
        {/* Most used segments */}
        <div>
          <Title type="primary" level={5}>
            Most used segments
            <Tooltip title="Most used pre-made segment based on customer data.">
              <ExclamationCircleOutlined
                style={{
                  marginLeft: '6px',
                  cursor: 'pointer',
                  color: 'var(--ant-color-text-secondary)', // Ant Design primary blue
                  fontSize: '14px',
                }}
              />
            </Tooltip>
          </Title>

          {getCustomerInItDataLoading ? (
            <SegmentChipLoadingSkeleton />
          ) : (
            <Row
              style={{ marginTop: '10px' }}
              gutter={[10, 10]}
              wrap
              align="middle"
            >
              {primary.map((seg) => (
                <Col key={seg.id} flex="none">
                  <AitChip
                    label={seg.title}
                    iconClass={seg.fa_icon_class || 'far fa-list-alt'}
                    title={seg.description}
                    active={selected === seg.id}
                    onClick={() => handleSelectSegmentChip(seg, 'default')}
                  />
                </Col>
              ))}

              <Col
                flex="none"
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              >
                {selectedOverflowSegment && (
                  <AitChip
                    key={selectedOverflowSegment.id}
                    label={selectedOverflowSegment.title}
                    iconClass={
                      selectedOverflowSegment.fa_icon_class || 'far fa-list-alt'
                    }
                    title={selectedOverflowSegment.description}
                    active
                    onClick={() =>
                      handleSelectSegmentChip(
                        selectedOverflowSegment,
                        'overflow-chip'
                      )
                    }
                  />
                )}

                <MoreWrap>
                  <AitChip
                    label="More"
                    onClick={() => setMoreSegmentsModalVisible(true)}
                  />
                </MoreWrap>

                <MoreSegmentModal
                  visible={moreSegmentsModalVisible}
                  setVisible={setMoreSegmentsModalVisible}
                  overflow={overflow}
                  selected={selected}
                  allSegments={visibleSegments}
                  handleSelectSegmentChip={(seg) => {
                    handleSelectSegmentChip(seg, 'modal');
                    setMoreSegmentsModalVisible(false);
                  }}
                />
              </Col>
            </Row>
          )}
        </div>

        {/* Create your own segment */}
        {showFilters && (
          <div
            style={{
              borderTop: '1px solid var(--ant-top-border-title)',
              marginTop: 10,
              paddingTop: 12,
            }}
          >
            <Title type="primary" level={5}>
              Create your own segment
              <Tooltip title="Create different customer segments based on orders,events and attributes.">
                <ExclamationCircleOutlined
                  style={{
                    marginLeft: '6px',
                    cursor: 'pointer',
                    color: 'var(--ant-color-text-secondary)',
                    fontSize: '14px',
                  }}
                />
              </Tooltip>
              <Text
                onClick={() => {
                  setShowFilters(false);
                }}
                style={{
                  color: 'var(--ant-color-primary)',
                  cursor: 'pointer',
                  marginLeft: '6px',
                }}
              >
                Hide filters
              </Text>
            </Title>

            <Row gutter={[10, 10]} wrap style={{ alignItems: 'self-end' }}>
              {/* SELECT BOX */}
              <Col flex="none">
                <AitSelectBox
                  name="operatorType"
                  options={[
                    { label: 'That match all filters', value: 'and' },
                    { label: 'That match any filters', value: 'or' },
                  ]}
                  allowClear={false}
                  style={{ width: 180 }}
                  value={operator}
                  onChange={handleOperatorTypeChange}
                />
              </Col>
              {/* FILTER CHIPS */}
              {chips.length > 0 &&
                chips.map((c) => {
                  const isActive = editingChipKey === c.key;
                  const activeFieldType =
                    c.payload?.db_column_type || selectedField?.db_column_type;

                  const chipOperatorsRaw =
                    getCustomerInItData?.mappedDatatypeOperators?.[
                      String(activeFieldType)
                    ] || [];

                  const chipOperators = filterOperatorsForEmail(
                    chipOperatorsRaw,
                    c.payload
                  );

                  return (
                    <Col key={c.key} flex="none">
                      <Popover
                        open={isActive && operatorPopoverVisible}
                        onOpenChange={(visible) => {
                          if (!visible) {
                            if (editingChipKey === tempChipKeyRef.current) {
                              setChips((prev) =>
                                prev.filter(
                                  (c) => c.key !== tempChipKeyRef.current
                                )
                              );
                            }

                            tempChipKeyRef.current = null;
                            resetSelection();
                            setEditingChipKey(null);
                          } else {
                            setEditingChipKey(c.key);
                            const fieldMeta =
                              getCustomerInItData?.moduleFieldsRows?.find(
                                (f) =>
                                  f.db_column_name === c.payload.db_column_name
                              ) || {};

                            const normalize = (v = '') =>
                              v.trim().toLowerCase();

                            const matchedOp =
                              chipOperators.find((op) => {
                                // 1️⃣ Match by label (is empty / is not empty)
                                if (
                                  normalize(op.label) ===
                                  normalize(c.payload.moduleFieldoperatorlabel)
                                ) {
                                  return true;
                                }

                                // 2️⃣ Match by sql operator (exact match)
                                if (
                                  op.sqloperator &&
                                  c.payload.moduleFieldOperator &&
                                  normalize(op.sqloperator) ===
                                    normalize(c.payload.moduleFieldOperator)
                                ) {
                                  return true;
                                }

                                // 3️⃣ Match VARDAY family (legacy segments) - ✅ FIXED: Match exact VARDAY type
                                if (
                                  op.sqloperator?.includes('VARDAY') &&
                                  c.payload.moduleFieldOperator?.includes(
                                    'VARDAY'
                                  )
                                ) {
                                  // ✅ Ensure they're the SAME VARDAY type (within, not within, before)
                                  const opType = op.sqloperator
                                    .replace('VARDAY', '')
                                    .trim();
                                  const payloadType =
                                    c.payload.moduleFieldOperator
                                      .replace('VARDAY', '')
                                      .trim();

                                  return (
                                    normalize(opType) === normalize(payloadType)
                                  );
                                }

                                return false;
                              }) || null;

                            setSelectedField({
                              ...fieldMeta,
                              ...c.payload,
                            });
                            setSelectedOperator(matchedOp);

                            const isDateField = c.payload?.datatypeId === '2';

                            //  Date operators that do NOT need value
                            const isEmptyDateOperator =
                              c.payload?.moduleFieldoperatorlabel
                                ?.toLowerCase()
                                .includes('empty');

                            if (isDateField && isEmptyDateOperator) {
                              // is empty / is not empty
                              setOperatorValue('');
                            } else if (isDateField) {
                              const opSql = String(
                                c.payload?.moduleFieldOperator || ''
                              );

                              // ✅ VARDAY: keep the editable value as "30" (string)
                              if (opSql.includes('VARDAY')) {
                                setOperatorValue(
                                  String(c.payload?.operatorValue ?? '')
                                );
                              } else {
                                // ✅ absolute date: keep as dayjs for DatePicker
                                const parsed = c.payload?.operatorValue
                                  ? dayjs(
                                      c.payload.operatorValue,
                                      ['MM/DD/YYYY', 'YYYY-MM-DD'],
                                      true
                                    )
                                  : null;

                                setOperatorValue(
                                  parsed && parsed.isValid() ? parsed : null
                                );
                              }
                            } else {
                              // non-date fields
                              setOperatorValue(
                                c.payload?.operatorValueLocal ??
                                  c.payload?.operatorValue ??
                                  ''
                              );
                            }

                            setOperatorPopoverVisible(true);
                          }
                        }}
                        trigger="click"
                        placement="bottom"
                        autoAdjustOverflow={false}
                        getPopupContainer={() => document.body}
                        content={
                          <div
                            style={{ minWidth: 320, paddingBottom: 8 }}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                              {chipOperators.length > 0 ? (
                                chipOperators.map((op) => {
                                  const isSelected =
                                    selectedOperator?.sqloperator ===
                                    op.sqloperator;

                                  return (
                                    <div
                                      key={op.id}
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: '4px 4px 4px 4px',
                                        borderRadius: 4,
                                        // transition: 'background 0.2s',
                                      }}
                                    >
                                      <AitRadioButton
                                        marginbottom={0}
                                        name={`operatorSelect-${c.key}`}
                                        value={getOperatorIdentity(
                                          selectedOperator
                                        )}
                                        onChange={() => {
                                          setSelectedOperator(op);

                                          const isBoolean =
                                            selectedField?.datatype_name ===
                                              'radio' ||
                                            selectedField?.datatype_name ===
                                              'boolean' ||
                                            selectedField?.db_column_type ===
                                              '4' ||
                                            selectedField?.db_column_type ===
                                              '9';

                                          // ✅ Clear value for "is empty" / "is not empty"
                                          if (isEmptyOperator(op)) {
                                            setOperatorValue('');
                                          } else if (isBoolean) {
                                            setOperatorValue(
                                              op.sqloperator?.includes('!=')
                                                ? '0'
                                                : '1'
                                            );
                                          }

                                          setAfterhandleApplyFiltersClicks(
                                            false
                                          );
                                        }}
                                        options={[
                                          {
                                            label: toSentenceCase(
                                              getBooleanOperatorLabel(
                                                selectedField,
                                                op
                                              )
                                            ),
                                            value: getOperatorIdentity(op),
                                          },
                                        ]}
                                        style={{
                                          display: 'flex',
                                          flexDirection: 'column',
                                        }}
                                      />

                                      {isSelected &&
                                        renderInlineOperatorInput({
                                          field: {
                                            ...selectedField,
                                            options: resolveFieldOptions(
                                              selectedField,
                                              dynamicOptions,
                                              getCustomerCustomFieldOptions
                                            ),
                                          },
                                          operator: op,
                                          value: operatorValue,
                                          setValue: setOperatorValue,
                                          loading: getCampaignListLoading,
                                        })}
                                    </div>
                                  );
                                })
                              ) : (
                                <div style={{ padding: 8, color: '#999' }}>
                                  No operators available
                                </div>
                              )}
                            </div>
                            <div
                              style={{
                                marginTop: 12,
                                padding: '0 12px',
                                textAlign: 'right',
                              }}
                            >
                              <AitButton
                                title="Done"
                                type="default"
                                onClick={() => {
                                  handleValueConfirm();
                                  setOperatorPopoverVisible(false);
                                  setEditingChipKey(null);
                                }}
                                disabled={!isOperatorValid}
                                style={{ width: '100%' }}
                              />
                            </div>
                          </div>
                        }
                      >
                        <Tooltip title="Edit operator value">
                          <StyledTag
                            color="default"
                            style={{ cursor: 'pointer' }}
                            closeIcon={
                              <DeleteOutlined
                                style={{
                                  fontSize: '14px',
                                  margin: '6px 0px 6px 6px',
                                }}
                              />
                            }
                            onClose={() => removeChip(c.key)}
                          >
                            {c.label}
                          </StyledTag>
                        </Tooltip>
                      </Popover>
                    </Col>
                  );
                })}
              {/* ADD FILTER BUTTON */}
              <Col flex="none">
                <FieldPopover
                  filteredGroupedFilters={filteredGroupedFilters}
                  selectedField={selectedField}
                  setFieldPopoverVisible={(visible) => {
                    setFieldPopoverVisible(visible);

                    if (!visible) {
                      setSearchInput('');
                      // Only reset if not in the middle of field selection
                      if (!isSelectingFieldRef.current) {
                        resetFieldPopoverSelection();
                      }
                    }
                    setSelectedOperator(null);
                    setOperatorValue('');
                  }}
                  fieldPopoverVisible={fieldPopoverVisible}
                  searchInput={searchInput}
                  setSearchInput={setSearchInput}
                  handleFieldSelect={(field) => {
                    handleFieldSelect(field);
                  }}
                >
                  <AitButton
                    title="Add filter"
                    type="primary"
                    icon={<PlusOutlined />}
                    variant="outlined"
                    onClick={() => {
                      setSelectedField(null);
                      setSelectedOperator(null);
                      setOperatorValue('');
                      setEditingChipKey(null);
                      tempChipKeyRef.current = null;

                      setFieldPopoverVisible(true);
                    }}
                  />
                </FieldPopover>
              </Col>
              <Col flex="none">
                {showApplyButton && (
                  <AitButton
                    title="Apply filter"
                    icon={<FilterOutlined />}
                    variant="outlined"
                    color="primary"
                    disabled={!canApplyFilters}
                    onClick={handleApplyFilterClick}
                  />
                )}

                {showSaveSegment && (
                  <AitButton
                    title="Save segment"
                    icon={<PieChartFilled />}
                    variant="outlined"
                    color="primary"
                    onClick={() => setSaveSegmentModalVisible(true)}
                  />
                )}
              </Col>
              {/* CLEAR ALL BUTTON */}
              {chips.length > 0 && !afterhandleApplyFiltersClicks && (
                <Col flex="none">
                  <AitButton
                    title="Clear all"
                    variant="outlined"
                    color="default"
                    onClick={handleClearFilter}
                  />
                </Col>
              )}
              {/* AFTER APPLY FILTER → SHOW SAVE + CLEAR */}
              {afterhandleApplyFiltersClicks && (
                <>
                  <Col flex="none">
                    <AitButton
                      title="Clear all"
                      variant="outlined"
                      color="default"
                      onClick={handleClearFilter}
                    />
                  </Col>
                </>
              )}
              <Col flex="auto" />
            </Row>
            {/* Operator popover */}
            {operatorPopoverVisible && !editingChipKey && (
              <OperatorPopover
                operatorPopoverVisible={operatorPopoverVisible}
                setOperatorPopoverVisible={setOperatorPopoverVisible}
                resetSelection={resetSelection}
                operators={operators}
                selectedOperator={selectedOperator}
                setSelectedOperator={setSelectedOperator}
                selectedField={selectedField}
                operatorValue={operatorValue}
                setOperatorValue={setOperatorValue}
                dynamicOptions={dynamicOptions}
                getCustomerCustomFieldOptions={getCustomerCustomFieldOptions}
                loading={getCampaignListLoading}
                isValueValid={isOperatorValid}
                onDone={() => {
                  handleValueConfirm();
                  // setOperatorPopoverVisible(false);
                }}
              />
            )}
          </div>
        )}
      </Wrap>
      <SaveSegmentModal
        visible={saveSegmentModalVisible}
        setVisible={setSaveSegmentModalVisible}
        chips={chips}
        filtersOperator={operator}
        isApplied={afterhandleApplyFiltersClicks}
        selectedSegmentChip={selectedSegmentChip}
        setSelectedSegmentChip={setSelectedSegmentChip}
        setSelected={setSelected}
        setLocalSegments={setLocalSegments}
        setAfterhandleApplyFiltersClicks={setAfterhandleApplyFiltersClicks}
        setChipsFromSegment={setChipsFromSegment}
        setChips={setChips}
      />
    </>
  );
};

export default SegmentAndFilterSection;
