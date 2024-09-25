<script>
import axios from 'axios';
import PaymentComponent from '../components/PaymentComponent.vue';
import { EventBus } from '../eventBus'; // Importa l'EventBus

import { useRouter } from 'vue-router'; // Importa il router

export default {

  data() {
    return {
      restaurants: [], // Ristoranti recuperati dall'API
      dishes: [],
      error: null,
      cart: JSON.parse(localStorage.getItem('cart')) || [],
      cartName: JSON.parse(localStorage.getItem('restaurant')) || [],
      currentRestaurant: localStorage.getItem('currentRestaurant') || null,
      base_url: 'http://127.0.0.1:8000',
      showPayment: false, // Variabile per mostrare il modulo di pagamento
      pendingRestaurantSlug: null, // Ristorante in sospeso per il cambio
      restaurantName: localStorage.getItem('restaurant_name') || 'Nome non disponibile',
    };
  },
  components: {
    PaymentComponent, // Registra il componente di pagamento
  },
  mounted() {
    this.chiamataRestaurant();
    this.getDishes();
    this.updateCartCount(); // Aggiorna il conteggio iniziale del carrello
  },

  methods: {
    chiamataRestaurant() {
      // Effettua la chiamata GET con i parametri
      axios.get(`${this.base_url}/api/restaurants`)
        .then(result => {
          this.restaurants = result.data; // Accedi ai ristoranti nella risposta
          console.log(this.restaurants);
        })
        .catch(error => {
          console.error('Errore nel recupero dei dati:', error);
          this.error = 'Errore nel caricamento dei ristoranti';
          console.log("non funziona ");
        })
    },

    updateCartCount() {
      const totalProducts = this.cart.reduce((total, dish) => total + dish.quantity, 0);
      EventBus.updateCartCount(totalProducts); // Aggiorna l'EventBus
    },
    getDishes() {
      const restaurantSlug = this.$route.params.restaurant_slug;

      // Carica i piatti direttamente, senza mostrare il modale
      this.loadDishes(restaurantSlug);
    },

    loadDishes(restaurantSlug) {
      // Effettua la chiamata per ottenere i piatti del ristorante
      axios.get(`${this.base_url}/api/restaurants/${restaurantSlug}/dishes`)
        .then(response => {
          this.dishes = response.data.dishes;
        })
        .catch(error => {
          this.error = 'Errore nel caricamento dei piatti';
          console.error(error);
        });

      if (this.currentRestaurant && this.currentRestaurant !== restaurantSlug) {
        // Non svuotare il carrello automaticamente, solo se si prova ad aggiungere un piatto
        this.currentRestaurant = restaurantSlug;
      }

      localStorage.setItem('currentRestaurant', restaurantSlug);
    },

    confirmRestaurantChange() {
      // Svuota il carrello e carica i piatti del nuovo ristorante
      this.clearCart();
      this.loadDishes(this.pendingRestaurantSlug);
      this.pendingRestaurantSlug = null;
      const confirmModal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
      confirmModal.hide();
    },

    cancelRestaurantChange() {
      // Ricarica i piatti del ristorante corrente senza svuotare il carrello
      this.loadDishes(this.currentRestaurant);
      this.pendingRestaurantSlug = null;
      const confirmModal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
      confirmModal.hide();
    },


    cancelRestaurantChange() {
      this.$router.push('/cart');  // Reindirizza alla pagina del carrello
      const confirmModal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
      confirmModal.hide();
    },


    addToCart(dish) {
      const restaurantSlugInCart = localStorage.getItem('restaurant_slug');

      // Controlla se l'utente sta cercando di aggiungere piatti da un ristorante diverso
      if (restaurantSlugInCart && restaurantSlugInCart !== this.$route.params.restaurant_slug) {
        if (this.cart.length > 0) {
          // Mostra l'avviso solo se c'è già un ristorante nel carrello
          this.pendingRestaurantSlug = this.$route.params.restaurant_slug;
          const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
          confirmModal.show();
          return;  // Blocca l'aggiunta del piatto
        }
      }

      // Cerca se il piatto è già nel carrello
      const cartItem = this.cart.find(item => item.id === dish.id);

      if (cartItem) {
        // Se il piatto è già nel carrello, incrementa la quantità
        cartItem.quantity += 1;
      } else {
        // Se il piatto non è nel carrello, aggiungilo con quantità 1
        this.cart.push({ ...dish, quantity: 1, cartRecordName: this.restaurantName });
      }

      // Salva il nome e lo slug del ristorante nel localStorage
      localStorage.setItem('restaurant_name', this.restaurantName);
      localStorage.setItem('restaurant_slug', this.$route.params.restaurant_slug);

      // Salva il carrello nel localStorage
      localStorage.setItem('cart', JSON.stringify(this.cart));
      // Salva il nome nel localStorage
      localStorage.setItem('restaurant', JSON.stringify(this.cartName));
      this.updateCartCount(); // Aggiorna il conteggio del carrello
    },

    removeFromCart(dish) {
      this.cart = this.cart.filter(item => item.id !== dish.id);
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.updateCartCount(); // Aggiorna il conteggio del carrello
    },
    clearCart() {
      this.cart = [];
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.updateCartCount();

    },
    incrementQuantity(dish) {
      // Incrementa la quantità del piatto
      const cartItem = this.cart.find(item => item.id === dish.id);
      if (cartItem) {
        cartItem.quantity += 1;
      }
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.updateCartCount();
    },
    decrementQuantity(dish) {
      // Decrementa la quantità del piatto, ma non scende sotto 1
      const cartItem = this.cart.find(item => item.id === dish.id);
      if (cartItem && cartItem.quantity > 1) {
        cartItem.quantity -= 1;
      } else if (cartItem && cartItem.quantity === 1) {
        // Se la quantità è 1, rimuovi il piatto dal carrello
        this.removeFromCart(dish);
      }
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.updateCartCount();
    },

    proceedToOrder() {
      if (this.cart.length > 0) {
        this.$router.push('/cart'); // Reindirizza alla vista AppCart
      }
    }


  },

  computed: {
    // Calcola il totale dei prodotti inseriti nel carrello
    totalProducts() {
      return this.cart.reduce((total, dish) => total + dish.quantity, 0);
    },
    // Calcola il totale del prezzo
    totalPrice() {
      return this.cart.reduce((total, dish) => total + (dish.price * dish.quantity), 0).toFixed(2);
    },
    getCurrentRestaurant() {
      // Assicurati che 'slug' o 'id' sia il campo corretto per il confronto
      return this.restaurants.find(restaurant => restaurant.slug === this.currentRestaurant);
    }
  },
}

</script>



<template>
  <div class="cont-main">
    <div class="container">


      <div class="row justify-content-between mt-5">
        <div v-if="getCurrentRestaurant">
          <h1 class="m-0 pb-4 text-center">Ristorante: {{ getCurrentRestaurant.name }}</h1>
        </div>

        <!-- Lista dei piatti -->
        <div class="col-12 col-md-8 mb-4">
          <div class="row justify-content-center">
            <template v-if="dishes.length > 0">
              <div class="col-12 col-sm-6 col-md-4 mb-3" v-for="dish in dishes" :key="dish.id" v-show="dish.visible">
                <div class="card dish-card">
                  <template v-if="!dish.image.startsWith('http')">
                    <img class="card-img-top dish-image" :src="base_url + '/storage/' + dish.image" alt="">
                  </template>
                  <template v-else>
                    <img class="card-img-top dish-image" :src="dish.image" alt="">
                  </template>
                  <div class="card-body">
                    <h5 class="card-title">{{ dish.name }}</h5>
                    <p class="card-text">{{ dish.price }}€</p>
                    <p class="card-description">{{ dish.description }}</p>

                    <button class="btn btn-primary rounded" @click="addToCart(dish)">Aggiungi al Carrello</button>
                  </div>
                </div>
              </div>
            </template>
            <div v-if="dishes.length === 0" class="text-center mt-5">
              <p class="fs-4">Nessun piatto disponibile per questo ristorante.</p>
            </div>
          </div>
        </div>

        <!-- Card del carrello -->
        <div class="col-12 col-md-4">
          <div class="card cart-card position-sticky top-0 mb-5">
            <div class="card-body">
              <h5 class="card-title fs-3 mb-3">Carrello</h5>

              <p class="card-text" v-if="cart.length === 0">Aggiungi piatti al carrello per visualizzare qui.</p>
              <div class="cart-items mb-0">
                <div class="cart-list ps-0" v-if="cart.length > 0">

                  <h3 class="card-title m-0 py-2">Stai ordinando presso: {{ cart[0].cartRecordName }}
                  </h3>

                  <div class="d-flex mb-2 cart-list-detail flex-column pb-2" v-for="dish in cart" :key="dish.id">
                    <div class="mb-1 d-flex align-items-center justify-content-between">
                      <span class="fs-4 cart-name-dish">{{ dish.name }}</span>
                      <span class="ps-2 fw-bold">{{ dish.price }}€</span>
                    </div>
                    <div class="d-flex align-items-center justify-content-between pb-2">
                      <div class="quantity-controls ms-0">
                        <button class="rounded border-0 text-white btn-quantity ms-0"
                          @click="decrementQuantity(dish)">-</button>
                        <span>{{ dish.quantity }}</span>
                        <button class="rounded border-0 text-white btn-quantity"
                          @click="incrementQuantity(dish)">+</button>
                      </div>
                      <button class="btn btn-danger btn-sm mt-0" @click="removeFromCart(dish)"><i
                          class="fa-solid fa-trash"></i></button>
                    </div>
                  </div>
                </div>
                <p v-if="cart.length === 0">Il carrello è vuoto</p>
              </div>
              <!-- Totale dei prodotti e del prezzo -->
              <div v-if="cart.length > 0" class="cart-totals border-top border-2 border-dark pt-2">
                <p class="mb-1">Totale prodotti: {{ totalProducts }}</p>
                <p>Totale da pagare: {{ totalPrice }}€</p>
              </div>
              <button class="btn btn-success" v-if="cart.length > 0" @click="proceedToOrder">Procedi all'ordine</button>
            </div>
          </div>
        </div>

        <!-- Modale di conferma -->
        <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title" id="confirmModalLabel">Puoi ordinare da un solo ristorante! </h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <p>Svuota il carrello per cambiare ristorante o completa l'ordine</p>
              </div>
              <div class="modal-footer d-flex flex-column align-items-center">
                <button type="button" class="btn btn-primary" @click="cancelRestaurantChange">Completa l'ordine</button>
                <button type="button" class="btn btn-secondary" @click="confirmRestaurantChange">Svuota il
                  carrello</button>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>



<style scoped>
/* Spazio extra tra l'header e il contenuto */

h1 {
  color: rgb(230, 126, 34)
}

.container {
  max-width: 1200px;
}

.card {
  border: none;
  border-radius: 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.dish-card {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 300px;
  margin: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
}


.dish-card:hover {
  transform: scale(1.02);
  box-shadow: 0 12px 24px rgba(255, 87, 34, 0.5);
}

.dish-image {
  height: 100px;
  object-fit: cover;
}

.card-body {
  padding: 0.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

}

.card-title {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.card-text {
  font-size: 1rem;
  font-weight: bold;
  color: #e74c3c;
  margin-bottom: 0.5rem;
}

.card-description {
  font-size: 0.85rem;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
}

.btn-primary {
  background-color: #e67e22;
  border-color: #e67e22;
  width: 100%;
  padding: 0.5rem;
  font-size: 0.9rem;
  border-radius: 5px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.btn-secondary {
  background-color: #8b8783;
  border-color: #8b8783;
  width: 100%;
  padding: 0.5rem;
  font-size: 0.9rem;
  border-radius: 5px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.btn-secondary:hover {
  background-color: #74716f;
  border-color: #74716f;
  width: 100%;
  padding: 0.5rem;
  font-size: 0.9rem;
  border-radius: 5px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}



.btn-primary:hover {
  background-color: #d35400;
  border-color: #d35400;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.cart-card {
  border: 2px solid #e67e22;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.cart-items {
  margin-bottom: 1rem;
}

.btn-success {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 5px;
}

.btn-danger {
  margin-left: 1rem;
  margin-top: 0.1rem;
  background-color: #e74c3c;
  border-color: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background-color: #c0392b;
  border-color: #c0392b;
}

.quantity-controls {
  display: inline-block;
  margin-left: 10px;
}

.quantity-controls button {
  width: 30px;
  height: 30px;
  font-size: 16px;
  margin: 0 5px;
}

.quantity-controls span {
  font-size: 16px;
  margin: 0 5px;
}

.btn-quantity {
  background-color: #e67e22;
}

.cart-list {
  list-style-type: none;
}

.cart-name-dish {
  min-width: 80px;
}

.cart-list .cart-list-detail {
  border-bottom: 1px solid #ddd;
  /* Bordo grigio tra i prodotti */
}

.cart-list .cart-list-detail:last-child {
  border-bottom: none;
  /* Rimuove il bordo nell'ultimo prodotto */
}
</style>