import { useState, useEffect } from 'react';
import { Heart, Users, User, LogOut } from 'lucide-react';
import Dashboard from './components/Dashboard';
import PatientView from './components/PatientView';
import { MOCK_PATIENTS } from './utils/mockData';

export default function App() {
  const [patients, setPatients] = useState(() => {
    let initial;
    try {
      const saved = localStorage.getItem('liberadiete_patients');
      initial = saved ? JSON.parse(saved) : MOCK_PATIENTS;
      if (!Array.isArray(initial)) {
        initial = MOCK_PATIENTS;
      }
    } catch (e) {
      console.error("Errore nel parsing dei pazienti da localStorage:", e);
      initial = MOCK_PATIENTS;
    }
    let changed = false;
    const updated = initial.map((p, idx, self) => {
      const isDuplicate = self.slice(0, idx).some(other => other.pin === p.pin);
      if (!p.pin || isDuplicate) {
        const existingPins = new Set(
          self.map((x, i) => i !== idx ? x.pin : null).filter(Boolean)
        );
        let pin;
        do {
          pin = Math.floor(1000 + Math.random() * 9000).toString();
        } while (existingPins.has(pin));
        changed = true;
        return { ...p, pin };
      }
      return p;
    });
    if (changed) {
      localStorage.setItem('liberadiete_patients', JSON.stringify(updated));
    }
    return updated;
  });

  const [currentView, setCurrentView] = useState('patient'); // 'dashboard' o 'patient'
  const [isMobileSimulator, setIsMobileSimulator] = useState(false);

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

  // Persistenza nel localStorage ad ogni modifica dei pazienti
  useEffect(() => {
    localStorage.setItem('liberadiete_patients', JSON.stringify(patients));
  }, [patients]);

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



  // Aggiunta di un nuovo paziente con PIN automatico e sempre unico
  const handleAddPatient = (newPatient) => {
    const pin = generateUniquePin(patients);
    setPatients(prev => [{ ...newPatient, pin }, ...prev]);
  };

  // Aggiornamento della dieta per un paziente
  const handleUpdatePatientDiet = (patientId, newDiet) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          diet: newDiet,
          // Quando la dieta cambia, azzeriamo le scelte del calendario per evitare conflitti di ID
          selections: {}
        };
      }
      return p;
    }));
  };

  // Aggiornamento delle scelte del calendario per un paziente
  const handleUpdatePatientSelections = (patientId, newSelections) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          selections: newSelections
        };
      }
      return p;
    }));
  };

  // Aggiornamento dei dati BIA per un paziente
  const handleUpdatePatientBia = (patientId, newBia) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          bia: newBia
        };
      }
      return p;
    }));
  };

  // Aggiornamento dei dati anagrafici/fisiologici generali del paziente
  const handleUpdatePatientProfile = (patientId, updatedFields) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          ...updatedFields
        };
      }
      return p;
    }));
  };

  // Aggiornamento del PIN per un paziente
  const handleUpdatePatientPin = (patientId, newPin) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          pin: newPin
        };
      }
      return p;
    }));
  };

  // Aggiornamento dello storico Peso/BIA per un paziente
  const handleUpdatePatientHistory = (patientId, newHistory) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
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
      }
      return p;
    }));
  };

  // Aggiornamento del prossimo controllo per un paziente
  const handleUpdatePatientNextCheckup = (patientId, nextCheckupDate) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          nextCheckupDate
        };
      }
      return p;
    }));
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
          border: '1px solid var(--border-color)',
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

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.8rem', padding: '0.75rem', borderRadius: '24px' }}>
              Accedi all'App
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: isMobileSimulator ? '100%' : '100vh' }}>
      
      {/* Header Premium con Glassmorphism */}
      <header>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
          <div className="logo">
            <Heart className="logo-icon" size={24} fill="currentColor" />
            <span>Libera dalle Diete</span>
          </div>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'var(--primary)',
            letterSpacing: '0.04em',
            opacity: 0.75,
            paddingLeft: '0.25rem'
          }}>
            🩺 Dott.ssa Ciervo Cinzia — Biologa Nutrizionista
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

          {/* Simulatore iPhone Button - Nascosto se siamo già dentro l'iframe */}
          {window.self === window.top && (
            <button 
              className={`btn btn-sm ${isMobileSimulator ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setIsMobileSimulator(!isMobileSimulator)}
              title="Simulatore iPhone"
              style={{ padding: '0.4rem 0.7rem', display: 'flex', gap: '0.35rem', alignItems: 'center', borderRadius: '12px' }}
            >
              <span style={{ fontSize: '1rem' }}>📱</span>
              {isMobileSimulator ? 'Esci iPhone' : 'Simula iPhone'}
            </button>
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

  if (isMobileSimulator) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#111827',
        backgroundImage: 'radial-gradient(circle at center, #1f2937 0%, #111827 100%)',
        padding: '2rem'
      }}>
        {/* L'iPhone */}
        <div style={{
          width: '390px',
          height: '844px',
          backgroundColor: '#fff',
          borderRadius: '55px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), inset 0 0 0 12px #000, inset 0 0 0 14px #222',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Dynamic Island */}
          <div style={{
            position: 'absolute',
            top: '22px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '125px',
            height: '35px',
            backgroundColor: '#000',
            borderRadius: '24px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px'
          }}>
             <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#111' }}></div>
             <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#111', boxShadow: 'inset 0px 0px 4px #000, inset 0px 0px 1px #fff' }}></div>
          </div>

          <div style={{ 
            flex: 1, 
            overflow: 'hidden',
            backgroundColor: 'var(--bg-gradient)' 
          }}>
            <iframe 
              src={window.location.origin + window.location.pathname + '?sim=8'} 
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="iPhone Simulator"
            />
          </div>
        </div>
      </div>
    );
  }

  return appContent;
}
