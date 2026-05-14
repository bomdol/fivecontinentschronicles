import React, { useState } from 'react';
import CharacterSelectScreen from './screens/CharacterSelectScreen.jsx';
import GameplayScreen from './screens/GameplayScreen.jsx';

export default function App() {
  const [charData, setCharData] = useState(null);

  if (!charData) {
    return <CharacterSelectScreen onStart={setCharData} />;
  }
  return <GameplayScreen charData={charData} onRestart={() => setCharData(null)} />;
}
