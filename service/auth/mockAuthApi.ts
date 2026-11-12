import type { AuthApi } from "./authApi";

// 진짜 서버처럼 조금 기다렸다가 답해요
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 이미 가입된 척하는 목록
const takenEmails = ["test@test.com", "admin@test.com"];
const takenNicknames = ["관리자", "테스트"];
const takenLoginIds = ["admin", "test"];

export const mockAuthApi: AuthApi = {
  async login({ email, password }) {
    await wait(800);
    // 시험용 스위치: 이메일에 network@test.com을 넣으면 "연결 실패"를 볼 수 있어요
    if (email === "network@test.com") throw new Error("network");
    if (email === "test@test.com" && password === "test1234!") return { ok: true, data: null };
    return { ok: false, message: "이메일 또는 비밀번호가 틀렸어요. 다시 확인해 주세요." };
  },

  async checkEmail(email) {
    await wait(400);
    return { ok: true, data: { available: !takenEmails.includes(email.trim().toLowerCase()) } };
  },

  async checkNickname(nickname) {
    await wait(400);
    return { ok: true, data: { available: !takenNicknames.includes(nickname.trim()) } };
  },

  async checkLoginId(loginId) {
    await wait(400);
    return { ok: true, data: { available: !takenLoginIds.includes(loginId.trim()) } };
  },

  async signup(input) {
    await wait(1000);
    if (input.email.startsWith("network")) throw new Error("network");
    if (takenEmails.includes(input.email.trim().toLowerCase())) {
      return { ok: false, message: "이미 가입된 이메일이에요." };
    }
    // 시험용 스위치: 이메일이 wait로 시작하면 "승인 대기" 화면을 볼 수 있어요
    return { ok: true, data: { needsApproval: input.email.startsWith("wait") } };
  },
};
