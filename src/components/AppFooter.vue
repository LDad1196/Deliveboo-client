<script>


export default {
  name: 'AppFooter',


}


</script>

<template>
  <footer class="footer bg-dark text-white pt-4  d-flex flex-column ">
    <div class="container-fluid">
      <div class="row text-center text-md-start">
        <div class="col-md-1"></div>

        <!-- Logo e descrizione -->
        <div class="col-md-2 mb-4">
          <img src="../assets/logo-deliveboo-no-scritta.png" alt="DeliveBoo Logo" class="img-fluid mb-2 logo"
            style="max-width: 150px;">
          <p class="small">
            Il tuo cibo preferito, consegnato a casa tua. Facile e veloce.
          </p>
        </div>

        <!-- Link navigazione -->
        <div class="quickLinks col-md-2 mb-4 text-center">
          <h5>Scopri DeliveBoo</h5>
          <ul class="list-unstyled">
            <li><a href="#">Chi siamo</a></li>
            <li><a href="#">Ristoranti</a></li>
            <li><a href="#">Investitori</a></li>
            <li><a href="#">Lavora con noi</a></li>
            <li><a href="#">Contatti</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        <div class="quickLinks col-md-2 mb-4 text-center">
          <h5>Note Legali</h5>
          <ul class="list-unstyled">
            <li><a href="#">Termini & Condizioni</a></li>
            <li><a href="#">Informativa sulla privacy</a></li>
            <li><a href="#">Cookies</a></li>
            <li><a href="#">Classificazione dei partner</a></li>
            <li><a href="#">Richieste da parte delle Autorità Pubbliche</a></li>
          </ul>
        </div>

        <!-- Social Media -->
        <div class="social col-md-2 mb-4 text-center">
          <h5>Follow Us</h5>
          <a href="#" class="me-3"><i class="fab fa-facebook fa-lg"></i></a>
          <a href="#" class="me-3"><i class="fab fa-twitter fa-lg"></i></a>
          <a href="#" class="me-3"><i class="fa-brands fa-instagram"></i></a>
        </div>

        <!-- App -->
        <div class="col-md-2 mb-4 text-center">
          <h4>Sei un Ristoratore?</h4>
          <div class="d-flex flex-column">
            <a class="fs-5 button-login rounded-pill " href="http://127.0.0.1:8000/login" target="_blank">Login</a>
            <a class="fs-5 button-register rounded-pill  " href="http://127.0.0.1:8000/register"
              target="_blank">Registrati</a>
          </div>
        </div>

        <div class="col-md-1"></div>
      </div>
    </div>

    <!-- Footer Bottom -->
    <div class="bg-secondary py-2 mt-4 justify-self-end">
      <div class="container-fluid text-center">
        <p class="mb-0 text-muted">&copy; 2024 DeliveBoo. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>


<style scoped>
/* Effetto hover sul logo */
.logo {
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: translateY(-5px);
}

/* Pulsanti con effetto ingrandimento */
.button-login {
  background-color: #ffffff;
  border-color: #ffffff;
  width: 100%;
  padding: 0.5rem;
  font-size: 0.9rem;
  border-radius: 5px;
  color: #e67e22;
  text-decoration: none;
  transition: transform 0.3s ease;
  margin-top: 1rem;
}

.button-login:hover {
  transform: scale(1.1);
}

.social a i {
  color: #ffffff;
}

.social a:hover i {
  color: #e67e22;
}

.quickLinks a {
  color: #ffffff;
  text-decoration: none;
}

.quickLinks a:hover {
  color: #e67e22;
  text-decoration: underline;
}

.navbar-link:hover {
  color: #e67e22;
}

.button-register {
  background-color: #e67e22;
  border-color: #e67e22;
  width: 100%;
  padding: 0.5rem;
  font-size: 0.9rem;
  border-radius: 5px;
  color: white;
  text-decoration: none;
  margin-top: 1rem;
  transition: transform 0.3s ease;
}

.button-register:hover {
  transform: scale(1.1);
}
</style>
