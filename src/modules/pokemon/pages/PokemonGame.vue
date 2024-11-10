<template>
  <section
    v-if="isLoading || randomPokemon.id === null"
    class="flex flex-col justify-center items-center w-screen h-screen"
  >
    <h1 class="text-3xl">Espere por favor</h1>
    <h3 class="animate-pulse">Cargando Pokemons</h3>
  </section>

  <section v-else class="flex flex-col justify-center items-center w-screen h-screen">
    <h1 class="m-5">¿Quien es este Pokemon?</h1>
    <!-- <h3 class="capitalize">{{ gameSatus }}</h3> -->
    <div class="h-20">
      <button
        v-if="gameSatus !== GameStatus.Playing"
        @click="getNextGame(4)"
        class="bg-blue-500 text-white rounded-md p-2 capitalize"
      >
        Nuevo Juego
      </button>
    </div>
    <!--  Pokemon Picture -->
    <PokemonPicture
      :pokemon-id="randomPokemon.id"
      :show-pokemon="gameSatus !== GameStatus.Playing"
    />

    <!--  Pokemon Options -->
    <PokemonOptions
      :options="options"
      :block-selection="gameSatus !== GameStatus.Playing"
      :correct-answer="randomPokemon.id"
      @selectedOption="checkPokemonAnswer"
    />
  </section>
</template>

<script setup lang="ts">
import PokemonOptions from '../components/PokemonOptions.vue';
import PokemonPicture from '../components/PokemonPicture.vue';
import { usePokemonGame } from '../composables/usePokemonGame';
import { GameStatus } from '../interfaces';

const {
  randomPokemon,
  isLoading,
  gameSatus,
  pokemonOptions: options,
  checkPokemonAnswer,
  getNextGame,
} = usePokemonGame();
</script>
