import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Bell, Moon, Sun, Check, X, Users, Cloud, Link as LinkIcon } from "lucide-react";

// Single-file preview UI for the "Canceled" app idea.
// TailwindCSS is assumed to be available in this preview environment.
// No data persistence; just interactive visuals.

const glass =
  "backdrop-blur-xl bg-white/60 dark:bg-white/10 border border-white/50 dark:border-white/10 shadow-2xl";
const softText = "text-slate-700 dark:text-slate-200";
const softSub = "text-slate-500 dark:text-slate-400";
const accent =
  "from-blue-500/20 via-sky-400/20 to-indigo-500/20 dark:from-blue-300/10 dark:via-sky-200/10 dark:to-indigo-300/10";

function Segmented({ value, onChange, items }) {
  return (
    <div className={`relative ${glass} rounded-2xl p-1 flex gap-1`}>
      {items.map((it) => (
        <button
          key={it.value}
          onClick={() => onChange(it.value)}
          className={`relative flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            value === it.value
              ? "bg-white/80 dark:bg-white/20 text-slate-900 dark:text-white shadow"
              : "text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10"
          }`}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

function Chip({ children }) {
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900/5 dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-900/10 dark:border-white/10">
      {children}
    </span>
  );
}

function GhostButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-xl border border-slate-900/10 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10 transition ${softText}`}
    >
      {children}
    </button>
  );
}

function PrimaryButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-xl font-semibold text-slate-900 dark:text-slate-900 bg-gradient-to-br from-white to-white/80 border border-white/70 shadow hover:shadow-md transition"
    >
      {children}
    </button>
  );
}

function SecretButton({ onClick, voted }) {
  return (
    <button
      onClick={onClick}
      className={`w-full justify-center items-center inline-flex gap-2 px-4 py-3 rounded-2xl font-semibold border transition ${
        voted
          ? "border-emerald-600/30 bg-emerald-400/20 text-emerald-900 dark:text-emerald-200"
          : "border-slate-900/10 dark:border-white/10 bg-white/50 dark:bg-white/10 text-slate-900 dark:text-white hover:bg-white/70 dark:hover:bg-white/20"
      }`}
    >
      <ShieldIcon /> {voted ? "Gespeichert (geheim)" : "Nicht bestätigen (geheim)"}
    </button>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-80">
      <path d="M12 3l7 3v6c0 5-3.5 9-7 9s-7-4-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.5 12.5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EventCard({ e, onVote, selected, onSelect }) {
  return (
    <div
      className={`${glass} rounded-3xl p-4 md:p-5 relative overflow-hidden transition ring-1 ring-transparent ${
        selected ? "ring-blue-500/40" : "hover:ring-blue-400/20"
      }`}
    >
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br ${accent}"></div>
      <div className="flex items-start gap-3">
        <div className="shrink-0 p-2 rounded-2xl bg-white/70 dark:bg-white/10 border border-white/50 dark:border-white/10">
          <Calendar className="w-5 h-5 text-sky-700 dark:text-sky-200" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className={`text-base md:text-lg font-semibold ${softText}`}>{e.title}</h3>
            <GhostButton onClick={() => onSelect?.(e.id)}>Details</GhostButton>
          </div>
          <p className={`mt-1 text-sm ${softSub}`}>{e.time} · {e.when}</p>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {e.inCalendar && <Chip>📅 Im Kalender</Chip>}
            {e.appOnly && <Chip>🔒 Nur in App</Chip>}
            {e.status === "confirmed" && <Chip>Bestätigt</Chip>}
            {e.status === "mutual" && <Chip>Nicht bestätigt</Chip>}
            {e.status === "pending" && <Chip>Einladung offen</Chip>}
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <SecretButton onClick={() => onVote(e.id)} voted={e.voted} />
            <GhostButton>
              <Users className="w-4 h-4 mr-1 inline-block" /> Teilnehmer
            </GhostButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailPanel({ event, onPropose }) {
  if (!event) {
    return (
      <div className={`${glass} rounded-3xl p-6 min-h-[240px] flex items-center justify-center`}>
        <p className={softSub}>Wähle links einen Termin aus, um Details zu sehen.</p>
      </div>
    );
  }
  return (
    <div className={`${glass} rounded-3xl p-6 space-y-4 relative overflow-hidden`}>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br ${accent}"></div>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-2xl bg-white/70 dark:bg-white/10 border border-white/50 dark:border-white/10">
          <Calendar className="w-5 h-5 text-sky-700 dark:text-sky-200" />
        </div>
        <div>
          <h3 className={`text-lg font-semibold ${softText}`}>{event.title}</h3>
          <p className={`text-sm ${softSub}`}>{event.time} · {event.when}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {event.inCalendar && <Chip>📅 Im Kalender</Chip>}
        {event.appOnly && <Chip>🔒 Nur in App</Chip>}
        <Chip>{event.status === "mutual" ? "Nicht bestätigt" : "Bestätigt"}</Chip>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <SecretButton onClick={() => {}} voted={event.voted} />
        <GhostButton>
          <Bell className="w-4 h-4 mr-1 inline-block" /> Erinnerung
        </GhostButton>
      </div>

      {event.status === "mutual" && (
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className={`${softSub} text-sm`}>Termin wurde nicht bestätigt.</p>
          <PrimaryButton onClick={onPropose}><Check className="w-4 h-4 mr-1 inline-block"/> Neuen Vorschlag</PrimaryButton>
        </div>
      )}

      <div className="pt-2 border-t border-white/50 dark:border-white/10 text-sm">
        <p className={softSub}>Neutrale Sprache, keine Schuldzuweisung. Änderungen werden zwischen App und iOS‑Kalender synchronisiert, sofern Schreibrechte vorhanden sind.</p>
      </div>
    </div>
  );
}

function Blobs() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -top-10 -left-10 w-72 h-72 rounded-full blur-3xl"
        style={{ background:
          "radial-gradient(closest-side, rgba(59,130,246,0.25), transparent)" }}
        animate={{ y: [0, 20, -10, 0], x: [0, 10, 0, -10] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-10 -right-10 w-80 h-80 rounded-full blur-3xl"
        style={{ background:
          "radial-gradient(closest-side, rgba(56,189,248,0.25), transparent)" }}
        animate={{ y: [0, -15, 0], x: [0, -10, 10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function GridBG() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-20">
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          backgroundPosition: "-1px -1px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white to-white dark:from-slate-950 dark:to-slate-950" />
    </div>
  );
}

export default function CanceledConcept() {
  const [dark, setDark] = useState(false);
  const [mode, setMode] = useState("A");
  const [selectedId, setSelectedId] = useState(null);
  const [items, setItems] = useState(() => [
    { id: "1", title: "Kaffee am Freitag", time: "Fr, 17:00 – 18:00", when: "25. Aug 2025", status: "confirmed", inCalendar: true, appOnly: false, voted: false },
    { id: "2", title: "Gym Session", time: "Heute, 19:30 – 20:30", when: "20. Aug 2025", status: "pending", inCalendar: false, appOnly: true, voted: false },
    { id: "3", title: "Brunch Sonntag", time: "So, 11:00 – 12:30", when: "24. Aug 2025", status: "mutual", inCalendar: true, appOnly: false, voted: true },
  ]);

  const selected = useMemo(() => items.find((i) => i.id === selectedId) || null, [items, selectedId]);

  const vote = (id) => {
    setItems((prev) => prev.map((e) => (e.id === id ? { ...e, voted: !e.voted } : e)));
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="relative min-h-screen overflow-hidden bg-white dark:bg-slate-950">
        <GridBG />
        <Blobs />

        {/* Topbar */}
        <div className="sticky top-0 z-20">
          <div className="mx-auto max-w-6xl px-4 md:px-6 pt-6">
            <div className={`${glass} rounded-3xl px-4 py-3 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-500 shadow-inner" />
                <div>
                  <h1 className={`text-lg font-semibold ${softText}`}>Canceled</h1>
                  <p className={`text-xs ${softSub}`}>Neutral. Diskret. Beidseitig.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Segmented
                  value={mode}
                  onChange={setMode}
                  items={[
                    { label: "A: Aus Kalender", value: "A" },
                    { label: "B: In Kalender", value: "B" },
                    { label: "C: Nur App", value: "C" },
                  ]}
                />
                <button
                  onClick={() => setDark((d) => !d)}
                  className={`ml-2 p-2 rounded-xl border border-white/50 dark:border-white/10 ${softText} hover:bg-white/50 dark:hover:bg-white/10`}
                  aria-label="Theme"
                >
                  {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="mx-auto max-w-6xl px-4 md:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-4">
            <div className={`${glass} rounded-3xl p-4`}> 
              <div className="flex items-center justify-between">
                <h2 className={`text-base md:text-lg font-semibold ${softText}`}>Bevorstehende Termine</h2>
                <div className={`${softSub} text-xs flex items-center gap-2`}>
                  <Calendar className="w-4 h-4"/>
                  {mode === "A" && <span>Übernimmt aus iOS‑Kalender</span>}
                  {mode === "B" && <span>Erstellt in iOS‑Kalender</span>}
                  {mode === "C" && <span>Nur in der App</span>}
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {items.map((e) => (
                <EventCard
                  key={e.id}
                  e={e}
                  onVote={vote}
                  selected={selectedId === e.id}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
          </section>

          <aside className="lg:col-span-1 space-y-4">
            <DetailPanel event={selected} onPropose={() => {}} />

            {/* Push Preview */}
            <div className={`${glass} rounded-3xl p-4`}> 
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/70 dark:bg-white/10 border border-white/50 dark:border-white/10">
                  <Bell className="w-4 h-4 text-sky-700 dark:text-sky-200" />
                </div>
                <div>
                  <p className={`text-sm ${softText}`}>Push-Vorschau</p>
                  <p className={`text-xs ${softSub}`}>„Euer Termin wurde nicht bestätigt. Vorschlag neu?“</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <GhostButton>
                  <LinkIcon className="w-4 h-4 mr-1 inline-block"/> Deep Link
                </GhostButton>
                <GhostButton>
                  <Cloud className="w-4 h-4 mr-1 inline-block"/> Silent Push
                </GhostButton>
              </div>
            </div>
          </aside>
        </main>

        {/* Footer */}
        <footer className="mx-auto max-w-6xl px-4 md:px-6 pb-10">
          <div className={`${glass} rounded-3xl p-4 text-xs ${softSub} flex items-center justify-between`}> 
            <span>Konzept‑UI · iOS‑Style „Liquid Glass“ in Blau‑Tönen · Dark Mode: eisig‑weiß/blau</span>
            <span className="hidden sm:inline">© 2025 Canceled (Demo)</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
