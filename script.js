// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Sample Properties Data
const properties = [
    {
        id: 1,
        price: '$850,000',
        address: '123 Oak Street, Downtown',
        bedrooms: 4,
        bathrooms: 3,
        sqft: '2,500',
        type: 'For Sale',
        image: '🏡'
    },
    {
        id: 2,
        price: '$1,200,000',
        address: '456 Maple Avenue, Uptown',
        bedrooms: 5,
        bathrooms: 4,
        sqft: '3,200',
        type: 'For Sale',
        image: '🏰'
    },
    {
        id: 3,
        price: '$2,500/month',
        address: '789 Pine Road, Midtown',
        bedrooms: 3,
        bathrooms: 2,
        sqft: '1,800',
        type: 'For Rent',
        image: '🏠'
    },
    {
        id: 4,
        price: '$650,000',
        address: '321 Elm Drive, Suburbs',
        bedrooms: 3,
        bathrooms: 2,
        sqft: '2,100',
        type: 'For Sale',
        image: '🏘️'
    },
    {
        id: 5,
        price: '$3,200/month',
        address: '654 Cedar Lane, Waterfront',
        bedrooms: 4,
        bathrooms: 3,
        sqft: '2,800',
        type: 'For Rent',
        image: '🌊'
    },
    {
        id: 6,
        price: '$1,500,000',
        address: '987 Birch Boulevard, Luxury',
        bedrooms: 6,
        bathrooms: 5,
        sqft: '4,500',
        type: 'For Sale',
        image: '🏛️'
    }
];

// Load Properties
function loadProperties() {
    const propertiesGrid = document.getElementById('propertiesGrid');
    
    if (!propertiesGrid) return;
    
    propertiesGrid.innerHTML = properties.map(property => `
        <div class="property-card" onclick="showPropertyDetails(${property.id})">
            <div class="property-image">
                <span style="font-size: 4rem; z-index: 1; position: relative;">${property.image}</span>
                <span class="property-badge">${property.type}</span>
            </div>
            <div class="property-info">
                <div class="property-price">${property.price}</div>
                <div class="property-address">${property.address}</div>
                <div class="property-details">
                    <div class="property-detail">
                        <span>🛏️</span>
                        <span>${property.bedrooms} Beds</span>
                    </div>
                    <div class="property-detail">
                        <span>🚿</span>
                        <span>${property.bathrooms} Baths</span>
                    </div>
                    <div class="property-detail">
                        <span>📐</span>
                        <span>${property.sqft} sqft</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Show Property Details (placeholder function)
function showPropertyDetails(id) {
    const property = properties.find(p => p.id === id);
    if (property) {
        alert(`Property Details:\n\n${property.address}\n${property.price}\n${property.bedrooms} Bedrooms, ${property.bathrooms} Bathrooms\n${property.sqft} sqft\n\nContact us for more information!`);
    }
}

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value
        };
        
        // In a real application, you would send this data to a server
        console.log('Form submitted:', formData);
        
        // Show success message
        alert('Thank you for your message! We will get back to you soon.');
        
        // Reset form
        contactForm.reset();
    });
}

// Intersection Observer for fade-in animations
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

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    loadProperties();
    
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.property-card, .service-card, .stat-item');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Add active state to navigation on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});
