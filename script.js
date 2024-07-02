// Importation de la fonction startGame du fichier labyrinthe-shogun.js
import { startGame } from './labyrinthe-shogun.js';

document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const bootcampsList = document.getElementById('bootcampsList');
    const modal = document.getElementById('bootcampModal');
    const gameModal = document.getElementById('gameModal');
    const closeBtn = document.querySelector('.close');
    const inscriptionForm = document.getElementById('inscriptionForm');
    const contactButton = document.querySelector('.contact-button');
    const ctaButtonContact = document.querySelector('.cta-button-contact')
    const contactModal = document.getElementById('contactModal');
    const contactCloseBtn = contactModal.querySelector('.close');
    // Gestion du compte à rebours
    const countdownTimer = document.getElementById('countdown-timer');
    const countdownDate = new Date('2024-07-31T23:59:59').getTime();

    // Données des bootcamps
    const bootcamps = [
        {
            id: 'math',
            title: 'Quête du Samouraï Mathématique',
            description: 'Embarque dans une aventure épique où les maths, la logique et l\'informatique sont tes super-pouvoirs !',
            details: [
                'Défis mathématiques gamifiés avec des niveaux à débloquer',
                'Missions de codage pour créer tes propres mini-jeux',
                'Tournois de logique pour aiguiser ton esprit de stratège',
                'Projets tech créatifs mêlant maths et programmation'
            ]
        },
        {
            id: 'culture',
            title: 'L\'Odyssée du Japon Moderne',
            description: 'Plonge dans l\'univers fascinant de la culture pop japonaise tout en apprenant la langue !',
            details: [
                'Apprends le japonais à travers les mangas et les animes',
                'Découvre l\'écriture japonaise en créant ton propre personnage',
                'Explore la culture japonaise via des jeux de rôle virtuels',
                'Participe à des échanges en ligne avec des ados japonais'
            ]
        },
        {
            id: 'art',
            title: 'Dojo des Arts Numériques',
            description: 'Libère l\'artiste en toi et fusionne l\'art traditionnel avec la technologie moderne !',
            details: [
                'Crée ton propre manga ou anime avec des outils numériques',
                'Apprends l\'art du pixel art et de l\'animation 8-bit',
                'Conçois des personnages 3D inspirés de l\'esthétique japonaise',
                'Organise une expo virtuelle de tes œuvres afro-japonaises'
            ]
        }
    ];

    // Gestion du menu hamburger
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Affichage dynamique des bootcamps
    function displayBootcamps() {
        bootcampsList.innerHTML = bootcamps.map(bootcamp => `
            <div class="bootcamp-item" data-id="${bootcamp.id}">
                <h3>${bootcamp.title}</h3>
                <p>${bootcamp.description}</p>
                <a href="#" class="cta-button" data-id="${bootcamp.id}">Rejoindre l'aventure</a>
            </div>
        `).join('');

        // Ajout des event listeners pour les boutons
        document.querySelectorAll('.bootcamp-item .cta-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                showBootcampDetails(e.target.dataset.id);
            });
        });
    }

    // Affichage des détails du bootcamp et du formulaire d'inscription
    function showBootcampDetails(bootcampId) {
        const bootcamp = bootcamps.find(b => b.id === bootcampId);
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');

        modalTitle.textContent = bootcamp.title;
        modalDescription.innerHTML = `
        <p>${bootcamp.description}</p>
        <h4>Ce que tu vas apprendre :</h4>
        <ul>
            ${bootcamp.details.map(detail => `<li>${detail}</li>`).join('')}
        </ul>
    `;

        // Au lieu d'afficher le formulaire d'inscription, lancez le jeu
        launchGame();
    }

    function showContactModal() {
        contactModal.style.display = 'block';
        setTimeout(() => {
            contactModal.style.opacity = '1';
        }, 10);
    }

    contactButton.addEventListener('click', (e) => {
        e.preventDefault();
        showContactModal();
    });

    ctaButtonContact.addEventListener('click', (e) => {
        e.preventDefault();
        showContactModal();
    });

    function closeContactModal() {
        contactModal.style.opacity = '0';
        setTimeout(() => {
            contactModal.style.display = 'none';
        }, 300);
    }

    contactCloseBtn.onclick = closeContactModal;

    // Fermeture du modal
    function closeModal() {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    closeBtn.onclick = closeModal;

    window.onclick = function (event) {
        if (event.target == modal) {
            closeModal();
        }
        if (event.target == contactModal) {
            closeContactModal();
        }
        if (event.target == gameModal) {
            closeGameModal();
        }
    }

    // Gestion du formulaire d'inscription
    inscriptionForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(inscriptionForm);
        const data = Object.fromEntries(formData);

        console.log('Données d\'inscription:', data);

        const submitButton = inscriptionForm.querySelector('button[type="submit"]');
        submitButton.textContent = 'Inscription réussie !';
        submitButton.style.backgroundColor = '#4CAF50';

        setTimeout(() => {
            closeModal();
            submitButton.textContent = 'Rejoindre l\'aventure';
            submitButton.style.backgroundColor = '';
            // launchGame();
        }, 2000);
    });

    // Fonction pour lancer le jeu
    function launchGame() {
        console.log("Lancement du jeu...");
        gameModal.style.display = 'block';
        gameModal.style.opacity = '1';

        // Assurez-vous que le canvas et les contrôles sont réinitialisés
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const gameControls = document.getElementById('gameControls');
        gameControls.style.display = 'none';

        // Démarrez le jeu
        startGame();
    }

    // Fonction pour fermer le modal du jeu
    function closeGameModal() {
        gameModal.style.opacity = '0';
        setTimeout(() => {
            gameModal.style.display = 'none';
        }, 300);
    }

    // Ajout d'un gestionnaire d'événements pour le bouton de fermeture du modal du jeu
    document.querySelector('#gameModal .close').addEventListener('click', closeGameModal);

    // Initialisation de l'affichage des bootcamps
    displayBootcamps();

    // Navigation fluide pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownTimer.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        if (distance < 0) {
            countdownTimer.innerHTML = 'Le bootcamp a commencé!';
        }
    }


    // Animation au scroll pour les éléments
    function animateOnScroll() {
        const elements = document.querySelectorAll('.bootcamp-item, .hero-content');
        elements.forEach(elem => {
            const rect = elem.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.75 && rect.bottom >= 0) {
                elem.style.opacity = '1';
                elem.style.transform = 'translateY(0)';
            }
        });
    }

    setInterval(updateCountdown, 1000);
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Appel initial pour les éléments déjà visibles
});

// Fonction globale pour afficher le formulaire d'inscription
// Cette fonction sera appelée depuis le jeu lorsque toutes les étapes seront complétées
window.showInscriptionForm = function () {
    console.log("Affichage du formulaire d'inscription après le jeu");
    const gameModal = document.getElementById('gameModal');
    const inscriptionModal = document.getElementById('bootcampModal');

    // Fermer le modal du jeu
    gameModal.style.opacity = '0';
    setTimeout(() => {
        gameModal.style.display = 'none';
        // Ouvrir le modal d'inscription
        inscriptionModal.style.display = 'block';
        setTimeout(() => {
            inscriptionModal.style.opacity = '1';
        }, 10);
    }, 300);
}