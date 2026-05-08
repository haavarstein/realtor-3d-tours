"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileBox, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import {
  defaultThumbnail,
  newTourId,
  saveTour,
  setTourSource,
} from "@/lib/tours";

const MAX_BYTES = 500 * 1024 * 1024;

export function UploadFlow() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);

      if (!file.name.toLowerCase().endsWith(".ply")) {
        const msg = "That doesn't look like a .ply file. Please pick the Gaussian Splat .ply you exported from Polycam.";
        setError(msg);
        toast.error(msg);
        return;
      }

      if (file.size > MAX_BYTES) {
        const msg = `File too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). The limit is 500 MB.`;
        setError(msg);
        toast.error(msg);
        return;
      }

      const id = newTourId();
      const blobUrl = URL.createObjectURL(file);
      const title = file.name.replace(/\.ply$/i, "");

      setTourSource(id, blobUrl, file.name);
      saveTour({
        id,
        title,
        createdAt: Date.now(),
        thumbnailUrl: defaultThumbnail(),
        splatUrl: blobUrl,
      });

      toast.success("Loading your tour…");
      router.push(`/tour/${id}`);
    },
    [router]
  );

  function pickFile() {
    fileInputRef.current?.click();
  }

  function onFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function onDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardContent className="space-y-6 p-8">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Upload .ply file from Polycam
          </h2>
          <p className="text-sm text-muted-foreground">
            Drag &amp; drop or select a .ply file exported from Polycam (Gaussian
            Splat). It opens instantly in the 3D viewer — nothing leaves your
            machine.
          </p>
        </div>

        <div
          onDragOver={onDragOver}
          onDragEnter={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={pickFile}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              pickFile();
            }
          }}
          className={`group relative cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/60 hover:bg-accent/30"
          }`}
        >
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
            <FileBox className="h-8 w-8" />
          </div>
          <p className="text-base font-semibold">
            {dragActive ? "Drop the .ply file here" : "Drag & drop your .ply"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            or click anywhere in this area to browse
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              pickFile();
            }}
            className="mt-5 inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
          >
            <Upload className="mr-2 h-5 w-5" />
            Select .ply file
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".ply"
            className="hidden"
            onChange={onFileChosen}
          />
        </div>

        <div className="space-y-1 rounded-md bg-muted/50 p-4 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">How to export from Polycam</p>
          <ol className="ml-4 list-decimal space-y-0.5">
            <li>Open your Polycam capture and switch to the Gaussian Splat view.</li>
            <li>Tap Export and choose the <span className="font-mono">.ply</span> format.</li>
            <li>Save the file to this computer, then drop it here.</li>
          </ol>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
