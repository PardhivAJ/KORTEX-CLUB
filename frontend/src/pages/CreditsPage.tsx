import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, AlertCircle, X, ImagePlus, User as UserIcon, Sparkles } from "lucide-react";
import TiltedCard from "../components/TiltedCard";
import StatusState from "../components/common/StatusState";
import { useAuth } from "../hooks";
import {
  listMembers,
  createMember,
  updateMember,
  deleteMember,
  type CreditsMember,
} from "../services/creditsService";

export default function CreditsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [members, setMembers] = useState<CreditsMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states for Add/Edit
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<CreditsMember | null>(null);

  // Form inputs
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation modal state
  const [memberToDelete, setMemberToDelete] = useState<CreditsMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listMembers();
      setMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load club members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const openAddModal = () => {
    setEditingMember(null);
    setName("");
    setRole("");
    setDescription("");
    setImageUrl("");
    setImageFile(null);
    setImagePreview("");
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (member: CreditsMember) => {
    setEditingMember(member);
    setName(member.name);
    setRole(member.role);
    setDescription(member.description);
    setImageUrl(member.imageUrl);
    setImageFile(null);
    setImagePreview(member.imageUrl);
    setFormError("");
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(String(reader.result));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim()) {
      setFormError("Member name is required.");
      return;
    }
    if (!role.trim()) {
      setFormError("Member role is required.");
      return;
    }
    if (!description.trim()) {
      setFormError("Description is required.");
      return;
    }

    if (!editingMember && !imageFile && !imageUrl.trim()) {
      setFormError("Please upload an image or provide an Image URL.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingMember) {
        await updateMember(editingMember.id, {
          name: name.trim(),
          role: role.trim(),
          description: description.trim(),
          imageFile,
          imageUrl: imageUrl.trim() || undefined,
        });
      } else {
        await createMember({
          name: name.trim(),
          role: role.trim(),
          description: description.trim(),
          imageFile,
          imageUrl: imageUrl.trim() || undefined,
        });
      }
      setShowModal(false);
      await loadData();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!memberToDelete) return;
    setIsDeleting(true);
    try {
      await deleteMember(memberToDelete.id);
      setMemberToDelete(null);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete member.");
    } finally {
      setIsDeleting(false);
    }
  };

  const pageContent = (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#222222] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ff6b4a]">
            <Sparkles size={14} />
            <span>Kortex Team &amp; Contributors</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f3] tracking-tight mt-1">
            Credits &amp; Club Members
          </h1>
          <p className="text-sm text-[#a5a5a0] mt-1.5 max-w-2xl">
            Meet the developers, designers, and organizers powering the Kortex Attendance &amp; Event Management System.
          </p>
        </div>

        {/* Admin Add Member Button */}
        {isAdmin && (
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff6b4a] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#ff6b4a]/20 transition-all hover:bg-[#ff815e] active:scale-95"
          >
            <Plus size={18} />
            Add Member
          </button>
        )}
      </div>

      {/* Main Section */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[380px] rounded-2xl border border-[#222222] bg-[#111111] p-4 flex flex-col justify-between animate-pulse"
            >
              <div className="w-full aspect-[4/3] rounded-xl bg-[#1d1d1d]" />
              <div className="space-y-2 mt-4">
                <div className="h-5 w-3/4 bg-[#1d1d1d] rounded" />
                <div className="h-4 w-1/2 bg-[#1d1d1d] rounded" />
                <div className="h-3 w-full bg-[#1d1d1d] rounded mt-2" />
                <div className="h-3 w-5/6 bg-[#1d1d1d] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-[#262626] bg-[#111111] p-8 text-center">
          <StatusState type="error" message={error} onRetry={() => void loadData()} />
        </div>
      ) : members.length === 0 ? (
        <div className="rounded-2xl border border-[#222222] bg-[#111111] p-12 text-center space-y-4">
          <UserIcon className="mx-auto h-12 w-12 text-[#555555]" />
          <p className="text-lg font-bold text-[#f5f5f3]">No club members have been added yet.</p>
          {isAdmin && (
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 rounded-xl bg-[#ff6b4a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ff815e]"
            >
              <Plus size={16} />
              Add Member
            </button>
          )}
        </div>
      ) : (
        /* Member Responsive Grid: Mobile 1col, Tablet 2col, Desktop 3col, Large Desktop 4col */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex flex-col justify-between rounded-2xl border border-[#222222] bg-[#111111] p-4 transition-all duration-200 hover:border-[#333333] hover:shadow-xl"
            >
              <div>
                {/* 3D Tilted Card Image Area */}
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-[#181818] mb-4">
                  <TiltedCard
                    imageSrc={member.imageUrl}
                    altText={`${member.name} - ${member.role}`}
                    captionText={member.name}
                    containerHeight="100%"
                    containerWidth="100%"
                    imageHeight="100%"
                    imageWidth="100%"
                    scaleOnHover={1.04}
                    rotateAmplitude={6}
                    showMobileWarning={false}
                    showTooltip={true}
                  />
                </div>

                {/* Member Text Content */}
                <div className="space-y-1.5 px-1">
                  <h3 className="text-lg font-bold text-[#f5f5f3] tracking-tight line-clamp-1">
                    {member.name}
                  </h3>
                  <div>
                    <span className="inline-block rounded-full bg-[#ff6b4a]/10 border border-[#ff6b4a]/30 px-2.5 py-0.5 text-xs font-semibold text-[#ff6b4a]">
                      {member.role}
                    </span>
                  </div>
                  <p className="text-xs text-[#a5a5a0] line-clamp-3 leading-relaxed mt-2">
                    {member.description}
                  </p>
                </div>
              </div>

              {/* Admin Actions (ONLY FOR ADMIN) */}
              {isAdmin && (
                <div className="mt-4 pt-3 border-t border-[#1d1d1d] flex items-center justify-end gap-2 px-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(member)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#333333] bg-[#181818] px-3 py-1.5 text-xs font-semibold text-[#f5f5f3] hover:bg-[#252525] hover:border-[#444444] transition"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setMemberToDelete(member)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Admin Add / Edit Modal */}
      {showModal && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[#2a2a2a] bg-[#121212] p-6 text-[#f5f5f3] shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#222222] pb-4">
              <h2 className="text-xl font-bold">
                {editingMember ? "Edit Club Member" : "Add Club Member"}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-[#a5a5a0] hover:bg-[#222222] hover:text-[#f5f5f3]"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-semibold text-red-400">
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#a5a5a0] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Mehta"
                  required
                  className="w-full rounded-xl border border-[#282828] bg-[#181818] px-3.5 py-2.5 text-sm text-[#f5f5f3] placeholder-[#666666] focus:border-[#ff6b4a] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#a5a5a0] mb-1.5">
                  Club Role *
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Lead Developer, Designer, Coordinator"
                  required
                  className="w-full rounded-xl border border-[#282828] bg-[#181818] px-3.5 py-2.5 text-sm text-[#f5f5f3] placeholder-[#666666] focus:border-[#ff6b4a] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#a5a5a0] mb-1.5">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of member's contributions and responsibilities..."
                  rows={3}
                  required
                  className="w-full rounded-xl border border-[#282828] bg-[#181818] px-3.5 py-2.5 text-sm text-[#f5f5f3] placeholder-[#666666] focus:border-[#ff6b4a] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#a5a5a0] mb-1.5">
                  Member Photo *
                </label>
                
                {/* File Upload Option */}
                <div className="space-y-3">
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#333333] bg-[#181818] p-4 text-center hover:border-[#ff6b4a] transition">
                    <ImagePlus size={24} className="text-[#a5a5a0] mb-1" />
                    <span className="text-xs font-semibold text-[#f5f5f3]">
                      {imageFile ? imageFile.name : "Upload photo file"}
                    </span>
                    <span className="text-[11px] text-[#70706b]">PNG, JPG, WEBP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  <div className="relative flex items-center py-1">
                    <div className="flex-grow border-t border-[#262626]" />
                    <span className="mx-3 text-[10px] uppercase tracking-widest text-[#70706b]">OR Image URL</span>
                    <div className="flex-grow border-t border-[#262626]" />
                  </div>

                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      if (e.target.value) setImagePreview(e.target.value);
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-xl border border-[#282828] bg-[#181818] px-3.5 py-2 text-sm text-[#f5f5f3] placeholder-[#666666] focus:border-[#ff6b4a] focus:outline-none"
                  />
                </div>

                {imagePreview && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#262626] bg-[#181818] p-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <span className="text-xs text-[#a5a5a0]">Image Preview</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#222222]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-[#333333] px-4 py-2 text-sm font-semibold text-[#a5a5a0] hover:bg-[#222222] hover:text-[#f5f5f3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#ff6b4a] px-5 py-2 text-sm font-semibold text-white hover:bg-[#ff815e] disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  {editingMember ? "Save Changes" : "Create Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {memberToDelete && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#2a2a2a] bg-[#121212] p-6 text-[#f5f5f3] shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-red-400">
              Remove {memberToDelete.name} from Credits?
            </h3>
            <p className="text-sm text-[#a5a5a0]">
              This action cannot be undone. Are you sure you want to delete this member card?
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                disabled={isDeleting}
                className="rounded-xl border border-[#333333] px-4 py-2 text-sm font-semibold text-[#a5a5a0] hover:bg-[#222222] hover:text-[#f5f5f3]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
              >
                {isDeleting && <Loader2 size={16} className="animate-spin" />}
                Delete Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // CreditsPage is always rendered inside DashboardLayout (via ProtectedAny in App.tsx)
  // No need for conditional layout wrapping here.
  return pageContent;
}
