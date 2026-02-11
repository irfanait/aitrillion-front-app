import React, { useMemo } from 'react';
import { Dropdown, Spin, Grid } from 'antd';
import { SearchOutlined, UnorderedListOutlined } from '@ant-design/icons';
import {
  Wrapper,
  Label,
  FieldWrapper,
  DropdownMenu,
  SearchInput,
  CheckboxOption,
  EmptyText,
  StickyHeader,
} from './style';
import AitCheckboxButton from '../ait-checkbox/aitCheckbox';
import AitButton from '../ait-button/aitButton';
const { useBreakpoint } = Grid;

const AitCheckboxDropdown = ({
  name = '',
  label = '',
  value = [],
  onChange,
  options = [],
  required = false,
  loading = false,
  error = false,
  errorMessage = '',
  placeholder = 'Select columns',
  searchable = true,
  style = {},
  disabledOptions = [],
  ...rest
}) => {
  const screens = useBreakpoint();
  const [search, setSearch] = React.useState('');

  // Filtering options for search
  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, options]);

  // Select all logic
  const allValues = options.map((o) => o.value);
  const isAllChecked = value.length === allValues.length && value.length > 0;
  const isIndeterminate = value.length > 0 && value.length < allValues.length;

  const handleSelectAll = (checked) => {
    onChange(checked ? allValues : []);
  };

  const handleOptionChange = (checkedValue, checked) => {
    if (checked) {
      onChange([...value, checkedValue]);
    } else {
      onChange(value.filter((v) => v !== checkedValue));
    }
  };

  const hasFilteredOptions = filteredOptions?.length > 0;

  // Dropdown content
  const menu = (
    <DropdownMenu>
      {searchable && (
        <StickyHeader>
          <SearchInput
            placeholder="Search columns"
            size="small"
            suffix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
          />
        </StickyHeader>
      )}

      {/* Select All */}
      {hasFilteredOptions && (
        <CheckboxOption>
          <AitCheckboxButton
            name="selectAll"
            label="Select all"
            value={isAllChecked}
            onChange={(e) => handleSelectAll(e.target.checked)}
            // indeterminate={isIndeterminate}
            marginbottom={0}
            fontweight="400"
          />
        </CheckboxOption>
      )}

      {/* Options */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 16 }}>
          <Spin />
        </div>
      ) : filteredOptions.length === 0 ? (
        <EmptyText>No columns found</EmptyText>
      ) : (
        filteredOptions.map((opt) => (
          <CheckboxOption key={opt.value}>
            <AitCheckboxButton
              name={opt.value}
              label={opt.label}
              value={value.includes(opt.value)}
              onChange={(e) => handleOptionChange(opt.value, e.target.checked)}
              disabled={disabledOptions.includes(opt.value)}
              marginbottom={0}
              fontweight="400"
            />
          </CheckboxOption>
        ))
      )}
    </DropdownMenu>
  );

  return (
    <Wrapper>
      {label && (
        <Label htmlFor={name}>
          {label} {required && <span style={{ color: 'red' }}>*</span>}
        </Label>
      )}
      <FieldWrapper>
        <Dropdown
          overlay={menu}
          trigger={['click']}
          placement="bottomRight"
          autoAdjustOverflow={screens?.md ? false : true}
          getPopupContainer={() => document.body}
        >
          <AitButton
            className="ait-dropdown-btn"
            icon={<UnorderedListOutlined />}
            style={{ width: '100%', ...style }}
            loading={loading}
            title={value.length > 0 ? `${value.length} Selected` : placeholder}
          />
        </Dropdown>
      </FieldWrapper>
      {error && errorMessage && (
        <div
          style={{
            color: 'var(--ant-color-text-error)',
            fontSize: 12,
            marginTop: 4,
          }}
        >
          {errorMessage}
        </div>
      )}
    </Wrapper>
  );
};

export default AitCheckboxDropdown;
