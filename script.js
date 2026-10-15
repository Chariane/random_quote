const quoteApiUrl = "https://dummyjson.com/quotes/random";

const quoteText = document.querySelector("#quote-text");
const quoteAuthor = document.querySelector("#quote-author");
const quoteByline = document.querySelector(".quote-byline");
const cardIndex = document.querySelector("#card-index");
const newQuoteButton = document.querySelector("#new-quote");
const newQuoteLabel = document.querySelector("#new-quote-label");
const apiStatus = document.querySelector("#api-status");
const themeToggle = document.querySelector("#theme-toggle");
const themeLabel = document.querySelector("#theme-label");
const themeColor = document.querySelector("#theme-color");
const copyButton = document.querySelector("#copy-quote");
const copyLabel = document.querySelector("#copy-label");
let currentQuote = null;
let changeTimer;
let copyLabelTimer;

function showQuote(quote) {
  currentQuote = quote;
  quoteText.classList.add("is-changing");
  quoteByline.classList.add("is-changing");
  window.clearTimeout(changeTimer);
  changeTimer = window.setTimeout(() => {
    quoteText.textContent = quote.quote;
    quoteAuthor.textContent = quote.author;
    cardIndex.textContent = `#${String(quote.id).padStart(3, "0")}`;
    quoteText.classList.remove("is-changing");
    quoteByline.classList.remove("is-changing");
  }, 150);
}

async function getRandomQuote() {
  if (newQuoteButton.disabled) return;

  newQuoteButton.disabled = true;
  newQuoteButton.setAttribute("aria-busy", "true");
  newQuoteLabel.textContent = "Finding a quote…";
  apiStatus.classList.remove("is-visible");
  apiStatus.textContent = "";

  try {
    let nextQuote = null;
    // A random API can occasionally return the previous quote. Retry so every
    // successful click produces a different one.
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const response = await fetch(`${quoteApiUrl}?_=${Date.now()}-${attempt}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) throw new Error("Quote service is unavailable.");
      const quote = await response.json();
      if (
        typeof quote.quote !== "string" ||
        typeof quote.author !== "string" ||
        !Number.isFinite(Number(quote.id))
      ) {
        throw new Error("The quote service returned an unexpected response.");
      }
      if (!currentQuote || quote.quote.trim() !== currentQuote.quote.trim()) {
        nextQuote = quote;
        break;
      }
    }

    if (!nextQuote) throw new Error("The service repeated the previous quote.");
    showQuote(nextQuote);
  } catch (_) {
    apiStatus.textContent = currentQuote
      ? "Couldn’t load a new quote. Check your connection and try again."
      : "Couldn’t reach the quote library. Check your connection, then try again.";
    apiStatus.classList.add("is-visible");
    if (!currentQuote) {
      quoteText.textContent = "Your next thought is just a retry away.";
      quoteAuthor.textContent = "Connection needed";
      cardIndex.textContent = "—";
    }
  } finally {
    newQuoteButton.disabled = false;
    newQuoteButton.removeAttribute("aria-busy");
    newQuoteLabel.textContent = "Another thought";
  }
}

function applyTheme(theme, save = false) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
  themeToggle.title = `Switch to ${isDark ? "light" : "dark"} mode`;
  themeLabel.textContent = isDark ? "Dark" : "Light";
  themeColor.content = isDark ? "#151714" : "#f6f5f1";

  if (save) {
    try {
      localStorage.setItem("small-words-theme", theme);
    } catch (_) {
      // Theme switching still works for this visit when browser storage is unavailable.
    }
  }
}

async function copyCurrentQuote() {
  if (!currentQuote) return;
  const textToCopy = `“${currentQuote.quote}” — ${currentQuote.author}`;

  try {
    await navigator.clipboard.writeText(textToCopy);
  } catch (_) {
    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = textToCopy;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";
    document.body.append(temporaryInput);
    temporaryInput.select();
    const copied = document.execCommand("copy");
    temporaryInput.remove();
    if (!copied) {
      apiStatus.textContent = "Couldn’t copy the quote.";
      apiStatus.classList.add("is-visible");
      return;
    }
  }

  copyLabel.textContent = "Copied";
  apiStatus.textContent = "Quote copied to clipboard.";
  apiStatus.classList.add("is-visible");
  window.clearTimeout(copyLabelTimer);
  copyLabelTimer = window.setTimeout(() => {
    copyLabel.textContent = "Copy";
  }, 1500);
}

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme, true);
});
newQuoteButton.addEventListener("click", getRandomQuote);
copyButton.addEventListener("click", copyCurrentQuote);
applyTheme(document.documentElement.dataset.theme || "light");
getRandomQuote();
