import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useUserState } from '@libs/client/useUser';
import Layout from '@components/common/Layout';

const Joblist: NextPage = () => {
  const { data, error }: useUserState = useSWR('/api/users/me');

  return (
    <Layout
      isLogin={data && data.ok}
      profile={data?.profile}
      userId={data?.profile?.id}
    >
      <div>안녕</div>
    </Layout>
  );
};

export default Joblist;
