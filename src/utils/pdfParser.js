import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import PdfjsWorker from './pdfWorkerEntry.js?worker';

// Polyfill per Safari/WebKit sul THREAD PRINCIPALE
// Il bug è in pdf.mjs → getTextContent() → for await (const value of readableStream)
// che gira sul main thread, NON nel worker
if (typeof ReadableStream !== 'undefined' && !ReadableStream.prototype[Symbol.asyncIterator]) {
  ReadableStream.prototype[Symbol.asyncIterator] = async function* () {
    const reader = this.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) return;
        yield value;
      }
    } finally {
      reader.releaseLock();
    }
  };
}

// Crea il worker bundled da Vite (risolve CORS, MIME e path automaticamente)
const _workerInstance = new PdfjsWorker();
GlobalWorkerOptions.workerPort = _workerInstance;

/**
 * Legge un file PDF e restituisce tutto il testo estratto suddiviso per pagine.
 * @param {File} file 
 * @param {boolean} onlyFirstPage
 * @returns {Promise<string>}
 */
export const extractTextFromPdf = async (file, onlyFirstPage = false) => {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  let fullText = "";
  const totalPages = onlyFirstPage ? 1 : pdf.numPages;
  
  for (let i = 1; i <= Math.min(totalPages, pdf.numPages); i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    // Raggruppa i blocchi di testo per y-coordinate (stessa riga)
    const textItems = textContent.items;
    
    // Ordiniamo prima per asse Y decrescente (dall'alto in basso) e poi per asse X (da sinistra a destra)
    const itemsWithCoords = textItems.map(item => ({
      text: item.str,
      x: item.transform[4],
      y: item.transform[5],
      height: item.height
    }));
    
    let lines = [];
    let currentY = null;
    let currentLine = [];
    
    const sortedItems = [...itemsWithCoords].sort((a, b) => b.y - a.y || a.x - b.x);
    
    sortedItems.forEach(item => {
      if (currentY === null || Math.abs(item.y - currentY) > 5) {
        if (currentLine.length > 0) {
          currentLine.sort((a, b) => a.x - b.x);
          lines.push(currentLine.map(i => i.text).join(' '));
        }
        currentLine = [item];
        currentY = item.y;
      } else {
        currentLine.push(item);
      }
    });
    
    if (currentLine.length > 0) {
      currentLine.sort((a, b) => a.x - b.x);
      lines.push(currentLine.map(i => i.text).join(' '));
    }
    
    fullText += lines.join('\n') + '\n\n';
  }
  
  return fullText;
};

/**
 * Parsifica il testo grezzo estratto dalla dieta e crea una struttura dati organizzata.
 * @param {string} text 
 * @returns {object}
 */
export const parseDietText = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  const diet = {
    colazione: [],
    spuntini: [],
    pranzoCarboidrati: [],
    pranzoProteine: [],
    pranzoVerdure: [],
    pranzoGrassi: [],
    cenaCarboidrati: [],
    cenaProteine: [],
    cenaVerdure: [],
    cenaGrassi: []
  };

  let currentSection = null; // 'colazione', 'spuntini', 'carboidrati', 'proteine', 'verdure', 'grassi'
  let currentMealMode = 'pranzo'; // 'pranzo' o 'cena' (default a pranzo)

  let isWeeklyMenuSection = false;
  let currentWeeklyDay = null;
  let currentWeeklyMeal = null; // 'colazione', 'spuntini', 'pranzo', 'cena', 'duranteLaGiornata'

  const normalizedDays = {
    'lunedì': 'lunedì', 'lunedi': 'lunedì',
    'martedì': 'martedì', 'martedi': 'martedì',
    'mercoledì': 'mercoledì', 'mercoledi': 'mercoledì',
    'giovedì': 'giovedì', 'giovedi': 'giovedì',
    'venerdì': 'venerdì', 'venerdi': 'venerdì',
    'sabato': 'sabato',
    'domenica': 'domenica'
  };

  // Helper per separare alimento e quantità
  const parseFoodItem = (str) => {
    let cleanStr = str.replace(/^[-*•\d+.\s]+/g, '').trim();
    if (!cleanStr) return { food: '', quantity: '' };

    // Caso A: Quantità alla fine (es. "Pasta (80g)" o "Pasta 80g" o "Pasta - 80g" o "Pasta: 80g")
    const trailingQtyRegex = /(?:[:\-(\s]\s*)(\d+\s*g(?:r)?|\d+\s*cucchiai\w*|\d+\s*pezzi|\d+\s*uova|a volontà)(?:\s*[-)]?)$/i;
    const trailMatch = cleanStr.match(trailingQtyRegex);
    if (trailMatch) {
      const quantity = trailMatch[1].trim();
      const food = cleanStr.replace(trailingQtyRegex, '').trim().replace(/[,.:-]$/, '').trim();
      return { food, quantity };
    }

    // Caso B: Quantità all'inizio (es. "80g di Pasta integrale" o "80g Pasta" o "2 uova" o "2 cucchiai di olio")
    const leadingQtyRegex = /^(\d+\s*g(?:r)?|\d+\s*cucchiai\w*|\d+\s*pezzi|\d+\s*uova|\d+\s*fette|\d+)\s*(?:di|d'|\s)\s*(.+)$/i;
    const leadMatch = cleanStr.match(leadingQtyRegex);
    if (leadMatch) {
      const quantity = leadMatch[1].trim();
      const food = leadMatch[2].trim().replace(/[,.:-]$/, '').trim();
      return { food, quantity };
    }

    // Caso C: C'è una grammatura in mezzo alla stringa (es. "Pane integrale 100g tostato")
    const midQtyRegex = /\b(\d+\s*g)\b/i;
    const midMatch = cleanStr.match(midQtyRegex);
    if (midMatch) {
      const quantity = midMatch[1].trim();
      const food = cleanStr.replace(midQtyRegex, '').replace(/\s+/g, ' ').trim().replace(/[,.:-]$/, '').trim();
      return { food, quantity };
    }

    return { food: cleanStr, quantity: '' };
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLower = line.toLowerCase();

    if (lineLower.includes('riepilogo settimanale') || lineLower.includes('menu settimanale') || lineLower.includes('menù settimanale')) {
      isWeeklyMenuSection = true;
      currentSection = null;
      continue;
    }

    if (isWeeklyMenuSection) {
      // Rileva giorno della settimana
      let foundDay = null;
      for (const d of Object.keys(normalizedDays)) {
        if (lineLower === d || lineLower.startsWith(d + ' ') || lineLower.endsWith(' ' + d) || (lineLower.includes(d) && line.length < 20)) {
          foundDay = normalizedDays[d];
          break;
        }
      }

      if (foundDay) {
        currentWeeklyDay = foundDay;
        currentWeeklyMeal = null;
        if (!diet.weeklyMenu) diet.weeklyMenu = {};
        if (!diet.weeklyMenu[currentWeeklyDay]) {
          diet.weeklyMenu[currentWeeklyDay] = {
            colazione: [],
            spuntinoMattina: [],
            spuntinoPomeriggio: [],
            pranzo: [],
            cena: [],
            duranteLaGiornata: []
          };
        }
        continue;
      }

      if (currentWeeklyDay) {
        // Rileva pasto della sezione settimanale
        let detectedMeal = null;
        let mealContent = null;

        if (lineLower.includes('colazione')) {
          detectedMeal = 'colazione';
        } else if (lineLower.includes('metà mattina') || lineLower.includes('meta mattina') || lineLower.includes('spuntino mattina')) {
          detectedMeal = 'spuntinoMattina';
        } else if (lineLower.includes('merenda') || lineLower.includes('spuntino pomeriggio') || lineLower.includes('spuntino pomeridiano')) {
          detectedMeal = 'spuntinoPomeriggio';
        } else if (lineLower.includes('spuntin')) {
          const m = diet.weeklyMenu[currentWeeklyDay];
          detectedMeal = (!m.spuntinoMattina || m.spuntinoMattina.length === 0) ? 'spuntinoMattina' : 'spuntinoPomeriggio';
        } else if (lineLower.includes('pranzo')) {
          detectedMeal = 'pranzo';
        } else if (lineLower.includes('cena')) {
          detectedMeal = 'cena';
        } else if (lineLower.includes('durante la giornata') || lineLower.includes('condiment') || lineLower.includes('grassi')) {
          detectedMeal = 'duranteLaGiornata';
        }

        if (detectedMeal) {
          currentWeeklyMeal = detectedMeal;
          // Verifica se c'è del contenuto sulla stessa riga (es. "Colazione: Latte e biscotti")
          const separatorIdx = line.indexOf(':');
          if (separatorIdx !== -1) {
            mealContent = line.substring(separatorIdx + 1).trim();
          } else {
            const keywordPattern = /^(colazione|metà mattina|meta mattina|spuntino mattina|spuntino pomeriggio|spuntino pomeridiano|merenda|spuntino|pranzo|cena|durante la giornata|condimenti|grassi)/i;
            const temp = line.replace(keywordPattern, '').replace(/^[:\-–—\s]+/g, '').trim();
            if (temp.length > 2) {
              mealContent = temp;
            }
          }
        }

        // Se abbiamo rilevato un pasto E c'è contenuto sulla stessa riga
        if (detectedMeal && mealContent && mealContent.length > 1) {
          if (mealContent.toLowerCase().includes('elaborato da') || mealContent.toLowerCase().includes('puoi scegliere') || mealContent.toLowerCase().includes('scegli una') || mealContent.toLowerCase().includes('in alternativa') || mealContent.toLowerCase().includes('note del pasto') || mealContent.toLowerCase().includes('nota:')) {
            // Salta note
          } else {
            const items = mealContent.split(/[+]/).map(item => item.trim()).filter(item => item.length > 1);
            items.forEach(item => {
              const cleanItem = item.replace(/^[●•▪\-*•\d+.\s]+/g, '').trim();
              if (cleanItem.length > 1) {
                if (currentWeeklyMeal === 'spuntinoMattina' || currentWeeklyMeal === 'spuntinoPomeriggio') {
                  if (currentWeeklyMeal === 'spuntinoMattina') {
                    diet.weeklyMenu[currentWeeklyDay].spuntinoMattina.push(cleanItem);
                  } else {
                    diet.weeklyMenu[currentWeeklyDay].spuntinoPomeriggio.push(cleanItem);
                  }
                } else {
                  diet.weeklyMenu[currentWeeklyDay][currentWeeklyMeal].push(cleanItem);
                }
              }
            });
          }
          continue;
        } else if (detectedMeal) {
          continue;
        }

        // Se siamo all'interno di un pasto settimanale, leggiamo le righe successive
        if (currentWeeklyMeal) {
          if (lineLower.includes('elaborato da') || lineLower.includes('puoi scegliere') || lineLower.includes('scegli una') || lineLower.includes('in alternativa') || lineLower.includes('note del pasto') || lineLower.includes('nota:')) {
            continue;
          }

          const items = line.split(/[+]/).map(item => item.trim()).filter(item => item.length > 1);
          items.forEach(item => {
            const cleanItem = item.replace(/^[●•▪\-*•\d+.\s]+/g, '').trim();
            if (cleanItem.length > 1) {
              if (currentWeeklyMeal === 'spuntinoMattina' || currentWeeklyMeal === 'spuntinoPomeriggio') {
                if (currentWeeklyMeal === 'spuntinoMattina') {
                  diet.weeklyMenu[currentWeeklyDay].spuntinoMattina.push(cleanItem);
                } else {
                  diet.weeklyMenu[currentWeeklyDay].spuntinoPomeriggio.push(cleanItem);
                }
              } else {
                diet.weeklyMenu[currentWeeklyDay][currentWeeklyMeal].push(cleanItem);
              }
            }
          });
        }
      }
      continue;
    }

    // Salta separatori decorativi (lineette, trattini lunghi, ecc.)
    if (/^[─\-=_*•~\s]+$/.test(line)) continue;

    // Rileva se stiamo leggendo la sezione PRANZO o la sezione CENA
    if (line.length < 35 && lineLower.includes('pranzo') && !lineLower.includes('carboidrat') && !lineLower.includes('protein')) {
      currentMealMode = 'pranzo';
      currentSection = null;
      continue;
    } else if (line.length < 35 && (lineLower === 'cena' || (lineLower.includes('cena') && !lineLower.includes('carboidrat') && !lineLower.includes('protein') && !lineLower.includes('merend') && line.length < 20))) {
      currentMealMode = 'cena';
      currentSection = null;
      continue;
    }

    // Una vera intestazione di sezione deve contenere una keyword nota E non avere quantità in grammi
    const hasKnownKeyword = 
      lineLower.includes('colazione') || lineLower.includes('mattino') || lineLower.includes('la mattina') ||
      lineLower.includes('spuntin') || lineLower.includes('merend') ||
      lineLower.includes('carboidrat') || lineLower.includes('primo') || lineLower.includes('primi') ||
      lineLower.includes('protein') || lineLower.includes('secondi') || lineLower.includes('secondo') ||
      lineLower.includes('verdur') || lineLower.includes('contorn') ||
      (lineLower.includes('grassi') && line.length < 20) || lineLower.includes('condiment');

    const isSectionHeader = hasKnownKeyword && line.length < 45 && !lineLower.match(/\d+\s*g/);

    if (isSectionHeader) {
      if (lineLower.includes('colazione') || lineLower.includes('la mattina') || lineLower.includes('mattino')) {
        currentSection = 'colazione';
      } else if (lineLower.includes('spuntin') || lineLower.includes('merend')) {
        currentSection = 'spuntini';
      } else if (lineLower.includes('carboidrat') || lineLower.includes('primi') || lineLower.includes('primo')) {
        currentSection = 'carboidrati';
      } else if (lineLower.includes('protein') || lineLower.includes('secondi') || lineLower.includes('secondo')) {
        currentSection = 'proteine';
      } else if (lineLower.includes('verdur') || lineLower.includes('contorn')) {
        currentSection = 'verdure';
      } else if (lineLower.includes('grassi') || lineLower.includes('condiment')) {
        currentSection = 'grassi';
      }
      continue;
    }

    // Se siamo all'interno di una sezione catturata, elaboriamo la riga
    if (currentSection) {
      if (line.length < 35 && (line.endsWith(':') || lineLower.includes('avvertenze') || lineLower.includes('nota') || lineLower.includes('clinica'))) {
        currentSection = null;
        continue;
      }

      const itemContent = line.replace(/^[-*•\d+.\s]+/g, '').trim();
      if (itemContent.length < 2) continue;

      if (currentSection === 'colazione' || currentSection === 'spuntini') {
        const id = `${currentSection.slice(0,3)}-${Math.random().toString(36).substr(2, 9)}`;
        diet[currentSection].push({ id, content: itemContent });
      } else {
        // Alimenti macro (Carboidrati, Proteine, Verdure, Grassi) divisi per Pranzo e Cena
        const parsed = parseFoodItem(line);
        if (parsed.food && parsed.food.length > 1) {
          const id = `${currentMealMode.slice(0,1)}-${currentSection.slice(0,3)}-${Math.random().toString(36).substr(2, 9)}`;
          const categoryKey = `${currentMealMode}${currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}`;
          
          if (diet[categoryKey]) {
            diet[categoryKey].push({ id, ...parsed });
          }
        }
      }
    }
  }

  // Fallback: se Pranzo o Cena non contengono carboidrati o proteine, proviamo una scansione globale
  const totalMacros = diet.pranzoCarboidrati.length + diet.cenaCarboidrati.length + diet.pranzoProteine.length + diet.cenaProteine.length;
  if (totalMacros === 0) {
    lines.forEach(line => {
      const lineLower = line.toLowerCase();
      const parsed = parseFoodItem(line);
      if (parsed.food && parsed.quantity) {
        const id = `fallback-${Math.random().toString(36).substr(2, 9)}`;
        // Distribuiamo grossolanamente i cibi in base al nome
        if (lineLower.includes('pollo') || lineLower.includes('tacchino') || lineLower.includes('pesce') || lineLower.includes('uova')) {
          diet.pranzoProteine.push({ id: `p-${id}`, ...parsed });
          diet.cenaProteine.push({ id: `c-${id}`, ...parsed });
        } else if (lineLower.includes('pasta') || lineLower.includes('riso') || lineLower.includes('farro') || lineLower.includes('quinoa')) {
          diet.pranzoCarboidrati.push({ id: `p-${id}`, ...parsed });
        } else if (lineLower.includes('pane') || lineLower.includes('patate')) {
          diet.cenaCarboidrati.push({ id: `c-${id}`, ...parsed });
        } else if (lineLower.includes('olio') || lineLower.includes('avocado')) {
          diet.pranzoGrassi.push({ id: `p-${id}`, ...parsed });
          diet.cenaGrassi.push({ id: `c-${id}`, ...parsed });
        } else if (lineLower.includes('insalata') || lineLower.includes('verdura') || lineLower.includes('zucchine')) {
          diet.pranzoVerdure.push({ id: `p-${id}`, ...parsed });
          diet.cenaVerdure.push({ id: `c-${id}`, ...parsed });
        }
      }
    });
  }

  // Rimuovi duplicati
  Object.keys(diet).forEach(key => {
    if (!Array.isArray(diet[key])) return;
    const seen = new Set();
    diet[key] = diet[key].filter(item => {
      const val = key === 'colazione' || key === 'spuntini' ? item.content : `${item.food}-${item.quantity}`;
      if (seen.has(val)) return false;
      seen.add(val);
      return true;
    });
  });

  // Classificazione e associazione automatica del menù settimanale
  if (diet.weeklyMenu) {
    const computeSimilarity = (str1, str2) => {
      if (!str1 || !str2) return 0;
      const normalize = (s) => {
        return s
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9\s]/g, '')
          .trim();
      };

      const s1 = normalize(str1);
      const s2 = normalize(str2);

      if (s1 === s2) return 1.0;
      if (s1.includes(s2) || s2.includes(s1)) {
        const lenDiff = Math.abs(s1.length - s2.length);
        const maxLen = Math.max(s1.length, s2.length);
        return 0.8 + (1 - lenDiff / maxLen) * 0.15;
      }

      const words1 = s1.split(/\s+/).filter(w => w.length > 2);
      const words2 = s2.split(/\s+/).filter(w => w.length > 2);
      if (words1.length === 0 || words2.length === 0) return 0;

      let intersection = 0;
      words1.forEach(w => {
        if (words2.includes(w)) intersection++;
      });

      return intersection / Math.max(words1.length, words2.length);
    };

    const findBestOptionMatch = (weeklyItems, optionList) => {
      if (!weeklyItems || weeklyItems.length === 0 || !optionList || optionList.length === 0) {
        return null;
      }
      const searchStr = weeklyItems.join(' ');
      let bestMatch = null;
      let bestScore = -1;

      for (const option of optionList) {
        const score = computeSimilarity(searchStr, option.content || '');
        if (score > bestScore) {
          bestScore = score;
          bestMatch = option;
        }
      }
      return bestScore > 0.25 ? bestMatch : null;
    };

    const findBestMacroMatch = (weeklyMealLines, categoryList) => {
      if (!weeklyMealLines || weeklyMealLines.length === 0 || !categoryList || categoryList.length === 0) {
        return null;
      }
      let bestMatch = null;
      let bestScore = -1;

      for (const candidate of categoryList) {
        for (const line of weeklyMealLines) {
          const score = computeSimilarity(line, candidate.food || '');
          if (score > bestScore) {
            bestScore = score;
            bestMatch = candidate;
          }
        }
      }
      return bestScore > 0.25 ? bestMatch : null;
    };

    Object.keys(diet.weeklyMenu).forEach(day => {
      const dayData = diet.weeklyMenu[day];

      // Salva copia dei dati grezzi
      const raw = {
        colazione: [...(dayData.colazione || [])],
        spuntinoMattina: [...(dayData.spuntinoMattina || [])],
        spuntinoPomeriggio: [...(dayData.spuntinoPomeriggio || [])],
        pranzo: [...(dayData.pranzo || [])],
        cena: [...(dayData.cena || [])],
        duranteLaGiornata: [...(dayData.duranteLaGiornata || [])]
      };

      // Associa opzioni (Colazione e Spuntini)
      const matchedColazione = findBestOptionMatch(dayData.colazione, diet.colazione);
      const matchedSpuntinoMattina = findBestOptionMatch(dayData.spuntinoMattina, diet.spuntini);
      const matchedSpuntinoPomeriggio = findBestOptionMatch(dayData.spuntinoPomeriggio, diet.spuntini);

      // Associa macro-nutrienti (Pranzo e Cena)
      const matchedPranzo = {
        carboidrati: findBestMacroMatch(dayData.pranzo, diet.pranzoCarboidrati),
        proteine: findBestMacroMatch(dayData.pranzo, diet.pranzoProteine),
        verdure: findBestMacroMatch(dayData.pranzo, diet.pranzoVerdure),
        grassi: findBestMacroMatch(dayData.pranzo, diet.pranzoGrassi)
      };

      const matchedCena = {
        carboidrati: findBestMacroMatch(dayData.cena, diet.cenaCarboidrati),
        proteine: findBestMacroMatch(dayData.cena, diet.cenaProteine),
        verdure: findBestMacroMatch(dayData.cena, diet.cenaVerdure),
        grassi: findBestMacroMatch(dayData.cena, diet.cenaGrassi)
      };

      diet.weeklyMenu[day] = {
        raw,
        colazione: matchedColazione,
        spuntinoMattina: matchedSpuntinoMattina,
        spuntinoPomeriggio: matchedSpuntinoPomeriggio,
        pranzo: matchedPranzo,
        cena: matchedCena
      };
    });
  }

  return diet;
};

/**
 * Parsifica il testo grezzo di un report BIA ed estrae i dati fisiologici e di composizione corporea.
 * @param {string} text 
 * @returns {object}
 */
export const parseBiaText = (text) => {
  if (!text) return null;

  const data = {
    gender: '',
    age: '',
    height: '',
    weight: '',
    bmr: '',
    fatMassPercent: '',
    muscleMassKg: ''
  };

  const lines = text.split('\n').map(l => l.trim());

  // Helper per convertire stringhe numeriche con virgola in float
  const parseNum = (str) => {
    if (!str) return null;
    let clean = str.replace(',', '.').trim();
    // Se è presente il punto come separatore delle migliaia (es. 1.158), lo rimuoviamo
    if (clean.includes('.')) {
      const parts = clean.split('.');
      if (parts[0].length === 1 && parts[1].length === 3) {
        clean = parts[0] + parts[1];
      }
    }
    const val = parseFloat(clean);
    return isNaN(val) ? null : val;
  };

  for (let line of lines) {
    const lineLower = line.toLowerCase();

    // Sesso, Età, Altezza
    if (lineLower.includes('sesso') || lineLower.includes('età') || lineLower.includes('altezza') || lineLower.includes('eta:')) {
      const genderMatch = line.match(/Sesso:\s*([A-Za-z]+)/i);
      const ageMatch = line.match(/Età:\s*(\d+)/i) || line.match(/Eta:\s*(\d+)/i);
      const heightMatch = line.match(/Altezza:\s*(\d+)/i);

      if (genderMatch) {
        const g = genderMatch[1].toLowerCase();
        if (g.startsWith('f') || g === 'femmina' || g === 'female') data.gender = 'Femmina';
        else if (g.startsWith('m') || g === 'maschio' || g === 'male') data.gender = 'Maschio';
      }
      if (ageMatch) {
        data.age = parseInt(ageMatch[1], 10);
      }
      if (heightMatch) {
        data.height = parseInt(heightMatch[1], 10);
      }
    }

    // Peso (ma evitando "Peso ideale" e "Punteggio")
    if (lineLower.includes('peso') && !lineLower.includes('ideale') && !lineLower.includes('punteggio')) {
      const weightMatch = line.match(/Peso\s+([0-9.,]+)/i);
      if (weightMatch) {
        data.weight = parseNum(weightMatch[1]);
      }
    }

    // BMR
    if (lineLower.includes('bmr')) {
      const bmrMatch = line.match(/BMR\s+([0-9.,]+)/i);
      if (bmrMatch) {
        data.bmr = parseNum(bmrMatch[1]);
      }
    }

    // Massa grassa
    if (lineLower.includes('massa grassa')) {
      const fatPercentMatch = line.match(/\(\s*([0-9.,]+)\s*%\)/) || line.match(/([0-9.,]+)\s*%/);
      if (fatPercentMatch) {
        data.fatMassPercent = parseNum(fatPercentMatch[1]);
      }
    }

    // Massa muscolare
    if (lineLower.includes('massa muscolare') && !lineLower.includes('scheletrica')) {
      const muscleMatch = line.match(/Massa muscolare\s+([0-9.,]+)/i);
      if (muscleMatch) {
        data.muscleMassKg = parseNum(muscleMatch[1]);
      }
    }
  }

  // Fallback globali sul testo se non ha trovato i valori riga per riga
  if (!data.weight) {
    const wMatch = text.match(/Peso\s+([0-9.,]+)\s*kg/i);
    if (wMatch) data.weight = parseNum(wMatch[1]);
  }
  if (!data.bmr) {
    const bMatch = text.match(/BMR\s+([0-9.,]+)\s*kcal/i) || text.match(/BMR\s+([0-9.,]+)/i);
    if (bMatch) data.bmr = parseNum(bMatch[1]);
  }
  if (!data.fatMassPercent) {
    const fgMatch = text.match(/Massa\s+grassa\s+\d+(?:[.,]\d+)?\s*kg\s*\(\s*([0-9.,]+)\s*%\)/i);
    if (fgMatch) data.fatMassPercent = parseNum(fgMatch[1]);
  }
  if (!data.muscleMassKg) {
    const mmMatch = text.match(/Massa\s+muscolare\s+([0-9.,]+)\s*kg/i);
    if (mmMatch) data.muscleMassKg = parseNum(mmMatch[1]);
  }

  return data;
};

