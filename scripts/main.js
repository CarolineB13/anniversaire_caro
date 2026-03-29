const targetDate = new Date(2026, 4, 10, 0, 15, 0);

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function format(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  daysEl.textContent = format(days);
  hoursEl.textContent = format(hours);
  minutesEl.textContent = format(minutes);
  secondsEl.textContent = format(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);


const targetDate = new Date(2026, 4, 10, 0, 15, 0);

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function format(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  daysEl.textContent = format(days);
  hoursEl.textContent = format(hours);
  minutesEl.textContent = format(minutes);
  secondsEl.textContent = format(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

const form = document.getElementById("rsvp-form");
const formStatus = document.getElementById("form-status");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const prenom = form.querySelector('[name="prenom"]').value.trim();
    const presence = form.querySelector('[name="presence"]').value;
    const nombrePersonnes = form.querySelector('[name="nombre_personnes"]').value;

    if (!prenom || !presence || !nombrePersonnes) {
      formStatus.textContent = "Merci de remplir au minimum ton prénom, ta présence et le nombre de personnes.";
      return;
    }

    formStatus.textContent = "Le formulaire est prêt. Prochaine étape : connexion à Airtable et upload vidéo.";
  });
}