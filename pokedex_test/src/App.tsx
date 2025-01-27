import { useState } from "react";
import "./App.css";
import PokemonList from "./components/PokemonList";
import PokemonViewer from "./components/PokemonViewer";

function App() {
  const [currentPokemonIndex, setCurrentPokemonIndex] = useState<number | null>(
    null
  );

  return (
    <>
      <div className="pokedex">
        <PokemonList
          currentPokemonIndex={currentPokemonIndex}
          setCurrentPokemonIndex={setCurrentPokemonIndex}
        />
        <PokemonViewer currentPokemonIndex={currentPokemonIndex} />
      </div>
    </>
  );
}

export default App;
