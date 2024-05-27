"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { LoaderCircleIcon, Save, Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SubmitButton({ buttonText }: { buttonText: string }) {

  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled className="w-fit">
          <LoaderCircleIcon className="mr-2 w-4 h-4 animate-spin" />
          Loading...
        </Button>
      ) : (
        <Button className="w-fit" type="submit">
          <Save className="mr-2 w-4 h-4" />
          {buttonText}
        </Button>
      )}
    </>
  )
}

export function DeleteEntryButton() {

  const { pending } = useFormStatus();

  return (

    <>

      {pending ? (
        <Button variant="destructive" size="icon" disabled>
          <LoaderCircleIcon className="w-4 h-4 animate-spin" />
        </Button>
      ) : (
        <Button 
          variant="destructive" size="icon" type="submit"
          onClick={() => {
            "use client"
            toast({
              variant: "destructive",
              description: "Journal Entry Deleted",
            })
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}

    </>
  )
}