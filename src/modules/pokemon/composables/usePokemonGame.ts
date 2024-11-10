import { computed, onMounted, ref } from "vue"
import { GameStatus, type Pokemon, type PokemonListResponse } from "../interfaces"
import { pokemonApi } from "../api/pokemonApi"

import confetti from 'canvas-confetti';

export const usePokemonGame = () => {

    // variables reactivas
    const gameSatus = ref<GameStatus>(GameStatus.Playing)
    const pokemons = ref<Pokemon[]>([]);
    const pokemonOptions = ref<Pokemon[]>([]);

    //propiedades computadas
    const randomPokemon = computed(() => {
        const randomIndex = Math.floor(Math.random() * pokemonOptions.value.length);
        return pokemonOptions.value[randomIndex];
    },);

    const isLoading = computed(() => pokemons.value.length === 0);

    //Funcion para hacer la petición a la api
    const getPokemons = async (): Promise<Pokemon[]> => {
        const response = await pokemonApi.get<PokemonListResponse>('/?limit=151');

        const pokemonsArray = response.data.results.map((pokemon) => {

            const urlParts = pokemon.url.split('/');
            const id = urlParts[urlParts.length - 2] ?? 0;
            return {
                name: pokemon.name,
                id: +id, //convierte +id a number
            }
        });

        return pokemonsArray.sort(() => Math.random() - 0.5);
    }


    const getNextGame = (howMany: number = 4) => {
        gameSatus.value = GameStatus.Playing;
        pokemonOptions.value = pokemons.value.slice(0, howMany);
        pokemons.value = pokemons.value.slice(howMany);
    }


    const checkPokemonAnswer = (id: number) => {
        const hasWon = randomPokemon.value.id === id;
        if (hasWon) {
            gameSatus.value = GameStatus.Won;
            confetti({
                particleCount: 300,
                spread: 150,
                origin: { y: 0.6 },
            });

            return;
        }

        gameSatus.value = GameStatus.Lost;

    }

    onMounted(async () => {
        await new Promise(r => setTimeout(r, 1000));
        pokemons.value = await getPokemons();
        getNextGame();

        console.log(pokemonOptions.value);
    });


    return {
        gameSatus,
        isLoading,
        pokemonOptions,
        randomPokemon,

        //Methods
        getNextGame,
        checkPokemonAnswer,
    }
}