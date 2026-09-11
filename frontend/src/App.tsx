import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./hooks";
import DashboardLayout from "./components/layouts/DashboardLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import StudentDashboard from "./pages/student/Dashboard";
import EventsPage from "./pages/student/EventsPage";
import EventDetailPage from "./pages/student/EventDetailPage";
import CheckInPage from "./pages/student/CheckInPage";
import AttendanceHistoryPage from "./pages/student/AttendanceHistoryPage";
import LeaderboardPage from "./pages/student/LeaderboardPage";
import ProfilePage from "./pages/student/ProfilePage";
import FacultyDashboard from "./pages/faculty/Dashboard";
import AttendanceRequestsPage from "./pages/faculty/AttendanceRequestsPage";
import AdminDashboard from "./pages/admin/Dashboard";
import PendingApprovalsPage from "./pages/admin/PendingApprovalsPage";
import TimetableImportPage from "./pages/admin/TimetableImportPage";
import AuditLogsPage from "./pages/admin/AuditLogsPage";
import HackathonJudgesPage from "./pages/admin/HackathonJudgesPage";
import HackathonWorkspacePage from "./pages/student/HackathonWorkspacePage";
import type { Role } from "./types";

function Protected({role,children}:{role:Role;children:React.ReactNode}) {
 const {user,logout}=useAuth(); const loc=useLocation();
 if(!user)return <Navigate to="/login" replace state={{from:loc.pathname}}/>;
 if(user.role!==role)return <Navigate to={`/${user.role}`} replace/>;
 return <DashboardLayout user={user} onLogout={logout}>{children}</DashboardLayout>;
}
export default function App(){
 const {user}=useAuth();
 return <Routes>
  <Route path="/" element={<Navigate to={user?`/${user.role}`:"/login"} replace/>}/>
  <Route path="/login" element={<LoginPage/>}/><Route path="/register" element={<RegisterPage/>}/>
  <Route path="/student" element={<Protected role="student"><StudentDashboard user={user!}/></Protected>}/>
  <Route path="/student/hackathons" element={<Protected role="student"><HackathonWorkspacePage/></Protected>}/>
  <Route path="/student/events" element={<Protected role="student"><EventsPage/></Protected>}/>
  <Route path="/student/events/:id" element={<Protected role="student"><EventDetailPage/></Protected>}/>
  <Route path="/student/check-in" element={<Protected role="student"><CheckInPage/></Protected>}/>
  <Route path="/student/attendance" element={<Protected role="student"><AttendanceHistoryPage/></Protected>}/>
  <Route path="/student/leaderboard" element={<Protected role="student"><LeaderboardPage/></Protected>}/>
  <Route path="/student/profile" element={<Protected role="student"><ProfilePage user={user!}/></Protected>}/>
  <Route path="/faculty" element={<Protected role="faculty"><FacultyDashboard/></Protected>}/>
  <Route path="/faculty/hackathons" element={<Protected role="faculty"><HackathonJudgesPage canEdit={false} requesterRole="faculty"/></Protected>}/>
  <Route path="/faculty/attendance-requests" element={<Protected role="faculty"><AttendanceRequestsPage/></Protected>}/>
  <Route path="/admin" element={<Protected role="admin"><AdminDashboard/></Protected>}/>
    <Route path="/admin/hackathons" element={<Protected role="admin"><HackathonJudgesPage/></Protected>}/>
  <Route path="/admin/approvals" element={<Protected role="admin"><PendingApprovalsPage/></Protected>}/>
  <Route path="/admin/timetable" element={<Protected role="admin"><TimetableImportPage/></Protected>}/>
  <Route path="/admin/audit-logs" element={<Protected role="admin"><AuditLogsPage/></Protected>}/>
  <Route path="*" element={<NotFoundPage/>}/>
 </Routes>;
}