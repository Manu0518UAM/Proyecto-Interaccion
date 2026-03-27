let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

function guardar() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

/* AGREGAR */
function agregarTarea() {
  const texto = document.getElementById("tarea").value;
  const materia = document.getElementById("materia").value;
  const prioridad = document.getElementById("prioridad").value;
  const fecha = document.getElementById("fecha").value;

  if (!texto || !materia || !prioridad) {
    alert("Completa todos los campos");
    return;
  }

  if (!confirm("¿Agregar tarea?")) return;

  tareas.push({
    texto,
    materia,
    prioridad,
    fecha,
    completada: false
  });

  guardar();

  // 🔥 IMPORTANTE
  window.location.href = "tareas.html";
}

/* MOSTRAR */
function mostrar() {
  const lista = document.getElementById("lista");

  // 🔴 si no existe (index.html), salir
  if (!lista) return;

  let datos = [...tareas];

  const estado = document.getElementById("filtroEstado")?.value;
  const materia = document.getElementById("filtroMateria")?.value;
  const prioridad = document.getElementById("filtroPrioridad")?.value;
  const orden = document.getElementById("orden")?.value;

  // FILTROS
  datos = datos.filter(t =>
    (!estado || (estado === "pendiente" ? !t.completada : t.completada)) &&
    (!materia || t.materia === materia) &&
    (!prioridad || t.prioridad === prioridad)
  );

  // ORDEN
  const ordenP = { Alta: 1, Media: 2, Baja: 3 };

  if (orden === "fecha") {
    datos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  } else if (orden === "materia") {
    datos.sort((a, b) => a.materia.localeCompare(b.materia));
  } else {
    datos.sort((a, b) => {
      if (a.completada !== b.completada) return a.completada - b.completada;
      return ordenP[a.prioridad] - ordenP[b.prioridad];
    });
  }

  lista.innerHTML = "";

  datos.forEach(t => {
    const index = tareas.indexOf(t);

    const div = document.createElement("div");
    div.className = `task ${t.prioridad.toLowerCase()} ${t.completada ? "completada" : ""}`;

    div.innerHTML = `
      <strong>${t.texto}</strong><br>
      ${t.materia}<br>
      ${t.prioridad}<br>
      ${t.fecha}

      <div class="actions">
        <button onclick="toggle(${index})">✔</button>
        <button onclick="eliminar(${index})">🗑</button>
      </div>
    `;

    lista.appendChild(div);
  });
}

/* ELIMINAR */
function eliminar(i) {
  if (!confirm("¿Eliminar tarea?")) return;

  tareas.splice(i, 1);
  guardar();
  mostrar();
}

/* COMPLETAR / DESCOMPLETAR */
function toggle(i) {
  if (!confirm("¿Cambiar estado?")) return;

  tareas[i].completada = !tareas[i].completada;
  guardar();
  mostrar();
}

/* 🔥 IMPORTANTE: EJECUTAR AL CARGAR */
document.addEventListener("DOMContentLoaded", mostrar);

/* ABRIR CALENDARIO */
function abrirFecha() {
  document.getElementById("fecha").showPicker();
}

/* MOSTRAR FECHA SELECCIONADA */
document.addEventListener("DOMContentLoaded", () => {
  const fechaInput = document.getElementById("fecha");
  if (!fechaInput) return;

  fechaInput.addEventListener("change", () => {
    const valor = fechaInput.value;

    if (valor) {
      document.getElementById("textoFecha").innerText = valor;
    }
  });
});