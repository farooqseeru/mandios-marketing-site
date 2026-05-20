const navToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const pilotForm = document.querySelector(".pilot-form");
const yearEl = document.querySelector("#year");
const revealElements = document.querySelectorAll(".reveal");
const statValues = document.querySelectorAll(".stat-value");
const docButtons = document.querySelectorAll(".doc-btn");
const printTrigger = document.querySelector("#print-trigger");

const previewDocTitle = document.querySelector("#preview-doc-title");
const previewParty = document.querySelector("#preview-party");
const previewCounterparty = document.querySelector("#preview-counterparty");
const previewCommodity = document.querySelector("#preview-commodity");
const previewQty = document.querySelector("#preview-qty");
const previewRate = document.querySelector("#preview-rate");
const previewDate = document.querySelector("#preview-date");
const previewTotal = document.querySelector("#preview-total");

const printDocTitle = document.querySelector("#print-doc-title");
const printParty = document.querySelector("#print-party");
const printCounterparty = document.querySelector("#print-counterparty");
const printCommodity = document.querySelector("#print-commodity");
const printQty = document.querySelector("#print-qty");
const printRate = document.querySelector("#print-rate");
const printDate = document.querySelector("#print-date");
const printTotal = document.querySelector("#print-total");

const today = new Date().toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const docFormats = {
  watak: {
    title: "Watak Slip",
    party: "MandiOS Desk 07",
    counterparty: "Delhi Fresh Chain",
    commodity: "Apple Delicious A Grade",
    qty: "530 boxes",
    rate: "Rs 1,420",
    date: today,
    total: "Amount: Rs 7,52,600",
  },
  invoice: {
    title: "Sale Invoice",
    party: "MandiOS Desk 07",
    counterparty: "Punjab Wholesale Traders",
    commodity: "Apple Kullu Delicious Mix",
    qty: "680 boxes",
    rate: "Rs 1,360",
    date: today,
    total: "Invoice Value: Rs 9,24,800",
  },
  dispatch: {
    title: "Dispatch Sheet",
    party: "MandiOS Desk 07",
    counterparty: "Azadpur Yard Entry",
    commodity: "Apple Maharaji / Delicious",
    qty: "720 boxes",
    rate: "Freight Rs 1,10,000",
    date: today,
    total: "Truck: JK05F 2142 | Status: In Transit",
  },
};

if (window.lucide) {
  window.lucide.createIcons();
}

if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}

const setDocumentFormat = (type) => {
  const data = docFormats[type];
  if (!data) {
    return;
  }

  if (previewDocTitle) previewDocTitle.textContent = data.title;
  if (previewParty) previewParty.textContent = data.party;
  if (previewCounterparty) previewCounterparty.textContent = data.counterparty;
  if (previewCommodity) previewCommodity.textContent = data.commodity;
  if (previewQty) previewQty.textContent = data.qty;
  if (previewRate) previewRate.textContent = data.rate;
  if (previewDate) previewDate.textContent = data.date;
  if (previewTotal) previewTotal.textContent = data.total;

  if (printDocTitle) printDocTitle.textContent = data.title;
  if (printParty) printParty.textContent = data.party;
  if (printCounterparty) printCounterparty.textContent = data.counterparty;
  if (printCommodity) printCommodity.textContent = data.commodity;
  if (printQty) printQty.textContent = data.qty;
  if (printRate) printRate.textContent = data.rate;
  if (printDate) printDate.textContent = data.date;
  if (printTotal) printTotal.textContent = data.total;
};

const selectDoc = (type) => {
  if (!docFormats[type]) {
    return;
  }

  docButtons.forEach((docButton) => {
    docButton.classList.toggle("active", docButton.dataset.doc === type);
  });
  setDocumentFormat(type);
};

window.mandiSelectDoc = selectDoc;
selectDoc("watak");

document.addEventListener("click", (event) => {
  const button = event.target.closest(".doc-btn");
  if (!button) {
    return;
  }

  const type = button.dataset.doc;
  if (!type) {
    return;
  }

  selectDoc(type);
});

if (printTrigger) {
  printTrigger.addEventListener("click", () => {
    window.print();
  });
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("open");
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const animateCounter = (element) => {
  const target = Number(element.dataset.count || "0");
  const duration = 1100;
  const start = performance.now();

  const frame = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased).toString();
    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  };

  requestAnimationFrame(frame);
};

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

statValues.forEach((stat) => statsObserver.observe(stat));

if (pilotForm) {
  pilotForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = pilotForm.querySelector("button");
    if (button) {
      button.disabled = true;
      button.innerHTML = "<span>Pilot Request Sent</span>";
    }
  });
}
