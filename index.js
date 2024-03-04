const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// Middleware CORS
app.use(cors());

const uri =
  'mongodb+srv://izaline18:jebme7Pegjaqwifsed@cluster0.8or7eqk.mongodb.net/';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
// connexion à la BDD
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
// pour lire les données
app.get('/test', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('userDB'); // Utilisez le nom de votre collection ici
    const users = await collection.find({}).toArray();
    // Construire le tableau HTML
    let htmlResponse = '<table border="1">';
    htmlResponse +=
      '<tr><th>ID</th><th>Name</th><th>Email</th><th>Password</th><th>Age</th><th>Modifier</th><th>Supprimer</th></tr>';
    users.forEach((user) => {
      htmlResponse += `<tr><td>${user._id}</td><td>${user.username}</td><td>${user.email}</td><td>${user.password}</td><td>${user.age}</td>`;
      htmlResponse += `<td><button onclick="modifier('${user._id}')">Modifier</button></td><td> <button onclick="supprimer('${user._id}')">Supprimer</button></td></tr>`;
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

// Start the server
app.listen(port, () => {
  console.log(`Serveur Express démarré sur http://localhost:${port}`);
});
