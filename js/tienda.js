// ============================================================
// tienda.js — Brisa Moda
// Nuestro JavaScript. Se carga después de Bootstrap, por eso
// aquí ya existe el objeto «bootstrap».
// ============================================================

// ===== PASO 8: Filtrar productos por categoría =====
const botonesFiltro = document.querySelectorAll('.btn-filtro');
const columnasProducto = document.querySelectorAll('[data-categoria]');

botonesFiltro.forEach((boton) => {
  boton.addEventListener('click', () => {
    // 1. Marcar el botón pulsado (negro) y desmarcar los demás
    botonesFiltro.forEach((b) => {
      b.classList.remove('active', 'btn-dark');
      b.classList.add('btn-outline-dark');
    });
    boton.classList.add('active', 'btn-dark');
    boton.classList.remove('btn-outline-dark');

    // 2. Mostrar u ocultar cada producto con la utilidad d-none
    const categoria = boton.dataset.filtro;
    columnasProducto.forEach((columna) => {
      const mostrar = categoria === 'todos' || columna.dataset.categoria === categoria;
      columna.classList.toggle('d-none', !mostrar);
    });
  });
});

// ===== PASO 9: Carrito — agregar productos =====
const carrito = [];
const formatoPesos = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

// Muestra el aviso (toast) con un mensaje
function mostrarAviso(mensaje) {
  const aviso = document.getElementById('avisoCarrito');
  aviso.querySelector('.toast-body').textContent = mensaje;
  bootstrap.Toast.getOrCreateInstance(aviso).show();
}

// Agrega un producto y avisa a toda la página que el carrito cambió
function agregarAlCarrito(nombre, precio) {
  carrito.push({ nombre, precio });
  document.dispatchEvent(new CustomEvent('carrito:cambio'));
  mostrarAviso(`«${nombre}» se agregó al carrito`);
}

// Cada botón «Agregar» lee sus atributos data-nombre y data-precio
document.querySelectorAll('.btn-agregar').forEach((boton) => {
  boton.addEventListener('click', () => {
    agregarAlCarrito(boton.dataset.nombre, Number(boton.dataset.precio));
  });
});

// Cuando el carrito cambia, se actualiza el contador de la barra
document.addEventListener('carrito:cambio', () => {
  document.getElementById('contadorCarrito').textContent = carrito.length;
});

// ===== PASO 10: Mostrar el carrito en el panel lateral =====
const listaCarrito = document.getElementById('listaCarrito');
const totalCarrito = document.getElementById('totalCarrito');
const btnPagar = document.getElementById('btnPagar');

function avisarCambio() {
  document.dispatchEvent(new CustomEvent('carrito:cambio'));
}

function pintarCarrito() {
  listaCarrito.innerHTML = '';

  if (carrito.length === 0) {
    const vacio = document.createElement('li');
    vacio.className = 'list-group-item text-body-secondary';
    vacio.textContent = 'Tu carrito está vacío.';
    listaCarrito.appendChild(vacio);
  }

  carrito.forEach((producto, indice) => {
    const item = document.createElement('li');
    item.className = 'list-group-item d-flex align-items-center gap-2 px-0';

    const nombre = document.createElement('span');
    nombre.className = 'flex-grow-1';
    nombre.textContent = producto.nombre;

    const precio = document.createElement('strong');
    precio.textContent = formatoPesos.format(producto.precio);

    const quitar = document.createElement('button');
    quitar.type = 'button';
    quitar.className = 'btn-close';
    quitar.setAttribute('aria-label', `Quitar ${producto.nombre}`);
    quitar.addEventListener('click', () => {
      carrito.splice(indice, 1);
      avisarCambio();
    });

    item.append(nombre, precio, quitar);
    listaCarrito.appendChild(item);
  });

  const total = carrito.reduce((suma, producto) => suma + producto.precio, 0);
  totalCarrito.textContent = formatoPesos.format(total);
  btnPagar.disabled = carrito.length === 0;
}

document.getElementById('btnVaciar').addEventListener('click', () => {
  carrito.length = 0;
  avisarCambio();
});

btnPagar.addEventListener('click', () => {
  carrito.length = 0;
  avisarCambio();
  bootstrap.Offcanvas.getOrCreateInstance('#panelCarrito').hide();
  mostrarAviso('¡Gracias por tu compra! (simulación)');
});

document.addEventListener('carrito:cambio', pintarCarrito);
pintarCarrito();

// ===== PASO 11: Vista rápida del producto (modal) =====
const modalProducto = document.getElementById('modalProducto');
let productoEnModal = null;

// Antes de abrirse, el modal lee los datos del botón que lo abrió
modalProducto.addEventListener('show.bs.modal', (evento) => {
  const boton = evento.relatedTarget;
  productoEnModal = {
    nombre: boton.dataset.nombre,
    precio: Number(boton.dataset.precio),
  };

  const imagen = document.getElementById('modalImagen');
  imagen.src = boton.dataset.imagen;
  imagen.alt = boton.dataset.nombre;
  modalProducto.querySelector('.modal-title').textContent = boton.dataset.nombre;
  document.getElementById('modalDescripcion').textContent = boton.dataset.descripcion;
  document.getElementById('modalPrecio').textContent =
    formatoPesos.format(productoEnModal.precio);
});

// El botón del modal agrega el producto con la talla elegida
document.getElementById('btnAgregarModal').addEventListener('click', () => {
  const talla = document.getElementById('tallaModal').value;
  agregarAlCarrito(`${productoEnModal.nombre} (talla ${talla})`, productoEnModal.precio);
  bootstrap.Modal.getInstance(modalProducto).hide();
});

// ===== PASO 14: Validar el formulario de suscripción =====
const formSuscripcion = document.getElementById('formSuscripcion');

formSuscripcion.addEventListener('submit', (evento) => {
  evento.preventDefault(); // no hay servidor: evitamos recargar la página

  if (!formSuscripcion.checkValidity()) {
    formSuscripcion.classList.add('was-validated'); // Bootstrap pinta los errores
    return;
  }

  mostrarAviso('¡Gracias! Te enviaremos nuestras ofertas.');
  formSuscripcion.reset();
  formSuscripcion.classList.remove('was-validated');
});

// ===== PASO 16: Tooltips y botón «volver arriba» =====

// 1. Bootstrap no activa los tooltips solo: los creamos aquí
document.querySelectorAll('[data-bs-title]').forEach((elemento) => {
  new bootstrap.Tooltip(elemento);
});

// 2. El botón aparece al bajar 400 px y lleva al inicio con suavidad
const btnArriba = document.getElementById('btnArriba');

window.addEventListener('scroll', () => {
  btnArriba.classList.toggle('d-none', window.scrollY < 400);
});

btnArriba.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
