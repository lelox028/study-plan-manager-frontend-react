import styles from '../dist/topBar.module.scss';
import { MdAccountTree } from "react-icons/md";
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';

function TopBar({ user }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className={styles.TopBar}>
            <Container maxWidth="xl" className={styles.Container}>
                <div className={styles.Left}>
                    <div className={styles.LogoContainer} onClick={() => navigate('/home')}>
                        <div className={styles.LogoBox}>
                            <MdAccountTree className={styles.Logo} />
                        </div>
                        <h2 className={styles.Title}>Study Plan Manager</h2>
                    </div>
                </div>
                <div className={styles.Right}>
                    <div className={styles.UserInfo}>
                        <div className={styles.Text}>
                            <p className={styles.Username}>{user ? user.username : 'Invitado'}</p>
                            <p className={styles.Email}>{user ? user.email : ''}</p>
                        </div>
                    </div>
                    <button className={styles.LogoutBtn} onClick={handleLogout}>
                        <span className={styles.LogoutIcon}>
                            {/* Puedes usar otro icono si prefieres material-symbols-outlined */}
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
                        </span>
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            </Container>
        </header>
    );
}

export default TopBar;