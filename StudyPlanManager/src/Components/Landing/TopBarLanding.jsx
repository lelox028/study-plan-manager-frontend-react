import React from 'react';
import { Button, Box, Container, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from "../../dist/img/SPM_Logo_Cropped.png"
import styles from '../../dist/landing.module.scss';

function TopBarLanding() {
    const navigate = useNavigate();

    return (
        <header className={styles.header}>
            <Container maxWidth="lg">
                <Box className={styles.headerContent}>
                    {/* Logo Section */}
                    <Box className={styles.logoSection}>
                        <Box className={styles.logoIcon}>
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_6_330)">
                                    <path clipRule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor" fillRule="evenodd"></path>
                                </g>
                                <defs>
                                    <clipPath id="clip0_6_330">
                                        <rect fill="white" height="48" width="48"></rect>
                                    </clipPath>
                                </defs>
                            </svg>
                        </Box>
                        <h2 className={styles.logoText}>SPM</h2>
                    </Box>

                    {/* Navigation Section */}
                    <Box className={styles.navSection}>
                        {/* Desktop Navigation */}
                        <Box className={styles.desktopNav}>
                            <Link href="#caracteristicas" className={styles.navLink}>
                                Características
                            </Link>
                            <Link href="#sobre-nosotros" className={styles.navLink}>
                                Sobre nosotros
                            </Link>
                            <Link 
                                href="https://github.com/lelox028/study-plan-manager-frontend-react"
                                target="_blank"
                                className={styles.navLink}
                            >
                                Código fuente
                            </Link>
                        </Box>

                        {/* Login Button */}
                        <Button 
                            className={styles.loginButton}
                            onClick={() => navigate('/login')}
                        >
                            Iniciar sesión
                        </Button>
                    </Box>
                </Box>
            </Container>
        </header>
    );
}

export default TopBarLanding;
