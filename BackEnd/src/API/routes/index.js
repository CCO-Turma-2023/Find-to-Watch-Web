const { Router } = require('express');
const userRoutes = require('./userRoutes');
const tmdbRoutes = require('./tmdbRoutes');

const router = Router();

router.use('/users', userRoutes);
router.use('/tmdb', tmdbRoutes);

module.exports = router;