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
const cardIndex = document.querySelector("#card-index");
const newQuoteButton = document.querySelector("#new-quote");
let currentIndex = -1;

function showRandomQuote() {
  let nextIndex;
  do {
    nextIndex = Math.floor(Math.random() * quotes.length);
  } while (quotes.length > 1 && nextIndex === currentIndex);

  currentIndex = nextIndex;
  const quote = quotes[currentIndex];
  quoteText.classList.add("is-changing");

  window.setTimeout(() => {
    quoteText.textContent = quote.text;
    quoteAuthor.textContent = quote.author;
    cardIndex.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(quotes.length).padStart(2, "0")}`;
    quoteText.classList.remove("is-changing");
  }, 160);
}

newQuoteButton.addEventListener("click", showRandomQuote);
showRandomQuote();
