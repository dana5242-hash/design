import { useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  LayoutTemplate,
  Settings as SettingsIcon,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/briefs", label: "Briefs", icon: FileText, end: false },
  { to: "/briefs/new", label: "New Brief", icon: PlusCircle, end: false },
  { to: "/templates", label: "Templates", icon: LayoutTemplate, end: false },
  { to: "/settings", label: "Settings", icon: SettingsIcon, end: false },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-brand-50 text-brand-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`
          }
        >
          <item.icon size={18} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const user = useAppStore((s) => s.user);
  const navigate = useNavigate();

  return (
    <div className="min-h-svh flex bg-canvas">
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-gray-200 bg-white">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <Sparkles size={17} />
          </div>
          <span className="font-semibold text-gray-900 text-sm leading-tight">
            Design Brief
            <br />
            Maker
          </span>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <NavList />
        </div>
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => navigate("/settings")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-left"
          >
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold shrink-0">
              {user.name.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.department || "부서 미설정"}</p>
            </div>
          </button>
        </div>
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-gray-900/40" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-white shadow-xl flex flex-col">
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                  <Sparkles size={17} />
                </div>
                <span className="font-semibold text-gray-900 text-sm">Design Brief Maker</span>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="p-1.5 text-gray-500" aria-label="메뉴 닫기">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <NavList onNavigate={() => setDrawerOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <header className="lg:hidden h-14 flex items-center justify-between px-4 border-b border-gray-200 bg-white sticky top-0 z-30">
          <button onClick={() => setDrawerOpen(true)} className="p-1.5 -ml-1.5 text-gray-600" aria-label="메뉴 열기">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-brand-600 flex items-center justify-center text-white">
              <Sparkles size={13} />
            </div>
            <span className="font-semibold text-gray-900 text-sm">Design Brief Maker</span>
          </div>
          <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold">
            {user.name.slice(0, 1)}
          </div>
        </header>

        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 pb-20 lg:pb-8 max-w-6xl w-full mx-auto">
          {children}
        </main>

        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 flex items-stretch">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium ${
                  isActive ? "text-brand-600" : "text-gray-500"
                }`
              }
            >
              <item.icon size={19} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
