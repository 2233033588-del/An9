// Datos extraídos de tu lista de Excel
const alimentos = [
  { nombre: "Manzana", tipo: "Natural", prot: 0.3, carb: 13.8, grasa: 0.2, agua100g: 82.2, aguaKg: 822 },
  { nombre: "Plátano", tipo: "Natural", prot: 1.1, carb: 22.8, grasa: 0.3, agua100g: 79.0, aguaKg: 790 },
  { nombre: "Naranja", tipo: "Natural", prot: 0.9, carb: 11.8, grasa: 0.1, agua100g: 56.0, aguaKg: 560 },
  { nombre: "Aguacate", tipo: "Natural", prot: 2.0, carb: 8.5, grasa: 14.7, agua100g: 198.1, aguaKg: 1981 },
  { nombre: "Jitomate", tipo: "Natural", prot: 0.9, carb: 3.9, grasa: 0.2, agua100g: 21.4, aguaKg: 214 },
  { nombre: "Lechuga", tipo: "Natural", prot: 1.4, carb: 2.9, grasa: 0.2, agua100g: 23.7, aguaKg: 237 },
  { nombre: "Papa", tipo: "Natural", prot: 2.0, carb: 17.5, grasa: 0.1, agua100g: 28.7, aguaKg: 287 },
  { nombre: "Arroz blanco", tipo: "Natural", prot: 6.7, carb: 79.0, grasa: 0.9, agua100g: 249.7, aguaKg: 2497 },
  { nombre: "Maíz", tipo: "Natural", prot: 9.4, carb: 74.3, grasa: 4.7, agua100g: 122.2, aguaKg: 1222 },
  { nombre: "Frijol negro", tipo: "Natural", prot: 21.6, carb: 62.4, grasa: 1.4, agua100g: 505.3, aguaKg: 5053 },
  { nombre: "Almendra", tipo: "Natural", prot: 21.2, carb: 21.7, grasa: 49.9, agua100g: 1609.5, aguaKg: 16095 },
  { nombre: "Cacahuate", tipo: "Natural", prot: 25.8, carb: 16.1, grasa: 49.2, agua100g: 397.4, aguaKg: 3974 },
  { nombre: "Huevo", tipo: "Natural", prot: 12.6, carb: 0.8, grasa: 9.5, agua100g: 326.5, aguaKg: 3265 },
  { nombre: "Pechuga de pollo", tipo: "Natural", prot: 23.1, carb: 0.0, grasa: 1.2, agua100g: 432.5, aguaKg: 4325 },
  { nombre: "Carne de res", tipo: "Natural", prot: 21.4, carb: 0.0, grasa: 5.0, agua100g: 1541.5, aguaKg: 15415 },
  { nombre: "Leche entera", tipo: "Natural", prot: 3.2, carb: 4.8, grasa: 3.3, agua100g: 102.0, aguaKg: 1020 },
  { nombre: "Pan blanco", tipo: "Procesado", prot: 8.8, carb: 49.1, grasa: 3.2, agua100g: 160.8, aguaKg: 1608 },
  { nombre: "Pasta seca", tipo: "Procesado", prot: 13.0, carb: 74.7, grasa: 1.5, agua100g: 184.9, aguaKg: 1849 },
  { nombre: "Queso cheddar", tipo: "Procesado", prot: 24.9, carb: 1.3, grasa: 33.1, agua100g: 506.0, aguaKg: 5060 },
  { nombre: "Chocolate con leche", tipo: "Procesado", prot: 7.7, carb: 59.4, grasa: 29.7, agua100g: 1719.6, aguaKg: 17196 },
  { nombre: "Refresco de cola", tipo: "Procesado", prot: 0.0, carb: 10.6, grasa: 0.0, agua100g: 48.0, aguaKg: 480 },
  { nombre: "Jugo de naranja", tipo: "Procesado", prot: 0.7, carb: 10.4, grasa: 0.2, agua100g: 101.8, aguaKg: 1018 }
];

const menuGrid = document.getElementById('menuGrid');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderCards(list) {
  menuGrid.innerHTML = '';
  list.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div>
        <div class="card-header">
          <span class="card-title">${item.nombre}</span>
          <span class="badge ${item.tipo.toLowerCase()}">${item.tipo}</span>
        </div>
        <div class="nutri-info">
          <div>🍖 Proteína: <strong>${item.prot}g</strong></div>
          <div>🍞 Carbos: <strong>${item.carb}g</strong></div>
          <div>🥑 Grasas: <strong>${item.grasa}g</strong></div>
          <div>⚡ Por: <strong>100g/ml</strong></div>
        </div>
      </div>
      <div class="water-footprint">
        <span>Huella hídrica (100g):</span>
        <span class="water-val">💧 ${item.agua100g} L</span>
      </div>
    `;
    menuGrid.appendChild(card);
  });
}

// Inicializar lista completa
renderCards(alimentos);

// Eventos de Filtrado
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');
    let filteredList = [...alimentos];

    if (filter === 'Natural' || filter === 'Procesado') {
      filteredList = alimentos.filter(item => item.tipo === filter);
    } else if (filter === 'low-water') {
      filteredList = alimentos.filter(item => item.agua100g < 200);
    } else if (filter === 'high-protein') {
      filteredList = alimentos.filter(item => item.prot > 10);
    }

    renderCards(filteredList);
  });
});
