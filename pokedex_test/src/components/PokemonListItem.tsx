import { PokemonItemInterface } from "../interfaces/PokemonInterfaces";
import { capitalizeFirstLetter } from "../utils/StringUtils";
import "./PokemonListItem.css";

interface Props {
  pokemon: PokemonItemInterface;
  currentPokemonIndex: null | number;
  setCurrentPokemonIndex: (index: number) => void;
}

const baseIconUrl =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/";

function PokemonListItem(props: Props) {
  const { pokemon, currentPokemonIndex, setCurrentPokemonIndex } = props;
  
  return (
    <li
      className={`pokemon-list-item ${
        pokemon.index === currentPokemonIndex ? "active-pokemon" : ""
      }`}
      onClick={() => setCurrentPokemonIndex(pokemon.index)}
    >
      <picture>
        <img src={`${baseIconUrl}${pokemon.index}.png`} alt={pokemon.name} />
      </picture>
      <span className="pokemon-name">
        {capitalizeFirstLetter(pokemon.name)}
      </span>
      <span className="pokemon-index">
        #{pokemon.index.toString().padStart(3, "0")}
      </span>
    </li>
  );
}

export default PokemonListItem;
