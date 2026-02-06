import React from 'react';
import Scene1 from './Scene1'; // Intro
import Scene5 from './Scene5'; // Timeline (2nd)
import Scene2 from './Scene2'; // Gallery (3rd)
import Scene7 from './Scene7'; // Vibe/Dance (4th)
import Scene3 from './Scene3'; // Cake (5th)
import Scene6 from './Scene6'; // Gift (6th)
import Scene4 from './Scene4'; // Apology (7th)
import Scene8 from './Scene8'; // Lanterns/Closing (8th)
import './App.css';

function App() {
  return (
    <main className="app-container">
      <Scene1 />
      <Scene5 />
      <Scene2 />
      <Scene7 />
      <Scene3 />
      <Scene6 />
      <Scene4 />
      <Scene8 />
    </main>
  );
}

export default App;
