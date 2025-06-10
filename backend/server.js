// Importación de módulos necesarios
const express = require('express');           // Framework web para Node.js
const cors = require('cors');                 // Middleware para habilitar CORS
const { Pool } = require('pg');               // Cliente de PostgreSQL
const bcrypt = require('bcryptjs');           // Para encriptar contraseñas
const jwt = require('jsonwebtoken');          // Para generar y verificar JWT
require('dotenv').config();                   // Para variables de entorno

// Inicialización de la app y configuración del puerto
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales
app.use(cors());                              // Permite peticiones desde otros orígenes
app.use(express.json());                      // Permite recibir JSON en las peticiones

// Configuración de la conexión a la base de datos PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'LibreriaAssignment',
  password: 'demnlloco',
  port: 5432,
});

// ====================
// CRUD de Usuarios
// ====================

// Obtener todos los usuarios
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, name, estado FROM users ORDER BY id');
    res.json(result.rows);                    // Devuelve arreglo de usuarios
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Crear un nuevo usuario
app.post('/api/users', async (req, res) => {
  try {
    const { email, name, password, estado } = req.body;
    if (!email || !password) {                // Validación de campos requeridos
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }
    if (password.length < 6) {                // Validación de longitud de contraseña
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {       // Validación de email único
      return res.status(400).json({ message: 'El email ya existe' });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Encriptar contraseña
    const result = await pool.query(
      'INSERT INTO users (email, name, password, estado) VALUES ($1, $2, $3, $4) RETURNING id, email, name, estado',
      [email, name || null, hashedPassword, estado !== undefined ? estado : true]
    );
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Actualizar usuario existente
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, password, estado } = req.body;
    const userExists = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const emailExists = await pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, id]);
    if (emailExists.rows.length > 0) {
      return res.status(400).json({ message: 'El email ya está siendo usado por otro usuario' });
    }
    let updateQuery;
    let updateParams;
    if (password && password.trim() !== '') { // Si se actualiza la contraseña
      if (password.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateQuery = 'UPDATE users SET email = $1, name = $2, password = $3, estado = $4 WHERE id = $5 RETURNING id, email, name, estado';
      updateParams = [email, name || null, hashedPassword, estado, id];
    } else {                                  // Si no se actualiza la contraseña
      updateQuery = 'UPDATE users SET email = $1, name = $2, estado = $3 WHERE id = $4 RETURNING id, email, name, estado';
      updateParams = [email, name || null, estado, id];
    }
    const result = await pool.query(updateQuery, updateParams);
    res.json({
      message: 'Usuario actualizado exitosamente',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Eliminar usuario
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userExists = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const booksAssigned = await pool.query('SELECT COUNT(*) FROM books WHERE users_id = $1', [id]);
    if (parseInt(booksAssigned.rows[0].count) > 0) {
      return res.status(400).json({ 
        message: 'No se puede eliminar el usuario porque tiene libros asignados. Primero desasigne los libros.' 
      });
    }
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ====================
// CRUD de Libros
// ====================

// Crear un nuevo libro
app.post('/api/books', async (req, res) => {
  try {
    const { title, author, isbn, release_date, user_id } = req.body;
    if (isbn) {
      const existingBook = await pool.query('SELECT id FROM books WHERE isbn = $1', [isbn]);
      if (existingBook.rows.length > 0) {
        return res.status(400).json({ message: 'El ISBN ya existe' });
      }
    }
    if (user_id) {
      const userExists = await pool.query('SELECT id FROM users WHERE id = $1 AND estado = true', [user_id]);
      if (userExists.rows.length === 0) {
        return res.status(400).json({ message: 'Usuario no encontrado o inactivo' });
      }
    }
    const result = await pool.query(
      'INSERT INTO books (title, author, isbn, release_date, users_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, author || null, isbn || null, release_date || null, user_id || null]
    );
    res.status(201).json({
      message: 'Libro creado exitosamente',
      book: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear libro:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Actualizar libro existente
app.put('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, isbn, release_date, user_id } = req.body;
    const bookExists = await pool.query('SELECT id FROM books WHERE id = $1', [id]);
    if (bookExists.rows.length === 0) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    if (isbn) {
      const isbnExists = await pool.query('SELECT id FROM books WHERE isbn = $1 AND id != $2', [isbn, id]);
      if (isbnExists.rows.length > 0) {
        return res.status(400).json({ message: 'El ISBN ya está siendo usado por otro libro' });
      }
    }
    if (user_id) {
      const userExists = await pool.query('SELECT id FROM users WHERE id = $1 AND estado = true', [user_id]);
      if (userExists.rows.length === 0) {
        return res.status(400).json({ message: 'Usuario no encontrado o inactivo' });
      }
    }
    const result = await pool.query(
      'UPDATE books SET title = $1, author = $2, isbn = $3, release_date = $4, users_id = $5 WHERE id = $6 RETURNING *',
      [title, author || null, isbn || null, release_date || null, user_id || null, id]
    );
    res.json({
      message: 'Libro actualizado exitosamente',
      book: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar libro:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Eliminar libro
app.delete('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bookExists = await pool.query('SELECT id FROM books WHERE id = $1', [id]);
    if (bookExists.rows.length === 0) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    await pool.query('DELETE FROM books WHERE id = $1', [id]);
    res.json({ message: 'Libro eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar libro:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ====================
// Login de Administrador
// ====================

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
    }
    const result = await pool.query('SELECT * FROM admin WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }
    const admin = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET || 'turbopassrword',
      { expiresIn: '24h' }
    );
    res.json({
      message: 'Login exitoso',
      token,
      admin: { id: admin.id, username: admin.username }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ====================
// Registro de Usuario
// ====================

app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya existe' });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await pool.query(
      'INSERT INTO users (email, name, password, estado) VALUES ($1, $2, $3, $4)',
      [email, name, hashedPassword, true]
    );
    res.json(true);
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ====================
// Obtener todos los libros y su usuario
// ====================

app.get('/books', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.id, b.title, b.author, b.isbn, b.release_date, b.users_id as user_id,
             u.name as user_name, u.email as user_email
      FROM books b
      LEFT JOIN users u ON b.users_id = u.id
      ORDER BY b.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener libros:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ====================
// Iniciar el servidor
// ====================

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});