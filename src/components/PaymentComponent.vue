<script>
import dropin from "braintree-web-drop-in";
import axios from "axios";
import { EventBus } from "../eventBus";

export default {
  props: ['amount'], // Passa l'importo come prop
  data() {
    return {
      clientToken: null,
      instance: null,
      loading: false,
      isLoading: false,
      name_client: "",
      email_client: "",
      number_phone: "",
      address_client: "",
      cart: null,
    };
  },
  mounted() {
    // Ottieni il client token da Laravel
    axios.get("http://127.0.0.1:8000/api/braintree/token")
      .then(response => {
        this.clientToken = response.data.token;
        // Inizializza il Braintree Drop-in UI
        this.initializeBraintree();
      })
      .catch(error => {
        console.error("Errore nel recuperare il token:", error);
      });

    this.getCart()

  },
  methods: {
    initializeBraintree() {
      dropin.create({
        authorization: this.clientToken,
        container: '#dropin-container',
        locale: 'it_IT',
      }, (error, instance) => {
        if (error) {
          console.error(error);
        } else {
          this.instance = instance;
        }
      });
    },

    pay() {
      if (!this.instance) return;
      this.isLoading = true; // Imposta il caricamento su true
      this.loading = true;

      this.instance.requestPaymentMethod((error, payload) => {
        if (error) {
          console.error(error);
          this.loading = false;
          this.isLoading = false; // Disabilita il caricamento in caso di errore
          return;
        }

        // Invia il nonce al server Laravel insieme all'importo
        axios.post("http://127.0.0.1:8000/api/braintree/checkout", {
          payment_method_nonce: payload.nonce,
          amount: this.amount, // Usa l'importo passato come prop
        })
          .then(response => {
            if (response.data.success) {
              this.submitOrder();
              this.$emit('paymentSuccess');

              setTimeout(() => {
                this.isLoading = false; // Riabilita il pulsante dopo 10 secondi
              }, 10000); // 10 secondi di delay

            } else {
              alert("Errore nel pagamento: " + response.data.message);
              this.isLoading = false; // Riabilita il pulsante in caso di errore
            }
            this.loading = false;

          })
          .catch(error => {
            console.error("Errore nel pagamento:", error);
            this.loading = false;
            this.isLoading = false; // Riabilita il pulsante in caso di errore
          });
      });

      EventBus.updateCartCount(0)
    },

    clearCart() {
      localStorage.removeItem('cart');
      this.cart = [];
    },

    //FUNZIONE CHE RECUPERA ID DEL RISTORANTE TRAMITE LOCAL STORAGE
    getRestaurantId() {
      let cart = localStorage.getItem('cart');
      if (cart) {
        cart = JSON.parse(cart)
        return cart[0].restaurant_id
      }
    },

    //FUNZIONE CHE RECUPERA TUTTO L'OGGETTO DEL CARRELLO
    getCart() {
      this.cart = localStorage.getItem('cart');
      if (this.cart) {
        this.cart = JSON.parse(this.cart)
      }
    },

    //FUNZIONA ASINCRONA
    async submitOrder() {
      this.isLoading = true; // Inizia il caricamento

      try {
        const orderObject = {
          restaurant_id: this.getRestaurantId(),
          name_client: this.name_client,
          email_client: this.email_client,
          number_phone: this.number_phone,
          address_client: this.address_client,
          total: this.amount,
          dishes: this.cart.map(dish => ({
            dish_id: dish.id,
            name_dish: dish.name,
            price_dish: dish.price,
            quantity: dish.quantity,
          })),
        };

        const response = await axios.post('http://127.0.0.1:8000/api/orders', orderObject);
        if (response.status === 200) {
          console.log("ordine effettuato", response.data);

          // Salva i dati nel localStorage prima del reindirizzamento
          localStorage.setItem('email', this.email_client);
          localStorage.setItem('total', this.amount);
          localStorage.setItem('dishes', JSON.stringify(this.cart.map(dish => ({
            name_dish: dish.name,
            price_dish: dish.price,
            quantity: dish.quantity
          }))));

          // Reindirizza alla pagina "thank-you" senza passare dati tramite query
          this.$router.push({ name: 'thank-you' });

          localStorage.removeItem('cart'); // Svuota il carrello dopo l'ordine
        } else {
          console.log("non funziona", response.data);
        }
      } catch (error) {
        console.log("errore", error);
      }

      this.isLoading = false; // Fine del caricamento
    }

  },
};
</script>

<template>
  <form @submit.prevent="pay()" class="row my-3">
    <div class="col-12 col-sm-6 my-2 d-flex flex-column">
      <label class="fs-4" for="name_client">Nome</label>
      <input class="rounded input-form-cart" type="text" id="name_client" v-model="name_client" required minlength="3"
        pattern="[A-Za-z\s]{3,}">
    </div>
    <div class="col-12 col-sm-6 my-2 d-flex flex-column">
      <label class="fs-4" for="email_client">Email</label>
      <input class="rounded input-form-cart" type="email" id="email_client" v-model="email_client" required
        pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$" title="Per favore, inserisci un'email valida">
    </div>
    <div class="col-12 col-sm-6 my-2 d-flex flex-column">
      <label class="fs-4" for="number_phone">Telefono</label>
      <input class="rounded input-form-cart" type="text" id="number_phone" v-model="number_phone" required minlength="9"
        maxlength="10" pattern="\d{9,10}">
    </div>
    <div class="col-12 col-sm-6 my-2 d-flex flex-column">
      <label class="fs-4" for="address_client">Indirizzo</label>
      <input class="rounded input-form-cart" type="text" id="address_client" v-model="address_client" required
        minlength="5" maxlength="255" pattern=".{5,255}">
    </div>
    <p class="py-2 mb-0">Tutti i campi sono obbligatori</p>
    <div id="dropin-container"></div>
    <!-- Mostra il pulsante di pagamento o il caricamento -->
    <button v-if="!isLoading" class="btn btn-pay px-3" :disabled="isLoading || loading">Paga ora</button>


    <!-- Spinner di caricamento -->
    <div v-else class="d-flex justify-content-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Caricamento...</span>
      </div>
    </div>
  </form>
</template>

<style scoped>
button {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  border: 1px solid grey;
}

/* .btn-pay:hover {
background-color: #28a745;
color: white;
} */

.input-form-cart {
  border: 2px solid rgb(230, 230, 230);
  height: 35px;
}


.braintree-sheet__content--form {
  padding: 10px 15px 10px 10px;
  display: flex !important;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
