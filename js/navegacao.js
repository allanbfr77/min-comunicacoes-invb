const USUARIOS_PERMITIDOS = [
    "medeiros", "jean", "alan", "matheus",
    "anna beatriz", "luciana", "alex", "bianca"
];

function fecharLogin() {
    const modal = document.getElementById('modalLogin');
    const erroMsg = document.getElementById('erroLogin');

    if (modal) modal.style.display = 'none';
    if (erroMsg) erroMsg.style.display = 'none';

    const usuarioInput = document.getElementById('usuarioInput');
    const senhaInput = document.getElementById('senhaInput');
    if (usuarioInput) usuarioInput.value = "";
    if (senhaInput) senhaInput.value = "";
}

function mostrarSecao(id, elemento) {
    document.body.classList.remove('inicio');
    if (id === 'inicio') document.body.classList.add('inicio');

    const menuOverlay = document.getElementById('menuOverlay');
    const menuIcon = document.querySelector('.menu-hamburger-mobile');
    if (menuOverlay) menuOverlay.classList.remove('active');
    if (menuIcon) menuIcon.classList.remove('active');
    document.body.style.overflow = 'auto';

    const modal = document.getElementById('modalLogin');
    if (modal) modal.style.display = 'none';

    if (id === 'links' && modal) {
        modal.style.display = 'flex';
        const usuarioInput = document.getElementById('usuarioInput');
        const senhaInput = document.getElementById('senhaInput');
        const erroLogin = document.getElementById('erroLogin');
        if (usuarioInput) usuarioInput.value = '';
        if (senhaInput) senhaInput.value = '';
        if (erroLogin) erroLogin.style.display = 'none';
        return;
    }

    document.querySelectorAll('.secao').forEach((secao) => {
        secao.style.display = 'none';
    });

    const secaoAlvo = document.getElementById(id);
    if (secaoAlvo) secaoAlvo.style.display = 'block';

    const tituloPagina = document.getElementById('page-title');
    const subtituloPagina = document.getElementById('page-subtitle');
    const btnVerMensal = document.getElementById('btn-ver-mensal');
    const btnVoltarEscala = document.getElementById('btn-voltar-escala');

    if (btnVerMensal) btnVerMensal.style.display = 'none';
    if (btnVoltarEscala) btnVoltarEscala.style.display = 'none';

    if (tituloPagina && subtituloPagina) {
        if (id === 'inicio') {
            tituloPagina.innerText = "Ministério de Comunicações";
            subtituloPagina.innerText = "Comunicação, organização e excelência no serviço.";
        } else if (id === 'escala') {
            tituloPagina.innerText = "Escala Semanal";
            subtituloPagina.innerText = "Confira os responsáveis pelos próximos cultos.";
            if (btnVerMensal) btnVerMensal.style.display = 'block';
        } else if (id === 'mensal') {
            tituloPagina.innerText = "Escala Mensal";
            subtituloPagina.innerText = "Cronograma completo de atividades do mês.";
            if (btnVoltarEscala) btnVoltarEscala.style.display = 'block';
        } else if (id === 'projetos') {
            tituloPagina.innerText = "Projetos";
            subtituloPagina.innerText = "Acompanhamento de criações e campanhas em andamento.";
        } else if (id === 'links') {
            tituloPagina.innerText = "Downloads";
            subtituloPagina.innerText = "Repositório de arquivos e materiais de apoio.";
        } else if (id === 'mapa-demandas') {
            tituloPagina.innerText = "Mapa de Demandas";
            subtituloPagina.innerText = "Detalhamento de funções e fluxo de trabalho.";
        }
    }

    if (elemento) {
        const todosOsLinks = document.querySelectorAll('.nav-links li, .nav-links-mobile li a');
        todosOsLinks.forEach((link) => link.classList.remove('active'));
        elemento.classList.add('active');
    }
}

function executarTrocaDePagina(id, elemento) {
    document.body.classList.remove('inicio');
    if (id === 'inicio') document.body.classList.add('inicio');

    document.querySelectorAll('.secao').forEach((s) => {
        s.style.display = 'none';
    });

    const target = document.getElementById(id);
    if (target) target.style.display = 'block';

    if (elemento) {
        document.querySelectorAll('.nav-links li').forEach((li) => li.classList.remove('active'));
        elemento.classList.add('active');
    }

    const btnMensal = document.getElementById('btn-ver-mensal');
    const btnVoltar = document.getElementById('btn-voltar-escala');
    if (btnMensal) btnMensal.style.display = (id === 'escala') ? 'block' : 'none';
    if (btnVoltar) btnVoltar.style.display = (id === 'mensal') ? 'block' : 'none';
}

function validarAcesso() {
    const usuarioInput = document.getElementById('usuarioInput');
    const senhaInput = document.getElementById('senhaInput');
    const erroLogin = document.getElementById('erroLogin');
    const modalLogin = document.getElementById('modalLogin');
    if (!usuarioInput || !senhaInput || !erroLogin || !modalLogin) return;

    const user = usuarioInput.value.toLowerCase().trim();
    const pass = senhaInput.value.toLowerCase().trim();
    const SENHA_CORRETA = "vitorioso";

    if (USUARIOS_PERMITIDOS.includes(user) && pass === SENHA_CORRETA) {
        modalLogin.style.display = 'none';
        erroLogin.style.display = 'none';
        executarTrocaDePagina('links');
        usuarioInput.value = "";
        senhaInput.value = "";
    } else {
        erroLogin.style.display = 'block';
        senhaInput.value = "";
    }
}

function toggleSenha() {
    const senhaInput = document.getElementById('senhaInput');
    const toggleIcon = document.getElementById('togglePassword');
    if (!senhaInput || !toggleIcon) return;

    const olhoAberto = `
        <svg xmlns="http://www.w3.org/2000/center" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        </svg>`;

    const olhoFechado = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>`;

    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
        toggleIcon.innerHTML = olhoFechado;
    } else {
        senhaInput.type = 'password';
        toggleIcon.innerHTML = olhoAberto;
    }
}

function toggleMenu() {
    const menu = document.getElementById('menuOverlay');
    const icon = document.querySelector('.menu-hamburger-mobile');
    if (!menu || !icon) return;

    menu.classList.toggle('active');
    icon.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : 'auto';
}

function initMapaDemandas() {
    const demandaCards = Array.from(document.querySelectorAll('.demanda-card'));
    const demandaGrid = document.querySelector('.demanda-grid');

    function isDesktopHoverMode() {
        const isTouchDevice =
            window.matchMedia('(pointer: coarse)').matches ||
            window.matchMedia('(hover: none)').matches ||
            ('ontouchstart' in window);
        return window.innerWidth > 768 &&
            !isTouchDevice &&
            window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    }

    function setCardAberto(cardSelecionado) {
        demandaCards.forEach((card) => {
            card.classList.toggle('open', card === cardSelecionado);
        });
    }

    // Clique sempre registrado; decide comportamento no momento da interação.
    demandaCards.forEach((card) => {
        const header = card.querySelector('.demanda-header');
        if (!header) return;
        header.addEventListener('click', (e) => {
            if (isDesktopHoverMode()) return;
            e.preventDefault();
            e.stopPropagation();
            const deveAbrir = !card.classList.contains('open');
            setCardAberto(deveAbrir ? card : null);
        });
    });

    // Hover ativo apenas em desktop real.
    demandaCards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
            if (!isDesktopHoverMode()) return;
            setCardAberto(card);
        });
        card.addEventListener('mouseleave', () => {
            if (!isDesktopHoverMode()) return;
            card.classList.remove('open');
        });
    });
    if (demandaGrid) {
        demandaGrid.addEventListener('mouseleave', () => {
            if (!isDesktopHoverMode()) return;
            setCardAberto(null);
        });
    }
}

function initHomeEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add("show-element");
        });
    }, { threshold: 0.1 });

    const target = document.querySelector(".main-hero");
    if (target) observer.observe(target);

    window.addEventListener('scroll', () => {
        const welcome = document.getElementById('welcome-text');
        const card = document.querySelector('.hidden-element');
        const isMobile = window.innerWidth <= 768;
        if (isMobile && welcome && card) {
            if (window.scrollY > 50) {
                welcome.classList.add('fade-out-up');
                card.classList.add('show');
            } else {
                welcome.classList.remove('fade-out-up');
                card.classList.remove('show');
            }
        } else if (!isMobile && welcome) {
            welcome.classList.remove('fade-out-up');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const abrirEscala = sessionStorage.getItem("abrirEscala");
    if (abrirEscala === "true") {
        sessionStorage.removeItem("abrirEscala");
        mostrarSecao('escala');
    } else {
        mostrarSecao('inicio');
    }

    document.body.classList.add('bg-ready');
    const menuToggle = document.querySelector('.menu-hamburger-mobile');
    if (menuToggle) {
        menuToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
    }
    initMapaDemandas();
    initHomeEffects();
});

window.fecharLogin = fecharLogin;
window.mostrarSecao = mostrarSecao;
window.validarAcesso = validarAcesso;
window.toggleSenha = toggleSenha;
window.toggleMenu = toggleMenu;
