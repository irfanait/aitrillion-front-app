import CustomerDetailsTemplate from '@/modules/customers/templates/customer-details-template/customerDetailsTemplate';
import { useRouter } from 'next/router';

export default function CustomerDetails() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <CustomerDetailsTemplate customerId={id} />
    </div>
  );
}
