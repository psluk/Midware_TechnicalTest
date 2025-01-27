import { Fragment, useEffect, useState } from "react";
import { EvolutionArrow } from "../assets/Icons";
import {
  PokemonInterface,
  PokemonItemInterface,
} from "../interfaces/PokemonInterfaces";
import { capitalizeFirstLetter } from "../utils/StringUtils";
import "./PokemonViewer.css";

interface Props {
  currentPokemonIndex: null | number;
}

interface InformationFeature {
  label: string;
  value: keyof PokemonInterface;
}

interface EvolutionChain {
  species: { name: string; url: string };
  evolves_to: EvolutionChain[];
}

const baseInformationUrl = "https://pokeapi.co/api/v2/pokemon/";
const baseSpeciesUrl = "https://pokeapi.co/api/v2/pokemon-species/";
const baseEvolutionUrl = "https://pokeapi.co/api/v2/evolution-chain/";

const informationFeatures: InformationFeature[] = [
  { label: "Weight", value: "weight" },
  { label: "Height", value: "height" },
  { label: "Species", value: "species" },
  { label: "Egg Groups", value: "egg_groups" },
  { label: "Abilities", value: "abilities" },
];

function PokemonViewer(props: Props) {
  const { currentPokemonIndex } = props;
  const [baseInformation, setBaseInformation] =
    useState<PokemonInterface | null>(null);

  const flattenEvolutions = (evolutionChain: EvolutionChain) => {
    const evolutions: PokemonItemInterface[] = [];
    const flatten = (evolution: {
      species: { name: string; url: string };
      evolves_to: EvolutionChain[];
    }) => {
      evolutions.push({
        name: evolution.species.name,
        index: parseInt(
          evolution.species.url.replace(baseSpeciesUrl, "").replace("/", "")
        ),
      });
      if (evolution.evolves_to.length > 0) {
        evolution.evolves_to.forEach((evolution: EvolutionChain) =>
          flatten(evolution)
        );
      }
    };
    flatten(evolutionChain);
    return evolutions;
  };

  useEffect(() => {
    if (currentPokemonIndex !== null) {
      setBaseInformation(null);
      const informationPromise = fetch(
        `${baseInformationUrl}${currentPokemonIndex}`
      );
      const speciesPromise = fetch(`${baseSpeciesUrl}${currentPokemonIndex}`);
      const evolutionPromise = fetch(
        `${baseEvolutionUrl}${currentPokemonIndex}`
      );

      Promise.all([informationPromise, speciesPromise, evolutionPromise])
        .then((responses) =>
          Promise.all(responses.map((response) => response.json()))
        )
        .then((data) => {
          const [information, species, evolution] = data;
          const formatHeight = (heightDecimeters: number) => {
            const totalInches = heightDecimeters * 3.93701;
            const feet = Math.floor(totalInches / 12);
            const inches = Math.round(totalInches % 12);
            return `${feet}'${inches.toString().padStart(2, "0")}"`; // Example shows 2'04" for the height of Bulbasaur
          };

          setBaseInformation({
            name: information.name,
            weight: `${((information.weight / 10) * 2.20462).toFixed(1)} lbs.`, // Convert from hectograms to pounds, as shown in the example
            height: formatHeight(information.height),
            species: species.genera.find(
              (genus: { language: { name: string }; genus: string }) =>
                genus.language.name === "en"
            ).genus,
            abilities: information.abilities.map(
              (ability: { ability: { name: string } }) => ability.ability.name
            ),
            egg_groups: species.egg_groups.map(
              (group: { name: string }) => group.name
            ),
            types: information.types.map(
              (type: { type: { name: string } }) => type.type.name
            ),
            evolution_chain: flattenEvolutions(evolution.chain),
          });
        });
    }
  }, [currentPokemonIndex]);

  return (
    <div className="pokemon-viewer bordered-element">
      {currentPokemonIndex !== null && baseInformation ? (
        <>
          <section>
            <div className="pokemon-image-side">
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${currentPokemonIndex}.png`}
                alt={capitalizeFirstLetter(baseInformation.name)}
              />
              <h1>{capitalizeFirstLetter(baseInformation.name)}</h1>
              <ul>
                {baseInformation.types.map((type) => (
                  <li key={type}>{capitalizeFirstLetter(type)}</li>
                ))}
              </ul>
            </div>
            <div className="pokemon-info-side">
              <h2>Information</h2>
              <ul>
                {informationFeatures.map((info, index) => (
                  <li key={index}>
                    <span>{info.label}:</span>
                    <span>
                      {Array.isArray(baseInformation[info.value])
                        ? (baseInformation[info.value] as string[])
                            .map((item) => capitalizeFirstLetter(item))
                            .join(", ")
                        : baseInformation[info.value].toString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section className="evolution-section">
            <h2>Evolution Chart</h2>
            <div className="evolution-chart">
              {baseInformation.evolution_chain.map((pokemon, index) => (
                <Fragment key={index}>
                  {index !== 0 && (
                    <EvolutionArrow className="evolution-arrow" />
                  )}
                  <div key={index} className="evolution-item">
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.index}.png`}
                      alt={`Pokemon #${pokemon.index}`}
                    />
                    <span>{capitalizeFirstLetter(pokemon.name)}</span>
                  </div>
                </Fragment>
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className="no-pokemon-selected">
          <span>Select a Pokémon</span>
        </div>
      )}
    </div>
  );
}

export default PokemonViewer;
