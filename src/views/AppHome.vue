<script>
import axios from 'axios';
import { RouterLink } from 'vue-router';

export default {
  name: 'AppMain',

  data() {
    return {
      restaurants: [], // Ristoranti recuperati dall'API
      types: ['Pizzeria', 'Sushi', 'Messicano', 'Cinese', 'Italiano', 'Indiano', 'Vegano', 'Internazionale', 'Steakhouse', 'Fast Food', 'Bar e Caffetteria', 'Fusion', 'Gourmet', 'Pasticceria'],
      filtraRistorante: [], // Cambiato in array per supportare più selezioni
      ricercaRistorante: '', // Testo di ricerca per filtrare i ristoranti
      error: null,
      base_url: 'http://127.0.0.1:8000', // URL base per l'API
    };
  },
  mounted() {
    this.chiamataRestaurant();
  },

  methods: {
    // Metodo per recuperare i ristoranti dall'API
    chiamataRestaurant() {
      const params = {};
      if (this.filtraRistorante.length > 0) {
        params.type = this.filtraRistorante.join(','); // Unisci i tipi selezionati con una virgola
      }

      // Effettua la chiamata GET con i parametri
      axios.get(`${this.base_url}/api/restaurants`, { params })
        .then(result => {
          this.restaurants = result.data; // Accedi ai ristoranti nella risposta
          console.log(result.data);
        }).catch(error => {
          console.error('Errore nel recupero dei dati:', error);
          this.error = 'Errore nel caricamento dei ristoranti';
          console.log("non funziona ");
        })
    },

    toggleType(type) {
      const index = this.filtraRistorante.indexOf(type);
      if (index === -1) {
        // Se non è selezionato, aggiungi la categoria
        this.filtraRistorante.push(type);
      } else {
        // Se è già selezionato, rimuovi la categoria
        this.filtraRistorante.splice(index, 1);
      }
      this.chiamataRestaurant();

    },

    saveRestaurantName(name) {
    localStorage.setItem('restaurant_name', name); // Salva il nome del ristorante in localStorage
  },

  },

  computed: {
    // Filtra i ristoranti in base alla ricerca e ai tipi selezionati
    filteredRestaurants() {
      return this.restaurants.filter(restaurant => {
        const matchesSearch = restaurant.name.toLowerCase().includes(this.ricercaRistorante.toLowerCase());

        // Se sono selezionati più tipi, controlla se il ristorante appartiene a uno dei tipi selezionati
        const matchesType = this.filtraRistorante.length === 0 ||
          this.filtraRistorante.every(type =>
            restaurant.type.some(t => t.name === type)
          );

        return matchesSearch && matchesType;
      });
    },


    totalRestaurants() {
      return this.filteredRestaurants.length;
    },
  }
};

</script>


<template>
  <div class="text-center cont-main">

    <div class="container">
      <div class="row justify-content-center align-items-center">
        <div class="col-12 col-md-8 col-lg-6 mt-4">
          <img src="/public/logo-deliveboo-no-scritta.png" alt="logo" class="img-fluid">
          <h1 class="mb-3">Benvenuto su Deliveboo</h1>
          <h3 class="mb-4">Il sapore che ti raggiunge</h3>
        </div>
      </div>

      <div class="row justify-content-center">
        <!-- <div class="col-12 col-md-6 col-lg-4 mb-3">
          <input type="text" class="form-control" v-model="ricercaRistorante"
            placeholder="Ricerca un ristorante specifico">
        </div> -->

        <!-- Seleziona la categoria del ristorante -->
        <div class="col-12 mb-2 mt-1">
          <div v-for="(type, index) in types" :key="index" class="chip p-2 me-2 mb-2"
            :class="{ 'chip-selected': filtraRistorante.includes(type) }" @click="toggleType(type)">
            {{ type }}
          </div>
          <h4 v-if="filteredRestaurants.length > 0">Ristoranti trovati: {{ this.filteredRestaurants.length }}</h4>
        </div>

      </div>

      <!-- elenco ristoranti che sono filtrati -->
      <!-- <div class="row justify-content-center">
        <div class="col-12">
          <p class="fs-5 mb-3">Totale ristoranti trovati: {{ totalRestaurants }}</p>
        </div>
      </div> -->

      <!-- Lista dei ristoranti filtrati -->
      <div class="row justify-content-center">
        <template v-if="filteredRestaurants.length > 0">
          <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" v-for="restaurant in filteredRestaurants"
            :key="restaurant.id">
            <div class="card h-100">
              <template v-if="!restaurant.image.startsWith('http')">
                <img class="card-img-top" :src="base_url + '/storage/' + restaurant.image" alt="">
              </template>
              <template v-else>
                <img class="card-img-top" :src="restaurant.image" alt="">
              </template>
              <div class="card-body d-flex flex-column justify-content-between">
                <h5 class="card-title">{{ restaurant.name }}</h5>
                <p class="card-text"><i class="fas fa-map-marker-alt"></i> {{ restaurant.address }}</p>
                <p class="card-text">
                  <strong>Tipologie: </strong>
                  <span v-for="(type, index) in restaurant.type" :key="index">
                    <span :class="{ 'highlighted': filtraRistorante.includes(type.name) }">
                      {{ type.name }}
                    </span>
                    <span v-if="index < restaurant.type.length - 1">, </span>
                  </span>
                </p>
                <div class="">
                  <router-link class="btn btn-success" @click.native="saveRestaurantName(restaurant.name)"
                    :to="{ name: 'menu', params: { restaurant_slug: restaurant.slug } }">
                    Visualizza Menù
                  </router-link>

                </div>
              </div>
            </div>
          </div>
        </template>
        <div v-if="filteredRestaurants.length === 0" class="pb-3">
          <p class="my-3 fs-5">Nessun ristorante trovato per le tipologie selezionate</p>
        </div>

      </div>

      <p v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
/* .cont-main {
  margin-top: 5rem;
} */


.logo {
  width: 100%;
  max-width: 250px;
  height: auto;
}

.card {
  transition: transform 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 10px rgba(252, 129, 21, 0.935);
  transform: scale(1.05);
}

.card-title {
  font-size: 1.25rem;
  color: #333;
}

.card-text {
  color: #777;
}

@media (max-width: 768px) {
  .card {
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 576px) {

  .filter-section,
  #ricercaRistorante {
    width: 100%;
  }
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  border: 2px solid #f3aa6b;
  transition: all 0.3s ease-in-out;
}

.custom-checkbox:checked {
  background-color: #D35400;
  border-color: #D35400;
}

.custom-checkbox:hover {
  border-color: #BDC3C7;
}

.custom-label {
  font-weight: 500;
  margin-left: 8px;
}

.form-check-inline {
  margin-bottom: 10px;
}

.form-check-input {
  cursor: pointer;
}

.chip {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 16px;
  background-color: #e5e5e5;
  color: #333;
  cursor: pointer;

}

.chip-selected {
  background-color: #E67E22;
  color: white;
}

.highlighted {
  font-weight: bold;
  color: #E67E22;
  /* Cambia il colore per evidenziarlo */
}
</style>
