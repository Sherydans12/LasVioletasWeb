"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminFieldClass, adminInputBase } from "@/lib/admin-form-styles";

type CategoriaEditDialogProps = {
  open: boolean;
  nombre: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (nombre: string) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
};

export function CategoriaEditDialog({
  open,
  nombre,
  onOpenChange,
  onConfirm,
  loading = false,
  error = null,
}: CategoriaEditDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState(nombre);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) setValue(nombre);
  }, [open, nombre]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onOpenChange(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, loading, onOpenChange]);

  if (!mounted || typeof document === "undefined") return null;

  const isValid = value.trim().length >= 2;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-categoria-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Cerrar"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          />

          <motion.form
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18 }}
            className="relative z-10 w-full max-w-md rounded-2xl border border-school-violet/10 bg-background p-6 shadow-2xl"
            onSubmit={(e) => {
              e.preventDefault();
              if (!isValid || loading) return;
              void onConfirm(value.trim());
            }}
          >
            <div className="flex gap-4 mb-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-school-violet/10">
                <Pencil className="h-5 w-5 text-school-violet" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <h2
                  id="edit-categoria-title"
                  className="text-lg font-semibold text-foreground"
                >
                  Renombrar carpeta
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Cambia el nombre visible de la sección en el sitio público.
                </p>
              </div>
            </div>

            <label htmlFor="edit-categoria-nombre" className="block text-sm font-medium mb-2">
              Nombre de la carpeta
            </label>
            <input
              id="edit-categoria-nombre"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={loading}
              className={adminFieldClass(isValid ? "valid" : "idle", adminInputBase)}
              autoFocus
            />

            {error && (
              <p className="text-sm text-destructive mt-3" role="alert">
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || !isValid}>
                {loading ? "Guardando…" : "Guardar nombre"}
              </Button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
