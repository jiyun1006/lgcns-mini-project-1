export const MAX_BIO_LENGTH = 149; // 기획: 150자 미만
export const MAX_INTEREST_LENGTH = 15;
export const MAX_INTERESTS = 10;
export const MAX_INTERESTS_TOTAL_LENGTH = 74; // 기획: 관심사 전체 75자 미만

// 앞뒤 공백 제거, 빈 태그·중복 태그 제거
export function normalizeInterests(interests: string[]): string[] {
  return [...new Set(interests.map((tag) => tag.trim()).filter(Boolean))];
}

// 통과하면 빈 객체, 아니면 항목별 오류 문구. interests는 normalizeInterests를 거친 값.
export function validateIntro(
  bio: string,
  interests: string[],
): { bio?: string; interests?: string } {
  const errors: { bio?: string; interests?: string } = {};
  if (bio.length > MAX_BIO_LENGTH)
    errors.bio = `자기소개는 ${MAX_BIO_LENGTH}자까지 쓸 수 있습니다.`;
  if (interests.length > MAX_INTERESTS)
    errors.interests = `관심사는 ${MAX_INTERESTS}개까지 추가할 수 있습니다.`;
  else if (interests.some((tag) => tag.length > MAX_INTEREST_LENGTH))
    errors.interests = `관심사 하나는 ${MAX_INTEREST_LENGTH}자까지 쓸 수 있습니다.`;
  else if (interests.join("").length > MAX_INTERESTS_TOTAL_LENGTH)
    errors.interests = `관심사는 모두 합쳐 ${MAX_INTERESTS_TOTAL_LENGTH}자까지 쓸 수 있습니다.`;
  return errors;
}
