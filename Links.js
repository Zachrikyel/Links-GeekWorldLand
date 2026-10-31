/// CONFIGURACION SUPABASE (misma del proyecto GeekWorldland) ///
const SUPABASE_URL = 'https://stjvnjmqezdcxsdodnfc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0anZuam1xZXpkY3hzZG9kbmZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNTE5NTUsImV4cCI6MjA3OTkyNzk1NX0.nh111C74tbdSreSdn7sRQlI8PPNnOCpod-Y1nD3210o';

/* Las imágenes del proyecto se sirven vía el proxy de Drive de la página principal */
const SITE_URL = 'https://www.geekworldland.com';
const DRIVE = (id) => `${SITE_URL}/api/drive-proxy?id=${id}`;

const ASSETS = {
    ufo: DRIVE('1ewCWzShyzsSe8evkNFps51YbpIkeIFU7'),
    logo: DRIVE('1uXfz9u5su-WjBcqHkUUawT4ayjin37Nb')
};

/* Enlaces del UFO: 3 arriba (FB, IG, TikTok) y 2 abajo (Web, WhatsApp) */
const UFO_LINKS = [
    { pos: 'top-left', label: 'Facebook', icon: 'bxl-facebook', clr: '#1877f2', href: 'https://www.facebook.com/profile.php?id=100069820063553' },
    { pos: 'top-center', label: 'Instagram', icon: 'bxl-instagram', clr: '#ec4899', href: 'https://www.instagram.com/geekworldland?igsh=ejJzejdnd3FzYnEx' },
    { pos: 'top-right', label: 'TikTok', icon: 'bxl-tiktok', clr: '#00f2ea', href: 'http://tiktok.com/@geekworldlandgy' },
    { pos: 'bottom-left', label: 'Web', icon: 'bx-world', clr: '#a855f7', href: `${SITE_URL}/` },
    { pos: 'bottom-right', label: 'WhatsApp', icon: 'bxl-whatsapp', clr: '#25d366', href: 'https://wa.me/message/7D7ZCLVFNLZ4A1' }
];

let supabaseClient = null;
try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (error) {
    console.error('❌ Error inicializando Supabase:', error);
}

const escapeHtml = (str) => String(str ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

/* ========== HERO ========== */
async function loadDynamicHero() {
    const container = document.getElementById('hero-dynamic-container');
    if (!container) return;

    let products = [];
    if (supabaseClient) {
        const { data, error } = await supabaseClient
            .from('products')
            .select('name, card_middle_url')
            .eq('is_trending', true)
            .order('created_at', { ascending: false });
        if (error) console.error('Error Hero:', error);
        products = (data || []).filter((p) => p.card_middle_url);
    }

    const itemsHtml = products.map((p, i) => `
        <div class="item${i === 0 ? ' active' : ''}">
            <img src="${escapeHtml(p.card_middle_url)}" alt="${escapeHtml(p.name)}">
            <div class="topic"><span class="text-gradient-cyber">${escapeHtml(p.name)}</span></div>
        </div>`).join('');

    container.innerHTML = `
        <div class="carousel">
            <div class="list">${itemsHtml}</div>
            <div class="carousel-bg-glow"></div>
        </div>`;

    initHeroCarousel();
}

function initHeroCarousel() {
    const carousel = document.querySelector('.carousel');
    const items = document.querySelectorAll('.carousel .list .item');
    if (!carousel || items.length === 0) return;

    let current = 0;
    const show = (index) => {
        items[current].classList.remove('active');
        current = (index + items.length) % items.length;
        items[current].classList.add('active');
    };

    let autoRun = null;
    const startTimer = () => {
        clearInterval(autoRun);
        if (items.length > 1) autoRun = setInterval(() => show(current + 1), 5000);
    };
    const move = (step) => { show(current + step); startTimer(); };

    // Gesto táctil (swipe)
    let startX = 0;
    carousel.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
        const diff = e.changedTouches[0].clientX - startX;
        if (Math.abs(diff) > 40) move(diff < 0 ? 1 : -1);
    }, { passive: true });

    startTimer();
}

/* ========== UFO (5 enlaces) ========== */
function injectUfo() {
    const placeholder = document.getElementById('ufo-placeholder');
    if (!placeholder) return;

    const linksHtml = UFO_LINKS.map((l) => `
        <li class="ufo-link ${l.pos}" style="--clr:${l.clr};">
            <a href="${l.href}" target="_blank" rel="noopener" aria-label="${l.label}">
                <i class='bx ${l.icon}'></i>
            </a>
            <span class="ufo-label">${l.label}</span>
        </li>`).join('');

    placeholder.innerHTML = `
        <div class="ufo-container">
            <ul class="ufo-menu">
                <div class="ufo-toggle">
                    <img src="${ASSETS.ufo}" alt="Menu Alien">
                </div>
                ${linksHtml}
            </ul>
        </div>`;

    // El UFO abre/cierra los enlaces (inicia cerrado)
    const toggle = placeholder.querySelector('.ufo-toggle');
    const menu = placeholder.querySelector('.ufo-menu');
    toggle.addEventListener('click', () => menu.classList.toggle('active'));
}

/* ========== FOOTER (igual al de GeekWorldland) ========== */
function injectFooter() {
    const container = document.getElementById('footer-container');
    if (!container) return;

    container.innerHTML = `
        <footer class="footer">
            <div class="footer__parralax">
                <div class="footer__parralax-trees"></div>
                <div class="footer__parralax-moto"></div>
                <div class="footer__parralax-secondplan"></div>
                <div class="footer__parralax-premierplan"></div>
                <div class="footer__parralax-voiture"></div>
            </div>

            <div class="container">
                <div class="footer__columns">
                    <div class="footer__col">
                        <h3 class="footer__col-title">
                            <i class='bx bx-file'></i> <span>LEGAL</span>
                        </h3>
                        <nav class="footer__nav">
                            <ul class="footer__nav-list">
                                <li class="footer__nav-item"><span class="footer__nav-link"><i class='bx bx-check-shield'></i> Licencia comercial respaldada</span></li>
                                <li class="footer__nav-item"><span class="footer__nav-link"><i class='bx bx-copyright'></i> Imágenes autorizadas</span></li>
                                <li class="footer__nav-item"><span class="footer__nav-link"><i class='bx bx-registered'></i> Derechos reservados</span></li>
                            </ul>
                        </nav>
                    </div>

                    <div class="footer__col center-col">
                        <div class="footer-logo-container">
                            <img src="${ASSETS.logo}" alt="Geek Worldland Logo" class="footer-logo">
                        </div>
                    </div>

                    <div class="footer__col">
                        <h3 class="footer__col-title">
                            <i class='bx bx-send'></i> <span>CONTACTO</span>
                        </h3>
                        <nav class="footer__nav">
                            <ul class="footer__nav-list">
                                <li class="footer__nav-item"><a href="mailto:GeekworlandGY@gmail.com" class="footer__nav-link"><i class='bx bx-envelope'></i> GeekworlandGY@gmail.com</a></li>
                                <li class="footer__nav-item"><a href="https://wa.me/573054585777" target="_blank" class="footer__nav-link"><i class='bx bxl-whatsapp'></i> +57 305 458 5777</a></li>
                                <li class="footer__nav-item"><span class="footer__nav-link"><i class='bx bxs-map'></i> Bogotá, Colombia</span></li>
                            </ul>
                        </nav>
                    </div>
                </div>
                <div class="footer__copyrights">
                    <p>&copy; 2025 Geek Worldland. <span class="zylox-signature">| Powered by Zylox</span></p>
                </div>
            </div>
        </footer>`;
}

document.addEventListener('DOMContentLoaded', () => {
    loadDynamicHero();
    injectUfo();
    injectFooter();
});

