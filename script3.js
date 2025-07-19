// Enhanced skill bars animation with counter effect
const skillBars = document.querySelectorAll('.skill-progress');
const skillPercentages = document.querySelectorAll('.skill-name span:last-child');

const animateSkillBars = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBar = entry.target;
            const skillItem = skillBar.closest('.skill-item');
            const percentageElement = skillItem.querySelector('.skill-name span:last-child');
            const targetPercentage = parseInt(percentageElement.textContent);
            const targetWidth = `${targetPercentage}%`;

            // --- Start of new animation logic ---
            
            // 1. Set the initial state with no transition
            skillBar.style.transition = 'none';
            skillBar.style.width = '0%';

            // 2. Force the browser to recognize the change
            void skillBar.offsetHeight;

            // 3. Now, add the transition and set the final width to start the animation
            skillBar.style.transition = 'width 2s cubic-bezier(0.4, 0, 0.2, 1)';
            skillBar.style.width = targetWidth;

            // --- End of new animation logic ---


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

// Smooth scrolling for navigation links with offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const headerHeight = document.querySelector('nav').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});

// Project cards hover effects with tilt animation
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', function(e) {
        this.style.transform = 'translateY(-10px) rotateX(5deg)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function(e) {
        this.style.transform = 'translateY(0) rotateX(0deg)';
    });
    
    // Add 3D tilt effect based on mouse position
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

// Form validation and interactive feedback
const contactForm = document.querySelector('.contact-form');
const formInputs = document.querySelectorAll('.form-input, .form-textarea');

// Add floating label effect
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
    
    // Real-time validation
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
    
    // Animate button
    submitBtn.textContent = 'Sending...';
    submitBtn.style.background = 'linear-gradient(90deg, var(--neon-green), var(--neon-blue))';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        submitBtn.textContent = '✓ Sent Successfully!';
        submitBtn.style.background = 'var(--neon-green)';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = 'linear-gradient(90deg, var(--neon-blue), var(--neon-pink))';
            submitBtn.disabled = false;
            this.reset();
            
            // Reset label positions
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

// Navbar background change on scroll
let lastScrollTop = 0;
const navbar = document.querySelector('nav');

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
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
    
    lastScrollTop = scrollTop;
});

// Add transition to navbar
navbar.style.transition = 'all 0.3s ease';

// Sequential typewriter effect for the entire hero title
const heroTitle = document.querySelector('.hero h1');
const typewriterDelay = 2000;
const speed = 100; // Typing speed in milliseconds

// A reusable function that types text and returns a promise
const type = (element, text) => {
    return new Promise(resolve => {
        let i = 0;
        function typeChar() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeChar, speed);
            } else {
                resolve(); // Signal that this part is done typing
            }
        }
        typeChar();
    });
};

// The main function to control the typing sequence
const runTypewriterSequence = async () => {
    // This line ensures we start with no text at all
    heroTitle.innerHTML = ''; 

    // 1. Type the first part
    await type(heroTitle, "Hi, I'm ");

    // 2. Create the styled span and type the name into it
    const nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    heroTitle.appendChild(nameSpan);
    await type(nameSpan, "Emma Miller");

    // 3. Add a line break and type the final part
    heroTitle.appendChild(document.createElement('br'));
    await type(heroTitle, "Web Developer");
};

// Start the entire sequence after a delay
setTimeout(runTypewriterSequence, typewriterDelay);

// Add scroll-triggered animations for sections
const sections = document.querySelectorAll('section');
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

// Add particle cursor effect (optional - can be heavy on performance)
let particles = [];
const particleCount = 5;

document.addEventListener('mousemove', function(e) {
    // Throttle particle creation
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