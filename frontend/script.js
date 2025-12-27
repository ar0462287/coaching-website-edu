// ===================================
// Navigation Functionality
// ===================================
function initializeNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links'); // Assuming this exists to show/hide
    if (mobileMenuBtn && navLinksContainer) {
        let mobileMenuOpen = false;
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuOpen = !mobileMenuOpen;
            const spans = mobileMenuBtn.querySelectorAll('span');
            if (mobileMenuOpen) {
                spans[0].style.transform = 'rotate(45deg) translateY(7px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
                navLinksContainer.classList.add('active'); // Toggle active class for mobile nav
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                navLinksContainer.classList.remove('active'); // Toggle active class for mobile nav
            }
        });

        // Close mobile menu when a link is clicked
        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenuOpen) {
                    mobileMenuBtn.click(); // Simulate click to close menu
                }
            });
        });
    }
}

// Original smooth scroll removed as navigation now leads to different pages

// ===================================
// Animation on Scroll (AOS)
// ===================================
function observeElements() {
    const elements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => observer.observe(el));
}

function highlightActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop();

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href');

        if (currentPage === linkPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Initialize AOS when DOM is loaded
// observeElements() is now called in the main DOMContentLoaded listener

// ===================================
// Testimonial Slider
// ===================================
function initializeTestimonialSlider() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');

    if (testimonialCards.length === 0 || !prevBtn || !nextBtn) return; // Exit if elements not found

    let currentTestimonial = 0;
    const totalTestimonials = testimonialCards.length;

    function showTestimonial(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
        showTestimonial(currentTestimonial);
    }

    function prevTestimonial() {
        currentTestimonial = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
        showTestimonial(currentTestimonial);
    }

    nextBtn.addEventListener('click', nextTestimonial);
    prevBtn.addEventListener('click', prevTestimonial);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentTestimonial = index;
            showTestimonial(currentTestimonial);
        });
    });

    let testimonialInterval = setInterval(nextTestimonial, 5000);

    const testimonialSlider = document.querySelector('.testimonials-slider');
    if (testimonialSlider) {
        testimonialSlider.addEventListener('mouseenter', () => {
            clearInterval(testimonialInterval);
        });

        testimonialSlider.addEventListener('mouseleave', () => {
            testimonialInterval = setInterval(nextTestimonial, 5000);
        });
    }

    showTestimonial(currentTestimonial); // Initialize first testimonial
}

// ===================================
// Floating Cards Animation Enhancement
// ===================================
function initializeFloatingCards() {
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.05)';
            card.style.transition = 'all 0.3s ease';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = '';
        });
    });
}

// ===================================
// Course Cards Hover Effects
// ===================================
function initializeCourseCards() {
    const courseCards = document.querySelectorAll('.course-card');
    if (courseCards) {
        courseCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-12px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }
}

// ===================================
// Contact Form Handling
// ===================================
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value,
            };

            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://coaching-website-edu-servers.onrender.com';
                const response = await fetch(`${backendUrl}/api/contact`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();

                if (response.ok) {
                    showNotification(result.message, 'success');
                    contactForm.reset();
                } else {
                    showNotification(result.message || 'Something went wrong.', 'error');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                showNotification('Network error. Please try again later.', 'error');
            }
        });
    }
}

// ===================================
// Notification System
// ===================================
function initializeNotificationSystem() {
    function showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#2d9d92' : '#ff8b7b'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Add notification animations
    if (!document.getElementById('notification-style')) {
        const style = document.createElement('style');
        style.id = 'notification-style';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    window.showNotification = showNotification; // Make it globally accessible
}

// ===================================
// Stats Counter Animation
// ===================================
function animateStats() {
 // Moved inside to be local to this function
    if (statsAnimated) return;
    
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach((stat, index) => {
        const text = stat.textContent;
        const hasPlus = text.includes('+');
        const hasPercent = text.includes('%');
        const number = parseInt(text.replace(/\D/g, ''));
        
        let current = 0;
        const increment = number / 50;
        const duration = 1500;
        const stepTime = duration / 50;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(current);
            
            if (hasPercent) {
                stat.textContent = displayValue + '%';
            } else if (hasPlus) {
                if (displayValue >= 1000) {
                    stat.textContent = (displayValue / 1000).toFixed(0) + 'K+';
                } else {
                    stat.textContent = displayValue + '+';
                }
            } else {
                stat.textContent = displayValue;
            }
        }, stepTime);
    });
    
    statsAnimated = true;
}

function initializeStatsCounterAnimation() {
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }
}

function initializeParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroShapes = document.querySelectorAll('.hero-shape');
        
        heroShapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

function initializeFeatureCardsStaggerAnimation() {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
}

// ===================================
// Enrollment Button Click Tracking
// ===================================
function initializeEnrollmentButtons() {
    const enrollButtons = document.querySelectorAll('.btn-enroll, .enroll-btn, .btn-cta');
    if (enrollButtons) {
        enrollButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                const rect = button.getBoundingClientRect();
                ripple.style.left = (e.clientX - rect.left - 10) + 'px';
                ripple.style.top = (e.clientY - rect.top - 10) + 'px';
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
                console.log('Enrollment button clicked:', button.textContent);
            });
        });

        // Add ripple animation style globally if not already present
        if (!document.getElementById('ripple-style')) {
            const rippleStyle = document.createElement('style');
            rippleStyle.id = 'ripple-style';
            rippleStyle.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(20);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(rippleStyle);
        }
    }
}

// ===================================
// Active Section Highlighting
// ===================================

// ===================================
// Console Welcome Message
// ===================================
console.log('%c Welcome to EduPrime! ', 'background: #2d9d92; color: white; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c Unlock Your Academic Potential ', 'background: #ff8b7b; color: white; font-size: 16px; padding: 5px;');
console.log('Visit us at: www.eduprime.com');

// ===================================
// Initialize Everything
// ===================================
async function includeHTML() {
    let includes = document.querySelectorAll('[data-include]');
    for (var i = 0; i < includes.length; i++) {
        let file = includes[i].getAttribute('data-include');
        let response = await fetch(file);
        if (response.ok) {
            includes[i].innerHTML = await response.text();
        } else {
            console.error('File not found: ' + file);
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await includeHTML();
    console.log('EduPrime website loaded successfully!');
    
    // Add initial animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // Re-initialize event listeners after content is loaded
    initializeNavbarEffects();
    initializeMobileMenu();
    initializeTestimonialSlider();
    initializeFloatingCards();
    initializeCourseCards();
    initializeEnrollmentButtons();
    initializeContactForm();
    initializeNotificationSystem();
    initializeStatsCounterAnimation();
    initializeParallaxEffect();
    initializeFeatureCardsStaggerAnimation();
    observeElements(); // Re-initialize AOS
    highlightActiveNavLink(); // Highlight the active navigation link
});
