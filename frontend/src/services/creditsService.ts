import { api, isMockMode, apiBaseUrl } from "./apiClient";
import { authStore } from "./authStore";
import { readStorage, writeStorage } from "./storage";

export interface CreditsMember {
  id: string;
  name: string;
  role: string;
  description: string;
  imageUrl: string;
}

const STORAGE_KEY = "kortex_credits_members";

const defaultMembers: CreditsMember[] = [
  {
    id: "mem-1",
    name: "A.J. Pardhiv",
    role: "Lead Developer",
    description: "Full-stack developer building the core architecture, state engines, and UI system for Kortex.",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "mem-2",
    name: "CH Karthik",
    role: "Backend Architect",
    description: "Specializes in API integrations, data models, timetable parsers, and attendance workflows.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "mem-3",
    name: "D. Harshith",
    role: "UI/UX Designer",
    description: "Crafting modern dark-mode interfaces, interactive 3D components, and college portal identity.",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
  }
];

function checkAdmin() {
  const user = authStore.get();
  if (user?.role !== "admin") {
    throw new Error("Forbidden: Admin privileges required to perform this action.");
  }
}

export async function listMembers(): Promise<CreditsMember[]> {
  if (isMockMode) {
    const stored = readStorage<CreditsMember[] | null>(STORAGE_KEY, null);
    if (!stored || !Array.isArray(stored) || stored.length === 0) {
      writeStorage(STORAGE_KEY, defaultMembers);
      return defaultMembers;
    }
    return stored;
  }
  const result = await api<CreditsMember[] | { members: CreditsMember[] }>("/credits/members");
  return Array.isArray(result) ? result : result.members;
}

export async function createMember(data: {
  name: string;
  role: string;
  description: string;
  imageFile?: File | null;
  imageUrl?: string;
}): Promise<CreditsMember> {
  checkAdmin();

  let finalImageUrl = data.imageUrl?.trim() || "";

  if (data.imageFile) {
    finalImageUrl = await readImageAsDataUrl(data.imageFile);
  }

  if (!finalImageUrl) {
    finalImageUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80";
  }

  if (isMockMode) {
    const current = await listMembers();
    const newMember: CreditsMember = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: data.name.trim(),
      role: data.role.trim(),
      description: data.description.trim(),
      imageUrl: finalImageUrl,
    };
    const updated = [newMember, ...current];
    writeStorage(STORAGE_KEY, updated);
    return newMember;
  }

  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("role", data.role);
  formData.append("description", data.description);
  if (data.imageFile) {
    formData.append("image", data.imageFile);
  } else if (data.imageUrl) {
    formData.append("imageUrl", data.imageUrl);
  }

  return api<CreditsMember>("/credits/members", {
    method: "POST",
    body: formData,
  });
}

export async function updateMember(
  id: string,
  data: {
    name: string;
    role: string;
    description: string;
    imageFile?: File | null;
    imageUrl?: string;
  }
): Promise<CreditsMember> {
  checkAdmin();

  if (isMockMode) {
    const current = await listMembers();
    const targetIndex = current.findIndex((m) => m.id === id);
    if (targetIndex === -1) throw new Error("Member not found");

    let finalImageUrl = current[targetIndex].imageUrl;
    if (data.imageFile) {
      finalImageUrl = await readImageAsDataUrl(data.imageFile);
    } else if (data.imageUrl && data.imageUrl.trim()) {
      finalImageUrl = data.imageUrl.trim();
    }

    const updatedMember: CreditsMember = {
      id,
      name: data.name.trim(),
      role: data.role.trim(),
      description: data.description.trim(),
      imageUrl: finalImageUrl,
    };

    const nextList = [...current];
    nextList[targetIndex] = updatedMember;
    writeStorage(STORAGE_KEY, nextList);
    return updatedMember;
  }

  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("role", data.role);
  formData.append("description", data.description);
  if (data.imageFile) {
    formData.append("image", data.imageFile);
  } else if (data.imageUrl) {
    formData.append("imageUrl", data.imageUrl);
  }

  return api<CreditsMember>(`/credits/members/${id}`, {
    method: "PATCH",
    body: formData,
  });
}

export async function deleteMember(id: string): Promise<void> {
  checkAdmin();

  if (isMockMode) {
    const current = await listMembers();
    const filtered = current.filter((m) => m.id !== id);
    writeStorage(STORAGE_KEY, filtered);
    return;
  }

  return api<void>(`/credits/members/${id}`, {
    method: "DELETE",
  });
}

function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });
}
