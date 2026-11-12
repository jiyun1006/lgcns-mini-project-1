// 셀프체크: node lib/mypage/validatePassword.check.mjs (Node 22.18+ 타입 스트리핑 필요)
import assert from "node:assert/strict";
import { validatePasswordChange as check } from "./validatePassword.ts";

const valid = {
  currentPassword: "oldpass12",
  newPassword: "newpass12",
  confirmPassword: "newpass12",
};

assert.equal(check(valid), null);
assert.match(check({ ...valid, currentPassword: "" }), /모든 항목/);
assert.match(check({ ...valid, confirmPassword: "" }), /모든 항목/);
assert.match(check({ ...valid, newPassword: "short1", confirmPassword: "short1" }), /8자 이상/);
assert.equal(check({ ...valid, newPassword: "12345678", confirmPassword: "12345678" }), null);
assert.match(check({ ...valid, confirmPassword: "newpass13" }), /일치하지/);
assert.match(check({ ...valid, currentPassword: "newpass12" }), /다른 비밀번호/);

console.log("validatePasswordChange 셀프체크 통과");
