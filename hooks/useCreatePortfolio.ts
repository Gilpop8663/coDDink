import { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { CoddinkProject } from '@prisma/client';
import useSWR from 'swr';
import { v4 as uuidv4 } from 'uuid';
import { DetailProjectResponse } from 'pages';
import useMutation from '@libs/client/useMutation';
import useUser from '@libs/client/useUser';
import { uploadFile } from '@libs/client/utils';

export interface UploadProps {
  title: string;
  tags: string;
  tools: string;
  category: string;
  visible: boolean;
  description: string;
  owner: string;
  images: FileList;
  posts: string[];
  code: string;
  linkURL: string;
  thumbnail: FileList;
  content: ContentProps[];
}

interface UploadProjectMutation {
  ok: boolean;
  project: CoddinkProject;
}

export interface ContentProps {
  kind: 'image' | 'text' | 'code' | 'youtube';
  description: string;
  imageSrc?: string | null;
  id: string;
  fontSize?: string | null;
  alignText?: string | null;
  language?: string | null;
  fileData?: File;
}

export interface CFImageResult {
  result: {
    id: string;
    uploadURL: string;
  };
  result_info: null;
  success: boolean;
  errors: [];
  messages: [];
}

interface UserSearchResponse {
  ok: boolean;
  user: UserDataProps[];
}

export interface UserDataProps {
  id: number;
  name: string;
  avatar: string;
}

export interface thumbnailProps {
  description: string;
  imageSrc: string;
  fileData?: File;
}

interface AddContentParams {
  type: 'text' | 'code' | 'image' | 'youtube';
  data?: any;
  idx?: number;
}

export const useCreatePortfolio = () => {
  const router = useRouter();
  const {
    register,
    watch,
    setValue,
    setError,

    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadProps>();
  const { user } = useUser();
  const [isDraft, setIsDraft] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [tagArr, setTagArr] = useState<string[]>([]);
  const [ownerArr, setOwnerArr] = useState<UserDataProps[]>([]);
  const [categoryArr, setCategoryArr] = useState<string[]>([]);
  const [toolArr, setToolArr] = useState<string[]>([]);
  const [isSetting, setIsSetting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isThumbnailLoading, setIsThumbnailLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [content, setContent] = useState<ContentProps[]>([]);
  const [isUpload, setIsUpload] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [thumbnail, setThumbnail] = useState<thumbnailProps | null>(null);
  const [loadingImg, setLoadingImg] = useState('');
  const [finishProjectId, setFinishProjectId] = useState<null | number>(null);
  const { data: detailData } = useSWR<DetailProjectResponse | null>(
    finishProjectId
      ? [`/api/projects/${finishProjectId}`, finishProjectId]
      : null,
    { refreshInterval: 1000 }
  );
  const [uploadProjects, { loading, error, data }] =
    useMutation<UploadProjectMutation>('/api/projects');
  const ownerValue = watch('owner');

  const portfolioAsPath = router.asPath.split('/portfolio/editor?project_id=');

  const project_id = portfolioAsPath.length > 1 ? portfolioAsPath[1] : '';

  const { data: editProjectData } = useSWR<DetailProjectResponse | null>(
    project_id ? `/api/projects/${project_id}` : null
  );
  const { data: userData } = useSWR<UserSearchResponse>(
    ownerValue !== '' ? `/api/users/search?name=${ownerValue}` : ''
  );

  const tagValue = watch('tags');
  const categoryValue = watch('category');
  const toolValue = watch('tools');
  const titleValue = watch('title');
  const descriptionValue = watch('description');
  const linkURLValue = watch('linkURL');

  const onValid = async (value: UploadProps) => {
    if (loading) return;
    if (content.length === 0) {
      return;
    }
    if (!user) return;
    if (categoryArr.length === 0) {
      setError('category', {
        type: 'required',
        message:
          '프로젝트를 게시하려면 적어도 하나의 카테고리를 추가해 주십시오.',
      });
      return;
    }

    setIsSubmitLoading(true);
    let thumbnailSrc = '';

    const contentArr = await Promise.all(
      content.map(async (item) => {
        if (item.kind === 'image') {
          if (item.fileData && !item.imageSrc) {
            const imageSrc = await uploadFile(item.fileData);
            return { ...item, imageSrc };
          } else {
            return item;
          }
        } else {
          return item;
        }
      })
    );

    if (thumbnail && thumbnail.imageSrc) {
      thumbnailSrc = thumbnail.imageSrc;
    } else if (thumbnail && thumbnail.fileData) {
      const imageSrc = await uploadFile(thumbnail.fileData);
      thumbnailSrc = imageSrc;
    }

    const newValue = {
      ...value,
      content: contentArr,
      visible: isPublic,
      avatar: user?.avatar,
      tagArr: tagArr,
      categoryArr: categoryArr,
      toolArr: toolArr,
      thumbnail: thumbnailSrc,
      isDraft: isDraft,
      projectId: +project_id,
      ownerArr: [
        { name: user.name, avatar: user.avatar, id: user.id },
        ...ownerArr,
      ],
    };

    uploadProjects(newValue);
  };

  const onClearAttachment = (idx: number) => {
    setContent((prev) => {
      const newArr = [...prev.slice(0, idx), ...prev.slice(idx + 1)];
      return newArr;
    });
  };

  const onAddContent = ({ type, data, idx }: AddContentParams) => {
    let newContent: ContentProps;

    if (type === 'text') {
      newContent = {
        kind: 'text',
        description: '',
        id: uuidv4(),
        fontSize: 'text-base',
        alignText: 'text-left',
      };
    } else if (type === 'code') {
      newContent = {
        kind: 'code',
        description: '',
        id: uuidv4(),
        language: 'jsx',
        fontSize: 'text-base',
      };
    } else if (type === 'image' && data) {
      newContent = {
        kind: 'image',
        description: URL.createObjectURL(data.file),
        imageSrc: '',
        fileData: data.file,
        id: uuidv4(),
      };
    } else if (type === 'youtube') {
      newContent = {
        kind: 'youtube',
        description: ``,
        id: uuidv4(),
      };
    }

    console.log(content, type, data, idx);

    setContent((prev) => {
      if (idx === undefined) return [...prev, newContent];
      return [...prev.slice(0, idx), newContent, ...prev.slice(idx)];
    });
  };

  const onAddTextArea = (idx?: number) => {
    onAddContent({ type: 'text', idx });
  };

  const onAddCodeArea = (idx?: number) => {
    onAddContent({ type: 'code', idx });
  };

  const onAddYoutubeArea = (idx?: number) => {
    onAddContent({ type: 'youtube', idx });
  };

  const handleYoutubeEmbed = (code: string, idx: number) => {
    onAddContent({ type: 'youtube', idx });

    const newContent = content.map((item, index) => {
      if (idx !== index) return item;

      return { ...item, description: code };
    });

    setContent(newContent);
  };

  const onPreviewImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    idx?: number
  ) => {
    const {
      target: { files },
    } = e;
    if (!files) return;

    setIsUpload(true);

    Array.from(files).forEach((file) => {
      setLoadingImg(URL.createObjectURL(file));
      onAddContent({ type: 'image', data: { file }, idx });
    });

    setIsUpload(false);
  };

  const onChange = async (e: ChangeEvent<HTMLTextAreaElement>, idx: number) => {
    if (!e.target) return;

    setContent((prev) => {
      const curValue = { ...prev[idx], description: e.target.value };

      const newContent = [
        ...prev.slice(0, idx),
        curValue,
        ...prev.slice(idx + 1),
      ];

      return newContent;
    });
  };

  const onSetting = () => {
    setIsSetting((prev) => !prev);
  };

  const onVisibleClick = () => {
    setIsVisible((prev) => !prev);
  };

  const onPublicClick = (value: boolean) => {
    setIsPublic(value);
    setIsVisible(false);
  };

  const onThumbnailImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e;
    if (!files) return;

    setIsThumbnailLoading(true);
    const file = files[0];

    setThumbnail({
      description: URL.createObjectURL(file),
      imageSrc: '',
      fileData: file,
    });
    setIsThumbnailLoading(false);
  };

  const onKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    kind: 'tags' | 'category' | 'tools' | 'owner'
  ) => {
    if (e.key === 'Enter') {
      if (kind === 'tags') {
        if (tagValue === '' || tagArr.length >= 10) return;
        setTagArr((prev) => [...prev, tagValue]);
        setValue('tags', '');
      } else if (kind === 'category') {
        if (categoryValue === '' || categoryArr.length >= 10) return;
        setCategoryArr((prev) => [...prev, categoryValue]);
        setValue('category', '');
      } else if (kind === 'tools') {
        if (toolValue === '' || toolArr.length >= 10) return;
        setToolArr((prev) => [...prev, toolValue]);
        setValue('tools', '');
      }
    } else if (e.keyCode === 8) {
      if (kind === 'tags') {
        if (tagValue !== '') return;
        setTagArr((prev) => [...prev.slice(0, -1)]);
      } else if (kind === 'category') {
        if (categoryValue !== '') return;
        setCategoryArr((prev) => [...prev.slice(0, -1)]);
      } else if (kind === 'tools') {
        if (toolValue !== '') return;
        setToolArr((prev) => [...prev.slice(0, -1)]);
      } else if (kind === 'owner') {
        if (ownerValue !== '') return;
        setOwnerArr((prev) => [...prev.slice(0, -1)]);
      }
    }
  };

  const deleteContentTags = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    kind: 'tags' | 'category' | 'tools' | 'owner' | string,
    idx: number
  ) => {
    if (kind === 'tags') {
      setTagArr((prev) => {
        let newContent;
        if (idx === 0) {
          newContent = [...prev.slice(idx + 1)];
        } else {
          newContent = [...prev.slice(0, idx), ...prev.slice(idx + 1)];
        }
        return newContent;
      });
    } else if (kind === 'category') {
      setCategoryArr((prev) => {
        let newContent;
        if (idx === 0) {
          newContent = [...prev.slice(idx + 1)];
        } else {
          newContent = [...prev.slice(0, idx), ...prev.slice(idx + 1)];
        }
        return newContent;
      });
    } else if (kind === 'tools') {
      setToolArr((prev) => {
        let newContent;
        if (idx === 0) {
          newContent = [...prev.slice(idx + 1)];
        } else {
          newContent = [...prev.slice(0, idx), ...prev.slice(idx + 1)];
        }
        return newContent;
      });
    } else if (kind === 'owner') {
      setOwnerArr((prev) => {
        let newContent;
        if (idx === 0) {
          newContent = [...prev.slice(idx + 1)];
        } else {
          newContent = [...prev.slice(0, idx), ...prev.slice(idx + 1)];
        }
        return newContent;
      });
    }
  };

  const onDraftClick = async () => {
    if (isDraft) return;
    setIsDraft(true);
    clearErrors('title');
    clearErrors('thumbnail');
    clearErrors('category');

    setIsDraft(true);
    let thumbnailSrc = '';

    const contentArr = await Promise.all(
      content.map(async (item) => {
        if (item.kind === 'image') {
          if (item.fileData) {
            const imageSrc = await uploadFile(item.fileData);
            return { ...item, imageSrc };
          } else {
            return item;
          }
        } else {
          return item;
        }
      })
    );

    if (thumbnail && thumbnail.imageSrc) {
      thumbnailSrc = thumbnail.imageSrc;
    } else if (thumbnail && thumbnail.fileData) {
      const imageSrc = await uploadFile(thumbnail.fileData);
      thumbnailSrc = imageSrc;
    }

    const newValue = {
      title: titleValue,
      description: descriptionValue,
      content: contentArr,
      visible: isPublic,
      avatar: user?.avatar,
      tagArr: tagArr,
      categoryArr: categoryArr,
      toolArr: toolArr,
      thumbnail: thumbnailSrc,
      isDraft: true,
      projectId: +project_id,
      linkURL: linkURLValue,
      ownerArr: [
        { name: user?.name, avatar: user?.avatar, id: user?.id },
        ...ownerArr,
      ],
    };

    uploadProjects(newValue);
  };

  const onUserClick = (e: React.MouseEvent, item: UserDataProps) => {
    if (ownerValue === '' || ownerArr.length >= 10) return;
    const isOverlap = ownerArr.find((ele) => ele.id === item.id);
    if (isOverlap) return;
    setOwnerArr((prev) => {
      const newOnwer = [...prev, item];
      return newOnwer;
    });
    setValue('owner', '');
  };

  const onPreviewClick = () => {
    setIsPreview((prev) => !prev);
  };

  useEffect(() => {
    if (detailData && detailData.project.owner.length > 0) {
      router.push(`/gallery/${detailData.project.id}`);
    }
  }, [detailData]);

  useEffect(() => {
    if (data && data.ok && !isDraft && data.project) {
      setFinishProjectId(data.project.id);
    } else if (data && data.ok && isDraft && data.project) {
      setIsDraft(false);
      router.replace(
        '/portfolio/editor',
        `/portfolio/editor?project_id=${data.project.id}`,
        { shallow: true }
      );
    }
  }, [data]);

  useEffect(() => {
    document.addEventListener(
      'keydown',
      function (event) {
        if (event.keyCode === 13) {
          if (!event.shiftKey) {
            event.preventDefault();
          }
        }
      },
      true
    );
  }, []);

  useEffect(() => {
    if (!thumbnail?.imageSrc && !thumbnail?.fileData) {
      setError('thumbnail', {
        type: 'required',
        message: '표지 이미지가 필요합니다.',
      });
    } else {
      clearErrors('thumbnail');
    }
  }, [thumbnail, isDraft]);

  useEffect(() => {
    if (!content.length) {
      setError('content', {
        type: 'required',
        message:
          '프로젝트를 게시하려면 적어도 하나의 콘텐츠를 추가해 주십시오.',
      });
    } else {
      clearErrors('content');
    }
  }, [content]);

  useEffect(() => {
    if (categoryArr.length === 0) {
      setError('category', {
        type: 'required',
        message:
          '프로젝트를 게시하려면 적어도 하나의 카테고리를 추가해 주십시오.',
      });
    } else {
      clearErrors('category');
    }
  }, [categoryArr, categoryValue]);

  useEffect(() => {
    if (editProjectData && editProjectData.ok) {
      setCategoryArr(() => {
        const newArr = editProjectData.project.category.map(
          (item) => item.name
        );

        return newArr;
      });

      setValue('linkURL', editProjectData.project.linkURL);
      setValue('title', editProjectData.project.title);

      setValue('description', editProjectData.project.description);

      setContent(() => {
        const newArr = editProjectData.project.contents.map((item) => {
          return {
            alignText: item.alignText,
            language: item.language,
            fontSize: item.fontSize,
            description: item.description,
            imageSrc: item.imageSrc,
            kind: item.kind,
            id: item.id.toString(),
          };
        });

        return newArr;
      });

      if (editProjectData && editProjectData.project.thumbnail.length > 0) {
        setThumbnail({
          description: '',
          imageSrc: editProjectData.project.thumbnail,
        });
      }

      setTagArr(editProjectData.project.tags.map((item) => item.name));
      setToolArr(editProjectData.project.tools.map((item) => item.name));

      setOwnerArr((prev) => {
        const newArr: UserDataProps[] = [];
        editProjectData.project.owner.forEach((item) => {
          if (item.userId === user?.id) return;
          newArr.push({
            name: item.user.name,
            avatar: item.user.avatar,
            id: item.userId,
          });
        });
        return newArr;
      });

      setIsPublic(editProjectData.project.visible);
    }
  }, [editProjectData]);

  return {
    user,
    isSubmitLoading,
    isUpload,
    loadingImg,
    handleSubmit,
    onValid,
    content,
    register,
    onPreviewImage,
    onAddTextArea,
    onAddCodeArea,
    onClearAttachment,
    setContent,
    onChange,
    isDraft,
    onSetting,
    onDraftClick,
    onPreviewClick,
    isSetting,
    isThumbnailLoading,
    thumbnail,
    onThumbnailImage,
    onUserClick,
    userData,
    categoryArr,
    toolArr,
    tagArr,
    onKeyPress,
    errors,
    isVisible,
    isPublic,
    onPublicClick,
    onVisibleClick,
    deleteContentTags,
    onAddYoutubeArea,
    ownerArr,
    isPreview,
    titleValue,
    descriptionValue,
    handleYoutubeEmbed,
  };
};
