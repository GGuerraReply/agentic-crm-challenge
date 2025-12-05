# 🔌 ReUI MCP Server

Questo progetto utilizza **[ReUI](https://reui.io/)** come component library. ReUI offre un server MCP (Model Context Protocol) che permette a GitHub Copilot di generare codice più accurato basandosi sulla documentazione ufficiale dei componenti.

## 📦 Cos'è ReUI?

ReUI è una libreria di componenti React open-source che fornisce:
- Componenti UI accessibili e personalizzabili
- Integrazione nativa con Tailwind CSS
- Documentazione completa per ogni componente

## 🤖 Cos'è l'MCP Server?

MCP (Model Context Protocol) è un protocollo aperto che standardizza il modo in cui le applicazioni forniscono contesto agli LLM.

L'MCP Server di ReUI permette a GitHub Copilot di:
- Accedere alla documentazione dei componenti in tempo reale
- Generare codice che rispetta le API dei componenti
- Suggerire props e varianti corrette
- Migliorare la qualità del codice generato

## 🚀 Installazione MCP Server

### Passo 0: Installa pnpm (se non lo hai già)

pnpm è un package manager veloce ed efficiente. Installalo con uno dei seguenti metodi:

**Con npm:**
```bash
npm install -g pnpm
```

**Con Homebrew (macOS):**
```bash
brew install pnpm
```

**Con Corepack (Node.js 16.13+):**
```bash
corepack enable
corepack prepare pnpm@latest --activate
```

Verifica l'installazione:
```bash
pnpm --version
```

### Passo 1: Esegui il comando di configurazione

Apri il terminale nella root del progetto ed esegui:

```bash
pnpm dlx shadcn@latest mcp init
```

> Se non hai pnpm installato, puoi usare: `npx shadcn@latest mcp init`

### Passo 2: Seleziona il tuo MCP client

Quando richiesto, seleziona il tuo IDE/client MCP (es. VS Code con GitHub Copilot).

### Passo 3: Abilita il server MCP

Segui le istruzioni per abilitare il server MCP nel tuo client.

## 💡 Esempi d'uso

Una volta configurato l'MCP, puoi chiedere al tuo IDE di usare qualsiasi componente ReUI. Ecco alcuni esempi di prompt:

- `Add Statistic Card block from ReUI registry.`
- `Add Base UI Autocomplete Component from ReUI registry.`
- `Add Base UI Phone Input Component from ReUI registry.`
- `Build me a User Management CRUD using Data Grid and Forms from ReUI registry.`

## 📚 Risorse

- [Documentazione ReUI](https://reui.io/docs)
- [Guida MCP ReUI](https://reui.io/docs/mcp)
- [GitHub ReUI](https://github.com/keenthemes/reui)
