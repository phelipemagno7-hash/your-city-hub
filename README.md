# Your City Hub

Visão Geral do Projeto Crie um web app chamado "Ipa+", um shopping virtual e hub de serviços voltado para uma cidade do interior com cerca de 20 mil habitantes. O design deve ser mobile-first, amigável, intuitivo e focado na economia local.

Paleta de Cores Obrigatória

Cor Primária: #16A085 (Use em botões principais, ícones de destaque e call-to-actions).

Cor Secundária: #0D3B2E (Use para tipografia principal, barras de navegação, cabeçalhos e rodapés).

Cor de Apoio: #84E1BC (Use em backgrounds de cards, tags de categorias e estados de hover).

Cor de Fundo: #FFFEFF (Branco para o fundo geral do app, garantindo respiro e legibilidade).

Arquitetura e Módulos da Tela Inicial A tela inicial deve ter um cabeçalho com barra de busca e uma grade com 4 categorias principais. Cada categoria leva a um fluxo diferente:

1. Delivery (Alimentação): Interface de delivery padrão. Lista de lanchonetes e restaurantes, visualização de cardápio com itens e preços. Inclua um sistema de carrinho e uma tela de checkout (deixe o formulário de pagamento com cartão/PIX estruturado no front-end para futura integração de API).

2. Vitrine Virtual (Lojas): Catálogo para lojas locais (roupas, variedades). Os lojistas terão cards com foto, descrição e preço do produto. Não há carrinho de compras aqui; o botão de ação deve ser "Consultar Vendedor" ou "Comprar pelo WhatsApp".

3. Profissionais (Serviços): Um painel de classificados para trabalhadores autônomos (pedreiros, eletricistas, faxineiras). Layout em formato de lista com foto de perfil, especialidade, avaliação por estrelas e botão de contato direto.

4. Agendamentos (Beleza e Saúde): Interface de reservas para barbearias, salões, dentistas, etc. Deve conter a página do estabelecimento, seleção de serviço e um componente de calendário/relógio para o usuário selecionar data e horário disponíveis.

Componentes de UI

Bottom Navigation Bar: Ícones para "Início", "Meus Pedidos/Agendas", "Busca" e "Perfil".

Cards: Use cantos arredondados, sombras leves e a cor #84E1BC sutilmente para destacar ofertas na tela inicial.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3daf3d45-68f1-4be0-9e7d-ae3f9c22f768).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
