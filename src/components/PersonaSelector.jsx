"use client"
import { Users, Scale, Headphones, Zap, Check } from "lucide-react"

const personaData = [
  { id: "HR", name: "HR", icon: Users, color: "from-blue-500 to-blue-600", desc: "People ops & policy" },
  { id: "Legal", name: "Legal", icon: Scale, color: "from-purple-500 to-purple-600", desc: "Contracts & compliance" },
  { id: "L1", name: "L1", icon: Headphones, color: "from-green-500 to-green-600", desc: "Frontline support" },
  { id: "L2", name: "L2", icon: Zap, color: "from-orange-500 to-orange-600", desc: "Advanced escalation" },
]

export default function PersonaSelector({ role, setRole }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {personaData.map((p) => {
        const isSelected = role === p.id
        const Icon = p.icon
        return (
          <button
            key={p.id}
            onClick={() => setRole(p.id)}
            aria-pressed={isSelected}
            aria-label={`Select ${p.name} persona`}
            title={p.name}
            className={`relative flex flex-col items-stretch gap-3 p-4 rounded-2xl transition-all duration-200 focus:outline-none
              ${isSelected
                ? "bg-gradient-to-br from-white/60 to-white/40 ring-2 ring-offset-2 ring-primary/40 shadow-lg transform -translate-y-1"
                : "bg-white border border-slate-100 hover:shadow-md"}
            `}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} shadow-sm`}
                >
                  <Icon size={20} className="text-white" />
                </span>

                <div className="text-left min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold truncate ${isSelected ? "text-primary" : "text-slate-800"}`}>
                      {p.name}
                    </p>
                    {/* small decorative pill */}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        isSelected ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {isSelected ? "Active" : "Persona"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{p.desc}</p>
                </div>
              </div>

              {/* selected check badge */}
              <div className="flex items-center">
                {isSelected ? (
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white shadow-sm">
                    <Check size={14} />
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-transparent border border-slate-100">
                    {/* visual placeholder to keep layout consistent */}
                  </span>
                )}
              </div>
            </div>

            {/* subtle separator and keyboard affordance */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-100 to-transparent w-full" />

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{isSelected ? "Selected for conversations" : "Click to select persona"}</span>
              <span className="ml-2 text-emerald-500 font-medium">{isSelected ? "Applied" : ""}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
