import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Coffee, 
  ChefHat, 
  Sparkles, 
  RotateCcw, 
  ChevronRight,
  ChevronLeft,
  Layers,
  Send,
  Activity,
  Heart,
  Smile,
  Clock,
  Brain,
  Wind,
  CheckCircle,
  Trophy,
  Menu,
  X,
  LogOut
} from 'lucide-react';

const liberaDieteChallenges = [
  {
    week: 1,
    title: "Connessione Corporea",
    focus: "Attivare il sistema parasimpatico e calmare la mente",
    icon: "🧘‍♀️",
    dailyTasks: [
      "Fai 3 respiri profondi e consapevoli prima di colazione.",
      "Fai 3 respiri prima di pranzo tenendo le mani sulla pancia per sentire il respiro.",
      "Fai 3 respiri profondi prima di cena per allontanare lo stress della giornata.",
      "Mangia i primi 3 bocconi del tuo pranzo ad occhi chiusi, concentrandoti sulle consistenze.",
      "Fai una pausa cosciente di 10 secondi a metà pasto e respira lentamente.",
      "Dedica 2 minuti al mattino a allungare le spalle ed espandere la respirazione.",
      "Fai un pasto in totale tranquillità lontano da ogni tensione o fretta."
    ]
  },
  {
    week: 2,
    title: "Riconoscere la Fame",
    focus: "Distinguere i bisogni biologici da quelli emotivi",
    icon: "🍎",
    dailyTasks: [
      "Prima di colazione, valuta se senti un vuoto fisico o solo una voglia mentale.",
      "Prima di pranzo, valuta la tua fame biologica su una scala da 1 a 10.",
      "A metà pomeriggio chiediti: 'Ho fame o ho solo bisogno di staccare la mente?'",
      "Se senti voglia di cibo emotivo, bevi acqua e aspetta 5 minuti per capire cosa provi.",
      "Fai merenda solo se senti reali segnali fisici di fame (es: brontolio, calo di energia).",
      "Fai colazione descrivendo sul diario i segnali fisici di fame che hai percepito.",
      "Identifica a quale pasto della giornata mangi più per abitudine che per fame reale."
    ]
  },
  {
    week: 3,
    title: "Alimentazione senza Distrazioni",
    focus: "Risintonizzarsi con l'atto del mangiare e i sapori reali",
    icon: "📱❌",
    dailyTasks: [
      "Fai colazione lasciando lo smartphone in un'altra stanza.",
      "Pranza senza guardare la televisione o lavorare al computer.",
      "Fai merenda seduta/o a tavola, senza fare nient'altro in contemporanea.",
      "Cena concentrandoti esclusivamente sui colori e i profumi del piatto.",
      "Fai pranzo notando la differenza di velocità e presenza quando non ci sono schermi.",
      "Condividi un pasto prestando attenzione alle parole e al sapore dei cibi.",
      "Fai cena in silenzio per i primi 5 minuti, assaporando appieno ogni boccone."
    ]
  },
  {
    week: 4,
    title: "Rallentare il Ritmo",
    focus: "Lasciare il tempo ai segnali di sazietà di giungere al cervello (circa 20 minuti)",
    icon: "⏱️",
    dailyTasks: [
      "Posa le posate sul tavolo dopo ogni singolo boccone a pranzo.",
      "Dedica almeno 20 minuti al tuo pranzo principale, mangiando lentamente.",
      "Mastica ciascun boccone di cena almeno 15 volte prima di deglutire.",
      "Usa la mano non dominante per mangiare a pranzo in modo da rallentare.",
      "Bevi un sorso d'acqua tra una portata e l'altra per fare una pausa consapevole.",
      "Fai colazione masticando lentamente e godendoti i sapori.",
      "Gusta una bevanda calda a piccoli sorsi distanziati nel pomeriggio."
    ]
  },
  {
    week: 5,
    title: "I Segnali di Sazietà",
    focus: "Evitare di mangiare per inerzia o abitudine",
    icon: "🛑",
    dailyTasks: [
      "A metà pranzo, fai una pausa di 1 minuto e chiediti a che punto è la tua sazietà.",
      "Smetti di mangiare quando ti senti comoda/o e non eccessivamente piena/o.",
      "Presta attenzione se tendi a finire il piatto anche se ti senti già sazia/o.",
      "Cena cercando di lasciare l'ultimo boccone nel piatto per testare l'autoregolazione.",
      "Valuta la tua sazietà 15 minuti dopo il pasto principale su una scala da 1 a 10.",
      "Fai colazione notando il momento esatto in cui il cibo perde il suo sapore iniziale.",
      "Rispetta il tuo senso di sazietà durante tutta la giornata senza alcun senso di colpa."
    ]
  },
  {
    week: 6,
    title: "Gestione della Fame Emotiva",
    focus: "Creare uno spazio di scelta consapevole tra emozione e cibo",
    icon: "🧠",
    dailyTasks: [
      "Se senti fame improvvisa, fermati e scrivi su un foglio che emozione provi.",
      "Sostituisci il cibo di conforto pomeridiano con 10 minuti della tua musica preferita.",
      "Se ti senti stressata/o prima di cena, fai 3 minuti di respirazione consapevole.",
      "Disegna o scrivi le tue sensazioni di stanchezza anziché 'mangiarle'.",
      "Dedica una coccola non alimentare al tuo corpo (es: un bagno caldo o un massaggio).",
      "Se cedi alla fame emotiva, parlati con amore ed evita assolutamente di giudicarti.",
      "Fai una lista scritta di 5 attività rilassanti non alimentari da fare quando ti annoi."
    ]
  },
  {
    week: 7,
    title: "Piacere e Soddisfazione",
    focus: "Liberarsi dal senso di colpa e riscoprire la gioia nutrizionale",
    icon: "😋",
    dailyTasks: [
      "Gusta un cibo che consideri 'proibito' lentamente e senza sensi di colpa.",
      "Prepara un pranzo curando l'estetica del piatto come se fossi in un ristorante.",
      "Fai una merenda che ti dia una reale soddisfazione sensoriale (sapore e calore).",
      "Nota come il senso di colpa altera il gusto del cibo e prova ad allontanarlo.",
      "Assapora un pezzetto di cioccolato fondente sciogliendolo lentamente in bocca.",
      "Cucina la tua ricetta preferita concentrandoti sul piacere della preparazione.",
      "Condividi un pasto festoso celebrando la compagnia e la bontà dei piatti."
    ]
  },
  {
    week: 8,
    title: "Movimento Consapevole",
    focus: "Muoversi per il piacere del corpo, non per consumare calorie",
    icon: "🚶‍♀️",
    dailyTasks: [
      "Fai 5 minuti di stretching dolce al risveglio, ascoltando i tuoi muscoli.",
      "Fai una camminata di 10 minuti notando il contatto del piede sul terreno.",
      "Fai delle rotazioni del collo e delle spalle alla sedia per sciogliere le tensioni.",
      "Muoviti a piedi per una commissione camminando a passo rilassato e cosciente.",
      "Fai stretching serale per rilassare il corpo e facilitare il riposo.",
      "Fai una camminata in mezzo alla natura o in un parco respirando profondamente.",
      "Balla liberamente sulle note della tua canzone preferita per 3 minuti."
    ]
  },
  {
    week: 9,
    title: "Gratitudine Corporea",
    focus: "Spostare il focus dal giudizio estetico alla grata funzionalità del corpo",
    icon: "💖",
    dailyTasks: [
      "Scrivi sul diario mindful due cose straordinarie che le gambe ti permettono di fare.",
      "Ringrazia mentalmente il tuo corpo per l'energia che ti dà ogni giorno.",
      "Guarda le tue mani e rifletti su quante cose utili e creative creano.",
      "Scrivi un pensiero di gratitudine verso il tuo cuore che batte costantemente.",
      "Tratta una zona corporea che giudichi severamente con una crema massaggiando dolcemente.",
      "Fai un elenco di 3 sensazioni piacevoli che i tuoi sensi ti hanno regalato oggi.",
      "Dedica un respiro profondo a ringraziare il tuo corpo per la sua forza e vita."
    ]
  },
  {
    week: 10,
    title: "Dialogo Interno Gentile",
    focus: "Coltivare l'autocompassione e la gentilezza interiore",
    icon: "🗣️❤️",
    dailyTasks: [
      "Sostituisci il pensiero 'ho sgarrato' con 'ho ascoltato una mia voglia consapevole'.",
      "Guardati allo specchio stamattina e rivolgi a te stessa/o una parola di affetto.",
      "Se provi frustrazione sul cibo, ripeti: 'Sto facendo del mio meglio ed è abbastanza'.",
      "Nota i pensieri autocritici sul tuo aspetto fisico e immagina di lasciarli volare via.",
      "Scrivi una breve nota di scuse al tuo corpo per le dure critiche passate.",
      "Accogli una scelta alimentare non ottimale come una risorsa per imparare ad ascoltarti.",
      "Inizia la giornata sorridendo a te stessa/o per qualche secondo davanti allo specchio."
    ]
  },
  {
    week: 11,
    title: "Flessibilità Alimentare",
    focus: "Sviluppare fiducia nella capacità di autoregolarsi",
    icon: "🌟",
    dailyTasks: [
      "Sostituisci un contorno del piano nutrizionale con un altro a tua scelta senza ansia.",
      "Mangia fuori casa ordinando quello che desideri davvero, ascoltando la fame.",
      "Modifica la composizione del tuo pasto a seconda delle tue sensazioni attuali.",
      "Consuma uno spuntino diverso dal solito semplicemente perché hai piacere di farlo.",
      "Accetta un aperitivo improvvisato con amici vivendolo in totale relax.",
      "Fai la spesa comprando un cibo o un ingrediente sano che non hai mai cucinato.",
      "Gestisci i pasti domenicali fidandoti dei tuoi ritmi e segnali interni di sazietà."
    ]
  },
  {
    week: 12,
    title: "Consolidamento e Futuro",
    focus: "Integrare gli strumenti appresi in uno stile di vita libero e sereno",
    icon: "🎓",
    dailyTasks: [
      "Rileggi le note del tuo diario mindful per apprezzare il percorso fatto.",
      "Identifica il traguardo mentale più grande ottenuto in queste 12 settimane.",
      "Scrivi un patto di gentilezza e libertà alimentare che ti impegni a mantenere.",
      "Racconta a qualcuno a te vicino i benefici di mangiare in modo consapevole.",
      "Festeggia un traguardo non legato al peso corporeo (energia, serenità, autocontrollo).",
      "Consuma un pasto completo mettendo in pratica tutti i segnali di consapevolezza.",
      "Scrivi la sua intenzione di benessere futuro e inviala come resoconto alla dottoressa."
    ]
  }
];

const targetLabels = {
  Mantenimento: 'Mantenimento',
  DimagrimentoLieve: 'Dimagrimento Lieve (-10%)',
  DimagrimentoModerato: 'Dimagrimento Moderato (-15%)',
  DimagrimentoRapido: 'Dimagrimento Rapido (-20%)',
  Dimagrimento: 'Dimagrimento (-18%)',
  Massa: 'Massa (+12%)'
};

const customRoundToTen = (val) => {
  if (val === undefined || val === null || isNaN(val)) return 0;
  const num = Math.round(val);
  if (num === 0) return 0;
  const lastDigit = num % 10;
  let result;
  if (lastDigit <= 5) {
    result = num - lastDigit;
  } else {
    result = num + (10 - lastDigit);
  }
  if (result === 0 && num > 0) {
    return 10;
  }
  return result;
};

export default function PatientView({ patients, onUpdatePatientSelections, onUpdatePatientHistory, onUpdatePatientProfile, isPatientLogged }) {
  const [activePatientId, setActivePatientId] = useState(patients[0]?.id || '');

  // Allinea activePatientId se la lista pazienti cambia (es: a seguito del login)
  useEffect(() => {
    if (patients.length > 0 && !patients.some(p => p.id === activePatientId)) {
      setActivePatientId(patients[0].id);
    }
  }, [patients, activePatientId]);
  const [activeDay, setActiveDay] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  // Track which meals we added water to in this session
  const [loggedMealWater, setLoggedMealWater] = useState({});
  const [activeMealTab, setActiveMealTab] = useState("pranzo"); // "pranzo" o "cena"

  // Sotto-Scheda attiva nell'Area Paziente
  const [activeSubTab, setActiveSubTab] = useState('diario'); // 'diario' o 'ai'

  // Stato per la chat dell'Assistente AI
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [chatCountToday, setChatCountToday] = useState(0);
  const messagesEndRef = useRef(null);
  const calendarScrollRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Chiave API da Variabile d'Ambiente (Nascosta all'utente)
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  const [showSettings, setShowSettings] = useState(false);
  const [geminiModel, setGeminiModel] = useState(() => {
    return localStorage.getItem('nutriplan_gemini_model') || 'gemini-2.5-flash';
  });

  // Se utilizzare gli ingredienti del piatto per l'AI
  const [usePlateIngredients, setUsePlateIngredients] = useState(true);

  // Stati per Mindful Eating (Respirazione)
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingDuration, setBreathingDuration] = useState(60); // 60 o 120 secondi
  const [breathingTimeLeft, setBreathingTimeLeft] = useState(60);
  const [breathingPhase, setBreathingPhase] = useState("Fai un bel respiro...");
  
  // Stati per Log Fame/Sazietà quotidiano
  const [mindfulMeal, setMindfulMeal] = useState("Pranzo");
  const [mindfulHungerBefore, setMindfulHungerBefore] = useState(5);
  const [mindfulSatietyAfter, setMindfulSatietyAfter] = useState(5);
  const [mindfulHungerType, setMindfulHungerType] = useState("Fisica");
  const [mindfulTrigger, setMindfulTrigger] = useState("");
  const [mindfulNotes, setMindfulNotes] = useState("");
  
  // Stati per Report Settimanale
  const [weeklyMood, setWeeklyMood] = useState("");
  const [weeklyFeedback, setWeeklyFeedback] = useState("");

  // Stato di notifica salvataggio
  const [mindfulSuccessMsg, setMindfulSuccessMsg] = useState("");
  const [weeklySuccessMsg, setWeeklySuccessMsg] = useState("");

  // Gestione timer respirazione
  useEffect(() => {
    let interval = null;
    if (isBreathingActive && breathingTimeLeft > 0) {
      interval = setInterval(() => {
        setBreathingTimeLeft((prev) => {
          if (prev <= 1) {
            setIsBreathingActive(false);
            setBreathingPhase("Completato! Sei in uno stato di calma per iniziare il pasto.");
            return 0;
          }
          const nextVal = prev - 1;
          const elapsed = breathingDuration - nextVal;
          const cycleSeconds = elapsed % 12;
          if (cycleSeconds < 4) {
            setBreathingPhase("Inspira... Riempi i polmoni di calma");
          } else if (cycleSeconds < 8) {
            setBreathingPhase("Trattieni... Ascolta i segnali del tuo corpo");
          } else {
            setBreathingPhase("Espira... Lascia andare stress e tensioni");
          }
          return nextVal;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathingDuration, breathingTimeLeft]);

  const handleStartBreathing = (duration) => {
    setBreathingDuration(duration);
    setBreathingTimeLeft(duration);
    setIsBreathingActive(true);
    setBreathingPhase("Inspira... Riempi i polmoni di calma");
  };

  const handleStopBreathing = () => {
    setIsBreathingActive(false);
    setBreathingPhase("Esercizio interrotto.");
  };

  const handleSaveMindfulLog = () => {
    const activePatient = patients.find(p => p.id === activePatientId);
    if (!activePatient) return;

    const newLog = {
      id: "ml-" + Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      meal: mindfulMeal,
      hungerBefore: Number(mindfulHungerBefore),
      satietyAfter: Number(mindfulSatietyAfter),
      hungerType: mindfulHungerType,
      trigger: mindfulHungerType === 'Emotiva' ? mindfulTrigger : '',
      notes: mindfulNotes
    };

    const currentLogs = activePatient.mindfulLogs || [];
    const updatedLogs = [newLog, ...currentLogs];

    if (onUpdatePatientProfile) {
      onUpdatePatientProfile(activePatientId, {
        mindfulLogs: updatedLogs
      });
    }

    setMindfulNotes("");
    setMindfulTrigger("");
    setMindfulSuccessMsg("Check-in salvato con successo!");
    setTimeout(() => setMindfulSuccessMsg(""), 3000);
  };

  const handleSaveWeeklyReport = () => {
    const activePatient = patients.find(p => p.id === activePatientId);
    if (!activePatient) return;

    const newReport = {
      id: "wr-" + Date.now(),
      date: new Date().toISOString().split('T')[0],
      mood: weeklyMood,
      feedback: weeklyFeedback
    };

    const currentReports = activePatient.weeklyReports || [];
    const updatedReports = [newReport, ...currentReports];

    if (onUpdatePatientProfile) {
      onUpdatePatientProfile(activePatientId, {
        weeklyReports: updatedReports
      });
    }

    setWeeklyMood("");
    setWeeklyFeedback("");
    setWeeklySuccessMsg("Report settimanale inviato alla dottoressa!");
    setTimeout(() => setWeeklySuccessMsg(""), 3000);
  };

  // Stato per la chat diretta con la dottoressa
  const [patientChatInput, setPatientChatInput] = useState('');

  const handleSendPatientMessage = () => {
    const activePatient = patients.find(p => p.id === activePatientId);
    if (!activePatient || !patientChatInput.trim()) return;

    const newMsg = {
      id: "msg-" + Date.now(),
      sender: "patient",
      text: patientChatInput.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };

    const currentMessages = activePatient.messages || [];
    const updatedMessages = [...currentMessages, newMsg];

    if (onUpdatePatientProfile) {
      onUpdatePatientProfile(activePatientId, {
        messages: updatedMessages
      });
    }

    setPatientChatInput("");
  };

  // Segna i messaggi della dottoressa come letti quando si apre la tab o ne arrivano di nuovi
  useEffect(() => {
    const activePatient = patients.find(p => p.id === activePatientId);
    if (activeSubTab === 'chatDoc' && activePatient?.messages && activePatient.messages.some(m => m.sender === 'doctor' && !m.read)) {
      const updatedMessages = activePatient.messages.map(m => 
        m.sender === 'doctor' ? { ...m, read: true } : m
      );
      if (onUpdatePatientProfile) {
        onUpdatePatientProfile(activePatientId, { messages: updatedMessages });
      }
    }
  }, [activeSubTab, activePatientId, patients, onUpdatePatientProfile]);

  // Stato e funzioni per le sfide delle 12 settimane (Libera dalle Diete)
  const [selectedChallengeWeek, setSelectedChallengeWeek] = useState(1);
  const [selectedChallengeDay, setSelectedChallengeDay] = useState(() => {
    const d = new Date().getDay();
    return d === 0 ? 6 : d - 1; // 0 = Lun, 6 = Dom
  });

  // Allinea la settimana visualizzata alla settimana attiva nel profilo del paziente
  useEffect(() => {
    const activePatient = patients.find(p => p.id === activePatientId);
    if (activePatient?.challengeProgress?.currentWeek) {
      setSelectedChallengeWeek(activePatient.challengeProgress.currentWeek);
    } else {
      setSelectedChallengeWeek(1);
    }
  }, [activePatientId, patients]);

  const getChallengeProgress = () => {
    const activePatient = patients.find(p => p.id === activePatientId);
    if (!activePatient) return { currentWeek: 1, completedDays: {} };
    
    const prog = activePatient.challengeProgress || {
      currentWeek: 1,
      completedDays: {}
    };
    
    if (!prog.completedDays) {
      prog.completedDays = {};
    }
    for (let w = 1; w <= 12; w++) {
      if (!prog.completedDays[w]) {
        prog.completedDays[w] = [false, false, false, false, false, false, false];
      }
    }
    return prog;
  };

  const handleToggleChallengeDay = (weekNumber, dayIndex) => {
    if (!activePatientId || !onUpdatePatientProfile) return;
    const activePatient = patients.find(p => p.id === activePatientId);
    if (!activePatient) return;
    
    const prog = getChallengeProgress();
    const updatedCompletedDays = { ...prog.completedDays };
    const currentWeekDays = [...(updatedCompletedDays[weekNumber] || [false, false, false, false, false, false, false])];
    currentWeekDays[dayIndex] = !currentWeekDays[dayIndex];
    updatedCompletedDays[weekNumber] = currentWeekDays;
    
    onUpdatePatientProfile(activePatientId, {
      challengeProgress: {
        ...prog,
        completedDays: updatedCompletedDays
      }
    });
  };

  const handleChangeActiveChallengeWeek = (weekNumber) => {
    if (!activePatientId || !onUpdatePatientProfile) return;
    const activePatient = patients.find(p => p.id === activePatientId);
    if (!activePatient) return;
    
    const prog = getChallengeProgress();
    onUpdatePatientProfile(activePatientId, {
      challengeProgress: {
        ...prog,
        currentWeek: weekNumber
      }
    });
    setSelectedChallengeWeek(weekNumber);
  };

  const getPatientWaterForDate = (dateStr) => {
    const activePatient = patients.find(p => p.id === activePatientId);
    if (!activePatient || !activePatient.waterLogs) return 0;
    return activePatient.waterLogs[dateStr] || 0;
  };

  const handleUpdateWater = (dateStr, newCount) => {
    if (!activePatientId || !onUpdatePatientProfile) return;
    const activePatient = patients.find(p => p.id === activePatientId);
    if (!activePatient) return;
    
    const updatedWaterLogs = { ...(activePatient.waterLogs || {}) };
    updatedWaterLogs[dateStr] = Math.max(0, newCount);
    
    onUpdatePatientProfile(activePatientId, {
      waterLogs: updatedWaterLogs
    });
  };

  // Stato per la modale di sostituzione
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: '', // 'colazione', 'spuntinoMattina', 'spuntinoPomeriggio', 'carboidrati', 'proteine', 'verdure', 'grassi'
    mealType: '', // 'pranzo' o 'cena' (usato per i macro)
    title: '',
    options: [],
    selectedValueId: ''
  });

  // Stati per la rilevazione inserita dal paziente
  const [patientHistoryDate, setPatientHistoryDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [patientHistoryWeight, setPatientHistoryWeight] = useState('');
  const [patientWeightMsg, setPatientWeightMsg] = useState('');

  const handlePatientAddHistoryRecord = (e) => {
    e.preventDefault();
    if (!activePatientId || !onUpdatePatientHistory) return;
    if (!patientHistoryDate || !patientHistoryWeight) {
      alert("Inserisci almeno Data e Peso per registrare la misurazione.");
      return;
    }

    const sortedHistory = [...(patient?.history || [])].sort((a, b) => new Date(a.date) - new Date(b.date));
    const latestRecord = sortedHistory[sortedHistory.length - 1] || {};

    const newRecord = {
      date: patientHistoryDate,
      weight: parseFloat(patientHistoryWeight),
      fatMass: latestRecord.fatMass || 0,
      muscleMass: latestRecord.muscleMass || 0
    };

    const filteredHistory = (patient?.history || []).filter(r => r.date !== patientHistoryDate);
    const updatedHistory = [...filteredHistory, newRecord];

    onUpdatePatientHistory(activePatientId, updatedHistory);
    setPatientWeightMsg('Peso registrato con successo!');
    
    setPatientHistoryWeight('');

    setTimeout(() => {
      setPatientWeightMsg('');
    }, 4000);
  };

  const patient = patients.find(p => p.id === activePatientId);

  // Generazione del calendario reale del 2026
  const days2026 = React.useMemo(() => {
    const days = [];
    const dayNames = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
    const dayShortNames = ["DOM", "LUN", "MAR", "MER", "GIO", "VEN", "SAB"];
    
    // Generiamo l'intero calendario del 2026
    const start = new Date(2026, 0, 1);
    const end = new Date(2026, 11, 31);
    
    let current = new Date(start);
    while (current <= end) {
      const d = new Date(current);
      const year = d.getFullYear();
      const monthNum = String(d.getMonth() + 1).padStart(2, '0');
      const dayNumStr = String(d.getDate()).padStart(2, '0');
      const dateKey = `${year}-${monthNum}-${dayNumStr}`;
      
      const weekdayLong = dayNames[d.getDay()];
      const monthLong = d.toLocaleDateString('it-IT', { month: 'long' });
      const dateStr = `${weekdayLong}, ${d.getDate()} ${monthLong}`;
      const monthLabel = d.toLocaleDateString('it-IT', { month: 'short' }).toUpperCase().replace('.', '');
      
      days.push({
        dateKey,
        name: weekdayLong,
        dayShort: dayShortNames[d.getDay()],
        dayNum: d.getDate(),
        dateStr,
        monthLabel
      });
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, []);

  const formatCheckupDate = (dateStr) => {
    if (!dateStr) return "Da programmare";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const renderSvgChart = (data, valueKey, label, color, suffix = '', yMinOffset = 5, yMaxOffset = 5) => {
    if (!data || data.length === 0) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', background: 'rgba(255,255,255,0.4)', borderRadius: '12px', border: '1px dashed var(--border-color)', fontSize: '0.85rem' }}>
          Nessun dato disponibile per il grafico.
        </div>
      );
    }

    if (data.length === 1) {
      const val = data[0][valueKey];
      return (
        <div style={{ padding: '1.25rem', textAlign: 'center', background: '#fff', borderRadius: '16px', border: '1px solid var(--border-soft)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Rilevazione del {new Date(data[0].date).toLocaleDateString('it-IT')}</span>
          <strong style={{ fontSize: '1.6rem', color, display: 'block', margin: '0.4rem 0' }}>{val}{suffix}</strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Aggiungi più rilevazioni per sbloccare il grafico storico.</span>
        </div>
      );
    }

    const width = 480;
    const height = 180;
    const paddingLeft = 40;
    const paddingRight = 15;
    const paddingTop = 20;
    const paddingBottom = 25;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const values = data.map(d => d[valueKey] || 0);
    let minVal = Math.min(...values) - yMinOffset;
    let maxVal = Math.max(...values) + yMaxOffset;
    if (minVal < 0) minVal = 0;
    if (minVal === maxVal) {
      minVal -= 5;
      maxVal += 5;
    }

    const dates = data.map(d => new Date(d.date).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const dateRange = maxDate - minDate || 1;

    const points = data.map(d => {
      const x = paddingLeft + ((new Date(d.date).getTime() - minDate) / dateRange) * chartWidth;
      const y = paddingTop + chartHeight - (((d[valueKey] || 0) - minVal) / (maxVal - minVal)) * chartHeight;
      return { 
        x, 
        y, 
        val: d[valueKey], 
        date: new Date(d.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }) 
      };
    });

    const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

    const gridLines = [];
    for (let i = 0; i <= 3; i++) {
      const yVal = minVal + (i / 3) * (maxVal - minVal);
      const yCoor = paddingTop + chartHeight - (i / 3) * chartHeight;
      gridLines.push({ y: yCoor, val: Math.round(yVal * 10) / 10 });
    }

    const gradientId = `patient-grad-${valueKey}`;

    return (
      <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border-soft)', boxShadow: 'var(--shadow-sm)' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </span>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ minWidth: '280px', display: 'block' }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.15" />
                <stop offset="100%" stopColor={color} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Griglia */}
            {gridLines.map((gl, idx) => (
              <g key={idx}>
                <line 
                  x1={paddingLeft} 
                  y1={gl.y} 
                  x2={width - paddingRight} 
                  y2={gl.y} 
                  stroke="#f9fafb" 
                  strokeWidth="1" 
                  strokeDasharray="3 3" 
                />
                <text 
                  x={paddingLeft - 6} 
                  y={gl.y + 3} 
                  textAnchor="end" 
                  fill="#9ca3af" 
                  fontSize="8.5" 
                  fontWeight="600"
                >
                  {gl.val}{suffix}
                </text>
              </g>
            ))}

            {/* Area */}
            <path d={areaPath} fill={`url(#${gradientId})`} />

            {/* Linea */}
            <path 
              d={linePath} 
              fill="none" 
              stroke={color} 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />

            {/* Punti */}
            {points.map((p, idx) => (
              <g key={idx}>
                <circle 
                  cx={p.x} 
                  cy={p.y} 
                  r="3.5" 
                  fill="#ffffff" 
                  stroke={color} 
                  strokeWidth="2" 
                />
                <text 
                  x={p.x} 
                  y={p.y - 7} 
                  textAnchor="middle" 
                  fill="#1f2937" 
                  fontSize="8.5" 
                  fontWeight="700"
                >
                  {p.val}{suffix}
                </text>
                <text 
                  x={p.x} 
                  y={height - 6} 
                  textAnchor="middle" 
                  fill="#9ca3af" 
                  fontSize="8.5" 
                  fontWeight="600"
                >
                  {p.date}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  };
  const getMotivationalInsight = () => {
    const history = patient?.history || [];
    if (history.length === 0) {
      return {
        title: "🌸 Benvenuta nel tuo percorso!",
        text: "Hai registrato la tua prima misurazione. Ricorda che questo percorso non è una gara contro la bilancia, ma un atto di cura verso te stessa per trovare il tuo equilibrio naturale senza restrizioni estreme. Sii orgogliosa di aver iniziato!",
        icon: "🌸",
        color: "var(--primary)"
      };
    }

    const sorted = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sorted.length === 1) {
      return {
        title: "✨ Primo passo completato!",
        text: `Il tuo peso di partenza registrato è di **${sorted[0].weight} kg** con il **${sorted[0].fatMass}%** di massa grassa. La bilancia è solo un punto di riferimento, non una sentenza. Continua a nutrire il tuo corpo con cibo sano e a muoverti con gioia!`,
        icon: "✨",
        color: "var(--primary)"
      };
    }

    const latest = sorted[sorted.length - 1];
    const prev = sorted[sorted.length - 2];

    const dWeight = latest.weight - prev.weight;
    const dFat = latest.fatMass - prev.fatMass;
    const dMuscle = latest.muscleMass - prev.muscleMass;

    // Arrotonda a 1 decimale
    const rd = (v) => Math.round(v * 10) / 10;

    let title;
    let text;
    let icon;
    let color;

    if (dWeight < 0) {
      // Peso sceso
      icon = "🎉";
      color = "#b0246e";
      title = "🎉 Ottimo lavoro, il peso scende!";
      text = `Rispetto alla misurazione precedente, il tuo peso è sceso di **${Math.abs(rd(dWeight))} kg**. Stai andando alla grande! Continua così, ricordando di fare pasti completi e bilanciati senza mai saltarli.`;
      
      if (dFat < 0 && dMuscle >= 0) {
        text += ` Inoltre, la tua composizione corporea mostra che stai perdendo grasso (**-${Math.abs(rd(dFat))}%**) e mantenendo o aumentando i muscoli. Questa è la vera ricomposizione corporea sana!`;
      } else if (dMuscle < 0) {
        text += ` Ricorda di abbinare sempre un po' di attività fisica e consumare abbastanza proteine per proteggere la massa muscolare mentre dimagrisci.`;
      }
    } else if (dWeight === 0 || Math.abs(dWeight) < 0.1) {
      // Peso stabile
      icon = "🔒";
      color = "var(--primary)";
      title = "🔒 Peso Stabile: Consolidamento in corso!";
      text = `Il tuo peso è rimasto stabile rispetto all'ultimo controllo. Questo è un **ottimo segno**! Significa che il tuo corpo sta consolidando i risultati raggiunti e si sta adattando al nuovo set-point.`;
      
      if (dFat < 0 && dMuscle > 0) {
        text += ` Anche se il peso sulla bilancia non varia, stai perdendo massa grassa (**-${Math.abs(rd(dFat))}%**) e mettendo massa muscolare (**+${rd(dMuscle)} kg**). Ti stai asciugando e tonificando, questo è lo scenario migliore!`;
      } else {
        text += ` Ricorda che la stabilità è fondamentale prima del prossimo passo e le oscillazioni quotidiane sono normali. La tua costanza vince sempre.`;
      }
    } else {
      // Peso salito
      icon = "🌸";
      color = "var(--accent)";
      title = "💪 Peso in rialzo? Nessun timore!";
      text = `Rispetto alla misurazione precedente, il peso mostra un incremento di **+${rd(dWeight)} kg**. **Niente panico, è assolutamente normale!** Il peso fluttua continuamente a causa di idratazione, ritenzione idrica passeggera, ormoni, o infiammazione muscolare naturale dopo l'allenamento.`;
      
      if (dMuscle > 0) {
        text += ` Guarda la BIA: la tua massa muscolare è aumentata di **+${rd(dMuscle)} kg**! I muscoli pesano più del grasso ma occupano meno spazio ed attivano il metabolismo. Stai diventando più forte e sana, festeggia questo traguardo!`;
      } else if (dFat < 0) {
        text += ` La tua massa grassa è comunque diminuita del **-${Math.abs(rd(dFat))}%**! Questo significa che stai perdendo grasso ma trattenendo più liquidi temporanei. Il percorso sta funzionando a meraviglia.`;
      } else {
        text += ` Concentrati su come ti senti energeticamente ed emotivamente. Un pasto un po' più salato o lo stress possono alterare il valore sulla bilancia per qualche giorno, ma non cancellano i tuoi sforzi. Sii gentile con te stessa e continua il tuo viaggio.`;
      }
    }

    return { title, text, icon, color };
  };

  const diet = patient?.diet;
  const selections = patient?.selections || {};
  const activeDayInfo = days2026.find(wd => wd.dateKey === activeDay) || { name: "Lunedì" };
  const daySelections = selections[activeDay] || selections[activeDayInfo.name] || {};

  // Funzione per ottenere il cibo selezionato con i relativi fallback
  const getSelectedColazione = () => {
    if (!diet || !diet.colazione || diet.colazione.length === 0) return null;
    const selectedId = daySelections.colazioneId;
    const fromSelection = diet.colazione.find(c => c.id === selectedId);
    if (fromSelection) return fromSelection;

    // Se l'utente non ha effettuato una sostituzione manuale, controlliamo il menù settimanale
    const weeklyDayKey = activeDayInfo.name?.toLowerCase();
    const weeklyDefault = diet.weeklyMenu?.[weeklyDayKey]?.colazione;
    if (weeklyDefault) {
      const found = diet.colazione.find(c => c.id === weeklyDefault.id);
      if (found) return found;
    }

    return diet.colazione[0];
  };

  const getSelectedSpuntinoMattina = () => {
    if (!diet || !diet.spuntini || diet.spuntini.length === 0) return null;
    const selectedId = daySelections.spuntinoMattinaId;
    const fromSelection = diet.spuntini.find(s => s.id === selectedId);
    if (fromSelection) return fromSelection;

    const weeklyDayKey = activeDayInfo.name?.toLowerCase();
    const weeklyDefault = diet.weeklyMenu?.[weeklyDayKey]?.spuntinoMattina;
    if (weeklyDefault) {
      const found = diet.spuntini.find(s => s.id === weeklyDefault.id);
      if (found) return found;
    }

    return diet.spuntini[0];
  };

  const getSelectedSpuntinoPomeriggio = () => {
    if (!diet || !diet.spuntini || diet.spuntini.length === 0) return null;
    const selectedId = daySelections.spuntinoPomeriggioId;
    const fromSelection = diet.spuntini.find(s => s.id === selectedId);
    if (fromSelection) return fromSelection;

    const weeklyDayKey = activeDayInfo.name?.toLowerCase();
    const weeklyDefault = diet.weeklyMenu?.[weeklyDayKey]?.spuntinoPomeriggio;
    if (weeklyDefault) {
      const found = diet.spuntini.find(s => s.id === weeklyDefault.id);
      if (found) return found;
    }

    const defaultSpuntino = diet.spuntini[1] || diet.spuntini[0];
    return defaultSpuntino;
  };

  const getSelectedMacro = (mealType, category) => {
    const categoryKey = `${mealType}${category.charAt(0).toUpperCase() + category.slice(1)}`;
    const categoryList = diet?.[categoryKey];
    if (!diet || !categoryList || categoryList.length === 0) return null;
    
    const selectedId = daySelections[mealType]?.[`${category}Id`];
    const fromSelection = categoryList.find(item => item.id === selectedId);
    if (fromSelection) return fromSelection;

    const weeklyDayKey = activeDayInfo.name?.toLowerCase();
    const weeklyDefault = diet.weeklyMenu?.[weeklyDayKey]?.[mealType]?.[category];
    if (weeklyDefault) {
      const found = categoryList.find(item => item.id === weeklyDefault.id);
      if (found) return found;
    }

    return categoryList[0];
  };

  // Apertura modale per selezionare le alternative
  const openAlternativeModal = (type, mealType = '') => {
    if (!diet) return;

    let title;
    let options;
    let selectedValueId;

    if (type === 'colazione') {
      title = 'Sostituisci Colazione';
      options = diet.colazione;
      selectedValueId = getSelectedColazione()?.id;
    } else if (type === 'spuntinoMattina') {
      title = 'Sostituisci Spuntino Mattina';
      options = diet.spuntini;
      selectedValueId = getSelectedSpuntinoMattina()?.id;
    } else if (type === 'spuntinoPomeriggio') {
      title = 'Sostituisci Spuntino Pomeriggio';
      options = diet.spuntini;
      selectedValueId = getSelectedSpuntinoPomeriggio()?.id;
    } else {
      // Carboidrati, proteine, verdure, grassi
      const categoryMap = {
        carboidrati: 'Carboidrati',
        proteine: 'Proteine',
        verdure: 'Verdure',
        grassi: 'Grassi Buoni'
      };
      title = `Sostituisci ${categoryMap[type]} (${mealType === 'pranzo' ? 'Pranzo' : 'Cena'})`;
      const categoryKey = `${mealType}${type.charAt(0).toUpperCase() + type.slice(1)}`;
      options = diet[categoryKey] || [];
      selectedValueId = getSelectedMacro(mealType, type)?.id;
    }

    setModalConfig({
      type,
      mealType,
      title,
      options,
      selectedValueId
    });
    setModalOpen(true);
  };

  // Salvataggio scelta dell'alternativa
  const handleSelectAlternative = (optionId) => {
    const { type, mealType } = modalConfig;
    const updatedSelections = { ...selections };
    
    if (!updatedSelections[activeDay]) {
      // Prepara struttura iniziale per il giorno se non esiste
      updatedSelections[activeDay] = {
        colazioneId: getSelectedColazione()?.id || '',
        spuntinoMattinaId: getSelectedSpuntinoMattina()?.id || '',
        spuntinoPomeriggioId: getSelectedSpuntinoPomeriggio()?.id || '',
        pranzo: {
          carboidratiId: getSelectedMacro('pranzo', 'carboidrati')?.id || '',
          proteineId: getSelectedMacro('pranzo', 'proteine')?.id || '',
          verdureId: getSelectedMacro('pranzo', 'verdure')?.id || '',
          grassiId: getSelectedMacro('pranzo', 'grassi')?.id || ''
        },
        cena: {
          carboidratiId: getSelectedMacro('cena', 'carboidrati')?.id || '',
          proteineId: getSelectedMacro('cena', 'proteine')?.id || '',
          verdureId: getSelectedMacro('cena', 'verdure')?.id || '',
          grassiId: getSelectedMacro('cena', 'grassi')?.id || ''
        }
      };
    }

    if (type === 'colazione') {
      updatedSelections[activeDay].colazioneId = optionId;
    } else if (type === 'spuntinoMattina') {
      updatedSelections[activeDay].spuntinoMattinaId = optionId;
    } else if (type === 'spuntinoPomeriggio') {
      updatedSelections[activeDay].spuntinoPomeriggioId = optionId;
    } else {
      // Per pranzo e cena
      updatedSelections[activeDay][mealType][`${type}Id`] = optionId;
    }

    onUpdatePatientSelections(activePatientId, updatedSelections);
    setModalOpen(false);
  };

  // Reset delle scelte giornaliere ai valori di default
  const handleResetDay = () => {
    if (!window.confirm("Sei sicuro di voler ripristinare le scelte predefinite per questo giorno?")) return;
    const updatedSelections = { ...selections };
    delete updatedSelections[activeDay];
    onUpdatePatientSelections(activePatientId, updatedSelections);
  };

  // Helper per calcolare il Lunedì di una data specificata
  const getMondayOfDate = (dateKey) => {
    if (!dateKey) return '';
    const d = new Date(dateKey);
    const day = d.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    const year = monday.getFullYear();
    const month = String(monday.getMonth() + 1).padStart(2, '0');
    const dateNum = String(monday.getDate()).padStart(2, '0');
    return `${year}-${month}-${dateNum}`;
  };

  // Ritorna immediatamente al giorno di oggi
  const handleGoToToday = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayKey = `2026-${month}-${day}`;
    setActiveDay(todayKey);
    
    setTimeout(() => {
      if (calendarScrollRef.current) {
        const mondayKey = getMondayOfDate(todayKey);
        const mondayEl = calendarScrollRef.current.querySelector(`[data-key="${mondayKey}"]`);
        if (mondayEl) {
          mondayEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        }
      }
    }, 100);
  };

  // Reset chat messages when patient changes
  useEffect(() => {
    if (patient) {
      setChatMessages([
        {
          id: 'msg-init-' + patient.id,
          sender: 'ai',
          text: `Ciao **${patient.name}**! Sono il tuo **Chef Assistente AI**. 

Posso consigliarti ricette deliziose e sane basate sulla tua dieta, oppure aiutarti a scoprire cosa cucinare con gli ingredienti che hai selezionato sul piatto del giorno.

Cosa ti piacerebbe preparare oggi? Puoi scrivermi una domanda o usare i suggerimenti rapidi qui sotto!`,
          timestamp: new Date()
        }
      ]);

      // Inizializza il contatore delle domande giornaliere
      const todayStr = new Date().toISOString().split('T')[0];
      const key = `liberadiete_chat_count_${patient.id}_${todayStr}`;
      const count = parseInt(localStorage.getItem(key) || '0', 10);
      setChatCountToday(count);
    }
  }, [activePatientId, patient]);

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAiTyping]);

  // Scroll automatico al giorno attivo all'avvio o al cambio scheda, allineando a Lunedì
  useEffect(() => {
    if (activeSubTab === 'diario' && calendarScrollRef.current) {
      setTimeout(() => {
        if (activeDay) {
          const mondayKey = getMondayOfDate(activeDay);
          const mondayEl = calendarScrollRef.current.querySelector(`[data-key="${mondayKey}"]`);
          if (mondayEl) {
            mondayEl.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'start' });
          } else {
            // Fallback se l'elemento specifico del lunedì non viene trovato
            const activeEl = calendarScrollRef.current.querySelector('[data-active="true"]');
            if (activeEl) {
              activeEl.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
            }
          }
        }
      }, 150); // Timeout per garantire il rendering del DOM
    }
  }, [activeSubTab, activePatientId, activeDay]);

  // Gestione dello scorrimento manuale con frecce laterali del calendario (scorre esattamente 1 settimana)
  const handleScrollCalendar = (direction) => {
    if (calendarScrollRef.current) {
      const containerWidth = calendarScrollRef.current.clientWidth;
      const scrollAmount = direction === 'left' ? -containerWidth : containerWidth;
      calendarScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSendChatMessage = async (textToSend) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const key = `liberadiete_chat_count_${patient?.id || 'default'}_${todayStr}`;
    const currentCount = parseInt(localStorage.getItem(key) || '0', 10);

    if (currentCount >= 10) {
      // Aggiungi comunque il messaggio dell'utente per continuità visiva
      const userMsg = {
        id: 'msg-user-' + Date.now(),
        sender: 'user',
        text: trimmed,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, userMsg]);
      setChatInput('');
      setIsAiTyping(true);

      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: 'msg-ai-limit-' + Date.now(),
          sender: 'ai',
          text: `Hai esaurito le 10 domande per oggi. Ricorda di ascoltare il tuo corpo, il tuo senso di fame e sazietà, e fare scelte serene!`,
          timestamp: new Date()
        }]);
        setIsAiTyping(false);
      }, 750);
      return;
    }

    // Incrementa il contatore giornaliero
    const newCount = currentCount + 1;
    localStorage.setItem(key, String(newCount));
    setChatCountToday(newCount);

    // Aggiungi messaggio utente
    const userMsg = {
      id: 'msg-user-' + Date.now(),
      sender: 'user',
      text: trimmed,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsAiTyping(true);

    const selectedIngredients = {
      carb: getSelectedMacro(activeMealTab, 'carboidrati'),
      prot: getSelectedMacro(activeMealTab, 'proteine'),
      veg: getSelectedMacro(activeMealTab, 'verdure'),
      fat: getSelectedMacro(activeMealTab, 'grassi')
    };

    const biaMealsContext = getBiaMealsContext(patient);

    if (geminiApiKey) {
      try {
        const systemPrompt = usePlateIngredients
          ? `Sei lo Chef Assistente AI di Libera dalle Diete, un'applicazione professionale per la gestione delle diete.
Rispondi sempre in lingua italiana. Sii incoraggiante, chiaro, professionale.
IMPORTANTE REGOLA MEDICA DA RISPETTARE TASSATIVAMENTE: Non menzionare mai calorie (kcal), grammi o percentuali di macronutrienti (carboidrati, proteine, grassi) nelle tue risposte al paziente. Non citare mai il suo target di peso specifico (dimagrimento, massa, mantenimento, deficit). Parla solo in termini di cibi reali, porzioni e ascolto dei segnali biologici di fame e sazietà.
Usa la formattazione markdown (### per titoli, ** per grassetti, elenchi per ingredienti e preparazione) per rendere la risposta strutturata e leggibile.
Aiuta il paziente proponendo consigli di cucina sani conformi al "Piatto Sano" (Harvard Healthy Eating Plate): metà del piatto riempito di verdure, un quarto di carboidrati, un quarto di proteine, e condimento con grassi buoni.

IMPORTANTE PER LA VELOCITÀ: Sii estremamente diretto, schematico e conciso. Evita lunghi testi introduttivi o di cortesia. Rispondi subito ed in modo rapido per minimizzare i tempi di generazione.

Linee guida per pasti fuori casa / ristoranti (es. McDonald's, Roadhouse, La Piadineria, Alice Pizza, Romantica, Poke House, Old Wild West, sushi, ecc.):
1. Consiglia panini o piatti reali, saporiti e gustosi attingendo ai menù effettivi di queste catene (es. piadine farcite a La Piadineria, tagli di carne o burger a Roadhouse e Old Wild West, tranci da Alice Pizza, poke composti a Poke House, piatti a Romantica, panini come McChicken o Crispy McBacon a McDonald's), strutturando combinazioni soddisfacenti e piacevoli, senza limitarti a insalate o opzioni tristi/punitive.
2. Rassicura il paziente sul fatto che un singolo pasto libero non compromette il suo percorso. NON parlare mai di "compensare", "tagliare le calorie" o "scontare" nei pasti successivi.
3. Invita invece il paziente ad ascoltare attentamente il proprio senso di fame e sazietà per il resto della giornata (es. per la cena): se si sente ancora sazio può fare un pasto molto leggero e idratante a base di verdure e proteine magre, ma sempre assecondando i propri segnali naturali e senza alcuna restrizione punitiva.

${patient ? `
Profilo Fisico Paziente:
- Nome: ${patient.name}
- Età: ${patient.age ? `${patient.age} anni` : 'Non specificata'}
- Sesso: ${patient.gender || 'Non specificato'}
- Peso: ${patient.weight ? `${patient.weight} kg` : 'Non specificato'}
- Altezza: ${patient.height ? `${patient.height} cm` : 'Non specificata'}
${patient.bia ? `- Dati Composizione Corporea (BIA):
  * Massa Grassa: ${patient.bia.fatMass}%
  * Massa Muscolare: ${patient.bia.muscleMass} kg
  * Metabolismo Basale (BMR): ${patient.bia.bmr} kcal
  * Obiettivo Dieta: ${targetLabels[patient.bia.target] || patient.bia.target}` : ''}` : ''}

${biaMealsContext}

Contesto del diario di oggi:
- Giorno della settimana: ${activeDayInfo?.dateStr || activeDay}
- Pasto: ${activeMealTab === 'pranzo' ? 'Pranzo' : 'Cena'}
- Ingredienti sul piatto dell'utente per questo pasto:
  * Carboidrati: ${selectedIngredients.carb ? `${selectedIngredients.carb.food} (${selectedIngredients.carb.quantity || ''})` : 'Nessuno selezionato'}
  * Proteine: ${selectedIngredients.prot ? `${selectedIngredients.prot.food} (${selectedIngredients.prot.quantity || ''})` : 'Nessuno selezionato'}
  * Verdure: ${selectedIngredients.veg ? `${selectedIngredients.veg.food} (${selectedIngredients.veg.quantity || ''})` : 'Nessuno selezionato'}
  * Grassi: ${selectedIngredients.fat ? `${selectedIngredients.fat.food} (${selectedIngredients.fat.quantity || ''})` : 'Nessuno selezionato'}

Rispondi alla domanda del paziente fornendo consigli pertinenti o formulando una ricetta appetitosa che utilizzi al meglio gli ingredienti sopra indicati, qualora sia richiesto o appropriato.`
          : `Sei lo Chef Assistente AI di Libera dalle Diete, un'applicazione professionale per la gestione delle diete.
Rispondi sempre in lingua italiana. Sii incoraggiante, chiaro, professionale.
IMPORTANTE REGOLA MEDICA DA RISPETTARE TASSATIVAMENTE: Non menzionare mai calorie (kcal), grammi o percentuali di macronutrienti (carboidrati, proteine, grassi) nelle tue risposte al paziente. Non citare mai il suo target di peso specifico (dimagrimento, massa, mantenimento, deficit). Parla solo in termini di cibi reali, porzioni e ascolto dei segnali biologici di fame e sazietà.
Usa la formattazione markdown (### per titoli, ** per grassetti, elenchi per ingredienti e preparazione) per rendere la risposta strutturata e leggibile.
Aiuta il paziente proponendo consigli di cucina sani conformi al "Piatto Sano" (Harvard Healthy Eating Plate): metà del piatto riempito di verdure, un quarto di carboidrati, un quarto di proteine, e condimento con grassi buoni.

IMPORTANTE PER LA VELOCITÀ: Sii estremamente diretto, schematico e conciso. Evita lunghi testi introduttivi o di cortesia. Rispondi subito ed in modo rapido per minimizzare i tempi di generazione.

Linee guida per pasti fuori casa / ristoranti (es. McDonald's, Roadhouse, La Piadineria, Alice Pizza, Romantica, Poke House, Old Wild West, sushi, ecc.):
1. Consiglia panini o piatti reali, saporiti e gustosi attingendo ai menù effettivi di queste catene (es. piadine farcite a La Piadineria, tagli di carne o burger a Roadhouse e Old Wild West, tranci da Alice Pizza, poke composti a Poke House, piatti a Romantica, panini come McChicken o Crispy McBacon a McDonald's), strutturando combinazioni soddisfacenti e piacevoli, senza limitarti a insalate o opzioni tristi/punitive.
2. Rassicura il paziente sul fatto che un singolo pasto libero non compromette il suo percorso. NON parlare mai di "compensare", "tagliare le calorie" o "scontare" nei pasti successivi.
3. Invita invece il paziente ad ascoltare attentamente il proprio senso di fame e sazietà per il resto della giornata (es. per la cena): se si sente ancora sazio può fare un pasto molto leggero e idratante a base di verdure e proteine magre, ma sempre assecondando i propri segnali naturali e senza alcuna restrizione punitiva.

${patient ? `
Profilo Fisico Paziente:
- Nome: ${patient.name}
- Età: ${patient.age ? `${patient.age} anni` : 'Non specificata'}
- Sesso: ${patient.gender || 'Non specificato'}
- Peso: ${patient.weight ? `${patient.weight} kg` : 'Non specificato'}
- Altezza: ${patient.height ? `${patient.height} cm` : 'Non specificata'}
${patient.bia ? `- Dati Composizione Corporea (BIA):
  * Massa Grassa: ${patient.bia.fatMass}%
  * Massa Muscolare: ${patient.bia.muscleMass} kg
  * Metabolismo Basale (BMR): ${patient.bia.bmr} kcal
  * Obiettivo Dieta: ${targetLabels[patient.bia.target] || patient.bia.target}` : ''}` : ''}

${biaMealsContext}

Contesto:
- L'utente ha disabilitato l'inclusione automatica degli ingredienti del suo piatto.
- Rispondi alla domanda del paziente consigliando ricette salutari basandoti esclusivamente sugli ingredienti che l'utente ti scriverà a mano nella domanda qui sotto. Se l'utente non specifica ingredienti, chiedigli gentilmente quali ha a disposizione o offri idee sane generali.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${geminiModel}:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${systemPrompt}\n\nDomanda utente: ${trimmed}`
                  }
                ]
              }
            ]
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          const errMsg = errData.error?.message || response.statusText;
          throw new Error(errMsg);
        }

        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Non ho ricevuto risposta da Gemini.";

        setChatMessages(prev => [...prev, {
          id: 'msg-ai-' + Date.now(),
          sender: 'ai',
          text: responseText,
          timestamp: new Date()
        }]);
      } catch (err) {
        console.error("Gemini API Error:", err);
        setChatMessages(prev => [...prev, {
          id: 'msg-ai-err-' + Date.now(),
          sender: 'ai',
          text: `⚠️ **Errore Gemini API**\n\nSi è verificato un errore durante la chiamata all'AI reale:\n*${err.message}*\n\n**Suggerimento**: Il modello potrebbe essere temporaneamente sovraccarico. Prova a selezionare un modello differente (es. *Gemini 2.0 Flash* o *Gemini 1.5 Flash*) nel menu impostazioni (ingranaggio ⚙️ in alto a destra) oppure clicca sul bottone qui sotto per usare il ricettario offline locale.`,
          isError: true,
          userQuery: trimmed,
          timestamp: new Date()
        }]);
      } finally {
        setIsAiTyping(false);
      }
    } else {
      // Fallback locale simulato
      setTimeout(() => {
        const responseText = generateAIResponse(trimmed, selectedIngredients, usePlateIngredients, patient);
        const notice = (usePlateIngredients && (trimmed.toLowerCase().includes('oggi') || trimmed.toLowerCase().includes('ingredienti') || trimmed.toLowerCase().includes('cucinare')))
          ? `\n\n*(Nota: Risposta locale simulata. Collega una chiave API reale in alto a destra per sbloccare l'AI).*`
          : '';
        
        setChatMessages(prev => [...prev, {
          id: 'msg-ai-' + Date.now(),
          sender: 'ai',
          text: responseText + notice,
          timestamp: new Date()
        }]);
        setIsAiTyping(false);
      }, 750);
    }
  };

  // Esegue l'elaborazione locale se l'API online risponde con un errore (sovraccarico/rete)
  const handleFallbackLocalResponse = (userQueryText) => {
    setIsAiTyping(true);
    setTimeout(() => {
      const selectedIngredients = {
        carb: getSelectedMacro(activeMealTab, 'carboidrati'),
        prot: getSelectedMacro(activeMealTab, 'proteine'),
        veg: getSelectedMacro(activeMealTab, 'verdure'),
        fat: getSelectedMacro(activeMealTab, 'grassi')
      };
      const responseText = generateAIResponse(userQueryText, selectedIngredients, usePlateIngredients, patient);
      
      setChatMessages(prev => [...prev, {
        id: 'msg-ai-fallback-' + Date.now(),
        sender: 'ai',
        text: `*(Risposta offline generata con il motore locale)*\n\n${responseText}`,
        timestamp: new Date()
      }]);
      setIsAiTyping(false);
    }, 500);
  };

  // Helper per formattare grassetti, corsivi, liste ed intestazioni
  const renderFormattedText = (text) => {
    if (!text) return '';
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h3 key={idx} style={{ margin: '1rem 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 'bold' }}>{line.slice(4)}</h3>;
      }
      if (line.startsWith('- ')) {
        const parts = line.slice(2).split('**');
        return (
          <li key={idx} style={{ marginLeft: '1rem', marginBottom: '0.25rem', listStyleType: 'disc' }}>
            {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx}>{part}</strong> : part)}
          </li>
        );
      }
      if (/^\d+\s*\.\s/.test(line)) {
        const match = line.match(/^(\d+\s*\.\s)(.*)/);
        const number = match[1];
        const content = match[2];
        const parts = content.split('**');
        return (
          <div key={idx} style={{ marginLeft: '1rem', marginBottom: '0.4rem', display: 'flex', gap: '0.25rem' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{number}</span>
            <span>{parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx}>{part}</strong> : part)}</span>
          </div>
        );
      }
      const parts = line.split('**');
      return (
        <p key={idx} style={{ margin: '0 0 0.5rem 0', minHeight: '1.2em' }}>
          {parts.map((part, pIdx) => {
            if (part.includes('*')) {
              const subparts = part.split('*');
              return subparts.map((sub, sIdx) => sIdx % 2 === 1 ? <em key={sIdx}>{sub}</em> : sub);
            }
            return pIdx % 2 === 1 ? <strong key={pIdx}>{part}</strong> : part;
          })}
        </p>
      );
    });
  };

  // Calcolo del saluto e dell'emoji in base all'ora
  const getGreeting = () => {
    const hours = new Date().getHours();
    let greeting = "Buongiorno";
    let emoji = "☀️";
    if (hours >= 13 && hours < 18) {
      greeting = "Buon pomeriggio";
      emoji = "🌤️";
    } else if (hours >= 18 || hours < 5) {
      greeting = "Buonasera";
      emoji = "🌙";
    }
    return { text: greeting, emoji };
  };

  // Calcolo del BMI e relativo stato
  const getBmiInfo = () => {
    if (!patient || !patient.weight || !patient.height) return { value: '-', label: 'Dati incompleti' };
    const hMeters = patient.height / 100;
    const bmiVal = (patient.weight / (hMeters * hMeters)).toFixed(1);
    let label = 'Normopeso';
    if (bmiVal < 18.5) label = 'Sottopeso';
    else if (bmiVal >= 25 && bmiVal < 30) label = 'Sovrappeso';
    else if (bmiVal >= 30) label = 'Obesità';
    return { value: bmiVal, label };
  };

  // Risolve gli alimenti attivi per visualizzarli sul piatto/schede
  const activeColazione = getSelectedColazione();
  const activeSpuntinoMattina = getSelectedSpuntinoMattina();
  const activeSpuntinoPomeriggio = getSelectedSpuntinoPomeriggio();
  const activeCarb = getSelectedMacro(activeMealTab, 'carboidrati');
  const activeProt = getSelectedMacro(activeMealTab, 'proteine');
  const activeVeg = getSelectedMacro(activeMealTab, 'verdure');
  const activeFat = getSelectedMacro(activeMealTab, 'grassi');

  const hasDiet = diet && Object.values(diet).some(arr => arr.length > 0);

  return (
    <div className="patient-view" style={{ animation: 'modalSlide 0.4s ease', paddingBottom: '90px' }}>
      
      {/* Header Mobile con Hamburger */}
      {isPatientLogged && (
        <div style={{ position: 'relative', zIndex: 100 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', marginBottom: '1rem', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '1.2rem', boxShadow: '0 3px 10px rgba(214,51,132,0.22)'
              }}>
                {patient?.name?.[0]?.toUpperCase() || 'P'}
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Benvenuta/o</span>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>{patient?.name}</h2>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button style={{ all: 'unset', cursor: 'pointer', padding: '0.5rem' }} onClick={() => setActiveSubTab('chatDoc')}>
                <div style={{ position: 'relative' }}>
                  <Send size={22} style={{ color: 'var(--text-muted)' }} />
                  {patient?.messages?.some(m => m.sender === 'doctor' && !m.read) && (
                    <span style={{
                      position: 'absolute', top: '-6px', right: '-6px', background: 'var(--danger)', color: '#fff',
                      borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.6rem', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                    }}>
                      {patient.messages.filter(m => m.sender === 'doctor' && !m.read).length}
                    </span>
                  )}
                </div>
              </button>
              <button style={{ all: 'unset', cursor: 'pointer', padding: '0.5rem' }} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} style={{ color: 'var(--text-main)' }} /> : <Menu size={24} style={{ color: 'var(--text-main)' }} />}
              </button>
            </div>
          </div>
          
          {/* Menu a tendina */}
          {isMenuOpen && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
              background: '#fff', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              padding: '0.5rem', width: '220px', zIndex: 101, border: '1px solid var(--border-soft)',
              animation: 'slideDown 0.2s ease'
            }}>
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-soft)', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Menu Paziente</span>
              </div>
              <button 
                onClick={() => { setIsMenuOpen(false); setActiveSubTab('chatDoc'); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', background: 'transparent', textAlign: 'left', fontSize: '0.9rem', color: 'var(--text-main)', cursor: 'pointer' }}
              >
                <Send size={18} style={{ color: 'var(--primary)' }} />
                Messaggi Dottoressa
              </button>
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  alert("Impostazioni profilo (Mock) - Questa funzione sarà disponibile a breve!");
                }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', background: 'transparent', textAlign: 'left', fontSize: '0.9rem', color: 'var(--text-main)', cursor: 'pointer' }}
              >
                <Layers size={18} style={{ color: 'var(--primary)' }} />
                Il mio Profilo
              </button>
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  window.location.reload(); // Logout grezzo simulato
                }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', background: 'rgba(239, 68, 68, 0.05)', textAlign: 'left', fontSize: '0.9rem', color: 'var(--danger)', cursor: 'pointer', marginTop: '0.5rem' }}
              >
                <LogOut size={18} />
                Esci dall'App
              </button>
            </div>
          )}
        </div>
      )}

      {/* Barra Selettore Paziente per testing - Nascosta se loggato come Paziente */}
      {!isPatientLogged && (
        <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Layers size={18} style={{ color: 'var(--primary)' }} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Area Paziente (Simulazione):</span>
          </div>
          <select 
            className="form-input" 
            style={{ minWidth: '220px', padding: '0.5rem' }}
            value={activePatientId}
            onChange={(e) => {
              setActivePatientId(e.target.value);
              setModalOpen(false);
            }}
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.name} {p.surname}</option>
            ))}
          </select>
        </div>
      )}

      {!patient ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Nessun paziente disponibile. Accedi prima alla Dashboard del Medico per crearne uno.
        </div>
      ) : !hasDiet ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <ChefHat size={48} style={{ color: 'var(--primary)', opacity: 0.5, marginBottom: '1.5rem' }} />
          <h2 style={{ marginBottom: '0.75rem' }}>Nessuna Dieta Trovata</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
            La dietista non ha ancora caricato o configurato il piano alimentare per <strong>{patient.name} {patient.surname}</strong>.
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>
            Utilizza la Dashboard in alto per caricare un file PDF e generare la dieta!
          </p>
        </div>
      ) : (
        <div>
          
          {/* Container Principale per le viste */}

          {activeSubTab === 'diario' && (
            <div>
              
              {/* Saluto rimossso perché spostato nell'header */}

              {/* Card Principale del Piano Alimentare in Rosa Satinato Premium */}
              <div style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, #b0246e 100%)',
                color: '#ffffff',
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                marginBottom: '1.5rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  right: '-30px',
                  top: '-30px',
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.07)',
                  pointerEvents: 'none'
                }} />

                <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.85, margin: 0 }}>
                  Il tuo piano alimentare
                </p>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0.2rem 0 1.2rem 0', opacity: 0.95 }}>
                  {patient.weight ? `${patient.weight} kg` : ''} {patient.height ? `· ${patient.height} cm` : ''} {patient.age ? `· ${patient.age} anni` : ''}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' }}>
                  {/* Box BMI */}
                  <div style={{ background: '#ffffff', color: 'var(--text-main)', padding: '0.75rem 0.4rem', borderRadius: '14px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.15rem' }}>
                      BMI
                    </span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#8b5cf6', display: 'block' }}>
                      {getBmiInfo().value}
                    </span>
                    <span style={{ fontSize: '0.62rem', fontWeight: 600, color: '#8b5cf6', display: 'block', marginTop: '0.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {getBmiInfo().label}
                    </span>
                  </div>

                  {/* Box Piano Attivo */}
                  <div style={{ background: '#ffffff', color: 'var(--text-main)', padding: '0.75rem 0.4rem', borderRadius: '14px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.15rem' }}>
                      Metodo
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', display: 'block', margin: '0.35rem 0', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Libera Dieta
                    </span>
                    <span style={{ fontSize: '0.62rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginTop: '0.1rem' }}>
                      Personalizzato
                    </span>
                  </div>
                </div>
              </div>

              {/* Calendario Navigatore a pillole scorrevoli in stile Mockup */}
              <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={16} /> {activeDayInfo ? activeDayInfo.dateStr : activeDay}
                  </span>
                  
                  {patient?.nextCheckupDate && (
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      color: 'var(--primary)', 
                      background: 'rgba(214, 51, 132, 0.08)', 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '10px',
                      border: '1px solid rgba(214, 51, 132, 0.12)'
                    }}>
                      📅 Prossimo controllo: {formatCheckupDate(patient.nextCheckupDate)}
                    </span>
                  )}

                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <button 
                      className="btn btn-outline btn-sm" 
                      style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem', border: 'none', background: 'var(--primary-bg)', color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                      onClick={handleGoToToday}
                    >
                      📅 Oggi
                    </button>
                    <button 
                      className="btn btn-outline btn-sm" 
                      style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem', border: 'none', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                      onClick={handleResetDay}
                    >
                      <RotateCcw size={10} /> Ripristina Pasti
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', position: 'relative' }}>
                  {/* Pulsante Sinistro per scorrimento rapido */}
                  <button
                    type="button"
                    onClick={() => handleScrollCalendar('left')}
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1.5px solid var(--border-soft)',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--primary)',
                      boxShadow: 'var(--shadow-sm)',
                      flexShrink: 0,
                      transition: 'all 0.2s',
                      zIndex: 2
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)'}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {/* Contenitore pillole scorrevole */}
                  <div 
                    ref={calendarScrollRef}
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      overflowX: 'auto',
                      paddingBottom: '4px',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      flex: 1,
                      scrollBehavior: 'smooth'
                    }}
                  >
                    <style>{`
                      .pill-calendar-container::-webkit-scrollbar { display: none; }
                    `}</style>
                    <div className="pill-calendar" style={{ display: 'flex', gap: '0.4rem', width: '100%' }}>
                      {days2026.map((wd) => {
                        const isActive = activeDay === wd.dateKey;
                        const daySelectionsForThisDay = selections[wd.dateKey] || selections[wd.name] || {};
                        const isSelectedCustom = Object.keys(daySelectionsForThisDay).length > 0;
                        const label = wd.dayShort;
                        const num = wd.dayNum;
                        
                        return (
                          <button
                            key={wd.dateKey}
                            data-key={wd.dateKey}
                            data-active={isActive}
                            onClick={() => setActiveDay(wd.dateKey)}
                            style={{
                              border: isActive ? 'none' : '1.5px solid var(--border-soft)',
                              background: isActive ? 'linear-gradient(135deg, var(--primary) 0%, #b0246e 100%)' : '#ffffff',
                              color: isActive ? '#ffffff' : 'var(--text-main)',
                              borderRadius: '16px',
                              padding: '0.45rem 0.1rem',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '0.1rem',
                              width: 'calc((100% - 2.4rem) / 7)',
                              flexShrink: 0,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              boxShadow: isActive ? '0 4px 10px rgba(214,51,132,0.22)' : 'none',
                              transform: isActive ? 'translateY(-2px)' : 'none'
                            }}
                          >
                            <span style={{ fontSize: '0.58rem', fontWeight: 700, opacity: isActive ? 0.85 : 0.6, textTransform: 'uppercase' }}>
                              {label}
                            </span>
                            <span style={{ fontSize: '0.92rem', fontWeight: 800, position: 'relative', lineHeight: 1.1 }}>
                              {num}
                              {isSelectedCustom && !isActive && (
                                <span style={{
                                  position: 'absolute',
                                  bottom: '-2px',
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  width: '3px',
                                  height: '3px',
                                  borderRadius: '50%',
                                  backgroundColor: 'var(--primary)'
                                }} />
                              )}
                            </span>
                            <span style={{ fontSize: '0.52rem', fontWeight: 700, opacity: isActive ? 0.8 : 0.5, textTransform: 'uppercase', marginTop: '1px' }}>
                              {wd.monthLabel}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pulsante Destro per scorrimento rapido */}
                  <button
                    type="button"
                    onClick={() => handleScrollCalendar('right')}
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1.5px solid var(--border-soft)',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--primary)',
                      boxShadow: 'var(--shadow-sm)',
                      flexShrink: 0,
                      transition: 'all 0.2s',
                      zIndex: 2
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)'}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Sfida Giornaliera Banner */}
              {(() => {
                const activeDayDate = new Date(activeDay);
                const activeDayIndex = (activeDayDate.getDay() + 6) % 7; // 0=Mon..6=Sun
                const prog = getChallengeProgress();
                const currentWeekCh = liberaDieteChallenges.find(c => c.week === prog.currentWeek) || liberaDieteChallenges[0];
                const todayChallengeText = currentWeekCh.dailyTasks[activeDayIndex] || "Nessuna sfida impostata per questo giorno.";

                return (
                  <div 
                    className="glass-card" 
                    onClick={() => setActiveSubTab('mindful')}
                    style={{ 
                      padding: '1.25rem', 
                      marginBottom: '1.5rem', 
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(214, 51, 132, 0.08) 100%)', 
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>🎯</span>
                      <div>
                        <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)' }}>Sfida del Giorno ({currentWeekCh.title})</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                          {todayChallengeText}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* TRACKER IDRATAZIONE QUOTIDIANA (Spostato qui) */}
              <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.04) 0%, rgba(2, 132, 199, 0.04) 100%)', border: '1.5px solid rgba(56, 189, 248, 0.25)', borderRadius: '24px', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#0284c7' }}>
                    <span style={{ fontSize: '1.4rem' }}>💧</span>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800 }}>Idratazione Quotidiana</h3>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mantieni il tuo corpo idratato</p>
                    </div>
                  </div>
                  {/* Valore oggi */}
                  <div style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '20px',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    Obiettivo: 8 bicchieri (2L)
                  </div>
                </div>

                <div style={{
                  background: '#ffffff',
                  padding: '1.25rem',
                  borderRadius: '18px',
                  border: '1px solid rgba(56, 189, 248, 0.15)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  alignItems: 'center'
                }}>
                  {/* Visualizzatore Bicchieri ed Incrementatori */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', justifyContent: 'center', width: '100%', flexWrap: 'wrap' }}>
                    {/* Bottone Meno */}
                    <button
                      type="button"
                      onClick={() => handleUpdateWater(activeDay, getPatientWaterForDate(activeDay) - 1)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: '1.5px solid rgba(56, 189, 248, 0.3)',
                        background: '#ffffff',
                        color: '#0284c7',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        lineHeight: 1
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                    >
                      -
                    </button>

                    {/* Lista Bicchieri SVG */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '260px' }}>
                      {(() => {
                        const currentWater = getPatientWaterForDate(activeDay);
                        const totalGlassesToRender = Math.max(8, currentWater);
                        const glassesArr = [];
                        
                        for (let i = 0; i < totalGlassesToRender; i++) {
                          const isFilled = i < currentWater;
                          glassesArr.push(
                            <svg 
                              key={i}
                              onClick={() => handleUpdateWater(activeDay, i + 1)}
                              width="26" 
                              height="36" 
                              viewBox="0 0 32 42" 
                              style={{ cursor: 'pointer', transition: 'transform 0.2s', filter: isFilled ? 'drop-shadow(0 2px 4px rgba(2, 132, 199, 0.2))' : 'none' }}
                              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                              <path 
                                d="M 6 4 L 26 4 L 22 38 L 10 38 Z" 
                                fill={isFilled ? 'url(#waterGrad)' : 'rgba(224, 242, 254, 0.3)'} 
                                stroke={isFilled ? '#0284c7' : '#94a3b8'} 
                                strokeWidth="2" 
                                strokeLinejoin="round"
                              />
                              <path 
                                d="M 22 7 L 19 32" 
                                stroke="rgba(255, 255, 255, 0.6)" 
                                strokeWidth="1.5" 
                                strokeLinecap="round"
                              />
                            </svg>
                          );
                        }
                        return (
                          <>
                            {glassesArr}
                            <svg width="0" height="0" style={{ position: 'absolute' }}>
                              <defs>
                                <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#38bdf8" />
                                  <stop offset="100%" stopColor="#0284c7" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </>
                        );
                      })()}
                    </div>

                    {/* Bottone Più */}
                    <button
                      type="button"
                      onClick={() => handleUpdateWater(activeDay, getPatientWaterForDate(activeDay) + 1)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: '1.5px solid rgba(56, 189, 248, 0.3)',
                        background: '#ffffff',
                        color: '#0284c7',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        lineHeight: 1
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                    >
                      +
                    </button>
                  </div>

                  {/* Stato Quantità e Motivazione */}
                  {(() => {
                    const count = getPatientWaterForDate(activeDay);
                    const liters = (count * 0.25).toFixed(2);
                    
                    let msg = "Inizia con un bicchiere d'acqua ora! 💧";
                    if (count >= 3 && count <= 5) msg = "Ottima idratazione, continua così! 🥤";
                    else if (count >= 6 && count <= 7) msg = "Quasi all'obiettivo quotidiano! 🌟";
                    else if (count >= 8) msg = "Obiettivo raggiunto! Idratazione fantastica! 🎉";

                    return (
                      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-color)' }}>
                          Hai bevuto {count} bicchieri d'acqua ({liters} litri)
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          {msg}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Menù di Oggi Dropdown/Sezione - Compatto ed elegante come da Mockup */}
              <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem', marginBottom: '1rem' }}>
                  <Coffee size={18} style={{ color: 'var(--primary)' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>Menù del Giorno</h3>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* Riga Colazione */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--primary-bg)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-soft)' }}>
                    <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.15rem' }}>🌅 Colazione</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {activeColazione ? activeColazione.content : 'Non configurata'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                      {(() => {
                        const mealKey = `${activeDay}-colazione`;
                        const isLogged = loggedMealWater[mealKey];
                        return (
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ 
                              padding: '0.35rem 0.5rem', 
                              border: isLogged ? '1px solid #22c55e' : '1px solid rgba(2, 132, 199, 0.2)', 
                              background: isLogged ? '#22c55e' : 'rgba(2, 132, 199, 0.05)', 
                              color: isLogged ? '#ffffff' : '#0284c7', 
                              fontSize: '0.75rem', 
                              borderRadius: '8px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.2rem',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => {
                              if (!isLogged) {
                                handleUpdateWater(activeDay, getPatientWaterForDate(activeDay) + 1);
                                setLoggedMealWater(prev => ({ ...prev, [mealKey]: true }));
                              }
                            }}
                            title="Aggiungi 1 bicchiere d'acqua"
                          >
                            {isLogged ? '✅ Fatto' : '💧 +1'}
                          </button>
                        );
                      })()}
                      <button 
                        className="btn btn-outline btn-sm" 
                        style={{ padding: '0.35rem 0.65rem', border: 'none', background: '#ffffff', fontSize: '0.75rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}
                        onClick={() => openAlternativeModal('colazione')}
                      >
                        Sostituisci
                      </button>
                    </div>
                  </div>

                  {/* Riga Spuntino Mattina */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--primary-bg)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-soft)' }}>
                    <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.15rem' }}>🍎 Spuntino Mattina</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {activeSpuntinoMattina ? activeSpuntinoMattina.content : 'Non configurato'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                      {(() => {
                        const mealKey = `${activeDay}-spuntinoMattina`;
                        const isLogged = loggedMealWater[mealKey];
                        return (
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ 
                              padding: '0.35rem 0.5rem', 
                              border: isLogged ? '1px solid #22c55e' : '1px solid rgba(2, 132, 199, 0.2)', 
                              background: isLogged ? '#22c55e' : 'rgba(2, 132, 199, 0.05)', 
                              color: isLogged ? '#ffffff' : '#0284c7', 
                              fontSize: '0.75rem', 
                              borderRadius: '8px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.2rem',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => {
                              if (!isLogged) {
                                handleUpdateWater(activeDay, getPatientWaterForDate(activeDay) + 1);
                                setLoggedMealWater(prev => ({ ...prev, [mealKey]: true }));
                              }
                            }}
                            title="Aggiungi 1 bicchiere d'acqua"
                          >
                            {isLogged ? '✅ Fatto' : '💧 +1'}
                          </button>
                        );
                      })()}
                      <button 
                        className="btn btn-outline btn-sm" 
                        style={{ padding: '0.35rem 0.65rem', border: 'none', background: '#ffffff', fontSize: '0.75rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}
                        onClick={() => openAlternativeModal('spuntinoMattina')}
                      >
                        Sostituisci
                      </button>
                    </div>
                  </div>

                  {/* Riga Spuntino Pomeriggio */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--primary-bg)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-soft)' }}>
                    <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.15rem' }}>🍊 Spuntino Pomeriggio</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {activeSpuntinoPomeriggio ? activeSpuntinoPomeriggio.content : 'Non configurato'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                      {(() => {
                        const mealKey = `${activeDay}-spuntinoPomeriggio`;
                        const isLogged = loggedMealWater[mealKey];
                        return (
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ 
                              padding: '0.35rem 0.5rem', 
                              border: isLogged ? '1px solid #22c55e' : '1px solid rgba(2, 132, 199, 0.2)', 
                              background: isLogged ? '#22c55e' : 'rgba(2, 132, 199, 0.05)', 
                              color: isLogged ? '#ffffff' : '#0284c7', 
                              fontSize: '0.75rem', 
                              borderRadius: '8px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.2rem',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => {
                              if (!isLogged) {
                                handleUpdateWater(activeDay, getPatientWaterForDate(activeDay) + 1);
                                setLoggedMealWater(prev => ({ ...prev, [mealKey]: true }));
                              }
                            }}
                            title="Aggiungi 1 bicchiere d'acqua"
                          >
                            {isLogged ? '✅ Fatto' : '💧 +1'}
                          </button>
                        );
                      })()}
                      <button 
                        className="btn btn-outline btn-sm" 
                        style={{ padding: '0.35rem 0.65rem', border: 'none', background: '#ffffff', fontSize: '0.75rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}
                        onClick={() => openAlternativeModal('spuntinoPomeriggio')}
                      >
                        Sostituisci
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* PIATTO PRINCIPALE (PRANZO E CENA) */}
              <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                    <ChefHat size={20} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Piatto Principale</h3>
                  </div>
                  
                  {/* Toggle Tab Pranzo/Cena */}
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {(() => {
                      const mealKey = `${activeDay}-piattoPrincipale`;
                      const isLogged = loggedMealWater[mealKey];
                      return (
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ 
                            padding: '0.35rem 0.6rem', 
                            border: isLogged ? '1px solid #22c55e' : '1px solid rgba(2, 132, 199, 0.2)', 
                            background: isLogged ? '#22c55e' : 'rgba(2, 132, 199, 0.05)', 
                            color: isLogged ? '#ffffff' : '#0284c7', 
                            fontSize: '0.75rem', 
                            borderRadius: '16px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.2rem',
                            transition: 'all 0.2s ease'
                          }}
                          onClick={() => {
                            if (!isLogged) {
                              handleUpdateWater(activeDay, getPatientWaterForDate(activeDay) + 1);
                              setLoggedMealWater(prev => ({ ...prev, [mealKey]: true }));
                            }
                          }}
                          title="Aggiungi 1 bicchiere d'acqua"
                        >
                          {isLogged ? '✅ Fatto' : '💧 +1 Bicchiere'}
                        </button>
                      );
                    })()}
                    <div style={{ display: 'inline-flex', background: 'var(--bg-primary)', padding: '3px', borderRadius: '20px', border: '1.5px solid var(--border-color)' }}>
                      <button 
                        className={`btn btn-sm ${activeMealTab === 'pranzo' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ border: 'none', borderRadius: '16px', padding: '0.35rem 0.8rem', fontSize: '0.78rem' }}
                        onClick={() => setActiveMealTab('pranzo')}
                      >
                        Pranzo
                      </button>
                      <button 
                        className={`btn btn-sm ${activeMealTab === 'cena' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ border: 'none', borderRadius: '16px', padding: '0.35rem 0.8rem', fontSize: '0.78rem' }}
                        onClick={() => setActiveMealTab('cena')}
                      >
                        Cena
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid-cols-2" style={{ alignItems: 'center', gap: '1.5rem' }}>
                  
                  {/* Vista Interattiva del Piatto */}
                  <div className="plate-container">
                    <div className="plate-visualizer">
                      
                      {/* Carboidrati */}
                      <div 
                        className="plate-segment segment-carb"
                        onClick={() => openAlternativeModal('carboidrati', activeMealTab)}
                        title="Clicca per sostituire i carboidrati"
                      >
                        <div className="segment-content">
                          <span className="segment-name">Carboidrati</span>
                          <span className="segment-food">
                            {activeCarb ? activeCarb.food : 'Nessuno'}
                          </span>
                          <span className="segment-qty">
                            {activeCarb?.quantity ? activeCarb.quantity : ''}
                          </span>
                        </div>
                      </div>

                      {/* Proteine */}
                      <div 
                        className="plate-segment segment-prot"
                        onClick={() => openAlternativeModal('proteine', activeMealTab)}
                        title="Clicca per sostituire le proteine"
                      >
                        <div className="segment-content">
                          <span className="segment-name">Proteine</span>
                          <span className="segment-food">
                            {activeProt ? activeProt.food : 'Nessuno'}
                          </span>
                          <span className="segment-qty">
                            {activeProt?.quantity ? activeProt.quantity : ''}
                          </span>
                        </div>
                      </div>

                      {/* Verdure */}
                      <div 
                        className="plate-segment segment-veg"
                        onClick={() => openAlternativeModal('verdure', activeMealTab)}
                        title="Clicca per sostituire le verdure"
                      >
                        <div className="segment-content">
                          <span className="segment-name">Verdure</span>
                          <span className="segment-food">
                            {activeVeg ? activeVeg.food : 'A scelta'}
                          </span>
                          <span className="segment-qty">
                            {activeVeg?.quantity ? activeVeg.quantity : 'a volontà'}
                          </span>
                        </div>
                      </div>

                      {/* Grassi (Cerchio centrale) */}
                      <div 
                        className="plate-segment segment-fat"
                        onClick={() => openAlternativeModal('grassi', activeMealTab)}
                        title="Clicca per sostituire i condimenti"
                      >
                        <div className="segment-content">
                          <span className="segment-name">Condimento</span>
                          <span className="segment-food">
                            {activeFat ? activeFat.food : 'Olio EVO'}
                          </span>
                          <span className="segment-qty">
                            {activeFat?.quantity ? activeFat.quantity : ''}
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Legenda Colori Piatto */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '0.75rem', 
                      marginTop: '1rem', 
                      fontSize: '0.75rem', 
                      color: 'var(--text-muted)',
                      flexWrap: 'wrap',
                      justifyContent: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-veg)' }} /> Verdure (50%)
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-carb)' }} /> Carboidrati (25%)
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-prot)' }} /> Proteine (25%)
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-fat)' }} /> Condimento
                      </div>
                    </div>
                  </div>

                  {/* Dettagli statici ed informazioni a fianco del piatto */}
                  <div style={{ padding: '0 0.5rem' }}>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 700 }}>Riepilogo Piatto</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                      Personalizza il pranzo o la cena selezionando le alternative approvate dal tuo piano nutrizionale.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: 600 }}>Carboidrati:</span>
                        <span style={{ textAlign: 'right' }}>{activeCarb ? `${activeCarb.food} ${activeCarb.quantity ? `(${activeCarb.quantity})` : ''}` : 'Non definito'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: 600 }}>Proteine:</span>
                        <span style={{ textAlign: 'right' }}>{activeProt ? `${activeProt.food} ${activeProt.quantity ? `(${activeProt.quantity})` : ''}` : 'Non definito'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: 600 }}>Verdure:</span>
                        <span style={{ textAlign: 'right' }}>{activeVeg ? `${activeVeg.food} ${activeVeg.quantity ? `(${activeVeg.quantity})` : ''}` : 'Non definito'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: 600 }}>Condimento:</span>
                        <span style={{ textAlign: 'right' }}>{activeFat ? `${activeFat.food} ${activeFat.quantity ? `(${activeFat.quantity})` : ''}` : 'Non definito'}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Ricetta Consigliata del Giorno */}
                {hasDiet && (activeCarb || activeProt || activeVeg) && (
                  <div style={{ 
                    marginTop: '2rem', 
                    paddingTop: '1.5rem', 
                    borderTop: '1px dashed var(--border-color)' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                      <Sparkles size={18} className="logo-icon" />
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                        La Ricetta Consigliata dello Chef
                      </h4>
                    </div>

                    {(() => {
                      const recipe = getPlateRecipe(activeCarb, activeProt, activeVeg, activeFat);
                      return (
                        <div style={{ 
                          background: 'linear-gradient(135deg, var(--primary-bg) 0%, rgba(255, 255, 255, 0.9) 100%)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '16px',
                          padding: '1.25rem',
                          boxShadow: 'var(--shadow-sm)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.85rem'
                        }}>
                          <div>
                            <h5 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-color)', marginBottom: '0.3rem' }}>
                              🍳 {recipe.title}
                            </h5>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.4, margin: 0 }}>
                              {recipe.description}
                            </p>
                          </div>

                          {/* Ingredienti della ricetta */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            <strong style={{ fontSize: '0.78rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Ingredienti da utilizzare:
                            </strong>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.2rem' }}>
                              {recipe.ingredients.map((ing, idx) => (
                                <span key={idx} style={{ 
                                  fontSize: '0.78rem', 
                                  fontWeight: 600, 
                                  padding: '0.3rem 0.65rem', 
                                  borderRadius: '8px', 
                                  background: '#ffffff', 
                                  border: '1px solid var(--border-soft)',
                                  color: 'var(--text-color)'
                                }}>
                                  🔹 {ing}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Passaggi di preparazione */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.2rem' }}>
                            <strong style={{ fontSize: '0.78rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.15rem' }}>
                              Preparazione passo-passo:
                            </strong>
                            <ol style={{ paddingLeft: '1.15rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                              {recipe.steps.map((step, idx) => (
                                <li key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Disclaimer sulla provenienza delle ricette */}
                          <div style={{ 
                            marginTop: '0.5rem', 
                            paddingTop: '0.75rem', 
                            borderTop: '1px solid var(--border-soft)',
                            display: 'flex', 
                            alignItems: 'flex-start', 
                            gap: '0.4rem',
                            color: 'var(--text-muted)',
                            fontSize: '0.72rem',
                            lineHeight: 1.35
                          }}>
                            <span>💡</span>
                            <span>
                              Nota: Queste ricette veloci sono generate abbinando gli alimenti del database. Per ricette originali e personalizzate dall'Intelligenza Artificiale, chiedi direttamente all'assistente nella chat.
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

              </div>

            </div>
          )}

          {activeSubTab === 'progressi' && (
            <div style={{ animation: 'modalSlide 0.3s ease' }}>
              
              {/* Banner Prossimo Controllo e Riepilogo */}
              <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(214, 51, 132, 0.05) 0%, rgba(176, 36, 110, 0.05) 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'var(--primary-bg)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                  }}>
                    📅
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>Prossimo Appuntamento</span>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>
                      {formatCheckupDate(patient?.nextCheckupDate)}
                    </strong>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Porta con te il diario alimentare aggiornato e tieni traccia delle tue risposte dell'Assistente AI per discuterne insieme durante il controllo!
                </p>
              </div>

              {/* Stato Attuale BIA & Peso */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', padding: '0.75rem 0.5rem', borderRadius: '12px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Peso Attuale</span>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--primary)', display: 'block', margin: '0.2rem 0' }}>
                    {patient?.weight || '--'} kg
                  </strong>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', padding: '0.75rem 0.5rem', borderRadius: '12px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Massa Grassa</span>
                  <strong style={{ fontSize: '1.1rem', color: '#f43f5e', display: 'block', margin: '0.2rem 0' }}>
                    {patient?.bia?.fatMass ? `${patient.bia.fatMass}%` : '--'}
                  </strong>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', padding: '0.75rem 0.5rem', borderRadius: '12px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Massa Muscolare</span>
                  <strong style={{ fontSize: '1.1rem', color: '#10b981', display: 'block', margin: '0.2rem 0' }}>
                    {patient?.bia?.muscleMass ? `${patient.bia.muscleMass} kg` : '--'}
                  </strong>
                </div>
              </div>

              {/* Card Motivazionale basata sull'andamento */}
              {(() => {
                const insight = getMotivationalInsight();
                return (
                  <div className="glass-card" style={{ 
                    padding: '1.5rem', 
                    marginBottom: '1.5rem', 
                    borderLeft: `5px solid ${insight.color}`,
                    background: 'rgba(255, 255, 255, 0.65)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: 'var(--shadow-sm)',
                    animation: 'modalSlide 0.3s ease'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.35rem' }}>{insight.icon}</span>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)' }}>
                        {insight.title}
                      </h4>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: insight.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    
                    <div style={{ 
                      marginTop: '0.85rem', 
                      paddingTop: '0.75rem', 
                      borderTop: '1px solid var(--border-soft)', 
                      fontSize: '0.74rem', 
                      color: 'var(--text-muted)', 
                      fontStyle: 'italic',
                      lineHeight: 1.3
                    }}>
                      💡 Ricorda: la salute e la ricomposizione corporea non si misurano solo in chili sulla bilancia, ma in energia, forza, vestibilità dei vestiti e benessere quotidiano. Sii gentile con il tuo corpo nel suo percorso unico!
                    </div>
                  </div>
                );
              })()}

              {/* Card Inserimento Rilevazione Paziente */}
              <div className="glass-card" style={{ 
                padding: '1.25rem', 
                marginBottom: '1.5rem', 
                background: 'rgba(255, 255, 255, 0.55)',
                border: '1px solid var(--border-soft)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  ⚖️ Registra il tuo Peso Settimanale
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.45, borderLeft: '3px solid var(--primary)', paddingLeft: '0.75rem' }}>
                  ℹ️ <strong>Una nota importante:</strong> il peso sulla bilancia è solo un numero complessivo e <strong>non indica con precisione cosa sta succedendo</strong> al tuo corpo (se stai perdendo grasso o mettendo muscoli). Le oscillazioni sono del tutto fisiologiche e dipendono da idratazione, stress o ritenzione. <strong>Se il peso sale o rimane costante, non spaventiamoci!</strong> Fa parte del percorso. Continuiamo ad andare avanti con fiducia e costanza.
                </p>

                <form onSubmit={handlePatientAddHistoryRecord} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end' }}>
                  <div style={{ flex: '1 1 150px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Data</label>
                    <input 
                      type="date"
                      className="form-input"
                      style={{ padding: '0.45rem', fontSize: '0.82rem', width: '100%', height: '38px' }}
                      required
                      value={patientHistoryDate}
                      onChange={(e) => setPatientHistoryDate(e.target.value)}
                    />
                  </div>

                  <div style={{ flex: '1 1 150px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Peso (kg)</label>
                    <input 
                      type="number"
                      step="0.1"
                      className="form-input"
                      style={{ padding: '0.45rem', fontSize: '0.82rem', width: '100%', height: '38px' }}
                      placeholder="Es. 61.2"
                      required
                      value={patientHistoryWeight}
                      onChange={(e) => setPatientHistoryWeight(e.target.value)}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    style={{ 
                      padding: '0.5rem 1.25rem', 
                      borderRadius: '10px', 
                      fontSize: '0.85rem', 
                      height: '38px', 
                      fontWeight: 700,
                      flex: '1 1 150px',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    Salva Peso
                  </button>
                </form>

                {patientWeightMsg && (
                  <div style={{ 
                    marginTop: '0.75rem', 
                    padding: '0.5rem', 
                    borderRadius: '8px', 
                    fontSize: '0.78rem', 
                    fontWeight: 650,
                    textAlign: 'center',
                    background: '#ecfdf5', 
                    color: '#065f46',
                    border: '1px solid #a7f3d0'
                  }}>
                    {patientWeightMsg}
                  </div>
                )}
              </div>

              {/* Grafici di Andamento */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {renderSvgChart(patient?.history || [], 'weight', 'Andamento Peso', '#d63384', ' kg', 2, 2)}
                {renderSvgChart(patient?.history || [], 'fatMass', 'Andamento Massa Grassa', '#f43f5e', '%', 1.5, 1.5)}
                {renderSvgChart(patient?.history || [], 'muscleMass', 'Andamento Massa Muscolare', '#10b981', ' kg', 2, 2)}
              </div>

              {/* Tabella Storico del Paziente */}
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  📋 Registro Rilevazioni Storiche
                </h4>
                {!(patient?.history?.length > 0) ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                    Nessuna misurazione registrata.
                  </p>
                ) : (
                  <div style={{ overflowX: 'auto', border: '1px solid var(--border-soft)', borderRadius: '10px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', background: '#fff', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: 'var(--primary-bg)', borderBottom: '1px solid var(--border-color)', color: 'var(--primary)' }}>
                          <th style={{ padding: '0.5rem 0.75rem', fontWeight: 700 }}>Data</th>
                          <th style={{ padding: '0.5rem 0.75rem', fontWeight: 700 }}>Peso</th>
                          <th style={{ padding: '0.5rem 0.75rem', fontWeight: 700 }}>Massa Grassa</th>
                          <th style={{ padding: '0.5rem 0.75rem', fontWeight: 700 }}>Massa Muscolare</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...patient.history].sort((a,b) => new Date(b.date) - new Date(a.date)).map((r, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                            <td style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>
                              {new Date(r.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </td>
                            <td style={{ padding: '0.5rem 0.75rem' }}>{r.weight} kg</td>
                            <td style={{ padding: '0.5rem 0.75rem', color: '#f43f5e' }}>{r.fatMass}%</td>
                            <td style={{ padding: '0.5rem 0.75rem', color: '#10b981' }}>{r.muscleMass} kg</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {activeSubTab === 'mindful' && (() => {
            const breathingState = (() => {
              if (!isBreathingActive) return { scale: 1, glow: '0 0 15px rgba(214, 51, 132, 0.15)', color: 'rgba(214, 51, 132, 0.15)' };
              const elapsed = breathingDuration - breathingTimeLeft;
              const cycleSeconds = elapsed % 12;
              if (cycleSeconds < 4) {
                // Inhale: scale 1 to 1.6
                const fraction = cycleSeconds / 4;
                const scale = 1 + fraction * 0.6;
                return { 
                  scale, 
                  glow: `0 0 ${15 + fraction * 30}px rgba(214, 51, 132, ${0.15 + fraction * 0.5})`,
                  color: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)' 
                };
              } else if (cycleSeconds < 8) {
                // Hold: scale 1.6
                return { 
                  scale: 1.6, 
                  glow: '0 0 45px rgba(214, 51, 132, 0.65)', 
                  color: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)' 
                };
              } else {
                // Exhale: scale 1.6 to 1
                const fraction = (cycleSeconds - 8) / 4;
                const scale = 1.6 - fraction * 0.6;
                return { 
                  scale, 
                  glow: `0 0 ${45 - fraction * 30}px rgba(214, 51, 132, ${0.65 - fraction * 0.5})`, 
                  color: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)' 
                };
              }
            })();

            return (
              <div style={{ animation: 'modalSlide 0.3s ease', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <style>{`
                  @keyframes breatheInhale {
                    0% { transform: scale(1); box-shadow: 0 0 15px rgba(214, 51, 132, 0.2); }
                    100% { transform: scale(1.6); box-shadow: 0 0 45px rgba(214, 51, 132, 0.65); }
                  }
                  @keyframes breatheHold {
                    0% { transform: scale(1.6); box-shadow: 0 0 45px rgba(214, 51, 132, 0.65); }
                    100% { transform: scale(1.6); box-shadow: 0 0 50px rgba(214, 51, 132, 0.75); }
                  }
                  @keyframes breatheExhale {
                    0% { transform: scale(1.6); box-shadow: 0 0 50px rgba(214, 51, 132, 0.75); }
                    100% { transform: scale(1); box-shadow: 0 0 15px rgba(214, 51, 132, 0.2); }
                  }
                  .trigger-btn {
                    padding: 0.4rem 0.8rem;
                    border-radius: 20px;
                    border: 1.5px solid var(--border-soft);
                    background: #fff;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--text-main);
                    cursor: pointer;
                    transition: all 0.25s ease;
                  }
                  .trigger-btn:hover {
                    border-color: var(--primary-light);
                    background: var(--primary-bg);
                  }
                  .trigger-btn.active {
                    background: var(--primary);
                    color: #fff;
                    border-color: var(--primary);
                  }
                  .mood-btn {
                    padding: 0.65rem;
                    border-radius: 16px;
                    border: 1.5px solid var(--border-soft);
                    background: #fff;
                    font-size: 1.1rem;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.25rem;
                    flex: 1;
                    transition: all 0.25s ease;
                  }
                  .mood-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-sm);
                    border-color: var(--primary-light);
                  }
                  .mood-btn.active {
                    background: var(--primary-bg);
                    border-color: var(--primary);
                    transform: scale(1.05);
                  }
                `}</style>

                {/* CARD 0: PERCORSO 12 SETTIMANE DI SFIDE */}
                <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(214, 51, 132, 0.04) 0%, rgba(139, 92, 246, 0.04) 100%)', border: '1.5px solid var(--border-color)', borderRadius: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)' }}>
                      <Trophy size={22} style={{ color: '#f59e0b' }} />
                      <div>
                        <h3 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 800 }}>Percorso Libera dalle Diete</h3>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Le 12 Settimane di Sfide Consapevoli</p>
                      </div>
                    </div>
                    {/* Settimana Attiva del Programma */}
                    {(() => {
                      const prog = getChallengeProgress();
                      return (
                        <div style={{ 
                          fontSize: '0.72rem', 
                          fontWeight: 700, 
                          color: '#fff', 
                          background: 'linear-gradient(135deg, #f59e0b 0%, var(--primary) 100%)', 
                          padding: '0.3rem 0.75rem', 
                          borderRadius: '20px',
                          boxShadow: 'var(--shadow-sm)'
                        }}>
                          Settimana Attiva: {prog.currentWeek} di 12
                        </div>
                      );
                    })()}
                  </div>

                  {/* Grid orizzontale/scrollabile di tutte le 12 settimane */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '0.5rem', 
                    overflowX: 'auto', 
                    paddingBottom: '0.85rem',
                    marginBottom: '1.25rem',
                    scrollbarWidth: 'thin'
                  }}>
                    {liberaDieteChallenges.map((ch) => {
                      const prog = getChallengeProgress();
                      const isSelected = selectedChallengeWeek === ch.week;
                      const isActive = prog.currentWeek === ch.week;
                      const completedCount = prog.completedDays[ch.week]?.filter(Boolean).length || 0;
                      const isCompleted = completedCount === 7;
                      
                      return (
                        <button
                          key={ch.week}
                          type="button"
                          onClick={() => {
                            setSelectedChallengeWeek(ch.week);
                          }}
                          style={{
                            flexShrink: 0,
                            padding: '0.65rem 0.85rem',
                            borderRadius: '16px',
                            border: isSelected 
                              ? '2px solid var(--primary)' 
                              : isActive 
                                ? '1.5px dashed #f59e0b' 
                                : '1px solid var(--border-soft)',
                            background: isSelected 
                              ? 'var(--primary-bg)' 
                              : '#ffffff',
                            color: 'var(--text-color)',
                            cursor: 'pointer',
                            transition: 'all 0.25s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.2rem',
                            minWidth: '95px',
                            boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                            transform: isSelected ? 'translateY(-2px)' : 'none'
                          }}
                        >
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.8 }}>
                            Sett. {ch.week}
                          </span>
                          <span style={{ fontSize: '1.2rem' }}>{ch.icon}</span>
                          <span style={{ 
                            fontSize: '0.65rem', 
                            fontWeight: 700, 
                            color: isCompleted ? 'var(--success)' : completedCount > 0 ? 'var(--primary)' : 'var(--text-muted)'
                          }}>
                            {isCompleted ? '✓ 7/7' : `${completedCount}/7 gg`}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Dettaglio Settimana Selezionata */}
                  {(() => {
                    const currentCh = liberaDieteChallenges.find(c => c.week === selectedChallengeWeek);
                    const prog = getChallengeProgress();
                    const completedDaysArr = prog.completedDays[selectedChallengeWeek] || [false, false, false, false, false, false, false];
                    const completedCount = completedDaysArr.filter(Boolean).length;
                    const isActive = prog.currentWeek === selectedChallengeWeek;
                    
                    if (!currentCh) return null;
                    
                    const dayLabels = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
                    const dayInitials = ["L", "M", "M", "G", "V", "S", "D"];
                    const activeDayTaskText = currentCh.dailyTasks[selectedChallengeDay] || "";
                    const isActiveDayCompleted = completedDaysArr[selectedChallengeDay];
                    
                    return (
                      <div style={{ 
                        background: '#ffffff', 
                        padding: '1.25rem', 
                        borderRadius: '18px', 
                        border: '1px solid var(--border-soft)',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-color)' }}>
                              Settimana {currentCh.week}: {currentCh.title}
                            </h4>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                              🎯 Focus: {currentCh.focus}
                            </span>
                          </div>
                          {!isActive && (
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem', borderRadius: '12px' }}
                              onClick={() => handleChangeActiveChallengeWeek(currentCh.week)}
                            >
                              Imposta come attiva
                            </button>
                          )}
                        </div>

                        {/* Selettore Giorno (L, M, M, G, V, S, D) */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                            Seleziona il giorno per visualizzare la sfida:
                          </label>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.35rem' }}>
                            {dayInitials.map((day, idx) => {
                              const isChecked = completedDaysArr[idx];
                              const isViewed = selectedChallengeDay === idx;
                              
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setSelectedChallengeDay(idx)}
                                  style={{
                                    flex: 1,
                                    height: '36px',
                                    borderRadius: '12px',
                                    border: isViewed 
                                      ? '2px solid var(--primary)' 
                                      : '1.5px solid var(--border-color)',
                                    background: isChecked 
                                      ? 'rgba(22, 163, 74, 0.08)' 
                                      : isViewed 
                                        ? 'var(--primary-bg)' 
                                        : '#ffffff',
                                    color: isChecked 
                                      ? 'var(--success)' 
                                      : isViewed 
                                        ? 'var(--primary)' 
                                        : 'var(--text-color)',
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                  }}
                                >
                                  {day}
                                  {isChecked && (
                                    <span style={{
                                      position: 'absolute',
                                      bottom: '2px',
                                      width: '4px',
                                      height: '4px',
                                      borderRadius: '50%',
                                      background: 'var(--success)'
                                    }} />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Dettaglio della Sfida del Giorno Selezionato */}
                        <div style={{ 
                          padding: '1rem', 
                          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.04) 0%, rgba(214, 51, 132, 0.04) 100%)', 
                          border: '1.5px solid rgba(245, 158, 11, 0.15)', 
                          borderRadius: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem'
                        }}>
                          <div>
                            <strong style={{ display: 'block', fontSize: '0.78rem', color: '#b45309', marginBottom: '0.15rem' }}>
                              🔥 Sfida di {dayLabels[selectedChallengeDay]}:
                            </strong>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-color)', lineHeight: 1.45, fontWeight: 500 }}>
                              {activeDayTaskText}
                            </p>
                          </div>

                          {/* Bottone per completare la sfida di quel giorno */}
                          <button
                            type="button"
                            onClick={() => handleToggleChallengeDay(currentCh.week, selectedChallengeDay)}
                            style={{
                              alignSelf: 'flex-start',
                              padding: '0.5rem 1rem',
                              borderRadius: '20px',
                              border: 'none',
                              background: isActiveDayCompleted ? 'var(--success)' : 'var(--primary)',
                              color: '#ffffff',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              transition: 'all 0.2s',
                              boxShadow: isActiveDayCompleted ? '0 4px 12px rgba(22, 163, 74, 0.2)' : '0 4px 12px rgba(214, 51, 132, 0.2)'
                            }}
                          >
                            <CheckCircle size={14} />
                            {isActiveDayCompleted ? 'Sfida Completata! ✓' : 'Segna come completata'}
                          </button>
                        </div>

                        {/* Barra di progresso interna per la settimana */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                            <span>Completamento settimana: {completedCount} su 7 sfide</span>
                            <span>{Math.round((completedCount / 7) * 100)}%</span>
                          </div>
                          <div style={{ height: '6px', background: 'var(--primary-bg)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ 
                              height: '100%', 
                              width: `${(completedCount / 7) * 100}%`, 
                              background: 'linear-gradient(90deg, var(--primary-light) 0%, var(--primary) 100%)',
                              borderRadius: '3px',
                              transition: 'width 0.3s ease'
                            }} />
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>



                {/* CARD 1: RESPIRAZIONE PRE-PASTO */}
                <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(214, 51, 132, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', marginBottom: '0.85rem' }}>
                    <Wind size={20} />
                    <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>Respirazione Consapevole Pre-Pasto</h3>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: '0 0 1.25rem 0' }}>
                    Dedica 1 o 2 minuti a respirare consapevolmente prima di iniziare a mangiare. Ti aiuterà a rilassare la mente, ridurre lo stress e sintonizzarti con i segnali naturali di fame e sazietà del tuo corpo.
                  </p>

                  {isBreathingActive ? (
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      padding: '2.5rem 1rem',
                      gap: '2.5rem'
                    }}>
                      {/* Visualizer del Cerchio */}
                      <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        textAlign: 'center',
                        padding: '1rem',
                        lineHeight: 1.3,
                        transform: `scale(${breathingState.scale})`,
                        boxShadow: breathingState.glow,
                        background: breathingState.color,
                        transition: 'transform 1s linear, box-shadow 1s ease-in-out',
                        userSelect: 'none'
                      }}>
                        🧘‍♀️
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                          {breathingPhase}
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          Tempo rimasto: {Math.floor(breathingTimeLeft / 60)}:{(breathingTimeLeft % 60).toString().padStart(2, '0')}
                        </p>
                      </div>

                      <button 
                        type="button" 
                        className="btn btn-outline"
                        style={{ padding: '0.5rem 1.25rem', borderRadius: '20px', fontSize: '0.8rem' }}
                        onClick={handleStopBreathing}
                      >
                        Termina Esercizio
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyStyle: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.5rem 1rem', borderRadius: '20px' }}
                          onClick={() => handleStartBreathing(60)}
                        >
                          ⏱️ Avvia 1 Minuto
                        </button>
                        <button 
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.5rem 1rem', borderRadius: '20px' }}
                          onClick={() => handleStartBreathing(120)}
                        >
                          ⏱️ Avvia 2 Minuti
                        </button>
                      </div>
                      {breathingPhase.includes("Completato") && (
                        <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <CheckCircle size={14} /> Fatto! Sei pronto per gustare il pasto.
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* CARD 2: DIARIO MINDFUL (FAME / SAZIETA / EMOTIVA) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                  <style>{`
                    @media (min-width: 768px) {
                      .mindful-grid { grid-template-columns: 1.1fr 0.9fr !important; }
                    }
                  `}</style>
                  <div className="mindful-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                    
                    {/* Form di inserimento Log */}
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', marginBottom: '1.25rem' }}>
                        <Brain size={20} />
                        <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>Check-in Fame e Sazietà</h3>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Selezione Pasto */}
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.35rem' }}>Pasto Corrente</label>
                          <select 
                            className="form-input" 
                            style={{ padding: '0.5rem', fontSize: '0.85rem', borderRadius: '10px' }}
                            value={mindfulMeal}
                            onChange={(e) => setMindfulMeal(e.target.value)}
                          >
                            <option value="Colazione">🍳 Colazione</option>
                            <option value="Spuntino Mattina">🍏 Spuntino Mattina</option>
                            <option value="Pranzo">🥗 Pranzo</option>
                            <option value="Spuntino Pomeriggio">🥜 Spuntino Pomeriggio</option>
                            <option value="Cena">🍲 Cena</option>
                          </select>
                        </div>

                        {/* Slider Fame Prima di Mangiare */}
                        <div className="form-group" style={{ margin: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                            <label className="form-label" style={{ fontSize: '0.8rem', margin: 0 }}>Fame Pre-Pasto</label>
                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', background: 'var(--primary-bg)', padding: '0.1rem 0.5rem', borderRadius: '8px' }}>
                              {mindfulHungerBefore} / 10
                            </span>
                          </div>
                          <input 
                            type="range" 
                            min={1} 
                            max={10} 
                            className="form-range"
                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                            value={mindfulHungerBefore}
                            onChange={(e) => setMindfulHungerBefore(e.target.value)}
                          />
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                            <span>Nessuna fame (1)</span>
                            <span>Fame estrema (10)</span>
                          </div>
                        </div>

                        {/* Slider Sazietà Dopo il Pasto */}
                        <div className="form-group" style={{ margin: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                            <label className="form-label" style={{ fontSize: '0.8rem', margin: 0 }}>Sazietà Post-Pasto</label>
                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', background: 'var(--primary-bg)', padding: '0.1rem 0.5rem', borderRadius: '8px' }}>
                              {mindfulSatietyAfter} / 10
                            </span>
                          </div>
                          <input 
                            type="range" 
                            min={1} 
                            max={10} 
                            className="form-range"
                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                            value={mindfulSatietyAfter}
                            onChange={(e) => setMindfulSatietyAfter(e.target.value)}
                          />
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                            <span>Ancora fame (1)</span>
                            <span>Pieno/Sazio (10)</span>
                          </div>
                        </div>

                        {/* Tipo di Fame */}
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.35rem' }}>Natura della tua Fame</label>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              type="button"
                              className={`btn btn-sm ${mindfulHungerType === 'Fisica' ? 'btn-primary' : 'btn-outline'}`}
                              style={{ flex: 1, padding: '0.5rem', borderRadius: '10px', fontSize: '0.8rem' }}
                              onClick={() => setMindfulHungerType('Fisica')}
                            >
                              🍏 Fame Fisica
                            </button>
                            <button 
                              type="button"
                              className={`btn btn-sm ${mindfulHungerType === 'Emotiva' ? 'btn-primary' : 'btn-outline'}`}
                              style={{ flex: 1, padding: '0.5rem', borderRadius: '10px', fontSize: '0.8rem' }}
                              onClick={() => setMindfulHungerType('Emotiva')}
                            >
                              🧠 Fame Emotiva
                            </button>
                          </div>
                          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem', lineHeight: 1.35 }}>
                            {mindfulHungerType === 'Fisica' 
                              ? "La fame fisica si sviluppa gradualmente, si fa sentire nello stomaco ed è soddisfatta da qualsiasi cibo."
                              : "La fame emotiva insorge all'improvviso, richiede cibi specifici (comfort food) ed è legata a stati d'animo."
                            }
                          </p>
                        </div>

                        {/* Trigger Emotivi (Se fame emotiva) */}
                        {mindfulHungerType === 'Emotiva' && (
                          <div className="form-group" style={{ margin: 0, animation: 'modalSlide 0.2s ease' }}>
                            <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.4rem' }}>Cosa ha innescato questa fame?</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                              {["Stress ⚡", "Noia 🥱", "Tristezza 😢", "Ansia 😰", "Stanchezza 🔋", "Rabbia 😡", "Solitudine 👥"].map((trig) => (
                                <button 
                                  key={trig}
                                  type="button"
                                  className={`trigger-btn ${mindfulTrigger === trig ? 'active' : ''}`}
                                  onClick={() => setMindfulTrigger(trig)}
                                >
                                  {trig}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Note Mindful */}
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.35rem' }}>Riflessioni o Sensazioni</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Come hai mangiato? Velocemente? Con distrazioni? Sensazioni..."
                            style={{ padding: '0.55rem', fontSize: '0.8rem', borderRadius: '10px' }}
                            value={mindfulNotes}
                            onChange={(e) => setMindfulNotes(e.target.value)}
                          />
                        </div>

                        {mindfulSuccessMsg && (
                          <div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 700, textAlign: 'center' }}>
                            ✓ {mindfulSuccessMsg}
                          </div>
                        )}

                        <button 
                          type="button" 
                          className="btn btn-primary"
                          style={{ padding: '0.65rem', borderRadius: '12px', fontSize: '0.85rem', width: '100%', marginTop: '0.25rem' }}
                          onClick={handleSaveMindfulLog}
                        >
                          Registra Check-in Mindful
                        </button>
                      </div>
                    </div>

                    {/* Storico Check-in Mindful */}
                    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <h3 style={{ fontSize: '1rem', margin: '0 0 1rem 0', fontWeight: 700, color: 'var(--text-color)' }}>
                        📜 Storico Check-in Consapevoli
                      </h3>

                      <div style={{ 
                        flex: 1, 
                        overflowY: 'auto', 
                        maxHeight: '380px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '0.75rem',
                        paddingRight: '4px'
                      }}>
                        {!(patient.mindfulLogs?.length > 0) ? (
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 'auto 0', textAlign: 'center' }}>
                            Nessun check-in salvato. Inizia a registrare il tuo livello di fame e sazietà per i pasti di oggi!
                          </p>
                        ) : (
                          patient.mindfulLogs.map((log) => (
                            <div 
                              key={log.id} 
                              style={{ 
                                padding: '0.85rem', 
                                borderRadius: '12px', 
                                background: '#fff', 
                                border: '1px solid var(--border-soft)',
                                boxShadow: 'var(--shadow-sm)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.45rem'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                                  {log.meal}
                                </span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                  <Calendar size={12} style={{ color: 'var(--text-muted)' }} />
                                  <span>{new Date(log.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })}</span>
                                  <Clock size={12} style={{ color: 'var(--text-muted)', marginLeft: '0.3rem' }} />
                                  <span>{log.time}</span>
                                </span>
                              </div>

                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', fontSize: '0.75rem' }}>
                                <span style={{ padding: '0.15rem 0.45rem', borderRadius: '6px', background: 'rgba(214, 51, 132, 0.08)', color: 'var(--primary)', fontWeight: 600 }}>
                                  Fame: {log.hungerBefore}/10
                                </span>
                                <span style={{ padding: '0.15rem 0.45rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.08)', color: '#10b981', fontWeight: 600 }}>
                                  Sazietà: {log.satietyAfter}/10
                                </span>
                                <span style={{ 
                                  padding: '0.15rem 0.45rem', 
                                  borderRadius: '6px', 
                                  background: log.hungerType === 'Emotiva' ? 'rgba(220, 38, 38, 0.08)' : 'rgba(59, 130, 246, 0.08)', 
                                  color: log.hungerType === 'Emotiva' ? 'var(--danger)' : '#3b82f6', 
                                  fontWeight: 700 
                                }}>
                                  Fame {log.hungerType}
                                </span>
                                {log.trigger && (
                                  <span style={{ padding: '0.15rem 0.45rem', borderRadius: '6px', background: 'rgba(220, 38, 38, 0.15)', color: 'var(--danger)', fontWeight: 700 }}>
                                    Innesco: {log.trigger}
                                  </span>
                                )}
                              </div>

                              {log.notes && (
                                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-main)', fontStyle: 'italic', background: '#f8fafc', padding: '0.4rem', borderRadius: '6px' }}>
                                  "{log.notes}"
                                </p>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* CARD 3: REPORT SETTIMANALE ("COM'E ANDATA?") */}
                <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.04) 0%, rgba(214, 51, 132, 0.04) 100%)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', marginBottom: '0.85rem' }}>
                    <Smile size={20} />
                    <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>Com'è andata la settimana? (Aggiorna la Dottoressa)</h3>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: '0 0 1.25rem 0' }}>
                    A fine settimana, scrivi un breve resoconto per la Dott.ssa Ciervo Cinzia. Raccontale com'è andato il tuo percorso, come ti sei sentita/o, i tuoi successi o se hai riscontrato delle fatiche. Vedrà il tuo messaggio direttamente nella sua Dashboard!
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Selezione Mood / Stato d'animo */}
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>Come valuti la tua settimana?</label>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {[
                          { val: "Difficile", label: "😢 Difficile" },
                          { val: "Neutro", label: "😐 Neutro" },
                          { val: "Buono", label: "😊 Buono" },
                          { val: "Ottimo", label: "😁 Ottimo" }
                        ].map((item) => (
                          <button
                            key={item.val}
                            type="button"
                            className={`mood-btn ${weeklyMood === item.val ? 'active' : ''}`}
                            onClick={() => setWeeklyMood(item.val)}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Campo feedback testuale */}
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.35rem' }}>I tuoi commenti, fatiche o traguardi</label>
                      <textarea
                        rows={3}
                        className="form-input"
                        style={{ padding: '0.6rem', fontSize: '0.82rem', borderRadius: '12px', resize: 'vertical' }}
                        placeholder="Condividi le tue riflessioni... es: Ho gestito bene la fame di pomeriggio e ho adorato le bruschette con Asiago! Ho fatto un po' fatica a bere acqua a sufficienza..."
                        value={weeklyFeedback}
                        onChange={(e) => setWeeklyFeedback(e.target.value)}
                      />
                    </div>

                    {weeklySuccessMsg && (
                      <div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 700, textAlign: 'center' }}>
                        ✓ {weeklySuccessMsg}
                      </div>
                    )}

                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: '0.65rem 1.5rem', borderRadius: '24px', fontSize: '0.85rem', display: 'flex', alignSelf: 'flex-end', gap: '0.4rem' }}
                      disabled={!weeklyMood || !weeklyFeedback}
                      onClick={handleSaveWeeklyReport}
                    >
                      <Send size={14} /> Invia Report alla Dottoressa
                  </button>
                  </div>

                  {/* Storico Report Settimanali */}
                  {patient.weeklyReports?.length > 0 && (
                    <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px dashed var(--border-soft)' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-color)', marginBottom: '0.65rem' }}>
                        ⏳ Report Settimanali Precedenti
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {patient.weeklyReports.map((rep) => (
                          <div 
                            key={rep.id} 
                            style={{ 
                              padding: '0.75rem', 
                              borderRadius: '10px', 
                              background: '#ffffff', 
                              border: '1px solid var(--border-soft)',
                              fontSize: '0.78rem' 
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontWeight: 700 }}>
                              <span style={{ color: 'var(--primary)' }}>
                                Valutazione: {rep.mood === "Difficile" ? "😢 Difficile" : rep.mood === "Neutro" ? "😐 Neutro" : rep.mood === "Buono" ? "😊 Buono" : "😁 Ottimo"}
                              </span>
                              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                                Inviato il {new Date(rep.date).toLocaleDateString('it-IT')}
                              </span>
                            </div>
                            <p style={{ margin: 0, color: 'var(--text-main)', fontStyle: 'italic' }}>
                              "{rep.feedback}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })()}

          {activeSubTab === 'chatDoc' && (
            <div className="glass-card" style={{ padding: '2rem', animation: 'modalSlide 0.3s ease', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Header della Chat */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <Send size={22} style={{ transform: 'rotate(-20deg)', color: 'var(--primary-light)' }} />
                <div>
                  <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Messaggi con la Dottoressa</h3>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Parla direttamente con la Dott.ssa Ciervo Cinzia per dubbi, sostituzioni o supporto.
                  </p>
                </div>
              </div>

              {/* Nota Orari Dottoressa */}
              <div style={{ 
                padding: '0.85rem 1.15rem', 
                background: 'rgba(214, 51, 132, 0.05)', 
                border: '1.5px solid rgba(214, 51, 132, 0.15)', 
                borderRadius: '16px',
                fontSize: '0.82rem',
                color: 'var(--text-color)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
                lineHeight: 1.5,
                boxShadow: 'var(--shadow-sm)'
              }}>
                <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>🕒</span>
                <span>
                  <strong>Orari Dottoressa:</strong> lun-ven dalle <strong>9:00 alle 12:00</strong> e dalle <strong>14:00 alle 18:00</strong> (salvo visite in corso). La risposta potrebbe non essere immediata, ma riceverai riscontro il prima possibile!
                </span>
              </div>

              {/* Area dei messaggi */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid var(--border-soft)',
                borderRadius: '16px',
                padding: '1rem',
                minHeight: '300px',
                maxHeight: '420px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}>
                {!(patient.messages?.length > 0) ? (
                  <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '2rem' }}>
                    <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>💬 Nessun messaggio</p>
                    <p style={{ margin: 0, fontSize: '0.78rem' }}>Scrivi il tuo primo messaggio qui sotto per contattare la dottoressa!</p>
                  </div>
                ) : (
                  patient.messages.map((msg, idx) => (
                    <div 
                      key={msg.id || idx} 
                      style={{ 
                        alignSelf: msg.sender === 'patient' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.15rem'
                      }}
                    >
                      <div style={{ 
                        padding: '0.7rem 0.95rem', 
                        borderRadius: msg.sender === 'patient' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background: msg.sender === 'patient' ? 'var(--primary)' : '#ffffff',
                        color: msg.sender === 'patient' ? '#ffffff' : 'var(--text-color)',
                        border: msg.sender === 'patient' ? 'none' : '1px solid var(--border-soft)',
                        fontSize: '0.85rem',
                        lineHeight: 1.4,
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        {msg.text}
                      </div>
                      <span style={{ 
                        fontSize: '0.62rem', 
                        color: 'var(--text-muted)', 
                        alignSelf: msg.sender === 'patient' ? 'flex-end' : 'flex-start',
                        padding: '0 0.2rem'
                      }}>
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Input Form per inviare messaggio */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <input 
                  type="text"
                  className="form-input"
                  style={{ flex: 1, borderRadius: '24px', paddingLeft: '1.25rem', fontSize: '0.85rem' }}
                  placeholder="Scrivi una domanda o un dubbio alla dottoressa..."
                  value={patientChatInput}
                  onChange={(e) => setPatientChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendPatientMessage();
                    }
                  }}
                />
                <button 
                  className="btn btn-primary"
                  style={{ flexShrink: 0, minWidth: '42px', borderRadius: '50%', width: '42px', height: '42px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={handleSendPatientMessage}
                >
                  <Send size={16} />
                </button>
              </div>

            </div>
          )}

          {activeSubTab === 'ai' && (
            <div className="glass-card" style={{ padding: '2rem', animation: 'modalSlide 0.3s ease' }}>
              
              {/* Header Assistente AI con Configurazione */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                  <Sparkles size={22} style={{ color: 'var(--primary-light)' }} />
                  <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Chef Assistente AI</h3>
                </div>
              </div>

              {/* Barra Riepilogo Ingredienti Attivi */}
              <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--primary-bg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                    <ChefHat size={20} />
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Ingredienti Selezionati nel Piatto ({activeDayInfo ? activeDayInfo.dateStr : activeDay})</h3>
                  </div>
                  
                  {/* Toggle Checkbox per includere/escludere piatto */}
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 650, color: 'var(--primary)', cursor: 'pointer', userSelect: 'none' }}>
                    <input 
                      type="checkbox" 
                      style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                      checked={usePlateIngredients}
                      onChange={(e) => setUsePlateIngredients(e.target.checked)}
                    />
                    Usa ingredienti del piatto
                  </label>
                </div>
                
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  {usePlateIngredients 
                    ? "L'assistente utilizzerà questi ingredienti per consigliarti ricette bilanciate. Modificali nella scheda 'Diario Alimentare'."
                    : "Modalità Scrittura Libera attiva: l'AI risponderà basandosi solo su quello che scriverai direttamente nella chat."}
                </p>
                
                <div 
                  style={{ 
                    display: 'flex', 
                    gap: '0.5rem', 
                    flexWrap: 'wrap', 
                    marginTop: '0.25rem',
                    transition: 'all 0.3s ease',
                    opacity: usePlateIngredients ? 1 : 0.45,
                    filter: usePlateIngredients ? 'none' : 'grayscale(1) contrast(0.8)'
                  }}
                >
                  <span style={{ padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 750, background: 'var(--color-carb-bg)', color: '#b45309' }}>
                    🌾 Carb: {activeCarb ? `${activeCarb.food} (${activeCarb.quantity || ''})` : 'Nessuno'}
                  </span>
                  <span style={{ padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 750, background: 'var(--color-prot-bg)', color: '#1d4ed8' }}>
                    🍗 Prot: {activeProt ? `${activeProt.food} (${activeProt.quantity || ''})` : 'Nessuno'}
                  </span>
                  <span style={{ padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 750, background: 'var(--color-veg-bg)', color: '#047857' }}>
                    🥦 Verd: {activeVeg ? `${activeVeg.food} (${activeVeg.quantity || ''})` : 'Nessuno'}
                  </span>
                  <span style={{ padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 750, background: 'var(--color-fat-bg)', color: '#be185d' }}>
                    🥑 Gras: {activeFat ? `${activeFat.food} (${activeFat.quantity || ''})` : 'Nessuno'}
                  </span>
                </div>
              </div>

              {/* Chat Container */}
              <div className="chat-container" style={{ height: '550px' }}>
                <div className="chat-messages" style={{ display: 'flex', flexDirection: 'column' }}>
                  {chatMessages.length <= 1 ? (
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flex: 1, 
                      padding: '1.5rem 0',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'var(--primary-bg)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                        fontSize: '1.5rem',
                        border: '2px solid var(--primary-light)',
                        animation: 'heartbeat 1.5s infinite'
                      }}>
                        ✨
                      </div>
                      
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.2rem' }}>
                        Ciao {patient.name}!
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '300px', lineHeight: 1.4 }}>
                        Sono il tuo assistente. Come posso aiutarti a raggiungere i tuoi obiettivi oggi?
                      </p>

                      {/* Lista di suggerimenti verticali (mockup style) */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%', maxWidth: '340px' }}>
                        <button
                          type="button"
                          className="option-item"
                          style={{
                            padding: '0.7rem 1rem',
                            borderRadius: '16px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            border: '1.5px solid var(--border-soft)',
                            justifyContent: 'center',
                            textAlign: 'center',
                            background: '#ffffff',
                            color: 'var(--text-main)',
                            boxShadow: 'var(--shadow-sm)'
                          }}
                          onClick={() => handleSendChatMessage("Consigliami una ricetta super veloce, sana e bilanciata")}
                        >
                          ⚡ Idee per una ricetta super veloce
                        </button>

                        <button
                          type="button"
                          className="option-item"
                          style={{
                            padding: '0.7rem 1rem',
                            borderRadius: '16px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            border: '1.5px solid var(--border-soft)',
                            justifyContent: 'center',
                            textAlign: 'center',
                            background: '#ffffff',
                            color: 'var(--text-main)',
                            boxShadow: 'var(--shadow-sm)'
                          }}
                          onClick={() => handleSendChatMessage("Ho terminato un ingrediente della mia dieta, come posso sostituirlo?")}
                        >
                          🔄 Sostituire un ingrediente che mi manca
                        </button>

                        <button
                          type="button"
                          className="option-item"
                          style={{
                            padding: '0.7rem 1rem',
                            borderRadius: '16px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            border: '1.5px solid var(--border-soft)',
                            justifyContent: 'center',
                            textAlign: 'center',
                            background: '#ffffff',
                            color: 'var(--text-main)',
                            boxShadow: 'var(--shadow-sm)'
                          }}
                          onClick={() => handleSendChatMessage("Cosa posso scegliere dal menu se stasera mangio fuori al ristorante?")}
                        >
                          🍽️ Consigli per gestire un pasto fuori casa
                        </button>

                        <button
                          type="button"
                          className="option-item"
                          style={{
                            padding: '0.7rem 1rem',
                            borderRadius: '16px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            border: '1.5px solid var(--border-soft)',
                            justifyContent: 'center',
                            textAlign: 'center',
                            background: '#ffffff',
                            color: 'var(--text-main)',
                            boxShadow: 'var(--shadow-sm)'
                          }}
                          onClick={() => handleSendChatMessage("Sto facendo fatica a seguire la dieta in questi giorni, mi dai qualche trucco per rimanere motivato?")}
                        >
                          💪 Trucchi per non perdere la motivazione
                        </button>

                        <button
                          type="button"
                          className="option-item"
                          style={{
                            padding: '0.7rem 1rem',
                            borderRadius: '16px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            border: '1.5px solid var(--border-soft)',
                            justifyContent: 'center',
                            textAlign: 'center',
                            background: '#ffffff',
                            color: 'var(--text-main)',
                            boxShadow: 'var(--shadow-sm)'
                          }}
                          onClick={() => handleSendChatMessage("Ti descrivo il pasto che ho preparato: puoi dirmi se è ben bilanciato o cosa dovrei aggiungere?")}
                        >
                          ⚖️ Aiutami a bilanciare un mio piatto
                        </button>

                        <button
                          type="button"
                          className="option-item"
                          style={{
                            padding: '0.7rem 1rem',
                            borderRadius: '16px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            border: '1.5px solid var(--border-soft)',
                            justifyContent: 'center',
                            textAlign: 'center',
                            background: '#ffffff',
                            color: 'var(--text-main)',
                            boxShadow: 'var(--shadow-sm)'
                          }}
                          onClick={() => {
                            setUsePlateIngredients(false);
                            setChatInput("In frigo ho questi ingredienti: ");
                          }}
                        >
                          🧊 Ricetta svuotafrigo con ciò che ho
                        </button>
                      </div>
                    </div>
                  ) : (
                    chatMessages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`chat-bubble ${msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}
                      >
                        {renderFormattedText(msg.text)}
                        {msg.isError && msg.userQuery && (
                          <button 
                            className="btn btn-secondary btn-sm"
                            style={{ marginTop: '0.75rem', width: '100%', fontSize: '0.78rem', padding: '0.4rem', gap: '0.25rem', borderRadius: '6px' }}
                            onClick={() => handleFallbackLocalResponse(msg.userQuery)}
                          >
                            🍳 Usa il Ricettario Locale (Offline)
                          </button>
                        )}
                        <div style={{ 
                          fontSize: '0.65rem', 
                          opacity: 0.6, 
                          marginTop: '0.5rem', 
                          textAlign: msg.sender === 'user' ? 'right' : 'left' 
                        }}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  )}
                  
                  {isAiTyping && (
                    <div className="chat-bubble chat-bubble-ai" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.75rem 1rem' }}>
                      <span className="loader-spinner" style={{ width: '14px', height: '14px', borderWidth: '2px', borderLeftColor: 'var(--primary)' }} />
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Lo Chef sta pensando...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chips di suggerimento rapido */}
                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem', 
                  padding: '0.75rem 1.5rem 0.25rem 1.5rem', 
                  overflowX: 'auto', 
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderTop: '1px solid var(--border-color)',
                  whiteSpace: 'nowrap'
                }}>
                  <button 
                    className="chat-suggestion-chip"
                    onClick={() => handleSendChatMessage("Cosa posso preparare con gli ingredienti di oggi?")}
                  >
                    💡 Cosa posso cucinare oggi?
                  </button>
                  <button 
                    className="chat-suggestion-chip"
                    onClick={() => handleSendChatMessage("Consigliami una ricetta super veloce, sana e bilanciata")}
                  >
                    ⚡ Ricetta veloce
                  </button>
                  <button 
                    className="chat-suggestion-chip"
                    onClick={() => handleSendChatMessage("Ho terminato un ingrediente della mia dieta, come posso sostituirlo?")}
                  >
                    🔄 Sostituisci ingrediente
                  </button>
                  <button 
                    className="chat-suggestion-chip"
                    onClick={() => handleSendChatMessage("Cosa posso scegliere dal menu se stasera mangio fuori al ristorante?")}
                  >
                    🍽️ Pasto fuori casa
                  </button>
                  <button 
                    className="chat-suggestion-chip"
                    onClick={() => handleSendChatMessage("Ti descrivo il pasto che ho preparato: puoi dirmi se è ben bilanciato o cosa dovrei aggiungere?")}
                  >
                    ⚖️ Bilancia piatto
                  </button>
                  <button 
                    className="chat-suggestion-chip"
                    onClick={() => {
                      setUsePlateIngredients(false);
                      setChatInput("In frigo ho questi ingredienti: ");
                    }}
                  >
                    🧊 Ricetta svuotafrigo
                  </button>
                  <button 
                    className="chat-suggestion-chip"
                    onClick={() => handleSendChatMessage("Consigliami delle ricette sane per la colazione")}
                  >
                    🍳 Idee per colazione
                  </button>
                  <button 
                    className="chat-suggestion-chip"
                    onClick={() => handleSendChatMessage("Suggerisci idee sfiziose per gli spuntini")}
                  >
                    🍏 Spuntini sazianti
                  </button>
                  <button 
                    className="chat-suggestion-chip"
                    onClick={() => handleSendChatMessage("Come posso preparare le mie verdure al forno?")}
                  >
                    🥦 Verdure croccanti
                  </button>
                  <button 
                    className="chat-suggestion-chip"
                    onClick={() => handleSendChatMessage("Sto facendo fatica a seguire la dieta in questi giorni, mi dai qualche trucco per rimanere motivato?")}
                  >
                    💪 Trucchi motivazione
                  </button>
                </div>

                {/* Input Bar */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ flex: 1, borderRadius: '24px', paddingLeft: '1.25rem' }}
                    placeholder={chatCountToday >= 10 ? "Limite giornaliero (10/10)" : "Chiedi ricette o varianti..."} 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendChatMessage(chatInput);
                      }
                    }}
                  />
                  <button 
                    className="btn btn-primary" 
                    style={{ flexShrink: 0, minWidth: '42px', borderRadius: '50%', width: '42px', height: '42px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => handleSendChatMessage(chatInput)}
                  >
                    <Send size={16} />
                  </button>
                </div>

                {/* Indicatore del limite giornaliero */}
                <div style={{
                  padding: '0.45rem 1.5rem',
                  background: 'var(--primary-bg)',
                  borderTop: '1px solid var(--border-soft)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  fontWeight: 500
                }}>
                  <span>💬 Limite giornaliero domande Chef AI</span>
                  <span style={{ 
                    fontWeight: 700, 
                    color: chatCountToday >= 10 ? 'var(--danger)' : 'var(--primary)',
                    background: chatCountToday >= 10 ? 'rgba(220, 38, 38, 0.1)' : 'rgba(214, 51, 132, 0.1)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '10px'
                  }}>
                    {chatCountToday}/10 utilizzate
                  </span>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* MODALE DI SOSTITUZIONE INTERATTIVA */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--primary)' }}>{modalConfig.title}</h3>
              <button 
                className="btn btn-outline btn-sm" 
                style={{ padding: '0.2rem 0.5rem', borderRadius: '4px' }}
                onClick={() => setModalOpen(false)}
              >
                Chiudi
              </button>
            </div>
            
            <div className="option-list">
              {modalConfig.options.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', padding: '1rem 0', textAlign: 'center' }}>
                  Nessuna alternativa disponibile per questa categoria nel PDF caricato.
                </p>
              ) : (
                modalConfig.options.map((option) => {
                  const isSelected = option.id === modalConfig.selectedValueId;
                  const isTextType = modalConfig.type === 'colazione' || modalConfig.type === 'spuntinoMattina' || modalConfig.type === 'spuntinoPomeriggio';
                  
                  return (
                    <div 
                      key={option.id}
                      className={`option-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectAlternative(option.id)}
                    >
                      <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                        {isTextType ? (
                          <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{option.content}</span>
                        ) : (
                          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{option.food}</span>
                            <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 'bold' }}>{option.quantity}</span>
                          </div>
                        )}
                      </div>
                      <ChevronRight size={16} style={{ color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }} />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      {patient && (
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#ffffff',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
          display: 'flex',
          justifyContent: 'space-around',
          padding: '0.8rem 0.5rem',
          paddingBottom: 'max(0.8rem, env(safe-area-inset-bottom))',
          zIndex: 1000,
          borderTop: '1px solid var(--border-color)',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px'
        }}>
          <button onClick={() => setActiveSubTab('diario')} style={{ all: 'unset', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: activeSubTab === 'diario' ? 'var(--primary)' : 'var(--text-muted)' }}>
            <Calendar size={22} strokeWidth={activeSubTab === 'diario' ? 2.5 : 2} />
            <span style={{ fontSize: '0.7rem', fontWeight: activeSubTab === 'diario' ? 700 : 500 }}>Piatto</span>
          </button>
          <button onClick={() => setActiveSubTab('ai')} style={{ all: 'unset', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: activeSubTab === 'ai' ? 'var(--primary)' : 'var(--text-muted)' }}>
            <Sparkles size={22} strokeWidth={activeSubTab === 'ai' ? 2.5 : 2} />
            <span style={{ fontSize: '0.7rem', fontWeight: activeSubTab === 'ai' ? 700 : 500 }}>Chat AI</span>
          </button>
          <button onClick={() => setActiveSubTab('progressi')} style={{ all: 'unset', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: activeSubTab === 'progressi' ? 'var(--primary)' : 'var(--text-muted)' }}>
            <Activity size={22} strokeWidth={activeSubTab === 'progressi' ? 2.5 : 2} />
            <span style={{ fontSize: '0.7rem', fontWeight: activeSubTab === 'progressi' ? 700 : 500 }}>Diario</span>
          </button>
          <button onClick={() => setActiveSubTab('mindful')} style={{ all: 'unset', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: activeSubTab === 'mindful' ? 'var(--primary)' : 'var(--text-muted)' }}>
            <Heart size={22} strokeWidth={activeSubTab === 'mindful' ? 2.5 : 2} />
            <span style={{ fontSize: '0.7rem', fontWeight: activeSubTab === 'mindful' ? 700 : 500 }}>Sfide</span>
          </button>
        </nav>
      )}

    </div>
  );
}

// Generatore di risposte AI simulate basate su parole chiave ed ingredienti selezionati
const generateAIResponse = (userMessage, selectedIngredients, usePlateIngredients = true, patient = null) => {
  void patient;
  const { carb, prot, veg, fat } = selectedIngredients;
  const message = userMessage.toLowerCase();

  // Helper per calcolare e mostrare il budget BIA per il pasto richiesto
  const getBiaBudgetHeader = (mealType) => {
    void mealType;
    return '';
  };

  // Se l'utente chiede cosa fare con gli ingredienti di oggi ma la spunta è disabilitata
  if (!usePlateIngredients && (message.includes('questi ingredienti') || message.includes('ingredienti di oggi') || message.includes('ricetta con gli ingredienti') || message.includes('cucinare oggi') || message.includes('cosa posso fare con'))) {
    return `Hai disattivato l'opzione **Usa ingredienti del piatto** in alto. 
Per favore, scrivi direttamente nel messaggio quali ingredienti desideri utilizzare! 

Ad esempio, puoi chiedermi: *"Consigliami una ricetta con pollo e zucchine"* o *"Cosa posso preparare con uova e pane?"*`;
  }

  // Se l'utente chiede cosa fare con gli ingredienti di oggi o simili
  if (message.includes('questi ingredienti') || message.includes('ingredienti di oggi') || message.includes('ricetta con gli ingredienti') || message.includes('cucinare oggi') || message.includes('cosa posso fare con')) {
    if (!carb && !prot && !veg && !fat) {
      return "Non hai ancora selezionato degli ingredienti per oggi sul tuo piatto! Vai nella scheda **Diario Alimentare & Piatto** e seleziona i cibi del tuo pranzo o cena.";
    }

    const carbName = carb?.food || '';
    const protName = prot?.food || '';
    const vegName = veg?.food || '';
    const fatName = fat?.food || '';

    // Crea un titolo dinamico per la ricetta
    let title = "Piatto Sano Bilanciato";
    if (carbName && protName) {
      title = `${protName} con ${carbName}`;
    } else if (protName) {
      title = `${protName} saporito`;
    } else if (carbName) {
      title = `${carbName} sfizioso`;
    }

    let ingredientsList = [];
    if (carbName) ingredientsList.push(`- **${carbName}** (${carb.quantity || 'porzione da dieta'})`);
    if (protName) ingredientsList.push(`- **${protName}** (${prot.quantity || 'porzione da dieta'})`);
    if (vegName) ingredientsList.push(`- **${vegName}** (${veg.quantity || 'a volontà'})`);
    if (fatName) ingredientsList.push(`- **${fatName}** (${fat.quantity || 'da dieta'})`);

    return `Ecco una ricetta sana, gustosa e velocissima che puoi preparare con gli ingredienti selezionati per oggi:

### 🍳 ${title} al Profumo di Erbe

**Ingredienti:**
${ingredientsList.join('\n')}
- Spezie a piacere (origano, pepe nero, curcuma o rosmarino)
- Un pizzico di sale marino

**Preparazione:**
1. **Cottura del Carboidrato**: ${carbName ? `Cuoci il/la *${carbName}* seguendo i tempi indicati (se riso o pasta, scolalo al dente). Se hai scelto del pane, tostalo leggermente in padella o tostapane per renderlo croccante.` : "Prepara la tua quota di carboidrati come indicato nel piano (es. pane o patate)."}
2. **Cottura della Proteina**: ${protName ? `Cuoci il/la *${protName}*. Se è carne o pesce, scottalo alla piastra o cuocilo al forno con aromi freschi (salvia, timo). Se sono uova, puoi farle in camicia, sode o strapazzate in un padellino antiaderente.` : "Cuoci la tua fonte proteica preferita in modo semplice, insaporendo con spezie a piacere."}
3. **Preparazione delle Verdure**: ${vegName ? `Lava e prepara il/la *${vegName}*. Puoi saltarli in padella con poca acqua e spezie, oppure gustarli freschi e crudi a mo' di insalata croccante.` : "Accompagna con verdure fresche di stagione a piacere."}
4. **Composizione del piatto**: Disponi la verdura cotta o cruda su metà del piatto, la fonte proteica su un quarto e il carboidrato sull'altro quarto.
5. **Condimento (I Grassi)**: Condisci a crudo il tutto con il/la *${fatName || "Olio Extravergine d'Oliva"}* per esaltare i sapori e assicurare l'apporto di grassi sani.

*Buon appetito! Questo piatto rispetta perfettamente le proporzioni del Piatto Sano di Harvard, garantendoti sazietà ed energia.*`;
  }

  // Intercettazione pasti per visualizzazione calorie e ricette
  if (message.includes('colazione') || message.includes('colazioni')) {
    const budgetHeader = getBiaBudgetHeader('colazione');
    return `${budgetHeader ? budgetHeader + '\n' : ''}Ecco tre idee deliziose e bilanciate per la colazione:

1. **Porridge Cremoso all'Avena**: Cuoci 40g di fiocchi d'avena con 150ml di acqua o latte vegetale. Guarnisci con frutti di bosco, cannella e 10g di mandorle.
2. **Toast Proteico Salato**: Tosta 2 fette di pane di segale, spalma un velo di ricotta light (40g) e aggiungi fesa di tacchino (50g).
3. **Yogurt Bowl Energetica**: 150g di yogurt greco 0% senza lattosio, 1 cucchiaino di miele, mezza banana a rondelle e 10g di noci tritate.

*Tutte queste opzioni sono bilanciate e nutrienti per iniziare la giornata.*`;
  }

  if (message.includes('spuntino') || message.includes('spuntini') || message.includes('merenda')) {
    const budgetHeader = getBiaBudgetHeader('spuntino');
    return `${budgetHeader ? budgetHeader + '\n' : ''}Per gli spuntini di metà mattina o pomeriggio, ecco tre opzioni sane e sazianti:

1. **Opzione Dolce**: Una mela verde piccola (120g) abbinata a 3 noci sgusciate (15g).
2. **Opzione Salata**: 2 gallette di riso integrale con 20g di Bresaola della Valtellina o scaglie di Parmigiano (15g).
3. **Opzione Proteica Veloce**: Un vasetto di yogurt bianco magro (125g) con 10 mandorle o anacardi crudi.

*Gli spuntini mantengono stabile l'energia ed evitano picchi di fame tra i pasti principali.*`;
  }

  if (message.includes('pranzo') || message.includes('pranzi')) {
    const budgetHeader = getBiaBudgetHeader('pranzo');
    return `${budgetHeader ? budgetHeader + '\n' : ''}Ecco una proposta bilanciata per il pranzo che rispetta la struttura del Piatto Sano:

* **Carboidrati**: Pasta integrale o Riso Basmati (pesato crudo, secondo le porzioni del tuo piano) cotto al dente.
* **Proteine**: Petto di pollo grigliato con erbe fini oppure filetto di merluzzo al vapore.
* **Verdure**: Insalata mista a foglia verde o zucchine alla piastra con menta e limone (a volontà).
* **Grassi**: Olio Extravergine d'Oliva (EVO) a crudo (secondo le porzioni del tuo piano).

*Questo abbinamento rilascia energia a lungo termine, ideale per evitare la sonnolenza post-prandiale.*`;
  }

  if (message.includes('cena') || message.includes('cene')) {
    const budgetHeader = getBiaBudgetHeader('cena');
    return `${budgetHeader ? budgetHeader + '\n' : ''}Ecco una proposta bilanciata e leggera per la cena, studiata per favorire la digestione e il riposo notturno:

* **Carboidrati**: Pane di segale tostato o patate dolci cotte al vapore.
* **Proteine**: Filetto di orata o salmone cotto al cartoccio con aromi mediterranei.
* **Verdure**: Spinaci al vapore conditi con succo di limone o finocchi crudi croccanti.
* **Grassi**: Olio EVO a crudo da aggiungere sopra il pesce e la verdura.

*Una cena ben bilanciata e a basso carico infiammatorio è fondamentale per il recupero metabolico.*`;
  }

  // Pollo o tacchino
  if (message.includes('pollo') || message.includes('petto di pollo') || message.includes('tacchino')) {
    return `Il petto di pollo o tacchino è un'ottima fonte di proteine magre. Ecco come cucinarlo per mantenerlo succoso e saporito:

### 🍗 Petto di Pollo al Limone e Zenzero

**Ingredienti:**
- Petto di pollo a fette (porzione da dieta)
- Succo di 1 limone
- Zenzero fresco grattugiato (o in polvere)
- Rosmarino e origano
- Olio EVO (dalla tua quota giornaliera)

**Preparazione:**
1. Marina le fettine di pollo nel succo di limone con lo zenzero e le erbe aromatiche per 15-20 minuti.
2. Scalda una padella antiaderente a fuoco medio-alto.
3. Adagia il pollo scolato dalla marinatura e cuocilo per circa 3-4 minuti per lato.
4. Versa la marinata rimasta negli ultimi 2 minuti di cottura per creare una cremina deliziosa.
5. Impiatta e aggiungi a crudo un filo d'olio EVO.

Risulterà morbidissimo e super profumato!`;
  }

  // Salmone o pesce
  if (message.includes('salmone') || message.includes('pesce') || message.includes('merluzzo') || message.includes('orata') || message.includes('branzino')) {
    return `Cucinare il pesce in modo sano e gustoso è semplicissimo! Ecco una ricetta fantastica al cartoccio che preserva tutti i nutrienti:

### 🐟 Filetto di Pesce al Cartoccio Mediterraneo

**Ingredienti:**
- Filetto di pesce (orata, branzino, merluzzo o salmone)
- Pomodorini ciliegino (tagliati a metà)
- Olive taggiasche (facoltativo, poche)
- Capperi dissalati
- Origano, aglio e prezzemolo
- Un filo di Olio EVO

**Preparazione:**
1. Preriscalda il forno a 180°C. Prepara un foglio di carta da forno abbastanza grande.
2. Adagia il filetto di pesce al centro del foglio.
3. Ricopri con i pomodorini, i capperi, l'origano, l'aglio schiacciato e il prezzemolo.
4. Chiudi il cartoccio sigillando bene i bordi in modo che il vapore non esca.
5. Inforna per circa 15-20 minuti (a seconda dello spessore del pesce).
6. Apri il cartoccio direttamente nel piatto (attenzione al vapore caldo!) e condisci con il tuo filo d'olio EVO a crudo.

Questo metodo mantiene il pesce incredibilmente succoso e saporito senza grassi cotti!`;
  }

  // Uova
  if (message.includes('uova') || message.includes('uovo')) {
    return `Le uova sono una fonte proteica fantastica e versatile. Ecco un'idea per un pranzo o cena velocissimo:

### 🍳 Omelette Soffice alle Verdure
1. Sbatti 2 uova in una ciotola con un pizzico di pepe ed erba cipollina.
2. In una padella antiaderente calda, cuoci delle zucchine o spinaci saltati (precedentemente cotti).
3. Versa le uova sbattute sopra le verdure.
4. Copri con un coperchio e lascia cuocere a fuoco medio-basso per 4-5 minuti, finché la superficie non si rapprende.
5. Piega a metà e servi calda.

Accompagnala con pane di segale tostato e un filo d'olio EVO a crudo!`;
  }

  // Verdure
  if (message.includes('verdure') || message.includes('verdura') || message.includes('zucchine') || message.includes('melanzane') || message.includes('spinaci') || message.includes('finocchi')) {
    return `Le verdure devono costituire metà del tuo piatto! Ecco un modo sfizioso per renderle croccanti e gustose senza eccedere con i grassi:

### 🥦 Verdure al Forno Speziate e Croccanti
1. Taglia a bastoncino o cubetti le tue verdure preferite (es. zucchine, carote, finocchi, broccoli).
2. Mettile in una ciotola e massaggiale con spezie a piacere: curcuma, paprika dolce, origano, pepe nero e un pizzico di sale.
3. Aggiungi mezzo cucchiaio d'olio EVO e mescola bene per distribuirlo uniformemente su tutte le verdure.
4. Stendile su una teglia coperta di carta forno senza sovrapporle.
5. Inforna a 200°C ventilato per 20-25 minuti finché non saranno dorate e leggermente croccanti.

Saranno saporite come patatine ma 100% salutari!`;
  }

  // Mangiare fuori / Fast Food / Ristorante
  if (message.includes('fuori') || message.includes('ristorante') || message.includes('mcdonald') || message.includes('pizza') || message.includes('sushi') || message.includes('piadineria') || message.includes('mc')) {
    return `Quando mangi fuori (es. ristorante, McDonald's, pizzeria, sushi), la regola d'oro è l'ascolto del tuo corpo!

1. **Scegli ciò che ti appaga**: non ripiegare su un'insalata triste se desideri un panino, una piadina o un trancio di pizza. Componi un pasto gustoso!
2. **Mangia lentamente**: assapora ogni boccone e fermati quando senti una piacevole sazietà, senza sentirti obbligato a "pulire il piatto".
3. **Nessun senso di colpa**: un pasto libero non rovina il percorso. Al pasto successivo, semplicemente riprendi ad ascoltare la tua fame biologica. Se sei meno affamato, opta naturalmente per qualcosa di più leggero (verdure e proteine magre) senza alcun intento punitivo o di "compensazione".

*(Per farti analizzare i menù specifici dei locali in tempo reale, assicurati che la connessione AI sia attiva nelle impostazioni ⚙️).*`;
  }

  // Risposta di default
  return `Non ho trovato una risposta specifica nel mio ricettario di base per questa richiesta.

*(Nota: Attualmente stai usando la modalità di base offline. Per conversazioni libere, per analizzare menù specifici o per ricette altamente personalizzate, assicurati di aver collegato la chiave AI nel pannello impostazioni ⚙️).*

Nel frattempo, puoi chiedermi:
- **"Cosa preparo con gli ingredienti di oggi?"**
- **"Idee per colazione, pranzo o cena"**
- Oppure consigli su ingredienti come **pollo**, **pesce**, **uova** e **verdure**!`;
};

// Funzione helper globale per calcolare i valori BIA
const getBiaResults = (p) => {
  if (!p) return null;
  const weightVal = p.weight || 70;
  const heightVal = p.height || 170;
  const ageVal = p.age || 30;
  
  const biaBmr = p.bia?.bmr || '';
  const biaFatMass = p.bia?.fatMass || '';
  const biaMuscleMass = p.bia?.muscleMass || '';
  const biaActivityFactor = p.bia?.activityFactor || 1.2;
  const biaTarget = p.bia?.target || 'Mantenimento';

  let calculatedBmr;
  if (biaBmr) {
    calculatedBmr = parseFloat(biaBmr);
  } else if (biaFatMass && !isNaN(parseFloat(biaFatMass))) {
    const lbm = weightVal * (1 - parseFloat(biaFatMass) / 100);
    calculatedBmr = Math.round(370 + 21.6 * lbm);
  } else {
    if (p.gender === 'Maschio') {
      calculatedBmr = Math.round(10 * weightVal + 6.25 * heightVal - 5 * ageVal + 5);
    } else {
      calculatedBmr = Math.round(10 * weightVal + 6.25 * heightVal - 5 * ageVal - 161);
    }
  }

  const tdeeVal = Math.round(calculatedBmr * parseFloat(biaActivityFactor));

  let rawTargetCaloriesVal = tdeeVal;
  if (biaTarget === 'DimagrimentoLieve') {
    rawTargetCaloriesVal = Math.round(tdeeVal * 0.90);
  } else if (biaTarget === 'DimagrimentoModerato') {
    rawTargetCaloriesVal = Math.round(tdeeVal * 0.85);
  } else if (biaTarget === 'DimagrimentoRapido') {
    rawTargetCaloriesVal = Math.round(tdeeVal * 0.80);
  } else if (biaTarget === 'Dimagrimento') {
    rawTargetCaloriesVal = Math.round(tdeeVal * 0.82);
  } else if (biaTarget === 'Massa') {
    rawTargetCaloriesVal = Math.round(tdeeVal * 1.12);
  }

  const forceMin = p.bia?.forceMinCalories !== false;
  let targetCaloriesVal = rawTargetCaloriesVal;
  if (forceMin && rawTargetCaloriesVal < 1200) {
    targetCaloriesVal = 1200;
  }

  const pGrams = customRoundToTen(
    biaMuscleMass && !isNaN(parseFloat(biaMuscleMass))
      ? parseFloat(biaMuscleMass) * 2.0
      : weightVal * 1.6
  );
  const pKcal = pGrams * 4;

  const fKcal = targetCaloriesVal * 0.25;
  const fGrams = customRoundToTen(fKcal / 9);

  const cKcal = Math.max(0, targetCaloriesVal - pKcal - fKcal);
  const cGrams = customRoundToTen(cKcal / 4);

  return {
    bmr: calculatedBmr,
    tdee: tdeeVal,
    targetCalories: targetCaloriesVal,
    proteinGrams: pGrams,
    fatGrams: fGrams,
    carbGrams: cGrams
  };
};

const getBiaMealsContext = (p) => {
  const results = getBiaResults(p);
  if (!results) return '';

  const cal = results.targetCalories;
  const carb = results.carbGrams;
  const prot = results.proteinGrams;
  const fat = results.fatGrams;

  return `
### BUDGET CALORICO E RIPARTIZIONE MACRONUTRIENTI PER SINGOLO PASTO:
L'utente deve rispettare questa esatta suddivisione calorica e dei macro per pasto. Quando l'utente ti chiede idee, consigli o ricette per la colazione, gli spuntini, il pranzo o la cena, devi calibrare le tue ricette/consigli affinché rientrino esattamente in queste calorie e macronutrienti per pasto:

1. **Colazione (20% del totale giornaliero)**:
   - Calorie Target: **${Math.round(cal * 0.20)} kcal**
   - Carboidrati: **${customRoundToTen(carb * 0.20)} g**
   - Proteine: **${customRoundToTen(prot * 0.20)} g**
   - Grassi: **${customRoundToTen(fat * 0.20)} g**

2. **Spuntino Mattina (10% del totale giornaliero)**:
   - Calorie Target: **${Math.round(cal * 0.10)} kcal**
   - Carboidrati: **${customRoundToTen(carb * 0.10)} g**
   - Proteine: **${customRoundToTen(prot * 0.10)} g**
   - Grassi: **${customRoundToTen(fat * 0.10)} g**

3. **Pranzo (30% del totale giornaliero)**:
   - Calorie Target: **${Math.round(cal * 0.30)} kcal**
   - Carboidrati: **${customRoundToTen(carb * 0.30)} g**
   - Proteine: **${customRoundToTen(prot * 0.30)} g**
   - Grassi: **${customRoundToTen(fat * 0.30)} g**

4. **Spuntino Pomeriggio (10% del totale giornaliero)**:
   - Calorie Target: **${Math.round(cal * 0.10)} kcal**
   - Carboidrati: **${customRoundToTen(carb * 0.10)} g**
   - Proteine: **${customRoundToTen(prot * 0.10)} g**
   - Grassi: **${customRoundToTen(fat * 0.10)} g**

5. **Cena (30% del totale giornaliero)**:
   - Calorie Target: **${Math.round(cal * 0.30)} kcal**
   - Carboidrati: **${customRoundToTen(carb * 0.30)} g**
   - Proteine: **${customRoundToTen(prot * 0.30)} g**
   - Grassi: **${customRoundToTen(fat * 0.30)} g**

**ISTRUZIONI CRITICHE E TASSATIVE PER LE TUE RISPOSTE:**
- NON MENZIONARE MAI calorie (kcal), carboidrati, proteine, grassi o grammature dei macronutrienti nelle tue risposte al paziente. È una regola medica fondamentale per evitare lo sviluppo di comportamenti ossessivi sul cibo.
- Non fare mai riferimento o menzionare l'obiettivo specifico di peso del paziente (es. dimagrimento, dimagrimento lieve, dimagrimento moderato, dimagrimento rapido, massa, mantenimento, deficit, ecc.).
- Struttura le tue proposte basandoti esclusivamente sulle proporzioni visive degli alimenti (es. metà piatto di verdura, un quarto di proteina magra, un quarto di carboidrato complesso) e sulle porzioni generiche indicate nel piano (es. "una fetta di pane integrale").
`;
};

const getPlateRecipe = (carb, prot, veg, fat) => {
  const cFood = carb?.food?.toLowerCase() || '';
  const pFood = prot?.food?.toLowerCase() || '';
  const vFood = veg?.food?.toLowerCase() || '';
  const fFood = fat?.food?.toLowerCase() || '';

  const cQty = carb?.quantity || '';
  const pQty = prot?.quantity || '';
  const vQty = veg?.quantity || 'a volontà';
  const fQty = fat?.quantity || '';

  // Helper per pulire i nomi visualizzati
  const clean = (name) => {
    if (!name) return '';
    return name
      .replace(/\(evo\)/gi, '')
      .replace(/ai ferri/gi, '')
      .replace(/grigliate/gi, '')
      .replace(/al vapore/gi, '')
      .replace(/bollite/gi, '')
      .replace(/fresco/gi, '')
      .replace(/biologiche/gi, '')
      .replace(/selvaggio/gi, '')
      .replace(/light/gi, '')
      .replace(/secche/gi, '')
      .replace(/dolci o rosse/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const cClean = clean(carb?.food);
  const pClean = clean(prot?.food);
  const vClean = clean(veg?.food);
  const fClean = clean(fat?.food);

  // Classificazione cibi
  const isGnocchi = cFood.includes('gnocchi');
  const isPasta = cFood.includes('pasta') || cFood.includes('semola') || cFood.includes('spaghetti') || cFood.includes('penne') || cFood.includes('fusilli') || cFood.includes('farfalle') || cFood.includes('pasta integrale') || cFood.includes('pasta di semola') || isGnocchi;
  const isRisoCereali = (cFood.includes('riso') || cFood.includes('farro') || cFood.includes('quinoa') || cFood.includes('orzo') || cFood.includes('cereali') || cFood.includes('avena') || cFood.includes('couscous') || cFood.includes('grano')) && !cFood.includes('gallette') && !cFood.includes('cracker') && !cFood.includes('pane') && !cFood.includes('fette');
  const isPanePiadina = cFood.includes('pane') || cFood.includes('piadina') || cFood.includes('crostini') || cFood.includes('segale') || cFood.includes('fette') || cFood.includes('cracker') || cFood.includes('gallette') || cFood.includes('focaccia') || cFood.includes('wrap') || cFood.includes('biscottate');
  const isPatate = (cFood.includes('patate') || cFood.includes('patata') || cFood.includes('dolci')) && !isGnocchi;

  const isPolloTacchino = pFood.includes('pollo') || pFood.includes('tacchino') || pFood.includes('tacchin') || pFood.includes('coniglio');
  const isCarneRossa = pFood.includes('manzo') || pFood.includes('vitello') || pFood.includes('maiale') || pFood.includes('bresaola') || pFood.includes('crudo') || pFood.includes('cotto') || pFood.includes('speck') || pFood.includes('affettat') || pFood.includes('prosciutto');
  const isPesceFresco = (pFood.includes('orata') || pFood.includes('merluzzo') || pFood.includes('branzino') || pFood.includes('pesce') || pFood.includes('gamberi') || pFood.includes('polpo') || pFood.includes('calamari') || pFood.includes('seppie') || pFood.includes('nasello') || pFood.includes('platessa') || pFood.includes('sogliola') || pFood.includes('spigola') || pFood.includes('trota') || pFood.includes('alici') || pFood.includes('sarde') || pFood.includes('pesce spada') || pFood.includes('triglia')) && !pFood.includes('affumicato') && !pFood.includes('tonno') && !pFood.includes('conserva');
  const isPesceConserva = pFood.includes('salmone') || pFood.includes('tonno') || pFood.includes('sgombro') || pFood.includes('conserva') || pFood.includes('scatola') || pFood.includes('acciughe');
  const isUova = pFood.includes('uov') || pFood.includes('albume') || pFood.includes('albumi') || pFood.includes('omelette');
  const isLatticini = pFood.includes('mozzarella') || pFood.includes('ricotta') || pFood.includes('fiocchi') || pFood.includes('formaggio') || pFood.includes('parmigiano') || pFood.includes('grana') || pFood.includes('feta') || pFood.includes('quartirolo') || pFood.includes('caprino') || pFood.includes('asiago') || pFood.includes('caciotta') || pFood.includes('fontina') || pFood.includes('provola') || pFood.includes('edamer') || pFood.includes('emmental') || pFood.includes('scamorza') || pFood.includes('toma') || pFood.includes('robiola') || pFood.includes('crescenza') || pFood.includes('gorgonzola') || pFood.includes('pecorino') || pFood.includes('stracchino') || pFood.includes('taleggio') || pFood.includes('philadelphia') || pFood.includes('spalmabile') || pFood.includes('primosale') || pFood.includes('squacquerone') || pFood.includes('burrata') || pFood.includes('caciocavallo');
  const isLegumi = pFood.includes('lenticchie') || pFood.includes('ceci') || pFood.includes('fagioli') || pFood.includes('piselli') || pFood.includes('lupini') || pFood.includes('legumi') || pFood.includes('fave') || pFood.includes('cicerchie');
  const isTofuTempeh = pFood.includes('tofu') || pFood.includes('tempeh') || pFood.includes('seitan') || pFood.includes('soia');

  // Identifica se la proteina è già pronta da mangiare fredda (formaggi, salumi, pesce in scatola/affumicato)
  const isReadyToEat = isLatticini || pFood.includes('bresaola') || pFood.includes('crudo') || pFood.includes('cotto') || pFood.includes('speck') || pFood.includes('affettat') || pFood.includes('prosciutto') || pFood.includes('affumicato') || pFood.includes('conserva') || pFood.includes('scatola') || pFood.includes('tonno') || pFood.includes('sgombro');

  let title = "Piatto Unico Armonico ed Equilibrato";
  let description = "Un'ottima combinazione di nutrienti creata appositamente con i tuoi ingredienti, bilanciando sapori freschi e cottura leggera.";
  let ingredients = [
    carb && `${carb.food} (${cQty})`,
    prot && `${prot.food} (${pQty})`,
    veg && `${veg.food} (${vQty})`,
    fat && `${fat.food} (${fQty})`
  ].filter(Boolean);

  // Passaggi di default dinamici basati sulle caratteristiche dei cibi
  const carbStep = isPanePiadina
    ? `Tosta le fette di ${cClean ? cClean : 'pane'} (${cQty}) su una piastra ben calda per 2 minuti per lato finché non risultano croccanti.`
    : isPatate
      ? `Cuoci la porzione di ${cClean ? cClean : 'patate'} (${cQty}) al vapore o al forno a 180°C per 20 minuti finché non risulta tenera.`
      : isGnocchi
        ? `Lessa gli ${cClean ? cClean : 'gnocchi'} (${cQty}) in acqua bollente salata e scolali non appena salgono a galla (circa 1-2 minuti).`
        : `Lessa la porzione di ${cClean ? cClean : 'carboidrati'} (${cQty}) in acqua bollente salata seguendo i tempi di cottura indicati sulla confezione per mantenerla al dente.`;

  const protStep = isReadyToEat
    ? `Prepara la porzione di ${pClean ? pClean : 'proteina'} (${pQty}) affettandola o porzionandola a temperatura ambiente.`
    : `Cuoci la porzione di ${pClean ? pClean : 'proteina'} (${pQty}) in modo semplice (spadellata, piastrata o al vapore per 5-7 minuti) senza aggiungere grassi in cottura.`;

  let steps = [
    "Pesa con precisione gli ingredienti prescritti per la preparazione: " + 
      [carb && `${cClean} (${cQty})`, prot && `${pClean} (${pQty})`, fat && `${fClean} (${fQty})`].filter(Boolean).join(', ') + ".",
    protStep,
    carbStep,
    "Lava e taglia le verdure: sminuzza " + (vClean || "le verdure a scelta") + " e scottale velocemente o servile fresche come contorno croccante.",
    "Assembla il piatto: unisci tutti i componenti nel piatto da portata e condisci a crudo con " + (fClean ? `${fClean} (${fQty})` : "olio EVO") + " per esaltare i sapori naturali."
  ];

  // Risoluzione delle combinazioni specifiche per evitare fallbacks uguali

  // A. PASTA o RISO/CEREALI
  if (isPasta || isRisoCereali) {
    const cName = isPasta ? 'pasta' : 'cereali';

    if (isPolloTacchino) {
      title = `Insalata Calda di ${cName.toUpperCase()} con Bocconcini di ${pClean.toUpperCase()}`;
      description = `Una ricetta profumata e proteica. La carne saltata a fuoco vivo con erbe aromatiche si sposa con la consistenza del carboidrato al dente.`;
      steps = [
        isGnocchi
          ? `Lessa gli gnocchi (${cQty}) in acqua bollente salata, scolali con una schiumarola non appena salgono a galla (circa 1-2 minuti) e versali nella ciotola.`
          : `Lessa la porzione di ${carb.food} (${cQty}) in acqua bollente leggermente salata per il tempo indicato sulla confezione. Scola al dente e versala in una ciotola capiente con un goccio d'acqua di cottura.`,
        `Taglia il ${prot.food} (${pQty}) a bocconcini uniformi di 2 cm. Scalda una padella antiaderente a fuoco medium-alto con un rametto di rosmarino o salvia, adagia la carne e saltala per 6-8 minuti sfumando con poca acqua all'occorrenza per mantenerla succosa.`,
        vFood.includes('insalata') || vFood.includes('finocchi') || vFood.includes('cetrioli')
          ? `Lava bene la verdura fresca (${veg.food}), tagliala finemente e uniscila alla ciotola con il carboidrato.`
          : `Taglia le verdure (${veg.food}) a pezzetti e saltale nella stessa padella del pollo negli ultimi 4 minuti per raccogliere i succhi di cottura.`,
        `Unisci la carne tiepida e le verdure nella ciotola con la pasta o i cereali.`,
        `Condisci a crudo con la porzione prescritta di ${fat ? `${fat.food} (${fQty})` : 'olio EVO'} e mescola prima di servire.`
      ];
    }
    else if (isCarneRossa) {
      title = `${cClean.charAt(0).toUpperCase() + cClean.slice(1)} saltata con Straccetti di ${pClean.toUpperCase()} e Pomodorini`;
      description = `Un piatto ricco di ferro e gusto. Gli straccetti saltati velocemente rilasciano aromi intensi che condiscono la base di carboidrati.`;
      steps = [
        isGnocchi
          ? `Lessa gli gnocchi (${cQty}) in acqua bollente salata e scolali non appena salgono a galla (circa 1-2 minuti).`
          : `Cuoci la porzione di ${carb.food} (${cQty}) in acqua bollente leggermente salata e scola al dente.`,
        isReadyToEat
          ? `Prepara l'affettato o carne fredda (${prot.food}, ${pQty}) tagliandola a listarelle sottili.`
          : `Taglia la carne (${prot.food}, ${pQty}) a straccetti sottili. Scalda una padella antiaderente capiente e scotta gli straccetti a fuoco vivo per soli 3-4 minuti girando continuamente, aggiungendo origano o pepe.`,
        `Aggiungi le verdure (${veg.food}) tagliate fini nella padella con la carne per 2 minuti per farle appassire (se da cuocere) o preparale crude di contorno.`,
        `Unisci il carboidrato cotto con gli straccetti e le verdure nel piatto o in padella per 1 minuto.`,
        `Impiatta e completa il condimento a crudo con la porzione di ${fat ? `${fat.food} (${fQty})` : 'olio EVO'}.`
      ];
    }
    else if (isPesceFresco) {
      title = `${cClean.charAt(0).toUpperCase() + cClean.slice(1)} al profumo di Scorzetta di Limone e Filetto di ${pClean.toUpperCase()}`;
      description = `Una preparazione leggera e tipicamente mediterranea, dove la freschezza degli agrumi esalta il sapore delicato del pesce bianco.`;
      steps = [
        isGnocchi
          ? `Lessa gli gnocchi (${cQty}) in acqua bollente salata e scolali non appena salgono a galla (circa 1-2 minuti).`
          : `Lessa la porzione di ${carb.food} (${cQty}) in abbondante acqua bollente salata e scolala al dente.`,
        `Cuoci il filetto di ${prot.food} (${pQty}) al vapore con una foglia di alloro per 10-12 minuti, oppure al cartoccio in forno a 180°C per 15 minuti. Una volta cotto, privalo di eventuali lische e spezzettalo delicatamente.`,
        `Prepara le verdure (${veg.food}) passandole al vapore per 5 minuti o grigliandole leggermente, mantenendone intatto il colore.`,
        `Unisci la pasta o il cereale, il pesce sminuzzato e le verdure nel piatto.`,
        `Condisci a crudo con la porzione di ${fat ? `${fat.food} (${fQty})` : 'olio EVO'} e grattugia finemente un pizzico di scorza di limone non trattato.`
      ];
    }
    else if (isPesceConserva) {
      title = `Healthy Poke Bowl di ${cClean.charAt(0).toUpperCase() + cClean.slice(1)} con ${pClean.toUpperCase()}`;
      description = `Una ciotola fresca e bilanciata, ricca di grassi buoni Omega-3. La freschezza del pesce affettato o in scatola contrasta con le verdure crude e croccanti.`;
      steps = [
        isGnocchi
          ? `Lessa gli gnocchi (${cQty}) in acqua bollente salata, scolali con una schiumarola appena salgono a galla e lasciali intiepidire.`
          : `Lessa la porzione di ${carb.food} (${cQty}) al dente e lasciala raffreddare in una ciotola.`,
        `Prepara il pesce (${prot.food}, ${pQty}) tagliandolo a listarelle (se salmone affumicato) o sgranandolo (se tonno o sgombro).`,
        `Lava e taglia le verdure (${veg.food}) a julienne o a fettine sottilissime. Se il condimento prevede avocado (${fQty}), taglialo a fettine sottili.`,
        `Disponi il riso o cereale nella bowl, adagia sopra il pesce, le verdure e l'avocado in settori separati.`,
        `Irrora a crudo con la porzione di ${fat && !fFood.includes('avocado') ? `${fat.food} (${fQty})` : 'olio EVO'} e qualche goccia di limone.`
      ];
    }
    else if (isUova) {
      title = `Wok di ${cClean.charAt(0).toUpperCase() + cClean.slice(1)} all'Orientale con Uova e Verdure`;
      description = `Una deliziosa ricetta ispirata alla cucina asiatica. L'uovo strapazzato crea una crema che avvolge i chicchi o la pasta con le verdure.`;
      steps = [
        isGnocchi
          ? `Lessa gli gnocchi (${cQty}) in acqua bollente salata, scolali appena salgono a galla e tienili da parte.`
          : `Cuoci il ${carb.food} (${cQty}) e passalo sotto acqua fredda per sgranarlo bene.`,
        `Taglia le verdure (${veg.food}) a pezzetti piccoli. Saltale in padella antiaderente a fuoco vivo con due cucchiai di acqua per 4 minuti.`,
        `Sbatti le uova (${pQty}) in una ciotola. Crea uno spazio al centro della padella spostando le verdure ai lati, versa l'uovo e strapazzalo rapidamente con una spatola per 2 minuti.`,
        `Aggiungi il carboidrato cotto nella padella e salta il tutto a fiamma vivace per 2 minuti per far legare gli ingredienti.`,
        `Impiatta e completa con la porzione prescritta di ${fat ? `${fat.food} (${fQty})` : 'olio EVO'} a crudo.`
      ];
    }
    else if (isLatticini) {
      if (isGnocchi) {
        title = `Gnocchi al Forno Gratinati con ${pClean.toUpperCase()} e Peperoni`;
        description = `Un piatto caldo, confortevole e goloso. Gli gnocchi lessati vengono passati in forno per far fondere il formaggio creando una deliziosa crosticina.`;
        steps = [
          `Preriscalda il forno in modalità grill a 200°C.`,
          `Lessa gli gnocchi (${cQty}) in acqua bollente salata e scolali delicatamente con una schiumarola non appena salgono a galla (circa 1-2 minuti).`,
          `Taglia il formaggio (${prot.food}, ${pQty}) a dadini piccoli. Taglia le verdure (${veg.food}) e salta i peperoni o verdure prescelte in padella con poca acqua per renderle tenere.`,
          `In una pirofila da forno, unisci gli gnocchi caldi, le verdure cotte e i dadini di formaggio.`,
          `Inforna per 5-7 minuti sotto il grill finché il formaggio non si scioglie diventando filante e dorato. Condisci a crudo con la porzione prescritta di ${fat ? `${fat.food} (${fQty})` : 'olio EVO'} all'uscita dal forno.`
        ];
      } else {
        title = `Insalata Caprese di ${cClean.charAt(0).toUpperCase() + cClean.slice(1)} con Cubetti di ${pClean.toUpperCase()}`;
        description = `Fresco, colorato e tipicamente estivo. La dolcezza e cremosità del latticino si sposano a meraviglia con il basilico fresco.`;
        steps = [
          `Lessa la porzione di ${carb.food} (${cQty}), scolala al dente e lasciala intiepidire.`,
          `Taglia la mozzarella o il formaggio (${prot.food}, ${pQty}) a dadini.`,
          `Lava e taglia le verdure (${veg.food}), come pomodorini freschi o verdure grigliate a pezzetti.`,
          `In una ciotola unisci il carboidrato, il formaggio e le verdure con qualche foglia di basilico spezzata a mano.`,
          `Condisci a crudo con la porzione di ${fat ? `${fat.food} (${fQty})` : 'olio EVO'}.`
        ];
      }
    }
    else if (isTofuTempeh || isLegumi) {
      title = `Wok di ${cClean.charAt(0).toUpperCase() + cClean.slice(1)} con ${pClean.toUpperCase()} Dorato e Verdure`;
      description = `Un piatto vegano saporito e nutriente. La cottura a fuoco vivo rende la fonte proteica vegetale dorata e croccante.`;
      steps = [
        isGnocchi
          ? `Lessa gli gnocchi (${cQty}) in acqua bollente salata e scolali appena salgono a galla.`
          : `Lessa il ${carb.food} (${cQty}) al dente e scolalo bene.`,
        `Se usi tofu (${pQty}), taglialo a cubetti e saltalo in padella calda senza condimenti per 5 minuti finché dorato. Se usi legumi, sciacquali e saltali in padella con rosmarino.`,
        `Aggiungi le verdure (${veg.food}) tagliate fini nella padella e cuoci con un goccio d'acqua per altri 5 minuti.`,
        `Unisci il carboidrato e fai saltare insieme per 2 minuti a fuoco vivo per legare i sapori.`,
        `Servi caldo condendo a crudo con la porzione di ${fat ? `${fat.food} (${fQty})` : 'olio EVO'}.`
      ];
    }
    else {
      // Fallback specifico per Pasta/Cereali
      title = `${cClean.charAt(0).toUpperCase() + cClean.slice(1)} con ${pClean.toUpperCase()} ed Erbe Rustiche`;
      description = `Un piatto unico equilibrato, preparato in modo semplice per valorizzare i singoli ingredienti prescelti.`;
      steps = [
        isGnocchi
          ? `Lessa gli gnocchi (${cQty}) in acqua bollente salata e scolali non appena salgono a galla.`
          : `Lessa la porzione di ${carb.food} (${cQty}) in acqua salata, scolala al dente e versala in una ciotola.`,
        isReadyToEat
          ? `Prepara ${prot.food} (${pQty}) sminuzzandolo o affettandolo direttamente a freddo.`
          : `Cuoci la proteina (${prot.food}, ${pQty}) in padella antiaderente per 5-7 minuti finché cotta.`,
        `Pulisci e taglia le verdure (${veg.food}), scottandole o servendole fresche.`,
        `Unisci il carboidrato, la proteina e le verdure nella ciotola.`,
        `Completa il piatto irrorando a crudo con la porzione di ${fat ? `${fat.food} (${fQty})` : 'olio EVO'}.`
      ];
    }
  }

  // B. PANE / PIADINA / GALLETTE
  else if (isPanePiadina) {
    const isPiadina = cFood.includes('piadina') || cFood.includes('wrap');
    const carbBase = isPiadina ? 'Piadina' : 'Bruschetta';

    if (isPolloTacchino) {
      title = `${carbBase} Gourmet con Straccetti di ${pClean.toUpperCase()} e Verdure`;
      description = `Un'ottima alternativa da mangiare con le mani. Il pollo alla griglia saporito si abbinano alla consistenza del pane o della piadina calda.`;
      steps = [
        `Taglia il pollo o tacchino (${prot.food}, ${pQty}) a straccetti e cuocilo su una piastra caldissima per 6-8 minuti con origano e limone.`,
        `Griglia le verdure (${veg.food}) o taglia verdure fresche a fette sottili.`,
        `Tosta il ${carb.food} (${cQty}) sulla piastra calda per 1-2 minuti per lato finché non diventa fragrante.`,
        `Se il condimento è avocado (${fQty}), schiaccialo con una forchetta per creare una crema base da spalmare sul pane/piadina.`,
        `Farcisci il pane con la crema di avocado, il pollo caldo e le verdure. Completa con ${fat && !fFood.includes('avocado') ? `${fat.food} (${fQty})` : 'un filo di olio EVO'} a crudo.`
      ];
    }
    else if (isCarneRossa) {
      title = `Bruschetta Rustica con Bresaola o Affettato di ${pClean.toUpperCase()}`;
      description = `Preparazione rapidissima e ricca di sapore. La fragranza del pane tostato si combina perfettamente con l'affettato fresco.`;
      steps = [
        `Tosta le fette di ${carb.food} (${cQty}) su una piastra caldissima fino a renderle croccanti.`,
        `Prepara l'affettato (${prot.food}, ${pQty}) lasciandolo riposare pochi minuti a temperatura ambiente per sprigionare i profumi.`,
        `Lava e affetta le verdure fresche (${veg.food}), come pomodorini o cetrioli croccanti.`,
        `Adagia le verdure sul pane tostato, stendi sopra le fette di affettato.`,
        `Condisci a crudo con la porzione prescritta di ${fat ? `${fat.food} (${fQty})` : 'olio EVO'} e un pizzico di pepe.`
      ];
    }
    else if (isPesceConserva || isPesceFresco) {
      title = `${carbBase} Nordica con Avocado e ${pClean.toUpperCase()}`;
      description = `Abbinamento moderno e ricco di grassi benefici. Il contrasto tra la tostatura e la cremosità dell'avocado e del pesce è strepitoso.`;
      steps = [
        `Tosta il ${carb.food} (${cQty}) fino a renderlo dorato e croccante.`,
        `Prepara il pesce (${prot.food}, ${pQty}): sgrana il tonno con una forchetta o taglia il salmone a listarelle. Se pesce fresco, cuocilo al vapore e sfaldalo.`,
        `Lava e disponi le verdure fresche (${veg.food}) come spinacini o insalata.`,
        `Se il condimento prevede avocado (${fQty}), schiaccialo sul pane tostato creando una crema soffice.`,
        `Adagia il pesce e le verdure sopra il pane. Rifinisci con la porzione di ${fat && !fFood.includes('avocado') ? `${fat.food} (${fQty})` : 'un filo di olio EVO'} a crudo.`
      ];
    }
    else if (isUova) {
      title = `Crostone con Uova Strapazzate soffici e ${vClean.toUpperCase()}`;
      description = `Perfetto per un pranzo veloce o un brunch saporito ed equilibrato. La morbidezza dell'uovo strapazzato contrasta con il pane croccante.`;
      steps = [
        `Tosta il pane o ${carb.food} (${cQty}) su una piastra calda per renderlo croccante.`,
        `Sbatti le uova (${pQty}) in una ciotola con un pizzico di pepe. Cuocile in un padellino antiaderente caldo per 2 minuti mescolando spesso per mantenerle cremose.`,
        `Lava e taglia le verdure (${veg.food}) fresche (pomodorini a fette) o saltale in padella.`,
        `Disponi le uova strapazzate sul crostone caldo, guarnisci con le verdure di contorno.`,
        `Condisci il tutto a crudo con la porzione di ${fat ? `${fat.food} (${fQty})` : 'olio EVO'}.`
      ];
    }
    else if (isLatticini) {
      title = `Toast Aperto con ${pClean.toUpperCase()} e Verdure Aromatiche`;
      description = `Fresco, leggero e facilissimo. Il formaggio fresco spalmato o a fette si scioglie leggermente sul pane caldo.`;
      steps = [
        `Tosta bene il pane o ${carb.food} (${cQty}) finché non risulta caldo e croccante.`,
        `Affetta la mozzarella o il formaggio (${prot.food}, ${pQty}) sul pane tostato caldissimo in modo che si ammorbidisca leggermente.`,
        `Aggiungi le verdure (${veg.food}) grigliate o fresche a fette sopra il formaggio.`,
        `Completa cospargendo con la porzione di ${fat ? `${fat.food} (${fQty})` : 'olio EVO'} a crudo.`,
        `Profuma con origano selvatico o basilico fresco.`
      ];
    }
    else if (isTofuTempeh || isLegumi) {
      title = `Bruschette Rustiche con Tofu Piastrato o Crema di ${pClean.toUpperCase()}`;
      description = `Un'idea vegetariana sfiziosa e saporita, ricca di proteine vegetali e fibre sane per garantire la massima sazietà.`;
      steps = [
        `Tosta le fette di ${carb.food} (${cQty}) e tienile pronte.`,
        `Se usi legumi, frullali con un goccio d'acqua per fare una crema soffice da spalmare. Se tofu (${pQty}), taglialo a fette sottili e scottale in padella antiaderente per 5 minuti fino a doratura.`,
        `Stendi la crema di legumi o adagia il tofu sul pane tostato.`,
        `Disponi le verdure (${veg.food}) grigliate o fresche sopra il pane.`,
        `Bagna con la porzione di ${fat ? `${fat.food} (${fQty})` : 'olio EVO'} a crudo.`
      ];
    }
    else {
      // Fallback specifico per Pane
      title = `Sandwich Caldo con ${pClean.toUpperCase()} e Verdure`;
      description = `Un'alternativa pratica e gustosa dove il pane tostato incontra la freschezza degli ingredienti da te scelti.`;
      steps = [
        `Tosta le fette di ${carb.food} (${cQty}) su una piastra caldissima finché non sono croccanti ed ambrate.`,
        isReadyToEat
          ? `Prepara la porzione di ${prot.food} (${pQty}) affettandola o disponendola a fette sottili.`
          : `Cuoci la proteina (${prot.food}, ${pQty}) in padella per 5 minuti fino a doratura.`,
        `Lava e disponi le verdure (${veg.food}) fresche o grigliate sopra la fetta di pane.`,
        `Adagia la proteina sopra lo strato di verdure.`,
        `Condisci a crudo con la porzione di ${fat ? `${fat.food} (${fQty})` : 'olio EVO'} prima di servire.`
      ];
    }
  }

  // C. PATATE
  else if (isPatate) {
    if (isPolloTacchino) {
      title = `Bocconcini di ${pClean.toUpperCase()} e Patate Dorate al Forno`;
      description = `Il comfort food per eccellenza in versione leggera. La cottura delle patate con la carne crea un piatto unico succoso e invitante.`;
      steps = [
        `Preriscalda il forno a 180°C. Lava, sbuccia e taglia le patate (${carb.food}, ${cQty}) a dadini di 2 cm.`,
        `Taglia la carne (${prot.food}, ${pQty}) a bocconcini di pari dimensione.`,
        `Metti le patate e la carne in una teglia con carta forno, aggiungi rosmarino fresco e pepe nero.`,
        `Inforna e cuoci per 20-25 minuti, girando a metà cottura finché le patate non saranno dorate sui bordi.`,
        `Accompagna con le verdure del piano (${veg.food}) e condisci a crudo con la porzione prescritta di ${fat ? `${fat.food} (${fQty})` : 'olio EVO'}.`
      ];
    }
    else if (isPesceFresco) {
      title = `Filetto di ${pClean.toUpperCase()} al Cartoccio con Patate al Rosmarino`;
      description = `Cottura delicata che trattiene i sapori naturali del pesce. Le patate affettate sottili assorbono i succhi di cottura.`;
      steps = [
        `Preriscalda il forno a 180°C. Sbuccia le patate (${carb.food}, ${cQty}) e affettale sottilissime (2 mm).`,
        `Stendi un foglio di carta forno, crea un letto di patate, adagia sopra il filetto di pesce (${pQty}) e profuma con timo o limone.`,
        `Sigilla i bordi della carta forno creando un cartoccio e inforna per 20 minuti.`,
        `Apri il cartoccio, disponi nel piatto insieme alle verdure (${veg.food}) cotte o fresche.`,
        `Condisci a crudo con la porzione di ${fat ? `${fat.food} (${fQty})` : 'olio EVO'}.`
      ];
    }
    else if (isPesceConserva) {
      title = `Insalata Tiepida di Patate, Fagiolini e ${pClean.toUpperCase()}`;
      description = `Una ricetta ricca, gustosa e saziante. Le patate si sposano alla perfezione con il pesce conservato e la croccantezza delle verdure.`;
      steps = [
        `Lava e lessa le patate (${carb.food}, ${cQty}) con la buccia per 20-25 minuti. Lasciale intiepidire, sbucciale e tagliale a pezzetti.`,
        `In una ciotola unisci le patate, il pesce (${prot.food}, ${pQty}) sgranato e la verdura cotta o fresca (${veg.food}). Se usi avocado (${fQty}) taglialo a dadini.`,
        `Mescola delicatamente tutti gli ingredienti.`,
        `Condisci a crudo con la porzione di ${fat && !fFood.includes('avocado') ? `${fat.food} (${fQty})` : 'olio EVO'} e un po' di limone.`
      ];
    }
    else if (isUova) {
      title = `Tortino Soffice di Patate e Uova cotto al Forno`;
      description = `Un tortino gonfio e dorato, simile a una frittata ma cotta senza grassi in forno. Saziante e leggero.`;
      steps = [
        `Preriscalda il forno a 180°C. Sbuccia le patate (${carb.food}, ${cQty}) e tagliale a dadini piccoli, lessandole per 5 minuti.`,
        `In una ciotola sbatti le uova (${pQty}) con pepe ed erba cipollina. Unisci le patate cotte.`,
        `Versa in una pirofila da forno monoporzione con carta forno e cuoci per 15-18 minuti fino a doratura.`,
        `Servi il tortino caldo con le verdure di contorno (${veg.food}).`,
        `Irrora le verdure e il tortino a crudo con la porzione di ${fat ? `${fat.food} (${fQty})` : 'olio EVO'}.`
      ];
    }
    else if (isLatticini) {
      title = `Sformato Dorato di Patate e ${pClean.toUpperCase()} Filante`;
      description = `Preparazione al forno confortevole e gustosa. Il formaggio si fonde con le patate calde creando un cuore cremoso.`;
      steps = [
        `Preriscalda il forno a 180°C. Lessa le patate (${carb.food}, ${cQty}), sbucciale e schiacciale con una forchetta in una pirofila.`,
        `Taglia il formaggio (${prot.food}, ${pQty}) a dadini e uniscilo alle patate schiacciate.`,
        `Cuoci in forno per 10 minuti fino a quando il formaggio non si sarà fuso completamente.`,
        `Servi ben caldo accompagnato dalle verdure del tuo piano (${veg.food}).`,
        `Condisci a crudo con la porzione prescritta di ${fat ? `${fat.food} (${fQty})` : 'olio EVO'}.`
      ];
    }
    else if (isTofuTempeh || isLegumi) {
      title = `Teglia Speziata di Patate e ${pClean.toUpperCase()} al Rosmarino`;
      description = `Ricetta vegetale e rustica. La cottura al forno rende il tofu o i legumi croccanti, perfetti con le patate dorate.`;
      steps = [
        `Preriscalda il forno a 190°C. Taglia le patate (${carb.food}, ${cQty}) e il tofu (${pQty}) a cubetti.`,
        `In una teglia con carta forno unisci le patate, il tofu/legumi, rosmarino e pepe nero.`,
        `Inforna per 25 minuti girando a metà cottura finché tutto non risulterà dorato e croccanti.`,
        `Servi con le verdure del piano (${veg.food}) e condisci a crudo con la porzione di ${fat ? `${fat.food} (${fQty})` : 'olio EVO'}.`
      ];
    }
    else {
      // Fallback specifico per Patate
      title = `Patate dorate al Rosmarino con Contorno di ${pClean.toUpperCase()}`;
      description = `Un contorno classico di patate cotte a puntino che accompagna la tua fonte proteica.`;
      steps = [
        `Preriscalda il forno a 180°C. Sbuccia le patate (${carb.food}, ${cQty}) e tagliale a cubetti.`,
        `Disponi le patate su una teglia con carta forno, cospargi con rosmarino e inforna per 20-25 minuti.`,
        isReadyToEat
          ? `Prepara ${prot.food} (${pQty}) affettandolo a freddo.`
          : `Nel frattempo, cuoci la proteina (${prot.food}, ${pQty}) in padella per 5-7 minuti.`,
        `Impiatta le patate calde accanto alla proteina e alle verdure del piano (${veg.food}).`,
        `Irrora tutto a crudo con la porzione prescritta di ${fat ? `${fat.food} (${fQty})` : 'olio EVO'}.`
      ];
    }
  }

  // D. LEGUMI COME PROTEINA PRINCIPALE + QUALSIASI CARBOIDRATO
  else if (isLegumi) {
    if (isPasta || isRisoCereali) {
      title = `Zuppetta Rustica di ${cClean.charAt(0).toUpperCase() + cClean.slice(1)} e ${pClean.toUpperCase()} al Rosmarino`;
      description = `Un piatto caldo tradizionale e avvolgente. L'unione di cereali e legumi crea una proteina vegetale ad alto valore biologico.`;
      steps = [
        `Se usi legumi in scatola sciacquali bene, se secchi (${pQty}) lessali preventivamente in acqua bollente.`,
        `Fai appassire le verdure del soffritto (${veg.food}) in pentola con due cucchiai di acqua per 5 minuti insieme a un rametto di rosmarino.`,
        `Aggiungi i legumi in pentola, copri con acqua bollente e lascia sobbollire per 10 minuti.`,
        `Versa il carboidrato (${carb.food}, ${cQty}) direttamente nella pentola e cuocilo per il tempo indicato sulla confezione.`,
        `Servi la zuppetta calda condendola a crudo con la porzione prescritta di ${fat ? `${fat.food} (${fQty})` : 'olio EVO'}.`
      ];
    }
  }

  return { title, description, ingredients, steps };
};
