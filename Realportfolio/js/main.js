(function () {
    'use strict';

    const html = document.documentElement;
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileClose = document.getElementById('mobileClose');
    const navbar = document.getElementById('navbar');

    // ===== 1. THEME TOGGLE (light/dark) =====
    const THEME_KEY = 'louisdev-theme-v4';

    function applyTheme(theme) {
        if (theme === 'light') {
            html.classList.add('light');
            html.classList.remove('dark');
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        } else {
            html.classList.remove('light');
            html.classList.add('dark');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        }
        try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    }

    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = html.classList.contains('light') ? 'light' : 'dark';
            applyTheme(current === 'light' ? 'dark' : 'light');
        });
    }

    // ===== 2. MOBILE MENU =====
    let menuOpen = false;

    function openMenu() {
        menuOpen = true;
        mobileMenu.classList.add('open');
        mobileOverlay.classList.add('open');
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        body.style.overflow = 'hidden';
    }
    function closeMenu() {
        menuOpen = false;
        mobileMenu.classList.remove('open');
        mobileOverlay.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
    }

    if (hamburger && mobileMenu && mobileOverlay) {
        hamburger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
        mobileClose?.addEventListener('click', closeMenu);
        mobileOverlay.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) closeMenu(); });
        mobileMenu.querySelectorAll('.mobile-link').forEach(link => link.addEventListener('click', closeMenu));
    }

    // ===== 3. NAVBAR SCROLL =====
    if (navbar) {
        window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 20), { passive: true });
    }

    // ===== 4. ACTIVE NAV LINK =====
    function setActiveNav() {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === path) link.classList.add('active');
        });
    }
    setActiveNav();

    // ===== 5. SCROLL REVEAL =====
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        reveals.forEach(el => obs.observe(el));
    }

    // ===== 6. STATS COUNTER =====
    const counters = document.querySelectorAll('[data-target]');
    if (counters.length) {
        const cObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-target'), 10);
                    let count = 0;
                    const speed = Math.ceil(target / 60) || 1;
                    const update = () => {
                        count += speed;
                        if (count < target) {
                            el.innerText = Math.floor(count);
                            requestAnimationFrame(update);
                        } else el.innerText = target;
                    };
                    update();
                    cObs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(c => cObs.observe(c));
    }

    // ===== 7. PROJECT FILTERS =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    if (filterBtns.length && projectCards.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.getAttribute('data-filter');
                projectCards.forEach(card => {
                    const cat = card.getAttribute('data-category');
                    if (filter === 'all' || cat?.includes(filter)) {
                        card.style.display = '';
                        card.offsetHeight;
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                        card.style.transition = 'opacity 0.4s, transform 0.4s';
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        card.style.transition = 'opacity 0.3s, transform 0.3s';
                        setTimeout(() => card.style.display = 'none', 300);
                    }
                });
            });
        });
    }

    // ===== 8. CONTACT FORM =====
    const form = document.getElementById('contact-form');
    if (form) {
        const nameInp = document.getElementById('name');
        const emailInp = document.getElementById('email');
        const msgInp = document.getElementById('message');
        const successDiv = document.getElementById('form-success');

        function showErr(input, msg) {
            input.classList.add('error');
            const span = input.nextElementSibling;
            if (span?.classList.contains('error-msg')) {
                span.textContent = msg;
                span.classList.remove('hidden');
            }
        }
        function clearErr(input) {
            input.classList.remove('error');
            const span = input.nextElementSibling;
            if (span?.classList.contains('error-msg')) span.classList.add('hidden');
        }
        const valName = () => {
            if (!nameInp.value.trim() || nameInp.value.trim().length < 2) { showErr(nameInp, 'Enter full name.'); return false; }
            clearErr(nameInp); return true;
        };
        const valEmail = () => {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInp.value.trim())) { showErr(emailInp, 'Valid email required.'); return false; }
            clearErr(emailInp); return true;
        };
        const valMsg = () => {
            if (!msgInp.value.trim() || msgInp.value.trim().length < 10) { showErr(msgInp, 'Minimum 10 characters.'); return false; }
            clearErr(msgInp); return true;
        };

        nameInp.addEventListener('blur', valName);
        emailInp.addEventListener('blur', valEmail);
        msgInp.addEventListener('blur', valMsg);
        nameInp.addEventListener('input', () => clearErr(nameInp));
        emailInp.addEventListener('input', () => clearErr(emailInp));
        msgInp.addEventListener('input', () => clearErr(msgInp));

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (valName() && valEmail() && valMsg()) {
                const btn = form.querySelector('button[type="submit"]');
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
                btn.disabled = true;
                setTimeout(() => {
                    form.querySelectorAll('input, textarea, label, .error-msg, h3, p').forEach(el => el.style.display = 'none');
                    btn.style.display = 'none';
                    if (successDiv) successDiv.classList.remove('hidden');
                }, 1500);
            }
        });
    }

    // ===== 9. CV DOWNLOAD =====
    function downloadCV(e) {
        e.preventDefault();
        const a = document.createElement('a');
        a.href = encodeURI('assets/chikas best resume.pdf');
        a.download = 'chikas best resume.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    document.getElementById('download-cv-btn')?.addEventListener('click', downloadCV);
    document.getElementById('download-cv-exp')?.addEventListener('click', downloadCV);

    console.log('%cLouis Dev %cPortfolio Ready', 'color: #7C3AED; font-weight: bold;', '');
})();