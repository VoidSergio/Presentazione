// App.jsx: punto di ingresso, un solo pubblico per branch (stesso schema
// di main e collaboratori: nessuna variabile d'ambiente sceglie il
// contenuto a runtime, il branch stesso e' la scelta). Su questo branch
// (agenzie-immobiliari) monta sempre PresentazioneAgenzie.
import PresentazioneAgenzie from './pages/PresentazioneAgenzie';

function App() {
  return <PresentazioneAgenzie />;
}

export default App;
