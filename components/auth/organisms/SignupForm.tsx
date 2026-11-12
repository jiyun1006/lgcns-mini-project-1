"use client";

import Link from "next/link";
import { useState } from "react";

import Button from "@/components/auth/atoms/Button";
import SignupProgress from "@/components/auth/molecules/SignupProgress";
import AccountStep from "@/components/auth/organisms/signup/AccountStep";
import DoneStep, { DoneStepAction } from "@/components/auth/organisms/signup/DoneStep";
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
import "@/components/design/skins/auth.css";

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
  // 단계 내용이 들어오는 방향: 다음은 오른쪽에서, 이전은 왼쪽에서 (처음 화면은 움직이지 않음)
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);

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
    setDirection("prev");
    setStep((prev) => Math.max(1, prev - 1));
  };

  const goNext = async () => {
    if (!canLeaveStep(step)) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    if (step < 3) {
      setDirection("next");
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
      setDirection("next");
      setStep(4);
    } catch {
      setFormError("서버와 연결되지 않았어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void goNext();
      }}
      noValidate
      className="ds-auth-signup-card"
    >
      <div className="ds-auth-signup-top">
        <h1>회원가입</h1>
        <SignupProgress current={step} />
      </div>

      <div className="ds-auth-signup-body">
        <div
          key={step}
          className={
            direction === "next"
              ? "ds-auth-slide-next"
              : direction === "prev"
                ? "ds-auth-slide-prev"
                : undefined
          }
        >
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
        </div>
      </div>

      <div className="ds-auth-signup-foot">
        <p role="alert" className="ds-auth-foot-error">
          {formError}
        </p>
        {step < 4 ? (
          <div className="flex gap-2.5">
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
        ) : (
          <DoneStepAction needsApproval={needsApproval} />
        )}
        <p
          className="ds-auth-foot-login"
          data-hidden={step === 4 || undefined}
          aria-hidden={step === 4 || undefined}
        >
          이미 계정이 있으신가요?{" "}
          <Link href="/login" tabIndex={step === 4 ? -1 : undefined}>
            로그인
          </Link>
        </p>
      </div>
    </form>
  );
}
