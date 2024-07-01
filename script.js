// script.js
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const bootcampsList = document.getElementById('bootcampsList');
    const modal = document.getElementById('bootcampModal');
    const closeBtn = document.querySelector('.close');
    const inscriptionForm = document.getElementById('inscriptionForm');

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

        // Animation au survol des bootcamps
        document.querySelectorAll('.bootcamp-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'scale(1.05)';
                item.style.transition = 'transform 0.3s ease';
            });
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'scale(1)';
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

        // Animation d'ouverture du modal
        modal.style.display = 'block';
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);

        // Réinitialisation du formulaire
        inscriptionForm.reset();
        inscriptionForm.querySelector('input[name="bootcampId"]').value = bootcampId;
    }

    // Fermeture du modal
    function closeModal() {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    closeBtn.onclick = closeModal;

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }

    // Gestion du formulaire d'inscription
    inscriptionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(inscriptionForm);
        const data = Object.fromEntries(formData);
        
        // Simulation d'envoi des données (à remplacer par un vrai appel API)
        console.log('Données d\'inscription:', data);
        
        // Animation de confirmation
        const submitButton = inscriptionForm.querySelector('button[type="submit"]');
        submitButton.textContent = 'Inscription réussie !';
        submitButton.style.backgroundColor = '#4CAF50';
        
        setTimeout(() => {
            closeModal();
            submitButton.textContent = 'Rejoindre l\'aventure';
            submitButton.style.backgroundColor = '';
        }, 2000);
    });

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

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Appel initial pour les éléments déjà visibles
});