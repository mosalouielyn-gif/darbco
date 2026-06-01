import { ReactNode } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { LogOut, Leaf } from "lucide-react";
import { Role, ROLE_LABELS, User } from "./types";

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

interface LayoutProps {
  user: User;
  onLogout: () => void;
  navItems: NavItem[];
  activeNav: string;
  onNavChange: (id: string) => void;
  children: ReactNode;
}

const ROLE_COLORS: Record<Role, string> = {
  production_clerk: "bg-emerald-700",
  inventory_bookkeeper: "bg-amber-700",
  payroll_personnel: "bg-sky-700",
  finance_officer: "bg-violet-700",
  manager_admin: "bg-slate-800",
};

export function Layout({ user, onLogout, navItems, activeNav, onNavChange, children }: LayoutProps) {
  const roleColor = ROLE_COLORS[user.role];
  const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className={`${roleColor} text-white p-4 flex items-center gap-2`}>
          <Leaf className="h-5 w-5" />
          <div>
            <div>DARBCO</div>
            <div className="text-xs opacity-80">Agri System</div>
          </div>
        </div>

        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className={`${roleColor} text-white`}>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate">{user.name}</div>
              <Badge variant="secondary" className="text-xs">{ROLE_LABELS[user.role]}</Badge>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md mb-1 text-left transition ${
                activeNav === item.id
                  ? "bg-slate-900 text-white"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t">
          <Button variant="outline" className="w-full justify-start" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-[1400px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
