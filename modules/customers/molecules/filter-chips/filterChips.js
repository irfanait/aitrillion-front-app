import React from 'react';
import { Tooltip, Popover } from 'antd';
// import { StyledTag } from '../style';
import { DeleteOutlined } from '@ant-design/icons';
import { StyledTag } from '@/components/molecules/ait-page-header/style';

const FilterChips = ({
  chips,
  setChips,
  editingChipKey,
  setEditingChipKey,
}) => {
  const removeChip = (key) => {
    setChips((prev) => prev.filter((c) => c.key !== key));
  };

  return (
    <>
      {chips.map((c) => (
        <Popover
          key={c.key}
          trigger="click"
          content={<div>Edit operators UI here</div>}
        >
          <Tooltip title="Edit chip">
            <StyledTag
              closeIcon={<DeleteOutlined />}
              onClose={() => removeChip(c.key)}
            >
              {c.label}
            </StyledTag>
          </Tooltip>
        </Popover>
      ))}
    </>
  );
};

export default FilterChips;
