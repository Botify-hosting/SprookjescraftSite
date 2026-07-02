// ====== SYSTEM: REALTIME NOTIFICATIES ======
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

// ====== IP KOPIËREN ======
function copyIP() {
    const ipText = document.getElementById("server-ip").innerText;
    navigator.clipboard.writeText(ipText).then(() => {
        showToast("✨ WonderPark IP gekopieerd naar klembord!", "success");
    });
}

// ====== DYNAMISCHE COUNTDOWN ENGINE ======
const runCountdown = setInterval(() => {
    const daysElement = document.getElementById("days");
    if (!daysElement) return; // Niet op deze pagina

    // Check of de admin een aangepaste datum heeft ingesteld, anders standaard release
    let targetStr = localStorage.getItem("wp_countdown_target");
    if (!targetStr) {
        targetStr = "2026-12-31T20:00"; // Standaard datum
        localStorage.setItem("wp_countdown_target", targetStr);
    }

    const targetDate = new Date(targetStr).getTime();
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconden = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days.toString().padStart(2, '0');
    document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
    document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").innerText = seconden.toString().padStart(2, '0');

    if (distance < 0) {
        document.getElementById("countdown").innerHTML = "<div style='color:#2ecc71; font-size:1.5rem; font-weight:bold;'>EVENT/PREMIÈRE IS NU LIVE! COMP UP!</div>";
    }
}, 1000);

// ====== COUPLING: TICKETS & SOLLICITATIES NAAR ADMIN ======
function handleTicket(event) {
    event.preventDefault();
    const category = event.target.querySelector('select').value;
    const message = event.target.querySelector('textarea').value;
    const user = localStorage.getItem('wp_username') || "Anonieme Speler";

    let tickets = JSON.parse(localStorage.getItem("wp_support_tickets")) || [];
    const newTicket = {
        id: Math.floor(1000 + Math.random() * 9000).toString(),
        user: user,
        category: category,
        text: message,
        status: "Open",
        replies: [] // Garandeert dat het admin panel antwoorden kan pushen
    };

    tickets.push(newTicket);
    localStorage.setItem("wp_support_tickets", JSON.stringify(tickets));
    
    showToast("🎟️ Support Ticket succesvol naar het Admin Panel gestuurd!", "success");
    event.target.reset();
}

// Alternatieve handler-naam mocht je formulier hiernaar verwijzen
if (typeof handleTicketSubmit === "undefined") {
    window.handleTicketSubmit = handleTicket;
}

function handleVacature(event) {
    event.preventDefault();
    const name = event.target.querySelectorAll('input')[0].value;
    const role = event.target.querySelector('select').value;
    const motivation = event.target.querySelector('textarea').value;

    let apps = JSON.parse(localStorage.getItem("wp_applications")) || [];
    const newApp = {
        name: name,
        role: role,
        motivation: motivation,
        status: "In afwachting",
        adminNote: ""
    };

    apps.push(newApp);
    localStorage.setItem("wp_applications", JSON.stringify(apps));

    showToast("📝 Sollicitatie opgeslagen en doorgestuurd naar de administratie!", "success");
    event.target.reset();
}

// ====== LOGINS & MODALS ======
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
    const username = document.getElementById('reg-user').value;
    localStorage.setItem('wp_username', username);
    localStorage.setItem('wp_password', document.getElementById('reg-pass').value);
    
    // Initialiseer basissaldo en rang in de database voor het profiel
    localStorage.setItem(`wp_profile_${username}`, JSON.stringify({ rank: "Speler", coins: "500" }));
    
    showToast("🎉 Geregistreerd! Log nu in.", "success");
    toggleAuthTab('login');
}
function handleLogin(event) {
    event.preventDefault();
    const userVal = document.getElementById('login-user').value;
    const passVal = document.getElementById('login-pass').value;

    if(userVal === localStorage.getItem('wp_username') && passVal === localStorage.getItem('wp_password')) {
        localStorage.setItem('wp_is_logged_in', 'true');
        localStorage.setItem('wp_username', userVal); // Match case fix
        showToast("🔓 Ingelogd!", "success");
        closeAuthModal();
        location.reload();
    } else { 
        showToast("Gebruikersnaam of wachtwoord onjuist!", "error"); 
    }
}
function handleLogout() {
    localStorage.removeItem('wp_is_logged_in');
    location.reload();
}

// ====== DYNAMISCH LOGIN EN PROFIELMENU GENEREREN ======
document.addEventListener("DOMContentLoaded", () => {
    const authLi = document.getElementById('nav-auth');
    if (authLi && localStorage.getItem('wp_is_logged_in') === 'true') {
        const username = localStorage.getItem('wp_username') || "Speler";
        authLi.innerHTML = `
            <a href="profile.html" style="color:#d4af37; margin-right:15px; font-weight:700; text-decoration:none;">👤 ${username}</a>
            <a href="#" onclick="handleLogout()" class="auth-btn" style="text-decoration:none;">Log uit</a>
        `;
    } else if (authLi) {
        authLi.innerHTML = `<a href="#" onclick="openAuthModal()" class="auth-btn" style="text-decoration:none;">Inloggen</a>`;
    }
});
