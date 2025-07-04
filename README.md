# 🌱 Agroforestree × Sympla Integration

Prova de conceito da integração entre [Sympla](https://sympla.com.br) e [Agroforestree](https://agroforestree.com) para plantio automático de árvores em eventos.

## 🎯 Objetivo

Demonstrar como cada ingresso vendido na Sympla pode automaticamente resultar no plantio de uma árvore em sistemas agroflorestais, apoiando pequenos agricultores e regenerando o planeta.

## 🏗️ Arquitetura

```
┌─────────────────┐    webhook    ┌─────────────────┐    API call    ┌─────────────────┐
│   Sympla        │  ────────────▶ │   Middleware    │  ────────────▶ │  Agroforestree  │
│   (simulado)    │               │   Node.js/TS    │               │      API        │
└─────────────────┘               └─────────────────┘               └─────────────────┘
                                           │
                                           ▼
                                  ┌─────────────────┐
                                  │   Dashboard     │
                                  │   Next.js/TS    │
                                  └─────────────────┘
```

## 🚀 Como Executar

### 1. Middleware (Backend)
```bash
cd agroforestree-sympla-middleware
npm install
npm run dev
```

### 2. Simulador (Frontend)
```bash
cd sympla-simulator
npm install
npm run dev
```

### 3. Acessar a Aplicação

- **Simulador:** http://localhost:3000
- **Middleware:** http://localhost:3001
- **Dashboard:** http://localhost:3000/dashboard

## 🧪 Testes

```bash
# Middleware
npm test

# Simulador
npm test
npm run test:coverage
```

## 🔧 Tecnologias

### Backend (Middleware)
- ✅ Node.js + TypeScript
- ✅ Express.js
- ✅ Validação HMAC para segurança
- ✅ Jest para testes
- ✅ Axios para chamadas HTTP

### Frontend (Simulador)
- ✅ Next.js 14 + TypeScript
- ✅ CSS Modules com design da Agroforestree
- ✅ Testing Library + Jest
- ✅ Design responsivo

## 📋 Funcionalidades

### ✅ Implementado
- [x] Middleware seguro com validação HMAC
- [x] Simulador de checkout Sympla
- [x] Dashboard em tempo real
- [x] Testes unitários abrangentes
- [x] Design responsivo fiel à Agroforestree
- [x] Conformidade LGPD
- [x] Rastreabilidade completa

### 🔄 Próximos Passos
- [ ] Integração com API real da Agroforestree
- [ ] Homologação oficial Sympla Conecta
- [ ] Certificados PDF personalizados
- [ ] Notificações por email
- [ ] Métricas avançadas

## 🌍 Impacto

Cada árvore plantada:
- **165kg** de CO₂ sequestrado em 20 anos
- **1 agricultor** familiar apoiado
- **Biodiversidade** regenerada
- **Solo** recuperado

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👥 Equipe

Desenvolvido como desafio técnico para integração da Agroforestree com o programa Sympla Conecta.

---

### 🌱 Juntos regenerando o planeta, uma árvore por vez!
