import { useState } from 'react';
import SectionPage from './components/SectionPage';
import loginSnippets from './data/loginSnippets';
import signupSnippets from './data/signupSnippets';
import viewsSnippets from './data/viewsSnippets';
import mailSnippets from './data/mailSnippets';
import sanctumSnippets from './data/sanctumSnippets';
import bookApiSnippets from './data/bookApiSnippets';
import employeeApiSnippets from './data/employeeApiSnippets';
import commandsSnippets from './data/commandsSnippets';
import './index.css';

const sections = [
  { key: 'login',    label: 'Login',        icon: '🔐', title: 'Login',                    description: 'Session-based authentication — controller, blade view & routes.',                snippets: loginSnippets },
  { key: 'signup',   label: 'Register',      icon: '📝', title: 'Register',                 description: 'User registration — blade form with jQuery validation & controller.',             snippets: signupSnippets },
  { key: 'views',    label: 'Views',         icon: '🖼️', title: 'Blade Views',               description: 'App layout, forgot password & reset password blade templates.',                   snippets: viewsSnippets },
  { key: 'mail',     label: 'Mail',          icon: '📧', title: 'Mail',                      description: 'Mailable class & email blade template for registration.',                        snippets: mailSnippets },
  { key: 'sanctum',  label: 'Sanctum',       icon: '🛡️', title: 'Sanctum Auth API',          description: 'API authentication using Laravel Sanctum — install, login & logout.',             snippets: sanctumSnippets },
  { key: 'book',     label: 'Book API',      icon: '📚', title: 'Book API (Protected)',       description: 'CRUD API for Books — requires Sanctum token authentication.',                    snippets: bookApiSnippets },
  { key: 'employee', label: 'Employee API',  icon: '👥', title: 'Employee API (Public)',      description: 'CRUD API for Employees & Departments — no authentication required.',             snippets: employeeApiSnippets },
  { key: 'commands', label: 'Commands',      icon: '⚡', title: 'Artisan Commands',           description: 'Essential Laravel Artisan commands for scaffolding & development.',               snippets: commandsSnippets },
];

export default function App() {
  const [active, setActive] = useState('login');
  const [mobileOpen, setMobileOpen] = useState(false);

  const current = sections.find((s) => s.key === active);

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <span className="logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle', marginRight: '6px'}}>
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            Laravel Snippets
          </span>
          <ul className={`nav-links ${mobileOpen ? 'open' : ''}`}>
            {sections.map((s) => (
              <li key={s.key}>
                <button
                  className={`nav-link ${active === s.key ? 'active' : ''}`}
                  onClick={() => { setActive(s.key); setMobileOpen(false); }}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero">
        <div className="hero-content">
          <h1>Laravel Sample Code</h1>
          <p>
            Ready-to-use <strong>Laravel</strong> code — Login, Register, Blade Views, Mail, Sanctum API, CRUD &amp; Artisan Commands.
          </p>
        </div>
      </header>

      {/* Active Section */}
      <SectionPage
        key={current.key}
        icon={current.icon}
        title={current.title}
        description={current.description}
        snippets={current.snippets}
      />

      {/* Footer */}
      <footer className="footer">
        <p>Built with ❤️ — Copy, paste, and ship faster.</p>
      </footer>
    </>
  );
}
