import './App.css';
import Engine from './Component/Engine/Engine'
import { CookiesProvider } from 'react-cookie';

function App() {
  return (
    <div className="App">
    <CookiesProvider>
      <Engine/>
    </CookiesProvider>
    </div>
  );
}

export default App;
