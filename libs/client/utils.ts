import { CFImageResult } from 'pages/portfolio/editor';

export function cls(...classnames: string[]) {
  return classnames.join(' ');
}

export function makeImageURL(id: string) {
  if (!id)
    return 'https://d3319kcxpye19t.cloudfront.net/images/f0787368-2456-4b9e-6ae4-a8841f70b300.jpg';

  if (id.match(/\.\w+$/)) {
    return `https://d3319kcxpye19t.cloudfront.net/images/${id}`;
  }

  return `https://d3319kcxpye19t.cloudfront.net/images/${id}.jpg`;
}

export function timeConverter(time: Date) {
  const converterTime = new Date(time);
  const year = converterTime.getFullYear();
  const month = converterTime.getMonth() + 1;
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
    return '방금';
  } else if (betweenTime < 60) {
    return `${betweenTime}분 전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);

  if (betweenTimeHour === 1) {
    return '한 시간 전';
  }
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간 전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);

  if (betweenTimeDay === 1) {
    return '하루 전';
  }

  if (betweenTimeDay < 30) {
    return `${betweenTimeDay}일 전`;
  }

  const betweenTimeMonth = Math.floor(betweenTime / 60 / 24 / 30);

  if (betweenTimeMonth === 1) {
    return '한달 전';
  }

  if (betweenTimeMonth < 12) {
    return `${betweenTimeMonth}달 전`;
  }

  const betweenTimeYear = Math.floor(betweenTime / 60 / 24 / 30 / 12);

  if (betweenTimeYear === 1) {
    return '일 년 전';
  }

  return `${betweenTimeYear}년 전`;
}

export const cfImageUpload = async (file: File) => {
  const { uploadURL } = await (await fetch('/api/files')).json();

  const form = new FormData();
  form.append('file', file);

  const {
    result: { id },
  }: CFImageResult = await (
    await fetch(uploadURL, {
      method: 'POST',
      body: form,
    })
  ).json();

  return id;
};

export const uploadFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      if (reader.result) {
        try {
          const base64data = (reader.result as string).split(',')[1];

          const res = await fetch('/api/files', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              file: base64data,
              name: file.name,
              type: file.type,
            }),
          });

          const data = await res.json();

          if (res.ok) {
            resolve(data.id); // 성공 시 파일 ID 반환
          } else {
            reject(
              new Error(`Upload failed: ${data.error || 'Unknown error'}`)
            );
          }
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error('FileReader result is null'));
      }
    };

    reader.onerror = () => reject(new Error('File reading failed'));
  });
};

export function parseJwt(token: string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}
