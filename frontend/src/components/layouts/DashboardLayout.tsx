import { useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, CalendarDays, ClipboardCheck, Trophy, UserRound, LogOut,
  ShieldCheck, Upload, ScrollText, Gavel, Users, X, Menu, Info
} from "lucide-react";
import type { ReactNode } from "react";
import type { User } from "../../types";
import Header from "../common/Header";
import Footer from "../common/Footer";
import MoltenMetal from "../common/MoltenMetal";
import Strands from "../common/Strands";

const studentLinks = [
  { to: "/student",           label: "Dashboard",          Icon: LayoutDashboard, end: true  },
  { to: "/student/hackathons",label: "Hackathons",         Icon: Gavel           },
  { to: "/student/events",    label: "Events",             Icon: CalendarDays    },
  { to: "/student/attendance",label: "Attendance",         Icon: ClipboardCheck  },
  { to: "/student/leaderboard",label:"Leaderboard",        Icon: Trophy          },
  { to: "/student/profile",   label: "Profile",            Icon: UserRound       },
  { to: "/credits",          label: "Credits",           Icon: Info           },
] as const;

const facultyLinks = [
  { to: "/faculty",                    label: "Dashboard",          Icon: LayoutDashboard, end: true },
  { to: "/faculty/hackathons",         label: "Hackathons",         Icon: Gavel           },
  { to: "/faculty/attendance-requests",label: "Attendance Requests",Icon: ClipboardCheck  },
  { to: "/credits",          label: "Credits",           Icon: Info           },
] as const;

const adminLinks = [
  { to: "/admin",           label: "Dashboard",       Icon: LayoutDashboard, end: true },
  { to: "/admin/hackathons",label: "Hackathon Judges",Icon: Gavel            },
  { to: "/admin/teams",     label: "Hackathon Teams", Icon: Users            },
  { to: "/admin/attendance",label: "Event Attendance",Icon: ClipboardCheck   },
  { to: "/admin/approvals", label: "Pending Approvals",Icon: ShieldCheck     },
  { to: "/admin/timetable", label: "Timetable Import", Icon: Upload          },
  { to: "/admin/audit-logs",label: "Audit Logs",       Icon: ScrollText      },
  { to: "/credits",          label: "Credits",           Icon: Info           },
] as const;

/** Dock-style nav item with hover scale + tooltip */
function DockItem({
  to, label, Icon, end, onClick
}: { to: string; label: string; Icon: React.ElementType; end?: boolean; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative flex items-center" style={{ perspective: "600px" }}>
      {/* Tooltip */}
      <div
        style={{
          position: "absolute",
          left: "calc(100% + 10px)",
          top: "50%",
          transform: hovered ? "translateY(-50%) translateX(0)" : "translateY(-50%) translateX(-6px)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.18s ease, transform 0.18s ease",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          zIndex: 200,
          background: "rgba(13,13,13,0.95)",
          border: "1px solid #242424",
          borderRadius: "10px",
          padding: "6px 10px",
          fontSize: "12px",
          fontWeight: 600,
          color: "#f5f5f3",
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        }}
      >
        {label}
      </div>

      <NavLink
        to={to}
        end={end}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={({ isActive }) => ({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "44px",
          height: "44px",
          borderRadius: "14px",
          border: `1px solid ${isActive ? "rgba(245,245,243,0.14)" : "transparent"}`,
          background: isActive
            ? "rgba(245,245,243,0.10)"
            : hovered
            ? "rgba(245,245,243,0.06)"
            : "transparent",
          color: isActive ? "#f5f5f3" : hovered ? "#f5f5f3" : "#70706b",
          transform: hovered ? "scale(1.18)" : "scale(1)",
          transition: "transform 0.18s cubic-bezier(0.34,1.56,0.64,1), background 0.15s ease, color 0.15s ease, border-color 0.15s ease",
          boxShadow: isActive
            ? "0 0 0 1px rgba(245,245,243,0.08), 0 2px 16px rgba(0,0,0,0.4)"
            : "none",
          cursor: "pointer",
          textDecoration: "none",
        })}
      >
        <Icon size={18} />
      </NavLink>
    </div>
  );
}

export default function DashboardLayout({
  user, children, onLogout,
}: {
  user: User; children: ReactNode; onLogout: () => void;
}) {
  const links = (() => {
  switch (user.role) {
    case "student":
      return studentLinks;
    case "faculty":
      return facultyLinks;
    case "admin":
      return adminLinks;
    default:
      return [];
  }
})();
const [open, setOpen] = useState(false);
  const [showDevInfo, setShowDevInfo] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080808] text-[#f5f5f3]">
      <MoltenMetal className="fixed" />
      <Strands className="fixed" />

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-[#080808]/70 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ─── DOCK SIDEBAR (desktop) ─────────────────────────────── */}
      <aside
        className="fixed inset-y-0 left-0 z-50 hidden lg:flex"
        style={{ width: "72px" }}
      >
        {/* Frosted glass panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "72px",
            height: "100%",
            background: "rgba(13,13,13,0.82)",
            borderRight: "1px solid #1a1a1a",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            padding: "0",
          }}
        >
          {/* Logo */}
          <button
            onClick={() => navigate(`/${user.role}`)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "72px",
              width: "100%",
              borderBottom: "1px solid #1a1a1a",
              flexShrink: 0,
              cursor: "pointer",
              background: "transparent",
              border: "none"
            }}
            aria-label="Go to dashboard"
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#f5f5f3",
                color: "#080808",
                fontSize: "14px",
                fontWeight: 900,
              }}
            >
              K
            </span>
          </button>

          {/* Nav links */}
          <nav
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              padding: "16px 0",
              overflowY: "auto",
            }}
          >
            {links.map((link) => (
              <DockItem key={link.to} {...link} />
            ))}
          </nav>

          {/* Logout at bottom */}
          <div style={{ padding: "16px 0", borderTop: "1px solid #1a1a1a", width: "100%", display: "flex", justifyContent: "center", gap: "8px" }}>
            <LogoutDockItem onLogout={onLogout} />
          </div>
        </div>
      </aside>

      {/* ─── MOBILE DRAWER ──────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#242424] bg-[#0d0d0d] transition-transform duration-200 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[72px] items-center justify-between border-b border-[#242424] px-5">
          <button onClick={() => { navigate(`/${user.role}`); setOpen(false); }} className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f5f3] text-sm font-black text-[#080808]">
              K
            </span>
            <span className="text-lg font-bold tracking-tight">Kortex</span>
          </button>
          <button className="text-[#a5a5a0]" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="px-3 py-5 flex-1 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#70706b]">
            {user.role} portal
          </p>
          {links.map((link) => {
                const { to, label, Icon, end } = link as any;
                return (
                  <NavLink
                    key={to}
                    to={to}
                    end={!!end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? "bg-[#f5f5f3] text-[#080808]"
                          : "text-[#a5a5a0] hover:bg-[#171717] hover:text-[#f5f5f3]"
                      }`
                    }
                  >
                    <Icon size={18} />
                    {label}
                  </NavLink>
                );
              })}
        </div>

        <div className="border-t border-[#242424] p-3">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#a5a5a0] transition hover:bg-[#171717] hover:text-[#f5f5f3]"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ───────────────────────────────────────── */}
      <div className="relative z-10 lg:pl-[72px]">
        {/* Developer Info Overlay */}
        {showDevInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080808]/80 backdrop-blur-sm">
            <div className="relative w-11/12 max-w-md rounded-xl bg-[#0d0d0d] p-6 text-[#f5f5f3] shadow-lg">
              <button onClick={() => setShowDevInfo(false)} className="absolute top-2 right-2 text-[#a5a5a0] hover:text-[#f5f5f3]">
                <X size={20} />
              </button>
              <h2 className="mb-4 text-xl font-bold">Developed by</h2>
              <div className="space-y-2 overflow-y-auto max-h-64">
                <p>A.J.Pardhiv -2420080001 AI&DS</p>
                <p>CH Karthik -2420080007 AI&DS</p>
                <p>D.Harshith -2420080016 AI&DS</p>
              </div>
            </div>
          </div>
        )}
        <Header user={user} onMenu={() => setOpen(true)} />
        <main className="fade-in min-h-[calc(100vh-130px)]">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

/** Logout dock button */
function LogoutDockItem({ onLogout }: { onLogout: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="relative flex items-center">
      <div
        style={{
          position: "absolute",
          left: "calc(100% + 10px)",
          top: "50%",
          transform: hovered ? "translateY(-50%) translateX(0)" : "translateY(-50%) translateX(-6px)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.18s ease, transform 0.18s ease",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          zIndex: 200,
          background: "rgba(13,13,13,0.95)",
          border: "1px solid #242424",
          borderRadius: "10px",
          padding: "6px 10px",
          fontSize: "12px",
          fontWeight: 600,
          color: "#f5f5f3",
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        }}
      >
        Sign out
      </div>
      <button
        onClick={onLogout}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "44px",
          height: "44px",
          borderRadius: "14px",
          background: hovered ? "rgba(255,90,50,0.12)" : "transparent",
          color: hovered ? "#ff6b4a" : "#70706b",
          transform: hovered ? "scale(1.15)" : "scale(1)",
          transition: "transform 0.18s cubic-bezier(0.34,1.56,0.64,1), background 0.15s ease, color 0.15s ease",
          border: "none",
          cursor: "pointer",
        }}
        aria-label="Sign out"
      >
        <LogOut size={18} />
      </button>
    </div>
  );
}