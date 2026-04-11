const targetDate = new Date(2026, 4, 10, 0, 15, 0);

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function format(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
    return;
  }

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


// ===== Airtable RSVP =====

const AIRTABLE_TOKEN = "";
const BASE_ID = "appofq1X3dYCJBExO";
const TABLE_NAME = "Invités";

const form = document.getElementById("rsvp-form");
const status = document.getElementById("rsvp-status");
const presenceSelect = form.querySelector('select[name="presence"]');
const dependentBlocks = form.querySelectorAll(".form-card--presence-dependent");
const presenceHelp = document.getElementById("presence-help");

function togglePresenceDependentFields() {
  const value = presenceSelect.value;
  const isComing = value === "oui" || value === "peut-etre";

  // Message dynamique
  if (value === "non") {
    presenceHelp.textContent =
      "Dommage que tu ne puisses pas être là… mais n’hésite pas à laisser un message écrit ou une vidéo 💜";
    presenceHelp.classList.add("presence-help--negative");
  } else if (value === "peut-etre") {
    presenceHelp.textContent =
      "Si tu penses pouvoir venir, indique déjà les jours possibles.";
    presenceHelp.classList.remove("presence-help--negative");
  } else {
    presenceHelp.textContent = "";
    presenceHelp.classList.remove("presence-help--negative");
  }

  // Affichage / désactivation des champs
  dependentBlocks.forEach((block) => {
    block.style.display = isComing ? "" : "none";

    const fields = block.querySelectorAll("input, select, textarea");

    fields.forEach((field) => {
      field.disabled = !isComing;

      if (!isComing) {
        if (field.type === "checkbox") {
          field.checked = false;
        } else {
          field.value = "";
        }
      }
    });
  });
}

// Init + écoute
togglePresenceDependentFields();
presenceSelect.addEventListener("change", togglePresenceDependentFields);

// Submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);
  const presence = formData.get("presence");
  const jours = formData.getAll("jours");

  // Validation uniquement si la personne vient
  if ((presence === "oui" || presence === "peut-etre") && jours.length === 0) {
    status.textContent = "Merci de sélectionner au moins un jour.";
    return;
  }

  status.textContent = "Envoi en cours...";

  // Mapping jours
  const joursSelectionnes = [];

  if (jours.includes("vendredi-8-mai")) {
    joursSelectionnes.push("Vendredi 8 mai");
  }
  if (jours.includes("samedi-9-mai")) {
    joursSelectionnes.push("Samedi 9 mai");
  }
  if (jours.includes("dimanche-10-mai")) {
    joursSelectionnes.push("Dimanche 10 mai");
  }

  // Mapping valeurs
  const presenceMap = {
    oui: "Oui",
    non: "Non",
    "peut-etre": "Peut-être",
  };

  const logementMap = {
    non: "Non",
    "oui-couchage": "Besoin couchage",
    "oui-infos": "Besoin infos logement",
  };

  // Champs de base (toujours envoyés)
  const fields = {
    "Prénom": formData.get("prenom")?.trim() || "",
    "Nom": formData.get("nom")?.trim() || "",
    "Ville": formData.get("ville")?.trim() || "",
    "Nombre de personnes": Number(formData.get("nombre_personnes")) || 1,
    "Présence soirée": presenceMap[presence] || "",
    "Commentaire logistique":
      formData.get("commentaire_logistique")?.trim() || "",
  };

  // Champs uniquement si la personne vient
  if (presence === "oui" || presence === "peut-etre") {
    fields["Vendredi 8 mai"] = jours.includes("vendredi-8-mai");
    fields["Samedi 9 mai"] = jours.includes("samedi-9-mai");
    fields["Dimanche 10 mai"] = jours.includes("dimanche-10-mai");
    fields["Jours sélectionnés"] = joursSelectionnes.join(", ");

    const logementValue = logementMap[formData.get("logement")];

    if (logementValue) {
      fields["Logement"] = logementValue;
    }
  } else {
    // Cas "non" → on n’envoie PAS logement
    fields["Vendredi 8 mai"] = false;
    fields["Samedi 9 mai"] = false;
    fields["Dimanche 10 mai"] = false;
    fields["Jours sélectionnés"] = "";
  }

  const data = {
    records: [
      {
        fields,
      },
    ],
  };

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    console.log("Airtable result:", result);

    if (!response.ok) {
      throw new Error(result?.error?.message || "Erreur Airtable");
    }

    status.textContent = "Merci ! Ta réponse est enregistrée 💜";
    form.reset();
    togglePresenceDependentFields();
  } catch (error) {
    console.error(error);
    status.textContent = `Oups… ${error.message || "une erreur est survenue 😢"}`;
  }
});