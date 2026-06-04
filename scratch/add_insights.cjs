const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/PatientView.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Le spiegazioni (insights) di valore, organizzate per settimana e giorno
const insights = [
  // Settimana 1: Connessione Corporea
  [
    "Il respiro profondo stimola il nervo vago, abbassando il cortisolo (l'ormone dello stress) e preparando il tuo sistema digestivo ad assimilare i nutrienti senza gonfiore.",
    "Le mani sulla pancia ti aiutano a spostare l'attenzione dalla testa al corpo, radicandoti nel momento presente e disattivando l'ansia anticipatoria.",
    "Respirare profondamente prima di cena crea un confine netto tra le tensioni lavorative della giornata e il momento del nutrimento e del riposo.",
    "Mangiare ad occhi chiusi elimina le distrazioni visive, amplificando i sensi del gusto e dell'olfatto per una maggiore soddisfazione sensoriale.",
    "Una pausa di 10 secondi interrompe l'automatismo dell'alimentazione veloce, permettendoti di valutare il tuo livello di sazietà a metà pasto.",
    "Espandere il torace e le spalle al mattino migliora la postura e l'ossigenazione, dandoti energia vitale senza dover dipendere subito dalla caffeina.",
    "Consumare un pasto senza distrazioni (TV, smartphone) aumenta l'appagamento mentale: il cervello registra di aver mangiato, prevenendo le voglie fuori pasto."
  ],
  // Settimana 2: Riconoscere la Fame
  [
    "Capire la differenza tra il vuoto gastrico e la voglia mentale è il primo passo per smettere di usare il cibo come calmante emotivo.",
    "Dare un voto alla tua fame (es. 6 su 10) ti rende un osservatore oggettivo, togliendo urgenza e impulsività al momento del pasto.",
    "La stanchezza mentale pomeridiana viene spesso confusa con la fame. Chiederti cosa provi realmente previene i classici spuntini nervosi.",
    "L'acqua riempie momentaneamente lo stomaco e la pausa di 5 minuti permette all'ondata di fame emotiva di perdere la sua intensità.",
    "Fare merenda solo se c'è un bisogno fisico riallinea il tuo metabolismo, evitando picchi glicemici inutili dovuti ad alimentazione per noia.",
    "Scrivere sul diario i segnali fisici crea consapevolezza corporea: impari a riconoscere il linguaggio unico con cui il tuo corpo chiede energia.",
    "Scoprire quale pasto è guidato dall'abitudine ti svela i tuoi schemi automatici, dandoti il potere di cambiarli consapevolmente."
  ],
  // Settimana 3: Mangiare Lentamente
  [
    "Poggiare la posata spezza la meccanicità del gesto occhio-mano-bocca, rallentando naturalmente il pasto senza sforzo mentale.",
    "Masticare a lungo pre-digerisce il cibo nella bocca grazie agli enzimi salivari, riducendo drasticamente il senso di pesantezza post-prandiale.",
    "Cronometrare il pasto ti dà un riferimento oggettivo. Il cervello impiega circa 20 minuti per registrare i segnali di sazietà inviati dallo stomaco.",
    "L'acqua a piccoli sorsi tra un boccone e l'altro aiuta a ripulire il palato e idrata il bolo alimentare, migliorando il transito intestinale.",
    "Condividere un pasto parlando rallenta l'ingestione e trasforma l'atto del mangiare in un'esperienza sociale e appagante, non solo calorica.",
    "Mangiare con la mano non dominante richiede una concentrazione extra, bloccando completamente il consumo automatico e distratto.",
    "Essere sazi senza sentirsi appesantiti è l'obiettivo d'oro: significa aver fornito energia al corpo senza sovraccaricare la digestione."
  ],
  // Settimana 4: Riconoscere la Sazietà
  [
    "Concentrarsi sulla pancia permette di sentire la pressione gastrica che aumenta, il segnale fisico più chiaro che lo stomaco è piacevolmente pieno.",
    "Usare la scala della sazietà ti aiuta a fermarti al livello 7 o 8, prima di raggiungere il livello 10 (la spiacevole sensazione di essere 'scoppiati').",
    "Smettendo di mangiare appena la fame scompare (anziché quando si è pieni) si allena il corpo a vivere di un'energia leggera e costante.",
    "Il calo del gusto è un fenomeno neurologico (sazietà sensoriale specifica): il primo boccone è delizioso, l'ultimo è solo un'abitudine. Riconoscilo per fermarti.",
    "Lasciare qualcosa nel piatto rompe il condizionamento infantile del 'devi finire tutto', restituendoti il controllo completo sulle porzioni.",
    "La pausa a tre quarti del pasto ti dà il tempo di far arrivare il segnale di sazietà al cervello prima di inserire cibo extra non necessario.",
    "Alzarsi leggeri dopo cena favorisce un riposo notturno profondo e un risveglio mattutino pieno di vitalità e fame naturale."
  ],
  // Settimana 5: Le Emozioni e il Cibo
  [
    "Identificare l'emozione esatta (noia, rabbia, tristezza) depone l'arma della fame nervosa: il cibo placa la fame, non risolve la tristezza.",
    "Distrarsi per 15 minuti spesso fa svanire la voglia di comfort food, che di solito ha un andamento a 'onda': sale rapidamente e poi scende.",
    "Trovare tre alternative al cibo per calmarti (es. leggere, passeggiare, telefonare) ti fornisce un kit di primo soccorso emotivo sano.",
    "Il diario emotivo svela i pattern ripetitivi. Potresti scoprire che mangi sempre alle 17:00 solo perché è il momento di maggior calo energetico.",
    "Perdonarsi per un pasto emotivo abbassa il cortisolo e ferma il ciclo di senso di colpa e restrizione che porta a nuove abbuffate.",
    "Scrivere i tuoi sentimenti sposta l'energia dall'impulso di mangiare (cervello rettiliano) alla riflessione razionale (corteccia prefrontale).",
    "Accettare un'emozione negativa senza sedarla col cibo è un atto di grande maturità psicologica e rafforza immensamente l'autostima."
  ],
  // Settimana 6: Risveglio dei Sensi
  [
    "Coinvolgere l'olfatto prepara i succhi gastrici e aumenta l'anticipazione positiva, riducendo la necessità di mangiare grandi quantità per sentirsi appagati.",
    "Il 'primo morso perfetto' crea un imprinting di sazietà nel cervello: se lo gusti profondamente, avrai meno bisogno di continuare a mangiare compulsivamente.",
    "Esplorare le consistenze rende il pasto mentalmente stimolante, portando la tua mente nel 'qui e ora' e spegnendo i pensieri ansiogeni.",
    "Cucinare un piatto nuovo e profumato attiva la creatività e trasforma il cibo da 'nemico calorico' a 'esperienza arricchente'.",
    "Assaporare le spezie riduce il bisogno di aggiungere sale e zucchero, educando il palato a gusti complessi e naturali.",
    "Scrivere un'esperienza sensoriale rinforza le reti neurali del piacere non legato alla quantità, ma alla qualità dell'esperienza alimentare.",
    "I colori vivaci nel piatto non solo sono ricchi di antiossidanti diversi, ma stimolano visivamente la sazietà e l'appetito sano."
  ],
  // Settimana 7: Gestire i Pensieri Autosabotanti
  [
    "Sostituire la frase 'non devo mangiare' con 'posso scegliere' sposta il focus dalla restrizione alla libertà di scelta consapevole.",
    "Annotare il critico interiore ('Hai rovinato tutto!') ti permette di distanziarti da quel pensiero e capire che è solo una voce, non la realtà.",
    "Parlare a se stessi con gentilezza dopo uno sgarro accelera il ritorno alle buone abitudini, mentre i sensi di colpa portano ad abbandonare la dieta.",
    "Il fallimento non esiste, esistono solo feedback. Un pasto troppo abbondante è un'occasione preziosa per studiare cosa ha innescato l'eccesso.",
    "Evitare la mentalità 'tutto o niente' è il segreto del successo a lungo termine: un singolo cioccolatino non annulla una settimana di sane abitudini.",
    "Complimentarsi per un successo costruisce l'autoefficacia, la convinzione psicologica di essere in grado di raggiungere i propri obiettivi.",
    "Cambiare le parole da 'rinuncia' a 'cura di sé' trasforma l'alimentazione sana in un gesto d'amore verso il proprio corpo."
  ],
  // Settimana 8: Sganciarsi dalle Regole Rigide
  [
    "Smettere di contare le calorie per un pasto aiuta a riconnettersi con l'autoregolazione interna, fidandosi del corpo invece che di un'app.",
    "Godersi un cibo 'proibito' lentamente e senza sensi di colpa dimostra che il cibo non ha potere morale: sei tu che controlli il cibo, non lui te.",
    "Scegliere in base al desiderio reale previene la sindrome da privazione, che è la causa principale delle abbuffate serali e del binge eating.",
    "La flessibilità è la base della sostenibilità. Un'alimentazione troppo rigida è destinata a spezzarsi sotto lo stress della vita reale.",
    "Concentrarsi su come ci si sente (energia, digestione) anziché sulle regole esterne sposta il locus of control all'interno di te.",
    "L'estetica del piatto soddisfa l'occhio, che è il primo organo a 'mangiare'. Un bel piatto sazia più in fretta di un piatto mangiato dal contenitore.",
    "Dichiararsi sereni riguardo a una scelta alimentare libera chiude la porta all'ansia e apre quella alla vera pace con il cibo."
  ],
  // Settimana 9: Accettazione del Corpo
  [
    "Ringraziare il corpo sposta il focus dall'estetica alla funzionalità: il tuo corpo è un veicolo incredibile che ti permette di vivere, non un ornamento.",
    "Guardarsi allo specchio senza giudicare rompe il ciclo di auto-disprezzo che spesso alimenta comportamenti alimentari distruttivi.",
    "Indossare abiti comodi è un atto di rispetto verso se stessi: il corpo non deve adattarsi ai vestiti, sono i vestiti che devono adattarsi al corpo.",
    "Fare movimento per il piacere di farlo, e non per 'bruciare calorie', trasforma l'esercizio da punizione a celebrazione della propria vitalità.",
    "Smettere di pesarsi compulsivamente aiuta a concentrarsi su indicatori di salute reali: energia, forza, qualità del sonno e serenità mentale.",
    "Focalizzarsi sull'energia che il cibo fornisce ti fa vedere l'alimentazione come carburante pregiato per la tua preziosa macchina biologica.",
    "La body positivity inizia dal body respect: trattare il corpo con cura anche quando non ha la forma che desideriamo."
  ],
  // Settimana 10: Affrontare le Situazioni Sociali
  [
    "Andare a un evento sociale senza la paura di ingrassare abbassa l'ansia, permettendoti di fare scelte più logiche e meno guidate dall'emotività.",
    "Mangiare qualcosa di sano prima di una festa previene le 'abbuffate da lupo' causate dall'arrivare troppo affamati davanti a un buffet.",
    "Concentrarsi sulla compagnia anziché sul cibo ridimensiona il ruolo del cibo, facendolo tornare a essere un contorno e non il centro dell'evento.",
    "Rifiutare gentilmente cibo offerto con insistenza allena l'assertività e fissa confini sani per il rispetto delle tue scelte di benessere.",
    "Scegliere con cura cosa concedersi al ristorante ti permette di goderti davvero il tuo piatto preferito senza eccedere in antipasti o pane per noia.",
    "Bere molta acqua durante i pasti sociali aiuta a scandire i tempi e diluisce l'assunzione di alcol e bevande zuccherate.",
    "Condividere un pasto con gioia rilascia ossitocina, l'ormone del benessere, che favorisce la digestione e riduce l'infiammazione cellulare."
  ],
  // Settimana 11: Flessibilità in Vacanza e Fuori Casa
  [
    "Abbandonare la mentalità 'vacanza = mangio tutto' previene i malesseri digestivi e ti permette di goderti il riposo senza sentirti appesantito.",
    "Cercare cibi tipici e gustarli consapevolmente trasforma il pasto in un'esperienza culturale arricchente, evitando il consumo compulsivo di junk food.",
    "Mantenere il movimento in viaggio (camminare, nuotare) preserva la routine attiva e riduce l'accumulo di tensioni muscolari.",
    "Ascoltare la fame anche con fusi orari sballati o orari irregolari dimostra che il tuo corpo sa sempre di cosa ha bisogno, basta ascoltarlo.",
    "Compensare con verdure fresche i pasti pesanti è una strategia di autoregolazione naturale che il corpo suggerisce istintivamente.",
    "Accettare l'imprevisto con un sorriso abbassa la reattività allo stress, uno dei principali inneschi per l'alimentazione emotiva consolatoria.",
    "La vera libertà alimentare è fidarsi di sé ovunque, sapendo che non esistono cibi 'magici' che fanno dimagrire né cibi 'velenosi' che fanno ingrassare."
  ],
  // Settimana 12: Consolidamento e Futuro
  [
    "Rileggere il diario ti fornisce la prova tangibile e inconfutabile dei tuoi progressi, silenziando il critico interiore che ti sminuisce.",
    "Riconoscere il proprio traguardo mentale (es. 'non ho più paura dei carboidrati') consolida la nuova identità di persona serena e in salute.",
    "Il patto di gentilezza è un contratto psicologico potente: formalizza l'abbandono delle diete restrittive in favore del rispetto di sé.",
    "Raccontare i tuoi benefici a qualcuno rafforza le tue convinzioni (effetto di coerenza) e può ispirare positivamente chi ti ascolta.",
    "Slegare il concetto di 'successo' dal numero sulla bilancia ti protegge per sempre dalle fluttuazioni fisiologiche del peso corporeo.",
    "Mettere in pratica tutto ciò che hai imparato in un unico pasto chiude il cerchio, dimostrando che il mindful eating è diventato una seconda natura.",
    "Inviare l'intenzione alla dottoressa crea responsabilità esterna (accountability) e segna l'inizio della tua nuova, libera vita alimentare."
  ]
];

// Trova la definizione di liberaDieteChallenges
const arrayStart = content.indexOf('const liberaDieteChallenges = [');
if (arrayStart === -1) {
  console.log('Error: array not found');
  process.exit(1);
}

// Estrai l'array tramite parsing (sappiamo che finisce prima di `const targetLabels =`)
const arrayEndMatch = content.indexOf('const targetLabels =');
const arrayEnd = content.lastIndexOf('];', arrayEndMatch) + 2;

let arrayText = content.substring(arrayStart, arrayEnd);

// Inietta i dailyExplanations usando una regex o string manipulation
// Dal momento che abbiamo un formato standard, possiamo usare RegExp per trovare "dailyTasks: [" e il suo blocco
for (let i = 0; i < 12; i++) {
  const weekTasksStr = 'dailyTasks: [';
  let weekStart = arrayText.indexOf(`week: ${i + 1},`);
  if (weekStart === -1) continue;
  
  let tasksStart = arrayText.indexOf(weekTasksStr, weekStart);
  let tasksEnd = arrayText.indexOf(']', tasksStart);
  
  // Costruisci le stringhe per dailyExplanations
  let explanationsStr = `,\n    dailyExplanations: [\n      "${insights[i].join('",\n      "')}"\n    ]`;
  
  // Inserisci subito dopo il ] di dailyTasks
  arrayText = arrayText.substring(0, tasksEnd + 1) + explanationsStr + arrayText.substring(tasksEnd + 1);
}

content = content.substring(0, arrayStart) + arrayText + content.substring(arrayEnd);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Spiegazioni di valore inserite correttamente.');
