const bcrypt = require('bcryptjs');

const password = 'contra3'; // Cambia esto por la contraseña real

bcrypt.hash(password, 10).then(hash => {
  console.log('Hash generado:', hash);
});