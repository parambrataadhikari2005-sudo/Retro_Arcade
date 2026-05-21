// Database definition for games listed inside your dashboard grid
const GAME_DATA = [
    { id: "brick_breaker", title: "BRICK BREAKER", active: true, desc: "Classic block demolition." },
    { id: "snake", title: "SNAKE PROTOCOL", active: false, desc: "Coming soon - Memory tracking array." },
    { id: "space_invaders", title: "GALAXY DEFENDER", active: false, desc: "Coming soon - Object pools simulation." }
];

// Document view handles
const views = {
    login: document.getElementById("login-page"),
    dashboard: document.getElementById("dashboard-page"),
    game: document.getElementById("game-page")
};

let currentActiveGame = null;

// Routing logic function
function showView(viewName) {
    Object.keys(views).forEach(key => {
        if (key === viewName) {
            views[key].classList.remove("hidden");
        } else {
            views[key].classList.add("hidden");
        }
    });

    // Handle game state toggles on route changes
    if (viewName === "game") {
        initGameEngine(); 
    } else {
        stopGameEngine();
    }
}

// Render dynamic elements for dashboard selection grid
function renderDashboard() {
    const gameListContainer = document.getElementById("game-list");
    gameListContainer.innerHTML = "";

    GAME_DATA.forEach(game => {
        const card = document.createElement("div");
        card.className = `game-item ${!game.active ? 'disabled' : ''}`;
        card.innerHTML = `
            <h4>${game.title}</h4>
            <p style="font-size: 12px; margin-bottom: 0;">${game.desc}</p>
        `;

        if (game.active) {
            card.addEventListener("click", () => showView("game"));
        }
        gameListContainer.appendChild(card);
    });
}

// Core Form submission / Auth Handling
document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById("username").value;
    
    localStorage.setItem("arcade_user", usernameInput);
    document.getElementById("player-tag").innerText = usernameInput.toUpperCase();
    
    renderDashboard();
    showView("dashboard");
});

// Navigation UI callbacks
document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("arcade_user");
    showView("login");
});

document.getElementById("back-btn").addEventListener("click", () => {
    showView("dashboard");
});

// Run session check on initial application execution
window.addEventListener("DOMContentLoaded", () => {
    const savedUser = localStorage.getItem("arcade_user");
    if (savedUser) {
        document.getElementById("player-tag").innerText = savedUser.toUpperCase();
        renderDashboard();
        showView("dashboard");
    } else {
        showView("login");
    }
});