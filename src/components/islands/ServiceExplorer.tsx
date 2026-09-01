import { useState, useCallback, memo } from "react";

type Grupo = "trabajadores" | "empleadores" | "pensionados" | "penal";
type Tab = "todos" | Grupo;

interface GrupoPayload {
  grupo: Grupo;
  title: string;
  items: string[];
}

const TABS: { id: Tab; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "trabajadores", label: "Trabajadores" },
  { id: "empleadores", label: "Empleadores" },
  { id: "pensionados", label: "Pensionados" },
  { id: "penal", label: "Penal" },
];

function waHref(title: string) {
  return `https://wa.me/573188215030?text=${encodeURIComponent(title)}`;
}

const GrupoCard = memo(function GrupoCard({
  payload,
  expanded,
  onToggle,
  visible,
}: {
  payload: GrupoPayload;
  expanded: boolean;
  onToggle: () => void;
  visible: boolean;
}) {
  const { grupo, title, items } = payload;
  const first = items.slice(0, 6);
  const rest = items.slice(6);
  const hasMore = rest.length > 0;
  return (
    <div
      style={visible ? undefined : { display: "none" }}
      className="card-lex bg-surface-container-low p-6 rounded-lg border border-outline-variant flex flex-col"
    >
      <h4 className="text-headline-md text-primary mb-4">{title}</h4>
      <ul className="space-y-0">
        {first.map((item) => (
          <li
            key={item}
            data-grupo={grupo}
            className="text-[14px] leading-6 text-on-surface border-b border-silver-metallic/60 py-2"
          >
            {item}
          </li>
        ))}
      </ul>
      {hasMore && (
        <>
          <div
            id={`grupo-${grupo}`}
            className={`grupo-extra ${expanded ? "is-expanded" : ""}`}
          >
            <ul className="space-y-0">
              {rest.map((item) => (
                <li
                  key={item}
                  data-grupo={grupo}
                  className="text-[14px] leading-6 text-on-surface border-b border-silver-metallic/60 py-2"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <button
            data-grupo-toggle
            aria-expanded={expanded}
            aria-controls={`grupo-${grupo}`}
            onClick={onToggle}
            className="mt-4 text-xs font-semibold text-primary hover:text-emerald-deep transition-colors duration-200 uppercase tracking-wider self-start"
          >
            {expanded ? "Leer menos" : "Leer más"}
          </button>
        </>
      )}
      <a
        href={waHref(title)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex self-start items-center gap-2 bg-whatsapp-green text-white px-5 py-2 rounded-full text-xs font-semibold hover:opacity-90 transition-opacity"
      >
        Consultar — {title}
      </a>
    </div>
  );
});

export default function ServiceExplorer({ grupos }: { grupos: GrupoPayload[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("todos");
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

  const toggleExpanded = useCallback((grupo: string) => {
    setExpandedMap((prev) => ({ ...prev, [grupo]: !prev[grupo] }));
  }, []);

  return (
    <div>
      <div role="tablist" aria-label="Filtrar por grupo" className="flex flex-wrap gap-2 mb-8">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeTab === t.id}
            data-active={activeTab === t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition-colors ${
              activeTab === t.id
                ? "bg-primary text-white border-primary"
                : "bg-surface-container-lowest text-on-surface-variant border-silver-metallic hover:border-primary hover:text-primary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {grupos.map((g) => (
          <GrupoCard
            key={g.grupo}
            payload={g}
            expanded={!!expandedMap[g.grupo]}
            onToggle={() => toggleExpanded(g.grupo)}
            visible={activeTab === "todos" || activeTab === g.grupo}
          />
        ))}
      </div>
    </div>
  );
}
