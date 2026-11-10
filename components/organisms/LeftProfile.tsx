export default function LeftProfile() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-xl bg-[#FDF2F5] text-[#A50034] flex items-center justify-center shrink-0">
        {/*<User className="w-4 h-4" />*/}
      </div>
      <div>
        <h2 className="text-sm sm:text-base font-bold text-stone-900">내 프로필 및 기본 정보</h2>

        <p className="text-xs text-stone-500">
          프로필 사진, 닉네임, 아이디, 이메일 및 외부 링크를 관리합니다
        </p>
      </div>
    </div>
  );
}
