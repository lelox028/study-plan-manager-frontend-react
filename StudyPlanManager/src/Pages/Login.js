import React, { useState } from 'react';
import styles from '../dist/login.module.scss';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { MdAccountTree } from "react-icons/md";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      navigate('/home');
    } else {
      alert('Login failed');
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Top Branding */}
      <div className={styles.branding}>
        <div className={styles.brandingIcon}>
          <MdAccountTree className={styles.icon} />
        </div>
        <h2 className={styles.brandingTitle}>Study Plan Manager</h2>
      </div>

      {/* Login Card */}
      <div className={styles.loginCard}>
        <div className={styles.cardHeader}>
          <h1 className={styles.cardTitle}>Bienvenido de nuevo</h1>
          <p className={styles.cardSubtitle}>Ingresa tus credenciales para acceder a tu plan de estudios.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Username Field */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Nombre de Usuario</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="ejemplo123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={styles.input}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Contraseña</label>
            <div className={styles.inputWrapper}>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
              />
            </div>
          </div>

          {/* Action Button */}
          <div className={styles.buttonWrapper}>
            <button type="submit" className={styles.submitButton}>
              <span>Iniciar sesión</span>
              <span className="material-symbols-outlined">login</span>
            </button>
          </div>
        </form>

        {/* Toggle View Area */}
        <div className={styles.cardFooter}>
          <div className={styles.divider}></div>
          <p className={styles.footerText}>
            ¿No tienes cuenta?{' '}
            <a className={styles.registerLink} href="/signup">Regístrate</a>
          </p>
        </div>
      </div>

      {/* Footer Links */}
      {/* <div className={styles.footerLinks}>
        <a className={styles.footerLink} href="#">Términos</a>
        <a className={styles.footerLink} href="#">Privacidad</a>
        <a className={styles.footerLink} href="#">Contacto</a>
      </div> */}
    </div>
  );
};

export default Login;