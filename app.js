let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

function guardar() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

function agregarTarea() {
  const texto = tarea.value;
  const materia = materiaSelect.value;
  const prioridad = prioridadSelect.value;
  const fecha = fechaInput.value;

  if (!texto || !materia || !prioridad) {
    alert("Completa todos los campos");
    return;
  }

  tareas.push({
    texto,
    materia,
    prioridad,
    fecha,
    completada: false
  });

  guardar();
  mostrar();
  tarea.value = "";
}

const tarea = document.getElementById("tarea");
const materiaSelect = document.getElementById("materia");
const prioridadSelect = document.getElementById("prioridad");
const fechaInput = document.getElementById("fecha");

function mostrar() {
  const lista = document.getElementById("lista");
  const filtroM = filtroMateria.value;
  const filtroP = filtroPrioridad.value;
  const buscar = document.getElementById("buscar").value.toLowerCase();
  const orden = document.getElementById("orden").value;

  let datos = [...tareas];

  // FILTROS
  datos = datos.filter(t =>
    (!filtroM || t.materia === filtroM) &&
    (!filtroP || t.prioridad === filtroP) &&
    t.texto.toLowerCase().includes(buscar)
  );

  // ORDEN
  if (orden === "fecha") {
    datos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  }

  if (orden === "prioridad") {
    const ordenP = { Alta: 1, Media: 2, Baja: 3 };
    datos.sort((a, b) => ordenP[a.prioridad] - ordenP[b.prioridad]);
  }

  lista.innerHTML = "";

  datos.forEach((t, i) => {
    const div = document.createElement("div");
    div.className = `card ${t.prioridad.toLowerCase()} ${t.completada ? "completada" : ""}`;

    div.innerHTML = `
      <strong>${t.texto}</strong><br>
      ${t.materia}<br>
      ${t.prioridad}<br>
      ${t.fecha}
      <br><br>
      <button onclick="toggle(${i})">✔</button>
      <button onclick="eliminar(${i})">🗑</button>
    `;

    lista.appendChild(div);
  });

  actualizarContador();
}

function eliminar(i) {
  if (confirm("¿Eliminar tarea?")) {
    tareas.splice(i, 1);
    guardar();
    mostrar();
  }
}

function toggle(i) {
  tareas[i].completada = !tareas[i].completada;
  guardar();
  mostrar();
}

function actualizarContador() {
  const pendientes = tareas.filter(t => !t.completada).length;
  document.getElementById("contador").innerText =
    pendientes + " pendientes / " + tareas.length + " total";
}

mostrar();