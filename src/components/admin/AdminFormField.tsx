"use client";

import { useCallback, useId, useState } from "react";
import { adminFieldClass, adminInputBase, adminSelectBase, adminTextareaBase } from "@/lib/admin-form-styles";
import { cn } from "@/lib/utils";

type ValidateFn = (value: string) => boolean;

type AdminFormFieldProps = {
  label: string;
  name: string;
  required?: boolean;
  hint?: string;
  validate?: ValidateFn;
  className?: string;
} & (
  | {
      as?: "input";
      inputProps?: Omit<
        React.ComponentProps<"input">,
        "id" | "name" | "className" | "onBlur" | "onChange"
      >;
    }
  | {
      as: "textarea";
      inputProps?: Omit<
        React.ComponentProps<"textarea">,
        "id" | "name" | "className" | "onBlur" | "onChange"
      >;
    }
  | {
      as: "select";
      inputProps?: Omit<
        React.ComponentProps<"select">,
        "id" | "name" | "className" | "onBlur" | "onChange"
      >;
      children: React.ReactNode;
    }
);

function defaultValidate(value: string, required?: boolean) {
  if (required) return value.trim().length > 0;
  return value.trim().length === 0 || value.trim().length > 0;
}

export function AdminFormField({
  label,
  name,
  required,
  hint,
  validate,
  className,
  ...rest
}: AdminFormFieldProps) {
  const id = useId();
  const [touched, setTouched] = useState(false);
  const [value, setValue] = useState("");

  const runValidate = useCallback(
    (next: string) => {
      if (validate) return validate(next);
      return defaultValidate(next, required);
    },
    [validate, required]
  );

  const isValid = runValidate(value);
  const fieldState = !touched ? "idle" : isValid ? "valid" : "invalid";

  const baseClass =
    rest.as === "textarea"
      ? adminTextareaBase
      : rest.as === "select"
        ? adminSelectBase
        : adminInputBase;

  const sharedHandlers = {
    id,
    name,
    onBlur: () => setTouched(true),
    onChange: (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setValue(e.target.value);
      if (touched) setTouched(true);
    },
    className: adminFieldClass(fieldState, baseClass),
    "aria-invalid": touched && !isValid ? true : undefined,
    "aria-describedby": hint ? `${id}-hint` : undefined,
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
        {required && (
          <span className="text-school-gold ml-0.5" aria-hidden>
            *
          </span>
        )}
      </label>
      {rest.as === "textarea" ? (
        <textarea {...sharedHandlers} {...rest.inputProps} />
      ) : rest.as === "select" ? (
        <select {...sharedHandlers} {...rest.inputProps}>
          {rest.children}
        </select>
      ) : (
        <input {...sharedHandlers} required={required} {...rest.inputProps} />
      )}
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {touched && !isValid && (
        <p className="text-xs text-destructive/90" role="alert">
          Revisa este campo antes de continuar.
        </p>
      )}
    </div>
  );
}
