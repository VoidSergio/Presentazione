// App.jsx: unico punto di ingresso che sceglie quale presentazione
// montare in base ad AUDIENCE_CORRENTE (src/config/audience.js). Quando
// VITE_AUDIENCE non e' impostata (main e collaboratori oggi non la
// impostano) il default e' 'hotel', quindi il comportamento resta
// identico a prima di questo cambiamento: <Presentation /> come unico
// ramo raggiunto. Il ramo 'agenzie' e' nuovo (vedi
// _reference/PIANO_ARCHITETTURA_MULTI_AUDIENCE.md).
import Presentation from './pages/Presentation';
import PresentazioneAgenzie from './pages/PresentazioneAgenzie';
import { AUDIENCE_CORRENTE } from './config/audience';

function App() {
  if (AUDIENCE_CORRENTE === 'agenzie') {
    return <PresentazioneAgenzie />;
  }

  return <Presentation />;
}

export default App;
