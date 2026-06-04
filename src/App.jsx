import { useState, useEffect } from 'react';
import { Heart, Users, User, LogOut, Loader2 } from 'lucide-react';
import Dashboard from './components/Dashboard';
import PatientView from './components/PatientView';
import { supabase } from './utils/supabaseClient';

export default function App() {
  const [patients, setPatients] = useState([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);

  const [currentView, setCurrentView] = useState('patient'); // 'dashboard' o 'patient'

  // Stato per l'autenticazione
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('liberadiete_role') || null; // 'doctor', 'patient' o null
  });
  const [loggedPatientId, setLoggedPatientId] = useState(() => {
    return localStorage.getItem('liberadiete_patient_id') || null;
  });

  // Campi del form di login
  const [loginTab, setLoginTab] = useState('patient'); // 'patient' o 'doctor'
  const [loginPinInput, setLoginPinInput] = useState('');
  const [loginPasswordInput, setLoginPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Fetch dei pazienti da Supabase all'avvio
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoadingPatients(true);
      const { data, error } = await supabase.from('patients').select('*');
      
      if (error) {
        console.error("Errore fetch Supabase:", error);
      } else if (data) {
        const mapped = data.map(d => ({
          id: d.id,
          name: d.name,
          surname: d.surname,
          pin: d.pin,
          age: d.age,
          gender: d.gender,
          height: d.height,
          weight: d.weight,
          notes: d.notes,
          nextCheckupDate: d.next_checkup_date,
          history: d.history || [],
          bia: d.bia || {},
          diet: d.diet || {},
          selections: d.selections || {}
        }));
        setPatients(mapped);
      }
      setIsLoadingPatients(false);
    };

    fetchPatients();
  }, []);

  // Helper per salvare un paziente su Supabase
  const syncPatientToSupabase = async (p) => {
    const dbPatient = {
      id: p.id,
      name: p.name,
      surname: p.surname,
      pin: p.pin,
      age: p.age,
      gender: p.gender,
      height: p.height,
      weight: p.weight,
      notes: p.notes,
      next_checkup_date: p.nextCheckupDate,
      history: p.history || [],
      bia: p.bia || {},
      diet: p.diet || {},
      selections: p.selections || {}
    };
    
    const { error } = await supabase.from('patients').upsert(dbPatient);
    if (error) {
      console.error("Errore salvataggio Supabase per il paziente", p.id, ":", error);
    }
  };

  // Helper per aggiornare lo stato locale e triggerare il sync
  const updatePatientState = (patientId, updater) => {
    setPatients(prev => {
      const newPatients = prev.map(p => {
        if (p.id === patientId) {
          const updated = updater(p);
          syncPatientToSupabase(updated);
          return updated;
        }
        return p;
      });
      return newPatients;
    });
  };

  // Funzione per generare un PIN unico
  const generateUniquePin = (currentPatients, skipPatientId = '') => {
    const existingPins = new Set(
      currentPatients
        .filter(p => p.id !== skipPatientId)
        .map(p => p.pin)
        .filter(Boolean)
    );
    let pin;
    let attempts = 0;
    do {
      pin = Math.floor(1000 + Math.random() * 9000).toString();
      attempts++;
      if (attempts > 1000) break;
    } while (existingPins.has(pin));
    return pin;
  };

  // Aggiunta di un nuovo paziente
  const handleAddPatient = (newPatient) => {
    const pin = generateUniquePin(patients);
    const p = { ...newPatient, pin };
    setPatients(prev => [p, ...prev]);
    syncPatientToSupabase(p);
  };

  // Aggiornamento della dieta per un paziente
  const handleUpdatePatientDiet = (patientId, newDiet) => {
    updatePatientState(patientId, p => ({ ...p, diet: newDiet, selections: {} }));
  };

  // Aggiornamento delle scelte del calendario per un paziente
  const handleUpdatePatientSelections = (patientId, newSelections) => {
    updatePatientState(patientId, p => ({ ...p, selections: newSelections }));
  };

  // Aggiornamento dei dati BIA per un paziente
  const handleUpdatePatientBia = (patientId, newBia) => {
    updatePatientState(patientId, p => ({ ...p, bia: newBia }));
  };

  // Aggiornamento dei dati anagrafici/fisiologici generali del paziente
  const handleUpdatePatientProfile = (patientId, updatedFields) => {
    updatePatientState(patientId, p => ({ ...p, ...updatedFields }));
  };

  // Aggiornamento del PIN per un paziente
  const handleUpdatePatientPin = (patientId, newPin) => {
    updatePatientState(patientId, p => ({ ...p, pin: newPin }));
  };

  // Aggiornamento dello storico Peso/BIA per un paziente
  const handleUpdatePatientHistory = (patientId, newHistory) => {
    updatePatientState(patientId, p => {
      const sortedHistory = [...newHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
      const latestRecord = sortedHistory[sortedHistory.length - 1];
      
      let updatedBia = p.bia || {};
      if (latestRecord) {
        updatedBia = {
          ...updatedBia,
          fatMass: latestRecord.fatMass,
          muscleMass: latestRecord.muscleMass
        };
      }

      return {
        ...p,
        history: sortedHistory,
        weight: latestRecord ? latestRecord.weight : p.weight,
        bia: updatedBia
      };
    });
  };

  // Aggiornamento del prossimo controllo per un paziente
  const handleUpdatePatientNextCheckup = (patientId, nextCheckupDate) => {
    updatePatientState(patientId, p => ({ ...p, nextCheckupDate }));
  };

  // Gestione del Submit del Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (loginTab === 'patient') {
      if (!loginPinInput || loginPinInput.length !== 4) {
        setLoginError('Inserisci un PIN valido di 4 cifre.');
        return;
      }
      // Cerca il paziente con questo PIN
      const foundPatient = patients.find(p => p.pin === loginPinInput);
      if (foundPatient) {
        setUserRole('patient');
        setLoggedPatientId(foundPatient.id);
        setCurrentView('patient');
        localStorage.setItem('liberadiete_role', 'patient');
        localStorage.setItem('liberadiete_patient_id', foundPatient.id);
        setLoginPinInput('');
      } else {
        setLoginError('Codice PIN errato. Riprova o contatta la dottoressa.');
      }
    } else {
      // Login Medico
      const docPassword = localStorage.getItem('liberadiete_doctor_password') || 'cinzia2026';
      if (loginPasswordInput === docPassword) {
        setUserRole('doctor');
        setLoggedPatientId(null);
        setCurrentView('dashboard');
        localStorage.setItem('liberadiete_role', 'doctor');
        localStorage.removeItem('liberadiete_patient_id');
        setLoginPasswordInput('');
      } else {
        setLoginError('Password errata. Riprova.');
      }
    }
  };

  // Logout
  const handleLogout = () => {
    setUserRole(null);
    setLoggedPatientId(null);
    localStorage.removeItem('liberadiete_role');
    localStorage.removeItem('liberadiete_patient_id');
  };

  // Schermata di login se non autenticato
  if (!userRole) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg-gradient)',
        padding: '1.5rem',
        fontFamily: 'var(--font-sans)'
      }}>
        <div className="glass-card" style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          border: 'none',
          background: 'var(--bg-card)',
          backdropFilter: 'blur(20px)',
          transition: 'all 0.3s ease'
        }}>
          {/* Logo e Dott.ssa */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '2.2rem' }}>
            <div className="logo" style={{ fontSize: '1.9rem', justifyContent: 'center', fontWeight: 800 }}>
              <Heart className="logo-icon" size={32} fill="currentColor" />
              <span>Libera dalle Diete</span>
            </div>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--primary)',
              letterSpacing: '0.04em',
              opacity: 0.85
            }}>
              🩺 Dott.ssa Ciervo Cinzia — Biologa Nutrizionista
            </span>
          </div>

          {/* Tab di selezione ruolo */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            background: 'rgba(255, 240, 247, 0.60)',
            padding: '4px',
            borderRadius: '24px',
            marginBottom: '1.8rem',
            border: '1.5px solid var(--border-color)'
          }}>
            <button
              type="button"
              className={`btn btn-sm ${loginTab === 'patient' ? 'btn-primary' : 'btn-outline'}`}
              style={{ flex: 1, border: 'none', padding: '0.6rem', borderRadius: '20px' }}
              onClick={() => { setLoginTab('patient'); setLoginError(''); }}
            >
              <User size={16} /> Area Paziente
            </button>
            <button
              type="button"
              className={`btn btn-sm ${loginTab === 'doctor' ? 'btn-primary' : 'btn-outline'}`}
              style={{ flex: 1, border: 'none', padding: '0.6rem', borderRadius: '20px' }}
              onClick={() => { setLoginTab('doctor'); setLoginError(''); }}
            >
              <Users size={16} /> Nutrizionista
            </button>
          </div>

          <form onSubmit={handleLoginSubmit}>
            {loginTab === 'patient' ? (
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label className="form-label">Codice PIN Personale</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="• • • •"
                  maxLength={4}
                  required
                  style={{ textAlign: 'center', fontSize: '1.8rem', letterSpacing: '0.6rem', fontWeight: 800 }}
                  value={loginPinInput}
                  onChange={(e) => setLoginPinInput(e.target.value.replace(/\D/g, ''))}
                />
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.6rem', lineHeight: 1.4 }}>
                  Digita il codice PIN a 4 cifre personalizzato fornito dalla Dott.ssa Ciervo Cinzia.
                </p>
              </div>
            ) : (
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label className="form-label">Password Medico</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Inserisci la password di accesso"
                  required
                  style={{ fontSize: '1rem' }}
                  value={loginPasswordInput}
                  onChange={(e) => setLoginPasswordInput(e.target.value)}
                />
              </div>
            )}

            {loginError && (
              <div style={{
                color: 'var(--danger)',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginTop: '1rem',
                background: '#fee2e2',
                padding: '0.6rem',
                borderRadius: '8px',
                border: '1px solid rgba(220, 38, 38, 0.2)'
              }}>
                {loginError}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '1.8rem', padding: '0.75rem', borderRadius: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
              disabled={isLoadingPatients}
            >
              {isLoadingPatients ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Caricamento dati...
                </>
              ) : (
                "Accedi all'App"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtra i pazienti passati alla vista paziente per sicurezza
  const visiblePatients = userRole === 'patient' 
    ? patients.filter(p => p.id === loggedPatientId) 
    : patients;

  const appContent = (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Header Premium con Glassmorphism */}
      <header>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.05rem' }}>
          <div className="logo" style={{ fontSize: '1.25rem' }}>
            <Heart className="logo-icon" size={20} fill="currentColor" />
            <span>Libera dalle Diete</span>
          </div>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            letterSpacing: '0.02em',
            paddingLeft: '0.25rem'
          }}>
            Dott.ssa Ciervo Cinzia — Biologa Nutrizionista
          </span>
        </div>
        
        {/* Navigazione ed Azioni */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Switcher Viste - Solo per il Medico */}
          {userRole === 'doctor' && (
            <div className="nav-buttons">
              <button 
                className={`btn btn-outline btn-sm ${currentView === 'patient' ? 'active' : ''}`}
                onClick={() => setCurrentView('patient')}
              >
                <User size={14} />
                Area Paziente
              </button>
              <button 
                className={`btn btn-outline btn-sm ${currentView === 'dashboard' ? 'active' : ''}`}
                onClick={() => setCurrentView('dashboard')}
              >
                <Users size={14} />
                Dashboard Medico
              </button>
            </div>
          )}

          {/* Nome utente o ruolo loggato */}
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            {userRole === 'doctor' ? '👑 Dr.ssa Cinzia' : `👤 ${visiblePatients[0]?.name || 'Paziente'}`}
          </span>

          {/* Bottone Disconnetti */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleLogout}
            title="Esci dall'applicazione"
            style={{ padding: '0.4rem 0.7rem', display: 'flex', gap: '0.35rem' }}
          >
            <LogOut size={14} />
            Esci
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="app-container" style={{ flex: 1 }}>
        {currentView === 'dashboard' && userRole === 'doctor' ? (
          <Dashboard 
            patients={patients} 
            onAddPatient={handleAddPatient} 
            onUpdatePatientDiet={handleUpdatePatientDiet} 
            onUpdatePatientBia={handleUpdatePatientBia}
            onUpdatePatientPin={handleUpdatePatientPin}
            onUpdatePatientHistory={handleUpdatePatientHistory}
            onUpdatePatientNextCheckup={handleUpdatePatientNextCheckup}
            onUpdatePatientProfile={handleUpdatePatientProfile}
          />
        ) : (
          <PatientView 
            patients={visiblePatients} 
            onUpdatePatientSelections={handleUpdatePatientSelections} 
            onUpdatePatientHistory={handleUpdatePatientHistory} 
            onUpdatePatientProfile={handleUpdatePatientProfile}
            isPatientLogged={userRole === 'patient'}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{ 
        padding: '2rem 1.5rem', 
        textAlign: 'center', 
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        background: 'rgba(255, 240, 247, 0.50)',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
          <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem', letterSpacing: '0.02em' }}>
            🩺 Dott.ssa Ciervo Cinzia — Biologa Nutrizionista
          </p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
            Con ❤️ per chi vuole mangiare bene senza stress. © 2026 Libera dalle Diete. Tutti i diritti riservati.
          </p>
        </div>
      </footer>

    </div>
  );

  return appContent;
}
