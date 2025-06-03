import NavLink from './nav-link';
import Logo from './logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex justify-center md:justify-start">
            <Logo />
          </div>
          
          <nav className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} className="text-sm text-foreground/70 hover:text-primary">
                {item.label}
              </NavLink>
            ))}
          </nav>

          <p className="text-sm text-muted-foreground text-center md:text-right">
            &copy; {currentYear} Tool Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
