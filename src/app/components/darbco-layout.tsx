import { ReactNode } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { LogOut, Leaf } from "lucide-react";
import { ROLE_LABELS, User } from "./types";

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

interface Props {
  user: User;
  onLogout: () => void;
  navItems: NavItem[];
  active: string;
  onChange: (id: string) => void;
  children: ReactNode;
}

export function DarbcoLayout({ user, onLogout, navItems, active, onChange, children }: Props) {
  const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-60 bg-gradient-to-b from-emerald-900 to-emerald-950 text-emerald-50 flex flex-col">
        <div className="p-5 border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <div className="tracking-wide">DARBCO</div>
              <div className="text-[10px] text-emerald-300/80 leading-tight">
                Banana Production<br />Management System
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition ${
                active === item.id
                  ? "bg-emerald-500 text-white shadow"
                  : "text-emerald-100/90 hover:bg-emerald-800/60"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-emerald-800">
          <div className="flex items-center gap-3 p-2 rounded-md bg-emerald-800/40">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-emerald-500 text-white">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm">{user.name}</div>
              <div className="text-[11px] text-emerald-300/80">{ROLE_LABELS[user.role]}</div>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 rounded hover:bg-emerald-700/60"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-[1400px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
