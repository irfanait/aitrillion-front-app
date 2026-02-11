import React from 'react';
import { Typography, Button } from 'antd';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { useRouter } from 'next/router';
import { getToken } from '@/utils/authHelpers';

const { Paragraph, Text } = Typography;

const ImportSupressTab = () => {
  const router = useRouter();
  const token = getToken();
  return (
    <>
      <Paragraph style={{ fontSize: 16, lineHeight: 1 }}>
        <Text strong type='primary'>You can easily mark customers inactive from here. 
        Just add customers in the CSV to whom you want to mark as inactive. In
        CSV add a new column named "Is inactive". In this
        column, there is a need to fill "Yes" value to mark
        the customers as inactive. Now Save the CSV and import it from here.</Text>
      </Paragraph>

      <Paragraph type="secondary" style={{ fontSize: 14 }}>
        Before importing any contacts into AiTrillion, you must certify that the
        contacts have been collected in compliance with the permission marketing
        policy; specifically, the list consists only of contacts who have
        provided explicit and deliberated permission to receive email from you.
        Please be advised we will remove addresses with a prefix of jhon-doe@ or
        tom@.
      </Paragraph>

      <Paragraph type="secondary" style={{ fontSize: 14, marginBottom:24 }}>
        Additionally, you must provide a brief description of the source and
        methods used to collect these contacts.
      </Paragraph>

      <AitButton
        type="primary"
        title="Click here"
        onClick={() =>
          router.push(
            `${process.env.NEXT_PUBLIC_APP_URL}/workflowv1/view/page/importcsv#/import/index?ai_v2=${token}`
            // `${process.env.NEXT_PUBLIC_APP_URL}/workflowv1/view/page/importcsv?ai_v2=${token}#/import/index`
          )
        }
      />
    </>
  );
};

export default ImportSupressTab;
