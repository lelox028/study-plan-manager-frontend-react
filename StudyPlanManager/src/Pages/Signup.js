import React, { useState } from 'react';
import styles from '../dist/login.module.scss';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signup(username, email, password);
    if (success) {
      navigate('/login');
    } else {
      alert('Signup failed');
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Top Branding */}
      <div className={styles.branding}>
        <div className={styles.brandingIcon}>
          <svg className={styles.icon} fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
          </svg>
        </div>
        <h2 className={styles.brandingTitle}>Study Plan Manager</h2>
      </div>

      {/* Signup Card */}
      <div className={styles.loginCard}>
        <div className={styles.cardHeader}>
          <h1 className={styles.cardTitle}>Crear cuenta</h1>
          <p className={styles.cardSubtitle}>Completa los campos para registrarte en Study Plan Manager.</p>
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

          {/* Email Field */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Correo electrónico</label>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                placeholder="ejemplo@universidad.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <span>Registrarse</span>
              <span className="material-symbols-outlined">person_add</span>
            </button>
          </div>
        </form>

        {/* Toggle View Area */}
        <div className={styles.cardFooter}>
          <div className={styles.divider}></div>
          <p className={styles.footerText}>
            ¿Ya tienes cuenta?{' '}
            <a className={styles.registerLink} href="/login">Inicia sesión</a>
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

export default Signup;