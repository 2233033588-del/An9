/**
 * MOTOR CIENTÍFICO HIDROLÓGICO Y REGISTRO DE TELEMETRÍA
 * Proyecto: Huella Oculta - UAM Lerma
 */

// 1. BASE DE DATOS CIENTÍFICA (Water Footprint Network Data)
const ALIMENTOS_DB = {
  carnicos: [
    { id: 'res', nombre: 'Carne de Res (200g)', icono: '🥩', nutricion: 40, aguaVirtual: 2250 },
    { id: 'cerdo', nombre: 'Chuleta de Cerdo', icono: '🥓', nutricion: 30, aguaVirtual: 900 },
    { id: 'pollo', nombre: 'Pechuga de Pollo', icono: '🍗', nutricion: 25, aguaVirtual: 600 }
  ],
  vegetales: [
    { id: 'frijol', nombre: 'Porción de Frijoles', icono: '🫘', nutricion: 25, aguaVirtual: 250 },
    { id: 'manzana', nombre: 'Manzana Fresca', icono: '🍎', nutricion: 15, aguaVirtual: 70 },
    { id: 'jitomate', nombre: 'Jitomate Local', icono: '🍅', nutricion: 10, aguaVirtual: 50 }
  ],
  procesados: [
    { id: 'hamburguesa', nombre: 'Hamburguesa Doble', icono: '🍔', nutricion: 45, aguaVirtual: 2400 },
    { id: 'pizza', nombre: 'Rebanada de Pizza', icono: '🍕', nutricion: 35, aguaVirtual: 1200 },
    { id: 'papas', nombre: 'Papas Fritas', icono: '🍟', nutricion: 15, aguaVirtual: 300 }
  ],
  bebidas: [
    { id: 'refresco', nombre: 'Refresco (600ml)', icono: '🥤', nutricion: 10, aguaVirtual: 350 },
    { id: 'cafe', nombre: 'Taza de Café', icono: '☕', nutricion: 5, aguaVirtual: 140 },
    { id: 'leche', nombre: 'Vaso de Leche', icono: '🥛', nutricion: 20, aguaVirtual: 500 }
  ],
  tecnologias: [
    { id: 'captacion', nombre: 'Captación Pluvial', icono: '🌧️', costoEco: 20, tipo: 'recarga' },
    { id: 'goteo', nombre: 'Riego por Goteo', icono: '🌾', costoEco: 40, tipo: 'eficiencia' }
  ]
};

// 2. CLASE DE SIMULACIÓN HIDROLÓGICA (SISTEMA DINÁMICO)
class HidroSimulador {
  constructor(capacidadMax = 15000, tasaRecarga = 150) {
    this.W_max = capacidadMax;      // Capacidad máxima de almacenamiento (L)
    this.W_t = capacidadMax;        // Volumen actual del acuífero (L)
    this.R = tasaRecarga;           // Tasa de recarga natural por turno (L)
    this.S_t = 100;                 // Salud poblacional (%)
    this.E_t = 0;                   // Puntos de conciencia ecológica
    this.dia = 1;
    this.multiplicadorClima = 1.0;
    this.eficienciaRiego = 1.0;
    
    // Registro de Telemetría para Análisis de Tesis
    this.totalAguaConsumida = 0;
    this.historialDecisiones = [];
  }

  // Ecuaciones Diferenciales Discretas
  procesarTurno(item) {
    let aguaGastada = 0;

    if (item.costoEco !== undefined) {
      // Aplicar mejora tecnológica
      this.E_t -= item.costoEco;
      if (item.tipo === 'recarga') this.W_t = Math.min(this.W_max, this.W_t + 3000);
      if (item.tipo === 'eficiencia') this.eficienciaRiego = 0.7; // Reducción del 30% en consumo
    } else {
      // Balance Hídrico: W_t = W_{t-1} - (Hv * Mc * Ef) + R
      aguaGastada = item.aguaVirtual * this.multiplicadorClima * this.eficienciaRiego;
      this.W_t = Math.max(0, Math.min(this.W_max, this.W_t - aguaGastada + this.R));
      this.totalAguaConsumida += aguaGastada;

      // Penalización por Estrés Hídrico Extremo
      let penalizacion = (this.W_t < 2000) ? 20 : 0;
      this.S_t = Math.max(0, Math.min(100, this.S_t + item.nutricion - penalizacion));

      // Acumulación de Conciencia Ecológica
      if (item.aguaVirtual < 300) this.E_t += 10;
    }

    // Telemetría: Registro del evento para exportación estadística
    this.historialDecisiones.push({
      dia: this.dia,
      itemSeleccionado: item.nombre || item.id,
      aguaGastada: aguaGastada,
      nivelAcuiferoRemanente: this.W_t,
      saludPoblacion: this.S_t,
      factorClimatico: this.multiplicadorClima
    });

    this.dia++;
    this.evaluarClima();
    return this.estadoEcosistema();
  }

  evaluarClima() {
    let azar = Math.random();
    if (azar < 0.18 && this.dia > 2) {
      this.multiplicadorClima = 1.5; // Ola de Calor
    } else {
      this.multiplicadorClima = 1.0;
    }
  }

  estadoEcosistema() {
    let pct = (this.W_t / this.W_max) * 100;
    if (pct > 70) return 'prospero';
    if (pct > 40) return 'estres';
    if (pct > 15) return 'sequia';
    return 'apocalipsis';
  }
}

// 3. CONTROLADOR DE INTERFAZ Y EVENTOS TÁCTILES
const sim = new HidroSimulador();
let categoriaActual = 'carnicos';

document.addEventListener("DOMContentLoaded", () => {
  inicializarEventosUI();
  renderizarTarjetas();
  actualizarUI();
});

function inicializarEventosUI() {
  // Pestañas de categoría
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      categoriaActual = e.target.dataset.cat;
      renderizarTarjetas();
    });
  });

  // Botón Reiniciar
  document.getElementById("btn-reiniciar").addEventListener("click", () => location.reload());

  // Botón Exportación CSV (Telemetría para Tesis)
  document.getElementById("btn-exportar-csv").addEventListener("click", exportarCSV);
}

function seleccionarOpcion(item) {
  if (sim.S_t <= 0 || sim.W_t <= 0) return;

  let fase = sim.procesarTurno(item);
  actualizarUI(fase);

  if (sim.S_t <= 0 || sim.W_t <= 0) {
    finalizarPartida();
  }
}

function renderizarTarjetas() {
  const grid = document.getElementById("cards-grid");
  grid.innerHTML = "";

  ALIMENTOS_DB[categoriaActual].forEach(item => {
    const card = document.createElement("div");
    card.className = "card-item";

    if (categoriaActual === 'tecnologias') {
      card.innerHTML = `
        <div class="card-icon">${item.icono}</div>
        <div class="card-info">
          <h4>${item.nombre}</h4>
          <div class="card-tags"><span class="tag-agua">Costo: ${item.costoEco} Pts Eco</span></div>
        </div>
      `;
    } else {
      card.innerHTML = `
        <div class="card-icon">${item.icono}</div>
        <div class="card-info">
          <h4>${item.nombre}</h4>
          <div class="card-tags">
            <span class="tag-salud">❤️ +${item.nutricion}%</span>
            <span class="tag-agua">💧 -${Math.round(item.aguaVirtual * sim.multiplicadorClima * sim.eficienciaRiego)} L</span>
          </div>
        </div>
      `;
    }

    card.addEventListener("click", () => seleccionarOpcion(item));
    grid.appendChild(card);
  });
}

function actualizarUI(fase = 'prospero') {
  // Barras y Numéricos
  document.getElementById("ui-dia").textContent = sim.dia;
  document.getElementById("val-salud").textContent = `${Math.round(sim.S_t)}%`;
  document.getElementById("val-agua").textContent = `${Math.round(sim.W_t).toLocaleString()} L`;
  document.getElementById("val-eco").textContent = `${sim.E_t} pts`;

  document.getElementById("bar-salud").style.width = `${sim.S_t}%`;
  document.getElementById("bar-agua").style.width = `${(sim.W_t / sim.W_max) * 100}%`;
  document.getElementById("bar-eco").style.width = `${Math.min(100, sim.E_t)}%`;

  // Animación de Nivel de Agua
  document.getElementById("nivel-agua").style.height = `${(sim.W_t / sim.W_max) * 100}%`;

  // Viewport y Clima
  const viewport = document.getElementById("viewport");
  viewport.className = `fase-${fase}`;

  const climaBanner = document.getElementById("clima-banner");
  if (sim.multiplicadorClima > 1.0) {
    climaBanner.classList.remove("hidden");
  } else {
    climaBanner.classList.add("hidden");
  }

  // Reacciones de los Aldeanos
  actualizarNPCs(fase);
}

function actualizarNPCs(fase) {
  const b1 = document.getElementById("bubble-1");
  const b2 = document.getElementById("bubble-2");
  const b3 = document.getElementById("bubble-3");

  if (fase === 'prospero') {
    b1.textContent = "¡Buen clima!"; b2.textContent = "Agua limpia"; b3.textContent = "¡Cuidemos el pozo!";
  } else if (fase === 'estres') {
    b1.textContent = "El pozo bajó..."; b2.textContent = "Hace calor"; b3.textContent = "Ahorremos agua";
  } else if (fase === 'sequia') {
    b1.textContent = "¡No hay agua!"; b2.textContent = "Cosechas secas"; b3.textContent = "Tengo sed...";
  } else {
    b1.textContent = "💀 Colapso"; b2.textContent = "🧟 Emergencia"; b3.textContent = "🥀 Tierra muerta";
  }
}

function finalizarPartida() {
  document.getElementById("m-días").textContent = sim.dia;
  document.getElementById("m-agua").textContent = `${Math.round(sim.totalAguaConsumida).toLocaleString()} L`;
  document.getElementById("m-tinacos").textContent = (sim.totalAguaConsumida / 1100).toFixed(1);
  document.getElementById("m-eco").textContent = `${sim.E_t} pts`;
  document.getElementById("modal-conclusion").classList.remove("hidden");
}

// Exportación de Datos en Formato CSV para Evaluación en Tesis
function exportarCSV() {
  let csvContent = "data:text/csv;charset=utf-8,Dia,Item_Seleccionado,Agua_Gastada_L,Acuifero_Remanente_L,Salud_Poblacion,Factor_Climatico\n";
  
  sim.historialDecisiones.forEach(row => {
    csvContent += `${row.dia},"${row.itemSeleccionado}",${row.aguaGastada},${row.nivelAcuiferoRemanente},${row.saludPoblacion},${row.factorClimatico}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `telemetria_huella_oculta_dia${sim.dia}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}