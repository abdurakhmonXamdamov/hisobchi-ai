// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: 'ease-in-out'
});

// Initialize Three.js Hero Animation
initThreeJS();

// Initialize Dark Mode
initDarkMode();

// Initialize Mobile Menu
initMobileMenu();

// Initialize Smooth Scrolling
initSmoothScroll();

initRoadmapAnimation();

// Initialize Horizontal Scrolling 
initHorizontalCarousel(); 
});

// ============================================
// THREE.JS HERO ANIMATION
// ============================================
function initThreeJS() {
const canvas = document.getElementById('hero-canvas');
if (!canvas) return;

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Camera position
camera.position.z = 5;

// Create floating geometric shapes
const geometries = [
    new THREE.TorusGeometry(1, 0.3, 16, 100),
    new THREE.OctahedronGeometry(1),
    new THREE.TetrahedronGeometry(1),
    new THREE.IcosahedronGeometry(1)
];

// Material with wireframe
const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.15
});

// Create multiple meshes
const meshes = [];
const positions = [
    { x: -3, y: 2, z: 0 },
    { x: 3, y: -2, z: -2 },
    { x: -2, y: -2, z: -1 },
    { x: 2, y: 2, z: -3 }
];

for (let i = 0; i < 4; i++) {
    const geometry = geometries[i % geometries.length];
    const mesh = new THREE.Mesh(geometry, material.clone());
    mesh.position.set(positions[i].x, positions[i].y, positions[i].z);
    scene.add(mesh);
    meshes.push(mesh);
}

// Add ambient particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 500;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0xffffff,
    transparent: true,
    opacity: 0.3
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Mouse interaction
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Animation loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    
    // Rotate meshes
    meshes.forEach((mesh, index) => {
        mesh.rotation.x = elapsedTime * 0.3 * (index + 1) * 0.5;
        mesh.rotation.y = elapsedTime * 0.2 * (index + 1) * 0.5;
        
        // Float animation
        mesh.position.y = positions[index].y + Math.sin(elapsedTime + index) * 0.3;
        
        // Mouse interaction
        mesh.rotation.x += mouseY * 0.01;
        mesh.rotation.y += mouseX * 0.01;
    });
    
    // Rotate particles
    particlesMesh.rotation.y = elapsedTime * 0.05;
    
    // Camera slight movement based on mouse
    camera.position.x = mouseX * 0.5;
    camera.position.y = mouseY * 0.5;
    
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
}

// ============================================
// DARK MODE TOGGLE
// ============================================
function initDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        html.classList.add('dark');
    }
    
    themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        
        // Save preference
        const theme = html.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        
        // Update navbar immediately
        const navbar = document.querySelector('nav');
        const isDark = html.classList.contains('dark');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)';
        } else {
            navbar.style.backgroundColor = isDark ? 'rgba(17, 24, 39, 0.3)' : 'rgba(255, 255, 255, 0.1)';
        }
    });
}
// ============================================
// MOBILE MENU TOGGLE
// ============================================
function initMobileMenu() {
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    
    // Change icon
    const icon = mobileMenuButton.querySelector('i');
    if (mobileMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close menu when clicking on a link
const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        const icon = mobileMenuButton.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (event) => {
    if (!mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
        mobileMenu.classList.remove('active');
        const icon = mobileMenuButton.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});
}

// ============================================
// SMOOTH SCROLLING
// ============================================
function initSmoothScroll() {
// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const navHeight = 64; 
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add active state to nav links based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('nav');
    const isDark = document.documentElement.classList.contains('dark');
    
    if (window.scrollY > 50) {
        if (isDark) {
            navbar.style.backgroundColor = 'rgba(17, 24, 39, 0.95)'; // dark gray
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)'; // white
        }
        navbar.classList.add('shadow-lg');
    } else {
        if (isDark) {
            navbar.style.backgroundColor = 'rgba(17, 24, 39, 0.3)'; // transparent dark
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; // transparent white
        }
        navbar.classList.remove('shadow-lg');
    }
});
}

// ============================================
// NAVBAR BACKGROUND ON SCROLL
// ============================================
window.addEventListener('scroll', () => {
const navbar = document.querySelector('nav');
if (window.scrollY > 50) {
    navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    navbar.classList.add('shadow-lg');
} else {
    navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    navbar.classList.remove('shadow-lg');
}
});

// ============================================
// PARALLAX EFFECT FOR HERO SECTION
// ============================================
window.addEventListener('scroll', () => {
const hero = document.querySelector('#hero');
const scrolled = window.pageYOffset;
if (hero && scrolled < window.innerHeight) {
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    hero.style.opacity = 1 - (scrolled / window.innerHeight);
}
});

// ============================================
// TYPING ANIMATION (Optional Enhancement)
// ============================================
function typeWriter(element, text, speed = 50) {
let i = 0;
element.textContent = '';

function type() {
    if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
    }
}

type();
}

// Example usage (uncomment if you want typing effect on tagline):
const tagline = document.querySelector('#hero p');
if (tagline) {
    const originalText = tagline.textContent;
    typeWriter(tagline, originalText, 30);
}

// ============================================
// SCROLL REVEAL FOR COUNTERS (Optional Enhancement)
// ============================================
function animateCounter(element, target, duration = 2000) {
let start = 0;
const increment = target / (duration / 16);

const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
        element.textContent = target;
        clearInterval(timer);
    } else {
        element.textContent = Math.floor(start);
    }
}, 16);
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================
const observerOptions = {
threshold: 0.1,
rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
    if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
    }
});
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
observer.observe(section);
});

// ============================================
// PRELOADER (Optional)
// ============================================
window.addEventListener('load', () => {
document.body.classList.add('loaded');
});

// ============================================
// EASTER EGG: KONAMI CODE (Just for fun!)
// ============================================
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
konamiCode.push(e.key);
konamiCode = konamiCode.slice(-10);

if (konamiCode.join(',') === konamiPattern.join(',')) {
    // Easter egg triggered! 🎉
    confetti();
}
});

function confetti() {
// Simple confetti effect
const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c'];
for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    confetti.style.opacity = '1';
    confetti.style.borderRadius = '50%';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    document.body.appendChild(confetti);
    
    const fallDuration = Math.random() * 3 + 2;
    const fallDelay = Math.random() * 0.5;
    
    confetti.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${window.innerHeight + 10}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
    ], {
        duration: fallDuration * 1000,
        delay: fallDelay * 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => confetti.remove();
}
}

function initRoadmapAnimation() {
    const roadmapSection = document.getElementById('roadmap');
    const roadmapLine = document.createElement('div');
    roadmapLine.className = 'roadmap-line';
    
    // Find the roadmap container and add the line
    const roadmapContainer = roadmapSection.querySelector('.roadmap-container');
    if (roadmapContainer) {
        roadmapContainer.appendChild(roadmapLine);
    }
    
    // Animate line on scroll
    window.addEventListener('scroll', () => {
        const rect = roadmapSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight && rect.bottom > 0) {
            const progress = Math.min(Math.max((windowHeight - rect.top) / rect.height, 0), 1);
            const lineHeight = rect.height * progress;
            roadmapLine.style.height = lineHeight + 'px';
        }
    });
}

function initHorizontalCarousel() {
    const carousel = document.getElementById('team-horizontal-carousel');
    if (!carousel) return;

    const cards = Array.from(carousel.children);
    
    // Clone cards for infinite scroll
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        carousel.appendChild(clone);
    });

    let currentPosition = 0;
    let scrollSpeed = 1;

    // Compute card width dynamically
    const card = cards[0];
    const style = getComputedStyle(card);
    const cardWidth = card.offsetWidth + parseInt(style.marginRight) + 50;
    const totalWidth = cardWidth * cards.length;

    function autoScroll() {
        currentPosition += scrollSpeed;

        if (currentPosition >= totalWidth) {
            currentPosition = 0; // reset to show first card fully
        }

        carousel.style.transform = `translateX(-${currentPosition}px)`;
        requestAnimationFrame(autoScroll);
    }

    carousel.addEventListener('mouseenter', () => scrollSpeed = 0);
    carousel.addEventListener('mouseleave', () => scrollSpeed = 1);

    autoScroll();
}



console.log('🚀 Hisobchi AI - Website Loaded Successfully!');
console.log('💡 Tip: Try the Konami Code for a surprise! ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA');