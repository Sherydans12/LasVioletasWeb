"use client";

import { useActionState } from "react";
import {
  updateAdminEmailAction,
  updateAdminPasswordAction,
} from "@/app/admin/perfil/actions";

type ActionResult = { ok: true } | { ok: false; error: string } | null;

const initial: ActionResult = null;

export function AdminProfileForm({ currentEmail }: { currentEmail: string }) {
  const [emailState, emailAction, emailPending] = useActionState(
    updateAdminEmailAction,
    initial
  );
  const [passwordState, passwordAction, passwordPending] = useActionState(
    updateAdminPasswordAction,
    initial
  );

  return (
    <div className="space-y-8 max-w-xl">
      <form
        action={emailAction}
        className="bg-background rounded-2xl border border-border/60 p-6 space-y-4"
      >
        <h2 className="font-heading font-semibold text-lg">Correo electrónico</h2>
        <p className="text-sm text-muted-foreground">
          Actual: <span className="font-medium text-foreground">{currentEmail}</span>
        </p>
        <div>
          <label htmlFor="email-current-password" className="block text-sm font-medium mb-2">
            Contraseña actual <span className="text-school-violet">*</span>
          </label>
          <input
            id="email-current-password"
            name="currentPassword"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-border px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label htmlFor="newEmail" className="block text-sm font-medium mb-2">
            Nuevo correo <span className="text-school-violet">*</span>
          </label>
          <input
            id="newEmail"
            name="newEmail"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-border px-4 py-3 text-sm"
          />
        </div>
        <ActionMessage state={emailState} />
        <button
          type="submit"
          disabled={emailPending}
          className="px-6 py-2.5 rounded-lg bg-school-violet text-white text-sm font-semibold disabled:opacity-60"
        >
          {emailPending ? "Guardando…" : "Actualizar correo"}
        </button>
      </form>

      <form
        action={passwordAction}
        className="bg-background rounded-2xl border border-border/60 p-6 space-y-4"
      >
        <h2 className="font-heading font-semibold text-lg">Contraseña</h2>
        <p className="text-sm text-muted-foreground">
          Mínimo 10 caracteres, con letras y números.
        </p>
        <div>
          <label htmlFor="pwd-current" className="block text-sm font-medium mb-2">
            Contraseña actual <span className="text-school-violet">*</span>
          </label>
          <input
            id="pwd-current"
            name="currentPassword"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-border px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
            Nueva contraseña <span className="text-school-violet">*</span>
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            autoComplete="new-password"
            minLength={10}
            className="w-full rounded-lg border border-border px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
            Confirmar nueva contraseña <span className="text-school-violet">*</span>
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            minLength={10}
            className="w-full rounded-lg border border-border px-4 py-3 text-sm"
          />
        </div>
        <ActionMessage state={passwordState} />
        <button
          type="submit"
          disabled={passwordPending}
          className="px-6 py-2.5 rounded-lg bg-school-gold text-school-violet text-sm font-semibold disabled:opacity-60"
        >
          {passwordPending ? "Guardando…" : "Actualizar contraseña"}
        </button>
      </form>
    </div>
  );
}

function ActionMessage({ state }: { state: ActionResult }) {
  if (!state) return null;
  if (state.ok) {
    return (
      <p className="text-sm text-school-violet" role="status">
        Cambios guardados correctamente.
      </p>
    );
  }
  return (
    <p className="text-sm text-destructive" role="alert">
      {state.error}
    </p>
  );
}
