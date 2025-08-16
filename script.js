document.addEventListener('DOMContentLoaded', function () {

    emailjs.init('VYBd8Bkdyuo4aNmiH'); 

    // Intersection Observer para animaciones de scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-fade').forEach(el => observer.observe(el));

    // Smooth scroll para navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Efecto parallax en hero
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Manejo del formulario de contacto
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const nombre = this.querySelector('input[name="name"]').value.trim();
            const email = this.querySelector('input[name="email"]').value.trim();
            const telefono = this.querySelector('input[name="phone"]').value.trim();
            const mensaje = this.querySelector('textarea[name="message"]').value.trim();

            // Validación básica
            if (!nombre || !email) {
                showNotification('Por favor completa los campos obligatorios (Nombre y Email)', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Por favor ingresa un email válido', 'error');
                return;
            }

            // Mostrar notificación de carga
            const loadingNotification = showNotification('Enviando mensaje...', 'info', false);

            // Enviar con EmailJS
            emailjs.send("service_8ukd12t", "template_f2xhgdl", {
                name: nombre,
                email: email,
                phone: telefono,
                message: mensaje,
                to_email: "fmh08512@gmail.com", 
            }).then(() => {
                removeNotification(loadingNotification);
                showNotification('¡Gracias por tu mensaje! Te contactaremos pronto.', 'success');
                this.reset();
            }).catch(err => {
                removeNotification(loadingNotification);
                console.error('Error al enviar mensaje:', err);
                
                // Mostrar mensaje de error específico según el tipo de error
                let errorMessage = 'Error al enviar el mensaje. ';
                
                if (err.status === 400) {
                    errorMessage += 'Verifica la configuración de EmailJS.';
                } else if (err.status === 401) {
                    errorMessage += 'Clave pública de EmailJS inválida.';
                } else if (err.status === 403) {
                    errorMessage += 'Acceso denegado. Verifica tu plantilla de EmailJS.';
                } else if (err.status === 429) {
                    errorMessage += 'Demasiadas solicitudes. Intenta más tarde.';
                } else {
                    errorMessage += 'Por favor intenta nuevamente.';
                }
                
                showNotification(errorMessage, 'error');
            });
        });
    }

    // Validación de email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Sistema de notificaciones
    function showNotification(message, type = 'info', autoClose = true) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: '10000',
            maxWidth: '400px',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        document.body.appendChild(notification);
        setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 100);

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => removeNotification(notification));

        if (autoClose) {
            setTimeout(() => removeNotification(notification), 5000);
        }

        return notification;
    }

    function removeNotification(notification) {
        if (notification && notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }

    // Animaciones de contador para estadísticas
    function animateCounter(element, start, end, duration = 2000) {
        const startTime = performance.now();
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            element.textContent = current + (end >= 1000 ? '+' : '');
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        requestAnimationFrame(updateCounter);
    }

    // Observador para las estadísticas
    const counters = document.querySelectorAll('.stat-item__number[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count);
                animateCounter(counter, 0, target, 2000);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // Cambiar estilo del header al hacer scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.querySelector('.header');
        
        if (scrollTop > 50) {
            header.style.background = 'rgba(15, 23, 42, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)';
            header.style.backdropFilter = 'blur(10px)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Lazy loading para imágenes (si las hay)
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Preloader (si existe)
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
    }

    // Menú móvil (funcionalidad básica)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav__menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Cerrar menú móvil al hacer click en un enlace
    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        });
    });

    // Mensaje de consola
    console.log('🛡️ Sitio web de Herreseguros cargado correctamente');
    ///console.log('📧 Recuerda configurar EmailJS con tus credenciales reales');
});