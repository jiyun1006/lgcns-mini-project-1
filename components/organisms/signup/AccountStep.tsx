import PasswordField from "@/components/molecules/PasswordField";
import PasswordStrength from "@/components/molecules/PasswordStrength";
import TextField from "@/components/molecules/TextField";
import type { SignupValues, UpdateSignupValue } from "@/components/organisms/SignupForm";
import { describeCheck, type AvailabilityCheck } from "@/hooks/useAvailabilityCheck";
import { validateEmail, validatePassword, validatePasswordConfirm } from "@/lib/validation/auth";

type AccountStepProps = {
  values: SignupValues;
  onChange: UpdateSignupValue;
  emailCheck: AvailabilityCheck;
  showErrors: boolean;
};

export default function AccountStep({
  values,
  onChange,
  emailCheck,
  showErrors,
}: AccountStepProps) {
  const emailView =
    showErrors && !values.email
      ? { tone: "error" as const, message: validateEmail(values.email) }
      : describeCheck(emailCheck, {
          idle: "로그인 아이디로 써요. 비밀번호를 찾을 때 보안키도 이 메일로 와요",
          ok: "사용할 수 있는 이메일이에요",
          taken: "이미 가입된 이메일이에요",
        });
  const passwordError = showErrors ? validatePassword(values.password) : "";
  const confirmError =
    values.passwordConfirm || showErrors
      ? validatePasswordConfirm(values.password, values.passwordConfirm)
      : "";
  const isConfirmOk = values.passwordConfirm !== "" && !confirmError;

  return (
    <fieldset className="flex flex-col gap-[18px]">
      <legend className="mb-[18px] text-[19px] font-bold">계정 정보</legend>

      <TextField
        id="signup-email"
        type="email"
        label="이메일 (로그인 아이디)"
        autoComplete="email"
        placeholder="example@email.com"
        value={values.email}
        onChange={(e) => onChange("email", e.target.value.trim())}
        tone={emailView.tone}
        message={emailView.message}
      />

      <PasswordField
        id="signup-password"
        label="비밀번호"
        autoComplete="new-password"
        value={values.password}
        onChange={(e) => onChange("password", e.target.value)}
        tone={passwordError ? "error" : "default"}
        message={passwordError}
        bottomSlot={<PasswordStrength password={values.password} />}
      />

      <PasswordField
        id="signup-passwordConfirm"
        label="비밀번호 확인"
        autoComplete="new-password"
        value={values.passwordConfirm}
        onChange={(e) => onChange("passwordConfirm", e.target.value)}
        tone={confirmError ? "error" : isConfirmOk ? "success" : "default"}
        message={confirmError || (isConfirmOk ? "비밀번호가 일치해요" : "")}
      />
    </fieldset>
  );
}
