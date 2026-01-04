// components/dashboard/Breadcrumb.tsx
/**
 * Breadcrumb Navigation Component
 * Hiển thị đường dẫn điều hướng cho Dashboard
 */

'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
      <Link
        href="/"
        className="flex items-center gap-1 text-ink/60 dark:text-cream-light/60 hover:text-burgundy dark:hover:text-gold transition-colors"
      >
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">Trang chủ</span>
      </Link>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-ink/40 dark:text-cream-light/40" />
            {isLast ? (
              <span className="font-semibold text-ink dark:text-cream-light">{item.label}</span>
            ) : item.href ? (
              <Link
                href={item.href}
                className="text-ink/60 dark:text-cream-light/60 hover:text-burgundy dark:hover:text-gold transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-ink/60 dark:text-cream-light/60">{item.label}</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

