import { LogOut } from "lucide-react";

import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

type SignOutButtonProps = {
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
};

export function SignOutButton({
  className,
  variant = "outline",
}: SignOutButtonProps) {
  return (
    <form action={signOut}>
      <Button type="submit" variant={variant} className={className}>
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </form>
  );
}
