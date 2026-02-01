import { useEffect, useRef, useState } from 'react';

type PageKey = 'battle' | 'skill-create';

interface GlobalNavProps {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
}

export function GlobalNav({ activePage, onNavigate }: GlobalNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 text-sm text-white">
        <button
          type="button"
          onClick={() => onNavigate('battle')}
          className="flex items-center gap-2 font-semibold tracking-wide hover:text-amber-200"
        >
          <span className="text-lg">🃏</span>
          Cardgame Studio
        </button>

        <nav className="flex items-center gap-4">
          <div ref={menuRef} className="relative">
            <button
              type="button"
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 transition ${
                menuOpen || activePage === 'skill-create'
                  ? 'bg-amber-400/15 text-amber-200 ring-1 ring-amber-300/40'
                  : 'hover:bg-white/10'
              }`}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              스킬
              <span className={`text-xs transition ${menuOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>

            <div
              className={`absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/95 shadow-xl transition ${
                menuOpen ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-1'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  onNavigate('skill-create');
                  setMenuOpen(false);
                }}
                className={`w-full px-4 py-3 text-left text-sm transition ${
                  activePage === 'skill-create'
                    ? 'bg-amber-400/15 text-amber-100'
                    : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                스킬 생성
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
