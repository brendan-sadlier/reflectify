"use client";

import { Button } from "@/components/ui/button";
import { LoaderCircleIcon } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SubmitButton() {

  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled className="w-fit">
          <LoaderCircleIcon className="mr-2 w-4 h-4 animate-spin" />
          Loading...
        </Button>
      ) : (
        <Button className="w-fit" type="submit">Save Changes</Button>
      )}
    </>
  )
}