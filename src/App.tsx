import React   from 'react';
import logo    from './logo.svg';
import './App.css';
import {Board} from "./components/Board";

function App() {
  return (
    <div className="App">
      <main className={`layout`}>
        <Board></Board>
      </main>



    </div>
  );
}

export default App;
