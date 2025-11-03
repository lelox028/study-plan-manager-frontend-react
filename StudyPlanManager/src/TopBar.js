import styles from './dist/topBar.module.scss';
// Import SPM Logo
import Logo from "./dist/img/SPM_Logo_Cropped.png"
import { Container, Button } from '@mui/material';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';


function TopBar(){
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className={styles.TopBar}>
                <div className={styles.TopBarContainer}>
                    <div className={styles.Left}>
                        <a href='/'>
                            <img src={Logo} alt="SPM Logo" className={styles.Logo} />
                        </a>                    </div>
                    <div className={styles.Right}>
                        <Button onClick={handleLogout} variant="outlined" color="inherit">
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
    )
}

export default TopBar;