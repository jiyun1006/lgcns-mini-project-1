"use client";

import { useState } from "react";

import Alert from "@/components/auth/atoms/Alert";
import Button from "@/components/auth/atoms/Button";
import SignupProgress from "@/components/auth/molecules/SignupProgress";
import AccountStep from "@/components/auth/organisms/signup/AccountStep";
import DoneStep from "@/components/auth/organisms/signup/DoneStep";
import ProfileStep from "@/components/auth/organisms/signup/ProfileStep";
import TermsStep from "@/components/auth/organisms/signup/TermsStep";
import { useAvailabilityCheck } from "@/hooks/useAvailabilityCheck";
import {
  validateEmail,
  validateLoginId,
  validateNickname,
  validatePassword,
  validatePasswordConfirm,
} from "@/lib/validation/auth";
import { authApi } from "@/service/auth/authApi";

export type SignupValues = {
  terms: boolean[];
  loginId: string;
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  interests: string[];
  photoPreviewUrl: string;
};

export type UpdateSignupValue = <K extends keyof SignupValues>(
  key: K,
  value: SignupValues[K],
) => void;

const initialValues: SignupValues = {
  terms: [false, false, false, false],
  loginId: "",
  email: "",
  password: "",
  passwordConfirm: "",
  nickname: "",
  interests: [],
  photoPreviewUrl: "",
};

export default function SignupForm() {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<SignupValues>(initialValues);
  const [showErrors, setShowErrors] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsApproval, setNeedsApproval] = useState(false);

  const loginIdCheck = useAvailabilityCheck(values.loginId, validateLoginId, authApi.checkLoginId);
  const emailCheck = useAvailabilityCheck(values.email, validateEmail, authApi.checkEmail);
  const nicknameCheck = useAvailabilityCheck(
    values.nickname,
    validateNickname,
    authApi.checkNickname,
  );

  const update: UpdateSignupValue = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setFormError("");
  };

  const canLeaveStep = (current: number) => {
    if (current === 1) return values.terms.slice(0, 3).every(Boolean);
    if (current === 2) {
      return (
        loginIdCheck.status === "ok" &&
        emailCheck.status === "ok" &&
        !validatePassword(values.password) &&
        !validatePasswordConfirm(values.password, values.passwordConfirm)
      );
    }
    if (current === 3) return nicknameCheck.status === "ok";
    return true;
  };

  const goPrev = () => {
    setShowErrors(false);
    setFormError("");
    setStep((prev) => Math.max(1, prev - 1));
  };

  const goNext = async () => {
    if (!canLeaveStep(step)) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await authApi.signup({
        loginId: values.loginId,
        email: values.email.trim().toLowerCase(),
        password: values.password,
        nickname: values.nickname.trim(),
        interests: values.interests,
        marketingAgreed: values.terms[3],
      });
      if (!result.ok) {
        setFormError(result.message);
        return;
      }
      setNeedsApproval(result.data.needsApproval);
      setStep(4);
    } catch {
      setFormError("서버와 연결되지 않았어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full max-w-130 flex-col gap-5">
      <h1 className="text-center text-[26px] font-extrabold">회원가입</h1>
      <SignupProgress current={step} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void goNext();
        }}
        noValidate
        className="flex flex-col gap-4.5 rounded-2xl border border-[#E4E4E7] bg-white p-8"
      >
        {formError ? <Alert>{formError}</Alert> : null}

        {step === 1 ? (
          <TermsStep
            terms={values.terms}
            onChange={(terms) => update("terms", terms)}
            showError={showErrors}
          />
        ) : null}
        {step === 2 ? (
          <AccountStep
            values={values}
            onChange={update}
            loginIdCheck={loginIdCheck}
            emailCheck={emailCheck}
            showErrors={showErrors}
          />
        ) : null}
        {step === 3 ? (
          <ProfileStep
            values={values}
            onChange={update}
            nicknameCheck={nicknameCheck}
            showErrors={showErrors}
          />
        ) : null}
        {step === 4 ? (
          <DoneStep nickname={values.nickname.trim()} needsApproval={needsApproval} />
        ) : null}

        {step < 4 ? (
          <div className="flex gap-2.5 border-t border-[#F0F0F2] pt-4.5">
            <Button
              variant="secondary"
              onClick={goPrev}
              disabled={step === 1 || isSubmitting}
              className="flex-1"
            >
              이전
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText="가입하는 중…"
              className="flex-2"
            >
              {step === 3 ? "가입하기" : "다음"}
            </Button>
          </div>
        ) : null}
      </form>
    </div>
  );
}
