import './Navbar.css';

function Navbar({ currentPage, setCurrentPage }) {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span onClick={() => setCurrentPage('upload')} style={{ cursor: 'pointer' }}>Campus Vault</span>
            </div>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <button
                        className={`nav-link ${currentPage === 'upload' ? 'active' : ''}`}
                        onClick={() => setCurrentPage('upload')}
                    >
                        Upload
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${currentPage === 'see-files' ? 'active' : ''}`}
                        onClick={() => setCurrentPage('see-files')}
                    >
                        See Files
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;