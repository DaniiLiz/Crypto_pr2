import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../../assets/logo_navbar.png';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <img src={logo} alt="Logo" className={styles.logo} />
            </div>
            <div className={styles.navLinks}>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? `${styles.linkButton} ${styles.active}` : styles.linkButton
                    }
                    end
                >
                    Crypto Table
                </NavLink>
            </div>
        </nav>
    );
};