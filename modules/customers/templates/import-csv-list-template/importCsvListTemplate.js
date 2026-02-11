import React, { useEffect } from 'react';
import { LayoutContainer } from '../all-customers-template/style';
import MainWrapper from '@/components/atoms/main-wrapper/mainWrapper';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import { useRouter } from 'next/router';
import AitCard from '@/components/atoms/ait-card/aitCard';
import ImportCsvListTable from '../../organisms/import-csv-list-table/importCsvListTable';
import { useDispatch, useSelector } from 'react-redux';
import { getImportCsvList } from '@/redux/apis/customers-api/customersApi';

const ImportCsvListTemplate = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { login_auth } = useSelector((state) => state.jwtState);
  const { filters, totalRecords } = useSelector(
    (state) => state.importCsvState
  );

  // Fetch only when filters change
  useEffect(() => {
    if (!login_auth?.shop_id) return;

    const payload = {
      shop_id: login_auth.shop_id,
      order: filters.order,
      limit: filters.limit,
      currentPage: filters.currentPage,
      countSync: 1,
      totalRecords: totalRecords,
    };

    dispatch(getImportCsvList(payload));
  }, [
    dispatch,
    login_auth?.shop_id,
    filters.currentPage,
    filters.limit,
    filters.order,
  ]);

  return (
    <LayoutContainer>
      <MainWrapper>
        <AitPageHeader
          title="Import CSV"
          subtitle="Import customers via CSV file"
          subtitleLink=""
          hideButton={false}
          buttonLabel="Upload CSV"
          onButtonClick={() => {
            router.push('/customers/import-csv/upload-csv');
          }}
        />
        <AitCard>
          <ImportCsvListTable 
          />
        </AitCard>
      </MainWrapper>
    </LayoutContainer>
  );
};

export default ImportCsvListTemplate;
