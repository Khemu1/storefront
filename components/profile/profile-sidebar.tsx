"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut } from "lucide-react";

interface ProfileSidebarProps {
  name?: string;
  email?: string;
  onLogout: () => void;
}

export function ProfileSidebar({ name, email, onLogout }: ProfileSidebarProps) {
  const initial = name?.trim()?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-semibold text-primary">
                {initial}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold truncate">{name || "—"}</p>
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="w-full gap-2 text-destructive hover:text-destructive"
        onClick={onLogout}
      >
        <LogOut size={16} />
        Logout
      </Button>
    </div>
  );
}
