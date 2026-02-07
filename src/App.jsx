import React from 'react';
import Scene1 from './Scene1';      // Intro & Countdown
import Scene5 from './Scene5';      // Timeline Bubbles
import Scene2 from './Scene2';      // Gallery Cube
import Scene7 from './Scene7';      // Cricket Bat
import Scene3 from './Scene3';      // Cake Cutting
import Scene4 from './Scene4';      // Sorry Note Card
import SceneFinale from './SceneFinale'; // Final Celebration Show
import './App.css';

function App() {
  return (
    <main className="app-container">
      <Scene1 />
      <Scene5 />
      <Scene2 />
      <Scene7 />
      <Scene3 />
      <Scene4 />
      <SceneFinale />
    </main>
  );
}

export default App;
