import { CalendarDays, CheckCircle2, Star, Trophy, ArrowRight, Clapperboard, Flame, Sparkles } from "lucide-react";
import DualRingDial from "../../components/common/DualRingDial";
import { Link } from "react-router-dom";
import { useFetch } from "../../hooks";
import { listEvents } from "../../services/eventService";
import EventCard from "../../components/cards/EventCard";
import StatCard from "../../components/cards/StatCard";
import Loading from "../../components/common/Loading";
import Card from "../../components/common/Card";
import Avatar from "../../components/common/Avatar";
import ProgressBar from "../../components/common/ProgressBar";
import Folder from "../../components/common/Folder";
import type { User } from "../../types";

export default function Dashboard({user}:{user:User}){
 const {data:events,loading}=useFetch(listEvents);
 const upcoming=(events||[]).filter(e=>e.status!=="Completed").slice(0,3);
 return <div className="page">
  <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div>
      <p className="eyebrow">Student overview</p>
      <h1 className="title mt-1">Good morning, {user.name.split(" ")[0]}.</h1>
      <p className="muted mt-2">Here’s what’s happening across your campus.</p>
    </div>
  </div>

  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <StatCard label="Attendance" value="86%" delta="+2.4% this month" Icon={CheckCircle2}/>
    <StatCard label="Kortex Points" value="1,020" delta="+120 this month" Icon={Star}/>
    <StatCard label="Events joined" value="13" delta="3 upcoming" Icon={CalendarDays}/>
    <StatCard label="Leaderboard" value="#5" delta="Top 10%" Icon={Trophy}/>
  </div>

  <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
    <Card className="p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Campus activity</p>
          <h2 className="mt-1 text-xl font-bold">Performance pulse</h2>
        </div>

      </div>

      <div className="mt-5 space-y-5">
        <div className="flex items-center gap-3 rounded-2xl border border-[#242424] bg-[#0d0d0d] p-3">
          <Avatar alt={user.name} fallback={user.name.slice(0,2).toUpperCase()} size={48} className="bg-gradient-to-br from-[#f5f5f3] to-[#d6d6d2] text-[#080808]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-[#f5f5f3]">{user.name}</p>
            <p className="mt-1 text-sm text-[#a5a5a0]">Campus engagement index</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-[#f5f5f3]">92</p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#ff9d4d]">strong</p>
          </div>
        </div>

        <div className="space-y-4">
          <ProgressBar label="Attendance momentum" value={86} accent="orange" />
          <ProgressBar label="Academic streak" value={74} accent="amber" />
          <ProgressBar label="Event participation" value={63} accent="white" />
        </div>
      </div>
    </Card>

    <Card className="p-6">
      <p className="eyebrow">Attendance</p>
      <div className="mt-3 flex items-center gap-3 rounded-2xl border border-[#242424] bg-[#0d0d0d] p-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#ffb26b] to-[#ff7a1a] text-[#111111]">
          <Clapperboard size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#f5f5f3]">Admin-recorded attendance</p>
          <p className="text-xs text-[#a5a5a0]">Attendance is managed centrally</p>
        </div>
      </div>
      <h3 className="mt-5 text-xl font-bold">Your attendance record</h3>
      <p className="mt-2 text-sm text-[#a5a5a0]">Event coordinators record participation from the admin portal.</p>
      <Link to="/student/attendance" className="btn-secondary mt-5 w-full justify-center">View attendance history</Link>
    </Card>
  </div>

  <div className="mt-8 flex items-center justify-between">
    <div>
      <p className="eyebrow">Campus events</p>
      <h2 className="mt-1 text-xl font-bold">Upcoming for you</h2>
    </div>
    <Link to="/student/events" className="btn-secondary">View all <ArrowRight size={16}/></Link>
  </div>
  {loading?<Loading/>:<div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{upcoming.map(e=><EventCard key={e.id} event={e}/>)}</div>}

  <div className="mt-8 grid gap-5 lg:grid-cols-2">
    <Card className="p-6">
      <p className="eyebrow">Attendance health</p>
      <h3 className="mt-2 text-xl font-bold">Campus metrics</h3>
      <div className="mt-5 flex justify-center">
        <DualRingDial
          outer={86}
          inner={74}
          outerLabel="Attendance"
          innerLabel="Academic streak"
          outerColor="#f5f5f3"
          innerColor="#ff8a1f"
          size={192}
          thickness={14}
        />
      </div>
      <Link to="/student/attendance" className="mt-5 block text-sm font-semibold text-[#f5f5f3]">Open attendance history →</Link>
    </Card>

    <Card className="p-6">
      <div className="flex items-center justify-between gap-2">
          <p className="eyebrow">Workspace</p>
        <Sparkles size={16} className="text-[#ff9d4d]" />
      </div>
      <h3 className="mt-2 text-xl font-bold">Your campus resources</h3>
      <p className="mt-2 text-sm text-[#a5a5a0]">Keep your branch materials, labs, and event notes close at hand.</p>
      <Link to="/student/events" className="btn-secondary mt-5 w-full justify-center">Explore campus activity</Link>
    </Card>
  </div>

  <Card className="resource-vault mt-8 grid gap-6 p-6 sm:grid-cols-[minmax(0,1fr)_150px] sm:items-center">
    <div className="min-w-0">
      <p className="eyebrow">Resources</p>
      <h3 className="mt-2 text-xl font-bold">Branch resource vault</h3>
      <p className="mt-2 max-w-xl text-sm text-[#a5a5a0]">Open the folder to explore your branch resources, labs, and event notes.</p>
    </div>
    <div className="resource-folder"><Folder size={1.15} items={[
      <span className="folder-paper-label">AI LABS</span>,
      <span className="folder-paper-label">DATA SETS</span>,
      <span className="folder-paper-label">EVENT NOTES</span>
    ]} /></div>
  </Card>
 </div>;
}