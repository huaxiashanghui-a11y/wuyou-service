'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  href: string;
  subItems?: { name: string; href: string }[];
}

interface CategoryCardsProps {
  categories: CategoryItem[];
}

export default function CategoryCards({ categories }: CategoryCardsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Category Cards */}
      <div className="hidden lg:flex flex-col gap-2 h-full">
        <div className="text-xs font-medium text-text-muted mb-2 px-1">全部分类</div>
        {categories.map((category) => (
          <div
            key={category.id}
            className="relative"
            onMouseEnter={() => setHoveredId(category.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <Link
              href={category.href}
              className="block card-dark p-3 hover:bg-dark-card/80 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{category.icon}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-text-primary text-sm truncate">
                    {category.name}
                  </h4>
                  {category.subItems && category.subItems.length > 0 && (
                    <p className="text-xs text-text-muted truncate">
                      {category.subItems.map(sub => sub.name).join(' / ')}
                    </p>
                  )}
                </div>
                {category.subItems && category.subItems.length > 0 && (
                  <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />
                )}
              </div>
            </Link>

            {/* Sub items hover panel */}
            {category.subItems && category.subItems.length > 0 && hoveredId === category.id && (
              <div className="absolute left-full top-0 ml-2 w-44 bg-dark-nav border border-dark-border rounded-xl shadow-2xl p-2 z-50 animate-slide-down">
                {category.subItems.map((sub, idx) => (
                  <Link
                    key={idx}
                    href={sub.href}
                    className="block px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-dark-card rounded-lg transition-colors"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Collapsible Category */}
      <div className="lg:hidden">
        <div className="card-dark overflow-hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-text-primary"
          >
            <div className="flex items-center gap-2">
              <span>📂</span>
              <span className="font-medium">全部分类</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${mobileOpen ? 'rotate-180' : ''}`} />
          </button>

          {mobileOpen && (
            <div className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={category.href}
                    className="flex items-center gap-2 p-3 bg-dark-card rounded-lg hover:bg-dark-border transition-colors"
                  >
                    <span className="text-xl">{category.icon}</span>
                    <span className="text-sm text-text-secondary">{category.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}