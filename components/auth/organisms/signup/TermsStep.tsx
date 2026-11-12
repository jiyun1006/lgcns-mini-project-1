const TERMS = [
  { label: "이용약관 동의", required: true },
  { label: "개인정보 수집·이용 동의", required: true },
  { label: "만 14세 이상이에요", required: true },
  { label: "마케팅 정보 이메일 수신", required: false },
];

type TermsStepProps = {
  terms: boolean[];
  onChange: (terms: boolean[]) => void;
  showError: boolean;
};

export default function TermsStep({ terms, onChange, showError }: TermsStepProps) {
  const isAllAgreed = terms.every(Boolean);
  const isRequiredAgreed = terms.slice(0, 3).every(Boolean);

  return (
    <fieldset className="flex flex-col gap-3.5">
      <legend className="mb-3.5 text-[19px] font-bold">약관에 동의해 주세요</legend>
      <label className="flex cursor-pointer items-center gap-2.5 rounded-[10px] bg-[#F4F4F5] p-3.5 text-[15px] font-bold">
        <input
          type="checkbox"
          checked={isAllAgreed}
          onChange={() => onChange(terms.map(() => !isAllAgreed))}
          className="h-5 w-5 accent-[#4338CA]"
        />
        전체 동의
      </label>
      {TERMS.map((term, index) => (
        <label
          key={term.label}
          className="flex min-h-11 cursor-pointer items-center gap-2.5 px-3.5 text-[14px]"
        >
          <input
            type="checkbox"
            checked={terms[index]}
            onChange={() => onChange(terms.map((value, i) => (i === index ? !value : value)))}
            className="h-4.5 w-4.5 accent-[#4338CA]"
          />
          <span className={`font-bold ${term.required ? "text-[#3730A3]" : "text-[#52525B]"}`}>
            {term.required ? "(필수)" : "(선택)"}
          </span>
          {term.label}
        </label>
      ))}
      {showError && !isRequiredAgreed ? (
        <p role="alert" className="text-[13px] font-semibold text-[#B91C1C]">
          필수 약관에 모두 동의해 주세요.
        </p>
      ) : null}
    </fieldset>
  );
}
