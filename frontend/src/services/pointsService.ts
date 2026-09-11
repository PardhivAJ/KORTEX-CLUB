import { api, isMockMode } from "./apiClient";
import type { LeaderboardEntry } from "../types";

const leaderboard: LeaderboardEntry[] = [
  { rank:1, name:"Aarav Mehta", department:"CSE", points:1280, events:18 },
  { rank:2, name:"Ananya Rao", department:"ECE", points:1215, events:16 },
  { rank:3, name:"Rahul Verma", department:"CSE", points:1160, events:15 },
  { rank:4, name:"Ishita Reddy", department:"IT", points:1085, events:14 },
  { rank:5, name:"Karthik N", department:"CSE", points:1020, events:13 },
  { rank:6, name:"Sneha Patil", department:"EEE", points:980, events:12 }
];

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!isMockMode) return api<LeaderboardEntry[]>("/leaderboard");
  return leaderboard;
}