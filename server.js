// server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Middleware pour traiter les requêtes JSON
app.use(bodyParser.json());

// Endpoint pour les webhooks Stripe
app.post('/webhook', async (req, res) => {
    const event = req.body;

    console.log('Événement reçu:', event);

    switch (event.type) {
        case 'checkout.session.completed':
            console.log('Session de paiement complétée:', event.data.object);
            break;
        case 'customer.subscription.updated':
            console.log('Abonnement mis à jour:', event.data.object);
            break;
        default:
            console.log(`Événement non géré: ${event.type}`);
    }

    // Répondre à Stripe pour confirmer la réception de l'événement
    res.status(200).send('Événement reçu');
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});
