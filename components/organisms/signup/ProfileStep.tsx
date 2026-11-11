import AvatarPicker from "@/components/molecules/AvatarPicker";
import TagInput from "@/components/molecules/TagInput";
import TextField from "@/components/molecules/TextField";
import type { SignupValues, UpdateSignupValue } from "@/components/organisms/SignupForm";
import { describeCheck, type AvailabilityCheck } from "@/hooks/useAvailabilityCheck";
import { NICKNAME_RULE } from "@/lib/validation/auth";

type ProfileStepProps = {
  values: SignupValues;
  onChange: UpdateSignupValue;
  nicknameCheck: AvailabilityCheck;
  showErrors: boolean;
};

export default function ProfileStep({
  values,
  onChange,
  nicknameCheck,
  showErrors,
}: ProfileStepProps) {
  const nicknameView =
    showErrors && !values.nickname.trim()
      ? { tone: "error" as const, message: "닉네임을 입력해 주세요." }
      : describeCheck(nicknameCheck, {
          idle: NICKNAME_RULE,
          ok: "사용할 수 있는 닉네임이에요",
          taken: "이미 사용 중인 닉네임이에요",
        });

  return (
    <fieldset className="flex flex-col gap-5">
      <legend className="mb-5 text-[19px] font-bold">프로필 설정</legend>
      <div className="flex items-start gap-[18px]">
        <AvatarPicker
          initial={values.nickname.trim().slice(0, 1)}
          previewUrl={values.photoPreviewUrl}
          onChange={(url) => onChange("photoPreviewUrl", url)}
        />
        <TextField
          id="signup-nickname"
          label="닉네임"
          className="min-w-0 flex-1"
          value={values.nickname}
          onChange={(e) => onChange("nickname", e.target.value)}
          tone={nicknameView.tone}
          message={nicknameView.message}
        />
      </div>
      <span className="-mt-2.5 text-[12px] text-[#52525B]">
        동그라미를 눌러 프로필 사진을 올려요 · 선택 사항
      </span>
      <TagInput
        id="signup-interests"
        tags={values.interests}
        onChange={(tags) => onChange("interests", tags)}
      />
    </fieldset>
  );
}
