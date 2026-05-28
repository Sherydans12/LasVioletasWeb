import { formatFileSize } from "@/lib/file-utils";

export function SelectedFileInfo({ file }: { file: File | null }) {
  if (!file) return null;

  return (
    <p className="text-xs text-muted-foreground truncate">
      Seleccionado: {file.name} · {formatFileSize(file.size)}
    </p>
  );
}

export function SelectedFilesInfo({ files }: { files: File[] }) {
  if (files.length === 0) return null;

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <ul className="text-xs text-muted-foreground space-y-0.5">
      {files.map((file) => (
        <li key={`${file.name}-${file.size}-${file.lastModified}`} className="truncate">
          {file.name} · {formatFileSize(file.size)}
        </li>
      ))}
      {files.length > 1 && (
        <li className="font-medium text-foreground/80 pt-0.5">
          Total: {formatFileSize(totalBytes)}
        </li>
      )}
    </ul>
  );
}
