/**
 * St Johns Chapel, Mengo - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileNav();
    initSmoothScroll();
    initScrollAnimations();
    initNavbarScroll();
    initContactForm();
});

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = navToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navLinks.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
        
        // Close mobile menu when clicking on a link
        const navLinksItems = navLinks.querySelectorAll('a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            });
        });
    }
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Scroll Animations (Fade In Effect)
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.card, .event-card, .sermon-card, .ministry-card, .leader-card, .giving-card, .yt-video-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Navbar Background Change on Scroll
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 1)';
                navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }
        });
    }
}

/**
 * Contact Form Handler (using Formspree or EmailJS)
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // If using Formspree, uncomment and modify the following:
            /*
            fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    showFormMessage('There was an error sending your message. Please try again.', 'error');
                }
            }).catch(error => {
                showFormMessage('There was an error sending your message. Please try again.', 'error');
            }).finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
            */
            
            // For demo purposes, simulate form submission
            setTimeout(() => {
                showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
}

/**
 * Show Form Message
 */
function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.cssText = `
        padding: 15px;
        margin-top: 20px;
        border-radius: 5px;
        text-align: center;
        font-weight: 500;
        ${type === 'success' 
            ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' 
            : 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'}
    `;
    messageDiv.textContent = message;
    
    // Insert after form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.parentNode.insertBefore(messageDiv, contactForm.nextSibling);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

/**
 * Active Navigation Link Highlighting
 */
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Call on page load
setActiveNavLink();

/**
 * Image Lazy Loading
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initLazyLoading();

/**
 * Back to Top Button
 */
function initBackToTop() {
    // Create button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '&#8593;';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #1E3A8A;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 20px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // Show/hide on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top on click
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize back to top button
initBackToTop();

/**
 * Sermon Audio Player (Simple Implementation)
 */
function initAudioPlayers() {
    const audioButtons = document.querySelectorAll('.play-audio');
    
    audioButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const audioSrc = this.dataset.audio;
            
            if (audioSrc) {
                // Create or get audio element
                let audioPlayer = document.getElementById('audio-player');
                
                if (!audioPlayer) {
                    audioPlayer = document.createElement('audio');
                    audioPlayer.id = 'audio-player';
                    audioPlayer.style.cssText = `
                        position: fixed;
                        bottom: 80px;
                        left: 20px;
                        right: 20px;
                        width: calc(100% - 40px);
                        max-width: 500px;
                        margin: 0 auto;
                        z-index: 1000;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                        border-radius: 10px;
                    `;
                    document.body.appendChild(audioPlayer);
                }
                
                audioPlayer.src = audioSrc;
                audioPlayer.play();
            }
        });
    });
}

// Initialize audio players
initAudioPlayers();

/**
 * Countdown Timer for Events
 */
function initCountdown() {
    const countdownElements = document.querySelectorAll('.countdown');
    
    countdownElements.forEach(element => {
        const eventDate = new Date(element.dataset.date);
        
        function updateCountdown() {
            const now = new Date();
            const diff = eventDate - now;
            
            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                
                element.innerHTML = `
                    <div class="countdown-item"><span>${days}</span><label>Days</label></div>
                    <div class="countdown-item"><span>${hours}</span><label>Hours</label></div>
                    <div class="countdown-item"><span>${minutes}</span><label>Mins</label></div>
                    <div class="countdown-item"><span>${seconds}</span><label>Secs</label></div>
                `;
            }
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    });
}

// Initialize countdown
initCountdown();