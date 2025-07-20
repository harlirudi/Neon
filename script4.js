/* ========================================
   DOM ELEMENT SELECTIONS
   ======================================== */
const skillBars = document.querySelectorAll('.skill-progress');
const skillPercentages = document.querySelectorAll('.skill-name span:last-child');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.querySelector('.contact-form');
const formInputs = document.querySelectorAll('.form-input, .form-textarea');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('nav');
const links = document.querySelectorAll('.nav-links a');
const heroTitle = document.querySelector('.hero h1');
const sections = document.querySelectorAll('section');

/* ========================================
   NAVIGATION & SCROLL BEHAVIOR
   ======================================== */

// Hamburger Menu Logic
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
});

// Close menu when a link is clicked
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.classList.remove('no-scroll'); 
    });
});

// Enhanced Scroll Event Logic - STEP 2 PLACED HERE
let lastScrollTop = 0;
navbar.style.transition = 'all 0.3s ease';

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // CRITICAL: Only apply scroll animations when mobile menu is NOT active
    if (!navLinks.classList.contains('active')) {
        // Background changes
        if (scrollTop > 100) {
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.8)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
    } else {
        // When mobile menu is active, ensure navbar stays visible and has solid background
        navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.transform = 'translateY(0)'; // Always keep it visible
    }
    
    lastScrollTop = scrollTop;
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const headerHeight = navbar.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});

/* ========================================
   ANIMATIONS & EFFECTS
   ======================================== */

// Enhanced skill bars animation with counter effect
const animateSkillBars = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBar = entry.target;
            const skillItem = skillBar.closest('.skill-item');
            const percentageElement = skillItem.querySelector('.skill-name span:last-child');
            const targetPercentage = parseInt(percentageElement.textContent);
            const targetWidth = `${targetPercentage}%`;

            // Set initial state with no transition
            skillBar.style.transition = 'none';
            skillBar.style.width = '0%';
            void skillBar.offsetHeight; // Force reflow

            // Add transition and animate to final width
            skillBar.style.transition = 'width 2s cubic-bezier(0.4, 0, 0.2, 1)';
            skillBar.style.width = targetWidth;

            // Animate percentage counter
            let currentPercentage = 0;
            const increment = targetPercentage / 100;

            const countAnimation = setInterval(() => {
                currentPercentage += increment;
                if (currentPercentage >= targetPercentage) {
                    currentPercentage = targetPercentage;
                    clearInterval(countAnimation);
                }
                percentageElement.textContent = Math.round(currentPercentage) + '%';
            }, 20);

            // Add pulse effect when animation completes
            setTimeout(() => {
                skillBar.style.boxShadow = '0 0 15px var(--neon-blue)';
                setTimeout(() => {
                    skillBar.style.boxShadow = 'none';
                }, 500);
            }, 2100);

            observer.unobserve(entry.target);
        }
    });
};

const skillObserver = new IntersectionObserver(animateSkillBars, {
    threshold: 0.5,
    rootMargin: '0px'
});

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// Project cards hover effects
projectCards.forEach(card => {
    card.addEventListener('mouseenter', function(e) {
        this.style.transform = 'translateY(-10px) rotateX(5deg)';
        this.style.transition = 'transform 0.3s ease';
    });

    card.addEventListener('mouseleave', function(e) {
        this.style.transform = 'translateY(0) rotateX(0deg)';
    });

    // 3D tilt effect based on mouse position
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const rotateX = (mouseY - centerY) / 10;
        const rotateY = (centerX - mouseX) / 10;

        this.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
});

/* ========================================
   FORM HANDLING
   ======================================== */

// Form validation and interactive feedback
formInputs.forEach(input => {
    const label = input.previousElementSibling;

    input.addEventListener('focus', function() {
        label.style.color = 'var(--neon-blue)';
        label.style.transform = 'translateY(-5px)';
        label.style.fontSize = '0.9rem';
        this.style.borderColor = 'var(--neon-blue)';
    });

    input.addEventListener('blur', function() {
        if (!this.value) {
            label.style.color = '#ccc';
            label.style.transform = 'translateY(0)';
            label.style.fontSize = '1rem';
        }
        this.style.borderColor = '#333';
    });

    input.addEventListener('input', function() {
        validateField(this);
    });
});

function validateField(field) {
    const value = field.value.trim();
    let isValid = false;

    switch(field.type) {
        case 'email':
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            break;
        case 'text':
        case 'textarea':
            isValid = value.length > 0;
            break;
        default:
            isValid = value.length > 0;
    }

    if (isValid) {
        field.style.borderColor = 'var(--neon-green)';
        field.style.boxShadow = '0 0 5px rgba(128, 255, 219, 0.3)';
    } else if (value.length > 0) {
        field.style.borderColor = '#ff6b6b';
        field.style.boxShadow = '0 0 5px rgba(255, 107, 107, 0.3)';
    } else {
        field.style.borderColor = '#333';
        field.style.boxShadow = 'none';
    }
}

// Form submission with success animation
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Sending...';
    submitBtn.style.background = 'linear-gradient(90deg, var(--neon-green), var(--neon-blue))';
    submitBtn.disabled = true;

    setTimeout(() => {
        submitBtn.textContent = '✓ Sent Successfully!';
        submitBtn.style.background = 'var(--neon-green)';

        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = 'linear-gradient(90deg, var(--neon-blue), var(--neon-pink))';
            submitBtn.disabled = false;
            this.reset();

            formInputs.forEach(input => {
                const label = input.previousElementSibling;
                label.style.color = '#ccc';
                label.style.transform = 'translateY(0)';
                label.style.fontSize = '1rem';
                input.style.borderColor = '#333';
                input.style.boxShadow = 'none';
            });
        }, 2000);
    }, 1500);
});

/* ========================================
   TYPEWRITER EFFECT
   ======================================== */

const typewriterDelay = 2000;
const speed = 100;

const type = (element, text) => {
    return new Promise(resolve => {
        let i = 0;
        function typeChar() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeChar, speed);
            } else {
                resolve();
            }
        }
        typeChar();
    });
};

const runTypewriterSequence = async () => {
    heroTitle.innerHTML = ''; 

    await type(heroTitle, "Hi, I'm ");

    const nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    heroTitle.appendChild(nameSpan);
    await type(nameSpan, "Emma Miller");

    heroTitle.appendChild(document.createElement('br'));
    await type(heroTitle, "Web Developer");
};

setTimeout(runTypewriterSequence, typewriterDelay);

/* ========================================
   SECTION ANIMATIONS
   ======================================== */

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    sectionObserver.observe(section);
});

// Don't animate hero section
document.querySelector('.hero').style.opacity = '1';
document.querySelector('.hero').style.transform = 'translateY(0)';

/* ========================================
   PARTICLE EFFECTS
   ======================================== */

document.addEventListener('mousemove', function(e) {
    if (Math.random() > 0.8) {
        createParticle(e.clientX, e.clientY);
    }
});

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'cursor-particle';
    particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: var(--neon-blue);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: particleFade 1s ease-out forwards;
    `;

    document.body.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 1000);
}

// Add CSS for particle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);