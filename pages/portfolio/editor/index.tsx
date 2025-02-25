import type { NextPage } from 'next';
import Image from 'next/image';
import { cls } from '@libs/client/utils';
import { useCreatePortfolio } from '@hooks/useCreatePortfolio';
import Layout from '@components/common/Layout';
import LoadingSpinner from '@components/common/LoadingSpinner';
import CreatePortfolio from '@components/portfolio/createPortfolio';
import EditFirstScreen from '@components/portfolio/editFirstScreen';
import EditSidebar from '@components/portfolio/editSidebar';
import PreviewCode from '@components/portfolio/previewCode';
import PreviewImage from '@components/portfolio/previewImage';
import PreviewProject from '@components/portfolio/previewProject';
import PreviewText from '@components/portfolio/previewText';

const Editor: NextPage = () => {
  const {
    user,
    isSubmitLoading,
    isUpload,
    loadingImg,
    handleSubmit,
    onValid,
    content,
    onAddCodeArea,
    onAddTextArea,
    onClearAttachment,
    onPreviewImage,
    register,
    isDraft,
    isSetting,
    onChange,
    onDraftClick,
    onPreviewClick,
    onSetting,
    setContent,
    categoryArr,
    deleteContentTags,
    errors,
    isPublic,
    isThumbnailLoading,
    isVisible,
    onKeyPress,
    onPublicClick,
    onThumbnailImage,
    onUserClick,
    onVisibleClick,
    ownerArr,
    tagArr,
    thumbnail,
    toolArr,
    userData,
    descriptionValue,
    isPreview,
    titleValue,
  } = useCreatePortfolio();

  return (
    <Layout isLogin={true} profile={user} userId={user?.id}>
      {isSubmitLoading && (
        <div className="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black/50 text-3xl font-bold text-white">
          <span className="mr-5">게시물 업로드 중입니다</span>
          <LoadingSpinner />
        </div>
      )}
      {isUpload && (
        <div className="fixed z-30 flex h-screen w-screen items-center justify-center bg-black/80 text-3xl text-white">
          <div className="relative flex h-4/5 w-[1400px] items-center justify-center bg-black">
            <Image
              src={loadingImg}
              alt="loadingImage"
              layout="fill"
              className="opacity-40"
            ></Image>
            <LoadingSpinner />
          </div>
        </div>
      )}
      <div className="fixed z-40 flex h-screen w-screen items-center justify-center bg-white xl:hidden">
        <div role="alert">
          <div className="rounded-t bg-red-500 px-4 py-2 font-bold text-white">
            화면이 너무 작습니다
          </div>
          <div className="rounded-b border border-t-0 border-red-400 bg-red-100 px-4 py-3 text-red-700">
            <p>데스크탑을 이용해주세요</p>
          </div>
        </div>
      </div>
      <form action="" onSubmit={handleSubmit(onValid)}>
        <div
          className={cls(
            isSubmitLoading ? 'fixed' : 'absolute',
            ' top-0 grid w-full grid-rows-1 bg-gray-100'
          )}
        >
          <div className="row-span-1 mt-16 grid w-full grid-rows-1 gap-4 bg-gray-100 p-5 lg:grid-cols-8  2xl:grid-cols-9">
            <div
              className={cls(
                content.length > 0 ? '' : 'h-screen justify-center',
                'relative flex min-h-screen w-full flex-col items-center border bg-white shadow-lg  lg:col-span-6 2xl:col-span-7  '
              )}
            >
              {content.length === 0 ? (
                <EditFirstScreen
                  register={register}
                  onPreviewImage={onPreviewImage}
                  onAddTextArea={() => onAddTextArea(0)}
                  onAddCodeArea={() => onAddCodeArea(0)}
                />
              ) : (
                <div className=" flex w-full flex-col px-16 py-12">
                  {content &&
                    content.map((item, idx) => (
                      <div
                        key={item.id}
                        className={cls(
                          content.length === 1 ? '' : '',
                          'w-full'
                        )}
                      >
                        {item.kind === 'image' && (
                          <PreviewImage
                            onAddTextArea={() => onAddTextArea(idx)}
                            onPreviewImage={onPreviewImage}
                            onAddCodeArea={() => onAddCodeArea(idx)}
                            src={item}
                            idx={idx}
                            onClearClick={onClearAttachment}
                          />
                        )}
                        {item.kind === 'text' && (
                          <PreviewText
                            onClearClick={onClearAttachment}
                            onAddTextArea={() => onAddTextArea(idx)}
                            onPreviewImage={onPreviewImage}
                            onAddCodeArea={() => onAddCodeArea(idx)}
                            setContent={setContent}
                            idx={idx}
                            textValue={item.description}
                            draftAlign={item?.alignText}
                            draftFontSize={item?.fontSize}
                            onChange={(e) => onChange(e, idx)}
                          />
                        )}
                        {item.kind === 'code' && (
                          <PreviewCode
                            onClearClick={onClearAttachment}
                            textValue={item.description}
                            onAddTextArea={() => onAddTextArea(idx)}
                            onPreviewImage={onPreviewImage}
                            onAddCodeArea={() => onAddCodeArea(idx)}
                            setContent={setContent}
                            idx={idx}
                            draftLang={item.language}
                            draftFontSize={item.fontSize}
                            onChange={(e) => onChange(e, idx)}
                          ></PreviewCode>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
            <EditSidebar
              isDraft={isDraft}
              content={content}
              onPreviewImage={onPreviewImage}
              register={register}
              onSetting={onSetting}
              onAddTextArea={() => onAddTextArea(content.length - 1)}
              onAddCodeArea={() => onAddCodeArea(content.length - 1)}
              onDraftClick={onDraftClick}
              onPreviewClick={onPreviewClick}
            />
          </div>
        </div>
        {isSetting && (
          <CreatePortfolio
            isSubmitLoading={isSubmitLoading}
            isThumbnailLoading={isThumbnailLoading}
            previewThumbnailImg={thumbnail}
            isDraft={isDraft}
            onDraftClick={onDraftClick}
            onThumbnailImage={onThumbnailImage}
            onUserClick={onUserClick}
            userData={userData?.user}
            categoryArr={categoryArr}
            toolArr={toolArr}
            tagArr={tagArr}
            onKeyPress={onKeyPress}
            register={register}
            errors={errors}
            isVisible={isVisible}
            isPublic={isPublic}
            onSetting={onSetting}
            onPublicClick={onPublicClick}
            onVisibleClick={onVisibleClick}
            deleteContentTags={deleteContentTags}
            ownerArr={ownerArr}
          />
        )}
        {isPreview && (
          <PreviewProject
            onClick={onPreviewClick}
            loginId={user?.id}
            contents={content}
            title={titleValue}
            likes={0}
            views={0}
            avatar={user?.avatar}
            name={user?.name}
            isLiked={false}
            commentCount={0}
            tools={toolArr}
            category={categoryArr}
            tags={tagArr}
            city={user?.city}
            country={user?.country}
            description={descriptionValue}
          />
        )}
      </form>
    </Layout>
  );
};

export default Editor;
