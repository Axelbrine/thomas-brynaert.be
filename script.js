(function () {
  [...document.querySelectorAll(".control")].forEach((button) => {
    button.addEventListener("click", function () {
      document.querySelector(".active-btn").classList.remove("active-btn");
      this.classList.add("active-btn");
      document.querySelector(".active").classList.remove("active");
      document.getElementById(button.dataset.id).classList.add("active");
    });
  });
  document.querySelector(".theme-btn").addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
  });
})();

// Validation du formulaire de contact
const form = document.querySelector('.contact-form');
if (form) {

  
  form.addEventListener('submit', function (e) {
      // Test contre les bots
    const honeypot = form.querySelector('input[name="honeypot"]');
    if (honeypot && honeypot.value !== '') {
      e.preventDefault();
      return; // C'est un bot, on bloque silencieusement
    }
    
    let isValid = true;

    // Nettoyer les erreurs précédentes
    form.querySelectorAll('.error-msg').forEach(el => el.remove());
    form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

    const fields = [
      { el: form.querySelector('input[name="nom"]'),     message: 'Veuillez entrer votre nom.', isName: true },
      { el: form.querySelector('input[name="email"]'),   message: 'Veuillez entrer une adresse email valide.', isEmail: true },
      { el: form.querySelector('input[name="objet"]'),   message: "Veuillez entrer l'objet du message." },
      { el: form.querySelector('textarea[name="message"]'), message: 'Veuillez écrire votre message.' },
    ];

    fields.forEach(({ el, message, isEmail, isName }) => {
      const empty = !el.value.trim();
      const badEmail = isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value);
      const badName = isName && !/^[a-zA-ZÀ-ÖØ-öø-ÿ\s\-']+$/.test(el.value);

      if (empty || badEmail || badName) {
        isValid = false;
        el.classList.add('input-error');

        const err = document.createElement('span');
        err.classList.add('error-msg');
        err.textContent = message;
        el.insertAdjacentElement('afterend', err);
      }
    });

    if (!isValid) e.preventDefault();
  });

  // Retirer l'erreur dès que l'utilisateur commence à corriger
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', function () {
      this.classList.remove('input-error');
      const err = this.nextElementSibling;
      if (err && err.classList.contains('error-msg')) err.remove();
    });
  });
}

// Rate limiting visuel (anti-spam humain)

const submitBtn = form.querySelector('button[type="submit"]');
form.addEventListener('submit', function () {
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').textContent = 'Envoyé !';
  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').textContent = 'Envoyer';
  }, 5000);
});

// ---- Animation du portfolio avec GSAP ----

const portfolioBtn = document.querySelector('.control[data-id="portfolio"]');

if (portfolioBtn) {

  // On "écoute" le clic sur ce bouton
  // Quand l'utilisateur clique, la fonction fléchée () => { ... } s'exécute
  portfolioBtn.addEventListener('click', () => {

    // gsap.utils.toArray() transforme tous les éléments .portfolio-item en un vrai tableau JavaScript qu'on peut manipuler facilement
    const items = gsap.utils.toArray('.portfolio-item');

    // On place IMMÉDIATEMENT tous les items dans leur état de départ :
    // - y: 60  → décalés de 60px vers le bas
    // - opacity: 0 → complètement invisibles
    // gsap.set() = pas d'animation, c'est instantané
    gsap.set(items, { y: 80, opacity: 0 });

    // Maintenant on anime les items vers leur état final
    gsap.to(items, {
      y: 0,         // ils remontent à leur position normale
      opacity: 1,   // ils deviennent visibles
      duration: 0.5, // chaque item met 0.5 seconde à apparaître
      ease: 'power2.out', // l'animation démarre vite puis ralentit doucement à la fin
      stagger: 0.2, // chaque item attend 0.3s avant de commencer, l'un après l'autre
      delay: 1.1,   // on attend 1.1s avant de lancer le tout
                    // car une animation CSS "appear" dure ~1s, on la laisse finir d'abord

      overwrite: 'auto', // si GSAP ou le CSS animait déjà ces éléments,
                         // cette option évite les conflits en prenant le contrôle proprement
    });

  }); // fin du addEventListener

} // fin du if