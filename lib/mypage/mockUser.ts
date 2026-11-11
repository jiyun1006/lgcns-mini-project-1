import type { MyPageUser } from "@/types/mypage";
// TODO: 세션의 사용자 id로 Prisma User를 조회하여 MyPageUser로 변환하여 전달합니다.
export const mockUser: MyPageUser = {
  nickname: "김민수",
  loginId: "aura_maker",
  email: "minsu.design@gmail.com",
  profileImageUrl: null,
};
