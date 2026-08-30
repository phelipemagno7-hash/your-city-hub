export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
};

export type Restaurant = {
  id: string;
  name: string;
  category: string;
  rating: number;
  deliveryFee: number;
  eta: string;
  emoji: string;
  tag?: string;
  menu: { section: string; items: MenuItem[] }[];
};

export const restaurants: Restaurant[] = [
  {
    id: "burger-da-praca",
    name: "Burger da Praça",
    category: "Lanches",
    rating: 4.8,
    deliveryFee: 6,
    eta: "30-40 min",
    emoji: "🍔",
    tag: "Frete grátis acima de R$ 40",
    menu: [
      {
        section: "Lanches",
        items: [
          {
            id: "b1",
            name: "X-Salada da Casa",
            description: "Pão brioche, hambúrguer 150g, queijo, alface e tomate",
            price: 26.9,
            emoji: "🍔",
          },
          {
            id: "b2",
            name: "X-Bacon Duplo",
            description: "Dois hambúrgueres, bacon crocante e cheddar",
            price: 34.5,
            emoji: "🥓",
          },
          {
            id: "b3",
            name: "Batata Frita Grande",
            description: "Porção 400g com cheddar e bacon",
            price: 22,
            emoji: "🍟",
          },
        ],
      },
      {
        section: "Bebidas",
        items: [
          { id: "b4", name: "Refrigerante Lata", description: "350ml gelado", price: 6, emoji: "🥤" },
          { id: "b5", name: "Suco Natural", description: "Laranja ou maracujá 500ml", price: 9.5, emoji: "🧃" },
        ],
      },
    ],
  },
  {
    id: "pizzaria-bella",
    name: "Pizzaria Bella Ipa",
    category: "Pizzas",
    rating: 4.6,
    deliveryFee: 8,
    eta: "40-55 min",
    emoji: "🍕",
    menu: [
      {
        section: "Pizzas Grandes",
        items: [
          { id: "p1", name: "Mussarela", description: "Molho artesanal e orégano", price: 42, emoji: "🍕" },
          { id: "p2", name: "Calabresa", description: "Calabresa fatiada e cebola", price: 46, emoji: "🍕" },
          { id: "p3", name: "Frango c/ Catupiry", description: "Frango desfiado e catupiry", price: 52, emoji: "🍕" },
        ],
      },
      {
        section: "Bebidas",
        items: [{ id: "p4", name: "Guaraná 2L", description: "Gelado", price: 12, emoji: "🥤" }],
      },
    ],
  },
  {
    id: "cantinho-mineiro",
    name: "Cantinho Mineiro",
    category: "Marmitas",
    rating: 4.9,
    deliveryFee: 5,
    eta: "25-35 min",
    emoji: "🍛",
    tag: "Mais pedido da cidade",
    menu: [
      {
        section: "Marmitas",
        items: [
          { id: "m1", name: "Marmita P", description: "Arroz, feijão, carne e salada", price: 18, emoji: "🍛" },
          { id: "m2", name: "Marmita G", description: "Porção reforçada com dois acompanhamentos", price: 25, emoji: "🍲" },
        ],
      },
    ],
  },
  {
    id: "acai-do-centro",
    name: "Açaí do Centro",
    category: "Sobremesas",
    rating: 4.7,
    deliveryFee: 4,
    eta: "20-30 min",
    emoji: "🍧",
    menu: [
      {
        section: "Açaí",
        items: [
          { id: "a1", name: "Açaí 500ml", description: "Com 3 acompanhamentos", price: 19.9, emoji: "🍧" },
          { id: "a2", name: "Açaí 300ml", description: "Com 2 acompanhamentos", price: 14.9, emoji: "🍨" },
        ],
      },
    ],
  },
];

export type Product = {
  id: string;
  name: string;
  store: string;
  price: number;
  description: string;
  emoji: string;
  category: string;
  whatsapp: string;
};

export const products: Product[] = [
  {
    id: "v1",
    name: "Vestido Midi Floral",
    store: "Boutique Flor de Ipê",
    price: 149.9,
    description: "Tecido leve, tamanhos P ao GG. Disponível em 3 estampas.",
    emoji: "👗",
    category: "Moda",
    whatsapp: "5599999990001",
  },
  {
    id: "v2",
    name: "Tênis Casual Branco",
    store: "Calçados Silva",
    price: 219,
    description: "Numeração 36 ao 44. Parcelamos em até 4x sem juros.",
    emoji: "👟",
    category: "Calçados",
    whatsapp: "5599999990002",
  },
  {
    id: "v3",
    name: "Jogo de Panelas 5 peças",
    store: "Casa & Variedades",
    price: 289,
    description: "Antiaderente com cabo em silicone. Entrega na cidade.",
    emoji: "🍳",
    category: "Casa",
    whatsapp: "5599999990003",
  },
  {
    id: "v4",
    name: "Camisa Social Slim",
    store: "Moda Masculina Ipa",
    price: 119.9,
    description: "Algodão premium, cores branco, azul e preto.",
    emoji: "👔",
    category: "Moda",
    whatsapp: "5599999990004",
  },
  {
    id: "v5",
    name: "Kit Presente Perfumaria",
    store: "Essência Local",
    price: 89.9,
    description: "Perfume 100ml + hidratante. Embalagem para presente.",
    emoji: "🧴",
    category: "Beleza",
    whatsapp: "5599999990005",
  },
  {
    id: "v6",
    name: "Bicicleta Aro 29",
    store: "Bike Ipa",
    price: 1290,
    description: "21 marchas, freio a disco. Revisão grátis por 6 meses.",
    emoji: "🚲",
    category: "Esporte",
    whatsapp: "5599999990006",
  },
];

export type Professional = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  area: string;
  initials: string;
  phone: string;
  about: string;
};

export const professionals: Professional[] = [
  {
    id: "s1",
    name: "João Ribeiro",
    specialty: "Pedreiro",
    rating: 4.9,
    reviews: 48,
    area: "Centro e bairros",
    initials: "JR",
    phone: "5599999991001",
    about: "Alvenaria, reboco e reformas em geral. Orçamento sem compromisso.",
  },
  {
    id: "s2",
    name: "Carlos Andrade",
    specialty: "Eletricista",
    rating: 4.8,
    reviews: 63,
    area: "Atende toda a cidade",
    initials: "CA",
    phone: "5599999991002",
    about: "Instalações residenciais, quadros de energia e emergências 24h.",
  },
  {
    id: "s3",
    name: "Maria das Graças",
    specialty: "Diarista / Faxineira",
    rating: 5,
    reviews: 91,
    area: "Centro, Vila Nova",
    initials: "MG",
    phone: "5599999991003",
    about: "Limpeza residencial e pós-obra. Disponível de segunda a sábado.",
  },
  {
    id: "s4",
    name: "Antônio Souza",
    specialty: "Encanador",
    rating: 4.7,
    reviews: 35,
    area: "Atende toda a cidade",
    initials: "AS",
    phone: "5599999991004",
    about: "Vazamentos, caixa d'água e desentupimento com equipamento próprio.",
  },
  {
    id: "s5",
    name: "Fernanda Lima",
    specialty: "Pintora",
    rating: 4.6,
    reviews: 22,
    area: "Zona rural e urbana",
    initials: "FL",
    phone: "5599999991005",
    about: "Pintura residencial e comercial, textura e grafiato.",
  },
  {
    id: "s6",
    name: "Rodrigo Melo",
    specialty: "Marceneiro",
    rating: 4.9,
    reviews: 40,
    area: "Centro",
    initials: "RM",
    phone: "5599999991006",
    about: "Móveis planejados sob medida e restauração de madeira.",
  },
];

export type Service = { id: string; name: string; duration: string; price: number };

export type Place = {
  id: string;
  name: string;
  type: string;
  rating: number;
  address: string;
  emoji: string;
  services: Service[];
  hours: string[];
};

export const places: Place[] = [
  {
    id: "barbearia-do-ze",
    name: "Barbearia do Zé",
    type: "Barbearia",
    rating: 4.9,
    address: "Rua Sete de Setembro, 120 — Centro",
    emoji: "💈",
    services: [
      { id: "c1", name: "Corte masculino", duration: "40 min", price: 35 },
      { id: "c2", name: "Corte + barba", duration: "1h", price: 55 },
      { id: "c3", name: "Barba terapia", duration: "30 min", price: 30 },
    ],
    hours: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
  },
  {
    id: "salao-bella-hair",
    name: "Salão Bella Hair",
    type: "Salão de Beleza",
    rating: 4.8,
    address: "Av. Brasil, 455 — Vila Nova",
    emoji: "💇",
    services: [
      { id: "h1", name: "Escova modelada", duration: "50 min", price: 60 },
      { id: "h2", name: "Coloração", duration: "2h", price: 180 },
      { id: "h3", name: "Manicure e pedicure", duration: "1h", price: 55 },
    ],
    hours: ["09:00", "10:30", "13:00", "14:30", "16:00"],
  },
  {
    id: "clinica-sorriso",
    name: "Clínica Sorriso",
    type: "Odontologia",
    rating: 5,
    address: "Rua das Acácias, 78 — Centro",
    emoji: "🦷",
    services: [
      { id: "d1", name: "Avaliação inicial", duration: "30 min", price: 0 },
      { id: "d2", name: "Limpeza e profilaxia", duration: "1h", price: 150 },
      { id: "d3", name: "Clareamento", duration: "1h30", price: 450 },
    ],
    hours: ["08:00", "09:00", "10:00", "13:30", "15:00"],
  },
  {
    id: "studio-nails",
    name: "Studio Nails Ipa",
    type: "Estética",
    rating: 4.7,
    address: "Rua Minas Gerais, 33 — Centro",
    emoji: "💅",
    services: [
      { id: "n1", name: "Alongamento de unhas", duration: "2h", price: 130 },
      { id: "n2", name: "Design de sobrancelha", duration: "30 min", price: 40 },
    ],
    hours: ["09:00", "11:00", "14:00", "16:00", "18:00"],
  },
];

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
