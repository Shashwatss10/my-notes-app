import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import './App.css';
import Header from './components/header';
import NotesListPage from './pages/NotesListPage';
import NotePage from './pages/NotePage';

function App() {
  return (
    <Router>
      <div className="container dark">
        <main className="app">
          <Header />
          <div className="app-content">
            <Routes>
              <Route path='/' element={<NotesListPage />} />
              <Route path='/note/:id' element={<NotePage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
