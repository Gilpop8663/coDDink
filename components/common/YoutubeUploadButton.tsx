import { useState } from 'react';

export default function YoutubeUploadButton({
  onEmbed,
}: {
  onEmbed: (embedCode: string) => void;
}) {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showInput, setShowInput] = useState(false);

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
    const embedCode = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;

    onEmbed(embedCode); // 부모 컴포넌트에 임베드 코드 전달
    setYoutubeUrl('');
    setShowInput(false);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setShowInput(!showInput)}
        className="flex items-center justify-center rounded-full bg-blue-100 p-4 text-blue-600 transition duration-200 hover:bg-blue-600 hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
      </button>

      {showInput && (
        <div className="mt-2 flex flex-col items-center">
          <input
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="유튜브 링크 입력"
            className="w-72 rounded border p-2"
          />
          <button
            onClick={handleEmbed}
            className="mt-2 rounded bg-blue-500 px-4 py-2 text-white"
          >
            추가하기
          </button>
        </div>
      )}
    </div>
  );
}
