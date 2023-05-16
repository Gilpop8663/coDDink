import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useUserState } from '@libs/client/useUser';
import Layout from '@components/layout';
import InteractionButton from '@components/stream/interactionButton';

const Live: NextPage = () => {
  const { data, error }: useUserState = useSWR('/api/users/me');

  return (
    <Layout
      isLogin={data && data.ok}
      profile={data?.profile}
      userId={data?.profile?.id}>
      <div className="relative flex">
        <div className="w-full overflow-scroll">
          <div className="aspect-video bg-slate-200"></div>
          <div className="px-8">
            <div className="flex justify-between border-b py-5 ">
              <div className="flex flex-col">
                <span className="text-lg font-semibold">
                  draw with exumé today
                </span>

                <div className="mt- flex items-center space-x-2 text-sm text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-semibold">2</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 ">
                <InteractionButton
                  color="blue"
                  icon="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"
                  label="평가"
                />
                <InteractionButton
                  color="white"
                  icon="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"
                  label="Share"
                />
                <InteractionButton
                  color="white"
                  icon="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  label="Collapse"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-8 border-b py-8">
              <div className="flex flex-col ">
                <span className="text-xs font-semibold text-gray-500">
                  설명
                </span>
                <span className="mt-2 text-sm">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Possimus rem nobis commodi cumque sapiente molestiae tenetur
                  velit culpa? Asperiores reprehenderit ipsa sunt possimus, nisi
                  voluptatum dignissimos rem mollitia facere? Autem.
                </span>
              </div>
              <div className="flex flex-col ">
                <span className="text-xs font-semibold text-gray-500">툴</span>
                <div className="mt-2 flex items-center space-x-3">
                  <div className="flex  h-12 w-36 items-center justify-center rounded-md bg-orange-400  font-semibold text-white">
                    Fressco
                  </div>
                  <div className="flex  h-12 w-36 items-center justify-center rounded-md bg-orange-400  font-semibold text-white">
                    React
                  </div>
                </div>
              </div>
              <div className="flex flex-col ">
                <span className="text-xs font-semibold text-gray-500">
                  크리에이티브 분야
                </span>
                <div className="mt-2 flex items-center space-x-3">
                  <div className="flex  h-12 w-36 items-center justify-center rounded-md bg-orange-400  font-semibold text-white">
                    Illustration
                  </div>
                  <div className="flex  h-12 w-36 items-center justify-center rounded-md bg-orange-400  font-semibold text-white">
                    Javascript
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="-z-10 w-96 bg-slate-600"></div>
        <div className="fixed right-0 h-screen w-80 bg-orange-200"></div>
      </div>
    </Layout>
  );
};

export default Live;
