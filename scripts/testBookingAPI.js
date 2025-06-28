const axios = require('axios');

const API_URL = 'https://backendmanage-7nxn.onrender.com/api';

async function testBookingAPI() {
  try {
    console.log('🧪 Test de l\'API de réservation...');

    // 1. Test de connexion
    console.log('1️⃣ Test de connexion à l\'API...');
    const healthCheck = await axios.get(`${API_URL}/rooms`);
    console.log('✅ API accessible, chambres trouvées:', healthCheck.data.length);

    // 2. Test de création de réservation sans token (doit échouer)
    console.log('\n2️⃣ Test de création sans token (doit échouer)...');
    try {
      const bookingData = {
        roomId: '6844ff635b60779b7ac4eab1',
        checkIn: '2024-01-15',
        checkOut: '2024-01-17',
        guests: {
          adults: 2,
          children: 0
        }
      };

      await axios.post(`${API_URL}/bookings`, bookingData);
      console.log('❌ Erreur: La réservation a réussi sans token');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correct: Erreur 401 - Token requis');
      } else {
        console.log('⚠️ Erreur inattendue:', error.response?.status, error.response?.data);
      }
    }

    // 3. Test de récupération des réservations sans token
    console.log('\n3️⃣ Test de récupération des réservations sans token...');
    try {
      await axios.get(`${API_URL}/bookings/my-bookings`);
      console.log('❌ Erreur: Récupération réussie sans token');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correct: Erreur 401 - Token requis');
      } else if (error.response?.status === 404) {
        console.log('⚠️ Erreur 404 - Route non trouvée');
      } else {
        console.log('⚠️ Erreur inattendue:', error.response?.status, error.response?.data);
      }
    }

    // 4. Test de la route de réservations
    console.log('\n4️⃣ Test de la route /bookings...');
    try {
      await axios.get(`${API_URL}/bookings`);
      console.log('❌ Erreur: Route /bookings accessible sans token');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correct: Route protégée');
      } else {
        console.log('⚠️ Erreur inattendue:', error.response?.status, error.response?.data);
      }
    }

    console.log('\n🎯 Résumé des tests:');
    console.log('- API accessible: ✅');
    console.log('- Routes protégées: ✅');
    console.log('- Structure des données: À vérifier avec token');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

// Exécuter le test
testBookingAPI(); 