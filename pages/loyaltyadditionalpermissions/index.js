import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import logger from '@/utils/logger';
import { setadditionalloyaltypermissionsService } from '@/modules/loyalty-rewards/api/redeemPoints';
import { moduleRoute } from '@/modules/layouts/routeControl/route';
import { Spin } from 'antd';

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const handleAdditionaLloyaltyPermission = async () => {
    setLoading(true);
    try {
      let payload = {
        ...router?.query,
      };
      const response = await setadditionalloyaltypermissionsService(payload);
      if (response?.data?.status === 'success') {
        router.push(moduleRoute?.loyalty_rewards?.redeem_points);
        setLoading(false);
      } else {
        setLoading(true);
      }
    } catch (error) {
      logger(error);
    }
    // finally {
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    handleAdditionaLloyaltyPermission();
  }, []);

  return (
    <>
      {loading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <Spin size="large" />
        </div>
      )}
    </>
  );
}
