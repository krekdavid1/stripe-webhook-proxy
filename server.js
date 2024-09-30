// Importation des modules nécessaires
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios"); // Pour envoyer les requêtes à Bubble ou un autre backend
const app = express();

// Middleware pour traiter les données au format JSON
app.use(bodyParser.json());

// Endpoint pour recevoir les événements de Stripe via le webhook
app.post("/webhook", async (req, res) => {
  // Récupération de l'événement Stripe envoyé dans le corps de la requête
  const event = req.body;

  // Log de l'événement pour débogage
  console.log("Événement reçu:", event);

  try {
    // Exemple 1 : Gérer l'événement Stripe 'checkout.session.completed'
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("Session Checkout complète:", session);

      // Envoyer les données de la session à Bubble ou un autre backend
      await axios.post(
        "https://pitchmybook.bubbleapps.io/version-test/api/1.1/wf/checkout-session/initialize",
        {
          session_id: session.id,
          customer_email: session.customer_email,
          amount_total: session.amount_total,
          // Ajoute d'autres champs selon tes besoins
        }
      );
      console.log("Session Checkout envoyée à Bubble");
    }

    // Exemple 2: Gérer l'événement Stripe 'customer.subscription.updated'
    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;
      console.log("Mise à jour d'abonnement:", subscription);

      // Envoyer les données de l'abonnement à Bubble ou un autre backend
      await axios.post(
        "https://pitchmybook.bubbleapps.io/version-test/api/1.1/wf/subscription-updated/initialize",
        {
          subscription_id: subscription.id,
          status: subscription.status,
          current_period_end: subscription.current_period_end,
          customer_id: subscription.customer,
          // Ajoute d'autres champs selon tes besoins
        }
      );
      console.log("Mise à jour d'abonnement envoyée à Bubble");
    }

    // Répondre à Stripe pour confirmer la réception de l'événement
    res.status(200).json({ received: true });
  } catch (error) {
    // Log d'erreur si l'envoi à Bubble échoue
    console.error("Erreur lors du traitement de l'événement:", error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors du traitement de l'événement" });
  }
});

// Démarrage du serveur sur le port fourni par Heroku ou sur le port 3000 en local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
