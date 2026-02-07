'use client';

import SectionWrapper from "@/components/common/SectionWrapper";
import Button from "@/components/common/Button";

export default function Error({ error, reset }) {
  return (
    <SectionWrapper className="min-h-[70vh] flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-8">{error?.message || "We couldn't load this campaign."}</p>
      <Button onClick={() => reset()}>Try Again</Button>
    </SectionWrapper>
  );
}
