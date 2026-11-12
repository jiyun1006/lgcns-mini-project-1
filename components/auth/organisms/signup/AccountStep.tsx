import PasswordField from "@/components/auth/molecules/PasswordField";
import PasswordStrength from "@/components/auth/molecules/PasswordStrength";
import TextField from "@/components/auth/molecules/TextField";
import type { SignupValues, UpdateSignupValue } from "@/components/auth/organisms/SignupForm";
import { describeCheck, type AvailabilityCheck } from "@/hooks/useAvailabilityCheck";
import {
  LOGIN_ID_RULE,
  validateEmail,
  validateLoginId,
  validatePassword,
  validatePasswordConfirm,
} from "@/lib/validation/auth";

type AccountStepProps = {
  values: SignupValues;
  onChange: UpdateSignupValue;
  loginIdCheck: AvailabilityCheck;
  emailCheck: AvailabilityCheck;
  showErrors: boolean;
};

export default function AccountStep({
  values,
  onChange,
  loginIdCheck,
  emailCheck,
  showErrors,
}: AccountStepProps) {
  const loginIdView =
    showErrors && !values.loginId
      ? { tone: "error" as const, message: validateLoginId(values.loginId) }
      : describeCheck(loginIdCheck, {
          idle: LOGIN_ID_RULE,
          ok: "사용할 수 있는 아이디예요",
          taken: "이미 사용 중인 아이디예요",
        });
  const emailView =
    showErrors && !values.email
      ? { tone: "error" as const, message: validateEmail(values.email) }
      : describeCheck(emailCheck, {
          idle: "로그인에도 쓸 수 있어요. 비밀번호를 찾을 때 보안키가 이 메일로 와요",
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
    <fieldset className="flex flex-col gap-4.5">
      <legend className="mb-4.5 text-[19px] font-bold">계정 정보</legend>

      <TextField
        id="signup-loginId"
        label="아이디"
        autoComplete="username"
        placeholder="영문 소문자·숫자·_"
        value={values.loginId}
        onChange={(e) => onChange("loginId", e.target.value.trim().toLowerCase())}
        onClear={() => onChange("loginId", "")}
        tone={loginIdView.tone}
        message={loginIdView.message}
      />

      <TextField
        id="signup-email"
        type="email"
        label="이메일"
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
        onClear={() => onChange("password", "")}
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
        onClear={() => onChange("passwordConfirm", "")}
        tone={confirmError ? "error" : isConfirmOk ? "success" : "default"}
        message={confirmError || (isConfirmOk ? "비밀번호가 일치해요" : "")}
      />
    </fieldset>
  );
}
