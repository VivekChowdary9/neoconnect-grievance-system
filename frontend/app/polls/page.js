"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { pollService } from "../../services/pollService";
import { useAuth } from "../../hooks/useAuth";
import { formatDate } from "../../lib/utils";
import Modal from "../../components/ui/Modal";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#4f46e5", "#7c3aed", "#2563eb", "#0891b2", "#059669", "#d97706"];

export default function PollsPage() {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [creating, setCreating] = useState(false);
  const [voting, setVoting] = useState({});
  const [error, setError] = useState("");

  useEffect(() => { fetchPolls(); }, []);

  const fetchPolls = async () => {
    try {
      const data = await pollService.getPolls();
      setPolls(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const hasVoted = (poll) => poll.voters?.includes(user?._id);

  const handleVote = async (pollId, optionIndex) => {
    setVoting((v) => ({ ...v, [pollId]: true }));
    try {
      await pollService.vote(pollId, optionIndex);
      await fetchPolls();
    } catch (e) {
      alert(e.response?.data?.message || "Vote failed");
    } finally {
      setVoting((v) => ({ ...v, [pollId]: false }));
    }
  };

  const handleCreate = async () => {
    setError("");
    const validOptions = options.filter((o) => o.trim());
    if (!question.trim() || validOptions.length < 2) {
      setError("Please provide a question and at least 2 options.");
      return;
    }
    setCreating(true);
    try {
      await pollService.createPoll(question, validOptions);
      setCreateModal(false);
      setQuestion("");
      setOptions(["", ""]);
      await fetchPolls();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to create poll.");
    } finally {
      setCreating(false);
    }
  };

  const totalVotes = (poll) => poll.options.reduce((sum, o) => sum + o.votes, 0);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">{polls.length} active poll{polls.length !== 1 ? "s" : ""}</p>
          </div>
          {(user?.role === "secretariat" || user?.role === "admin") && (
            <button onClick={() => setCreateModal(true)} className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all" style={{ background: "hsl(235, 85%, 55%)" }}>
              + Create Poll
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Loading polls...</div>
        ) : polls.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-12 text-center">
            <p className="text-muted-foreground text-sm">No polls yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {polls.map((poll) => {
              const voted = hasVoted(poll);
              const total = totalVotes(poll);
              const chartData = poll.options.map((o) => ({ name: o.text, votes: o.votes }));

              return (
                <div key={poll._id} className="bg-white rounded-2xl border border-border p-6">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-base leading-snug flex-1 pr-4" style={{ fontFamily: "Syne, sans-serif" }}>{poll.question}</h3>
                    {voted && <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 mt-0.5" style={{ background: "hsl(235, 85%, 96%)", color: "hsl(235, 85%, 45%)" }}>Voted</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">Created by {poll.createdBy?.name || "Secretariat"} · {formatDate(poll.createdAt)} · {total} vote{total !== 1 ? "s" : ""}</p>

                  {voted ? (
                    <div>
                      <ResponsiveContainer width="100%" height={160}>
                        <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 8 }}>
                          <XAxis type="number" hide />
                          <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11 }} />
                          <Tooltip formatter={(v) => [`${v} votes`, "Votes"]} />
                          <Bar dataKey="votes" radius={[0, 4, 4, 0]}>
                            {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="mt-3 space-y-1.5">
                        {poll.options.map((o, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{o.text}</span>
                            <span className="font-semibold">{total > 0 ? Math.round((o.votes / total) * 100) : 0}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {poll.options.map((o, i) => (
                        <button key={i} onClick={() => handleVote(poll._id, i)} disabled={!!voting[poll._id]}
                          className="w-full text-left px-4 py-3 rounded-xl border-2 border-border hover:border-primary hover:bg-accent transition-all text-sm font-medium disabled:opacity-60">
                          {o.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Poll Modal */}
      <Modal open={createModal} onClose={() => setCreateModal(false)} title="Create New Poll">
        <div className="space-y-4">
          {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
          <div>
            <label className="form-label">Question</label>
            <textarea className="form-textarea" rows={2} placeholder="What would you like to ask?" value={question} onChange={(e) => setQuestion(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Options</label>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" className="form-input" placeholder={`Option ${i + 1}`} value={opt} onChange={(e) => { const updated = [...options]; updated[i] = e.target.value; setOptions(updated); }} />
                  {options.length > 2 && (
                    <button type="button" onClick={() => setOptions(options.filter((_, idx) => idx !== i))} className="px-2.5 rounded-lg border border-border hover:bg-red-50 hover:border-red-200 text-red-500 transition-colors">✕</button>
                  )}
                </div>
              ))}
              {options.length < 6 && (
                <button type="button" onClick={() => setOptions([...options, ""])} className="text-sm font-medium hover:underline" style={{ color: "hsl(235, 85%, 55%)" }}>+ Add option</button>
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setCreateModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
            <button onClick={handleCreate} disabled={creating} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-all" style={{ background: "hsl(235, 85%, 55%)" }}>
              {creating ? "Creating..." : "Create Poll"}
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
