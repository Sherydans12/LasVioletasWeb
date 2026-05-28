const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type TurnstileVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function verifyTurnstileToken(
  token: string | null | undefined
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY no configurada");
    return false;
  }

  if (!token?.trim()) return false;

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  const res = await fetch(SITEVERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) return false;

  const data = (await res.json()) as TurnstileVerifyResponse;
  return data.success === true;
}
