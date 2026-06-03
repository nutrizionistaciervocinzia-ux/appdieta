import { useState, useEffect, useRef } from 'react';
import { 
  UserPlus, 
  UploadCloud, 
  Trash2, 
  Plus, 
  Save, 
  FileText, 
  Check, 
  Users, 
  ChevronRight,
  ArrowLeft,
  Info,
  Activity,
  Send,
  MessageSquare,
  Bell,
  X,
  Search,
  Trophy
} from 'lucide-react';
import { extractTextFromPdf, parseDietText, parseBiaText } from '../utils/pdfParser';

const targetLabels = {
  Mantenimento: 'Mantenimento',
  DimagrimentoLieve: 'Dimagrimento Lieve (-10%)',
  DimagrimentoModerato: 'Dimagrimento Moderato (-15%)',
  DimagrimentoRapido: 'Dimagrimento Rapido (-20%)',
  Dimagrimento: 'Dimagrimento (-18%)',
  Massa: 'Massa (+12%)'
};

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

export default function Dashboard({ patients, onAddPatient, onUpdatePatientDiet, onUpdatePatientBia, onUpdatePatientPin, onUpdatePatientHistory, onUpdatePatientNextCheckup, onUpdatePatientProfile }) {
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  
  // Form per nuovo paziente
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSurname, setNewSurname] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newGender, setNewGender] = useState('Femmina');
  const [newHeight, setNewHeight] = useState('');
  const [newWeight, setNewWeight] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Stati BIA
  const [biaWeight, setBiaWeight] = useState('');
  const [biaHeight, setBiaHeight] = useState('');
  const [biaAge, setBiaAge] = useState('');
  const [biaGender, setBiaGender] = useState('Femmina');
  const [biaFatMass, setBiaFatMass] = useState('');
  const [biaMuscleMass, setBiaMuscleMass] = useState('');
  const [biaBmr, setBiaBmr] = useState('');
  const [biaActivityFactor, setBiaActivityFactor] = useState(1.2);
  const [biaTarget, setBiaTarget] = useState('Mantenimento');
  const [forceMinCalories, setForceMinCalories] = useState(() => {
    return localStorage.getItem('liberadiete_force_min_1200') !== 'false';
  });
  const [isParsingBia, setIsParsingBia] = useState(false);

  // Stati per Integrazione Custom GPT
  const [gptUrl, setGptUrl] = useState(() => localStorage.getItem('liberadiete_gpt_url') || '');
  const [gptUrl2, setGptUrl2] = useState(() => localStorage.getItem('liberadiete_gpt_url2') || '');
  const [gptName1, setGptName1] = useState(() => localStorage.getItem('liberadiete_gpt_name1') || 'Assistente GPT #1');
  const [gptName2, setGptName2] = useState(() => localStorage.getItem('liberadiete_gpt_name2') || 'Assistente GPT #2');
  const [copySuccess, setCopySuccess] = useState(false);
  const [copySuccess2, setCopySuccess2] = useState(false);
  const [showGptPanel, setShowGptPanel] = useState(false);
  const [activeGptUrl, setActiveGptUrl] = useState('');
  const [includeWeeklyMenu, setIncludeWeeklyMenu] = useState(true);

  // Stato caricamento ed editing della dieta
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState('');
  const [activeTab, setActiveTab] = useState('colazione');
  
  // Dieta temporanea in corso di modifica
  const [tempDiet, setTempDiet] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [pastedText, setPastedText] = useState('');

  // Stati per lo storico Peso/BIA ed il Prossimo Controllo
  const [historyDate, setHistoryDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [historyWeight, setHistoryWeight] = useState('');
  const [historyFatMass, setHistoryFatMass] = useState('');
  const [historyMuscleMass, setHistoryMuscleMass] = useState('');
  const [nextCheckupInput, setNextCheckupInput] = useState('');
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [drawerSearchQuery, setDrawerSearchQuery] = useState('');
  const [doctorChatInput, setDoctorChatInput] = useState('');
  const doctorMessagesEndRef = useRef(null);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  // Auto-scroll della chat (Colonna 3) al fondo quando cambia il paziente o ci sono nuovi messaggi
  useEffect(() => {
    if (selectedPatientId && doctorMessagesEndRef.current) {
      setTimeout(() => {
        doctorMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }, [selectedPatient, selectedPatientId]);

  const handleSendDoctorMessage = () => {
    if (!doctorChatInput.trim() || !selectedPatientId) return;

    const newMsg = {
      id: "msg-" + Date.now(),
      sender: "doctor",
      text: doctorChatInput.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };

    const currentMessages = selectedPatient ? (selectedPatient.messages || []) : [];
    const updatedMessages = [...currentMessages, newMsg];

    if (onUpdatePatientProfile) {
      onUpdatePatientProfile(selectedPatientId, {
        messages: updatedMessages
      });
    }

    setDoctorChatInput("");
  };

  useEffect(() => {
    if (selectedPatient && selectedPatient.messages && selectedPatient.messages.some(m => m.sender === 'patient' && !m.read)) {
      const updatedMessages = selectedPatient.messages.map(m => 
        m.sender === 'patient' ? { ...m, read: true } : m
      );
      if (onUpdatePatientProfile) {
        onUpdatePatientProfile(selectedPatientId, { messages: updatedMessages });
      }
    }
  }, [selectedPatient, selectedPatientId, onUpdatePatientProfile]);

  const getPatientChatCountToday = (patientId) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const key = `liberadiete_chat_count_${patientId}_${todayStr}`;
    return parseInt(localStorage.getItem(key) || '0', 10);
  };

  // Azioni Storico Peso/BIA e Prossimo Controllo
  const handleSaveNextCheckup = () => {
    if (!selectedPatientId || !onUpdatePatientNextCheckup) return;
    onUpdatePatientNextCheckup(selectedPatientId, nextCheckupInput);
    setSuccessMessage('Data del prossimo controllo salvata con successo!');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleAddHistoryRecord = (e) => {
    e.preventDefault();
    if (!selectedPatientId || !onUpdatePatientHistory) return;
    if (!historyDate || !historyWeight) {
      alert("Per aggiungere una misurazione inserisci almeno Data e Peso.");
      return;
    }

    const newRecord = {
      date: historyDate,
      weight: parseFloat(historyWeight),
      fatMass: historyFatMass ? parseFloat(historyFatMass) : 0,
      muscleMass: historyMuscleMass ? parseFloat(historyMuscleMass) : 0
    };

    const currentHistory = selectedPatient.history || [];
    // Evita duplicati rimuovendo rilevazioni con la stessa data
    const filteredHistory = currentHistory.filter(r => r.date !== historyDate);
    const updatedHistory = [...filteredHistory, newRecord];

    onUpdatePatientHistory(selectedPatientId, updatedHistory);
    setSuccessMessage('Nuova rilevazione aggiunta allo storico!');
    
    // Aggiorna anche gli stati del form principale BIA per coerenza
    if (historyFatMass) setBiaFatMass(historyFatMass);
    if (historyMuscleMass) setBiaMuscleMass(historyMuscleMass);
    
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleDeleteHistoryRecord = (dateToDelete) => {
    if (!selectedPatientId || !onUpdatePatientHistory) return;
    if (!window.confirm("Sei sicuro di voler eliminare questa misurazione dello storico?")) return;

    const currentHistory = selectedPatient.history || [];
    const updatedHistory = currentHistory.filter(r => r.date !== dateToDelete);

    onUpdatePatientHistory(selectedPatientId, updatedHistory);
    setSuccessMessage('Rilevazione rimossa dallo storico.');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  // Stampa o scarica come PDF le istruzioni d'accesso per il paziente
  const handlePrintPatientInstructions = (patient) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Per favore, consenti i pop-up nel browser per scaricare le istruzioni.");
      return;
    }

    const appUrl = window.location.origin;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Istruzioni di Accesso - ${patient.name} ${patient.surname}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
          body {
            font-family: 'Outfit', sans-serif;
            color: #3d0a24;
            background-color: #ffffff;
            margin: 0;
            padding: 3rem;
            line-height: 1.6;
          }
          .letter-container {
            max-width: 800px;
            margin: 0 auto;
            border: 2px solid rgba(214, 51, 132, 0.15);
            padding: 3rem;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(214, 51, 132, 0.05);
            background: linear-gradient(185deg, #ffffff 0%, #fffbfd 100%);
            position: relative;
          }
          .letter-container::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 10px;
            background: linear-gradient(90deg, #d63384 0%, #ff6eb4 100%);
            border-top-left-radius: 18px;
            border-top-right-radius: 18px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid rgba(214, 51, 132, 0.1);
            padding-bottom: 2rem;
            margin-bottom: 2rem;
          }
          .logo-area {
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
          }
          .logo-title {
            font-size: 1.8rem;
            font-weight: 800;
            color: #d63384;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .doctor-subtitle {
            font-size: 0.85rem;
            font-weight: 600;
            color: #a05070;
            letter-spacing: 0.05em;
          }
          .doc-contacts {
            text-align: right;
            font-size: 0.85rem;
            color: #a05070;
          }
          .content-title {
            text-align: center;
            font-size: 1.5rem;
            font-weight: 700;
            color: #d63384;
            margin-bottom: 2rem;
            text-transform: uppercase;
            letter-spacing: 0.02em;
          }
          .welcome-text {
            font-size: 1.05rem;
            margin-bottom: 1.5rem;
          }
          .instruction-box {
            background-color: #fff0f7;
            border: 1px dashed #d63384;
            border-radius: 14px;
            padding: 1.5rem;
            margin: 2rem 0;
          }
          .steps-list {
            margin: 0;
            padding-left: 1.5rem;
          }
          .steps-list li {
            margin-bottom: 1rem;
            font-size: 1.05rem;
          }
          .steps-list strong {
            color: #d63384;
          }
          .pin-display {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            background: #ffffff;
            border: 2px solid #d63384;
            padding: 1rem 2rem;
            border-radius: 12px;
            margin: 1.5rem auto;
            max-width: max-content;
            box-shadow: 0 4px 12px rgba(214, 51, 132, 0.1);
          }
          .pin-number {
            font-size: 2.2rem;
            font-weight: 800;
            letter-spacing: 0.2rem;
            color: #d63384;
          }
          .notes-section {
            border-left: 4px solid #ff6eb4;
            padding-left: 1rem;
            margin: 2rem 0;
            font-style: italic;
            color: #555;
          }
          .footer-section {
            text-align: center;
            margin-top: 3rem;
            border-top: 1px solid rgba(214, 51, 132, 0.1);
            padding-top: 1.5rem;
            font-size: 0.85rem;
            color: #a05070;
          }
          .print-btn-area {
            text-align: center;
            margin-top: 1.5rem;
          }
          .print-btn {
            background: linear-gradient(135deg, #d63384 0%, #b0246e 100%);
            color: #ffffff;
            border: none;
            padding: 0.8rem 2rem;
            font-size: 1rem;
            font-weight: 700;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(214, 51, 132, 0.3);
            font-family: 'Outfit', sans-serif;
            transition: all 0.2s;
          }
          .print-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(214, 51, 132, 0.4);
          }
          @media print {
            .print-btn-area {
              display: none;
            }
            body {
              padding: 0;
            }
            .letter-container {
              border: none;
              box-shadow: none;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="letter-container">
          <div class="header">
            <div class="logo-area">
              <div class="logo-title">
                ❤️ Libera dalle Diete
              </div>
              <div class="doctor-subtitle">
                Dott.ssa Ciervo Cinzia &mdash; Biologa Nutrizionista
              </div>
            </div>
            <div class="doc-contacts">
              Email: cinzia.ciervo.nutrizionista@gmail.com<br>
              Web: ${appUrl}
            </div>
          </div>

          <div class="content-title">Istruzioni di Accesso alla Tua App</div>

          <div class="welcome-text">
            Ciao <strong>${patient.name}</strong>,<br>
            la Dott.ssa Ciervo Cinzia ha preparato il tuo piano alimentare personalizzato su <strong>Libera dalle Diete</strong>.
            Ecco le istruzioni passo-passo per accedere e consultare la tua dieta in qualsiasi momento dal tuo smartphone, tablet o computer.
          </div>

          <div class="instruction-box">
            <ol class="steps-list">
              <li>Apri il browser sul tuo telefono o computer e vai all'indirizzo dell'applicazione:
                <br><strong style="font-size: 1.15rem; word-break: break-all; color: #d63384;">${appUrl}</strong>
              </li>
              <li>Seleziona la scheda <strong>"Area Paziente"</strong>.</li>
              <li>Inserisci il tuo codice PIN personale di accesso:</li>
            </ol>

            <div class="pin-display">
              <span>🔑 PIN:</span>
              <span class="pin-number">${patient.pin || '0000'}</span>
            </div>
          </div>

          ${patient.notes ? `
            <div style="font-weight: 700; font-size: 0.95rem; margin-top: 1.5rem; color: #d63384;">Note Cliniche & Obiettivi:</div>
            <div class="notes-section">
              "${patient.notes}"
            </div>
          ` : ''}

          <div class="welcome-text" style="margin-top: 2rem;">
            All'interno dell'app potrai:
            <ul>
              <li>Consultare il tuo <strong>Diario Alimentare</strong> giorno per giorno.</li>
              <li>Visualizzare il tuo <strong>Piatto Sano</strong> interattivo con le porzioni ideali.</li>
              <li>Chiedere idee di ricette o consigli all'<strong>Assistente AI</strong> basati sul tuo budget BIA o sugli ingredienti del piatto.</li>
            </ul>
          </div>

          <div class="footer-section">
            <p style="font-weight: 700; margin-bottom: 0.3rem;">Dott.ssa Ciervo Cinzia &mdash; Biologa Nutrizionista</p>
            <p>Con ❤️ per la tua salute e il tuo benessere senza stress.</p>
          </div>
        </div>

        <div class="print-btn-area">
          <button class="print-btn" onclick="window.print()">Stampa o Salva come PDF</button>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Invia il form per il nuovo paziente
  const handleAddPatientSubmit = (e) => {
    e.preventDefault();
    if (!newName || !newSurname) return;
    
    const newPatient = {
      id: `paz-${Date.now()}`,
      name: newName,
      surname: newSurname,
      pin: Math.floor(1000 + Math.random() * 9000).toString(),
      age: newAge ? parseInt(newAge) : '',
      gender: newGender,
      height: newHeight ? parseFloat(newHeight) : '',
      weight: newWeight ? parseFloat(newWeight) : '',
      notes: newNotes,
      diet: {
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
      },
      selections: {}
    };

    onAddPatient(newPatient);
    setSelectedPatientId(newPatient.id);
    setTempDiet(newPatient.diet);
    
    // Resetta campi
    setNewName('');
    setNewSurname('');
    setNewAge('');
    setNewHeight('');
    setNewWeight('');
    setNewNotes('');
    setShowAddForm(false);
  };

  // Seleziona un paziente esistente
  const handleSelectPatient = (patient) => {
    setSelectedPatientId(patient.id);
    setTempDiet(patient.diet ? JSON.parse(JSON.stringify(patient.diet)) : {
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
    });
    setBiaFatMass(patient.bia?.fatMass || '');
    setBiaMuscleMass(patient.bia?.muscleMass || '');
    setBiaBmr(patient.bia?.bmr || '');
    // Normalizza activityFactor al valore valido più vicino (previene bug con dati salvati da versioni precedenti)
    const validFactors = [1.2, 1.375, 1.55, 1.725];
    const savedFactor = parseFloat(patient.bia?.activityFactor) || 1.2;
    const nearestFactor = validFactors.reduce((prev, curr) =>
      Math.abs(curr - savedFactor) < Math.abs(prev - savedFactor) ? curr : prev
    );
    setBiaActivityFactor(String(nearestFactor));
    setBiaTarget(patient.bia?.target || 'Mantenimento');
    setForceMinCalories(patient.bia?.forceMinCalories !== undefined ? patient.bia.forceMinCalories : (localStorage.getItem('liberadiete_force_min_1200') !== 'false'));
    
    // Inizializza i parametri antropometrici e anagrafici dal profilo
    setBiaWeight(patient.weight || '');
    setBiaHeight(patient.height || '');
    setBiaAge(patient.age || '');
    setBiaGender(patient.gender || 'Femmina');

    // Inizializza i campi del prossimo controllo e dello storico
    setNextCheckupInput(patient.nextCheckupDate || '');
    setHistoryWeight(patient.weight || '');
    setHistoryFatMass(patient.bia?.fatMass || '');
    setHistoryMuscleMass(patient.bia?.muscleMass || '');
    setHistoryDate(new Date().toISOString().split('T')[0]);

    // Segna i messaggi del paziente come letti
    if (patient.messages && patient.messages.some(m => m.sender === 'patient' && !m.read)) {
      const updatedMessages = patient.messages.map(m => 
        m.sender === 'patient' ? { ...m, read: true } : m
      );
      if (onUpdatePatientProfile) {
        onUpdatePatientProfile(patient.id, { messages: updatedMessages });
      }
    }

    setSuccessMessage('');
    setParseError('');
  };

  // Salvataggio dei dati BIA nel profilo del paziente
  const handleSaveBia = () => {
    if (!selectedPatientId || !onUpdatePatientBia) return;
    
    // Aggiorna BIA
    onUpdatePatientBia(selectedPatientId, {
      fatMass: biaFatMass ? parseFloat(biaFatMass) : '',
      muscleMass: biaMuscleMass ? parseFloat(biaMuscleMass) : '',
      bmr: biaBmr ? parseFloat(biaBmr) : '',
      activityFactor: parseFloat(biaActivityFactor),
      target: biaTarget,
      forceMinCalories: forceMinCalories
    });

    // Aggiorna anagrafiche del profilo
    if (onUpdatePatientProfile) {
      onUpdatePatientProfile(selectedPatientId, {
        weight: biaWeight ? parseFloat(biaWeight) : '',
        height: biaHeight ? parseFloat(biaHeight) : '',
        age: biaAge ? parseInt(biaAge) : '',
        gender: biaGender
      });
    }

    setSuccessMessage('Dati BIA e parametri del paziente salvati nel profilo!');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  // Calcolo dei valori BIA derivati basato sugli stati reattivi della BIA
  const calculateBiaValues = () => {
    if (!selectedPatient) return null;

    const weightVal = biaWeight ? parseFloat(biaWeight) : (selectedPatient.weight || 70);
    const heightVal = biaHeight ? parseFloat(biaHeight) : (selectedPatient.height || 170);
    const ageVal = biaAge ? parseInt(biaAge) : (selectedPatient.age || 30);
    const genderVal = biaGender || selectedPatient.gender || 'Femmina';

    // Se BMR non è inserito, lo stimiamo usando Mifflin-St Jeor o Katch-McArdle se abbiamo la massa grassa
    let calculatedBmr;
    const biaBmrNum = biaBmr !== '' && biaBmr !== null && biaBmr !== undefined ? parseFloat(biaBmr) : 0;
    if (biaBmrNum > 0) {
      calculatedBmr = biaBmrNum;
    } else if (biaFatMass && !isNaN(parseFloat(biaFatMass))) {
      // Katch-McArdle: BMR = 370 + (21.6 * LBM)
      // LBM = peso * (1 - grasso%)
      const lbm = weightVal * (1 - parseFloat(biaFatMass) / 100);
      calculatedBmr = Math.round(370 + 21.6 * lbm);
    } else {
      // Mifflin-St Jeor
      if (genderVal === 'Maschio') {
        calculatedBmr = Math.round(10 * weightVal + 6.25 * heightVal - 5 * ageVal + 5);
      } else {
        calculatedBmr = Math.round(10 * weightVal + 6.25 * heightVal - 5 * ageVal - 161);
      }
    }

    const activityFactorNum = parseFloat(biaActivityFactor) || 1.2;
    const tdeeVal = Math.round(calculatedBmr * activityFactorNum);

    // Target calorico
    let rawTargetCaloriesVal = tdeeVal;
    if (biaTarget === 'DimagrimentoLieve') {
      rawTargetCaloriesVal = Math.round(tdeeVal * 0.90); // -10%
    } else if (biaTarget === 'DimagrimentoModerato') {
      rawTargetCaloriesVal = Math.round(tdeeVal * 0.85); // -15%
    } else if (biaTarget === 'DimagrimentoRapido') {
      rawTargetCaloriesVal = Math.round(tdeeVal * 0.80); // -20%
    } else if (biaTarget === 'Dimagrimento') {
      rawTargetCaloriesVal = Math.round(tdeeVal * 0.82); // -18% (retrocompatibilità)
    } else if (biaTarget === 'Massa') {
      rawTargetCaloriesVal = Math.round(tdeeVal * 1.12); // +12%
    }

    const isBelowMin = rawTargetCaloriesVal < 1200;
    let targetCaloriesVal = rawTargetCaloriesVal;
    if (isBelowMin && forceMinCalories) {
      targetCaloriesVal = 1200;
    }

    // Macro
    // Proteine: 2g per kg di massa muscolare se inserita, altrimenti 1.6g per kg di peso corporeo
    const pGrams = customRoundToTen(
      biaMuscleMass && !isNaN(parseFloat(biaMuscleMass))
        ? parseFloat(biaMuscleMass) * 2.0
        : weightVal * 1.6
    );
    const pKcal = pGrams * 4;

    // Grassi: 25% delle calorie
    const fKcal = targetCaloriesVal * 0.25;
    const fGrams = customRoundToTen(fKcal / 9);

    // Carboidrati: il resto
    const cKcal = Math.max(0, targetCaloriesVal - pKcal - fKcal);
    const cGrams = customRoundToTen(cKcal / 4);

    // Porzioni pranzo/cena (40% ciascuno)
    const mealRatio = 0.40;
    const suggestedPasta = customRoundToTen((cGrams * mealRatio) / 0.75);
    const suggestedPane = customRoundToTen((cGrams * mealRatio) / 0.50);
    const suggestedPatate = customRoundToTen((cGrams * mealRatio) / 0.20);

    const suggestedPollo = customRoundToTen((pGrams * mealRatio) / 0.22);
    const suggestedPesce = customRoundToTen((pGrams * mealRatio) / 0.18);

    const suggestedOlio = customRoundToTen(fGrams * mealRatio);

    return {
      bmr: calculatedBmr,
      tdee: tdeeVal,
      targetCalories: targetCaloriesVal,
      rawTargetCalories: rawTargetCaloriesVal,
      isBelowMin: isBelowMin,
      proteinGrams: pGrams,
      fatGrams: fGrams,
      carbGrams: cGrams,
      suggestedPasta,
      suggestedPane,
      suggestedPatate,
      suggestedPollo,
      suggestedPesce,
      suggestedOlio
    };
  };

  const biaResults = calculateBiaValues();

  // Caricamento del report BIA (PDF) ed estrazione parametri
  const handleBiaPdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsParsingBia(true);
    setParseError('');
    try {
      const text = await extractTextFromPdf(file, true);
      const data = parseBiaText(text);
      if (data) {
        if (data.fatMassPercent !== null && data.fatMassPercent !== undefined) setBiaFatMass(data.fatMassPercent);
        if (data.muscleMassKg !== null && data.muscleMassKg !== undefined) setBiaMuscleMass(data.muscleMassKg);
        if (data.bmr !== null && data.bmr !== undefined) setBiaBmr(data.bmr);
        if (data.weight !== null && data.weight !== undefined) {
          setBiaWeight(data.weight);
          setHistoryWeight(data.weight);
        }
        if (data.height !== null && data.height !== undefined) setBiaHeight(data.height);
        if (data.age !== null && data.age !== undefined) setBiaAge(data.age);
        if (data.gender) setBiaGender(data.gender);

        // Precompila anche lo storico misurazioni se ci sono dati
        if (data.fatMassPercent) setHistoryFatMass(data.fatMassPercent);
        if (data.muscleMassKg) setHistoryMuscleMass(data.muscleMassKg);

        setSuccessMessage('Dati estratti dal PDF BIA compilati con successo!');
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        setParseError('Impossibile estrarre i dati BIA dal PDF. Verifica il file.');
      }
    } catch (err) {
      console.error(err);
      setParseError(`Errore durante l'analisi del file BIA: ${err.message || err}`);
    } finally {
      setIsParsingBia(false);
    }
  };

  // Funzioni Integrazione Custom GPT
  const handleCopyGptPrompt = () => {
    if (!selectedPatient) return;
    const biaResultsVal = calculateBiaValues();

    const rule3 = includeWeeklyMenu
      ? `3. Genera anche la sezione "RIEPILOGO SETTIMANALE" in fondo, proponendo un menù specifico per ciascun giorno da Lunedì a Domenica (7 giorni diversi). Per pranzo e cena, crea una vera ricetta di piatto unico bilanciato combinando gli alimenti del piano aperto. Formatta la riga indicando prima il nome della ricetta, seguito tra parentesi dagli ingredienti esatti e le loro grammature separati dal simbolo '+' (es. "Pranzo: Risotto allo zafferano con bocconcini di pollo e zucchine (Riso integrale 80g + Petto di pollo 150g + Zucchine a volontà + Olio EVO 10g)").\n4. Genera e restituisci lo schema nutrizionale finale formattandolo TASSATIVAMENTE secondo la struttura e terminologia del seguente TEMPLATE OBBLIGATORIO (in modo che l'app possa caricarlo ed effettuare il parsing di tutte le alternative di sostituzione):`
      : `3. Genera e restituisci lo schema nutrizionale finale formattandolo TASSATIVAMENTE secondo la struttura e terminologia del seguente TEMPLATE OBBLIGATORIO (in modo che l'app possa caricarlo ed effettuare il parsing di tutte le alternative di sostituzione):`;

    const weeklySection = includeWeeklyMenu
      ? `\n\nRIEPILOGO SETTIMANALE
Lunedì
- Colazione: [Opzione colazione scelta]
- Spuntino mattina: [Opzione spuntino mattina scelta]
- Pranzo: [Nome ricetta piatto unico] ([Alimento Carboidrato] [grammatura] + [Alimento Proteico] [grammatura] + [Alimento Verdura] a volontà + [Alimento Condimento] [grammi o cucchiai])
- Merenda: [Opzione spuntino pomeriggio scelta]
- Cena: [Nome ricetta piatto unico] ([Alimento Carboidrato] [grammatura] + [Alimento Proteico] [grammatura] + [Alimento Verdura] a volontà + [Alimento Condimento] [grammi o cucchiai])

Martedì
[Ripeti la stessa struttura del Lunedì per Martedì, Mercoledì, Giovedì, Venerdì, Sabato e Domenica, creando ricette di piatti unici sempre differenti per ciascuno dei 7 giorni della settimana...]`
      : ``;

    const prompt = `Ecco i parametri e i dati BIA del paziente per cui elaborare il piano alimentare personalizzato:
- Nome: ${selectedPatient.name} ${selectedPatient.surname}
- Sesso: ${biaGender || selectedPatient.gender || 'Femmina'}
- Età: ${biaAge || selectedPatient.age || ''} anni
- Altezza: ${biaHeight || selectedPatient.height || ''} cm
- Peso Attuale: ${biaWeight || selectedPatient.weight || ''} kg
- Massa Grassa: ${biaFatMass || ''}%
- Massa Muscolare: ${biaMuscleMass || ''} kg
- BMR (Metabolismo Basale): ${biaResultsVal ? biaResultsVal.bmr : ''} kcal
- TDEE (Fabbisogno Giornaliero): ${biaResultsVal ? biaResultsVal.tdee : ''} kcal
- Calorie Target (${targetLabels[biaTarget] || biaTarget}): ${biaResultsVal ? biaResultsVal.targetCalories : ''} kcal
- Livello Attività: ${biaActivityFactor}

Ripartizione Macro Consigliata:
- Carboidrati: ${biaResultsVal ? biaResultsVal.carbGrams : ''}g
- Proteine: ${biaResultsVal ? biaResultsVal.proteinGrams : ''}g
- Grassi: ${biaResultsVal ? biaResultsVal.fatGrams : ''}g

Porzioni a pasto consigliate (40% ciascuno pranzo/cena):
- Pasta/Riso crudi (Pranzo): ${biaResultsVal ? biaResultsVal.suggestedPasta : ''}g
- Pane integrale (Cena): ${biaResultsVal ? biaResultsVal.suggestedPane : ''}g
- Carne/Pollo: ${biaResultsVal ? biaResultsVal.suggestedPollo : ''}g
- Pesce magro: ${biaResultsVal ? biaResultsVal.suggestedPesce : ''}g
- Olio EVO: ${biaResultsVal ? biaResultsVal.suggestedOlio : ''}g

ISTRUZIONI DI ELABORAZIONE PER IL CUSTOM GPT:
Sei un Custom GPT pre-istruito con un "Piano Aperto di Riferimento" contenente un elenco completo di alimenti e le loro relative opzioni di sostituzione/alternative per ciascun pasto (Colazione, Spuntino Metà Mattina, Spuntino Pomeriggio/Merenda, Carboidrati Pranzo/Cena, Proteine Pranzo/Cena, Verdure Pranzo/Cena, Grassi/Condimenti durante la giornata).

Devi elaborare lo schema nutrizionale rispettando le seguenti regole:
1. Calcola le grammature per ogni alimento in base dei dati BIA e alle porzioni consigliate sopra.
2. Includi ed elenca TUTTI gli alimenti e TUTTE le alternative/opzioni di sostituzione presenti nel "Piano Aperto di Riferimento" con cui sei stato configurato ed istruito nelle tue istruzioni e nella tua base di conoscenza (nessun alimento o opzione alternativa deve essere tralasciato).
${rule3}

COLAZIONE
- [Opzione colazione principale con grammatura]
- [Opzione colazione alternativa 1 con grammatura]
- [Opzione colazione alternativa 2 con grammatura]
- [Tutte le altre opzioni/alternative di colazione...]

SPUNTINI
- [Opzione spuntino mattina principale con grammatura]
- [Opzione spuntino mattina alternativa 1 con grammatura]
- [Opzione spuntino pomeriggio/merenda principale con grammatura]
- [Opzione spuntino pomeriggio/merenda alternativa 1 con grammatura]
- [Tutte le altre opzioni/alternative di spuntini...]

PRANZO
CARBOIDRATI
- [Alimento Carboidrato 1] [grammatura]
- [Alimento Carboidrato 2] [grammatura]
- [Tutte le altre opzioni alternative di carboidrati pranzo...]
PROTEINE
- [Alimento Proteico 1] [grammatura]
- [Alimento Proteico 2] [grammatura]
- [Tutte le altre opzioni alternative di proteine pranzo...]
VERDURE
- [Alimento Verdura 1] a volontà
- [Alimento Verdura 2] a volontà
- [Tutte le altre opzioni alternative di verdure pranzo...]
GRASSI
- [Alimento Condimento 1] [grammi o cucchiai]
- [Alimento Condimento 2] [grammi o cucchiai]
- [Tutte le altre opzioni alternative di condimenti pranzo...]

CENA
CARBOIDRATI
- [Alimento Carboidrato 1] [grammatura]
- [Alimento Carboidrato 2] [grammatura]
- [Tutte le altre opzioni alternative di carboidrati cena...]
PROTEINE
- [Alimento Proteico 1] [grammatura]
- [Alimento Proteico 2] [grammatura]
- [Tutte le altre opzioni alternative di proteine cena...]
VERDURE
- [Alimento Verdura 1] a volontà
- [Alimento Verdura 2] a volontà
- [Tutte le altre opzioni alternative di verdure cena...]
GRASSI
- [Alimento Condimento 1] [grammi o cucchiai]
- [Alimento Condimento 2] [grammi o cucchiai]
- [Tutte le altre opzioni alternative di condimenti cena...]${weeklySection}

IMPORTANTE: Non inserire commenti personali, saluti, spiegazioni, formule matematiche o note aggiuntive. Restituisci esclusivamente lo schema compilato rispettando il template all'interno di un unico blocco di codice markdown grezzo (utilizzando le triple virgolette rovesciate \`\`\` all'inizio e alla fine del blocco di codice), in modo che io possa copiarlo rapidamente con un solo clic usando il pulsante 'Copy code' di ChatGPT.`;

    navigator.clipboard.writeText(prompt);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 4000);
  };

  const handleOpenCustomGpt = (url) => {
    if (!url) return;
    window.open(url, '_blank');
  };

  const handleOpenGptInApp = (url) => {
    if (!url) return;
    setActiveGptUrl(url);
    setShowGptPanel(true);
  };

  const handleCopyGptPrompt2 = () => {
    if (!selectedPatient) return;
    const biaResultsVal = calculateBiaValues();

    const rule3 = includeWeeklyMenu
      ? `3. Genera anche la sezione "RIEPILOGO SETTIMANALE" in fondo, proponendo un menù specifico per ciascun giorno da Lunedì a Domenica (7 giorni diversi). Per pranzo e cena, crea una vera ricetta di piatto unico bilanciato combinando gli alimenti del piano aperto. Formatta la riga indicando prima il nome della ricetta, seguito tra parentesi dagli ingredienti esatti e le loro grammature separati dal simbolo '+' (es. "Pranzo: Risotto allo zafferano con bocconcini di pollo e zucchine (Riso integrale 80g + Petto di pollo 150g + Zucchine a volontà + Olio EVO 10g)").\n4. Genera e restituisci lo schema nutrizionale finale formattandolo TASSATIVAMENTE secondo la struttura e terminologia del seguente TEMPLATE OBBLIGATORIO (in modo che l'app possa caricarlo ed effettuare il parsing di tutte le alternative di sostituzione):`
      : `3. Genera e restituisci lo schema nutrizionale finale formattandolo TASSATIVAMENTE secondo la struttura e terminologia del seguente TEMPLATE OBBLIGATORIO (in modo che l'app possa caricarlo ed effettuare il parsing di tutte le alternative di sostituzione):`;

    const weeklySection = includeWeeklyMenu
      ? `\n\nRIEPILOGO SETTIMANALE
Lunedì
- Colazione: [Opzione colazione scelta]
- Spuntino mattina: [Opzione spuntino mattina scelta]
- Pranzo: [Nome ricetta piatto unico] ([Alimento Carboidrato] [grammatura] + [Alimento Proteico] [grammatura] + [Alimento Verdura] a volontà + [Alimento Condimento] [grammi o cucchiai])
- Merenda: [Opzione spuntino pomeriggio scelta]
- Cena: [Nome ricetta piatto unico] ([Alimento Carboidrato] [grammatura] + [Alimento Proteico] [grammatura] + [Alimento Verdura] a volontà + [Alimento Condimento] [grammi o cucchiai])

Martedì
[Ripeti la stessa struttura del Lunedì per Martedì, Mercoledì, Giovedì, Venerdì, Sabato e Domenica, creando ricette di piatti unici sempre differenti per ciascuno dei 7 giorni della settimana...]`
      : ``;

    const prompt = `Ecco i parametri e i dati BIA del paziente per cui elaborare il piano alimentare personalizzato:
- Nome: ${selectedPatient.name} ${selectedPatient.surname}
- Sesso: ${biaGender || selectedPatient.gender || 'Femmina'}
- Età: ${biaAge || selectedPatient.age || ''} anni
- Altezza: ${biaHeight || selectedPatient.height || ''} cm
- Peso Attuale: ${biaWeight || selectedPatient.weight || ''} kg
- Massa Grassa: ${biaFatMass || ''}%
- Massa Muscolare: ${biaMuscleMass || ''} kg
- BMR (Metabolismo Basale): ${biaResultsVal ? biaResultsVal.bmr : ''} kcal
- TDEE (Fabbisogno Giornaliero): ${biaResultsVal ? biaResultsVal.tdee : ''} kcal
- Calorie Target (${targetLabels[biaTarget] || biaTarget}): ${biaResultsVal ? biaResultsVal.targetCalories : ''} kcal
- Livello Attività: ${biaActivityFactor}

Ripartizione Macro Consigliata:
- Carboidrati: ${biaResultsVal ? biaResultsVal.carbGrams : ''}g
- Proteine: ${biaResultsVal ? biaResultsVal.proteinGrams : ''}g
- Grassi: ${biaResultsVal ? biaResultsVal.fatGrams : ''}g

Porzioni a pasto consigliate (40% ciascuno pranzo/cena):
- Pasta/Riso crudi (Pranzo): ${biaResultsVal ? biaResultsVal.suggestedPasta : ''}g
- Pane integrale (Cena): ${biaResultsVal ? biaResultsVal.suggestedPane : ''}g
- Carne/Pollo: ${biaResultsVal ? biaResultsVal.suggestedPollo : ''}g
- Pesce magro: ${biaResultsVal ? biaResultsVal.suggestedPesce : ''}g
- Olio EVO: ${biaResultsVal ? biaResultsVal.suggestedOlio : ''}g

ISTRUZIONI DI ELABORAZIONE PER IL CUSTOM GPT:
Sei un Custom GPT pre-istruito con un "Piano Aperto di Riferimento" contenente un elenco completo di alimenti e le loro relative opzioni di sostituzione/alternative per ciascun pasto (Colazione, Spuntino Metà Mattina, Spuntino Pomeriggio/Merenda, Carboidrati Pranzo/Cena, Proteine Pranzo/Cena, Verdure Pranzo/Cena, Grassi/Condimenti durante la giornata).

Devi elaborare lo schema nutrizionale rispettando le seguenti regole:
1. Calcola le grammature per ogni alimento in base dei dati BIA e alle porzioni consigliate sopra.
2. Includi ed elenca TUTTI gli alimenti e TUTTE le alternative/opzioni di sostituzione presenti nel "Piano Aperto di Riferimento" con cui sei stato configurato ed istruito nelle tue istruzioni e nella tua base di conoscenza (nessun alimento o opzione alternativa deve essere tralasciato).
${rule3}

COLAZIONE
- [Opzione colazione principale con grammatura]
- [Opzione colazione alternativa 1 con grammatura]
- [Opzione colazione alternativa 2 con grammatura]
- [Tutte le altre opzioni/alternative di colazione...]

SPUNTINI
- [Opzione spuntino mattina principale con grammatura]
- [Opzione spuntino mattina alternativa 1 con grammatura]
- [Opzione spuntino pomeriggio/merenda principale con grammatura]
- [Opzione spuntino pomeriggio/merenda alternativa 1 con grammatura]
- [Tutte le altre opzioni/alternative di spuntini...]

PRANZO
CARBOIDRATI
- [Alimento Carboidrato 1] [grammatura]
- [Alimento Carboidrato 2] [grammatura]
- [Tutte le altre opzioni alternative di carboidrati pranzo...]
PROTEINE
- [Alimento Proteico 1] [grammatura]
- [Alimento Proteico 2] [grammatura]
- [Tutte le altre opzioni alternative di proteine pranzo...]
VERDURE
- [Alimento Verdura 1] a volontà
- [Alimento Verdura 2] a volontà
- [Tutte le altre opzioni alternative di verdure pranzo...]
GRASSI
- [Alimento Condimento 1] [grammi o cucchiai]
- [Alimento Condimento 2] [grammi o cucchiai]
- [Tutte le altre opzioni alternative di condimenti pranzo...]

CENA
CARBOIDRATI
- [Alimento Carboidrato 1] [grammatura]
- [Alimento Carboidrato 2] [grammatura]
- [Tutte le altre opzioni alternative di carboidrati cena...]
PROTEINE
- [Alimento Proteico 1] [grammatura]
- [Alimento Proteico 2] [grammatura]
- [Tutte le altre opzioni alternative di proteine cena...]
VERDURE
- [Alimento Verdura 1] a volontà
- [Alimento Verdura 2] a volontà
- [Tutte le altre opzioni alternative di verdure cena...]
GRASSI
- [Alimento Condimento 1] [grammi o cucchiai]
- [Alimento Condimento 2] [grammi o cucchiai]
- [Tutte le altre opzioni alternative di condimenti cena...]${weeklySection}

IMPORTANTE: Non inserire commenti personali, saluti, spiegazioni, formule matematiche o note aggiuntive. Restituisci esclusivamente lo schema compilato rispettando il template all'interno di un unico blocco di codice markdown grezzo (utilizzando le triple virgolette rovesciate \`\`\` all'inizio e alla fine del blocco di codice), in modo that io possa copiarlo rapidamente con un solo clic usando il pulsante 'Copy code' di ChatGPT.`;

    navigator.clipboard.writeText(prompt);
    setCopySuccess2(true);
    setTimeout(() => setCopySuccess2(false), 4000);
  };

  const handleApplyBiaPortions = () => {
    if (!tempDiet || !biaResults) return;

    const updatedDiet = { ...tempDiet };
    const isEmpty = (cat) => !updatedDiet[cat] || updatedDiet[cat].length === 0;

    const { suggestedPasta, suggestedPane, suggestedPatate, suggestedPollo, suggestedPesce, suggestedOlio } = biaResults;

    // 1. Pranzo Carboidrati
    if (isEmpty('pranzoCarboidrati')) {
      updatedDiet.pranzoCarboidrati = [
        { id: `p-carb-1-${Date.now()}`, food: "Pasta integrale", quantity: `${suggestedPasta}g` },
        { id: `p-carb-2-${Date.now()}`, food: "Riso Basmati", quantity: `${suggestedPasta}g` }
      ];
    } else {
      updatedDiet.pranzoCarboidrati = updatedDiet.pranzoCarboidrati.map(item => ({
        ...item,
        quantity: item.food.toLowerCase().includes('riso') || item.food.toLowerCase().includes('pasta') || item.food.toLowerCase().includes('quinoa') || item.food.toLowerCase().includes('farro')
          ? `${suggestedPasta}g`
          : item.quantity || `${suggestedPasta}g`
      }));
    }

    // 2. Pranzo Proteine
    if (isEmpty('pranzoProteine')) {
      updatedDiet.pranzoProteine = [
        { id: `p-prot-1-${Date.now()}`, food: "Petto di pollo ai ferri", quantity: `${suggestedPollo}g` },
        { id: `p-prot-2-${Date.now()}`, food: "Filetto di orata o merluzzo", quantity: `${suggestedPesce}g` }
      ];
    } else {
      updatedDiet.pranzoProteine = updatedDiet.pranzoProteine.map(item => ({
        ...item,
        quantity: item.food.toLowerCase().includes('pesce') || item.food.toLowerCase().includes('orata') || item.food.toLowerCase().includes('merluzzo') || item.food.toLowerCase().includes('branzino')
          ? `${suggestedPesce}g`
          : `${suggestedPollo}g`
      }));
    }

    // 3. Pranzo Grassi
    if (isEmpty('pranzoGrassi')) {
      updatedDiet.pranzoGrassi = [
        { id: `p-fat-1-${Date.now()}`, food: "Olio Extravergine d'Oliva (EVO)", quantity: `${suggestedOlio}g` }
      ];
    } else {
      updatedDiet.pranzoGrassi = updatedDiet.pranzoGrassi.map(item => ({
        ...item,
        quantity: item.food.toLowerCase().includes('olio') ? `${suggestedOlio}g` : item.quantity || `${suggestedOlio}g`
      }));
    }

    // 4. Cena Carboidrati
    if (isEmpty('cenaCarboidrati')) {
      updatedDiet.cenaCarboidrati = [
        { id: `c-carb-1-${Date.now()}`, food: "Pane integrale", quantity: `${suggestedPane}g` },
        { id: `c-carb-2-${Date.now()}`, food: "Patate al vapore", quantity: `${suggestedPatate}g` }
      ];
    } else {
      updatedDiet.cenaCarboidrati = updatedDiet.cenaCarboidrati.map(item => ({
        ...item,
        quantity: item.food.toLowerCase().includes('pane') 
          ? `${suggestedPane}g` 
          : item.food.toLowerCase().includes('patate') 
            ? `${suggestedPatate}g` 
            : `${suggestedPane}g`
      }));
    }

    // 5. Cena Proteine
    if (isEmpty('cenaProteine')) {
      updatedDiet.cenaProteine = [
        { id: `c-prot-1-${Date.now()}`, food: "Filetto di salmone fresco", quantity: `${suggestedPollo - 20}g` },
        { id: `c-prot-2-${Date.now()}`, food: "Uova biologiche", quantity: "2 uova" }
      ];
    } else {
      updatedDiet.cenaProteine = updatedDiet.cenaProteine.map(item => ({
        ...item,
        quantity: item.food.toLowerCase().includes('pesce') || item.food.toLowerCase().includes('orata') || item.food.toLowerCase().includes('merluzzo') || item.food.toLowerCase().includes('salmone')
          ? `${suggestedPesce}g`
          : item.food.toLowerCase().includes('uova') ? "2 uova" : `${suggestedPollo}g`
      }));
    }

    // 6. Cena Grassi
    if (isEmpty('cenaGrassi')) {
      updatedDiet.cenaGrassi = [
        { id: `c-fat-1-${Date.now()}`, food: "Olio Extravergine d'Oliva (EVO)", quantity: `${suggestedOlio}g` }
      ];
    } else {
      updatedDiet.cenaGrassi = updatedDiet.cenaGrassi.map(item => ({
        ...item,
        quantity: item.food.toLowerCase().includes('olio') ? `${suggestedOlio}g` : item.quantity || `${suggestedOlio}g`
      }));
    }

    // Colazione e Spuntini base se vuoti
    if (isEmpty('colazione')) {
      updatedDiet.colazione = [
        { id: `col-1-${Date.now()}`, content: `Yogurt greco magro (150g) + Fiocchi d'avena (40g) + Mirtilli (50g)` },
        { id: `col-2-${Date.now()}`, content: `Latte parzialmente scremato (200ml) + 4 Fette biscottate con un velo di marmellata` }
      ];
    }
    if (isEmpty('spuntini')) {
      updatedDiet.spuntini = [
        { id: `spu-1-${Date.now()}`, content: `Una mela (150g) + Mandorle (15g)` },
        { id: `spu-2-${Date.now()}`, content: `Yogurt bianco naturale (125g)` }
      ];
    }

    setTempDiet(updatedDiet);
    setSuccessMessage("Grammature calcolate in base alla BIA applicate con successo all'editor! Ricordati di cliccare su 'Salva Dieta' per confermare.");
    setTimeout(() => setSuccessMessage(''), 6000);
  };

  // Gestione Upload e parsing del file (PDF o TXT)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsParsing(true);
    setParseError('');
    setSuccessMessage('');

    try {
      let rawText = '';
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        rawText = await extractTextFromPdf(file);
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        rawText = await file.text();
      } else {
        throw new Error('Formato non supportato. Carica un file PDF o TXT.');
      }
      
      // Parsifica il testo
      const parsedDiet = parseDietText(rawText);
      
      // Controlla se abbiamo estratto qualcosa
      const hasContent = Object.values(parsedDiet).some(arr => arr.length > 0);
      
      if (!hasContent) {
        setParseError('Non siamo riusciti a estrarre cibo strutturato automaticamente dal file. Puoi inserirlo manualmente qui sotto.');
      } else {
        setSuccessMessage('File letto con successo! Controlla e modifica le opzioni estratte nelle schede sottostanti.');
      }
      
      setTempDiet(parsedDiet);
    } catch (err) {
      console.error(err);
      setParseError('Errore durante la lettura del file. Assicurati che sia un file di testo (.txt) o un PDF testuale non protetto.');
    } finally {
      setIsParsing(false);
    }
  };

  // Gestione elaborazione del testo incollato
  const handleProcessPastedText = () => {
    if (!pastedText.trim()) return;

    setIsParsing(true);
    setParseError('');
    setSuccessMessage('');

    try {
      const parsedDiet = parseDietText(pastedText);
      const hasContent = Object.values(parsedDiet).some(arr => arr.length > 0);
      
      if (!hasContent) {
        setParseError('Non siamo riusciti ad estrarre cibo strutturato dal testo incollato. Controlla che contenga parole chiave come Colazione, Spuntini, Carboidrati, Proteine, Verdure, Grassi.');
      } else {
        setSuccessMessage('Testo elaborato con successo! Controlla e modifica le opzioni estratte nelle schede sottostanti.');
        setTempDiet(parsedDiet);
        setPastedText(''); // Pulisce la textarea
      }
    } catch (err) {
      console.error(err);
      setParseError('Errore durante l\'elaborazione del testo. Assicurati che sia in formato leggibile.');
    } finally {
      setIsParsing(false);
    }
  };

  // Funzioni per modificare le liste della dieta temporanea
  const addDietItem = (category) => {
    const id = `${category.slice(0,3)}-${Date.now()}`;
    setTempDiet(prev => {
      const copy = { ...prev };
      if (category === 'colazione' || category === 'spuntini') {
        copy[category] = [...copy[category], { id, content: '' }];
      } else {
        copy[category] = [...copy[category], { id, food: '', quantity: '' }];
      }
      return copy;
    });
  };

  const removeDietItem = (category, id) => {
    setTempDiet(prev => {
      const copy = { ...prev };
      copy[category] = copy[category].filter(item => item.id !== id);
      return copy;
    });
  };

  const updateDietItemValue = (category, id, field, value) => {
    setTempDiet(prev => {
      const copy = { ...prev };
      copy[category] = copy[category].map(item => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      });
      return copy;
    });
  };

  const handleSaveDiet = () => {
    if (!selectedPatientId || !tempDiet) return;
    
    // Rimuoviamo elementi vuoti prima di salvare
    const cleanedDiet = {
      colazione: tempDiet.colazione.filter(item => item.content.trim() !== ''),
      spuntini: tempDiet.spuntini.filter(item => item.content.trim() !== ''),
      pranzoCarboidrati: tempDiet.pranzoCarboidrati.filter(item => item.food.trim() !== ''),
      pranzoProteine: tempDiet.pranzoProteine.filter(item => item.food.trim() !== ''),
      pranzoVerdure: tempDiet.pranzoVerdure.filter(item => item.food.trim() !== ''),
      pranzoGrassi: tempDiet.pranzoGrassi.filter(item => item.food.trim() !== ''),
      cenaCarboidrati: tempDiet.cenaCarboidrati.filter(item => item.food.trim() !== ''),
      cenaProteine: tempDiet.cenaProteine.filter(item => item.food.trim() !== ''),
      cenaVerdure: tempDiet.cenaVerdure.filter(item => item.food.trim() !== ''),
      cenaGrassi: tempDiet.cenaGrassi.filter(item => item.food.trim() !== ''),
      ...(tempDiet.weeklyMenu ? { weeklyMenu: tempDiet.weeklyMenu } : {})
    };

    onUpdatePatientDiet(selectedPatientId, cleanedDiet);
    setSuccessMessage('Dieta salvata ed associata al paziente correttamente!');
    setTempDiet(cleanedDiet);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const renderSvgChart = (data, valueKey, label, color, suffix = '', yMinOffset = 5, yMaxOffset = 5) => {
    if (!data || data.length === 0) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', background: 'rgba(255,255,255,0.4)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
          Nessun dato disponibile per il grafico.
        </div>
      );
    }

    if (data.length === 1) {
      const val = data[0][valueKey];
      return (
        <div style={{ padding: '1.5rem', textAlign: 'center', background: '#fff', borderRadius: '16px', border: '1.5px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Rilevazione del {new Date(data[0].date).toLocaleDateString('it-IT')}</span>
          <strong style={{ fontSize: '1.8rem', color, display: 'block', margin: '0.5rem 0' }}>{val}{suffix}</strong>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Aggiungi più misurazioni per visualizzare il grafico di andamento.</span>
        </div>
      );
    }

    const width = 480;
    const height = 200;
    const paddingLeft = 45;
    const paddingRight = 20;
    const paddingTop = 25;
    const paddingBottom = 30;

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

    const gradientId = `grad-${valueKey}`;

    return (
      <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-soft)', boxShadow: 'var(--shadow-sm)' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </span>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ minWidth: '400px', display: 'block' }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.2" />
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
                  stroke="#f3f4f6" 
                  strokeWidth="1" 
                  strokeDasharray="4 4" 
                />
                <text 
                  x={paddingLeft - 8} 
                  y={gl.y + 4} 
                  textAnchor="end" 
                  fill="#9ca3af" 
                  fontSize="9" 
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
                  r="4" 
                  fill="#ffffff" 
                  stroke={color} 
                  strokeWidth="2" 
                />
                <text 
                  x={p.x} 
                  y={p.y - 8} 
                  textAnchor="middle" 
                  fill="#1f2937" 
                  fontSize="9" 
                  fontWeight="700"
                >
                  {p.val}{suffix}
                </text>
                <text 
                  x={p.x} 
                  y={height - 8} 
                  textAnchor="middle" 
                  fill="#9ca3af" 
                  fontSize="9" 
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

  const renderTrendsChart = (patient) => {
    const history = patient.history || [];
    const sortedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <style>{`
          @media (min-width: 992px) {
            .charts-container-grid { grid-template-columns: repeat(3, 1fr) !important; }
          }
        `}</style>
        <div className="charts-container-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
          {renderSvgChart(sortedHistory, 'weight', 'Andamento Peso', '#d63384', ' kg', 2, 2)}
          {renderSvgChart(sortedHistory, 'fatMass', 'Massa Grassa %', '#f43f5e', '%', 1.5, 1.5)}
          {renderSvgChart(sortedHistory, 'muscleMass', 'Massa Muscolare', '#10b981', ' kg', 2, 2)}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-view" style={{ animation: 'modalSlide 0.4s ease' }}>
      
      {/* VISTA PRINCIPALE: LISTA PAZIENTI */}
      {!selectedPatient && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ color: 'var(--primary)', marginBottom: '0.25rem', fontSize: '2rem' }}>Dashboard Medico</h1>
              <p style={{ color: 'var(--text-muted)' }}>Gestisci i tuoi pazienti e carica i file PDF delle loro diete</p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? <ArrowLeft size={18} /> : <UserPlus size={18} />}
              {showAddForm ? 'Annulla' : 'Nuovo Paziente'}
            </button>
          </div>

          {/* Centro Notifiche Messaggi */}
          {(() => {
            const patientsWithUnreadMessages = patients.filter(p => {
              const msgs = p.messages || [];
              return msgs.some(m => m.sender === 'patient' && !m.read);
            });
            const totalUnreadMessages = patientsWithUnreadMessages.reduce((sum, p) => {
              const count = p.messages.filter(m => m.sender === 'patient' && !m.read).length;
              return sum + count;
            }, 0);

            if (totalUnreadMessages === 0) return null;

            return (
              <div className="glass-card" style={{ 
                padding: '1.25rem 1.5rem', 
                marginBottom: '1.5rem', 
                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
                border: '1.5px solid rgba(214, 51, 132, 0.25)',
                borderRadius: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                    <span>🔔</span>
                    <strong style={{ fontSize: '0.95rem' }}>
                      Centro Notifiche Messaggi: hai {totalUnreadMessages} {totalUnreadMessages === 1 ? 'messaggio non letto' : 'messaggi non letti'}
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Dei tuoi pazienti attivi</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {patientsWithUnreadMessages.map(p => {
                    const patientUnread = p.messages.filter(m => m.sender === 'patient' && !m.read);
                    const lastMsg = patientUnread[patientUnread.length - 1];
                    return (
                      <div 
                        key={p.id} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          background: '#fff', 
                          padding: '0.75rem 1rem', 
                          borderRadius: '12px',
                          border: '1px solid var(--border-soft)',
                          boxShadow: 'var(--shadow-sm)',
                          gap: '1rem'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', flex: 1 }}>
                          <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-color)' }}>
                            👤 {p.name} {p.surname} ({patientUnread.length} {patientUnread.length === 1 ? 'nuovo messaggio' : 'nuovi messaggi'})
                          </span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            Ultimo: "{lastMsg?.text?.length > 70 ? lastMsg.text.slice(0, 70) + '...' : lastMsg?.text}"
                          </span>
                        </div>
                        <button 
                          className="btn btn-primary btn-sm"
                          style={{ padding: '0.45rem 1rem', borderRadius: '18px', fontSize: '0.78rem', flexShrink: 0 }}
                          onClick={() => handleSelectPatient(p)}
                        >
                          Rispondi
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          <div className="grid-cols-2">
            {/* Form Aggiungi Paziente */}
            {showAddForm && (
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserPlus size={20} /> Anagrafica Paziente
                </h2>
                <form onSubmit={handleAddPatientSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Nome *</label>
                      <input 
                        type="text" 
                        required 
                        className="form-input" 
                        placeholder="Es. Mario"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Cognome *</label>
                      <input 
                        type="text" 
                        required 
                        className="form-input" 
                        placeholder="Es. Rossi"
                        value={newSurname}
                        onChange={(e) => setNewSurname(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Età (Anni)</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="Es. 34"
                        value={newAge}
                        onChange={(e) => setNewAge(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Sesso</label>
                      <select 
                        className="form-input"
                        value={newGender}
                        onChange={(e) => setNewGender(e.target.value)}
                      >
                        <option value="Femmina">Femmina</option>
                        <option value="Maschio">Maschio</option>
                        <option value="Altro">Altro</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Peso (kg)</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        className="form-input" 
                        placeholder="Es. 70"
                        value={newWeight}
                        onChange={(e) => setNewWeight(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '0.5rem' }}>
                    <label className="form-label">Altezza (cm)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="Es. 175"
                      value={newHeight}
                      onChange={(e) => setNewHeight(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ marginTop: '0.5rem' }}>
                    <label className="form-label">Note Cliniche / Obiettivi</label>
                    <textarea 
                      className="form-input" 
                      rows="3" 
                      placeholder="Allergie, intolleranze, fabbisogno energetico..."
                      style={{ resize: 'vertical' }}
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                    Salva Paziente
                  </button>
                </form>
              </div>
            )}

            {/* Lista Pazienti */}
            <div className={showAddForm ? '' : 'grid-span-2'} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                <Users size={20} /> Pazienti Attivi ({patients.length})
              </h2>
              {patients.length === 0 ? (
                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Non ci sono ancora pazienti registrati. Creane uno per iniziare!
                </div>
              ) : (
                patients.map(p => (
                  <div 
                    key={p.id} 
                    className="glass-card patient-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSelectPatient(p)}
                  >
                    <div className="patient-info">
                      <div className="patient-avatar">
                        {p.name[0]}{p.surname[0]}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{p.name} {p.surname}</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span>{p.age ? `${p.age} anni` : ''} {p.gender} | {p.weight ? `${p.weight} kg` : ''} {p.height ? `| ${p.height} cm` : ''}</span>
                          <span style={{ background: 'var(--primary-bg)', color: 'var(--primary)', padding: '0.1rem 0.4rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                            🔑 PIN: {p.pin || 'Generando...'}
                          </span>
                          <span style={{ 
                            background: getPatientChatCountToday(p.id) >= 10 ? 'rgba(220, 38, 38, 0.1)' : 'var(--primary-bg)', 
                            color: getPatientChatCountToday(p.id) >= 10 ? 'var(--danger)' : 'var(--primary)', 
                            padding: '0.1rem 0.4rem', 
                            borderRadius: '6px', 
                            fontSize: '0.72rem', 
                            fontWeight: 700 
                          }}>
                            💬 Chat oggi: {getPatientChatCountToday(p.id)}/10
                          </span>
                          {p.messages?.some(m => m.sender === 'patient' && !m.read) && (
                            <span style={{ 
                              background: '#fee2e2', 
                              color: 'var(--danger)', 
                              padding: '0.1rem 0.4rem', 
                              borderRadius: '6px', 
                              fontSize: '0.72rem', 
                              fontWeight: 800,
                              border: '1px solid rgba(220, 38, 38, 0.25)'
                            }}>
                              ✉️ Messaggio da rispondere ({p.messages.filter(m => m.sender === 'patient' && !m.read).length})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '12px',
                        background: p.diet && Object.values(p.diet).some(arr => arr.length > 0) ? 'var(--primary-bg)' : '#fee2e2',
                        color: p.diet && Object.values(p.diet).some(arr => arr.length > 0) ? 'var(--primary)' : 'var(--danger)',
                        fontWeight: 'bold'
                      }}>
                        {p.diet && Object.values(p.diet).some(arr => arr.length > 0) ? 'Dieta Attiva' : 'Nessuna Dieta'}
                      </span>
                      <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* DETTAGLIO PAZIENTE E CARICAMENTO/REVIEW DIETA */}
      {selectedPatient && (
        <div>
          {/* Header Paziente */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <button className="btn btn-outline btn-sm" onClick={() => setSelectedPatientId(null)}>
              <ArrowLeft size={16} /> Torna ai pazienti
            </button>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="patient-avatar" style={{ width: '3rem', height: '3rem', fontSize: '1.1rem' }}>
                {selectedPatient.name[0]}{selectedPatient.surname[0]}
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{selectedPatient.name} {selectedPatient.surname}</h2>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {selectedPatient.notes || "Nessuna nota clinica inserita"}
                </p>
              </div>
            </div>
            
            {/* Modifica PIN Paziente, Stato Chat AI & Stampa Istruzioni */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              
              {/* Stato Chat AI */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                background: getPatientChatCountToday(selectedPatient.id) >= 10 ? 'rgba(220, 38, 38, 0.08)' : 'var(--primary-bg)', 
                padding: '0.5rem 1rem', 
                borderRadius: '12px', 
                border: `1.5px solid ${getPatientChatCountToday(selectedPatient.id) >= 10 ? 'var(--danger)' : 'var(--primary-light)'}` 
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: getPatientChatCountToday(selectedPatient.id) >= 10 ? 'var(--danger)' : 'var(--primary)' }}>💬 Chat Oggi:</span>
                <span style={{ 
                  fontWeight: 800, 
                  fontSize: '0.95rem', 
                  color: getPatientChatCountToday(selectedPatient.id) >= 10 ? 'var(--danger)' : 'var(--primary)' 
                }}>
                  {getPatientChatCountToday(selectedPatient.id)} / 10
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>(Limite giornaliero)</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--primary-bg)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>🔑 PIN:</span>
                <input
                  type="text"
                  maxLength={4}
                  style={{
                    width: '60px',
                    textAlign: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                    padding: '0.2rem',
                    border: '1.5px solid var(--primary)',
                    borderRadius: '6px',
                    color: 'var(--primary)',
                    background: '#fff'
                  }}
                  value={selectedPatient.pin || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (onUpdatePatientPin) {
                      onUpdatePatientPin(selectedPatient.id, val);
                    }
                  }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(4 cifre)</span>
              </div>

              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => handlePrintPatientInstructions(selectedPatient)}
                style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.4rem', borderRadius: '12px', height: '100%' }}
              >
                <FileText size={16} />
                Scarica Istruzioni PDF
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginBottom: '2rem', alignItems: 'start' }}>
            
            {/* COLONNA SINISTRA: BIA & COMPOSIZIONE CORPOREA */}
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <Activity className="text-primary" size={22} style={{ color: 'var(--primary)' }} />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)' }}>
                  Analisi Composizione Corporea (BIA) & Fabbisogni
                </h3>
              </div>

              {/* Uploader PDF BIA */}
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(214, 51, 132, 0.04) 0%, rgba(255, 110, 180, 0.04) 100%)', 
                border: '1.5px dashed var(--primary-light)', 
                borderRadius: '12px', 
                padding: '1rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                marginBottom: '0.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.82rem' }}>
                  <UploadCloud size={18} />
                  <span>Importa da Report BIA (PDF)</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Carica il PDF del report BIA per compilare in automatico la scheda
                </p>
                <input 
                  type="file" 
                  accept="application/pdf" 
                  onChange={handleBiaPdfUpload}
                  style={{ display: 'none' }}
                  id="bia-pdf-upload"
                  disabled={isParsingBia}
                />
                <label 
                  htmlFor="bia-pdf-upload"
                  className="btn btn-outline btn-sm"
                  style={{ 
                    alignSelf: 'center', 
                    padding: '0.35rem 0.9rem', 
                    fontSize: '0.72rem', 
                    cursor: 'pointer',
                    background: '#ffffff',
                    marginTop: '0.2rem'
                  }}
                >
                  {isParsingBia ? 'Lettura in corso...' : 'Seleziona PDF BIA'}
                </label>
              </div>

              {/* Form Input Parametri Fisici */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Peso (kg)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    className="form-input" 
                    style={{ padding: '0.5rem' }}
                    placeholder="Es. 65"
                    value={biaWeight}
                    onChange={(e) => setBiaWeight(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Altezza (cm)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    style={{ padding: '0.5rem' }}
                    placeholder="Es. 165"
                    value={biaHeight}
                    onChange={(e) => setBiaHeight(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Età (Anni)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    style={{ padding: '0.5rem' }}
                    placeholder="Es. 45"
                    value={biaAge}
                    onChange={(e) => setBiaAge(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Sesso</label>
                  <select 
                    className="form-input"
                    style={{ padding: '0.5rem' }}
                    value={biaGender}
                    onChange={(e) => setBiaGender(e.target.value)}
                  >
                    <option value="Femmina">Femmina</option>
                    <option value="Maschio">Maschio</option>
                  </select>
                </div>
              </div>

              {/* Form Input Composizione Corporea */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Massa Grassa (%)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    className="form-input" 
                    style={{ padding: '0.5rem' }}
                    placeholder="Es. 22.5"
                    value={biaFatMass}
                    onChange={(e) => setBiaFatMass(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Massa Muscolare (kg)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    className="form-input" 
                    style={{ padding: '0.5rem' }}
                    placeholder="Es. 45"
                    value={biaMuscleMass}
                    onChange={(e) => setBiaMuscleMass(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Metabolismo Basale (BMR - kcal)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    style={{ padding: '0.5rem' }}
                    placeholder="Auto-calcolato se vuoto"
                    value={biaBmr}
                    onChange={(e) => setBiaBmr(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Livello Attività</label>
                  <select 
                    className="form-input"
                    style={{ padding: '0.5rem' }}
                    value={biaActivityFactor}
                    onChange={(e) => setBiaActivityFactor(e.target.value)}
                  >
                    <option value="1.2">Sedentario (1.2)</option>
                    <option value="1.375">Attività Leggera (1.375)</option>
                    <option value="1.55">Attività Moderata (1.55)</option>
                    <option value="1.725">Attività Intensa (1.725)</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '-0.25rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Obiettivo Paziente</label>
                <select 
                  className="form-input"
                  style={{ padding: '0.5rem' }}
                  value={biaTarget}
                  onChange={(e) => setBiaTarget(e.target.value)}
                >
                  <option value="Mantenimento">Mantenimento (100% calorie)</option>
                  <option value="DimagrimentoLieve">Dimagrimento lieve (-10% calorie)</option>
                  <option value="DimagrimentoModerato">Dimagrimento moderato (-15% calorie)</option>
                  <option value="DimagrimentoRapido">Dimagrimento rapido (-20% calorie)</option>
                  <option value="Massa">Massa (+12% calorie)</option>
                  {biaTarget === 'Dimagrimento' && (
                    <option value="Dimagrimento">Dimagrimento (-18% calorie) [Precedente]</option>
                  )}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '-0.25rem', marginBottom: '0.75rem' }}>
                <input 
                  type="checkbox" 
                  id="forceMinCalories"
                  checked={forceMinCalories}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setForceMinCalories(checked);
                    localStorage.setItem('liberadiete_force_min_1200', String(checked));
                  }}
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="forceMinCalories" style={{ fontSize: '0.78rem', color: 'var(--text-color)', cursor: 'pointer', userSelect: 'none' }}>
                  Forza target minimo automatico a 1200 kcal
                </label>
              </div>

              <button 
                className="btn btn-secondary btn-sm" 
                style={{ width: '100%', fontSize: '0.85rem' }}
                onClick={handleSaveBia}
              >
                <Save size={14} /> Salva Dati BIA nel Profilo
              </button>

              {/* Risultati Calcoli BIA */}
              {biaResults && (
                <div style={{ background: 'var(--primary-bg)', borderRadius: 'var(--radius-sm)', padding: '1rem', border: '1px solid var(--primary-light)', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Metabolismo Basale (BMR):</span>
                    <strong style={{ color: 'var(--text-color)' }}>{biaResults.bmr} kcal</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Fabbisogno Giornaliero (TDEE):</span>
                    <strong style={{ color: 'var(--text-color)' }}>{biaResults.tdee} kcal</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Calorie Target ({targetLabels[biaTarget] || biaTarget}):</span>
                    <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>{biaResults.targetCalories} kcal</strong>
                  </div>

                  {biaResults.isBelowMin && (
                    <div style={{ 
                      background: '#fffbeb', 
                      border: '1px solid #fcd34d', 
                      borderRadius: '8px', 
                      padding: '0.75rem', 
                      color: '#92400e', 
                      fontSize: '0.78rem', 
                      lineHeight: '1.4' 
                    }}>
                      ⚠️ <strong>Attenzione:</strong> il target calorico calcolato ({biaResults.rawTargetCalories} kcal) è inferiore a 1200 kcal. Valutare clinicamente se mantenere questo valore.
                    </div>
                  )}

                  <div style={{ marginTop: '0.25rem' }}>
                    <span style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem', color: 'var(--text-color)' }}>Ripartizione Macronutrienti Giornalieri:</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center' }}>
                      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '0.35rem' }}>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#1e3a8a' }}>Carboidrati</span>
                        <strong style={{ fontSize: '0.9rem', color: '#1e3a8a' }}>{biaResults.carbGrams}g</strong>
                      </div>
                      <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '6px', padding: '0.35rem' }}>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#064e3b' }}>Proteine</span>
                        <strong style={{ fontSize: '0.9rem', color: '#064e3b' }}>{biaResults.proteinGrams}g</strong>
                      </div>
                      <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '6px', padding: '0.35rem' }}>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#78350f' }}>Grassi</span>
                        <strong style={{ fontSize: '0.9rem', color: '#78350f' }}>{biaResults.fatGrams}g</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                    <span style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem', color: 'var(--text-color)' }}>Porzioni BIA Consigliate a Pasto (40%):</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>🍝 Pasta / Riso crudi (Pranzo):</span>
                        <strong style={{ color: 'var(--text-color)' }}>{biaResults.suggestedPasta}g</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>🍞 Pane integrale (Cena):</span>
                        <strong style={{ color: 'var(--text-color)' }}>{biaResults.suggestedPane}g</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>🍗 Pollo / Carne:</span>
                        <strong style={{ color: 'var(--text-color)' }}>{biaResults.suggestedPollo}g</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>🐟 Pesce magro:</span>
                        <strong style={{ color: 'var(--text-color)' }}>{biaResults.suggestedPesce}g</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>🥑 Olio EVO:</span>
                        <strong style={{ color: 'var(--text-color)' }}>{biaResults.suggestedOlio}g (~{Math.max(1, Math.round(biaResults.suggestedOlio / 10))} cucchiai)</strong>
                      </div>
                    </div>
                  </div>

                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', marginTop: '0.5rem', background: 'var(--primary)', color: '#ffffff' }}
                    onClick={handleApplyBiaPortions}
                  >
                    Applica Grammature BIA alla Dieta
                  </button>
                </div>
              )}
            </div>

            {/* COLONNA DESTRA: CARICA O INCOLLA IL PIANO ALIMENTARE */}
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <FileText className="text-primary" size={22} style={{ color: 'var(--primary)' }} />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)' }}>
                  Carica o Incolla il Piano Alimentare
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Opzione A: Caricamento File */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary)' }}>Opzione A: Carica File (.pdf o .txt)</span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Trascina o seleziona un file di dieta esportato o salvato.</p>
                  <label className="upload-zone" style={{ padding: '1.5rem 1rem', cursor: 'pointer', borderStyle: 'dashed', justifyContent: 'center' }}>
                    <UploadCloud size={28} style={{ color: 'var(--primary)', marginBottom: '0.25rem' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Sfoglia file</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Supporta PDF e TXT</span>
                    <input 
                      type="file" 
                      accept="application/pdf,text/plain" 
                      style={{ display: 'none' }} 
                      onChange={handleFileUpload}
                      disabled={isParsing}
                    />
                  </label>
                  {isParsing && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                      <div className="loader-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Elaborazione in corso...</span>
                    </div>
                  )}
                </div>

                {/* Opzione B: Copia e Incolla */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary)' }}>Opzione B: Copia e Incolla Testo Dieta</span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Copia il testo ed incollalo qui.</p>
                  <textarea 
                    className="form-input" 
                    rows="5"
                    placeholder="Incolla qui...&#10;COLAZIONE&#10;- Yogurt greco (150g) + Noci (15g)&#10;CARBOIDRATI&#10;- Pasta (80g)"
                    style={{ fontSize: '0.8rem', resize: 'none' }}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                  />
                  <button 
                    className="btn btn-primary btn-sm"
                    style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}
                    onClick={handleProcessPastedText}
                    disabled={!pastedText.trim() || isParsing}
                  >
                    Elabora Testo Incollato
                  </button>
                </div>

                {/* Opzione C: Assistente Custom GPT — GPT 1 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <input 
                      type="checkbox" 
                      id="includeWeeklyMenuToggle"
                      checked={includeWeeklyMenu}
                      onChange={(e) => setIncludeWeeklyMenu(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                    />
                    <label htmlFor="includeWeeklyMenuToggle" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', cursor: 'pointer', userSelect: 'none' }}>
                      📅 Richiedi anche proposta Menù Settimanale
                    </label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontSize: '1rem' }}>🤖</span>
                    <input
                      type="text"
                      value={gptName1}
                      onChange={(e) => {
                        setGptName1(e.target.value);
                        localStorage.setItem('liberadiete_gpt_name1', e.target.value);
                      }}
                      style={{
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        color: 'var(--primary)',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1.5px dashed var(--primary)',
                        outline: 'none',
                        padding: '0 2px',
                        width: '100%',
                        cursor: 'text'
                      }}
                      placeholder="Nome assistente..."
                    />
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', flexShrink: 0 }}>✏️</span>
                  </div>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Es. https://chatgpt.com/g/g-xxxxx-diet-gpt" 
                    style={{ fontSize: '0.75rem', padding: '0.4rem' }}
                    value={gptUrl}
                    onChange={(e) => {
                      setGptUrl(e.target.value);
                      localStorage.setItem('liberadiete_gpt_url', e.target.value);
                    }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button 
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', flex: 1, padding: '0.4rem', borderRadius: '12px', minWidth: '100px' }}
                      onClick={handleCopyGptPrompt}
                      disabled={!selectedPatient}
                    >
                      📋 Copia Prompt
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', flex: 1, padding: '0.4rem', borderRadius: '12px', minWidth: '100px' }}
                      onClick={() => handleOpenGptInApp(gptUrl)}
                      disabled={!gptUrl}
                    >
                      🪟 Apri in App
                    </button>
                    <button 
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.72rem', flex: 1, padding: '0.4rem', borderRadius: '12px', background: 'var(--primary)', border: 'none', color: '#fff', minWidth: '100px' }}
                      onClick={() => handleOpenCustomGpt(gptUrl)}
                      disabled={!gptUrl}
                    >
                      🚀 Apri nel Browser
                    </button>
                  </div>
                  {copySuccess && (
                    <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600, textAlign: 'center' }}>
                      ✓ Prompt copiato! Ora incollalo in ChatGPT.
                    </span>
                  )}
                </div>

                {/* Assistente Custom GPT #2 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px dashed var(--border-color)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontSize: '1rem' }}>🤖</span>
                    <input
                      type="text"
                      value={gptName2}
                      onChange={(e) => {
                        setGptName2(e.target.value);
                        localStorage.setItem('liberadiete_gpt_name2', e.target.value);
                      }}
                      style={{
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        color: 'var(--primary)',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1.5px dashed var(--primary)',
                        outline: 'none',
                        padding: '0 2px',
                        width: '100%',
                        cursor: 'text'
                      }}
                      placeholder="Nome assistente..."
                    />
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', flexShrink: 0 }}>✏️</span>
                  </div>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Es. https://chatgpt.com/g/g-yyyyy-second-gpt" 
                    style={{ fontSize: '0.75rem', padding: '0.4rem' }}
                    value={gptUrl2}
                    onChange={(e) => {
                      setGptUrl2(e.target.value);
                      localStorage.setItem('liberadiete_gpt_url2', e.target.value);
                    }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button 
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', flex: 1, padding: '0.4rem', borderRadius: '12px', minWidth: '100px' }}
                      onClick={handleCopyGptPrompt2}
                      disabled={!selectedPatient}
                    >
                      📋 Copia Prompt
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', flex: 1, padding: '0.4rem', borderRadius: '12px', minWidth: '100px' }}
                      onClick={() => handleOpenGptInApp(gptUrl2)}
                      disabled={!gptUrl2}
                    >
                      🪟 Apri in App
                    </button>
                    <button 
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.72rem', flex: 1, padding: '0.4rem', borderRadius: '12px', background: 'var(--primary)', border: 'none', color: '#fff', minWidth: '100px' }}
                      onClick={() => handleOpenCustomGpt(gptUrl2)}
                      disabled={!gptUrl2}
                    >
                      🚀 Apri nel Browser
                    </button>
                  </div>
                  {copySuccess2 && (
                    <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600, textAlign: 'center' }}>
                      ✓ Prompt copiato! Ora incollalo in ChatGPT.
                    </span>
                  )}
                </div>

              </div>
            </div>

            {/* COLONNA 3: CHAT DIRETTA CON IL PAZIENTE */}
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                  <Send className="text-primary" size={20} />
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)' }}>
                    Chat con {selectedPatient.name}
                  </h3>
                </div>
                {selectedPatient.messages?.filter(m => m.sender === 'patient' && !m.read).length > 0 && (
                  <span style={{ 
                    fontSize: '0.72rem', 
                    fontWeight: 700, 
                    color: 'var(--danger)', 
                    background: 'rgba(220, 38, 38, 0.1)', 
                    padding: '0.15rem 0.45rem', 
                    borderRadius: '8px' 
                  }}>
                    Non letti
                  </span>
                )}
              </div>

              {/* Area Messaggi della Chat */}
              <div style={{ 
                flex: 1, 
                minHeight: '260px',
                maxHeight: '340px',
                overflowY: 'auto', 
                padding: '0.5rem', 
                background: '#f8fafc',
                border: '1px solid var(--border-soft)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                {!(selectedPatient.messages?.length > 0) ? (
                  <p style={{ margin: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
                    Non ci sono ancora messaggi con {selectedPatient.name}.<br/>Scrivi qualcosa per avviare la conversazione!
                  </p>
                ) : (
                  selectedPatient.messages.map((msg, idx) => (
                    <div 
                      key={msg.id || idx} 
                      style={{ 
                        alignSelf: msg.sender === 'doctor' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.15rem'
                      }}
                    >
                      <div style={{ 
                        padding: '0.65rem 0.85rem', 
                        borderRadius: msg.sender === 'doctor' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background: msg.sender === 'doctor' ? 'var(--primary)' : '#ffffff',
                        color: msg.sender === 'doctor' ? '#ffffff' : 'var(--text-color)',
                        border: msg.sender === 'doctor' ? 'none' : '1px solid var(--border-soft)',
                        fontSize: '0.82rem',
                        lineHeight: 1.4,
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        {msg.text}
                      </div>
                      <span style={{ 
                        fontSize: '0.62rem', 
                        color: 'var(--text-muted)', 
                        alignSelf: msg.sender === 'doctor' ? 'flex-end' : 'flex-start',
                        padding: '0 0.2rem'
                      }}>
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  ))
                )}
                <div ref={doctorMessagesEndRef} />
              </div>

              {/* Form Invia Messaggio */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <input 
                  type="text" 
                  className="form-input"
                  style={{ flex: 1, borderRadius: '20px', paddingLeft: '1rem', fontSize: '0.82rem' }}
                  placeholder="Scrivi una risposta al paziente..."
                  value={doctorChatInput}
                  onChange={(e) => setDoctorChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendDoctorMessage();
                    }
                  }}
                />
                <button 
                  className="btn btn-primary"
                  style={{ borderRadius: '50%', width: '38px', height: '38px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={handleSendDoctorMessage}
                >
                  <Send size={14} />
                </button>
              </div>
            </div>

          </div>

          {/* Feedback Messaggi */}
          {parseError && (
            <div style={{ padding: '1rem 1.25rem', background: '#fee2e2', color: 'var(--danger)', border: '1px solid #fca5a5', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Info size={18} /> <span>{parseError}</span>
              </div>
              <button 
                className="btn btn-secondary btn-sm" 
                style={{ 
                  alignSelf: 'flex-start', 
                  backgroundColor: '#ffffff', 
                  color: 'var(--danger)', 
                  borderColor: '#fca5a5', 
                  fontSize: '0.8rem',
                  padding: '0.35rem 0.75rem' 
                }}
                onClick={() => {
                  setTempDiet({
                    colazione: [
                      { id: 'col-1', content: 'Yogurt greco 0% (150g) + Fiocchi d\'avena (40g) + Mandorle (15g)' },
                      { id: 'col-2', content: 'Latte parzialmente scremato (200ml) + 4 Fette biscottate + 2 cucchiaini di Marmellata' }
                    ],
                    spuntini: [
                      { id: 'spu-1', content: 'Una mela (150g) + Noci (15g)' },
                      { id: 'spu-2', content: 'Yogurt magro bianco (125g)' }
                    ],
                    pranzoCarboidrati: [
                      { id: 'p-carb-1', food: 'Pasta integrale', quantity: '80g' },
                      { id: 'p-carb-2', food: 'Riso Basmati', quantity: '80g' }
                    ],
                    pranzoProteine: [
                      { id: 'p-prot-1', food: 'Petto di pollo o tacchino ai ferri', quantity: '140g' },
                      { id: 'p-prot-2', food: 'Uova intere biologiche', quantity: '2 uova' }
                    ],
                    pranzoVerdure: [
                      { id: 'p-veg-1', food: 'Insalata mista', quantity: 'a volontà' }
                    ],
                    pranzoGrassi: [
                      { id: 'p-fat-1', food: 'Olio Extravergine d\'Oliva (EVO)', quantity: '2 cucchiai (20g)' }
                    ],
                    cenaCarboidrati: [
                      { id: 'c-carb-1', food: 'Pane di segale o integrale', quantity: '100g' },
                      { id: 'c-carb-2', food: 'Patate al vapore', quantity: '280g' }
                    ],
                    cenaProteine: [
                      { id: 'c-prot-1', food: 'Filetto di orata o merluzzo', quantity: '180g' },
                      { id: 'c-prot-2', food: 'Mozzarella light', quantity: '100g' }
                    ],
                    cenaVerdure: [
                      { id: 'c-veg-1', food: 'Verdure grigliate miste', quantity: 'a volontà' }
                    ],
                    cenaGrassi: [
                      { id: 'c-fat-1', food: 'Olio Extravergine d\'Oliva (EVO)', quantity: '1.5 cucchiai (15g)' }
                    ]
                  });
                  setParseError('');
                  setSuccessMessage('Schema base di pranzo/cena caricato con successo! Controlla le voci sotto.');
                }}
              >
                Inizializza con Schema Base Compilabile
              </button>
            </div>
          )}
          {successMessage && (
            <div style={{ padding: '1rem', background: 'var(--primary-bg)', color: 'var(--primary)', border: '1px solid var(--primary-light)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <Check size={18} /> {successMessage}
            </div>
          )}

          {/* EDITOR DIETA */}
          {tempDiet && (
            <div className="glass-card" style={{ padding: '2rem', animation: 'modalSlide 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--primary)' }}>
                  Revisione ed Editor della Dieta
                </h3>
                <button className="btn btn-primary" onClick={handleSaveDiet}>
                  <Save size={18} /> Salva Dieta Paziente
                </button>
              </div>

              {/* Tabs Categoria */}
              <div className="section-tabs" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                {[
                  { id: 'colazione', label: 'Colazione' },
                  { id: 'spuntini', label: 'Spuntini' },
                  { id: 'pranzoCarboidrati', label: 'Carboidrati (Pranzo)' },
                  { id: 'pranzoProteine', label: 'Proteine (Pranzo)' },
                  { id: 'pranzoVerdure', label: 'Verdure (Pranzo)' },
                  { id: 'pranzoGrassi', label: 'Grassi (Pranzo)' },
                  { id: 'cenaCarboidrati', label: 'Carboidrati (Cena)' },
                  { id: 'cenaProteine', label: 'Proteine (Cena)' },
                  { id: 'cenaVerdure', label: 'Verdure (Cena)' },
                  { id: 'cenaGrassi', label: 'Grassi (Cena)' }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label} ({tempDiet[tab.id]?.length || 0})
                  </button>
                ))}
              </div>

              {/* Contenuto Tab */}
              <div style={{ minHeight: '200px', marginTop: '1.5rem' }}>
                {/* 1. COLAZIONE E SPUNTINI (Solo campo di testo completo) */}
                {(activeTab === 'colazione' || activeTab === 'spuntini') && (
                  <div className="alternative-list-editor">
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      Inserisci le opzioni alimentari complete per questa categoria. Il paziente potrà sceglierne una dal suo calendario.
                    </p>
                    {tempDiet[activeTab].map((item, idx) => (
                      <div key={item.id} className="alternative-row">
                        <span style={{ fontWeight: 'bold', minWidth: '80px', color: 'var(--text-muted)' }}>Opzione {idx + 1}</span>
                        <input 
                          type="text"
                          className="form-input"
                          style={{ flex: 1 }}
                          placeholder={`Es. Yogurt greco + avena + mandorle`}
                          value={item.content}
                          onChange={(e) => updateDietItemValue(activeTab, item.id, 'content', e.target.value)}
                        />
                        <button 
                          className="btn btn-outline" 
                          style={{ color: 'var(--danger)', padding: '0.75rem' }}
                          onClick={() => removeDietItem(activeTab, item.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button 
                      className="btn btn-secondary" 
                      style={{ marginTop: '1rem', alignSelf: 'flex-start' }}
                      onClick={() => addDietItem(activeTab)}
                    >
                      <Plus size={16} /> Aggiungi Opzione
                    </button>
                  </div>
                )}

                {/* 2. MACRONUTRIENTI (Cibo + Quantità separate) */}
                {(activeTab !== 'colazione' && activeTab !== 'spuntini') && (
                  <div className="alternative-list-editor">
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      Definisci gli alimenti e le rispettive grammature/porzioni consentite per questa categoria macro.
                    </p>
                    {tempDiet[activeTab].map((item, idx) => (
                      <div key={item.id} className="alternative-row">
                        <span style={{ fontWeight: 'bold', minWidth: '80px', color: 'var(--text-muted)' }}>Alimento {idx + 1}</span>
                        <input 
                          type="text"
                          className="form-input"
                          style={{ flex: 2 }}
                          placeholder="Nome dell'alimento (es. Riso Basmati)"
                          value={item.food}
                          onChange={(e) => updateDietItemValue(activeTab, item.id, 'food', e.target.value)}
                        />
                        <input 
                          type="text"
                          className="form-input"
                          style={{ flex: 1 }}
                          placeholder="Quantità / Porzione (es. 80g)"
                          value={item.quantity}
                          onChange={(e) => updateDietItemValue(activeTab, item.id, 'quantity', e.target.value)}
                        />
                        <button 
                          className="btn btn-outline" 
                          style={{ color: 'var(--danger)', padding: '0.75rem' }}
                          onClick={() => removeDietItem(activeTab, item.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button 
                      className="btn btn-secondary" 
                      style={{ marginTop: '1rem', alignSelf: 'flex-start' }}
                      onClick={() => addDietItem(activeTab)}
                    >
                      <Plus size={16} /> Aggiungi Alimento
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SEZIONE STORICO CONTROLLI & GRAFICI DI ANDAMENTO IN BASSO A TUTTA LARGHEZZA */}
          <div className="glass-card" style={{ padding: '2rem', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                <Activity size={24} />
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Storico Progressi & Prossimo Controllo</h3>
              </div>

              {/* Configurazione Prossimo Controllo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>📅 Prossimo Controllo:</span>
                <input 
                  type="date"
                  className="form-input"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem', borderRadius: '8px' }}
                  value={nextCheckupInput}
                  onChange={(e) => setNextCheckupInput(e.target.value)}
                />
                <button 
                  type="button" 
                  className="btn btn-primary btn-sm"
                  style={{ padding: '0.4rem 0.8rem', borderRadius: '8px' }}
                  onClick={handleSaveNextCheckup}
                >
                  Salva Data
                </button>
              </div>
            </div>

            {/* Grafici di Andamento */}
            {renderTrendsChart(selectedPatient)}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
              <style>{`
                @media (min-width: 768px) {
                  .history-section-grid { grid-template-columns: 2.2fr 1.8fr !important; }
                }
              `}</style>
              <div className="history-section-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', alignItems: 'start' }}>
                
                {/* Elenco Tabellare Storico */}
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem' }}>
                    📋 Registro Rilevazioni Storiche
                  </h4>
                  {!(selectedPatient.history?.length > 0) ? (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Nessun record inserito nello storico.
                    </p>
                  ) : (
                    <div style={{ overflowX: 'auto', border: '1px solid var(--border-soft)', borderRadius: '12px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', background: '#fff', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ background: 'var(--primary-bg)', borderBottom: '1.5px solid var(--border-color)', color: 'var(--primary)' }}>
                            <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Data Rilevazione</th>
                            <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Peso (kg)</th>
                            <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Massa Grassa (%)</th>
                            <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Massa Muscolare (kg)</th>
                            <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Azioni</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...selectedPatient.history].sort((a,b) => new Date(b.date) - new Date(a.date)).map((r, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                              <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>
                                {new Date(r.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}
                              </td>
                              <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>{r.weight} kg</td>
                              <td style={{ padding: '0.75rem 1rem' }}>{r.fatMass ? `${r.fatMass}%` : '-'}</td>
                              <td style={{ padding: '0.75rem 1rem' }}>{r.muscleMass ? `${r.muscleMass} kg` : '-'}</td>
                              <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                                <button 
                                  type="button" 
                                  className="btn btn-outline btn-sm"
                                  style={{ color: 'var(--danger)', borderColor: 'var(--danger)', padding: '0.3rem 0.5rem', borderRadius: '6px' }}
                                  onClick={() => handleDeleteHistoryRecord(r.date)}
                                  title="Elimina questa misurazione"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Form Nuovo Record Storico */}
                <div style={{ background: 'var(--primary-bg)', padding: '1.25rem', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem' }}>
                    ➕ Registra Nuova Rilevazione
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.4 }}>
                    L'inserimento di una nuova rilevazione aggiornerà automaticamente il peso e la composizione corporea del profilo corrente del paziente.
                  </p>

                  <form onSubmit={handleAddHistoryRecord} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Data</label>
                      <input 
                        type="date"
                        className="form-input"
                        style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                        required
                        value={historyDate}
                        onChange={(e) => setHistoryDate(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Peso (kg)</label>
                      <input 
                        type="number"
                        step="0.1"
                        className="form-input"
                        style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                        placeholder="Es. 62.5"
                        required
                        value={historyWeight}
                        onChange={(e) => setHistoryWeight(e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Massa Grassa (%)</label>
                        <input 
                          type="number"
                          step="0.1"
                          className="form-input"
                          style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                          placeholder="Es. 22"
                          value={historyFatMass}
                          onChange={(e) => setHistoryFatMass(e.target.value)}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Massa Musc. (kg)</label>
                        <input 
                          type="number"
                          step="0.1"
                          className="form-input"
                          style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                          placeholder="Es. 45"
                          value={historyMuscleMass}
                          onChange={(e) => setHistoryMuscleMass(e.target.value)}
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      style={{ width: '100%', marginTop: '0.5rem', padding: '0.6rem', borderRadius: '10px', fontSize: '0.9rem' }}
                    >
                      Salva Rilevazione
                    </button>
                  </form>
                </div>

              </div>
            </div>

            {/* Registro Mindful Eating & Report Settimanali */}
            <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1.5rem', background: 'linear-gradient(135deg, rgba(214, 51, 132, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🧠</span>
                <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>Monitoraggio Mindful Eating & Report Settimanali</h3>
              </div>

              {/* Progresso Percorso Consapevole 12 Settimane */}
              {(() => {
                const prog = selectedPatient.challengeProgress || { currentWeek: 1, completedDays: {} };
                const completedDaysMap = prog.completedDays || {};
                const activeWeekCh = liberaDieteChallenges.find(c => c.week === prog.currentWeek) || liberaDieteChallenges[0];
                const activeWeekDays = completedDaysMap[prog.currentWeek] || [false, false, false, false, false, false, false];
                const activeWeekCompletedCount = activeWeekDays.filter(Boolean).length;
                
                // Conteggio settimane completate (almeno 7 giorni su 7 completati)
                const weeksCompletedCount = liberaDieteChallenges.filter(ch => {
                  const days = completedDaysMap[ch.week] || [];
                  return days.filter(Boolean).length === 7;
                }).length;

                const dayLabels = ["L", "M", "M", "G", "V", "S", "D"];

                return (
                  <div style={{ 
                    padding: '1.25rem', 
                    background: '#ffffff', 
                    borderRadius: '16px', 
                    border: '1px solid var(--border-soft)',
                    marginBottom: '1.5rem',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                        <Trophy size={18} style={{ color: '#f59e0b' }} />
                        <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                          Percorso 12 Settimane: Sfide Consapevoli
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        Completate: <strong>{weeksCompletedCount} su 12</strong> settimane (7/7 gg)
                      </span>
                    </div>

                    {/* Progress Track 1-12 */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      gap: '0.35rem', 
                      overflowX: 'auto', 
                      paddingBottom: '0.5rem',
                      scrollbarWidth: 'thin'
                    }}>
                      {liberaDieteChallenges.map((ch) => {
                        const days = completedDaysMap[ch.week] || [false, false, false, false, false, false, false];
                        const daysDone = days.filter(Boolean).length;
                        const isWeekCompleted = daysDone === 7;
                        const isWeekActive = prog.currentWeek === ch.week;
                        
                        let bgColor = '#f1f5f9';
                        let textColor = 'var(--text-muted)';
                        let borderStyle = '1px solid var(--border-soft)';
                        
                        if (isWeekCompleted) {
                          bgColor = 'rgba(22, 163, 74, 0.1)';
                          textColor = 'var(--success)';
                          borderStyle = '1.5px solid var(--success)';
                        } else if (daysDone > 0) {
                          bgColor = 'rgba(214, 51, 132, 0.08)';
                          textColor = 'var(--primary)';
                          borderStyle = '1px solid var(--primary-light)';
                        }
                        
                        if (isWeekActive) {
                          borderStyle = '2px solid #f59e0b';
                        }

                        return (
                          <div 
                            key={ch.week}
                            title={`${ch.week}° Settimana: ${ch.title} (${daysDone}/7 giorni completati)`}
                            style={{
                              flexShrink: 0,
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: bgColor,
                              color: textColor,
                              border: borderStyle,
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative'
                            }}
                          >
                            {ch.week}
                            {isWeekActive && (
                              <span style={{ 
                                position: 'absolute', 
                                top: '-4px', 
                                right: '-4px', 
                                width: '8px', 
                                height: '8px', 
                                borderRadius: '50%', 
                                background: '#f59e0b',
                                border: '1px solid #fff'
                              }} />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Dettaglio Settimana Attiva del Paziente */}
                    <div style={{ 
                      background: '#f8fafc', 
                      padding: '0.85rem 1rem', 
                      borderRadius: '12px', 
                      border: '1px solid var(--border-soft)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <strong style={{ fontSize: '0.82rem', color: 'var(--text-color)' }}>
                            Settimana {activeWeekCh.week} Attiva: {activeWeekCh.title}
                          </strong>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            Focus: {activeWeekCh.focus}
                          </div>
                        </div>
                        <span style={{ 
                          fontSize: '0.72rem', 
                          fontWeight: 700, 
                          color: '#fff', 
                          background: 'linear-gradient(135deg, #f59e0b 0%, var(--primary) 100%)', 
                          padding: '0.2rem 0.6rem', 
                          borderRadius: '12px'
                        }}>
                          {activeWeekCompletedCount}/7 giorni completati questa settimana
                        </span>
                      </div>

                      {/* Griglia giorni spuntati */}
                      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '0.25rem' }}>
                          Giorni tracciati:
                        </span>
                        {dayLabels.map((day, idx) => {
                          const isDone = activeWeekDays[idx];
                          return (
                            <div 
                              key={idx}
                              title={isDone ? `${day} - Completato` : `${day} - Non completato`}
                              style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                background: isDone ? 'var(--primary)' : '#ffffff',
                                color: isDone ? '#ffffff' : 'var(--text-muted)',
                                border: isDone ? 'none' : '1px solid var(--border-color)',
                                boxShadow: isDone ? 'var(--primary-glow)' : 'none'
                              }}
                            >
                              {day}
                            </div>
                          );
                        })}
                      </div>

                      <div style={{ borderTop: '1px dashed var(--border-soft)', paddingTop: '0.65rem', marginTop: '0.4rem' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                          Dettaglio sfide giornaliere:
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          {["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"].map((dayName, idx) => {
                            const isDone = activeWeekDays[idx];
                            const taskText = activeWeekCh.dailyTasks?.[idx] || "Nessuna sfida impostata per questo giorno.";
                            return (
                              <div 
                                key={idx} 
                                style={{ 
                                  display: 'flex', 
                                  alignItems: 'flex-start', 
                                  gap: '0.5rem', 
                                  fontSize: '0.75rem',
                                  padding: '0.35rem 0.5rem',
                                  borderRadius: '8px',
                                  background: isDone ? 'rgba(16, 185, 129, 0.04)' : 'transparent',
                                  border: isDone ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid transparent'
                                }}
                              >
                                <span style={{ 
                                  color: isDone ? 'var(--success)' : 'var(--text-muted)', 
                                  fontWeight: 700,
                                  fontSize: '0.8rem',
                                  flexShrink: 0
                                }}>
                                  {isDone ? '✅' : '⚪'}
                                </span>
                                <div>
                                  <strong style={{ color: isDone ? 'var(--success)' : 'var(--text-color)' }}>{dayName}:</strong>{' '}
                                  <span style={{ color: isDone ? 'var(--text-main)' : 'var(--text-muted)' }}>
                                    {taskText}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Monitoraggio Idratazione (Water Tracker) */}
              {(() => {
                const todayStr = new Date().toISOString().split('T')[0];
                const todayCount = (selectedPatient.waterLogs && selectedPatient.waterLogs[todayStr]) || 0;
                const todayLiters = (todayCount * 0.25).toFixed(2);
                
                // Helper to get last 7 days of water logs
                const getLast7Days = () => {
                  const result = [];
                  for (let i = 0; i < 7; i++) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    const dateStr = d.toISOString().split('T')[0];
                    let label;
                    if (i === 0) label = "Oggi";
                    else if (i === 1) label = "Ieri";
                    else {
                      const str = d.toLocaleDateString('it-IT', { weekday: 'short', day: '2-digit', month: '2-digit' });
                      label = str.charAt(0).toUpperCase() + str.slice(1);
                    }
                    const count = (selectedPatient.waterLogs && selectedPatient.waterLogs[dateStr]) || 0;
                    result.push({ dateStr, label, count });
                  }
                  return result;
                };

                const last7Days = getLast7Days();

                return (
                  <div style={{ 
                    padding: '1.25rem', 
                    background: '#ffffff', 
                    borderRadius: '16px', 
                    border: '1px solid var(--border-soft)',
                    marginBottom: '1.5rem',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7' }}>
                        <span style={{ fontSize: '1.2rem' }}>💧</span>
                        <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                          Monitoraggio Idratazione (Water Tracker)
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        Target Quotidiano: <strong>8 bicchieri (2L)</strong>
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                      <style>{`
                        @media (min-width: 768px) {
                          .water-monitor-grid { grid-template-columns: 1fr 1fr !important; }
                        }
                      `}</style>
                      <div className="water-monitor-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                        
                        {/* Sinistra: Stato di Oggi */}
                        <div style={{ 
                          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, rgba(2, 132, 199, 0.05) 100%)', 
                          padding: '1rem', 
                          borderRadius: '12px',
                          border: '1.5px solid rgba(56, 189, 248, 0.15)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          textAlign: 'center'
                        }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Consumo Odierno
                          </span>
                          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284c7', margin: '0.2rem 0' }}>
                            {todayCount} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ 8 bicchieri</span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600 }}>
                            ({todayLiters} litri d'acqua)
                          </div>
                          
                          {/* Visualizzatore bicchieri di oggi */}
                          <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {Array.from({ length: Math.max(8, todayCount) }).map((_, i) => {
                              const isFilled = i < todayCount;
                              return (
                                <svg 
                                  key={i}
                                  width="18" 
                                  height="25" 
                                  viewBox="0 0 32 42" 
                                  style={{ filter: isFilled ? 'drop-shadow(0 1px 2px rgba(2, 132, 199, 0.2))' : 'none' }}
                                >
                                  <path 
                                    d="M 6 4 L 26 4 L 22 38 L 10 38 Z" 
                                    fill={isFilled ? 'url(#waterGradDoc)' : 'rgba(224, 242, 254, 0.4)'} 
                                    stroke={isFilled ? '#0284c7' : '#cbd5e1'} 
                                    strokeWidth="2.5" 
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              );
                            })}
                            <svg width="0" height="0" style={{ position: 'absolute' }}>
                              <defs>
                                <linearGradient id="waterGradDoc" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#38bdf8" />
                                  <stop offset="100%" stopColor="#0284c7" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </div>
                        </div>

                        {/* Destra: Storico 7 giorni */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.2rem' }}>
                            Storico ultimi 7 giorni
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {last7Days.map((day) => {
                              const pct = Math.min(100, (day.count / 8) * 100);
                              const reached = day.count >= 8;
                              return (
                                <div key={day.dateStr} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.75rem' }}>
                                  <span style={{ width: '80px', fontWeight: 600, color: 'var(--text-color)', flexShrink: 0 }}>
                                    {day.label}
                                  </span>
                                  
                                  {/* Progress bar container */}
                                  <div style={{ 
                                    flexGrow: 1, 
                                    height: '8px', 
                                    background: '#e2e8f0', 
                                    borderRadius: '4px', 
                                    overflow: 'hidden', 
                                    position: 'relative' 
                                  }}>
                                    <div style={{ 
                                      width: `${pct}%`, 
                                      height: '100%', 
                                      background: reached 
                                        ? 'linear-gradient(90deg, #38bdf8, #0284c7)' 
                                        : 'linear-gradient(90deg, #bae6fd, #38bdf8)', 
                                      borderRadius: '4px',
                                      transition: 'width 0.3s ease'
                                    }} />
                                  </div>

                                  <span style={{ width: '45px', textAlign: 'right', fontWeight: 700, color: reached ? '#0284c7' : 'var(--text-muted)', flexShrink: 0 }}>
                                    {day.count}/8
                                  </span>

                                  <span style={{ width: '20px', flexShrink: 0, fontSize: '0.8rem' }}>
                                    {reached ? '✨' : ''}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })()}

              <style>{`
                @media (min-width: 992px) {
                  .doc-mindful-grid { grid-template-columns: 1.1fr 0.9fr !important; }
                }
              `}</style>
              <div className="doc-mindful-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                
                {/* COLONNA 1: REPORT SETTIMANALI ("COM'E ANDATA") */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-color)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    📅 Storico Report Settimanali
                  </h4>

                  {!(selectedPatient.weeklyReports?.length > 0) ? (
                    <div style={{ padding: '2rem 1rem', background: '#fff', border: '1px solid var(--border-soft)', borderRadius: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                      Nessun report settimanale inviato dal paziente.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
                      {selectedPatient.weeklyReports.map((rep) => (
                        <div 
                          key={rep.id} 
                          style={{ 
                            padding: '0.85rem 1rem', 
                            borderRadius: '12px', 
                            background: '#fff', 
                            border: '1px solid var(--border-soft)',
                            boxShadow: 'var(--shadow-sm)',
                            fontSize: '0.82rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.35rem'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700 }}>
                            <span style={{ color: 'var(--primary)' }}>
                              Stato d'animo: {rep.mood === "Difficile" ? "😢 Difficile" : rep.mood === "Neutro" ? "😐 Neutro" : rep.mood === "Buono" ? "😊 Buono" : "😁 Ottimo"}
                            </span>
                            <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.72rem' }}>
                              Inviato il {new Date(rep.date).toLocaleDateString('it-IT')}
                            </span>
                          </div>
                          <p style={{ margin: 0, color: 'var(--text-main)', fontStyle: 'italic', lineHeight: 1.4 }}>
                            "{rep.feedback}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* COLONNA 2: REGISTRO DIARIO MINDFUL */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-color)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    🥗 Registro Fame e Sazietà (Daily Logs)
                  </h4>

                  {!(selectedPatient.mindfulLogs?.length > 0) ? (
                    <div style={{ padding: '2rem 1rem', background: '#fff', border: '1px solid var(--border-soft)', borderRadius: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                      Nessun log mindful eating registrato.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
                      {selectedPatient.mindfulLogs.map((log) => (
                        <div 
                          key={log.id} 
                          style={{ 
                            padding: '0.75rem 0.9rem', 
                            borderRadius: '12px', 
                            background: '#fff', 
                            border: '1px solid var(--border-soft)',
                            boxShadow: 'var(--shadow-sm)',
                            fontSize: '0.8rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.35rem'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ color: 'var(--primary)' }}>
                              {log.meal}
                            </strong>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {new Date(log.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })} • {log.time}
                            </span>
                          </div>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', fontSize: '0.72rem' }}>
                            <span style={{ padding: '0.1rem 0.4rem', borderRadius: '6px', background: 'rgba(214, 51, 132, 0.07)', color: 'var(--primary)', fontWeight: 600 }}>
                              Fame: {log.hungerBefore}/10
                            </span>
                            <span style={{ padding: '0.1rem 0.4rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.07)', color: '#10b981', fontWeight: 600 }}>
                              Sazietà: {log.satietyAfter}/10
                            </span>
                            <span style={{ 
                              padding: '0.1rem 0.4rem', 
                              borderRadius: '6px', 
                              background: log.hungerType === 'Emotiva' ? 'rgba(220, 38, 38, 0.07)' : 'rgba(59, 130, 246, 0.07)', 
                              color: log.hungerType === 'Emotiva' ? 'var(--danger)' : '#3b82f6', 
                              fontWeight: 700 
                            }}>
                              Fame {log.hungerType}
                            </span>
                            {log.trigger && (
                              <span style={{ padding: '0.1rem 0.4rem', borderRadius: '6px', background: 'rgba(220, 38, 38, 0.12)', color: 'var(--danger)', fontWeight: 700 }}>
                                {log.trigger}
                              </span>
                            )}
                          </div>

                          {log.notes && (
                            <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-main)', fontStyle: 'italic', background: '#f8fafc', padding: '0.35rem', borderRadius: '6px' }}>
                              "{log.notes}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* Pannello GPT in-app */}
      {showGptPanel && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '680px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header */}
            <div style={{
              padding: '1rem 1.25rem',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
                🤖 Assistente Custom GPT
              </span>
              <button
                onClick={() => setShowGptPanel(false)}
                style={{
                  background: 'rgba(255,255,255,0.25)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  padding: '0.3rem 0.7rem',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '1rem'
                }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                background: '#fef3c7',
                border: '1px solid #fcd34d',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                fontSize: '0.82rem',
                color: '#92400e',
                lineHeight: 1.5
              }}>
                <strong>ℹ️ Nota:</strong> ChatGPT non permette di essere incorporato in altre app per sicurezza. 
                Ma puoi <strong>copiare il prompt BIA</strong> del paziente e aprire il tuo GPT in una nuova scheda: 
                il testo è già pronto da incollare!
              </div>

              <div style={{ background: '#f1f5f9', borderRadius: '10px', padding: '0.85rem', fontSize: '0.78rem', color: '#334155', wordBreak: 'break-all' }}>
                <strong>🔗 GPT configurato:</strong><br/>
                {activeGptUrl}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '0.65rem', borderRadius: '10px', fontSize: '0.88rem', fontWeight: 600 }}
                  onClick={() => {
                    handleCopyGptPrompt();
                    setTimeout(() => window.open(activeGptUrl, '_blank'), 300);
                  }}
                >
                  📋 Copia Prompt → Apri GPT
                </button>
                <button
                  className="btn btn-primary"
                  style={{ padding: '0.65rem', borderRadius: '10px', background: 'var(--primary)', border: 'none', color: '#fff', fontSize: '0.88rem', fontWeight: 600 }}
                  onClick={() => window.open(activeGptUrl, '_blank')}
                >
                  🚀 Apri GPT nel Browser
                </button>
                <button
                  style={{ padding: '0.5rem', borderRadius: '10px', background: 'transparent', border: '1px solid var(--border-color)', fontSize: '0.82rem', cursor: 'pointer', color: 'var(--text-muted)' }}
                  onClick={() => setShowGptPanel(false)}
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          FAB FLUTTUANTE MESSAGGI & DRAWER NOTIFICHE (DOTTORESSA)
          ============================================================ */}
      
      {/* 1. Pulsante Fluttuante (FAB) */}
      {(() => {
        const totalUnreadMessagesGlobal = patients.reduce((sum, p) => {
          const msgs = p.messages || [];
          return sum + msgs.filter(m => m.sender === 'patient' && !m.read).length;
        }, 0);

        return (
          <button 
            type="button"
            onClick={() => setShowNotificationDrawer(true)}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: totalUnreadMessagesGlobal > 0 
                ? '0 0 0 0 rgba(220, 38, 38, 0.7), 0 8px 24px rgba(214, 51, 132, 0.4)' 
                : '0 8px 24px rgba(214, 51, 132, 0.3)',
              zIndex: 1000,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              animation: totalUnreadMessagesGlobal > 0 ? 'pulseRed 2s infinite' : 'none',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            title="Apri Centro Messaggi"
          >
            <MessageSquare size={24} />
            {totalUnreadMessagesGlobal > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: 'var(--danger)',
                color: '#ffffff',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                fontSize: '0.72rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #ffffff',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {totalUnreadMessagesGlobal}
              </span>
            )}
          </button>
        );
      })()}

      {/* 2. Sfondo Scuro Trasparente (Backdrop) */}
      {showNotificationDrawer && (
        <div 
          onClick={() => setShowNotificationDrawer(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(26, 6, 22, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 1040,
            animation: 'fadeIn 0.25s ease-out'
          }}
        />
      )}

      {/* 3. Drawer Notifiche Laterale */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: showNotificationDrawer ? 0 : '-420px',
        width: 'min(410px, 100vw)',
        height: '100vh',
        backgroundColor: 'var(--bg-card)',
        backdropFilter: 'blur(20px)',
        borderLeft: '1.5px solid var(--border-color)',
        boxShadow: 'var(--shadow-lg)',
        transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 1050,
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1.25rem',
        color: 'var(--text-color)'
      }}>
        {/* Header Drawer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyRules: 'space-between', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
            <Bell size={20} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Notifiche & Chat</h3>
          </div>
          <button 
            type="button"
            onClick={() => setShowNotificationDrawer(false)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.25rem',
              borderRadius: '50%',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-bg)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar del Drawer */}
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
            <Search size={16} />
          </span>
          <input 
            type="text" 
            className="form-input"
            style={{ 
              width: '100%', 
              paddingLeft: '2.25rem', 
              fontSize: '0.85rem', 
              borderRadius: '20px',
              height: '38px'
            }}
            placeholder="Cerca paziente..."
            value={drawerSearchQuery}
            onChange={(e) => setDrawerSearchQuery(e.target.value)}
          />
          {drawerSearchQuery && (
            <button 
              type="button" 
              onClick={() => setDrawerSearchQuery('')}
              style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
            >
              Annulla
            </button>
          )}
        </div>

        {/* Contenuto Scorrevole dei Pazienti */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingRight: '2px' }}>
          {(() => {
            // Filtra e ordina pazienti
            const filteredPatients = patients.filter(p => 
              `${p.name} ${p.surname}`.toLowerCase().includes(drawerSearchQuery.toLowerCase())
            );

            // 1. Pazienti con messaggi non letti (Da Rispondere)
            const unreadList = filteredPatients.filter(p => {
              const msgs = p.messages || [];
              return msgs.some(m => m.sender === 'patient' && !m.read);
            });

            // 2. Altri pazienti
            const otherList = filteredPatients.filter(p => {
              const msgs = p.messages || [];
              return !msgs.some(m => m.sender === 'patient' && !m.read);
            });

            if (filteredPatients.length === 0) {
              return (
                <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', padding: '2rem' }}>
                  Nessun paziente trovato.
                </div>
              );
            }

            const renderPatientItem = (p, isUnread) => {
              const unreadMsgs = (p.messages || []).filter(m => m.sender === 'patient' && !m.read);
              const lastMsg = (p.messages || [])[(p.messages || []).length - 1];
              
              return (
                <div 
                  key={p.id}
                  onClick={() => {
                    handleSelectPatient(p);
                    setShowNotificationDrawer(false);
                  }}
                  style={{
                    padding: '0.75rem 0.85rem',
                    borderRadius: '16px',
                    background: '#ffffff',
                    border: isUnread 
                      ? '1.5px solid rgba(214, 51, 132, 0.25)' 
                      : '1px solid var(--border-soft)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(3px)';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = isUnread ? 'rgba(214, 51, 132, 0.25)' : 'var(--border-soft)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="patient-avatar" style={{ width: '2rem', height: '2rem', fontSize: '0.72rem', flexShrink: 0 }}>
                        {p.name[0]}{p.surname[0]}
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-color)' }}>
                        {p.name} {p.surname}
                      </span>
                    </div>
                    {isUnread ? (
                      <span style={{ 
                        fontSize: '0.62rem', 
                        fontWeight: 800, 
                        color: 'var(--danger)', 
                        background: '#fee2e2', 
                        padding: '0.15rem 0.45rem', 
                        borderRadius: '8px',
                        border: '1px solid rgba(220, 38, 38, 0.15)'
                      }}>
                        🔴 Da Rispondere ({unreadMsgs.length})
                      </span>
                    ) : (
                      <span style={{ 
                        fontSize: '0.62rem', 
                        fontWeight: 600, 
                        color: 'var(--text-muted)', 
                        background: 'var(--primary-bg)', 
                        padding: '0.15rem 0.45rem', 
                        borderRadius: '8px'
                      }}>
                        🟢 Nessuna pendenza
                      </span>
                    )}
                  </div>

                  {/* Anteprima ultimo messaggio */}
                  {lastMsg ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', marginTop: '0.15rem' }}>
                      <p style={{ 
                        margin: 0, 
                        fontSize: '0.78rem', 
                        color: isUnread ? 'var(--text-color)' : 'var(--text-muted)', 
                        fontWeight: isUnread ? 600 : 400,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {lastMsg.sender === 'doctor' ? 'Tu: ' : ''}"{lastMsg.text}"
                      </p>
                      <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', alignSelf: 'flex-end' }}>
                        {new Date(lastMsg.timestamp).toLocaleDateString('it-IT')} {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ) : (
                    <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Nessun messaggio precedente.
                    </p>
                  )}
                </div>
              );
            };

            return (
              <>
                {/* 1. SEZIONE NON LETTI */}
                {unreadList.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      ⚠️ Da rispondere ({unreadList.length})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {unreadList.map(p => renderPatientItem(p, true))}
                    </div>
                  </div>
                )}

                {/* 2. SEZIONE ALTRI */}
                <div>
                  <h4 style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', marginTop: unreadList.length > 0 ? '0.5rem' : 0 }}>
                    Conversazioni recenti ({otherList.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {otherList.map(p => renderPatientItem(p, false))}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
