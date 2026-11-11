export type ChatMessage = {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt: string;
};

// 대화방 (목록 조회 시에는 messages 없음, 단건 조회/생성 시에만 포함)
export type Conversation = {
  id: string;
  title: string;
  messages?: ChatMessage[];
  createdAt: string;
  updatedAt: string;
};
