# 🚀 Agentic CRM Challenge

Una challenge pratica per migliorare le proprie skill con **GitHub Copilot** sviluppando un CRM completo utilizzando tecniche di sviluppo assistito da AI.

## 📸 Anteprima

![App Preview](docs/crm.png)

## 🎯 Obiettivo della Challenge

L'obiettivo di questa challenge è imparare a utilizzare efficacemente GitHub Copilot per:
- Generare codice in modo efficiente
- Implementare funzionalità complesse con l'aiuto dell'AI
- Migliorare la produttività nello sviluppo software
- Comprendere come collaborare con un assistente AI nel processo di sviluppo

## 🛠️ Tecnologie Utilizzate

- **React 19** - Libreria UI
- **TypeScript** - Tipizzazione statica
- **Vite** - Build tool e dev server
- **Tailwind CSS 4** - Framework CSS utility-first
- **SQLite (sql.js)** - Database nel browser per la persistenza dei dati
- **shadcn/ui** - Componenti UI accessibili e personalizzabili

> ⚠️ **Nota**: Per semplicità, tutte le funzionalità dovranno essere implementate utilizzando **SQLite come database nel browser**. Questo permette di avere persistenza dei dati senza necessità di un backend esterno.

## 📋 Prerequisiti

- Node.js 16.x o superiore
- NPM installato sul PC

## 🚀 Installazione e Avvio

1. **Clona il repository** e accedi alla root del progetto:
   ```bash
   cd agentic-crm-challenge
   ```

2. **Installa le dipendenze**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Esegui la build**:
   ```bash
   npm run build
   ```

4. **Avvia il server di sviluppo**:
   ```bash
   npm run dev
   ```

5. Apri il browser su `http://localhost:5173`

## ✅ Task della Challenge

Di seguito i task da completare durante la challenge. Usa GitHub Copilot per aiutarti nell'implementazione!

### Task 1: Setup Database SQLite
- [ ] Configurare sql.js per utilizzare SQLite nel browser
- [ ] Creare lo schema del database per contacts, companies, deals, tasks, notes
- [ ] Implementare le funzioni CRUD base

### Task 2: Persistenza Contatti
- [ ] Collegare la lista contatti al database SQLite
- [ ] Implementare creazione nuovo contatto con salvataggio su DB
- [ ] Implementare modifica e eliminazione contatti

### Task 3: Persistenza Aziende
- [ ] Collegare la lista aziende al database SQLite
- [ ] Implementare creazione nuova azienda con salvataggio su DB
- [ ] Implementare modifica e eliminazione aziende

### Task 4: Gestione Deals
- [ ] Collegare la pipeline deals al database SQLite
- [ ] Implementare drag & drop con aggiornamento stato su DB
- [ ] Implementare creazione e modifica deals

### Task 5: Tasks e Note
- [ ] Implementare persistenza tasks
- [ ] Implementare persistenza note
- [ ] Collegare tasks e note a contatti/aziende

### Task 6: Dashboard Analytics
- [ ] Implementare query aggregate per statistiche
- [ ] Creare grafici dinamici basati sui dati reali
- [ ] Aggiungere filtri per periodo temporale

### Bonus Tasks
- [ ] Implementare ricerca full-text
- [ ] Aggiungere export/import dati
- [ ] Implementare undo/redo operazioni

## 📚 Risorse Utili

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [sql.js Documentation](https://sql.js.org/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📝 License

Questo progetto è stato creato per scopi educativi.
