// ============================================================
// tienda.js — PlaySphere
// Lógica interactiva para la plataforma de música y podcasts
// ============================================================


const botonesFiltro = document.querySelectorAll('.btn-filtro');
const columnasContenido = document.querySelectorAll('[data-categoria]');

botonesFiltro.forEach((boton) => {
  boton.addEventListener('click', () => {
    
    botonesFiltro.forEach((b) => {
      b.classList.remove('active', 'btn-primary');
      b.classList.add('btn-outline-light');
    });
    boton.classList.add('active', 'btn-primary');
    boton.classList.remove('btn-outline-light');

    
    const categoria = boton.dataset.filtro;
    columnasContenido.forEach((columna) => {
      const mostrar = categoria === 'todos' || columna.dataset.categoria === categoria;
      columna.classList.toggle('d-none', !mostrar);
    });
  });
});


const biblioteca = [];


function mostrarAviso(mensaje) {
  const aviso = document.getElementById('avisoBiblioteca');
  if (aviso) {
    aviso.querySelector('.toast-body span').textContent = mensaje;
    bootstrap.Toast.getOrCreateInstance(aviso).show();
  }
}


function agregarABiblioteca(nombre, tipo, artista) {
  
  const existe = biblioteca.some((item) => item.nombre === nombre);
  if (existe) {
    mostrarAviso(`«${nombre}» ya está en tu biblioteca`);
    return;
  }

  biblioteca.push({ nombre, tipo, artista });
  document.dispatchEvent(new CustomEvent('biblioteca:cambio'));
  mostrarAviso(`«${nombre}» se guardó en tu biblioteca`);
}

document.querySelectorAll('.btn-agregar').forEach((boton) => {
  boton.addEventListener('click', () => {
    agregarABiblioteca(
      boton.dataset.nombre,
      boton.dataset.tipo || 'Pista',
      boton.dataset.artista || 'Artista desconocido'
    );
  });
});


document.addEventListener('biblioteca:cambio', () => {
  const contador = document.getElementById('contadorBiblioteca');
  if (contador) {
    contador.textContent = biblioteca.length;
  }
});

const listaBiblioteca = document.getElementById('listaBiblioteca');
const totalBiblioteca = document.getElementById('totalBiblioteca');
const btnReproducirTodo = document.getElementById('btnReproducirTodo');
const btnVaciarBiblioteca = document.getElementById('btnVaciarBiblioteca');

function avisarCambio() {
  document.dispatchEvent(new CustomEvent('biblioteca:cambio'));
}

function pintarBiblioteca() {
  if (!listaBiblioteca) return;

  listaBiblioteca.innerHTML = '';

  if (biblioteca.length === 0) {
    const vacio = document.createElement('li');
    vacio.className = 'list-group-item bg-transparent text-secondary text-center py-4 border-0';
    vacio.textContent = 'Tu biblioteca está vacía.';
    listaBiblioteca.appendChild(vacio);
  }

  biblioteca.forEach((itemAudio, indice) => {
    const item = document.createElement('li');
    item.className = 'list-group-item bg-dark text-light border-secondary border-opacity-25 d-flex align-items-center gap-2 px-2 py-3';

    const icono = document.createElement('i');
    icono.className = itemAudio.tipo === 'Podcast' ? 'bi bi-mic-fill text-info fs-5' : 'bi bi-music-note-beaming text-primary fs-5';

    const info = document.createElement('div');
    info.className = 'flex-grow-1 overflow-hidden';
    
    const titulo = document.createElement('p');
    titulo.className = 'mb-0 fw-semibold text-truncate small';
    titulo.textContent = itemAudio.nombre;

    const detalle = document.createElement('p');
    detalle.className = 'mb-0 text-secondary extra-small';
    detalle.style.fontSize = '0.75rem';
    detalle.textContent = `${itemAudio.artista} • ${itemAudio.tipo}`;

    info.append(titulo, detalle);

    const quitar = document.createElement('button');
    quitar.type = 'button';
    quitar.className = 'btn-close btn-close-white ms-auto';
    quitar.setAttribute('aria-label', `Eliminar ${itemAudio.nombre}`);
    quitar.addEventListener('click', () => {
      biblioteca.splice(indice, 1);
      avisarCambio();
    });

    item.append(icono, info, quitar);
    listaBiblioteca.appendChild(item);
  });

  if (totalBiblioteca) {
    totalBiblioteca.textContent = biblioteca.length;
  }

  if (btnReproducirTodo) {
    btnReproducirTodo.disabled = biblioteca.length === 0;
  }
}

if (btnVaciarBiblioteca) {
  btnVaciarBiblioteca.addEventListener('click', () => {
    biblioteca.length = 0;
    avisarCambio();
  });
}

if (btnReproducirTodo) {
  btnReproducirTodo.addEventListener('click', () => {
    mostrarAviso('Reproduciendo biblioteca completa...');
  });
}

document.addEventListener('biblioteca:cambio', pintarBiblioteca);
pintarBiblioteca();

// ===== PASO 4: Vista rápida / Detalle del elemento (Modal) =====
const modalDetalles = document.getElementById('modalDetalles');
let elementoEnModal = null;

if (modalDetalles) {
  modalDetalles.addEventListener('show.bs.modal', (evento) => {
    const boton = evento.relatedTarget;
    elementoEnModal = {
      nombre: boton.dataset.nombre,
      tipo: boton.dataset.tipo,
      artista: boton.dataset.artista || 'Artista de PlaySphere',
    };

    const imagen = document.getElementById('modalImagen');
    if (imagen) {
      imagen.src = boton.dataset.imagen;
      imagen.alt = boton.dataset.nombre;
    }

    const tipoBadge = document.getElementById('modalTipo');
    if (tipoBadge) {
      tipoBadge.textContent = boton.dataset.tipo;
    }

    const tituloModal = document.getElementById('modalNombre');
    if (tituloModal) {
      tituloModal.textContent = boton.dataset.nombre;
    }

    const descModal = document.getElementById('modalDescripcion');
    if (descModal) {
      descModal.textContent = boton.dataset.descripcion;
    }
  });

  const btnAgregarModal = document.getElementById('btnAgregarModal');
  if (btnAgregarModal) {
    btnAgregarModal.addEventListener('click', () => {
      if (elementoEnModal) {
        const calidad = document.getElementById('calidadAudioModal')?.value || '';
        agregarABiblioteca(
          `${elementoEnModal.nombre}`,
          elementoEnModal.tipo,
          `${elementoEnModal.artista}`
        );
        bootstrap.Modal.getInstance(modalDetalles).hide();
      }
    });
  }
}


const formSuscripcion = document.getElementById('formSuscripcion');

if (formSuscripcion) {
  formSuscripcion.addEventListener('submit', (evento) => {
    evento.preventDefault();

    if (!formSuscripcion.checkValidity()) {
      formSuscripcion.classList.add('was-validated');
      return;
    }

    mostrarAviso('¡Suscripción exitosa! Te enviaremos los mejores estrenos.');
    formSuscripcion.reset();
    formSuscripcion.classList.remove('was-validated');
  });
}


document.querySelectorAll('[data-bs-title]').forEach((elemento) => {
  new bootstrap.Tooltip(elemento);
});

const btnArriba = document.getElementById('btnArriba');

if (btnArriba) {
  window.addEventListener('scroll', () => {
    btnArriba.classList.toggle('d-none', window.scrollY < 400);
  });

  btnArriba.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== REPRODUCTOR DE AUDIO =====
const reproductor = new Audio();
let botonActual = null;

document.querySelectorAll('.btn-reproducir').forEach(function (boton) {
  boton.addEventListener('click', function () {
    const ruta = boton.dataset.audio;

    // Si se pulsa el mismo botón: pausar o continuar
    if (botonActual === boton) {
      if (reproductor.paused) {
        reproductor.play();
        boton.innerHTML = '<i class="bi bi-pause-fill"></i> Pausar';
      } else {
        reproductor.pause();
        boton.innerHTML = '<i class="bi bi-play-fill"></i> Reproducir';
      }
      return;
    }

    // Si era otro botón: restaurar el anterior y reproducir el nuevo
    if (botonActual) {
      botonActual.innerHTML = '<i class="bi bi-play-fill"></i> Reproducir';
    }
    reproductor.src = ruta;
    reproductor.play();
    boton.innerHTML = '<i class="bi bi-pause-fill"></i> Pausar';
    botonActual = boton;
  });
});

// Al terminar el audio, volver al estado inicial
reproductor.addEventListener('ended', function () {
  if (botonActual) {
    botonActual.innerHTML = '<i class="bi bi-play-fill"></i> Reproducir';
    botonActual = null;
  }
});
