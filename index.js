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
const language = document.documentElement.lang || "pt-BR";
const messages = {
  "pt-BR": { loadError: "Não foi possível carregar as frases agora. Tente novamente mais tarde.", empty: "A coleção está vazia.", copy: "Copiar frase", copied: "Copiada!", copyError: "Não foi possível copiar", emptySearch: "Digite uma palavra ou expressão para pesquisar na coleção.", foundOne: " frase encontrada.", foundMany: " frases encontradas.", limited: " resultados exibidos (limite de 12).", none: "Nenhuma frase encontrada. Tente uma palavra diferente.", use: "Usar esta frase" },
  en: { loadError: "Quotes could not be loaded right now. Please try again later.", empty: "The collection is empty.", copy: "Copy quote", copied: "Copied!", copyError: "Could not copy the quote", emptySearch: "Enter a word or phrase to search the collection.", foundOne: " quote found.", foundMany: " quotes found.", limited: " results shown (limit: 12).", none: "No quotes found. Try another word.", use: "Use this quote" },
  es: { loadError: "No se pudieron cargar las frases. Inténtalo de nuevo más tarde.", empty: "La colección está vacía.", copy: "Copiar frase", copied: "¡Copiada!", copyError: "No se pudo copiar la frase", emptySearch: "Escribe una palabra o expresión para buscar en la colección.", foundOne: " frase encontrada.", foundMany: " frases encontradas.", limited: " resultados mostrados (límite: 12).", none: "No se encontraron frases. Prueba con otra palabra.", use: "Usar esta frase" }
};
const message = messages[language] || messages["pt-BR"];
const quoteDataUrl = new URL("olavo.json", document.querySelector('script[src$="index.js"]').src).href;

async function loadQuotes() {
  try {
    const response = await fetch(quoteDataUrl);
    if (!response.ok) throw new Error(message.loadError);
    const data = await response.json();
    quotes = [...new Set(data.map(item => (item.olavo || "").trim()).filter(Boolean))];
    if (!quotes.length) throw new Error(message.empty);
    generateButton.disabled = false;
  } catch (error) {
    quoteElement.textContent = message.loadError;
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
  copyButton.textContent = message.copy;
}

function searchQuotes() {
  const term = searchInput.value.trim().toLocaleLowerCase(language);
  resultsList.replaceChildren();

  if (!term) {
    searchStatus.textContent = message.emptySearch;
    return;
  }

  const matches = quotes.filter(quote => quote.toLocaleLowerCase(language).includes(term)).slice(0, 12);
  searchStatus.textContent = matches.length
    ? matches.length + (matches.length === 12 ? message.limited : matches.length === 1 ? message.foundOne : message.foundMany)
    : message.none;

  matches.forEach(quote => {
    const item = document.createElement("li");
    const text = document.createElement("p");
    const copy = document.createElement("button");
    text.textContent = "“" + quote + "”";
    copy.type = "button";
    copy.className = "result-copy";
    copy.textContent = message.use;
    copy.addEventListener("click", () => {
      currentQuote = quote;
      quoteElement.textContent = quote;
      copyButton.disabled = false;
      copyButton.textContent = message.copy;
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
    copyButton.textContent = message.copied;
  } catch {
    copyButton.textContent = message.copyError;
  }
});

generateButton.disabled = true;
loadQuotes();