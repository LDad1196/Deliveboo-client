import { reactive } from 'vue';

export const EventBus = reactive({
  cartCount: 0,
  updateCartCount(count) {
    this.cartCount = count;
  }
});
