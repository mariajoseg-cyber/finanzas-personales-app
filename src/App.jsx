import { useMemo, useState } from 'react';

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const toNumber = (value) => {
  const normalized = Number(value);
  return Number.isFinite(normalized) ? normalized : 0;
};

const createDefaultMonthData = () => ({
  ingresos: {
    sueldoBase: 0,
    gratificacion: 0,
    bonos: 0,
    asignacionFamiliar: 0,
    colacion: 0,
  },
  descuentos: {
    afpPorcentaje: 10,
    saludPorcentaje: 7,
  },
  gastos: [
    { id: crypto.randomUUID(), categoria: 'Vivienda', monto: 0 },
    { id: crypto.randomUUID(), categoria: 'Alimentación', monto: 0 },
    { id: crypto.randomUUID(), categoria: 'Transporte', monto: 0 },
    { id: crypto.randomUUID(), categoria: 'Educación', monto: 0 },
    { id: crypto.randomUUID(), categoria: 'Salud', monto: 0 },
    { id: crypto.randomUUID(), categoria: 'Deudas', monto: 0 },
    { id: crypto.randomUUID(), categoria: 'Otros', monto: 0 },
  ],
  deudas: [],
  ahorroMeta: 0,
});

const SAMPLE_DATA = {
  Enero: {
    ingresos: {
      sueldoBase: 980000,
      gratificacion: 110000,
      bonos: 65000,
      asignacionFamiliar: 32000,
      colacion: 45000,
    },
    descuentos: {
      afpPorcentaje: 10,
      saludPorcentaje: 7,
    },
    gastos: [
      { id: crypto.randomUUID(), categoria: 'Vivienda', monto: 360000 },
      { id: crypto.randomUUID(), categoria: 'Alimentación', monto: 230000 },
      { id: crypto.randomUUID(), categoria: 'Transporte', monto: 90000 },
      { id: crypto.randomUUID(), categoria: 'Educación', monto: 65000 },
      { id: crypto.randomUUID(), categoria: 'Salud', monto: 42000 },
      { id: crypto.randomUUID(), categoria: 'Deudas', monto: 180000 },
      { id: crypto.randomUUID(), categoria: 'Otros', monto: 55000 },
    ],
    deudas: [
      {
        id: crypto.randomUUID(),
        nombre: 'Crédito consumo banco',
        montoTotal: 2200000,
        cuotaMensual: 120000,
        saldoPendiente: 960000,
      },
      {
        id: crypto.randomUUID(),
        nombre: 'Tarjeta retail',
        montoTotal: 780000,
        cuotaMensual: 60000,
        saldoPendiente: 240000,
      },
    ],
    ahorroMeta: 100000,
  },
  Febrero: {
    ingresos: {
      sueldoBase: 980000,
      gratificacion: 110000,
      bonos: 40000,
      asignacionFamiliar: 32000,
      colacion: 45000,
    },
    descuentos: {
      afpPorcentaje: 10,
      saludPorcentaje: 7,
    },
    gastos: [
      { id: crypto.randomUUID(), categoria: 'Vivienda', monto: 360000 },
      { id: crypto.randomUUID(), categoria: 'Alimentación', monto: 210000 },
      { id: crypto.randomUUID(), categoria: 'Transporte', monto: 75000 },
      { id: crypto.randomUUID(), categoria: 'Educación', monto: 42000 },
      { id: crypto.randomUUID(), categoria: 'Salud', monto: 36000 },
      { id: crypto.randomUUID(), categoria: 'Deudas', monto: 180000 },
      { id: crypto.randomUUID(), categoria: 'Otros', monto: 50000 },
    ],
    deudas: [
      {
        id: crypto.randomUUID(),
        nombre: 'Crédito consumo banco',
        montoTotal: 2200000,
        cuotaMensual: 120000,
        saldoPendiente: 840000,
      },
      {
        id: crypto.randomUUID(),
        nombre: 'Tarjeta retail',
        montoTotal: 780000,
        cuotaMensual: 60000,
        saldoPendiente: 180000,
      },
    ],
    ahorroMeta: 120000,
  },
};

const loadInitialData = () => {
  const stored = localStorage.getItem('finanzas-personales-chile');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return SAMPLE_DATA;
    }
  }
  return SAMPLE_DATA;
};

function App() {
  const [mesActual, setMesActual] = useState('Enero');
  const [datosMensuales, setDatosMensuales] = useState(loadInitialData);

  const monthData = datosMensuales[mesActual] ?? createDefaultMonthData();

  const persistMonthUpdate = (updater) => {
    setDatosMensuales((prev) => {
      const updated = updater(prev);
      localStorage.setItem('finanzas-personales-chile', JSON.stringify(updated));
      return updated;
    });
  };

  const ensureMonth = (month) => {
    persistMonthUpdate((prev) => {
      if (prev[month]) {
        return prev;
      }
      return { ...prev, [month]: createDefaultMonthData() };
    });
  };

  const handleMonthChange = (event) => {
    const nextMonth = event.target.value;
    ensureMonth(nextMonth);
    setMesActual(nextMonth);
  };

  const updateIngresos = (field, value) => {
    persistMonthUpdate((prev) => ({
      ...prev,
      [mesActual]: {
        ...monthData,
        ingresos: {
          ...monthData.ingresos,
          [field]: toNumber(value),
        },
      },
    }));
  };

  const updateDescuentos = (field, value) => {
    persistMonthUpdate((prev) => ({
      ...prev,
      [mesActual]: {
        ...monthData,
        descuentos: {
          ...monthData.descuentos,
          [field]: toNumber(value),
        },
      },
    }));
  };

  const updateAhorroMeta = (value) => {
    persistMonthUpdate((prev) => ({
      ...prev,
      [mesActual]: {
        ...monthData,
        ahorroMeta: toNumber(value),
      },
    }));
  };

  const addGasto = () => {
    persistMonthUpdate((prev) => ({
      ...prev,
      [mesActual]: {
        ...monthData,
        gastos: [...monthData.gastos, { id: crypto.randomUUID(), categoria: 'Nueva categoría', monto: 0 }],
      },
    }));
  };

  const updateGasto = (id, field, value) => {
    persistMonthUpdate((prev) => ({
      ...prev,
      [mesActual]: {
        ...monthData,
        gastos: monthData.gastos.map((gasto) =>
          gasto.id === id
            ? {
                ...gasto,
                [field]: field === 'monto' ? toNumber(value) : value,
              }
            : gasto,
        ),
      },
    }));
  };

  const removeGasto = (id) => {
    persistMonthUpdate((prev) => ({
      ...prev,
      [mesActual]: {
        ...monthData,
        gastos: monthData.gastos.filter((gasto) => gasto.id !== id),
      },
    }));
  };

  const addDeuda = () => {
    persistMonthUpdate((prev) => ({
      ...prev,
      [mesActual]: {
        ...monthData,
        deudas: [
          ...monthData.deudas,
          {
            id: crypto.randomUUID(),
            nombre: 'Nueva deuda',
            montoTotal: 0,
            cuotaMensual: 0,
            saldoPendiente: 0,
          },
        ],
      },
    }));
  };

  const updateDeuda = (id, field, value) => {
    persistMonthUpdate((prev) => ({
      ...prev,
      [mesActual]: {
        ...monthData,
        deudas: monthData.deudas.map((deuda) =>
          deuda.id === id
            ? {
                ...deuda,
                [field]: field === 'nombre' ? value : toNumber(value),
              }
            : deuda,
        ),
      },
    }));
  };

  const removeDeuda = (id) => {
    persistMonthUpdate((prev) => ({
      ...prev,
      [mesActual]: {
        ...monthData,
        deudas: monthData.deudas.filter((deuda) => deuda.id !== id),
      },
    }));
  };

  const calculos = useMemo(() => {
    const ingresos = monthData.ingresos;
    const totalIngresos = Object.values(ingresos).reduce((acc, value) => acc + toNumber(value), 0);

    const afp = totalIngresos * (toNumber(monthData.descuentos.afpPorcentaje) / 100);
    const salud = totalIngresos * (toNumber(monthData.descuentos.saludPorcentaje) / 100);
    const descuentosTotales = afp + salud;
    const sueldoLiquido = totalIngresos - descuentosTotales;

    const totalGastos = monthData.gastos.reduce((acc, gasto) => acc + toNumber(gasto.monto), 0);
    const totalDeudasMensual = monthData.deudas.reduce((acc, deuda) => acc + toNumber(deuda.cuotaMensual), 0);

    const dineroRestante = sueldoLiquido - totalGastos - totalDeudasMensual;
    const ahorroMeta = toNumber(monthData.ahorroMeta);
    const ahorroCumplido = dineroRestante - ahorroMeta;

    return {
      totalIngresos,
      descuentosTotales,
      sueldoLiquido,
      totalGastos,
      totalDeudasMensual,
      dineroRestante,
      ahorroMeta,
      ahorroCumplido,
    };
  }, [monthData]);

  const resumenMensaje =
    calculos.dineroRestante < 0
      ? 'Te falta dinero este mes.'
      : `Puedes ahorrar ${formatCurrency(calculos.dineroRestante)} este mes.`;

  return (
    <div className="app-container">
      <header className="main-header card">
        <div>
          <h1>Control de Finanzas Personales Chile</h1>
          <p>Organiza ingresos, gastos, deudas y ahorro mensual en un solo lugar.</p>
        </div>
        <label className="month-selector">
          Mes:
          <select value={mesActual} onChange={handleMonthChange}>
            {MONTHS.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </label>
      </header>

      <section className="summary-grid">
        <article className="card summary-card">
          <h3>Total ingresos</h3>
          <p>{formatCurrency(calculos.totalIngresos)}</p>
        </article>
        <article className="card summary-card">
          <h3>Sueldo líquido estimado</h3>
          <p>{formatCurrency(calculos.sueldoLiquido)}</p>
        </article>
        <article className="card summary-card">
          <h3>Total gastos</h3>
          <p>{formatCurrency(calculos.totalGastos)}</p>
        </article>
        <article className="card summary-card">
          <h3>Total deudas (cuotas)</h3>
          <p>{formatCurrency(calculos.totalDeudasMensual)}</p>
        </article>
        <article className={`card summary-card ${calculos.dineroRestante >= 0 ? 'positive' : 'negative'}`}>
          <h3>Dinero restante</h3>
          <p>{formatCurrency(calculos.dineroRestante)}</p>
        </article>
        <article className={`card summary-card ${calculos.dineroRestante >= 0 ? 'positive' : 'negative'}`}>
          <h3>Estado mensual</h3>
          <p>{resumenMensaje}</p>
        </article>
      </section>

      <section className="card section-card">
        <h2>1. Ingresos mensuales</h2>
        <div className="form-grid">
          {[
            ['sueldoBase', 'Sueldo base'],
            ['gratificacion', 'Gratificación'],
            ['bonos', 'Bonos'],
            ['asignacionFamiliar', 'Asignación familiar'],
            ['colacion', 'Colación'],
          ].map(([field, label]) => (
            <label key={field}>
              {label}
              <input
                type="number"
                min="0"
                value={monthData.ingresos[field]}
                onChange={(event) => updateIngresos(field, event.target.value)}
              />
            </label>
          ))}
        </div>
        <p className="highlight-text">Total de ingresos: {formatCurrency(calculos.totalIngresos)}</p>
      </section>

      <section className="card section-card">
        <h2>2. Descuentos y sueldo líquido estimado</h2>
        <div className="form-grid two-columns">
          <label>
            AFP (%)
            <input
              type="number"
              min="0"
              max="30"
              value={monthData.descuentos.afpPorcentaje}
              onChange={(event) => updateDescuentos('afpPorcentaje', event.target.value)}
            />
          </label>
          <label>
            Salud (%)
            <input
              type="number"
              min="0"
              max="20"
              value={monthData.descuentos.saludPorcentaje}
              onChange={(event) => updateDescuentos('saludPorcentaje', event.target.value)}
            />
          </label>
        </div>
        <div className="result-row">
          <p>Descuentos totales: {formatCurrency(calculos.descuentosTotales)}</p>
          <p>Sueldo líquido estimado: {formatCurrency(calculos.sueldoLiquido)}</p>
        </div>
      </section>

      <section className="card section-card">
        <h2>3. Gastos mensuales</h2>
        <button type="button" onClick={addGasto} className="secondary-button">
          + Agregar gasto
        </button>
        <div className="stack-list">
          {monthData.gastos.map((gasto) => (
            <div className="row-card" key={gasto.id}>
              <input
                type="text"
                value={gasto.categoria}
                onChange={(event) => updateGasto(gasto.id, 'categoria', event.target.value)}
              />
              <input
                type="number"
                min="0"
                value={gasto.monto}
                onChange={(event) => updateGasto(gasto.id, 'monto', event.target.value)}
              />
              <button type="button" className="danger-button" onClick={() => removeGasto(gasto.id)}>
                Eliminar
              </button>
            </div>
          ))}
        </div>
        <p className="highlight-text">Total de gastos: {formatCurrency(calculos.totalGastos)}</p>
      </section>

      <section className="card section-card">
        <h2>4. Deudas</h2>
        <button type="button" onClick={addDeuda} className="secondary-button">
          + Agregar deuda
        </button>
        <div className="stack-list">
          {monthData.deudas.map((deuda) => {
            const progress = deuda.montoTotal > 0 ? ((deuda.montoTotal - deuda.saldoPendiente) / deuda.montoTotal) * 100 : 0;

            return (
              <div className="debt-card" key={deuda.id}>
                <div className="row-card debt-grid">
                  <input
                    type="text"
                    value={deuda.nombre}
                    onChange={(event) => updateDeuda(deuda.id, 'nombre', event.target.value)}
                  />
                  <input
                    type="number"
                    min="0"
                    value={deuda.montoTotal}
                    onChange={(event) => updateDeuda(deuda.id, 'montoTotal', event.target.value)}
                    placeholder="Monto total"
                  />
                  <input
                    type="number"
                    min="0"
                    value={deuda.cuotaMensual}
                    onChange={(event) => updateDeuda(deuda.id, 'cuotaMensual', event.target.value)}
                    placeholder="Cuota mensual"
                  />
                  <input
                    type="number"
                    min="0"
                    value={deuda.saldoPendiente}
                    onChange={(event) => updateDeuda(deuda.id, 'saldoPendiente', event.target.value)}
                    placeholder="Saldo pendiente"
                  />
                  <button type="button" className="danger-button" onClick={() => removeDeuda(deuda.id)}>
                    Eliminar
                  </button>
                </div>
                <div className="progress-wrapper">
                  <div className="progress-label">
                    <span>Progreso pago</span>
                    <span>{Math.max(0, Math.min(100, progress)).toFixed(1)}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-bar" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="highlight-text">Total mensual en deudas: {formatCurrency(calculos.totalDeudasMensual)}</p>
      </section>

      <section className="card section-card">
        <h2>6. Ahorro</h2>
        <div className="form-grid two-columns">
          <label>
            Meta de ahorro mensual
            <input
              type="number"
              min="0"
              value={monthData.ahorroMeta}
              onChange={(event) => updateAhorroMeta(event.target.value)}
            />
          </label>
        </div>
        <p className={`highlight-text ${calculos.ahorroCumplido >= 0 ? 'positive-text' : 'negative-text'}`}>
          {calculos.ahorroCumplido >= 0
            ? `Sí puedes cumplir tu meta. Te sobran ${formatCurrency(calculos.ahorroCumplido)}.`
            : `No alcanzas la meta. Te faltan ${formatCurrency(Math.abs(calculos.ahorroCumplido))}.`}
        </p>
      </section>
    </div>
  );
}

export default App;
