const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const Room = require('../models/Room');

// Routes publiques
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/rooms/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Chambre non trouvée' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Routes protégées (admin uniquement)
router.post('/rooms', auth, isAdmin, async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/rooms/:id', auth, isAdmin, async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!room) {
      return res.status(404).json({ message: 'Chambre non trouvée' });
    }
    res.json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/rooms/:id', auth, isAdmin, async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Chambre non trouvée' });
    }
    res.json({ message: 'Chambre supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour obtenir toutes les chambres (admin uniquement)
router.get('/admin/rooms', auth, isAdmin, async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;