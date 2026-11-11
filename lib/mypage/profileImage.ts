// Vercel 함수 요청 본문 4.5MB 제한과 multipart 오버헤드를 고려해 4MB로 둔다
export const MAX_PROFILE_IMAGE_BYTES = 4 * 1024 * 1024;
export const PROFILE_IMAGE_TYPES = ["image/png", "image/jpeg"];
export const PROFILE_IMAGE_TYPE_ERROR = "JPG, PNG 이미지만 올릴 수 있어요";
export const PROFILE_IMAGE_SIZE_ERROR = "4MB 이하로 올려 주세요";

const MAX_DATA_URL_LENGTH = Math.ceil((MAX_PROFILE_IMAGE_BYTES * 4) / 3) + 64;
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const JPEG_SIGNATURE = [0xff, 0xd8, 0xff];

const startsWith = (bytes: Uint8Array, signature: number[]) =>
  signature.every((byte, index) => bytes[index] === byte);

// 클라이언트가 보낸 MIME 타입은 믿지 않고 파일 앞 바이트(매직 넘버)로 판별한다
export function detectImageType(bytes: Uint8Array): "image/png" | "image/jpeg" | null {
  if (startsWith(bytes, PNG_SIGNATURE)) return "image/png";
  if (startsWith(bytes, JPEG_SIGNATURE)) return "image/jpeg";
  return null;
}

export function toProfileImageDataUrl(bytes: Uint8Array): { dataUrl: string } | { error: string } {
  if (bytes.length > MAX_PROFILE_IMAGE_BYTES) return { error: PROFILE_IMAGE_SIZE_ERROR };
  const type = detectImageType(bytes);
  if (!type) return { error: PROFILE_IMAGE_TYPE_ERROR };
  const dataUrl = `data:${type};base64,${Buffer.from(bytes).toString("base64")}`;
  if (dataUrl.length > MAX_DATA_URL_LENGTH) return { error: PROFILE_IMAGE_SIZE_ERROR };
  return { dataUrl };
}
