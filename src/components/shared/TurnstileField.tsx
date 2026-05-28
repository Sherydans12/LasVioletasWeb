"use client";

import { Turnstile } from "@marsidev/react-turnstile";

type TurnstileFieldProps = {
  onToken: (token: string) => void;
  onExpire?: () => void;
};

export function TurnstileField({ onToken, onExpire }: TurnstileFieldProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    return (
      <p className="text-xs text-destructive" role="alert">
        Turnstile no configurado (NEXT_PUBLIC_TURNSTILE_SITE_KEY).
      </p>
    );
  }

  return (
    <div className="flex justify-center min-h-[65px]">
      <Turnstile
        siteKey={siteKey}
        onSuccess={onToken}
        onExpire={() => {
          onExpire?.();
          onToken("");
        }}
        options={{
          theme: "light",
          size: "normal",
        }}
      />
    </div>
  );
}
