import { useState } from 'react';

export default function YoutubeUploadButton({
  idx,
  onClearAttachment,
  onEmbed,
}: {
  idx: number;
  onClearAttachment: (idx: number) => void;
  onEmbed: (embedCode: string, idx: number) => void;
}) {
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const handleEmbed = () => {
    if (
      !youtubeUrl.includes('youtube.com') &&
      !youtubeUrl.includes('youtu.be')
    ) {
      alert('유효한 유튜브 링크를 입력해주세요.');
      return;
    }

    // 유튜브 URL에서 영상 ID 추출
    const videoId =
      youtubeUrl.split('v=')[1]?.split('&')[0] ||
      youtubeUrl.split('youtu.be/')[1];
    const embedCode = `https://www.youtube.com/embed/${videoId}`;

    onEmbed(embedCode, idx); // 부모 컴포넌트에 임베드 코드 전달
    setYoutubeUrl('');
  };

  return (
    <div className="mt-2 flex flex-col items-center">
      <input
        type="text"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
        placeholder="유튜브 링크 입력"
        className="w-72 rounded border p-2"
      />
      <div className="flex justify-between gap-4">
        <button
          onClick={() => onClearAttachment(idx)}
          className="mt-2 rounded bg-gray-700 px-4 py-2 text-white"
        >
          취소하기
        </button>
        <button
          onClick={handleEmbed}
          className="mt-2 rounded bg-blue-500 px-4 py-2 text-white"
        >
          추가하기
        </button>
      </div>
    </div>
  );
}
