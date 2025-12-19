import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-foreground/[0.05] mt-32">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <p className="text-sm text-foreground/30">
            © 2024 anxonews. Todos los derechos reservados.
          </p>

          {/* Legal links */}
          <div className="flex items-center gap-6">
            <Link 
              to="/privacidad" 
              className="text-sm text-foreground/30 hover:text-primary transition-colors"
            >
              Política de Privacidad
            </Link>
            <a 
              href="mailto:holaaanxo@gmail.com" 
              className="text-sm text-foreground/30 hover:text-primary transition-colors"
            >
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
