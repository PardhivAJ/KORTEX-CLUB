import { Bell, Search, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { initials } from "../../utils/formatters";
import type { User } from "../../types";
import { isMockMode } from "../../services/apiClient";
import { listUnreadNotifications, markAllNotificationsRead, markNotificationRead, type Notification } from "../../services/notificationService";

export default function Header({ user, onMenu }: { user:User; onMenu:()=>void }) {
  const [theme] = useState<"dark">("dark");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationError, setNotificationError] = useState("");

  // No theme toggle – dark mode is enforced globally

  useEffect(() => {
    if (!notificationsOpen || isMockMode) return;
    void listUnreadNotifications().then(setNotifications).catch((error: unknown) => setNotificationError(error instanceof Error ? error.message : "Unable to load notifications."));
  }, [notificationsOpen]);

  async function readAll() {
    if (isMockMode) { setNotifications([]); return; }
    await markAllNotificationsRead();
    setNotifications([]);
  }

  return <header className="sticky top-0 z-30 border-b border-[#242424] bg-[#0d0d0d]/85 backdrop-blur-xl">
    <div className="flex h-[72px] items-center gap-3 px-4 sm:px-6">
      <button onClick={onMenu} className="rounded-xl p-2 text-[#a5a5a0] transition hover:bg-[#171717] lg:hidden"><Menu size={21}/></button>
      <div className="relative hidden max-w-md flex-1 md:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#70706b]" size={17}/><input className="input pl-10" placeholder="Search Kortex..." /></div>
      <div className="ml-auto flex items-center gap-2">
          {/* Theme toggle removed – dark mode is enforced */}
        <div className="relative"><button type="button" aria-label="Open notifications" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((open) => !open)} className="relative rounded-xl p-2.5 text-[#a5a5a0] transition hover:bg-[#171717]"><Bell size={19}/>{notifications.length>0&&<span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500"/>}</button>{notificationsOpen&&<div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-[#282828] bg-[#121212] p-4 text-[#f5f5f3] shadow-2xl"><div className="flex items-center justify-between"><p className="text-sm font-bold">Notifications</p>{notifications.length>0&&<button type="button" onClick={()=>void readAll()} className="text-xs font-semibold text-[#ff6b4a]">Mark all read</button>}</div>{notificationError?<p className="mt-2 text-xs text-red-400">{notificationError}</p>:notifications.length===0?<p className="mt-2 text-xs text-[#a5a5a0]">You are all caught up.</p>:<div className="mt-3 max-h-72 space-y-3 overflow-y-auto">{notifications.map((notification)=><button type="button" key={notification.id} onClick={()=>void markNotificationRead(notification.id).then(()=>setNotifications((current)=>current.filter((item)=>item.id!==notification.id)))} className="block w-full text-left"><p className="text-sm font-semibold">{notification.title}</p><p className="mt-1 text-xs text-[#a5a5a0]">{notification.message}</p></button>)}</div>}<button type="button" onClick={() => setNotificationsOpen(false)} className="mt-3 text-xs font-semibold text-[#a5a5a0] hover:text-[#f5f5f3]">Close</button></div>}</div>
        <div className="ml-1 flex items-center gap-3 border-l border-[#242424] pl-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f5f3] text-xs font-bold text-[#080808]">{initials(user.name)}</div><div className="hidden sm:block"><p className="text-sm font-semibold text-[#f5f5f3]">{user.name}</p><p className="text-[11px] capitalize text-[#a5a5a0]">{user.role}</p></div></div>
      </div>
    </div>
  </header>;
}