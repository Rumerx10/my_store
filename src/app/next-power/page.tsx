import Home from '@/components/next-power/home/Home';
import { fetchHomePage } from '@/lib/api/serverStore';

// Rendered on every request, so changes saved in the seller centre show at once.
const page = async () => {
  const initialPage = await fetchHomePage();
  return <Home initialPage={initialPage} />;
};

export default page;
