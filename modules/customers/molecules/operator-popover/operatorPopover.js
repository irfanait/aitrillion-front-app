import React, { useState, useEffect } from 'react';
import AitRadioButton from '@/components/atoms/ait-radio-button/aitRadioButton';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { Popover } from 'antd';
import {
  renderInlineOperatorInput,
  resolveFieldOptions,
  toSentenceCase,
} from '../../utils/helper';

const OperatorPopover = (props) => {
  const {
    operatorPopoverVisible,
    resetSelection,
    setOperatorPopoverVisible,

    // REQUIRED PROPS
    operators = [],
    selectedOperator,
    setSelectedOperator,
    selectedField,
    operatorValue,
    setOperatorValue,
    dynamicOptions = {},
    getCustomerCustomFieldOptions = {},
    loading,
    isValueValid,
    onDone,
  } = props;
  const [uiSelectedOperatorId, setUiSelectedOperatorId] = useState(null);

  // ✅ Reset when popover opens (user must select operator)
  useEffect(() => {
    if (operatorPopoverVisible) {
      setUiSelectedOperatorId(null);
      setOperatorValue('');
    }
  }, [operatorPopoverVisible]);

  return (
    <Popover
      open={operatorPopoverVisible}
      onOpenChange={(visible) => {
        if (!visible) resetSelection();
        else setOperatorPopoverVisible(true);
      }}
      trigger="click"
      placement="bottom"
      // getPopupContainer={(trigger) => trigger.parentNode}
      getPopupContainer={() => document.body}
      content={
        <div
          style={{ minWidth: 320, paddingBottom: 8 }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {operators.length > 0 ? (
            operators.map((op) => {
              const isSelected = String(uiSelectedOperatorId) === String(op.id);

              return (
                <div
                  key={op.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    background: isSelected ? '#f6f6f6' : 'transparent',
                    transition: 'background 0.2s',
                    padding: '4px 8px',
                    borderRadius: 4,
                  }}
                >
                  <AitRadioButton
                    name="operatorSelect-new"
                    value={uiSelectedOperatorId}
                    onChange={() => {
                      setUiSelectedOperatorId(String(op.id));
                      setSelectedOperator(op); // actual operator
                      if (op.has_value === false) {
                        setOperatorValue('');
                      }
                    }}
                    options={[
                      {
                        label: toSentenceCase(op.label || op.operator_name),
                        value: String(op.id),
                      },
                    ]}
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
                      loading: loading,
                    })}
                </div>
              );
            })
          ) : (
            <div style={{ padding: 8, color: '#999' }}>
              No operators available
            </div>
          )}

          {!isValueValid && (
            <div
              style={{
                color: '#ff4d4f',
                fontSize: 12,
                marginTop: 6,
                paddingLeft: 4,
              }}
            >
              Please provide a value to continue
            </div>
          )}

          <div
            style={{
              marginTop: 12,
              padding: '0 12px',
              textAlign: 'right',
            }}
          >
            <AitButton
              title="Done"
              color="primary"
              // type=""
              onClick={onDone}
              disabled={!isValueValid}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      }
    >
      <div />
    </Popover>
  );
};

export default OperatorPopover;
