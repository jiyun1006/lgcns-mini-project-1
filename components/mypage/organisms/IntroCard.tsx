"use client";

import { useActionState, useState, type KeyboardEvent } from "react";
import { Plus, Save, Sparkles, X } from "lucide-react";
import { MyPageButton } from "@/components/mypage/atoms/MyPageButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateIntro } from "@/app/myPage/actions";
import { MAX_BIO_LENGTH, normalizeInterests, validateIntro } from "@/lib/mypage/validateIntro";
import type { IntroFormState } from "@/types/mypage";

type IntroCardProps = { bio: string; interests: string[] };

export default function IntroCard({
  bio: initialBio,
  interests: initialInterests,
}: IntroCardProps) {
  const [bio, setBio] = useState(initialBio);
  const [interests, setInterests] = useState(initialInterests);
  const [tagInput, setTagInput] = useState("");
  const [tagError, setTagError] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState(updateIntro, {} as IntroFormState);
  const bioError = state.errors?.bio;
  const interestsError = tagError ?? state.errors?.interests;

  const addTag = () => {
    const next = normalizeInterests([...interests, tagInput]);
    if (next.length === interests.length) {
      setTagError(tagInput.trim() ? "이미 추가한 관심사입니다." : null);
      return;
    }
    const error = validateIntro(bio, next).interests;
    setTagError(error ?? null);
    if (error) return;
    setInterests(next);
    setTagInput("");
  };

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
    event.preventDefault(); // Enter로 폼이 제출되지 않고 태그만 추가
    addTag();
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 font-bold text-stone-900">
          <span className="flex size-8 items-center justify-center rounded-xl bg-board-accent-soft text-board-accent">
            <Sparkles className="size-4" />
          </span>
          자기소개 및 관심사
        </CardTitle>
        <CardDescription>다른 사람에게 보여 줄 자기소개와 관심사를 적습니다</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="bio" className="text-xs text-stone-500">
              자기소개
            </Label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              maxLength={MAX_BIO_LENGTH}
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              aria-invalid={!!bioError || undefined}
              aria-describedby={bioError ? "bio-count bio-error" : "bio-count"}
              className="w-full resize-none rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm"
              placeholder="나를 한 줄로 소개해 주세요"
            />
            <p id="bio-count" className="justify-self-end text-xs text-stone-500">
              {bio.length} / {MAX_BIO_LENGTH}
            </p>
            {bioError && (
              <p id="bio-error" role="alert" className="text-sm text-destructive">
                {bioError}
              </p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="interest-input" className="text-xs text-stone-500">
              관심사
            </Label>
            <div className="flex gap-2">
              <Input
                id="interest-input"
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={handleTagKeyDown}
                aria-invalid={!!interestsError || undefined}
                aria-describedby={interestsError ? "interests-error" : undefined}
                placeholder="예: 등산 (Enter로 추가)"
              />
              <MyPageButton type="button" variant="outline" onClick={addTag}>
                <Plus />
                추가
              </MyPageButton>
            </div>
            {interestsError && (
              <p id="interests-error" role="alert" className="text-sm text-destructive">
                {interestsError}
              </p>
            )}
            {interests.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {interests.map((tag) => (
                  <li
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-board-accent-soft py-0.5 pr-1 pl-3 text-sm text-board-accent"
                  >
                    {tag}
                    <input type="hidden" name="interests" value={tag} />
                    <button
                      type="button"
                      aria-label={`${tag} 삭제`}
                      onClick={() => setInterests(interests.filter((item) => item !== tag))}
                      className="rounded-full p-0.5 hover:bg-board-accent/10"
                    >
                      <X className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {state.ok && (
            <p role="status" className="text-sm text-green-700">
              저장되었습니다.
            </p>
          )}
          <MyPageButton type="submit" disabled={pending} className="justify-self-end">
            <Save />
            저장
          </MyPageButton>
        </form>
      </CardContent>
    </Card>
  );
}
