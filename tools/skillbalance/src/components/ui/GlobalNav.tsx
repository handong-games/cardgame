import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

type NavChild = {
  label: string;
  to: string;
};

type NavItem = {
  label: string;
  to?: string;
  children?: NavChild[];
};

type NavSection = {
  id: "regions" | "skills" | "settings";
  label: string;
  icon: string;
  basePath: string;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    id: "regions",
    label: "지역",
    icon: "🌲",
    basePath: "/regions",
    items: [
      {
        label: "잊혀진 숲",
        to: "/regions/forgotten-forest",
        children: [
          { label: "상황", to: "/regions/forgotten-forest/scenarios" },
          { label: "몬스터 설계", to: "/regions/forgotten-forest/monsters" },
        ],
      },
    ],
  },
  {
    id: "skills",
    label: "스킬",
    icon: "✨",
    basePath: "/skill",
    items: [
      { label: "스킬 생성", to: "/skill-create" },
      { label: "트리거 관리", to: "/skill-triggers" },
      { label: "대상 가중치", to: "/target-weights" },
      { label: "몬스터별 상성", to: "/skill-monster-synergy" },
    ],
  },
  {
    id: "settings",
    label: "설정",
    icon: "⚙️",
    basePath: "/settings",
    items: [{ label: "설정", to: "/settings" }],
  },
];

export function GlobalNav() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    regions: true,
    skills: true,
    settings: true,
  });

  const isExactActive = (path: string) => location.pathname === path;
  const isActive = (path: string) => location.pathname.startsWith(path);

  useEffect(() => {
    const nextOpen: Record<string, boolean> = { ...openSections };
    NAV_SECTIONS.forEach((section) => {
      if (isActive(section.basePath)) {
        nextOpen[section.id] = true;
      }
      section.items.forEach((item) => {
        if (item.to && isActive(item.to)) {
          nextOpen[section.id] = true;
        }
        item.children?.forEach((child) => {
          if (isActive(child.to)) {
            nextOpen[section.id] = true;
          }
        });
      });
    });
    setOpenSections(nextOpen);
  }, [location.pathname]);

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen min-h-0 flex-col overflow-hidden border-r border-amber-100 bg-[#fff7ef] text-sm text-slate-700 shadow-[0_0_40px_rgba(15,23,42,0.06)] transition-all duration-300 ${
        collapsed ? "w-20 px-3 py-6" : "w-72 px-5 py-6"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className={collapsed ? "hidden" : "block"}>
          <Link to="/" className="text-lg font-semibold text-rose-500">
            Skill Balance Lab
          </Link>
          <p className="mt-1 text-xs text-slate-500">조합형 스킬 빌더 & 밸런스 분석</p>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="rounded-xl border border-slate-200 px-2 py-1 text-[10px] text-slate-400"
          aria-label="네비게이션 접기"
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      <div className={`mt-6 border-t border-amber-100 pt-5 ${collapsed ? "hidden" : "block"}`}>
        <p className="px-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Menu
        </p>
      </div>

      <nav
        className={`nav-scroll mt-4 flex flex-1 min-h-0 flex-col gap-3 overflow-y-auto pb-6 pr-1 ${
          collapsed ? "items-center" : ""
        }`}
      >
        <Link
          to="/"
          className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
            isExactActive("/")
              ? "bg-rose-100/70 text-rose-600"
              : "text-slate-600 hover:bg-amber-50"
          }`}
        >
          <span className="text-lg">🏠</span>
          {!collapsed && "대시보드"}
        </Link>

        {NAV_SECTIONS.map((section) => {
          const open = !!openSections[section.id];
          const isSectionActive = isActive(section.basePath);
          return (
            <div key={section.id} className={`w-full ${collapsed ? "flex justify-center" : ""}`}>
              <button
                type="button"
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
                  open || isSectionActive
                    ? "bg-rose-100/70 text-rose-600"
                    : "text-slate-600 hover:bg-amber-50"
                }`}
                onClick={() =>
                  setOpenSections((prev) => ({
                    ...prev,
                    [section.id]: !prev[section.id],
                  }))
                }
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{section.icon}</span>
                  {!collapsed && section.label}
                </span>
                {!collapsed && (
                  <span className={`text-xs transition ${open ? "rotate-180" : ""}`}>⌄</span>
                )}
              </button>

              {!collapsed && (
                <div
                  className={`ml-4 space-y-2 overflow-hidden transition-all duration-300 ${
                    open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {section.items.map((item) => (
                    <div key={item.label} className="space-y-2">
                      {item.to ? (
                        <Link
                          to={item.to}
                          className={`block rounded-xl border border-amber-100 bg-white/70 px-3 py-2 text-xs transition ${
                            isActive(item.to)
                              ? "text-rose-600"
                              : "text-slate-500 hover:text-slate-600"
                          }`}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <p className="px-3 text-xs font-semibold text-slate-500">{item.label}</p>
                      )}
                      {item.children && (
                        <div className="ml-3 space-y-2 border-l border-amber-100 pl-3">
                          {item.children.map((child) => (
                            <Link
                              key={child.to}
                              to={child.to}
                              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                                isActive(child.to)
                                  ? "bg-rose-100/70 text-rose-600"
                                  : "text-slate-500 hover:bg-amber-50"
                              }`}
                            >
                              <span className="text-rose-400">•</span>
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div
        className={`mt-auto shrink-0 rounded-2xl border border-amber-100 bg-white/70 px-4 py-3 text-xs text-slate-500 ${
          collapsed ? "hidden" : "block"
        }`}
      >
        조합형 스킬 빌더 & 밸런스 분석
      </div>
    </aside>
  );
}
