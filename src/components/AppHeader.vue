<script>
import { EventBus } from '../eventBus';

export default {
  name: 'AppHeader',
  data() {
    return {
      cartCount: 0, // Conteggio locale
    };
  },
  mounted() {
    // Inizializza il conteggio del carrello
    this.cartCount = EventBus.cartCount;

    // Osserva le modifiche all'EventBus
    this.$watch(
      () => EventBus.cartCount,
      (newVal) => {
        this.cartCount = newVal;
      }
    );
  },
};
</script>

<template>
  <header class="container-fluid d-flex shadow py-2 mx-0 bg-orange">
    <div class="row w-100 justify-content-between align-items-center">
      <!-- Logo e Home -->
      <div class="col-6 d-flex align-items-center">
        <!-- Logo -->
        <router-link class="navbar-link logo" to="/">
          <img src="/public/logo-deliveboo-no-scritta.png" alt="logo" class="img-fluid logo-img">
        </router-link>

        <!-- Link Home -->
        <router-link class="navbar-link fs-4 text-white text-decoration-none ms-3" to="/">Home</router-link>
      </div>

      <!-- Carrello posizionato a destra -->
      <div class="col-6 d-flex justify-content-end align-items-center">
        <router-link to="/cart"
          class="cart-link text-white text-decoration-none position-relative d-flex align-items-center">
          <i class="fa-solid fa-cart-shopping fa-xl"></i> <!-- Icona carrello -->
          <!-- Mostra il pallino solo se ci sono prodotti nel carrello -->
          <span v-if="cartCount > 0" class="badge bg-danger shadow rounded-pill position-absolute top-0 end-0">
            {{ cartCount }}
          </span>
        </router-link>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  height: 5rem;
  background-color: #E67E22;
}

.logo img {
  max-height: 60px;
}

.cart-link {
  position: relative;
}

.badge {
  font-size: 0.75rem;
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -100%);
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 5px 8px;
}

@media (max-width: 768px) {
  .logo img {
    max-height: 50px;
  }

  .cart-link span {
    display: none;
  }

  .cart-link i {
    font-size: 1.5rem;
  }
}

@media (max-width: 576px) {
  .logo img {
    max-height: 40px;
  }

  .fs-4 {
    font-size: 1.1rem;
  }

  .cart-link i {
    font-size: 1.25rem;
  }
}
</style>