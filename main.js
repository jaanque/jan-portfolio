    (function(){
      const scrollText = document.getElementById('scroll-text');
      const sobreMiSection = document.getElementById('sobre-mi');
      const pantallaNombre = document.querySelector('.pantalla-nombre');
      const progressBar = document.getElementById('progress-bar');
      const scrollSpacer = document.getElementById('scroll-spacer');
      
      let horizontalScrollDistance = 0;

      function calculateHorizontalScroll() {
        // Calculamos cuánto texto necesita desplazarse horizontalmente
        const textWidth = scrollText.scrollWidth;
        const containerWidth = sobreMiSection.clientWidth;
        horizontalScrollDistance = Math.max(0, textWidth - containerWidth + 80); // 80px de padding extra
        
        // El spacer invisible tendrá la altura necesaria para el scroll horizontal
        scrollSpacer.style.height = `${horizontalScrollDistance}px`;
      }

      // Calculamos al cargar y al redimensionar
      calculateHorizontalScroll();
      window.addEventListener('resize', calculateHorizontalScroll);

      function handleScroll() {
        const scrollY = window.pageYOffset;
        const pantallaNombreHeight = pantallaNombre.offsetHeight;
        const sobreMiStart = pantallaNombreHeight;
        const sobreMiEnd = sobreMiStart + horizontalScrollDistance;

        // Verificamos si estamos en la zona de scroll horizontal
        if (scrollY >= sobreMiStart && scrollY <= sobreMiEnd) {
          const scrollInSection = scrollY - sobreMiStart;
          const progress = Math.min(scrollInSection / horizontalScrollDistance, 1);
          const translateX = -horizontalScrollDistance * progress;
          
          scrollText.style.transform = `translateX(${translateX}px)`;
          progressBar.style.height = `${progress * 100}%`;
        } else {
          // Antes de la sección
          if (scrollY < sobreMiStart) {
            scrollText.style.transform = 'translateX(0px)';
            progressBar.style.height = '0%';
          }
          // Después de la sección
          else if (scrollY > sobreMiEnd) {
            scrollText.style.transform = `translateX(-${horizontalScrollDistance}px)`;
            progressBar.style.height = '100%';
          }
        }
      }

      window.addEventListener('scroll', handleScroll);
      
      // Scroll suave para el menú
      document.querySelectorAll('.menu-flotante a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });

    })();

    function animateProjects() {
  const proyectosTitle = document.querySelector('.proyectos-title');
  const proyectoCards = document.querySelectorAll('.proyecto-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observar título
  if (proyectosTitle) {
    observer.observe(proyectosTitle);
  }

  // Observar cada carta con delay escalonado
  proyectoCards.forEach((card, index) => {
    setTimeout(() => {
      observer.observe(card);
    }, index * 200);
  });
}

// Inicializar animaciones cuando se carga la página
document.addEventListener('DOMContentLoaded', animateProjects);




document.addEventListener("DOMContentLoaded", () => {
  const logos = document.querySelectorAll(".logo");

  logos.forEach((logo) => {
    // Posición aleatoria inicial dentro del contenedor
    const container = document.querySelector(".logos-container");
    const containerRect = container.getBoundingClientRect();
    const logoWidth = 80; // Ancho definido en CSS
    const logoHeight = 80; // Alto definido en CSS

    const maxX = container.clientWidth - logoWidth;
    const maxY = container.clientHeight - logoHeight;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    logo.style.left = `${randomX}px`;
    logo.style.top = `${randomY}px`;

    // Funcionalidad de arrastrar
    let isDragging = false;
    let offsetX, offsetY;

    logo.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - logo.offsetLeft;
      offsetY = e.clientY - logo.offsetTop;
      logo.style.zIndex = 1000;
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;

        // Restringir dentro del contenedor
        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));

        logo.style.left = `${x}px`;
        logo.style.top = `${y}px`;
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
      logo.style.zIndex = 1;
    });
  });
});


const canvas = document.getElementById('draw-canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');

let currentColor = colorPicker.value;

function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

colorPicker.addEventListener('input', e => {
  currentColor = e.target.value;
});

let drawing = false;
let lastX = 0;
let lastY = 0;

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  let x, y;
  if (e.touches) {
    x = e.touches[0].clientX - rect.left;
    y = e.touches[0].clientY - rect.top;
  } else {
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  }
  return {x, y};
}

function startDrawing(e) {
  drawing = true;
  const pos = getPos(e);
  lastX = pos.x;
  lastY = pos.y;
}

function stopDrawing() {
  drawing = false;
}

function draw(e) {
  if (!drawing) return;
  const pos = getPos(e);
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();

  lastX = pos.x;
  lastY = pos.y;
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
canvas.addEventListener('mousemove', draw);

canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  startDrawing(e);
});
canvas.addEventListener('touchend', e => {
  e.preventDefault();
  stopDrawing();
});
canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  draw(e);
});

const contactoBtn = document.querySelector('.menu-flotante a:last-child');

contactoBtn.addEventListener('mousemove', (e) => {
  const rect = contactoBtn.getBoundingClientRect();
  const x = e.clientX - rect.left; // posición X del ratón dentro del botón
  const y = e.clientY - rect.top;  // posición Y del ratón dentro del botón

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  // Calculamos desplazamientos relativos (-1 a 1)
  const deltaX = (x - centerX) / centerX;
  const deltaY = (y - centerY) / centerY;

  // Multiplicador para la rotación (máximo 10 grados)
  const rotateX = deltaY * 10; // vertical
  const rotateY = deltaX * 10; // horizontal

  // Aplicamos la transformación 3D
  contactoBtn.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;

  // Mover brillo metálico según el puntero
  const shine = contactoBtn.querySelector('::before');
  // Como ::before no es accesible en JS, usamos un gradiente movible con background-position
  // Calculamos posición brillo en %
  const posX = (deltaX + 1) * 50; // 0 a 100
  const posY = (deltaY + 1) * 50; // 0 a 100

  // Ajustamos el background-position para simular el brillo moviéndose
  contactoBtn.style.setProperty('--shine-pos-x', `${posX}%`);
  contactoBtn.style.setProperty('--shine-pos-y', `${posY}%`);
});

contactoBtn.addEventListener('mouseleave', () => {
  contactoBtn.style.transform = `rotateX(0deg) rotateY(0deg) translateZ(10px)`;
});


function toggleMenu() {
    const menu = document.querySelector('.menu-flotante');
    menu.classList.toggle('open');
  }

  document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector(".btn-toggle");
    toggleButton.addEventListener("click", toggleMenu);
  });