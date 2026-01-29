// Gestion du thème sombre
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Fonction pour vérifier si c'est la nuit avec l'API sunrise-sunset
async function isDarkOutside() {
    try {
        // Obtenir la position de l'utilisateur
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        
        const { latitude, longitude } = position.coords;
        
        // Appeler l'API sunrise-sunset (gratuite, sans clé)
        const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`);
        const data = await response.json();
        
        if (data.status === 'OK') {
            const now = new Date();
            const sunrise = new Date(data.results.sunrise);
            const sunset = new Date(data.results.sunset);
            
            // Retourner true si c'est la nuit (avant le lever ou après le coucher)
            return now < sunrise || now > sunset;
        }
    } catch (error) {
        console.log('Impossible d\'obtenir les heures de lever/coucher du soleil, utilisation de l\'heure locale');
    }
    
    // Fallback : utiliser l'heure locale (nuit = 19h-7h)
    const hour = new Date().getHours();
    return hour < 7 || hour >= 19;
}

// Initialiser le thème au chargement
async function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        // Si l'utilisateur a déjà choisi un thème, l'utiliser
        html.setAttribute('data-theme', savedTheme);
    } else {
        // Sinon, détecter automatiquement jour/nuit
        const isNight = await isDarkOutside();
        const autoTheme = isNight ? 'dark' : 'light';
        html.setAttribute('data-theme', autoTheme);
    }
}

// Appeler l'initialisation
initTheme();

// Toggle theme manuel
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Menu mobile
const burgerMenu = document.querySelector('.burger-menu');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');

burgerMenu.addEventListener('click', () => {
    burgerMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Fermer le menu mobile lors du clic sur un lien
navItems.forEach(item => {
    item.addEventListener('click', () => {
        burgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Gestion du formulaire de contact
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Afficher un message de chargement
    formStatus.style.display = 'block';
    formStatus.className = 'form-status loading';
    formStatus.textContent = 'Envoi en cours...';

    // Récupération des données du formulaire
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    try {
        // Envoi vers le script PHP qui gère Discord et Formspree
        const response = await fetch('https://sicre.alwaysdata.net/portfolio/contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            formStatus.className = 'form-status success';
            formStatus.textContent = 'Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.';
            contactForm.reset();
        } else {
            throw new Error(result.message || 'Erreur lors de l\'envoi');
        }
    } catch (error) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Erreur lors de l\'envoi du message. Veuillez réessayer.';
        console.error('Erreur:', error);
    }

    // Masquer le message après 5 secondes
    setTimeout(() => {
        formStatus.style.display = 'none';
    }, 5000);
});

// Carrousel mobile pour les projets
function initProjectCarousel() {
    const projectsGrid = document.querySelector('.projects-grid');
    const projectCards = document.querySelectorAll('.project-card');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const indicatorsContainer = document.querySelector('.carousel-indicators');

    let currentIndex = 0;
    const totalProjects = projectCards.length;

    // Créer les indicateurs
    for (let i = 0; i < totalProjects; i++) {
        const indicator = document.createElement('div');
        indicator.classList.add('carousel-indicator');
        if (i === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(i));
        indicatorsContainer.appendChild(indicator);
    }

    const indicators = document.querySelectorAll('.carousel-indicator');

    function updateCarousel() {
        projectsGrid.scrollTo({
            left: currentIndex * projectsGrid.offsetWidth,
            behavior: 'smooth'
        });

        // Mettre à jour les indicateurs
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalProjects;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalProjects) % totalProjects;
        updateCarousel();
    }

    // Événements des boutons
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Support du swipe tactile
    let touchStartX = 0;
    let touchEndX = 0;

    projectsGrid.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    projectsGrid.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchStartX - touchEndX > 50) {
            nextSlide();
        }

        if (touchEndX - touchStartX > 50) {
            prevSlide();
        }
    }
}

// Initialiser le carrousel seulement sur mobile
if (window.innerWidth <= 768) {
    initProjectCarousel();
}

// Réinitialiser au redimensionnement
window.addEventListener('resize', () => {
    const projectsGrid = document.querySelector('.projects-grid');
    const indicatorsContainer = document.querySelector('.carousel-indicators');

    if (window.innerWidth <= 768) {
        if (!indicatorsContainer.hasChildNodes()) {
            initProjectCarousel();
        }
    } else {
        // Réinitialiser sur desktop
        projectsGrid.scrollTo({ left: 0 });
        indicatorsContainer.innerHTML = '';
    }
});

// Animation au scroll (optionnel)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer les cartes de projet
document.querySelectorAll('.project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

/* =========================================
   GESTION DYNAMIQUE DES PROJETS (FETCH)
   ========================================= */

const projectsContainer = document.querySelector('.projects-grid');
const API_URL = 'https://sicre.alwaysdata.net/portfolio/db.php'; // Ton URL
const SKILLS_API_URL = 'https://sicre.alwaysdata.net/portfolio/skills.php'; // URL pour les skills
let list_projects = [];

// 1. Fonction principale pour récupérer et afficher
async function loadProjects() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const projects = await response.json();

        // On vide le message de chargement
        projectsContainer.innerHTML = '';

        // On génère le HTML pour chaque projet
        projects.forEach(project => {
            const cardHTML = createProjectCard(project);
            projectsContainer.insertAdjacentHTML('beforeend', cardHTML);
            list_projects.push(project);
        });

        // UNE FOIS LES ÉLÉMENTS CRÉÉS, on lance les scripts d'interface
        initScrollObserver(); // Lancer l'animation d'apparition
        initDetailListeners(); // Lancer les event listeners des détails
        
        if (window.innerWidth <= 768) {
            initProjectCarousel(); // Lancer le carrousel mobile
        }

    } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
        projectsContainer.innerHTML = `
            <div class="error-container" style="text-align:center; width:100%; padding:2rem;">
                <p class="error-msg" style="color: var(--text-color); margin-bottom: 1rem;">
                    Impossible de charger les projets pour le moment.
                </p>
                <button onclick="loadProjects()" class="btn-primary" style="cursor: pointer;">
                    Recharger
                </button>
            </div>
        `;
    }
}

// 2. Fonction pour créer le HTML d'une carte (Template String)
function createProjectCard(project) {
    // Attention : Assure-toi que les clés (project.image, project.title...) 
    // correspondent exactement à ton JSON PHP !

    // Génération des tags (si c'est un tableau ou une string)
    let tagsHTML = '';
    if (Array.isArray(project.tags)) {
        tagsHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    } else if (typeof project.tags === 'string') {
        // Si tes tags arrivent comme "HTML, CSS, JS"
        tagsHTML = project.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('');
    }

    return `
    <div class="project-card">
        <div class="project-image">
            <img src="${project.imageUrl}" alt="${project.imageAlt}">
        </div>
        <div class="project-content">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-tags">
                ${tagsHTML}
            </div>
            <a id="${project.id}" class="project-details">Voir les détails →</a>
        </div>
    </div>
    `;
}

function initDetailListeners() {
    const detailBtns = document.querySelectorAll('.project-details');
    detailBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault(); // Empêcher le comportement par défaut du lien
            const projectId = btn.id;
            const foundProject = list_projects.find(project => String(project.id) === String(projectId));
            if (foundProject) {
                openProjectModal(foundProject);
            } else {
                console.error('Project not found with ID:', projectId);
            }
        });
    });
}

// Fonction pour ouvrir la modal du projet
function openProjectModal(project) {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        openMobileModal(project);
    } else {
        openDesktopModal(project);
    }
}

// Ouvrir la modal desktop
function openDesktopModal(project) {
    const modal = document.getElementById('desktopModal');
    const overlay = document.getElementById('modalOverlay');

    // Remplir les données
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalDescription').textContent = project.detailedDescription;

    // Gérer les fonctionnalités
    const functionalitiesContainer = document.getElementById('modalFunctionalities');
    functionalitiesContainer.innerHTML = '';
    
    if (project.functionalities && project.functionalities.trim()) {
        const features = project.functionalities.split('/').map(f => f.trim()).filter(f => f);
        if (features.length > 0) {
            functionalitiesContainer.innerHTML = '<h3>Fonctionnalités :</h3><ul>' +
                features.map(feature => `<li>${feature}</li>`).join('') +
                '</ul>';
        }
    }

    // Gérer les liens
    const githubLink = document.getElementById('modalGithubLink');
    const prodLink = document.getElementById('modalProdLink');

    if (project.githubLink && project.githubLink.trim()) {
        githubLink.href = project.githubLink;
        githubLink.style.display = 'flex';
    } else {
        githubLink.style.display = 'none';
    }

    if (project.prodLink && project.prodLink.trim()) {
        prodLink.href = project.prodLink;
        prodLink.style.display = 'inline-block';
    } else {
        prodLink.style.display = 'none';
    }

    // Afficher la modal
    modal.classList.add('active');
    overlay.classList.add('active');

    // Empêcher le scroll
    document.body.style.overflow = 'hidden';
}

// Ouvrir le bottom sheet mobile
function openMobileModal(project) {
    const modal = document.getElementById('mobileModal');
    const overlay = document.getElementById('modalOverlay');

    // Remplir les données
    document.getElementById('mobileModalTitle').textContent = project.title;
    document.getElementById('mobileModalDescription').textContent = project.detailedDescription;

    // Gérer les fonctionnalités
    const functionalitiesContainer = document.getElementById('mobileFunctionalities');
    functionalitiesContainer.innerHTML = '';
    
    if (project.functionalities && project.functionalities.trim()) {
        const features = project.functionalities.split('/').map(f => f.trim()).filter(f => f);
        if (features.length > 0) {
            functionalitiesContainer.innerHTML = '<h3>Fonctionnalités :</h3><ul>' +
                features.map(feature => `<li>${feature}</li>`).join('') +
                '</ul>';
        }
    }

    // Gérer les liens
    const githubLink = document.getElementById('mobileMobileGithubLink');
    const prodLink = document.getElementById('mobileProdLink');

    if (project.githubLink && project.githubLink.trim()) {
        githubLink.href = project.githubLink;
        githubLink.style.display = 'flex';
    } else {
        githubLink.style.display = 'none';
    }

    if (project.prodLink && project.prodLink.trim()) {
        prodLink.href = project.prodLink;
        prodLink.style.display = 'block';
    } else {
        prodLink.style.display = 'none';
    }

    // Afficher la modal
    modal.classList.add('active');
    overlay.classList.add('active');

    // Empêcher le scroll
    document.body.style.overflow = 'hidden';
}

// Fermer les modales
function closeModals() {
    const desktopModal = document.getElementById('desktopModal');
    const mobileModal = document.getElementById('mobileModal');
    const overlay = document.getElementById('modalOverlay');

    desktopModal.classList.remove('active');
    mobileModal.classList.remove('active');
    overlay.classList.remove('active');

    // Restaurer le scroll
    document.body.style.overflow = 'auto';
}

// Event listeners pour fermer les modales
document.addEventListener('DOMContentLoaded', () => {
    const closeDesktopBtn = document.getElementById('closeDesktopModal');
    const closeMobileBtn = document.getElementById('closeMobileModal');
    const overlay = document.getElementById('modalOverlay');

    closeDesktopBtn.addEventListener('click', closeModals);
    closeMobileBtn.addEventListener('click', () => {
        const bottomSheet = document.querySelector('.bottom-sheet');
        bottomSheet.classList.add('closing');
        setTimeout(closeModals, 300);
    });

    overlay.addEventListener('click', closeModals);

    // Fermer avec la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModals();
        }
    });
});

// 3. Initialisation de l'Observer (Animation au scroll)
function initScrollObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// 4. Initialisation du Carrousel (Ton code existant adapté)
function initProjectCarousel() {
    const projectCards = document.querySelectorAll('.project-card');
    const indicatorsContainer = document.querySelector('.carousel-indicators');

    // Nettoyer les indicateurs existants pour éviter les doublons
    indicatorsContainer.innerHTML = '';

    if (projectCards.length === 0) return;

    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    let currentIndex = 0;
    const totalProjects = projectCards.length;

    // Créer les indicateurs
    for (let i = 0; i < totalProjects; i++) {
        const indicator = document.createElement('div');
        indicator.classList.add('carousel-indicator');
        if (i === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(i));
        indicatorsContainer.appendChild(indicator);
    }

    const indicators = document.querySelectorAll('.carousel-indicator');

    function updateCarousel() {
        // Note: projectCards[0].offsetWidth permet d'avoir la taille réelle d'une carte
        const cardWidth = projectCards[0].offsetWidth + 32; // +32 pour le gap (margin) approximatif
        projectsContainer.scrollTo({
            left: currentIndex * cardWidth,
            behavior: 'smooth'
        });

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalProjects;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalProjects) % totalProjects;
        updateCarousel();
    }

    // On retire les anciens event listeners (cloneNode) pour éviter les doublons si on recharge
    // Ou on s'assure de ne les attacher qu'une fois. Ici, une méthode simple :
    const newNext = nextBtn.cloneNode(true);
    const newPrev = prevBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNext, nextBtn);
    prevBtn.parentNode.replaceChild(newPrev, prevBtn);

    newNext.addEventListener('click', nextSlide);
    newPrev.addEventListener('click', prevSlide);
}

// Gestion du resize pour le carrousel
window.addEventListener('resize', () => {
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    if (window.innerWidth <= 768) {
        if (!indicatorsContainer.hasChildNodes()) {
            initProjectCarousel();
            initDetailListeners();
        }
    } else {
        projectsContainer.scrollTo({ left: 0 });
        indicatorsContainer.innerHTML = '';
        initDetailListeners();
    }
});

// LANCEMENT DU CHARGEMENT
document.addEventListener('DOMContentLoaded', loadProjects);
document.addEventListener('DOMContentLoaded', loadSkills);

/* =========================================
   GESTION DYNAMIQUE DES COMPÉTENCES
   ========================================= */

async function loadSkills() {
    const hardSkillsContainer = document.querySelector('.skills-category:nth-child(1) .skills-list');
    const softSkillsContainer = document.querySelector('.skills-category:nth-child(2) .skills-list');

    // Vérifier que les conteneurs existent
    if (!hardSkillsContainer || !softSkillsContainer) {
        console.warn('Conteneurs de compétences non trouvés');
        return;
    }

    // Message de chargement
    hardSkillsContainer.innerHTML = '<p style="width:100%; text-align:center;">Chargement...</p>';
    softSkillsContainer.innerHTML = '<p style="width:100%; text-align:center;">Chargement...</p>';

    try {
        const response = await fetch(SKILLS_API_URL);

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Vider les conteneurs
        hardSkillsContainer.innerHTML = '';
        softSkillsContainer.innerHTML = '';

        // Afficher les hard skills
        if (data.hard_skills && data.hard_skills.length > 0) {
            data.hard_skills.forEach(skill => {
                const skillTag = document.createElement('span');
                skillTag.className = 'skill-tag';
                skillTag.textContent = skill.name;
                hardSkillsContainer.appendChild(skillTag);
            });
        } else {
            hardSkillsContainer.innerHTML = '<p style="width:100%; text-align:center; color: var(--gray);">Aucune hard skill</p>';
        }

        // Afficher les soft skills
        if (data.soft_skills && data.soft_skills.length > 0) {
            data.soft_skills.forEach(skill => {
                const skillTag = document.createElement('span');
                skillTag.className = 'skill-tag';
                skillTag.textContent = skill.name;
                softSkillsContainer.appendChild(skillTag);
            });
        } else {
            softSkillsContainer.innerHTML = '<p style="width:100%; text-align:center; color: var(--gray);">Aucune soft skill</p>';
        }

    } catch (error) {
        console.error('Erreur lors du chargement des compétences:', error);
        
        const errorHTML = `
            <div style="text-align:center; width:100%; padding:1rem;">
                <p style="color: var(--text-color); margin-bottom: 0.5rem; font-size: 0.9rem;">
                    Impossible de charger les compétences
                </p>
                <button onclick="loadSkills()" class="btn-primary" style="cursor: pointer; padding: 0.5rem 1rem; font-size: 0.9rem;">
                    Recharger
                </button>
            </div>
        `;
        
        hardSkillsContainer.innerHTML = errorHTML;
        softSkillsContainer.innerHTML = errorHTML;
    }
}


/* =========================================
   GESTION OUVERTURE CV
   ========================================= */
const btnOpen = document.getElementById("btnOpenCv");
// Chemin vers le CV
const cvUrl = "./assets/cv-sicre-ilian.pdf";

btnOpen.addEventListener("click", () => {
    window.open(cvUrl, "_blank");
});