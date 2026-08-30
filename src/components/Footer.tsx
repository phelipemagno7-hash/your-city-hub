import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Instagram, Facebook, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-xl shadow-md">
                I+
              </div>
              <span className="text-2xl font-extrabold tracking-tight">
                Ipa<span className="text-accent">+</span>
              </span>
            </div>
            <p className="text-sm text-secondary-foreground/80 max-w-sm leading-relaxed">
              O shopping virtual e hub de serviços da sua cidade. Fortalecendo a economia local e conectando consumidores aos melhores comerciantes e prestadores de serviços de Ipanema - MG.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="grid size-9 place-items-center rounded-xl bg-secondary-foreground/10 text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="grid size-9 place-items-center rounded-xl bg-secondary-foreground/10 text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="size-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-accent mb-4">
              Categorias
            </h3>
            <ul className="space-y-2.5 text-xs text-secondary-foreground/80">
              <li>
                <Link to="/delivery" className="hover:text-accent transition-colors">
                  Delivery de Comida
                </Link>
              </li>
              <li>
                <Link to="/vitrine" className="hover:text-accent transition-colors">
                  Vitrine Virtual das Lojas
                </Link>
              </li>
              <li>
                <Link to="/profissionais" className="hover:text-accent transition-colors">
                  Profissionais Autônomos
                </Link>
              </li>
              <li>
                <Link to="/agendamentos" className="hover:text-accent transition-colors">
                  Agendamentos & Estética
                </Link>
              </li>
              <li>
                <Link to="/busca" className="hover:text-accent transition-colors">
                  Busca Geral da Cidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Para Comerciantes */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-accent mb-4">
              Parceiros & Lojas
            </h3>
            <ul className="space-y-2.5 text-xs text-secondary-foreground/80">
              <li>
                <Link to="/perfil" className="hover:text-accent transition-colors">
                  Cadastrar minha Empresa
                </Link>
              </li>
              <li>
                <Link to="/perfil" className="hover:text-accent transition-colors">
                  Sou Profissional Autônomo
                </Link>
              </li>
              <li>
                <Link to="/perfil" className="hover:text-accent transition-colors">
                  Painel do Comerciante
                </Link>
              </li>
              <li>
                <Link to="/perfil" className="hover:text-accent transition-colors">
                  Termos para Estabelecimentos
                </Link>
              </li>
            </ul>
          </div>

          {/* Local / Atendimento */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-accent mb-4">
              Atendimento Local
            </h3>
            <ul className="space-y-2.5 text-xs text-secondary-foreground/80">
              <li className="flex items-start gap-2">
                <MapPin className="size-4 text-accent shrink-0 mt-0.5" />
                <span>Ipanema, Minas Gerais — Brasil</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-accent shrink-0" />
                <span>(33) 99999-0000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-accent shrink-0" />
                <span>contato@ipamais.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-secondary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary-foreground/60">
          <p>© {new Date().getFullYear()} Ipa+ (Your City Hub). Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito com <Heart className="size-3.5 text-red-400 fill-red-400" /> para fortalecer o comércio de Ipanema.
          </p>
        </div>
      </div>
    </footer>
  );
}
