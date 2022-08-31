import { CFImageResult } from "pages/portfolio/editor";

export function cls(...classnames: string[]) {
  return classnames.join(" ");
}

interface makeImageURLProps {
  id: string | null;
  variants?: "public" | "bigAvatar" | "smAvatar";
}

export function makeImageURL(
  id: string,
  variants?: "public" | "bigAvatar" | "smAvatar" | "banner"
) {
  return `https://imagedelivery.net/mPhC7i6OFJEhfh-kdGX8yQ/${id}/${variants}`;
}

export function timeConverter(time: Date) {
  const converterTime = new Date(time);
  const year = converterTime.getFullYear();
  const month = converterTime.getMonth();
  const date = converterTime.getDate();
  return `${year}년 ${month}월 ${date}일`;
}

export function timeForToday(time: Date) {
  const pastTime = new Date(time);
  const curTime = new Date();

  const betweenTime = Math.floor(
    (curTime.getTime() - pastTime.getTime()) / 1000 / 60
  );

  if (betweenTime < 1) {
    return "방금";
  } else if (betweenTime < 60) {
    return `${betweenTime}분 전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);

  if (betweenTimeHour === 1) {
    return "한 시간 전";
  }
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간 전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);

  if (betweenTimeDay === 1) {
    return "하루 전";
  }

  if (betweenTimeDay < 30) {
    return `${betweenTimeDay}일 전`;
  }

  const betweenTimeMonth = Math.floor(betweenTime / 60 / 24 / 30);

  if (betweenTimeMonth === 1) {
    return "한달 전";
  }

  if (betweenTimeMonth < 12) {
    return `${betweenTimeMonth}달 전`;
  }

  const betweenTimeYear = Math.floor(betweenTime / 60 / 24 / 30 / 12);

  if (betweenTimeYear === 1) {
    return "일 년 전";
  }

  return `${betweenTimeYear}년 전`;
}

export const cfImageUpload = async (file: File) => {
  const { uploadURL } = await (await fetch("/api/files")).json();

  const form = new FormData();
  form.append("file", file);

  const {
    result: { id },
  }: CFImageResult = await (
    await fetch(uploadURL, {
      method: "POST",
      body: form,
    })
  ).json();

  return id;
};
