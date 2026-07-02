// ====== SYSTEM: MINECRAFT-STIJL IN-GAME TOAST NOTIFICATIES ======
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    
    container.appendChild(toast);
    
    // Verwijder de melding automatisch na 4 seconden
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'scale(0.9)';
        toast.style.transition = 'all 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// ====== FUNCTIE: IP ADRES KOPIËREN ======
function copyIP() {
    const ipText = document.getElementById("server-ip").innerText;
    navigator.clipboard.writeText(ipText).then(() => {
        showToast("✨ Server-IP succesvol gekopieerd naar klembord!", "success");
    });
}

// ====== SYSTEM: AUTH MODAL SYSTEM & LOCALSTORAGE PROFIEL ======
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

// ACCOUNT REGISTREREN
function handleRegister(event) {
    event.preventDefault();
    const user = document.getElementById('reg-user').value;
    const pass = document.getElementById('reg-pass').value;

    localStorage.setItem('wp_user', user);
    localStorage.setItem('wp_pass', pass);
    
    showToast("🎉 Account succesvol aangemaakt! Je kunt nu inloggen.", "success");
    toggleAuthTab('login');
}

// INLOGGEN
function handleLogin(event) {
    event.preventDefault();
    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;

    const storedUser = localStorage.getItem('wp_user');
    const storedPass = localStorage.getItem('wp_pass');

    if(user === storedUser && pass === storedPass) {
        localStorage.setItem('wp_logged_in', 'true');
        showToast(`🔓 Welkom terug in WonderPark, ${user}!`, "success");
        closeAuthModal();
        updateAuthNavbar();
    } else {
        showToast("❌ Ongeldige Minecraft naam of wachtwoord!", "error");
    }
}

// LOGOUT
function handleLogout() {
    localStorage.removeItem('wp_logged_in');
    showToast("🔒 Je bent nu veilig uitgelogd.", "info");
    updateAuthNavbar();
}

// NAVBAR UPDATE (Laat profiel zien na inloggen)
function updateAuthNavbar() {
    const authLi = document.getElementById('nav-auth');
    if (!authLi) return;

    if(localStorage.getItem('wp_logged_in') === 'true') {
        const user = localStorage.getItem('wp_user');
        authLi.innerHTML = `<span style="color:#d4af37; font-weight:bold; margin-right:10px;">👤 ${user}</span><a href="#" onclick="handleLogout()" class="auth-btn" style="border-color:#e74c3c; color:#e74c3c;">Log uit</a>`;
    } else {
        authLi.innerHTML = `<a href="#" onclick="openAuthModal()" class="auth-btn">Inloggen</a>`;
    }
}

// TICKETS CLAIMEN
function claimTicket() {
    if(localStorage.getItem('wp_logged_in') !== 'true') {
        showToast("⚠️ Je moet eerst ingelogd zijn om een ticket te claimen!", "error");
        openAuthModal();
    } else {
        showToast("🎫 Ticket geclaimd! Check je in-game profiel bij de volgende opening.", "success");
    }
}

// Start checks bij het laden van de pagina
document.addEventListener("DOMContentLoaded", () => {
    updateAuthNavbar();
});
