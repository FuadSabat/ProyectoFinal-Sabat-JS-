// Selección de elementos del DOM
const loanForm = document.getElementById("loanForm");
const tipoCreditoInput = document.getElementById("tipoCredito");
const montoInput = document.getElementById("monto");
const aniosInput = document.getElementById("años");
const mostrarResultadoDiv = document.getElementById("mostrarResultado");
const historialLista = document.getElementById("historialLista");

// Rango de validación según tipo de crédito
const creditRanges = {
  personal: { min: 1000, max: 50000, maxYears: 5 },
  hipotecario: { min: 50000, max: 500000, maxYears: 25 },
  automotriz: { min: 5000, max: 100000, maxYears: 7 },
};

// Evento para capturar el formulario al enviar
loanForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Capturar valores del formulario
  const tipoCredito = tipoCreditoInput.value;
  const monto = parseFloat(montoInput.value);
  const anios = parseFloat(aniosInput.value);

  // Validar rango para el tipo de crédito seleccionado
  const { min, max, maxYears } = creditRanges[tipoCredito] || {};
  if (!min || monto < min || monto > max || anios <= 0 || anios > maxYears) {
    mostrarAlertaError(min, max, maxYears);
    return;
  }

  // Calcular cuota mensual
  const cuota = calcularPrestamo(monto, anios, tipoCredito);

  // Mostrar desglose en el DOM
  mostrarDesglose(monto, anios, cuota, tipoCredito);

  // Guardar simulación en localStorage
  guardarSimulacion(monto, anios, cuota, tipoCredito);

  // Mostrar historial de simulaciones
  mostrarHistorial();

  // Limpiar campos del formulario después de la simulación
  loanForm.reset();
});

// Función para mostrar el desglose de cuotas en el DOM
function mostrarDesglose(monto, anios, cuota, tipoCredito) {
  mostrarResultadoDiv.classList.remove("d-none", "alert-danger");
  mostrarResultadoDiv.classList.add("alert-info");
  mostrarResultadoDiv.innerHTML = `<strong>Simulación completada:</strong> Para un préstamo ${
    tipoCredito.charAt(0).toUpperCase() + tipoCredito.slice(1)
  } de $${monto} a ${anios} años, la cuota mensual es de $${cuota}.`;
}

// Función para calcular el préstamo
function calcularPrestamo(monto, anios, tipoCredito) {
  const meses = anios * 12;
  const tasa =
    tipoCredito === "personal"
      ? 0.05
      : tipoCredito === "hipotecario"
      ? 0.04
      : 0.045;
  const cuota = (monto * (tasa / 12)) / (1 - Math.pow(1 + tasa / 12, -meses));
  return cuota.toFixed(2); // Redondear a 2 decimales
}

// Función para mostrar mensaje de error detallado
function mostrarAlertaError(min, max, maxYears) {
  mostrarResultadoDiv.classList.remove("d-none", "alert-info");
  mostrarResultadoDiv.classList.add("alert-danger");
  mostrarResultadoDiv.innerHTML = `Por favor, ingresa valores válidos:<br>
    - El monto debe estar entre $${min} y $${max}.<br>
    - Los años no pueden superar los ${maxYears}.`;
}

// Función para guardar simulaciones en localStorage
function guardarSimulacion(monto, anios, cuota, tipoCredito) {
  const simulation = {
    tipoCredito,
    monto,
    anios,
    cuota,
    fecha: new Date().toLocaleDateString(),
  };

  let simulations = JSON.parse(localStorage.getItem("simulations")) || [];
  simulations.push(simulation);
  localStorage.setItem("simulations", JSON.stringify(simulations));
}

// Función para mostrar historial de simulaciones
function mostrarHistorial() {
  historialLista.innerHTML = ""; // Limpiar contenido anterior

  const simulations = JSON.parse(localStorage.getItem("simulations")) || [];
  simulations.forEach((simulation, index) => {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.textContent = `Simulación ${index + 1}: Préstamo ${
      simulation.tipoCredito
    } de $${simulation.monto} a ${simulation.anios} años, Cuota: $${
      simulation.cuota
    }, Fecha: ${simulation.fecha}`;
    historialLista.appendChild(li);
  });
}

// Mostrar historial de simulaciones al cargar la página
document.addEventListener("DOMContentLoaded", mostrarHistorial);
