export function isStrongPassword(password: string): boolean {
  if (password.length < 10) return false;
  if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(password)) return false;
  if (!/\d/.test(password)) return false;
  return true;
}

export const PASSWORD_POLICY_MESSAGE =
  "La contraseña debe tener al menos 10 caracteres e incluir letras y números.";
