import { NextResponse } from "next/server";
import { StorageQuotaError, STORAGE_QUOTA_ERROR_MESSAGE } from "@/lib/storage";
import { UploadValidationError } from "@/lib/uploads";

export function storageQuotaResponse() {
  return NextResponse.json(
    { error: STORAGE_QUOTA_ERROR_MESSAGE },
    { status: 403 }
  );
}

export function handleUploadRouteError(err: unknown) {
  if (err instanceof StorageQuotaError) return storageQuotaResponse();
  if (err instanceof UploadValidationError) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
  return NextResponse.json({ error: "Error en la operación" }, { status: 500 });
}
