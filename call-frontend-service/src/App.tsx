import { Outlet, Link } from 'react-router-dom'

export default function App() {
    return (
        <div style={{ padding: 24 }}>
            <h1 style={styles.h1}>Call Analytics App</h1>
            <nav style={styles.nav}>
                <Link style={styles.Link} to="/">
                    Home{' '}
                </Link>
            </nav>
            <Outlet />
        </div>
    )
}

const styles = {
    h1: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nav: {
        marginBottom: 24,
        fontSize: 18,
    },
    Link: {
        textDecoration: 'none',
        color: '#047483ff',
    },
}
