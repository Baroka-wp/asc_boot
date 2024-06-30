// script.js
document.addEventListener('DOMContentLoaded', (event) => {
    const modal = document.getElementById('modal');
    const closeBtns = document.getElementsByClassName('close');
    const bootcampBtns = document.querySelectorAll('.bootcamp-cta');
    const registrationForm = document.getElementById('registrationForm');

    const modalContent = {
        math: {
            title: "Bootcamp Mathématiques et Ingénierie",
            content: "Ce bootcamp intensif vous permettra de renforcer vos compétences en mathématiques appliquées, d'explorer les principes fondamentaux de l'ingénierie et de développer votre pensée analytique. Vous travaillerez sur des projets pratiques inspirés par l'approche afro-japonaise de l'innovation technologique.",
            image: "math.webp"
        },
        culture: {
            title: "Bootcamp Langue et Culture Japonaise",
            content: "Immergez-vous dans la langue et la culture japonaise ! Vous apprendrez les bases de la conversation en japonais, vous initierez à l'écriture (hiragana, katakana, kanji), et découvrirez en profondeur les traditions, l'étiquette et les arts japonais. Ce bootcamp vise à développer vos compétences linguistiques et interculturelles.",
            image: "culture.webp"
        },
        art: {
            title: "Bootcamp Dessin et Arts Visuels",
            content: "Développez vos talents artistiques en explorant les techniques de dessin africaines et japonaises. Vous apprendrez les bases du dessin, découvrirez les styles artistiques traditionnels et contemporains des deux cultures, et créerez votre propre style en fusionnant ces influences. À la fin du bootcamp, vous aurez un portfolio reflétant votre progression et votre créativité.",
            image: "dessin.webp"
        }
    };

    function showModal(type) {
        const title = document.getElementById('modalTitle');
        const content = document.getElementById('modalContent');
        const image = document.getElementById('modalImage');
        const bootcampType = document.getElementById('bootcampType');

        title.textContent = modalContent[type].title;
        content.textContent = modalContent[type].content;
        image.src = modalContent[type].image;
        image.alt = modalContent[type].title;
        bootcampType.value = type;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    bootcampBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const bootcampType = btn.getAttribute('data-bootcamp');
            showModal(bootcampType);
        });
    });

    for (let i = 0; i < closeBtns.length; i++) {
        closeBtns[i].addEventListener('click', closeModal);
    }

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(registrationForm);
        const data = Object.fromEntries(formData);
        
        // Ici, vous pouvez ajouter le code pour envoyer les données à votre serveur
        console.log("Données du formulaire :", data);
        
        // Simulation d'une soumission réussie
        alert("Merci pour votre inscription ! Nous vous contacterons bientôt.");
        closeModal();
        registrationForm.reset();
    });

    // Fonction pour gérer le scroll smooth
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
        const elements = document.querySelectorAll('.bootcamp-item, .partner-logos img');
        elements.forEach(elem => {
            const rect = elem.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            if (rect.top <= windowHeight * 0.75) {
                elem.classList.add('animate');
            }
        });
    }

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Appel initial pour les éléments déjà visibles
});