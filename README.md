# 🐰🥕 Bunny Brawl Forest

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

Um jogo de ação 2D top-down multijogador local (com IA) onde controlas um coelho destemido numa floresta em busca de cenouras para crescer, subir de nível e dar coças aos rivais! ⚔️🌿

</div>

---

## 🎮 Sobre o Jogo

O **Bunny Brawl Forest** foi desenvolvido de raiz em JavaScript nativo utilizando a *HTML5 Canvas API* e estruturado com módulos modernos. O objetivo é simples: quanto mais cenouras comes, mais forte e crescido ficas. Mas tem cuidado: se colidires com um coelho de nível superior, levas uma coça e perdes todos os teus níveis acumulados para ele!

---

## ✨ Funcionalidades Principais

* **🌱 Progressão por Níveis**: Cada cenoura comida concede +1 nível e aumenta o teu poder na floresta.
* **⚔️ Sistema de Combate Dinâmico**: O coelho de menor nível perde a batalha e cede todos os seus níveis ao vencedor.
* **🧠 Inteligência Artificial (IA)**: 16 coelhos inimigos autónomos que vagueiam, caçam cenouras e lutam entre si.
* **🎥 Câmara Dinâmica com Zoom Automático**: A câmara afasta-se suavemente à medida que o coelho cresce para garantir visibilidade total do mapa.
* **⚡ Habilidade Dash (Boost)**: Usa a barra de espaço para um impulso rápido de velocidade para apanhar cenouras ou fugir de rivais.
* **🗺️ Minimapa em Tempo Real**: Acompanha a posição de todos os coelhos e cenouras no mundo.
* **🔊 Efeitos Sonoros Web Audio API**: Efeitos sintéticos integrados sem necessidade de ficheiros de áudio externos.

---

## 📁 Estrutura do Projeto

O projeto está organizado numa estrutura modular limpa e profissional:

```text
JogoCoelho/
├── index.html              # Ponto de entrada HTML principal
├── assets/
│   └── css/
│       └── style.css       # Estilos personalizados
└── src/
    ├── main.js             # Inicialização do jogo
    ├── engine.js           # Motor de jogo, câmara e colisões
    ├── entities.js         # Lógica das entidades (Coelho, Cenoura, Árvore)
    └── sound.js            # Sintetizador de áudio (Web Audio API)