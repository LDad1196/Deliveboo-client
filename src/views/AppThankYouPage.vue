<script>
export default {
  name: 'AppThankYouPage',
  data() {
    return {
      userEmail: localStorage.getItem('email') || 'email non disponibile',
      restaurantName: localStorage.getItem('restaurant_name') || 'Nome non disponibile',
      total: localStorage.getItem('total') || 'prezzo non disponibile',
      dishes: JSON.parse(localStorage.getItem('dishes') || '[]'),
    };
  },
  mounted() {
    // Cancella i dati dal localStorage dopo averli usati
    localStorage.removeItem('email');
    localStorage.removeItem('total');
    localStorage.removeItem('dishes');
  },
};
</script>

<template>

  <div class="thank-you-page py-3 container">

    <div class="row justify-content-center text-center">
      <div class="col-lg-6 bg-white shadow py-5 px-3 rounded">
        <h1 class="display-5 text-warning">Grazie per il tuo ordine!</h1>
        <p class="lead">Il tuo ordine è stato ricevuto e sarà elaborato a breve.</p>

        <!-- Sezione email -->
        <div class="email-info mt-3">
          <i class="fas fa-envelope fa-3x mb-2 text-warning"></i>
          <p class="lead">Ti verrà inviata una mail a questo indirizzo:</p>
          <h4 class="email-address text-warning">{{ userEmail }}</h4>
          <p>Con tutte le informazioni su come ricevere il tuo ordine.</p>
        </div>

        <!-- Numero Ordine
        <p class="order-number mt-4">Numero Ordine: <strong>12345</strong></p> -->

        <!-- Dettagli ordine -->
        <div class="order-details mt-4">
          <h5>Grazie per aver ordinato da:
          </h5>
          <h2 class="text-warning">{{ restaurantName }}</h2>

          <h5 class="mb-3 pt-3">Dettagli del tuo ordine</h5>
          <ul class="list-group px-5">
            <li v-for="(dish, index) in dishes" :key="index" class="list-group-item d-flex justify-content-between">
              <span>{{ dish.name_dish }} x{{ dish.quantity }}</span>
              <span>€ {{ dish.price_dish }}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <span class="fw-bold">Totale pagato</span>
              <span class="fw-bold">€ {{ total }}</span>
            </li>
          </ul>
        </div>

        <!-- Tempi di consegna -->
        <!-- <p class="delivery-time mt-4">Il tuo ordine verrà consegnato entro <strong>30-45 minuti</strong>.</p> -->

        <!-- Social Media -->
        <div class="social-media mt-4">
          <p>Seguici sui social per non perdere promozioni e novità!</p>
          <div class="social-icons d-flex justify-content-center">
            <a href="https://facebook.com" class="me-3 text-dark">
              <i class="fab fa-facebook fa-2x"></i>
            </a>
            <a href="https://instagram.com" class="me-3 text-dark">
              <i class="fab fa-instagram fa-2x"></i>
            </a>
            <a href="https://twitter.com" class="text-dark">
              <i class="fab fa-twitter fa-2x"></i>
            </a>
          </div>
        </div>

        <!-- Pulsante per tornare alla home -->
        <router-link to="/" class="btn back-home mt-4">Torna alla Home</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-warning {
  color: #E67E22 !important;
}

.order-number,
.email-address,
.delivery-time {
  color: #333;
}

.list-group-item {
  display: flex;
  justify-content: space-between;
}

.social-icons a:hover {
  color: #E67E22 !important;
}

.back-home {
  background-color: #E67E22;
  color: white;
}
</style>
