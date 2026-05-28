"use client";

import { useActionState, useState } from "react";
import {
  updateAdminEmailAction,
  updateAdminPasswordAction,
} from "@/app/admin/perfil/actions";
import { adminFieldClass, adminInputBase } from "@/lib/admin-form-styles";

type ActionResult = { ok: true } | { ok: false; error: string } | null;

const initial: ActionResult = null;

function useFieldState(validate: (v: string) => boolean) {
  const [touched, setTouched] = useState(false);
  const [value, setValue] = useState("");
  const state = !touched ? "idle" : validate(value) ? "valid" : "invalid";
  return {
    touched,
    setTouched,
    value,
    setValue,
    state,
    className: adminFieldClass(state, adminInputBase),
  };
}

export function AdminProfileForm({ currentEmail }: { currentEmail: string }) {
  const [emailState, emailAction, emailPending] = useActionState(
    updateAdminEmailAction,
    initial
  );
  const [passwordState, passwordAction, passwordPending] = useActionState(
    updateAdminPasswordAction,
    initial
  );

  const emailField = useFieldState((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
  const newPasswordField = useFieldState((v) => v.length === 0 || v.length >= 10);
  const confirmField = useFieldState(
    (v) => v.length === 0 || v === newPasswordField.value
  );

  return (
    <div className="space-y-8 max-w-xl">
      <form
        action={emailAction}
        className="bg-background rounded-2xl border border-school-violet/10 shadow-sm p-6 space-y-4"
      >
        <h2 className="font-heading font-semibold text-lg text-balance">
          Correo electrónico
        </h2>
        <p className="text-sm text-muted-foreground text-pretty">
          Actual:{" "}
          <span className="font-medium text-foreground">{currentEmail}</span>
        </p>
        <div>
          <label
            htmlFor="email-current-password"
            className="block text-sm font-medium mb-2"
          >
            Contraseña actual <span className="text-school-gold">*</span>
          </label>
          <input
            id="email-current-password"
            name="currentPassword"
            type="password"
            required
            autoComplete="current-password"
            className={adminFieldClass("idle", adminInputBase)}
          />
        </div>
        <div>
          <label htmlFor="newEmail" className="block text-sm font-medium mb-2">
            Nuevo correo <span className="text-school-gold">*</span>
          </label>
          <input
            id="newEmail"
            name="newEmail"
            type="email"
            required
            autoComplete="email"
            value={emailField.value}
            onChange={(e) => emailField.setValue(e.target.value)}
            onBlur={() => emailField.setTouched(true)}
            className={emailField.className}
            aria-invalid={emailField.touched && emailField.state === "invalid"}
          />
        </div>
        <ActionMessage state={emailState} />
        <button
          type="submit"
          disabled={emailPending}
          className="px-6 py-2.5 rounded-lg bg-school-violet text-white text-sm font-semibold hover:bg-school-violet/90 disabled:opacity-60 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school-gold"
        >
          {emailPending ? "Guardando…" : "Actualizar correo"}
        </button>
      </form>

      <form
        action={passwordAction}
        className="bg-background rounded-2xl border border-school-violet/10 shadow-sm p-6 space-y-4"
      >
        <h2 className="font-heading font-semibold text-lg text-balance">Contraseña</h2>
        <p className="text-sm text-muted-foreground text-pretty">
          Mínimo 10 caracteres, con letras y números.
        </p>
        <div>
          <label htmlFor="pwd-current" className="block text-sm font-medium mb-2">
            Contraseña actual <span className="text-school-gold">*</span>
          </label>
          <input
            id="pwd-current"
            name="currentPassword"
            type="password"
            required
            autoComplete="current-password"
            className={adminFieldClass("idle", adminInputBase)}
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
            Nueva contraseña <span className="text-school-gold">*</span>
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            autoComplete="new-password"
            minLength={10}
            value={newPasswordField.value}
            onChange={(e) => newPasswordField.setValue(e.target.value)}
            onBlur={() => newPasswordField.setTouched(true)}
            className={newPasswordField.className}
            aria-invalid={
              newPasswordField.touched && newPasswordField.state === "invalid"
            }
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
            Confirmar nueva contraseña <span className="text-school-gold">*</span>
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            minLength={10}
            value={confirmField.value}
            onChange={(e) => confirmField.setValue(e.target.value)}
            onBlur={() => confirmField.setTouched(true)}
            className={confirmField.className}
            aria-invalid={
              confirmField.touched && confirmField.state === "invalid"
            }
          />
        </div>
        <ActionMessage state={passwordState} />
        <button
          type="submit"
          disabled={passwordPending}
          className="px-6 py-2.5 rounded-lg bg-school-gold text-school-violet text-sm font-semibold hover:bg-school-gold-light disabled:opacity-60 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school-gold"
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
      <p className="text-sm text-emerald-700" role="status">
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
