<script>
import PaymentComponent from '../components/PaymentComponent.vue';
import { EventBus } from '../eventBus'; // Importa l'EventBus

export default {
    data() {
        return {
            cart: JSON.parse(localStorage.getItem('cart')) || [],
            restaurantName: localStorage.getItem('restaurant_name') || 'Ristorante non disponibile', // Recupera il nome del ristorante
            restaurantSlug: localStorage.getItem('restaurant_slug') || '', // Slug ristorante
            showPayment: false,
        };
    },
    mounted() {
        this.updateCartCount(); // Assicurati che il conteggio del carrello sia aggiornato inizialmente
    },
    components: {
        PaymentComponent, // Registra il componente di pagamento
    },
    computed: {
        totalProducts() {
            return this.cart.reduce((total, dish) => total + dish.quantity, 0);
        },
        totalPrice() {
            return this.cart.reduce((total, dish) => total + (dish.price * dish.quantity), 0).toFixed(2);
        },
    },
    methods: {
        updateCartCount() {
            const totalProducts = this.cart.reduce((total, dish) => total + dish.quantity, 0);
            EventBus.updateCartCount(totalProducts); // Aggiorna il conteggio del carrello nell'EventBus
        },

        increaseQuantity(dish) {
            dish.quantity++;
            this.updateCart();
        },
        decreaseQuantity(dish) {
            if (dish.quantity > 1) {
                dish.quantity--;
                this.updateCart();
            }
        },
        removeDish(dish) {
            this.cart = this.cart.filter(item => item.id !== dish.id);
            this.updateCart();
        },
        updateCart() {
            localStorage.setItem('cart', JSON.stringify(this.cart));
            this.updateCartCount();
        },

        processPayment() {
            // Qui puoi aggiungere la logica per il pagamento.
            // Ad esempio, inviare i dati dell'ordine a un server o mostrare una finestra di pagamento.
            alert('Pagamento effettuato con successo!'); // Placeholder per il pagamento
            this.clearCart(); // Pulisce il carrello dopo il pagamento
            this.$router.push('/'); // Reindirizza alla home o ad un'altra pagina dopo il pagamento
        },
        clearCart() {
            localStorage.removeItem('cart');
            localStorage.removeItem('restaurant_name'); // Rimuovi anche il nome del ristorante
            localStorage.removeItem('restaurant_slug'); // Rimuovi lo slug del ristorante
            this.cart = [];
            this.cart = [];
            this.updateCartCount();
        },
        goToRestaurantMenu() {
            if (this.restaurantSlug) {
                this.$router.push(`/restaurants/${this.restaurantSlug}/menu`);
            }
        },
    },
};

</script>

<template>
    <div class="app-cart bg-light py-4">
        <div class="container">
            <div class="row align-items-center pb-3">
                <div class="col-lg-2">
                    <button v-if="cart.length > 0" @click="goToRestaurantMenu" class="btn btn-dark">Torna al
                        Menù</button>
                </div>
                <div class="col-lg-8">
                    <h2 class="text-center">Riepilogo Ordine</h2>
                    <h3 class="card-title m-0 py-2 text-center">Stai ordinando presso: {{ cart[0].cartRecordName }}
                    </h3>
                </div>
                <div class="col-lg-2"></div>
            </div>

            <div class="cart-content bg-white rounded shadow">
                <div v-if="cart.length === 0" class="text-center">
                    <p>Il carrello è vuoto.</p>
                </div>
                <div v-else>
                    <div class="cart-items mb-4">

                        <div class="cart-item row align-items-center py-3" v-for="dish in cart" :key="dish.id">
                            <div class="col-lg-2 col-md-2 col-sm-3 d-flex justify-content-between align-items-center">
                                <img :src="dish.image" alt="Immagine piatto" class="dish-image me-3 w-100 h-100">
                            </div>
                            <div class="col-lg-10 col-md-10 col-sm-9">
                                <div class="d-flex justify-content-between align-items-center pt-2">
                                    <span class="fs-4">{{ dish.name }}</span>
                                    <span class="fs-4"> {{ dish.price }}€</span>
                                </div>
                                <div class="d-flex justify-content-between align-items-center mt-2">
                                    <span>
                                        <button @click="decreaseQuantity(dish)"
                                            class="btn btn-sm btn-quantity me-2">-</button>
                                        {{ dish.quantity }}
                                        <button @click="increaseQuantity(dish)"
                                            class="btn btn-sm btn-quantity ms-2">+</button>
                                    </span>
                                    <button @click="removeDish(dish)"
                                        class="btn btn-sm btn-danger ms-3">Rimuovi</button>
                                </div>
                            </div>
                        </div>

                        <div class="cart-totals border-top border-2 border-dark pt-3 mt-4 text-center">
                            <p class="mb-1 fs-5">Totale prodotti: {{ totalProducts }}</p>
                            <p class="fs-4">Totale da pagare: {{ totalPrice }}€</p>
                        </div>
                        <div class="text-center mt-4">
                            <button v-if="cart.length > 0" class="btn btn-success" @click="showPayment = true">Procedi
                                all'ordine</button>
                            <payment-component v-if="showPayment" :amount="totalPrice" />
                            <!-- Componente per il pagamento -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.container {
    min-width: 280px;
    max-width: 1000px;
    margin: auto;
}

h2 {
    font-size: 2rem;
    color: #333;
}

.cart-content {
    background: #e4e2e2;
    padding: 20px;

}

.cart-items {
    margin-bottom: 1rem;
}

.cart-item {
    padding: 10px 0;
    border-bottom: 1px solid rgb(223, 223, 223);
}

.cart-item:last-child(1) {
    border: none;
}

.cart-item hr {
    border: 0;
    border-top: 1px solid #ddd;
    margin: 10px 0;
}

.cart-totals {
    margin-top: 1rem;
}

.btn-success {
    background-color: #28a745;
    border-color: #28a745;
    color: white;
    padding: 10px 20px;
    font-size: 1.1rem;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.btn-success:hover {
    background-color: #218838;
    border-color: #1e7e34;
}

.btn-quantity {
    padding: 0.3rem 0.6rem;
    background-color: #e67e22;
    color: white;
}

.btn-danger {
    padding: 0.3rem 0.6rem;
}

.dish-image {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 5px;
}
</style>