import { useEffect, useState } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import Card from "../../components/common/Card";
import Loading from "../../components/common/Loading";
import ProfileCard from "../../components/common/ProfileCard";
import StatusState from "../../components/common/StatusState";
import Stepper, { Step } from "../../components/common/Stepper";
import type { AdminChangeRequest, Judge, TeamGenerationConfig } from "../../types";
import { createJudge, deleteJudge, listHackathonRequests, listHackathons, listJudges, listTeams, reviewHackathonRequest, saveTeamGeneration, submitHackathonRequest, type HackathonSummary, type HackathonTeam } from "../../services/hackathonApi";

export default function HackathonJudgesPage({ canEdit = true, requesterRole = "student" }: { canEdit?: boolean; requesterRole?: "student" | "faculty" | "admin" }) {
  const [hackathons, setHackathons] = useState<HackathonSummary[]>([]);
  const [hackathonId, setHackathonId] = useState("");
  const [judges, setJudges] = useState<Judge[]>([]);
  const [requests, setRequests] = useState<AdminChangeRequest[]>([]);
  const [teamConfig, setTeamConfig] = useState<TeamGenerationConfig | null>(null);
  const [teams, setTeams] = useState<HackathonTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [expertise, setExpertise] = useState("");
  const [handle, setHandle] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [teamName, setTeamName] = useState("");
  const [teamSize, setTeamSize] = useState("4");
  const [requestMessage, setRequestMessage] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const available = await listHackathons();
      setHackathons(available);
      const selected = available.find((item) => item.id === hackathonId)?.id || available[0]?.id || "";
      setHackathonId(selected);
      if (selected) { setJudges(await listJudges(selected)); setTeams(await listTeams(selected)); }
      if (canEdit) setRequests((await listHackathonRequests()).filter((item) => item.status === "Pending"));
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to load hackathons."); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, [canEdit]);
  const selectHackathon = async (id: string) => { setHackathonId(id); setJudges(await listJudges(id)); setTeams(await listTeams(id)); setMessage(""); };
  const addJudge = async (event: React.FormEvent) => { event.preventDefault(); if (!hackathonId || !photo) return; try { const judge = await createJudge(hackathonId, { name, expertise, handle: handle || name.toLowerCase().replace(/\s+/g, "-"), photo }); setJudges((current) => [...current, judge]); setName(""); setExpertise(""); setHandle(""); setPhoto(null); const input = document.getElementById("judge-photo") as HTMLInputElement | null; if (input) input.value = ""; setMessage("Judge saved successfully."); } catch (reason) { setMessage(reason instanceof Error ? reason.message : "Unable to save judge."); } };
  const requestChange = async () => { if (!hackathonId || requestMessage.trim().length < 5) return; try { await submitHackathonRequest(hackathonId, requestMessage.trim()); setRequestMessage(""); setMessage("Request submitted successfully."); } catch (reason) { setMessage(reason instanceof Error ? reason.message : "Unable to submit request."); } };
  if (loading) return <div className="page"><Loading label="Loading hackathons..." /></div>;
  if (error) return <div className="page"><StatusState type="error" message={error} onRetry={() => void load()} /></div>;
  if (!hackathons.length) return <div className="page"><StatusState type="empty" message="No hackathons are available yet." /></div>;
  const selected = hackathons.find((item) => item.id === hackathonId) || hackathons[0];
  return <div className="page"><p className="eyebrow">Hackathon {canEdit ? "management" : "workspace"}</p><h1 className="title mt-1">{selected.name}</h1><p className="muted mt-2">{canEdit ? "Manage the judging panel and generate teams from approved participants." : "Review the judging panel and team setup. Changes are managed by the admin team."}</p>
    <label className="mt-5 block max-w-md"><span className="mb-1.5 block text-sm font-semibold">Hackathon</span><select className="input" value={hackathonId} onChange={(event) => void selectHackathon(event.target.value)}>{hackathons.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    {message && <p className="mt-4 text-sm font-semibold" role="status">{message}</p>}
    {canEdit && <Card className="mt-5 p-4"><p className="font-semibold">Change requests</p><p className="muted mt-1">{requests.length ? `${requests.length} pending request(s)` : "No pending requests"}</p>{requests.map((request) => <div key={request.id} className="mt-3 flex flex-col gap-3 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold capitalize">{request.requesterRole} request</p><p className="muted mt-1">{request.message}</p></div><div className="flex gap-2"><button type="button" className="btn-primary" onClick={async () => { await reviewHackathonRequest(request.id, "APPROVED"); setRequests((current) => current.filter((item) => item.id !== request.id)); }}>Approve</button><button type="button" className="btn-secondary" onClick={async () => { await reviewHackathonRequest(request.id, "REJECTED"); setRequests((current) => current.filter((item) => item.id !== request.id)); }}>Dismiss</button></div></div>)}</Card>}
    {!canEdit && <Card className="mt-5 p-4"><p className="font-semibold">Need an update?</p><p className="muted mt-1">Send a request to the admin instead of editing the official setup.</p><textarea className="input mt-3 min-h-20" value={requestMessage} onChange={(event) => setRequestMessage(event.target.value)} placeholder="Describe the change you need" /><button type="button" className="btn-secondary mt-3" onClick={() => void requestChange()} disabled={requestMessage.trim().length < 5}>Request admin change</button></Card>}
    <div className="mt-7 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">{canEdit && <Card className="p-6"><p className="eyebrow">Add judge</p><form className="mt-4 space-y-4" onSubmit={(event) => void addJudge(event)}><label className="block"><span className="mb-1.5 block text-sm font-semibold">Full name</span><input className="input" value={name} onChange={(event) => setName(event.target.value)} required /></label><label className="block"><span className="mb-1.5 block text-sm font-semibold">Role or expertise</span><input className="input" value={expertise} onChange={(event) => setExpertise(event.target.value)} required /></label><label className="block"><span className="mb-1.5 block text-sm font-semibold">Handle</span><input className="input" value={handle} onChange={(event) => setHandle(event.target.value)} /></label><label htmlFor="judge-photo" className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 p-4 text-sm font-semibold"><ImagePlus size={20} /><span>{photo ? photo.name : "Upload judge photo"}</span><input id="judge-photo" className="hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setPhoto(event.target.files?.[0] || null)} required /></label><button className="btn-primary w-full" type="submit" disabled={!photo}><Upload size={16} />Add to judging panel</button></form></Card>}
      <div className={!canEdit ? "lg:col-span-2" : ""}><div className="mb-4 flex items-center justify-between"><div><p className="eyebrow">Preview</p><h2 className="mt-1 text-xl font-bold">Hackathon judges</h2></div><span className="text-sm text-slate-500">{judges.length} listed</span></div>{judges.length === 0 ? <Card className="p-6"><p className="font-semibold">No judges added yet</p><p className="muted mt-1">{canEdit ? "Use the form to add the first judge." : "The admin has not published the judging panel yet."}</p></Card> : <div className="grid gap-5 sm:grid-cols-2">{judges.map((judge) => <div key={judge.id} className="relative"><ProfileCard name={judge.name} title={judge.expertise} handle={judge.handle} avatarUrl={judge.photo || ""} contactText="" />{canEdit && <button type="button" aria-label={`Remove ${judge.name}`} onClick={async () => { if (window.confirm(`Remove ${judge.name} from the judging panel?`)) { await deleteJudge(hackathonId, judge.id); setJudges((current) => current.filter((item) => item.id !== judge.id)); setMessage("Judge removed successfully."); } }} className="absolute right-3 top-3 z-10 rounded-lg bg-black/60 p-2 text-white"><Trash2 size={15} /></button>}</div>)}</div>}</div></div>
    <Card className="mt-8 p-6"><p className="eyebrow">Team generation</p><h2 className="mt-1 text-xl font-bold">Build hackathon teams</h2><p className="muted mt-2">{canEdit ? "Generate teams from approved student participants." : "View the current team-generation setup. Only admins can generate or edit teams."}</p><div className="mt-5">{canEdit ? <Stepper canAdvance={(step) => step === 1 ? teamName.trim().length >= 2 : Number(teamSize) >= selected.minTeamSize && Number(teamSize) <= selected.maxTeamSize} onFinalStepCompleted={async () => { const config = { teamPoolName: teamName.trim(), teamSize: Number(teamSize) }; const result = await saveTeamGeneration(hackathonId, config); setTeamConfig(config); setTeams(result.teams); setMessage("Teams generated successfully."); }}><Step><h3>Name your team pool</h3><p>Give this generated group a clear label.</p><input className="input" value={teamName} onChange={(event) => setTeamName(event.target.value)} placeholder="e.g. AI Innovation Sprint" /></Step><Step><h3>Choose team size</h3><p>Choose between {selected.minTeamSize} and {selected.maxTeamSize} members.</p><input className="input" type="number" min={selected.minTeamSize} max={selected.maxTeamSize} value={teamSize} onChange={(event) => setTeamSize(event.target.value)} /></Step><Step><h3>Review and generate</h3><p><strong>{teamName || "Untitled team pool"}</strong> will be generated with teams of <strong>{teamSize}</strong> members.</p></Step></Stepper> : <div className="rounded-xl border border-dashed border-slate-300 p-5"><p className="font-semibold">{teamConfig ? `${teamConfig.teamPoolName} · teams of ${teamConfig.teamSize}` : teams.length ? `${teams.length} generated teams` : "Read-only team setup"}</p><p className="muted mt-1">Team generation controls are locked for your role.</p></div>}</div>{teams.length > 0 && <div className="mt-5 grid gap-3 sm:grid-cols-2">{teams.map((team) => <div key={team.id} className="rounded-xl border border-slate-200 p-4"><p className="font-semibold">{team.teamName}</p><p className="muted mt-1">{team.teamMembers.length + 1} members assigned</p></div>)}</div>}</Card>
  </div>;
}
