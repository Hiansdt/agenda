# Agenda de Contatos

## Execução

## Requisitos

- Docker + Docker Compose
- (Opcional para execução local sem Docker)
  - .NET SDK 8
  - Node.js (versão LTS recomendada) + npm

Por padrão, o frontend utilizará a porta _3002_ e o backend utilizará a porta _5080_

## Opção 1 — Docker

Na raíz do projeto:

```bash
docker compose up --build
```

Para parar:

```bash
docker compose down
```

---

## Opção 2 — local (nativo)

### 1) Backend

Na pasta [agenda-backend](agenda-backend):

```bash
dotnet restore
dotnet build
dotnet run --project src/Agenda/Agenda.csproj
```

Para migrações:

```bash
dotnet ef database update --project src/Agenda/Agenda.csproj
```

### 2) Frontend

Na pasta [agenda-frontend](agenda-frontend):

```bash
npm install
npm run dev
```

---

## Decisões técnicas

- **API com DDD + Clean Architecture**:
  - isolamento de regras de negócio;
  - separação de camadas para facilitar testes e manutenção.
- **Persistência com migrations**:
  - evolução do banco com histórico controlado e reproduzível.
- **Swagger na API**:
  - Documentação e testes para endpoints de forma facilitada.
- **Frontend com TypeScript e arquitetura DDD com complementação entre Clean-Arch + Ports/Adapters**:
  - Previsibilidade através de tipagem;
  - Arquitetura refletindo domínios de forma semelhante à api;
  - Isolamento entre regras de negócio, chamadas para API, e renderização/UI.

---

## Melhorias

- Implementar pipeline CI/CD para deploy e testes automatizados;
- Bloquear rota de documentação (swagger) caso seja tratado apenas como ferramenta de desenvolvimento;
- Implementar integrações com APIs externas, como busca de endereço completo por CEP;
- Internacionalização na API para descrições de erro;

## Considerações finais

A intenção neste projeto foi propositalmente aplicar a arquitetura com mais purismo do que necessário para o escopo desta aplicação, a fim de demonstrar domínio e possibilidade de escalar a aplicação.
Em um caso real, a necessidade de escalabilidade deveria ser avaliada de forma mais detalhada para determinar a arquitetura a ser utilizada.
