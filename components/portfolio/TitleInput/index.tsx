export default function TitleInput() {
  return (
    <input
      className="border w-full text-xl md:text-2xl p-2"
      placeholder="제목을 입력해주세요"
      maxLength={100}
    />
  );
}
