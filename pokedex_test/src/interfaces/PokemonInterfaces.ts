export interface PokemonItemInterface {
  name: string;
  index: number;
}

export interface PokemonInterface {
  name: string;
  weight: string;
  height: string;
  species: string;
  abilities: string[];
  egg_groups: string[];
  types: string[];
  evolution_chain: PokemonItemInterface[];
}
