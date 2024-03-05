const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectID } = require('mongodb');

const app = express();
const port = 3000;

// Middleware CORS
app.use(cors());
app.use(express.json());

const uri =
  'mongodb+srv://izaline18:jebme7Pegjaqwifsed@cluster0.8or7eqk.mongodb.net/';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connexion à la base de données
async function connectToDatabase() {
  try {
    const client = new MongoClient(uri, options);
    await client.connect();
    console.log('Connecté à la base de données MongoDB');
    return client.db('MyDataBase'); // Use your database name here
  } catch (error) {
    console.error('Erreur lors de la connexion à la base de données :', error);
    throw error;
  }
}

// Route PUT pour modifier un utilisateur
app.put('/users/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('userDB');
    const userId = req.params.id;
    const { username, email, password, age } = req.body;

    await collection.updateOne(
      { _id: ObjectID(userId) },
      { $set: { username, email, password, age } }
    );

    res.send('Utilisateur mis à jour avec succès');
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    res.status(500).send("Erreur lors de la mise à jour de l'utilisateur");
  }
});

// Route GET pour récupérer les utilisateurs
app.get('/test', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('userDB');
    const users = await collection.find({}).toArray();

    // Construction du tableau HTML
    let htmlResponse = '<table border="1">';
    htmlResponse +=
      '<tr><th>ID</th><th>Nom</th><th>Email</th><th>Mot de passe</th><th>Âge</th><th>Modifier</th><th>Supprimer</th></tr>';
    users.forEach((user) => {
      htmlResponse += `<tr><td>${user._id}</td><td>${user.username}</td><td>${user.email}</td><td>${user.password}</td><td>${user.age}</td>`;
      htmlResponse += `<td><button onclick="modifierUtilisateur('${user._id}')">Modifier</button></td><td> <button onclick="supprimer('${user._id}')">Supprimer</button></td></tr>`;
    });
    htmlResponse += '</table>';

    // Envoyer la réponse au format HTML
    res.send(htmlResponse);
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des utilisateurs depuis MongoDB :',
      error
    );
    res
      .status(500)
      .send('Erreur lors de la récupération des utilisateurs depuis MongoDB');
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur Express démarré sur http://localhost:${port}`);
});
