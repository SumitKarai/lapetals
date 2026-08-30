/* ============================================
   LA PETALS - Premium Animation Engine
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. SCROLL PROGRESS BAR ──
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.width = '0%';
    document.body.prepend(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // ── 2. BACK TO TOP BUTTON ──
    const backToTop = document.createElement('button');
    backToTop.id = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Scroll to top');
    backToTop.innerHTML = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>`;
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ── 3. SCROLL REVEAL OBSERVER ──
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .section-divider, .img-reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback: just show everything
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    // ── 4. AUTO-APPLY REVEAL CLASSES TO SECTIONS ──
    const autoRevealSections = document.querySelectorAll('main > section, main > div');
    autoRevealSections.forEach(section => {
        // Apply reveal to section headings
        const headings = section.querySelectorAll('h1, h2, h3');
        headings.forEach(h => {
            if (!h.classList.contains('reveal') && !h.closest('.reveal')) {
                h.classList.add('reveal');
            }
        });

        // Apply reveal to paragraphs
        const paragraphs = section.querySelectorAll('p');
        paragraphs.forEach((p, i) => {
            if (!p.classList.contains('reveal') && !p.closest('.reveal')) {
                p.classList.add('reveal');
                p.classList.add('delay-' + Math.min(i + 1, 3));
            }
        });

        // Apply reveal-scale to grid cards
        const gridCards = section.querySelectorAll('.grid > div');
        gridCards.forEach((card, i) => {
            if (!card.classList.contains('reveal-scale') && !card.closest('.reveal-scale')) {
                card.classList.add('reveal-scale');
                card.classList.add('delay-' + Math.min(i + 1, 6));
            }
        });
    });

    // Re-observe newly added elements
    const newRevealElements = document.querySelectorAll('.reveal:not(.revealed), .reveal-left:not(.revealed), .reveal-right:not(.revealed), .reveal-scale:not(.revealed)');
    if ('IntersectionObserver' in window) {
        const revealObserver2 = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver2.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });
        newRevealElements.forEach(el => revealObserver2.observe(el));
    }

    // ── 5. HERO TEXT SHIMMER ──
    const heroTitle = document.querySelector('section:first-of-type h1');
    if (heroTitle) {
        // Find the "Premium Ayurvedic Medicine" or main gold text
        const goldSpans = heroTitle.querySelectorAll('span');
        if (goldSpans.length === 0) {
            // If the entire h1 text is gold-colored, apply shimmer to it
            if (heroTitle.classList.contains('text-gold')) {
                heroTitle.classList.add('text-shimmer');
            }
        }
    }

    // ── 6. COUNTER ANIMATION ──
    function animateCounter(el, target, suffix = '') {
        const duration = 2000;
        const startTime = performance.now();
        const isDecimal = String(target).includes('.');

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(ease * target);
            el.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target + suffix;
            }
        }
        requestAnimationFrame(update);
    }

    // Auto-detect counter elements (stats with numbers)
    const statElements = document.querySelectorAll('[class*="text-3xl"][class*="font-bold"], [class*="text-4xl"][class*="font-bold"]');
    statElements.forEach(el => {
        const text = el.textContent.trim();
        const match = text.match(/^(\d+)\+?$/);
        if (match) {
            const target = parseInt(match[1]);
            const suffix = text.includes('+') ? '+' : '';
            el.textContent = '0' + suffix;
            el.classList.add('counter-value');

            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(el, target, suffix);
                        counterObserver.unobserve(el);
                    }
                });
            }, { threshold: 0.5 });
            counterObserver.observe(el);
        }
    });

    // ── 7. MAGNETIC HOVER EFFECT ON CARDS ──
    const magneticCards = document.querySelectorAll('.hover\\:shadow-xl, .hover\\:shadow-2xl, .hover\\:shadow-md');
    magneticCards.forEach(card => {
        card.classList.add('magnetic-card', 'glow-card');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;

            card.style.transform = `perspective(800px) rotateY(${deltaX * 3}deg) rotateX(${-deltaY * 3}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ── 8. BUTTON RIPPLE EFFECTS ──
    const buttons = document.querySelectorAll('a[class*="bg-gold"], a[class*="bg-emeraldDark"], button[class*="bg-emeraldDark"]');
    buttons.forEach(btn => {
        btn.classList.add('btn-ripple');
    });

    // ── 9. FLOATING GOLD PETALS (Subtle, Decorative) ──
    function createPetal() {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        petal.innerHTML = '✿';
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.fontSize = (10 + Math.random() * 14) + 'px';
        petal.style.color = `rgba(212, 175, 55, ${0.15 + Math.random() * 0.2})`;
        petal.style.animationDuration = (12 + Math.random() * 18) + 's';
        petal.style.animationDelay = Math.random() * 5 + 's';
        document.body.appendChild(petal);

        // Remove after animation completes
        setTimeout(() => {
            petal.remove();
        }, 35000);
    }

    // Only create petals on non-mobile devices for performance
    if (window.innerWidth > 768) {
        // Create a batch initially
        for (let i = 0; i < 4; i++) {
            setTimeout(createPetal, i * 3000);
        }
        // Then periodically add more
        setInterval(() => {
            if (document.querySelectorAll('.petal').length < 6) {
                createPetal();
            }
        }, 6000);
    }

    // ── 10. PARALLAX EFFECT ON HERO BACKGROUNDS ──
    const heroSection = document.querySelector('section:first-of-type');
    if (heroSection) {
        const bgOverlay = heroSection.querySelector('.absolute');
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroHeight = heroSection.offsetHeight;
            if (scrollY < heroHeight) {
                heroSection.style.backgroundPositionY = (scrollY * 0.3) + 'px';
            }
        });
    }

    // ── 11. SMOOTH IMAGE LOADING WITH FADE ──
    const images = document.querySelectorAll('img:not([src*="logo"])');
    images.forEach(img => {
        if (img.complete) return;
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.6s ease';
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
    });

    // ── 12. TESTIMONIAL CARDS LIFT EFFECT ──
    const testimonialCards = document.querySelectorAll('.grid .relative, .shadow-md');
    testimonialCards.forEach(card => {
        if (card.closest('section') && card.querySelector('.italic')) {
            card.classList.add('testimonial-lift');
        }
    });

    // ── 13. GOLD UNDERLINE ON FOOTER & NAV LINKS ──
    const footerLinks = document.querySelectorAll('footer a:not([class*="flex"])');
    footerLinks.forEach(link => {
        link.classList.add('gold-underline');
    });

    // ── 14. ANIMATED HEADER ON SCROLL ──
    const header = document.querySelector('header');
    let lastScrollY = 0;

    if (header) {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 100) {
                header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.15), 0 0 15px rgba(212,175,55,0.1)';
                header.style.backdropFilter = 'blur(16px)';
            } else {
                header.style.boxShadow = '';
                header.style.backdropFilter = '';
            }

            lastScrollY = currentScrollY;
        });
    }

    // ── 15. CURSOR TRAIL EFFECT (Subtle Gold Dots) ──
    if (window.innerWidth > 1024) {
        let trailTimeout;
        document.addEventListener('mousemove', (e) => {
            if (trailTimeout) return;
            trailTimeout = setTimeout(() => { trailTimeout = null; }, 80);

            const dot = document.createElement('div');
            dot.style.cssText = `
                position: fixed;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                width: 6px;
                height: 6px;
                background: radial-gradient(circle, rgba(212,175,55,0.5), transparent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                transition: opacity 0.8s ease, transform 0.8s ease;
            `;
            document.body.appendChild(dot);

            requestAnimationFrame(() => {
                dot.style.opacity = '0';
                dot.style.transform = 'scale(3)';
            });

            setTimeout(() => dot.remove(), 800);
        });
    }

    // ── 16. STAGGERED PRODUCT CARD ENTRANCE ──
    const productCards = document.querySelectorAll('.flex.flex-col.md\\:flex-row');
    productCards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.15}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.15}s`;

        const productObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    productObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        productObserver.observe(card);
    });

    // ── 17. TYPING EFFECT FOR TAGLINES ──  
    const taglines = document.querySelectorAll('section:first-of-type span[class*="tracking-widest"]');
    if (taglines.length > 0) {
        const tagline = taglines[0];
        const originalText = tagline.textContent;
        tagline.textContent = '';
        tagline.classList.add('typewriter-cursor');
        
        let charIndex = 0;
        function typeChar() {
            if (charIndex < originalText.length) {
                tagline.textContent += originalText[charIndex];
                charIndex++;
                setTimeout(typeChar, 50 + Math.random() * 40);
            } else {
                // Remove cursor after typing
                setTimeout(() => {
                    tagline.classList.remove('typewriter-cursor');
                }, 1500);
            }
        }
        // Start typing after a short delay
        setTimeout(typeChar, 600);
    }

    // ── 18. FAQ SMOOTH ACCORDION ENHANCEMENT ──
    const details = document.querySelectorAll('details');
    details.forEach(detail => {
        detail.addEventListener('toggle', () => {
            if (detail.open) {
                const content = detail.querySelector('p');
                if (content) {
                    content.style.opacity = '0';
                    content.style.transform = 'translateY(-8px)';
                    requestAnimationFrame(() => {
                        content.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        content.style.opacity = '1';
                        content.style.transform = 'translateY(0)';
                    });
                }
            }
        });
    });

    console.log('✨ La Petals Animation Engine loaded successfully');
});
