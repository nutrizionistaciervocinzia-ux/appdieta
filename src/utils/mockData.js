export const MOCK_PATIENTS = [
  {
    id: "paz-1",
    name: "Chiara",
    surname: "Bianchi",
    pin: "1234",
    age: 29,
    gender: "Femmina",
    height: 168,
    weight: 62,
    notes: "Dieta ipocalorica bilanciata. Sensibilità al lattosio (predilige yogurt greco delattosato o latte vegetale). Obiettivo ricomposizione corporea.",
    nextCheckupDate: "2026-06-18",
    history: [
      { date: "2026-04-10", weight: 65.0, fatMass: 26.0, muscleMass: 43.5 },
      { date: "2026-05-02", weight: 63.8, fatMass: 25.2, muscleMass: 44.2 },
      { date: "2026-06-01", weight: 62.0, fatMass: 24.0, muscleMass: 45.0 }
    ],
    bia: {
      fatMass: 24,
      muscleMass: 45,
      bmr: 1350,
      activityFactor: 1.4,
      target: "Dimagrimento"
    },
    diet: {
      id: "diet-1",
      colazione: [
        { id: "col-1", content: "Yogurt greco 0% senza lattosio (150g) + Fiocchi d'avena (40g) + Mirtilli freschi (50g) + Mandorle (10g)" },
        { id: "col-2", content: "Latte di mandorla senza zuccheri (200ml) + 4 Fette biscottate integrali + 2 cucchiaini di Marmellata di ciliegie 100% frutta" },
        { id: "col-3", content: "Spremuta d'arancia fresca + Toast composto da: Pane di segale (50g) + Fesa di tacchino (60g) + Caffè non zuccherato" }
      ],
      spuntini: [
        { id: "spu-1", content: "Una mela verde grande (150g) + Noci sgusciate (15g)" },
        { id: "spu-2", content: "Yogurt magro bianco delattosato (125g) + 10 Mandorle" },
        { id: "spu-3", content: "Parmigiano Reggiano (20g) + 2 gallette di riso integrale" }
      ],
      pranzoCarboidrati: [
        { id: "p-carb-1", food: "Pasta integrale", quantity: "80g" },
        { id: "p-carb-2", food: "Riso Basmati o Venere", quantity: "80g" },
        { id: "p-carb-3", food: "Quinoa o Farro perlato", quantity: "80g" }
      ],
      pranzoProteine: [
        { id: "p-prot-1", food: "Petto di pollo o tacchino ai ferri", quantity: "140g" },
        { id: "p-prot-2", food: "Uova intere biologiche (alla coque o in camicia)", quantity: "2 uova" },
        { id: "p-prot-3", food: "Salmone selvaggio affumicato", quantity: "100g" }
      ],
      pranzoVerdure: [
        { id: "p-veg-1", food: "Insalata mista a foglia verde", quantity: "a volontà" },
        { id: "p-veg-2", food: "Zucchine e Melanzane grigliate", quantity: "a volontà" }
      ],
      pranzoGrassi: [
        { id: "p-fat-1", food: "Olio Extravergine d'Oliva (EVO)", quantity: "2 cucchiai (20g)" },
        { id: "p-fat-2", food: "Avocado fresco", quantity: "50g" }
      ],
      cenaCarboidrati: [
        { id: "c-carb-1", food: "Pane di segale o integrale", quantity: "100g" },
        { id: "c-carb-2", food: "Patate dolci o rosse al vapore", quantity: "280g" }
      ],
      cenaProteine: [
        { id: "c-prot-1", food: "Filetto di orata o merluzzo al cartoccio", quantity: "180g" },
        { id: "c-prot-2", food: "Mozzarella light o Fiocchi di latte", quantity: "100g" },
        { id: "c-prot-3", food: "Lenticchie secche (da cuocere)", quantity: "80g" }
      ],
      cenaVerdure: [
        { id: "c-veg-1", food: "Spinaci o Bieta al vapore con limone", quantity: "a volontà" },
        { id: "c-veg-2", food: "Finocchi crudi o Cetrioli", quantity: "a volontà" }
      ],
      cenaGrassi: [
        { id: "c-fat-1", food: "Olio Extravergine d'Oliva (EVO)", quantity: "1.5 cucchiai (15g)" },
        { id: "c-fat-2", food: "Mandorle o Noci", quantity: "15g" }
      ]
    },
    selections: {
      "Lunedì": {
        colazioneId: "col-1",
        spuntinoMattinaId: "spu-1",
        spuntinoPomeriggioId: "spu-2",
        pranzo: { carboidratiId: "p-carb-1", proteineId: "p-prot-1", verdureId: "p-veg-1", grassiId: "p-fat-1" },
        cena: { carboidratiId: "c-carb-1", proteineId: "c-prot-1", verdureId: "c-veg-1", grassiId: "c-fat-1" }
      },
      "Martedì": {
        colazioneId: "col-2",
        spuntinoMattinaId: "spu-2",
        spuntinoPomeriggioId: "spu-1",
        pranzo: { carboidratiId: "p-carb-2", proteineId: "p-prot-2", verdureId: "p-veg-2", grassiId: "p-fat-2" },
        cena: { carboidratiId: "c-carb-1", proteineId: "c-prot-2", verdureId: "c-veg-1", grassiId: "c-fat-1" }
      }
    }
  },
  {
    id: "paz-2",
    name: "Marco",
    surname: "Rossi",
    pin: "5678",
    age: 35,
    gender: "Maschio",
    height: 180,
    weight: 80,
    notes: "Dieta iperproteica per aumento massa muscolare. Nessuna allergia.",
    nextCheckupDate: "2026-06-25",
    history: [
      { date: "2026-05-01", weight: 82.5, fatMass: 17.2, muscleMass: 63.0 },
      { date: "2026-05-15", weight: 81.0, fatMass: 16.0, muscleMass: 64.2 },
      { date: "2026-06-01", weight: 80.0, fatMass: 15.0, muscleMass: 65.0 }
    ],
    bia: {
      fatMass: 15,
      muscleMass: 65,
      bmr: 1750,
      activityFactor: 1.5,
      target: "Massa"
    },
    diet: {
      id: "diet-2",
      colazione: [
        { id: "col-1", content: "Omelette di albumi (150ml) e 1 tuorlo + 3 fette di pane tostato + 1 banana + Caffè" },
        { id: "col-2", content: "Yogurt greco 0% (200g) + Avena (60g) + Noci (15g) + Miele (1 cucchiaio)" }
      ],
      spuntini: [
        { id: "spu-1", content: "Pane integrale (60g) + Bresaola (60g)" },
        { id: "spu-2", content: "Shake di proteine whey (30g) + 1 mela" }
      ],
      pranzoCarboidrati: [
        { id: "p-carb-1", food: "Riso Basmati", quantity: "100g" },
        { id: "p-carb-2", food: "Pasta di semola", quantity: "100g" }
      ],
      pranzoProteine: [
        { id: "p-prot-1", food: "Petto di pollo", quantity: "180g" },
        { id: "p-prot-2", food: "Tofu alla piastra", quantity: "180g" }
      ],
      pranzoVerdure: [
        { id: "p-veg-1", food: "Zucchine grigliate", quantity: "a volontà" }
      ],
      pranzoGrassi: [
        { id: "p-fat-1", food: "Olio Extravergine d'Oliva", quantity: "2.5 cucchiai (25g)" }
      ],
      cenaCarboidrati: [
        { id: "c-carb-1", food: "Pane integrale", quantity: "120g" }
      ],
      cenaProteine: [
        { id: "c-prot-1", food: "Salmone fresco alla griglia", quantity: "150g" }
      ],
      cenaVerdure: [
        { id: "c-veg-1", food: "Broccoli al vapore", quantity: "a volontà" }
      ],
      cenaGrassi: [
        { id: "c-fat-1", food: "Olio Extravergine d'Oliva", quantity: "2 cucchiai (20g)" }
      ]
    },
    selections: {}
  }
];
