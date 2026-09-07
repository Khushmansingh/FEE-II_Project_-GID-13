import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import SeeFiles from './components/SeeFiles';

function App() {
  const [currentPage, setCurrentPage] = useState('upload');

  return (
    <div className="App">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {currentPage === 'upload' && <Home />}
      {currentPage === 'see-files' && <SeeFiles />}
    </div>
  );
}

export default App;
