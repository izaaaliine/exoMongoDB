const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3002;

// Connexion à la base de données MongoDB
mongoose
  .connect(
    'mongodb+srv://izaline18:jebme7Pegjaqwifsed@cluster0.8or7eqk.mongodb.net/MyDataBase'
  )
  .then(() => {
    console.log('Connexion à la base de données réussie');
  })
  .catch((err) => {
    console.error('Erreur de connexion à la base de données:', err);
  });

// Création du schéma de données
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  age: Number,
});

// Création du modèle basé sur le schéma
const User = mongoose.model('User', userSchema, 'userDB'); // Spécifiez le nom de la collection 'userDB'

// Middleware pour analyser les données du formulaire
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Afficher le formulaire pour ajouter un utilisateur
app.get('/ajout', (req, res) => {
  res.send(`
    <form action="/ajout" method="POST">
      <input type="text" name="username" placeholder="Nom d'utilisateur"><br>
      <input type="email" name="email" placeholder="Adresse email"><br>
      <input type="password" name="password" placeholder="Mot de passe"><br>
      <input type="number" name="age" placeholder="Âge"><br>
      <button type="submit">Ajouter utilisateur</button>
    </form>
  `);
});

// Route pour enregistrer les données du formulaire dans la base de données
app.post('/ajout', async (req, res) => {
  try {
    // Créer une nouvelle instance de l'utilisateur en utilisant les données du formulaire
    const user = new User(req.body);
    // Sauvegarder l'utilisateur dans la base de données
    const savedUser = await user.save();
    // Retourner l'utilisateur créé avec son ID
    res.send(`Utilisateur ajouté : ${savedUser}`);
  } catch (error) {
    // Gérer les erreurs
    console.error("Erreur lors de la création de l'utilisateur:", error);
    res.status(500).send("Erreur lors de la création de l'utilisateur");
  }
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
