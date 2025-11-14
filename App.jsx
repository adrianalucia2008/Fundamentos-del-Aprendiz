

import React, { useState, useMemo, useEffect } from 'react';

// ---------- Data (puedes mover esto a src/data/rules.js) ----------
const rulesData = [
  {
    id: 1,
    title: 'Uso del uniforme',
    category: 'Uniforme',
    description: 'El aprendiz debe portar el uniforme institucional completo durante la jornada formativa.'
  },
  {
    id: 2,
    title: 'Carné visible',
    category: 'Identificación',
    description: 'El carné debe estar visible en todo momento para facilitar la identificación.'
  },
  {
    id: 3,
    title: 'Puntualidad',
    category: 'Responsabilidad',
    description: 'Llegar a tiempo a actividades y clases para no afectar el desarrollo de la jornada.'
  },
  {
    id: 4,
    title: 'Respeto y convivencia',
    category: 'Convivencia',
    description: 'Tratar con respeto a compañeros, instructores y personal de la institución.'
  },
  {
    id: 5,
    title: 'Normas de seguridad',
    category: 'Seguridad',
    description: 'Seguir las medidas de seguridad en laboratorios y talleres; usar EPP cuando aplique.'
  }
];

// ---------- Presentational components ----------
function Header() {
  return (
    <header className="mb-6 text-center bg-green-600 text-white p-6 rounded-xl shadow-md">
      <h1 className="text-4xl font-extrabold tracking-wide">SENA Rules — Build & Play</h1>
      <p className="text-sm opacity-90">Practica React: componentes, estado, eventos y composición</p>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-8 text-xs text-gray-500">
      <p>❤️*Reglamento del Aprendiz SENA*❤️</p>
    </footer>
  );
}

// ---------- Interaction components ----------
function SearchBar({ query, setQuery }) {
  return (
    <div className="mb-4">
      <label htmlFor="search" className="block text-sm font-medium text-gray-700">Buscar normas</label>
      <input
        id="search"
        aria-label="Buscar normas por título o categoría"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ej. uniforme, puntualidad"
        className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
    </div>
  );
}

function CategoryFilter({ category, setCategory, options }) {
  return (
    <div className="mb-4">
      <label htmlFor="category" className="block text-sm font-medium text-gray-700">Filtrar por categoría</label>
      <select
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        <option value="">Todas</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function ComplianceCounter({ total, compliantCount }) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div>
        <p className="text-sm text-gray-600">Normas marcadas como cumplidas</p>
        <p className="text-xl font-semibold">{compliantCount} / {total}</p>
      </div>
      <div className="flex-1">
        <ProgressBar value={total === 0 ? 0 : (compliantCount / total) * 100} />
      </div>
    </div>
  );
}

function ProgressBar({ value }) {
  const pct = Math.round(value);
  return (
    <div aria-hidden className="w-full bg-gray-200 h-3 rounded">
      <div className="h-3 rounded" style={{ width: `${pct}%`, backgroundColor: 'rgb(34 197 94)' }} />
    </div>
  );
}

function SecurityAlert({ show }) {
  if (!show) return null;
  return (
    <div role="status" className="mb-4 rounded border-l-4 border-yellow-400 bg-yellow-50 p-3">
      <strong className="block font-semibold">Atención — Seguridad</strong>
      <p className="text-sm">Recuerda usar los equipos de protección personal (EPP) en zonas de taller y seguir las rutas de evacuación.</p>
    </div>
  );
}

// ---------- RuleCard and List ----------
function RuleCard({ rule, initiallyCumplida = false, onToggle }) {
  // Estado local de la tarjeta para control visual rápido
  const [isCumplida, setIsCumplida] = useState(initiallyCumplida);

  useEffect(() => {
    // si el padre cambia el estado global (por ejemplo reset), sincronizamos
    setIsCumplida(initiallyCumplida);
  }, [initiallyCumplida]);

  function handleToggle() {
    const newVal = !isCumplida;
    setIsCumplida(newVal);
    // notificamos al padre para actualizar contador global
    if (onToggle) onToggle(rule.id, newVal);
  }

  return (
    <article className="border rounded-xl p-5 shadow-md hover:shadow-xl transition bg-white/80 backdrop-blur-sm" aria-labelledby={`rule-${rule.id}`}>
      <header className="flex items-start justify-between gap-4">
        <div>
          <h3 id={`rule-${rule.id}`} className="text-lg font-semibold">{rule.title}</h3>
          <p className="text-xs text-gray-500">{rule.category}</p>
        </div>
        <div>
          <button
            onClick={handleToggle}
            aria-pressed={isCumplida}
            className={`px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-green-400 ${isCumplida ? 'bg-green-100 border border-green-400' : 'bg-gray-100'}`}
            title={isCumplida ? 'Marcar como pendiente' : 'Marcar como Cumplida'}
          >
            {isCumplida ? 'Cumplida ✅' : 'Marcar'}
          </button>
        </div>
      </header>

      <div className="mt-3">
        <p className="text-sm text-gray-700">{rule.description}</p>
      </div>

      {/* Composición: slot para notas o tips */}
      <div className="mt-3 text-sm text-gray-600">
        <slot />
      </div>
    </article>
  );
}

function RuleList({ rules, globalComplianceMap, onToggleRule }) {
  if (rules.length === 0) {
    return (
      <p className="text-center py-8 text-gray-500">No se encontraron normas — intenta otro término de búsqueda.</p>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {rules.map((r) => (
        <RuleCard
          key={r.id}
          rule={r}
          initiallyCumplida={!!globalComplianceMap[r.id]}
          onToggle={onToggleRule}
        />
      ))}
    </div>
  );
}

// ---------- App (componente raíz) ----------
export default function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  // mapa id -> bool para cumplimiento global
  const [globalCompliance, setGlobalCompliance] = useState(() => {
    const map = {};
    rulesData.forEach(r => map[r.id] = false);
    return map;
  });

  // para mostrar alerta de seguridad (ejemplo de componente adicional)
  const [showSecurityAlert, setShowSecurityAlert] = useState(true);

  // opciones de categoría (dinámicas)
  const categories = useMemo(() => [...new Set(rulesData.map(r => r.category))], []);

  // filtrado
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rulesData.filter(r => {
      const matchesQuery = q === '' || r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
      const matchesCategory = category === '' || r.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  // contador derivado
  const compliantCount = useMemo(() => Object.values(globalCompliance).filter(Boolean).length, [globalCompliance]);

  function handleToggleRule(id, isCumplida) {
    setGlobalCompliance(prev => ({ ...prev, [id]: isCumplida }));
  }

  function handleResetCompliance() {
    const reset = {};
    Object.keys(globalCompliance).forEach(k => reset[k] = false);
    setGlobalCompliance(reset);
  }

  return (
    <main className="flex flex-col items-center justify-center max-w-4xl mx-auto p-6 bg-gradient-to-br from-green-50 via-white to-green-100 min-h-screen rounded-lg shadow-xl">
      <Header />

      <div className="mb-4 flex gap-4 flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <SearchBar query={query} setQuery={setQuery} />
          <CategoryFilter category={category} setCategory={setCategory} options={categories} />
        </div>

        <div className="w-full md:w-64">
          <ComplianceCounter total={rulesData.length} compliantCount={compliantCount} />
          <div className="flex gap-2 mt-3">
            <button onClick={() => setShowSecurityAlert(s => !s)} className="px-3 py-2 rounded bg-green-600 text-white focus:outline-none focus:ring-2 focus:ring-green-400">{showSecurityAlert ? 'Ocultar alerta' : 'Mostrar alerta'}</button>
            <button onClick={handleResetCompliance} className="px-3 py-2 rounded border focus:outline-none focus:ring-2">Reset</button>
          </div>
        </div>
      </div>

      <SecurityAlert show={showSecurityAlert} />

      <section aria-label="Lista de normas">
        <RuleList rules={filtered} globalComplianceMap={globalCompliance} onToggleRule={handleToggleRule} />
      </section>

      <Footer />
    </main>
  );
}
