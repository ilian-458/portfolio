# Spot The Square
#[OUVRIR LE JEU](/html/index.html)
## 🎯 Description
**Spot The Square** est une application web inspirée du jeu [Vision de chess.com](https://www.chess.com/vision).  
Elle aide les joueurs d’échecs à visualiser rapidement les 64 cases de l’échiquier.  

Le principe : une case est désignée aléatoirement, le joueur doit cliquer dessus le plus vite possible. Chaque bonne réponse rapporte 1 point.  

---

## 🛠️ Langages utilisées
- **HTML** : structure de l’application  
- **CSS** : mise en forme et design  
- **JavaScript** : logique du jeu et interactions   

---

## 📂 Arborescence type
```
js-spot-the-square/
│
├── html
│ ├── index.html 
│ ├── chrono-1.html
│ ├── chrono-1-inverse.html
│ ├── chrono-2.html
│ ├── chrono-2-inverse.html
│ ├── survival.html
│ └── survival-inverse.html
│
├── css/
│ ├── main.css
│ ├── table.css
│ └── heart.css
│
├── js/
│ ├── main.js
│ ├── game.js
│ ├── timer.js 
│ ├── survival.js  
│ └── highscore.js 
│
├── Assets/
│ ├── img/
│   ├── Logo.png
│   └── switch.png
│
└── .gitignore
````

---

## 🌱 Fonctionnalités
- Échiquier interactif (64 cases)  
- Sélection aléatoire d’une case à trouver  
- Gestion et affichage du score en temps réel  
- Mode **chrono** (1 ou 2 minutes)  
- Mode **survie** avec 3 vies   
- Sauvegarde et affichage du **meilleur score** via `localStorage`  
- Possibilité de retourner l’échiquier pour s’entraîner côté noir  

---

## 📚 Ressources
- [MDN – localStorage](https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage)  
- [Grafikart – Local Storage](https://grafikart.fr/tutoriels/javascript-local-storage-2077)  
- [MDN – data-attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/How_to/Use_data_attributes)  

---
