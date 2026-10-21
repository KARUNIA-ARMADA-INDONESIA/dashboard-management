"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, Leaf, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CommandPalette } from "@/components/layout/command-palette";

const navLinks = [
  { href: "/", label: "Beranda", exact: true },
  { href: "/#departemen", label: "Departemen" },
  { href: "/#favorit", label: "Favorit Saya" },
  { href: "/#terakhir", label: "Terakhir Dibuka" },
];

export function TopNavbar() {
  const pathname = usePathname();
  const [cmdOpen, setCmdOpen] = useState(false);

  // ⌘K / Ctrl+K global shortcut
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setCmdOpen((v) => !v);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center gap-6 px-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-base font-bold tracking-tight">
                KARUNIA
              </span>
              <span className="block text-[11px] text-muted-foreground">
                Management Dashboard
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const active = link.exact && pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                    active && "bg-accent text-accent-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex flex-1 items-center justify-end gap-3">
            {/* Search trigger — opens CommandPalette */}
            <button
              id="global-search-trigger"
              type="button"
              onClick={() => setCmdOpen(true)}
              className="relative hidden w-full max-w-xs lg:flex items-center gap-2 h-9 rounded-md border bg-muted/50 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">Cari dashboard, laporan…</span>
              <kbd className="rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium">
                ⌘ K
              </kbd>
            </button>

            {/* Mobile search icon */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setCmdOpen(true)}
              aria-label="Buka pencarian"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              id="notification-bell"
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Notifikasi"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-2 rounded-md p-1 text-left transition-colors hover:bg-muted"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    HA
                  </AvatarFallback>
                </Avatar>
                <span className="hidden leading-tight sm:block">
                  <span className="block text-sm font-medium">Hengki Agung</span>
                  <span className="block text-xs text-muted-foreground">
                    Management
                  </span>
                </span>
                <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profil</DropdownMenuItem>
                <DropdownMenuItem>Pengaturan</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Keluar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </>
  );
}
