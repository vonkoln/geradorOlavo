const quoteElement = document.getElementById("olavo");
const generateButton = document.getElementById("btn");
const copyButton = document.getElementById("copy-quote");
const searchInput = document.getElementById("quote-search-input");
const searchButton = document.getElementById("search-quotes");
const searchStatus = document.getElementById("search-status");
const resultsList = document.getElementById("quote-results");

let quotes = [];
let usedQuotes = new Set();
let currentQuote = "";

async function loadQuotes() {
  try {
    const response = await fetch("olavo.json");
    if (!response.ok) throw new Error("Não foi possível carregar a coleção.");
    const data = await response.json();
    quotes = [...new Set(data.map(item => (item.olavo || "").trim()).filter(Boolean))];
    if (!quotes.length) throw new Error("A coleção está vazia.");
    generateButton.disabled = false;
  } catch (error) {
    quoteElement.textContent = "Não foi possível carregar as frases agora. Tente novamente mais tarde.";
    generateButton.disabled = true;
    console.error(error);
  }
}

function generateQuote() {
  if (!quotes.length) return;
  if (usedQuotes.size >= quotes.length) usedQuotes.clear();

  let available = quotes.filter(quote => !usedQuotes.has(quote));
  const quote = available[Math.floor(Math.random() * available.length)];
  usedQuotes.add(quote);
  currentQuote = quote;
  quoteElement.textContent = quote;
  copyButton.disabled = false;
  copyButton.textContent = "Copiar frase";
}

function searchQuotes() {
  const term = searchInput.value.trim().toLocaleLowerCase("pt-BR");
  resultsList.replaceChildren();

  if (!term) {
    searchStatus.textContent = "Digite uma palavra ou expressão para pesquisar na coleção.";
    return;
  }

  const matches = quotes.filter(quote => quote.toLocaleLowerCase("pt-BR").includes(term)).slice(0, 12);
  searchStatus.textContent = matches.length
    ? matches.length + (matches.length === 12 ? " resultados exibidos (limite de 12)." : matches.length === 1 ? " frase encontrada." : " frases encontradas.")
    : "Nenhuma frase encontrada. Tente uma palavra diferente.";

  matches.forEach(quote => {
    const item = document.createElement("li");
    const text = document.createElement("p");
    const copy = document.createElement("button");
    text.textContent = "“" + quote + "”";
    copy.type = "button";
    copy.className = "result-copy";
    copy.textContent = "Usar esta frase";
    copy.addEventListener("click", () => {
      currentQuote = quote;
      quoteElement.textContent = quote;
      copyButton.disabled = false;
      copyButton.textContent = "Copiar frase";
      quoteElement.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    item.append(text, copy);
    resultsList.append(item);
  });
}

generateButton.addEventListener("click", generateQuote);
searchButton.addEventListener("click", searchQuotes);
searchInput.addEventListener("keydown", event => {
  if (event.key === "Enter") searchQuotes();
});
copyButton.addEventListener("click", async () => {
  if (!currentQuote) return;
  try {
    await navigator.clipboard.writeText(currentQuote);
    copyButton.textContent = "Copiada!";
  } catch {
    copyButton.textContent = "Não foi possível copiar";
  }
});

generateButton.disabled = true;
loadQuotes();