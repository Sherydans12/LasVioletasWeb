"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FileText } from "lucide-react";
import type { Documento } from "@prisma/client";
import { SelectedFileInfo } from "@/components/admin/SelectedFileInfo";
import { StorageUploadBlockedBanner } from "@/components/admin/StorageUploadBlockedBanner";
import { Button } from "@/components/ui/button";
import { adminFieldClass, adminInputBase } from "@/lib/admin-form-styles";
import { formatFileSize } from "@/lib/file-utils";
import type { StorageQuotaInfo } from "@/lib/storage-quota";
import { validateUploadAgainstStorage } from "@/lib/upload-form-utils";
import { cn } from "@/lib/utils";

type DocumentoEditDialogProps = {
  open: boolean;
  documento: Documento | null;
  storage: StorageQuotaInfo;
  onOpenChange: (open: boolean) => void;
  onConfirm: (formData: FormData) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
};

export function DocumentoEditDialog({
  open,
  documento,
  storage,
  onOpenChange,
  onConfirm,
  loading = false,
  error = null,
}: DocumentoEditDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [nombre, setNombre] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open && documento) {
      setNombre(documento.nombre);
      setSelectedFile(null);
      setFileKey((k) => k + 1);
      setLocalError(null);
    }
  }, [open, documento]);

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

  if (!mounted || typeof document === "undefined" || !documento) return null;

  const isValid = nombre.trim().length >= 2;
  const displayError = localError ?? error;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-documento-title"
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
            className="relative z-10 w-full max-w-lg rounded-2xl border border-school-violet/10 bg-background p-6 shadow-2xl space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!isValid || loading) return;

              setLocalError(null);

              if (selectedFile) {
                const netBytes = selectedFile.size - documento.tamanoBytes;
                if (netBytes > 0) {
                  const storageError = validateUploadAgainstStorage(
                    netBytes,
                    storage
                  );
                  if (storageError) {
                    setLocalError(storageError);
                    return;
                  }
                }
              }

              const formData = new FormData();
              formData.set("nombre", nombre.trim());
              if (selectedFile) {
                formData.set("archivo", selectedFile);
              }
              void onConfirm(formData);
            }}
          >
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-school-violet/10">
                <FileText className="h-5 w-5 text-school-violet" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <h2
                  id="edit-documento-title"
                  className="text-lg font-semibold text-foreground"
                >
                  Editar documento
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Actualiza el título visible o reemplaza el archivo asociado.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-documento-nombre" className="block text-sm font-medium">
                Título visible
              </label>
              <input
                id="edit-documento-nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={loading}
                className={adminFieldClass(isValid ? "valid" : "idle", adminInputBase)}
                autoFocus
              />
            </div>

            <div className="rounded-lg border border-border/60 bg-school-neutral/50 px-3 py-2 text-xs text-muted-foreground">
              Archivo actual: {formatFileSize(documento.tamanoBytes)}
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-documento-archivo" className="block text-sm font-medium">
                Reemplazar archivo (opcional)
              </label>
              <input
                key={fileKey}
                id="edit-documento-archivo"
                type="file"
                accept=".pdf,.doc,.docx,.xlsx,application/pdf"
                disabled={loading}
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                className={cn(
                  adminFieldClass("idle", adminInputBase),
                  "py-2.5 file:mr-4 file:rounded-md file:border-0 file:bg-school-violet/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-school-violet disabled:opacity-60"
                )}
              />
              <p className="text-xs text-muted-foreground">
                Formatos: PDF, DOCX, XLSX. Máx. 20MB. Si no eliges archivo, se
                mantiene el actual.
              </p>
              <SelectedFileInfo file={selectedFile} />
            </div>

            <StorageUploadBlockedBanner storage={storage} />

            {displayError && (
              <p className="text-sm text-destructive" role="alert">
                {displayError}
              </p>
            )}

            <div className="flex flex-wrap justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || !isValid}>
                {loading ? "Guardando…" : "Guardar cambios"}
              </Button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
