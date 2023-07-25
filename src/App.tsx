import { Container } from '@/components/ui/container';
import { CustomerForm } from '@/components/customer-form';

export default function Home() {
  return (
    <div className=''>
      <Container>
        <CustomerForm />
      </Container>
    </div>
  );
}
