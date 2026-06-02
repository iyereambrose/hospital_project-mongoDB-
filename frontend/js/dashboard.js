const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const welcome = document.getElementById("welcome");
const subtitle = document.getElementById("subtitle");
const logoutBtn = document.getElementById("logout");
const activePatientsEl = document.getElementById("activePatients");
const appointmentsEl = document.getElementById("appointments");
const staffEl = document.getElementById("staff");

async function loadDashboard() {
    try {
        const response = await fetch("/api/auth/dashboard", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok && data.user) {
            welcome.innerText = `Welcome, ${data.user.name}`;
            subtitle.innerText = `Signed in as ${data.user.email}`;

            // Placeholder metrics — replace with real endpoints when available
            activePatientsEl.innerText = data.metrics?.activePatients ?? "12";
            appointmentsEl.innerText = data.metrics?.appointments ?? "5";
            staffEl.innerText = data.metrics?.staff ?? "8";
        } else {
            localStorage.removeItem("token");
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("Dashboard load error:", error);
        subtitle.innerText = "Unable to load data";
    }
}

loadDashboard();

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});