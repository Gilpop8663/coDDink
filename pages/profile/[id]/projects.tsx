import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useUserState } from '@libs/client/useUser';
import Layout from '@components/layout';

const ProfileProjects: NextPage = () => {
  const { data, error }: useUserState = useSWR('/api/users/me');

  const router = useRouter();

  const userId = router.query.id;

  useEffect(() => {
    if (userId) {
      router.push(`/profile/${userId}`);
    }
  }, [router, userId]);
  return (
    <Layout
      isLogin={data && data.ok}
      profile={data?.profile}
      userId={data?.profile?.id}>
      <></>
    </Layout>
  );
};

export default ProfileProjects;
