import { useEffect, useState } from "react";

function getInitialTheme() {
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('theme')) {
      return localStorage.getItem('theme') === 'dark';
    }
    // Default to dark theme
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    return true;
  }
  return true;
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setIsDark((v) => !v)}
      className="rounded-md border px-2 py-1 text-sm hover:bg-muted transition"
    >
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
} 