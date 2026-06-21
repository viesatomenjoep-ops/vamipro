"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-full bg-panel border border-line" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex h-8 w-14 items-center rounded-full bg-panel-2 p-1 ring-1 ring-inset ring-line-strong transition-colors hover:ring-accent"
      aria-label="Toggle dark mode"
    >
      <span
        className={`absolute left-1 flex h-6 w-6 items-center justify-center rounded-full bg-bg shadow-sm transition-transform duration-300 ${
          isDark ? "translate-x-6" : "translate-x-0"
        }`}
      >
        {isDark ? (
          <Moon size={14} className="text-fg" strokeWidth={2.5} />
        ) : (
          <Sun size={14} className="text-accent" strokeWidth={2.5} />
        )}
      </span>
    </button>
  );
}
