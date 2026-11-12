// 셀프체크: node lib/mypage/validateIntro.check.mjs (Node 22.18+ 타입 스트리핑 필요)
import assert from "node:assert/strict";
import { normalizeInterests, validateIntro } from "./validateIntro.ts";

assert.deepEqual(normalizeInterests([" 등산 ", "", "  ", "등산", "독서"]), ["등산", "독서"]);

assert.deepEqual(validateIntro("", []), {});
assert.deepEqual(validateIntro("가".repeat(149), ["등산"]), {});
assert.match(validateIntro("가".repeat(150), []).bio, /149자/);

assert.deepEqual(validateIntro("", ["가".repeat(15)]), {});
assert.match(validateIntro("", ["가".repeat(16)]).interests, /하나는/);
assert.match(validateIntro("", Array.from({ length: 11 }, (_, i) => `t${i}`)).interests, /10개/);
// 15자 x 4 + 14자 = 74자는 통과, 75자는 거절
assert.deepEqual(validateIntro("", [..."abcd"].map((c) => c.repeat(15)).concat("e".repeat(14))), {});
assert.match(
  validateIntro("", [..."abcde"].map((c) => c.repeat(15))).interests,
  /모두 합쳐/,
);

console.log("validateIntro 셀프체크 통과");
