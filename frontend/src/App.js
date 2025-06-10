import React, { useState, useEffect, useRef } from 'react';
import Login from './components/login';
import Users from './components/users';
import Books from './components/books';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import loaderGif from './assets/loader.gif';
import { jwtDecode } from "jwt-decode";

// Función para verificar si el token JWT ha expirado
function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function App() {
  // Estados principales de la app
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const logoutTimeout = useRef(null);

  // Al cargar la app, verifica si hay un token válido en localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedAdmin = localStorage.getItem('admin');
    if (token && savedAdmin && !isTokenExpired(token)) {
      setIsLoggedIn(true);
      setAdmin(JSON.parse(savedAdmin));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      setIsLoggedIn(false);
      setAdmin(null);
    }
  }, []);

  // Cierra sesión automáticamente cuando el token expira
  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        if (decoded.exp) {
          const expiresInMs = decoded.exp * 1000 - Date.now();
          if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
          logoutTimeout.current = setTimeout(() => {
            handleLogout();
            alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
          }, expiresInMs);
        }
      }
    } else {
      if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
    }
    // Limpia el timeout al desmontar o al cambiar isLoggedIn
    return () => {
      if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
    };
    // eslint-disable-next-line
  }, [isLoggedIn]);

  // Cambia la vista con una animación de carga
  const handleSetView = (view) => {
    setLoading(true);
    setTimeout(() => {
      setCurrentView(view);
      setLoading(false);
    }, 1500); // 1.5 segundos de "cargando"
  };

  // Maneja el login exitoso
  const handleLogin = (adminData) => {
    setIsLoggedIn(true);
    setAdmin(adminData);
  };

  // Maneja el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setIsLoggedIn(false);
    setAdmin(null);
    setCurrentView('dashboard');
  };

  // Renderiza el contenido principal según la vista actual
  const renderContent = () => {
    if (loading) {
      return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{height: '300px'}}>
          <img src={loaderGif} alt="Cargando..." style={{width: '120px', marginBottom: '20px'}} />
          <span style={{fontSize: '1.2rem', color: '#333'}}>Cargando...</span>
        </div>
      );
    }
    switch (currentView) {
      case 'users':
        return <Users />;
      case 'books':
        return <Books />;
      default:
        return (
          <div className="text-center">
            <div className="row mt-4">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Gestión de Usuarios</h5>
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleSetView('users')}
                    >
                      Ver Usuarios
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Gestión de Libros</h5>
                    <button 
                      className="btn btn-success"
                      onClick={() => handleSetView('books')}
                    >
                      Ver Libros
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  // Render principal de la app
  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="container-fluid">
          {/* Barra de navegación */}
          <nav className="navbar navbar-expand-lg custom-navbar mb-4">
            <div className="container-fluid">
              <span
                className="navbar-brand"
                style={{ cursor: 'pointer' }}
                onClick={() => handleSetView('dashboard')}
              >
                Servicio Librería
              </span>
              <div className="d-flex align-items-center">
                <span className="text-light me-3">Bienvenido, {admin?.username}</span>
                <button 
                  className="btn btn-outline-light btn-sm"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </nav>
          {/* Contenido principal */}
          <div className="container">
            {renderContent()}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;