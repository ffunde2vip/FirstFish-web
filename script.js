// Firebase App (client-side)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore, collection, getDocs, query, where, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyC4Q3JNkzU0tH0-pRYQr85ufBTotw63imo",
    authDomain: "firstfish-e78c0.firebaseapp.com",
    projectId: "firstfish-e78c0",
    storageBucket: "firstfish-e78c0.firebasestorage.app",
    messagingSenderId: "348899039694",
    appId: "1:348899039694:web:171d8cee5a4b0de7d7b39f",
    measurementId: "G-H8V1QCW9E8"
};

let db = null;
let auth = null;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log('Firebase initialized');
} catch (e) {
    console.warn('Firebase not initialized. Set firebaseConfig.', e);
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded, initializing scripts...');
    
    // Optional quick login via URL: ?login=1
    try {
        const params = new URLSearchParams(window.location.search);
        if (auth && params.get('login') === '1') {
            const email = window.prompt('Email администратора:');
            const password = window.prompt('Пароль:');
            if (email && password) {
                await signInWithEmailAndPassword(auth, email, password);
            }
        }
    } catch (_) {}

    // Seed default content once after admin signs in
    async function isAdmin(uid) {
        try {
            const adminSnap = await getDoc(doc(db, 'admins', uid));
            return adminSnap.exists();
        } catch (_) { return false; }
    }

    async function seedDataIfNeeded(currentUser) {
        if (!db || !currentUser) return;
        const metaRef = doc(db, 'meta', 'seed_v1');
        const metaSnap = await getDoc(metaRef);
        if (metaSnap.exists()) return; // already seeded
        const uid = currentUser.uid;
        if (!(await isAdmin(uid))) return;

        const writes = [];
        // promotions
        writes.push(setDoc(doc(db, 'promotions', 'promo1'), {
            title: 'Скидка на крафтовое пиво',
            description: 'Все крафтовые сорта пива со скидкой 20% до конца недели',
            badge: '-20%',
            dateLabel: 'До 31 декабря',
            published: true
        }));
        writes.push(setDoc(doc(db, 'promotions', 'promo2'), {
            title: 'Три по цене двух',
            description: 'При покупке двух бутылок пива третья в подарок',
            badge: '2+1',
            dateLabel: 'Постоянно',
            published: true
        }));
        writes.push(setDoc(doc(db, 'promotions', 'promo3'), {
            title: 'Новые сорта пива',
            description: 'Попробуйте новые эксклюзивные сорта от лучших пивоварен',
            badge: 'Новинка',
            dateLabel: 'Новинка',
            published: true
        }));

        // beers
        writes.push(setDoc(doc(db, 'beers', 'beer1'), {
            title: 'IPA Крафт',
            description: 'Крепкое крафтовое пиво с хмелевым вкусом',
            price: 350,
            category: 'craft',
            imageUrl: 'https://via.placeholder.com/300x400/1e40af/ffffff?text=Крафт+Пиво',
            published: true
        }));
        writes.push(setDoc(doc(db, 'beers', 'beer2'), {
            title: 'Heineken',
            description: 'Классическое голландское пиво',
            price: 280,
            category: 'import',
            imageUrl: 'https://via.placeholder.com/300x400/1e40af/ffffff?text=Импорт+Пиво',
            published: true
        }));
        writes.push(setDoc(doc(db, 'beers', 'beer3'), {
            title: 'Балтика',
            description: 'Популярное российское пиво',
            price: 220,
            category: 'local',
            imageUrl: 'https://via.placeholder.com/300x400/1e40af/ffffff?text=Местное+Пиво',
            published: true
        }));

        // vacancies
        writes.push(setDoc(doc(db, 'vacancies', 'vac1'), {
            title: 'Продавец-консультант',
            salary: 'от 45 000₽',
            employment: 'Полная занятость',
            schedule: 'График 5/2',
            experience: 'Опыт от 1 года',
            published: true
        }));
        writes.push(setDoc(doc(db, 'vacancies', 'vac2'), {
            title: 'Менеджер по закупкам',
            salary: 'от 60 000₽',
            employment: 'Полная занятость',
            schedule: 'График 5/2',
            experience: 'Опыт от 3 лет',
            published: true
        }));
        writes.push(setDoc(doc(db, 'vacancies', 'vac3'), {
            title: 'Грузчик',
            salary: 'от 35 000₽',
            employment: 'Полная занятость',
            schedule: 'График 5/2',
            experience: 'Без опыта',
            published: true
        }));

        // stores
        writes.push(setDoc(doc(db, 'stores', 'store1'), {
            title: 'Первый Рыбный - Центр',
            address: 'ул. Ленина, 15, Москва',
            phone: '+7 (495) 123-45-67',
            hours: 'Пн-Вс: 09:00 - 23:00',
            published: true
        }));
        writes.push(setDoc(doc(db, 'stores', 'store2'), {
            title: 'Первый Рыбный - Север',
            address: 'ул. Мира, 42, Москва',
            phone: '+7 (495) 234-56-78',
            hours: 'Пн-Вс: 10:00 - 22:00',
            published: true
        }));
        writes.push(setDoc(doc(db, 'stores', 'store3'), {
            title: 'Первый Рыбный - Юг',
            address: 'ул. Пушкина, 8, Москва',
            phone: '+7 (495) 345-67-89',
            hours: 'Пн-Вс: 08:00 - 24:00',
            published: true
        }));

        await Promise.all(writes);
        await setDoc(metaRef, { seededAt: Date.now(), by: uid });
        console.log('Default content seeded');
    }

    if (auth) {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                seedDataIfNeeded(user).catch(console.error);
            }
        });
    }
    
    // Helper to safely set text
    const setText = (el, text) => {
        el.textContent = typeof text === 'string' ? text : '';
    };
    
    // Load content from Firestore
    async function loadContentFromFirestore() {
        if (!db) {
            console.warn('Skipping Firestore load: db not initialized');
            return;
        }
        await Promise.all([
            loadPromotions(),
            loadBeers(),
            loadVacancies(),
            loadStores()
        ]).catch(err => console.error('Firestore load error:', err));
        
        // Rebind handlers for newly inserted elements
        bindImageErrorHandlers();
        bindVacancyButtons();
        bindStoreActionButtons();
        initBeerFilter();
        updateStoreStatus();
    }
    
    async function getPublishedDocs(colName) {
        const colRef = collection(db, colName);
        const q = query(colRef, where('published', '==', true));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    
    async function loadPromotions() {
        const container = document.querySelector('.promotions-grid');
        if (!container) return;
        try {
            const docs = await getPublishedDocs('promotions');
            if (!docs.length) return;
            container.innerHTML = '';
            docs.forEach(doc => {
                const card = document.createElement('div');
                card.className = 'promotion-card';
                
                const badge = document.createElement('div');
                badge.className = 'promotion-badge';
                setText(badge, doc.badge || 'Акция');
                
                const h3 = document.createElement('h3');
                setText(h3, doc.title || 'Промо');
                
                const p = document.createElement('p');
                setText(p, doc.description || '');
                
                const span = document.createElement('span');
                span.className = 'promotion-date';
                setText(span, doc.dateLabel || '');
                
                card.appendChild(badge);
                card.appendChild(h3);
                card.appendChild(p);
                card.appendChild(span);
                container.appendChild(card);
            });
        } catch (e) {
            console.error('Failed to load promotions:', e);
        }
    }
    
    async function loadBeers() {
        const container = document.querySelector('.beer-grid');
        if (!container) return;
        try {
            const docs = await getPublishedDocs('beers');
            if (!docs.length) return;
            container.innerHTML = '';
            docs.forEach(doc => {
                const card = document.createElement('div');
                card.className = 'beer-card';
                card.setAttribute('data-category', (doc.category || 'all').toLowerCase());
                
                const imageWrap = document.createElement('div');
                imageWrap.className = 'beer-image';
                const img = document.createElement('img');
                img.alt = doc.title || 'Пиво';
                img.src = (typeof doc.imageUrl === 'string' && doc.imageUrl) ? doc.imageUrl : 'https://via.placeholder.com/300x400/1e40af/ffffff?text=Пиво';
                imageWrap.appendChild(img);
                
                const info = document.createElement('div');
                info.className = 'beer-info';
                const h3 = document.createElement('h3');
                setText(h3, doc.title || 'Пиво');
                const p = document.createElement('p');
                setText(p, doc.description || '');
                const price = document.createElement('span');
                price.className = 'beer-price';
                setText(price, typeof doc.price === 'number' ? `${doc.price}₽` : (doc.price || ''));
                
                info.appendChild(h3);
                info.appendChild(p);
                info.appendChild(price);
                
                card.appendChild(imageWrap);
                card.appendChild(info);
                container.appendChild(card);
            });
        } catch (e) {
            console.error('Failed to load beers:', e);
        }
    }
    
    async function loadVacancies() {
        const container = document.querySelector('.vacancies-grid');
        if (!container) return;
        try {
            const docs = await getPublishedDocs('vacancies');
            if (!docs.length) return;
            container.innerHTML = '';
            docs.forEach(doc => {
                const card = document.createElement('div');
                card.className = 'vacancy-card';
                
                const header = document.createElement('div');
                header.className = 'vacancy-header';
                const h3 = document.createElement('h3');
                setText(h3, doc.title || 'Вакансия');
                const salary = document.createElement('span');
                salary.className = 'salary';
                setText(salary, doc.salary || '');
                header.appendChild(h3);
                header.appendChild(salary);
                
                const details = document.createElement('div');
                details.className = 'vacancy-details';
                const detailItems = [doc.employment, doc.schedule, doc.experience].filter(Boolean);
                detailItems.forEach(text => {
                    const p = document.createElement('p');
                    const i = document.createElement('i');
                    i.className = 'fas fa-circle';
                    p.appendChild(i);
                    const span = document.createElement('span');
                    setText(span, ` ${text}`);
                    p.appendChild(span);
                    details.appendChild(p);
                });
                
                const button = document.createElement('button');
                button.className = 'btn btn-primary';
                setText(button, 'Откликнуться');
                
                card.appendChild(header);
                card.appendChild(details);
                card.appendChild(button);
                container.appendChild(card);
            });
        } catch (e) {
            console.error('Failed to load vacancies:', e);
        }
    }
    
    async function loadStores() {
        const container = document.querySelector('.stores-grid');
        if (!container) return;
        try {
            const docs = await getPublishedDocs('stores');
            if (!docs.length) return;
            container.innerHTML = '';
            docs.forEach(doc => {
                const card = document.createElement('div');
                card.className = 'store-card';
                
                const header = document.createElement('div');
                header.className = 'store-header';
                const h3 = document.createElement('h3');
                setText(h3, doc.title || 'Магазин');
                const status = document.createElement('span');
                status.className = 'store-status closed';
                setText(status, 'Закрыто');
                header.appendChild(h3);
                header.appendChild(status);
                
                const info = document.createElement('div');
                info.className = 'store-info';
                if (doc.address) {
                    const p = document.createElement('p');
                    const i = document.createElement('i'); i.className = 'fas fa-map-marker-alt';
                    const span = document.createElement('span'); setText(span, ` ${doc.address}`);
                    p.appendChild(i); p.appendChild(span); info.appendChild(p);
                }
                if (doc.phone) {
                    const p = document.createElement('p');
                    const i = document.createElement('i'); i.className = 'fas fa-phone';
                    const span = document.createElement('span'); setText(span, ` ${doc.phone}`);
                    p.appendChild(i); p.appendChild(span); info.appendChild(p);
                }
                if (doc.hours) {
                    const p = document.createElement('p');
                    const i = document.createElement('i'); i.className = 'fas fa-clock';
                    const span = document.createElement('span'); setText(span, ` ${doc.hours}`);
                    p.appendChild(i); p.appendChild(span); info.appendChild(p);
                }
                
                const actions = document.createElement('div');
                actions.className = 'store-actions';
                const btn = document.createElement('button');
                btn.className = 'btn btn-secondary';
                setText(btn, 'Показать на карте');
                actions.appendChild(btn);
                
                card.appendChild(header);
                card.appendChild(info);
                card.appendChild(actions);
                container.appendChild(card);
            });
        } catch (e) {
            console.error('Failed to load stores:', e);
        }
    }
    
    // Handle image loading errors
    function handleImageError(img) {
        if (img.classList.contains('logo')) {
            // For logo in header
            const logoText = img.nextElementSibling;
            if (logoText) {
                img.style.display = 'none';
                logoText.style.display = 'block';
            }
        } else if (img.classList.contains('hero-logo')) {
            // For hero logo
            img.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'hero-logo-placeholder';
            placeholder.innerHTML = '🍺';
            img.parentElement.appendChild(placeholder);
        }
    }

    function bindImageErrorHandlers() {
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', () => handleImageError(img));
        });
    }
    bindImageErrorHandlers();
    
    // Mobile menu functionality with improved touch handling
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        // Use both click and touch events for better mobile support
        const toggleMenu = () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        };

        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('touchend', (e) => {
            e.preventDefault();
            toggleMenu();
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(n => {
            const closeMenu = () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            };
            
            n.addEventListener('click', closeMenu);
            n.addEventListener('touchend', (e) => {
                e.preventDefault();
                closeMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Beer category filtering with touch support (rebinding-safe)
    function initBeerFilter() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const getBeerCards = () => document.querySelectorAll('.beer-card');
        if (tabBtns.length === 0) return;
        tabBtns.forEach(btn => {
            const handleTabClick = () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.getAttribute('data-category');
                getBeerCards().forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeInUp 0.6s ease-out';
                    } else {
                        card.style.display = 'none';
                    }
                });
            };
            btn.addEventListener('click', handleTabClick);
            btn.addEventListener('touchend', (e) => { e.preventDefault(); handleTabClick(); });
        });
    }
    initBeerFilter();

    // Smooth scrolling for navigation links with better mobile support
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        const handleScroll = function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        };

        anchor.addEventListener('click', handleScroll);
        anchor.addEventListener('touchend', (e) => {
            e.preventDefault();
            handleScroll.call(anchor, e);
        });
    });

    // Header background change on scroll with throttling
    const header = document.querySelector('.header');
    if (header) {
        let ticking = false;
        
        const updateHeader = () => {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(30, 64, 175, 0.98)';
            } else {
                header.style.background = 'rgba(30, 64, 175, 0.95)';
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
    }

    // Intersection Observer for animations with better performance
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

    // Observe all cards for animation
    document.querySelectorAll('.promotion-card, .beer-card, .vacancy-card, .store-card').forEach(card => {
        // Simplified animation - show cards immediately
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        // observer.observe(card);
    });

    // Store status update based on current time
    function updateStoreStatus() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        const storeCards = document.querySelectorAll('.store-card');
        
        storeCards.forEach(card => {
            const statusElement = card.querySelector('.store-status');
            if (statusElement) {
                const storeName = card.querySelector('h3').textContent;
                
                // Define store hours (example)
                let isOpen = false;
                
                if (storeName.includes('Центр')) {
                    // Центр: 09:00 - 23:00, 7 days
                    isOpen = currentHour >= 9 && currentHour < 23;
                } else if (storeName.includes('Север')) {
                    // Север: 10:00 - 22:00, 7 days
                    isOpen = currentHour >= 10 && currentHour < 22;
                } else if (storeName.includes('Юг')) {
                    // Юг: 08:00 - 24:00, 7 days
                    isOpen = currentHour >= 8 && currentHour < 24;
                }
                
                if (isOpen) {
                    statusElement.textContent = 'Открыто';
                    statusElement.className = 'store-status open';
                } else {
                    statusElement.textContent = 'Закрыто';
                    statusElement.className = 'store-status closed';
                }
            }
        });
    }

    // Update store status every minute
    updateStoreStatus();
    setInterval(updateStoreStatus, 60000);

    // Button click effects with touch support
    document.querySelectorAll('.btn').forEach(btn => {
        const handleButtonClick = function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = (e.clientX || e.touches[0].clientX) - rect.left - size / 2;
            const y = (e.clientY || e.touches[0].clientY) - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        };

        btn.addEventListener('click', handleButtonClick);
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleButtonClick(e);
        });
    });

    // Add ripple effect CSS
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Form validation for vacancy applications with touch support (rebinding-safe)
    function bindVacancyButtons() {
        document.querySelectorAll('.vacancy-card .btn').forEach(btn => {
            const handleVacancyClick = function() {
                const vacancyCard = this.closest('.vacancy-card');
                if (vacancyCard) {
                    const vacancyTitle = vacancyCard.querySelector('h3').textContent;
                    alert(`Спасибо за интерес к вакансии "${vacancyTitle}"! Мы свяжемся с вами в ближайшее время.`);
                }
            };
            btn.addEventListener('click', handleVacancyClick);
            btn.addEventListener('touchend', (e) => { e.preventDefault(); handleVacancyClick.call(btn); });
        });
    }
    bindVacancyButtons();

    // Store map button functionality with touch support (rebinding-safe)
    function bindStoreActionButtons() {
        document.querySelectorAll('.store-actions .btn').forEach(btn => {
            const handleMapClick = function() {
                const storeCard = this.closest('.store-card');
                if (storeCard) {
                    const storeName = storeCard.querySelector('h3').textContent;
                    const addressElement = storeCard.querySelector('.store-info p:first-child');
                    const address = addressElement ? addressElement.textContent.replace('📍 ', '') : '';
                    alert(`Показать на карте: ${storeName}\nАдрес: ${address}`);
                }
            };
            btn.addEventListener('click', handleMapClick);
            btn.addEventListener('touchend', (e) => { e.preventDefault(); handleMapClick.call(btn); });
        });
    }
    bindStoreActionButtons();

    // Social media links with touch support
    document.querySelectorAll('.social-link').forEach(link => {
        const handleSocialClick = function(e) {
            e.preventDefault();
            const icon = this.querySelector('i');
            if (icon) {
                const platform = icon.className;
                
                if (platform.includes('vk')) {
                    window.open('https://vk.com/pervy_rybny', '_blank');
                } else if (platform.includes('telegram')) {
                    window.open('https://t.me/pervy_rybny', '_blank');
                } else if (platform.includes('instagram')) {
                    window.open('https://instagram.com/pervy_rybny', '_blank');
                }
            }
        };

        link.addEventListener('click', handleSocialClick);
        link.addEventListener('touchend', (e) => {
            e.preventDefault();
            handleSocialClick.call(link, e);
        });
    });

    // Prevent zoom on double tap for mobile
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Load Firestore content if configured
    await loadContentFromFirestore();
    console.log('All scripts initialized successfully!');
});

// Add loading animation for page
window.addEventListener('load', () => {
    console.log('Page fully loaded');
    document.body.classList.add('loaded');
});

// Add CSS for loading state
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body {
        opacity: 1;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(loadingStyle);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Console log to confirm script is loading
console.log('Script.js loaded successfully'); 
