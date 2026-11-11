// 셀프체크: node lib/mypage/profileImage.check.mjs (Node 22.18+ 타입 스트리핑 필요)
import assert from "node:assert/strict";
import {
  MAX_PROFILE_IMAGE_BYTES,
  detectImageType,
  toProfileImageDataUrl,
} from "./profileImage.ts";

const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3]);
const jpeg = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 1, 2]);
const gif = new TextEncoder().encode("GIF89a....");
const html = new TextEncoder().encode("<svg onload=alert(1)>");

assert.equal(detectImageType(png), "image/png");
assert.equal(detectImageType(jpeg), "image/jpeg");
assert.equal(detectImageType(gif), null);
assert.equal(detectImageType(html), null);
assert.equal(detectImageType(new Uint8Array()), null);
assert.equal(detectImageType(png.slice(0, 7)), null); // 시그니처가 잘린 파일

assert.match(toProfileImageDataUrl(png).dataUrl, /^data:image\/png;base64,iVBORw0KGgo/);
assert.match(toProfileImageDataUrl(jpeg).dataUrl, /^data:image\/jpeg;base64,/);
assert.match(toProfileImageDataUrl(gif).error, /JPG, PNG/);

// 경계값: 정확히 4MB는 통과, 1바이트 넘으면 거절
const atLimit = new Uint8Array(MAX_PROFILE_IMAGE_BYTES);
atLimit.set(jpeg);
assert.ok(toProfileImageDataUrl(atLimit).dataUrl);
const overLimit = new Uint8Array(MAX_PROFILE_IMAGE_BYTES + 1);
overLimit.set(jpeg);
assert.match(toProfileImageDataUrl(overLimit).error, /4MB/);

console.log("profileImage 셀프체크 통과");
