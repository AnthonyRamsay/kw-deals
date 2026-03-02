"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Category {
  name: string;
  slug: string;
  icon?: string | null;
}

interface CategoryNavProps {
  categories: Category[];
  showAll?: boolean;
}

export function CategoryNav({ categories, showAll = true }: CategoryNavProps) {
  const pathname = usePathname();

  const isActive = (slug: string) => {
    if (slug === "all") return pathname === "/";
    return pathname === `/category/${slug}`;
  };

  return (
    <nav className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
      {showAll && (
        <Link
          href="/"
          className={cn(
            "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors",
            isActive("all")
              ? "bg-brand-500 text-white"
              : "bg-surface-muted text-stone-700 hover:bg-stone-200"
          )}
        >
          All
        </Link>
      )}
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/category/${cat.slug}`}
          className={cn(
            "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
            isActive(cat.slug)
              ? "bg-brand-500 text-white"
              : "bg-surface-muted text-stone-700 hover:bg-stone-200"
          )}
        >
          {cat.name}
        </Link>
      ))}
    </nav>
  );
}
