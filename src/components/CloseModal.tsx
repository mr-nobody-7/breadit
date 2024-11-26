"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "./ui/Button";

const CloseModal = () => {
  const router = useRouter();

  return (
    <Button
      aria-label="close modal"
      className="w-6 h-6 p-0 rounded-md"
      variant="subtle"
      onClick={() => router.back()}
    >
      <X className="h-4 w-4" />
    </Button>
  );
};

export default CloseModal;
