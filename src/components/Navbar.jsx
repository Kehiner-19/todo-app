import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li><Link to="/" className="nav-link">INICIO</Link></li>
        <li><Link to="/todos" className="nav-link">TAREAS</Link></li>
        <li><Link to="/registro" className="nav-link">REGISTRO</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
