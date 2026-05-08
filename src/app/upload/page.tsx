import type { Metadata } from "next";
import { UploadFlow } from "@/components/upload-flow";

export const metadata: Metadata = {
  title: "Upload — Realtor3D",
  description: "Upload a property walkthrough video to generate a 3D tour.",
};

export default function UploadPage() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-10 sm:py-16">
      <UploadFlow />
    </section>
  );
}
