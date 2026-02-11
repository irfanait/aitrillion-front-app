import React, { useState } from 'react';
import { Table } from 'antd';
import { TableWrapper } from './style';
import { InboxOutlined } from '@ant-design/icons';

const AitTableList = ({
  extraHeader,
  loading = false,
  marginleft = '-10px',
  marginright = '-10px',
  ...rest
}) => {
  return (
    <TableWrapper marginleft={marginleft} marginright={marginright}>
      <Table
        rowKey={(record) => record.id || record.key}
        loading={loading}
        locale={{
          emptyText: (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <InboxOutlined style={{ fontSize: 40, color: '#999' }} />
              <p style={{ marginTop: 8 }}>No data available</p>
            </div>
          ),
        }}
        {...rest}
      />
    </TableWrapper>
  );
};

export default AitTableList;
