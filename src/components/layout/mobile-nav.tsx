"use client";

import Link from "next/link";
import { useEffect } from "react";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
}

export function MobileNav({ open, onClose, links }: MobileNavProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-surface-raised shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <span className="text-lg font-bold text-stone-900">Menu</span>
          <button
            onClick={onClose}
            className="p-2 text-stone-600 hover:text-stone-900"
            aria-label="Close menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="block px-3 py-3 text-base font-medium text-stone-700 hover:bg-stone-100 rounded-lg"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-stone-200 mt-4">
            <Link
              href="/pricing"
              onClick={onClose}
              className="block px-3 py-3 text-base font-medium text-brand-600 hover:bg-brand-50 rounded-lg"
            >
              For Businesses
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
