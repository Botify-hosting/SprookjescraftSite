// ====== SYSTEM: REALTIME NOTIFICATIES (GEEN BROWSER ALERTS MEER) ======
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'scale(0.9)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ====== FUNCTIE: IP KOPIËREN ======
function copyIP() {
    const ipText = document.getElementById("server-ip").innerText;
    navigator.clipboard.writeText(ipText).then(() => {
        showToast("✨ WonderPark IP gekopieerd naar klembord!", "success");
    });
}

// ====== SYSTEM: AUTHENTICATIE (LOGIN / REGISTREREN VIA LOCALSTORAGE) ======
function openAuthModal() { document.getElementById('auth-modal').style.display = 'flex'; }
function closeAuthModal() { document.getElementById('auth-modal').style.display = 'none'; }

function toggleAuthTab(type) {
    if(type === 'login') {
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('tab-login').classList.add('active');
        document.getElementById('tab-register').classList.remove('active');
    } else {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
        document.getElementById('tab-login').classList.remove('active');
        document.getElementById('tab-register').classList.add('active');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const user = document.getElementById('reg-user').value;
    const pass = document.getElementById('reg-pass').value;

    localStorage.setItem('wp_username', user);
    localStorage.setItem('wp_password', pass);
    
    showToast("🎉 Account aangemaakt! Log nu in.", "success");
    toggleAuthTab('login');
}

function handleLogin(event) {
    event.preventDefault();
    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;

    const storedUser = localStorage.getItem('wp_username');
    const storedPass = localStorage.getItem('wp_password');

    if(user && user === storedUser && pass === storedPass) {
        localStorage.setItem('wp_is_logged_in', 'true');
        showToast(`🔓 Welkom in WonderPark, ${user}!`, "success");
        closeAuthModal();
        updateNavbarAuth();
    } else {
        showToast("❌ Onjuiste Minecraft naam of wachtwoord!", "error");
    }
}

function handleLogout() {
    localStorage.removeItem('wp_is_logged_in');
    showToast("🔒 Uitgelogd. Tot ziens!", "info");
    updateNavbarAuth();
    if(window.location.pathname.includes('tickets.html')) {
        setTimeout(() => window.location.reload(), 1000);
    }
}

function updateNavbarAuth() {
    const authLi = document.getElementById('nav-auth');
    if (!authLi) return;

    if(localStorage.getItem('wp_is_logged_in') === 'true') {
        const user = localStorage.getItem('wp_username');
        authLi.innerHTML = `<span style="color:#d4af37; font-weight:bold; margin-right:10px;">👤 ${user}</span><a href="#" onclick="handleLogout()" class="auth-btn" style="border-color:#e74c3c; color:#e74c3c;">Log uit</a>`;
    } else {
        authLi.innerHTML = `<a href="#" onclick="openAuthModal()" class="auth-btn">Inloggen</a>`;
    }
}

// ====== LIVE COUNTDOWN TIMER ======
const targetDate = new Date(2026, 11, 31, 20, 0, 0).getTime(); 

const runCountdown = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const daysElement = document.getElementById("days");
    if (!daysElement) { clearInterval(runCountdown); return; } // Stop als element er niet is (andere pagina's)

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconden = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days.toString().padStart(2, '0');
    document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
    document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").innerText = seconden.toString().padStart(2, '0');

    if (distance < 0) {
        clearInterval(runCountdown);
        document.getElementById("countdown").innerHTML = "<div style='color:#2ecc71; font-size:1.5rem; font-weight:bold;'>EVENT IS LIVE! COMP UP!</div>";
    }
}, 1000);

// ====== GLOBAL FORM & SHOP HANDLERS ======
function handleVacature(event) {
    event.preventDefault();
    showToast("📝 Sollicitatie succesvol ingediend! Ons team bekijkt het snel.", "success");
    event.target.reset();
}

function handleTicket(event) {
    event.preventDefault();
    showToast("🎟️ Support Ticket aangemaakt! Je ontvangt snel antwoord via je profiel.", "success");
    event.target.reset();
}

function buyItem(name) {
    showToast(`🛒 Direct doorverbonden voor ${name}. Check Tebex bij release!`, "info");
}

// Initialiseer navbar status bij laden van elke pagina
document.addEventListener("DOMContentLoaded", () => {
    updateNavbarAuth();
});
