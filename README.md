# Duug Styles

E-commerce monolítico para moda masculina streetwear com **Node.js + Express + Sequelize + MySQL + EJS**.

## Stack
- Node.js (JavaScript)
- Express.js
- Sequelize ORM + MySQL
- EJS + Bootstrap + CSS custom dark premium
- Arquitetura em módulos (controllers/services/routes/models/views)

## Funcionalidades implementadas (base funcional)
- Loja pública: home, categoria, produto, busca, carrinho, checkout, páginas institucionais.
- Autenticação: cliente e admin com hash bcrypt.
- Painel admin: login, dashboard e cadastro/listagem de produtos.
- SEO base: meta dinâmico, Open Graph, robots.txt, sitemap.xml, schema.org Product.
- Segurança: Helmet, CORS, sessão httpOnly, rate limit login/checkout, middleware de erro.
- Integrações em camada service com modo mock/sandbox:
  - AsaasService (cliente/cobrança/status)
  - MelhorEnvioService (cálculo de frete/etiqueta)
- Migrations + seeders com dados iniciais.

## Estrutura
```bash
src/
  config/
  controllers/
  middlewares/
  models/
  routes/
  services/
  validators/
  helpers/
  views/
  public/
  database/
    migrations/
    seeders/
  app.js
  server.js
```

## Variáveis de ambiente
Copie `.env.example` para `.env`.

## Instalação local
1. Instale dependências:
   ```bash
   npm install
   ```
2. Configure MySQL e `.env`.
3. Rode migrations:
   ```bash
   npm run db:migrate
   ```
4. Rode seeders:
   ```bash
   npm run db:seed
   ```
5. Inicie em dev:
   ```bash
   npm run dev
   ```

## Admin padrão
- E-mail: `admin@admin.com`
- Senha: `Admin@123456`

> **Troque essa senha no primeiro login.**

## Deploy EasyPanel/Nixpacks
1. Criar banco MySQL no painel.
2. Subir repositório e configurar build/start:
   - Build: `npm install`
   - Start: `npm start`
3. Definir todas variáveis de ambiente do `.env.example`.
4. Executar `npm run db:migrate` e `npm run db:seed` no container.
5. Criar domínio e apontar DNS.
6. Ativar SSL no EasyPanel.
7. Configurar webhook Asaas: `POST /webhooks/asaas`.
8. Configurar credenciais do Melhor Envio no ambiente.

## Modo Sandbox/Mock
- Quando `ASAAS_API_KEY` vazio ou `ASAAS_ENV=sandbox`, pagamentos usam mock.
- Quando `MELHOR_ENVIO_TOKEN` vazio ou `MELHOR_ENVIO_ENV=sandbox`, frete usa mock.

## Próximos módulos recomendados
- CRUDs completos (cupons, banners, categorias, pedidos, clientes, SEO global).
- Checkout avançado com persistência de pedidos/itens/pagamento/entrega no DB.
- Upload real de imagens com validação e compressão.
- Relatórios avançados com gráficos.
