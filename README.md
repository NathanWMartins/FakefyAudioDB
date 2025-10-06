# 🎵 Fakefy — Gerenciador de Músicas e Playlists

Fakefy é uma aplicação web que simula um serviço de gerenciamento de músicas e playlists inspirado no Spotify.  

---

## 🚀 Visão Geral

A proposta do Fakefy é oferecer uma experiência realista de exploração e organização de músicas, com interface moderna e totalmente funcional.  
O sistema permite ao usuário:

- Realizar **login com validação simples** (sem cadastro real);
- **Pesquisar músicas e álbuns** via API pública;
- Criar, renomear e excluir **playlists pessoais**;
- Adicionar e remover músicas das playlists;
- Navegar entre **Playlists**, **Músicas** e **Perfil do Usuário**;
- Alternar entre temas **claro e escuro**;

---

## 🧱 Tecnologias Utilizadas

| Camada | Tecnologias |
|--------|--------------|
| **Front-end** | React + TypeScript |
| **Gerenciamento de Estado** | Redux Toolkit |
| **Interface (UI)** | Material UI (MUI v7) |
| **API Pública** | [TheAudioDB](https://www.theaudiodb.com/) |
| **Persistência Local** | localStorage e sessionStorage |
| **Roteamento** | React Router v6+ |

---

## ⚙️ Instalação e Execução

### 🔧 Pré-requisitos
- Node.js 18+
- npm ou yarn

### 💻 Passos

```bash
# Clone o repositório
git clone https://github.com/SeuUsuario/fakefy.git
cd fakefy

# Instale as dependências
npm install

# Execute o projeto
npm run dev