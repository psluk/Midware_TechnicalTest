import "./PokemonList.css";
import { useEffect, useRef, useState } from "react";
import { PokemonItemInterface } from "../interfaces/PokemonInterfaces";
import PokemonListItem from "./PokemonListItem";

const baseListUrl = "https://pokeapi.co/api/v2/pokemon/";
const elementsPerPage = 50;

interface Props {
  currentPokemonIndex: null | number;
  setCurrentPokemonIndex: (index: number) => void;
}

function PokemonList(props: Props) {
  const { currentPokemonIndex, setCurrentPokemonIndex } = props;
  const [listUrl, setListUrl] = useState(
    `${baseListUrl}?offset=0&limit=${elementsPerPage}`
  );
  const [loading, setLoading] = useState(false);
  const [pokemonList, setPokemonList] = useState<PokemonItemInterface[]>([]);
  const [hasNext, setHasNext] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  const loadMore = () => {
    setLoading(true);
    fetch(listUrl)
      .then((response) => response.json())
      .then((data) => {
        const newItems = data.results.map(
          (item: { name: string; url: string }) => ({
            name: item.name,
            index: parseInt(item.url.replace(baseListUrl, "").replace("/", "")),
          })
        );
        setHasNext(data.next !== null);
        setPokemonList([...pokemonList, ...newItems]);
        setListUrl(data.next);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMore();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        !listRef.current ||
        listRef.current.scrollHeight - listRef.current.scrollTop >
          listRef.current.clientHeight + 50 ||
        loading
      ) {
        // If the user is not at the bottom of the page or the list is loading, return
        return;
      }
      if (hasNext) {
        // If there are more items to load, load them
        loadMore();
      }
    };

    const currentListRef = listRef.current;
    currentListRef?.addEventListener("scroll", handleScroll);

    return () => {
      currentListRef?.removeEventListener("scroll", handleScroll);
    };
  }, [listRef, hasNext, loading]);

  return (
    <div className="pokemon-list bordered-element" ref={listRef}>
      <ul>
        {pokemonList.map((pokemon, index) => (
          <PokemonListItem
            key={index}
            pokemon={pokemon}
            currentPokemonIndex={currentPokemonIndex}
            setCurrentPokemonIndex={setCurrentPokemonIndex}
          />
        ))}
        {loading && <li>Loading...</li>}
      </ul>
    </div>
  );
}

export default PokemonList;
