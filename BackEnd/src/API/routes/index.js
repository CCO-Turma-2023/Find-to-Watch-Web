const { Router } = require('express');
const userRoutes = require('./userRoutes');
const tmdbRoutes = require('./tmdbRoutes');
const listasRoutes = require('./listasRoutes');

const router = Router();

router.use('/users', userRoutes);
router.use('/tmdb', tmdbRoutes);
router.use('/listas', listasRoutes);

module.exports = router;