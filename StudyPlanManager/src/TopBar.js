import styles from './dist/topBar.module.scss';
// Import SPM Logo
import Logo from "./dist/img/SPM_Logo_Cropped.png"
import { Container } from '@mui/material';


function TopBar(){
    return (
        <div className={styles.TopBar}>
                <div className={styles.TopBarContainer}>
                    <div className={styles.Left}>
                        <a href='/'>
                            <img src={Logo} alt="SPM Logo" className={styles.Logo} />
                        </a>                    </div>
                    <div className={styles.Right}>right</div>
                </div>
            </div>
    )
}

export default TopBar;