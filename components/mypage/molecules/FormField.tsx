import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormFieldProps = ComponentProps<"input"> & { id: string; label: string };

export default function FormField({ id, label, ...inputProps }: FormFieldProps) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-xs text-stone-500">
        {label}
      </Label>
      <Input id={id} name={id} {...inputProps} />
    </div>
  );
}
