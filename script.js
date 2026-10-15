const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it’s done.", author: "Nelson Mandela" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C. S. Lewis" },
  { text: "No act of kindness, no matter how small, is ever wasted.", author: "Aesop" },
  { text: "Happiness depends upon ourselves.", author: "Aristotle" },
  { text: "Nothing will work unless you do.", author: "Maya Angelou" },
  { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "What we think, we become.", author: "Buddha" },
  { text: "Keep your face always toward the sunshine, and shadows will fall behind you.", author: "Walt Whitman" },
];

const quoteText = document.querySelector("#quote-text");
const quoteAuthor = document.querySelector("#quote-author");
const quoteByline = document.querySelector(".quote-byline");
const cardIndex = document.querySelector("#card-index");
const newQuoteButton = document.querySelector("#new-quote");
const themeToggle = document.querySelector("#theme-toggle");
const themeLabel = document.querySelector("#theme-label");
const themeColor = document.querySelector("#theme-color");
const copyButton = document.querySelector("#copy-quote");
const copyLabel = document.querySelector("#copy-label");
const actionStatus = document.querySelector("#action-status");
let currentIndex = -1;
let changeTimer;
let copyLabelTimer;

function showRandomQuote() {
  let nextIndex;
  do {
    nextIndex = Math.floor(Math.random() * quotes.length);
  } while (quotes.length > 1 && nextIndex === currentIndex);

  currentIndex = nextIndex;
  const quote = quotes[currentIndex];
  quoteText.classList.add("is-changing");
  quoteByline.classList.add("is-changing");
  window.clearTimeout(changeTimer);
  changeTimer = window.setTimeout(() => {
    quoteText.textContent = quote.text;
    quoteAuthor.textContent = quote.author;
    cardIndex.innerHTML = `${String(currentIndex + 1).padStart(2, "0")} <span>/</span> ${String(quotes.length).padStart(2, "0")}`;
    quoteText.classList.remove("is-changing");
    quoteByline.classList.remove("is-changing");
  }, 150);
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
  const quote = quotes[currentIndex];
  const textToCopy = `“${quote.text}” — ${quote.author}`;

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
      actionStatus.textContent = "Could not copy the quote.";
      return;
    }
  }

  copyLabel.textContent = "Copied";
  actionStatus.textContent = "Quote copied to clipboard.";
  window.clearTimeout(copyLabelTimer);
  copyLabelTimer = window.setTimeout(() => {
    copyLabel.textContent = "Copy";
  }, 1500);
}

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme, true);
});
newQuoteButton.addEventListener("click", showRandomQuote);
copyButton.addEventListener("click", copyCurrentQuote);
applyTheme(document.documentElement.dataset.theme || "light");
showRandomQuote();
