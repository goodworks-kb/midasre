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
document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Extract hash from href (handles both "#section" and "index.html#section")
        const hashMatch = href.match(/#(.+)$/);
        if (hashMatch) {
            const hash = '#' + hashMatch[1];
            const target = document.querySelector(hash);
            
            // If we're on the same page (index.html) and target exists, prevent default and scroll
            if (target && (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/'))) {
                e.preventDefault();
                const navbarHeight = 70;
                const offsetTop = target.offsetTop - navbarHeight;
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (mobileMenuToggle) {
                        mobileMenuToggle.classList.remove('active');
                    }
                }
                
                // Update URL without reloading
                window.history.pushState(null, '', hash);
                
                window.scrollTo({
                    top: Math.max(0, offsetTop),
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Handle hash on page load
window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash) {
        const target = document.querySelector(hash);
        if (target) {
            setTimeout(() => {
                const navbarHeight = 70;
                const offsetTop = target.offsetTop - navbarHeight;
                window.scrollTo({
                    top: Math.max(0, offsetTop),
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
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

// Properties Data - Loaded from JSON file or localStorage
let properties = [];

// Load properties from JSON file or localStorage
async function loadPropertiesData() {
    try {
        // Try to load from JSON file first
        const response = await fetch('data/properties.json');
        if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
                properties = data;
                return;
            }
        }
    } catch (error) {
        console.log('Could not load from JSON file, trying localStorage...');
    }
    
    // Fallback to localStorage (set by admin panel)
    const stored = localStorage.getItem('midasProperties');
    if (stored) {
        try {
            properties = JSON.parse(stored);
            if (properties.length > 0) return;
        } catch (e) {
            console.error('Error parsing stored properties:', e);
        }
    }
    
    // Final fallback to hardcoded data
    properties = [
    {
        id: 1,
        price: '$850,000',
        address: '123 Oak Street, Flushing',
        bedrooms: 4,
        bathrooms: 3,
        sqft: '2,500',
        type: 'For Sale',
        category: 'residential',
        image: '🏡'
    },
    {
        id: 2,
        price: '$1,200,000',
        address: '456 Maple Avenue, Flushing',
        bedrooms: 5,
        bathrooms: 4,
        sqft: '3,200',
        type: 'For Sale',
        category: 'residential',
        image: '🏰'
    },
    {
        id: 3,
        price: '$2,500/month',
        address: '789 Pine Road, Flushing',
        bedrooms: 3,
        bathrooms: 2,
        sqft: '1,800',
        type: 'For Rent',
        category: 'residential',
        image: '🏠'
    },
    {
        id: 4,
        price: '$650,000',
        address: '321 Elm Drive, Flushing',
        bedrooms: 3,
        bathrooms: 2,
        sqft: '2,100',
        type: 'For Sale',
        category: 'residential',
        image: '🏘️'
    },
    {
        id: 5,
        price: '$3,200/month',
        address: '654 Cedar Lane, Flushing',
        bedrooms: 4,
        bathrooms: 3,
        sqft: '2,800',
        type: 'For Rent',
        category: 'residential',
        image: '🌊'
    },
    {
        id: 6,
        price: '$1,500,000',
        address: '987 Birch Boulevard, Flushing',
        bedrooms: 6,
        bathrooms: 5,
        sqft: '4,500',
        type: 'For Sale',
        category: 'residential',
        image: '🏛️'
    },
    {
        id: 7,
        price: '$2,800,000',
        address: '150 Main Street, Flushing',
        bedrooms: null,
        bathrooms: 4,
        sqft: '5,200',
        type: 'For Sale',
        category: 'commercial',
        image: '🏢',
        propertyType: 'Office Building'
    },
    {
        id: 8,
        price: '$8,500/month',
        address: '200 Northern Blvd, Flushing',
        bedrooms: null,
        bathrooms: 2,
        sqft: '3,500',
        type: 'For Rent',
        category: 'commercial',
        image: '🏪',
        propertyType: 'Retail Space'
    },
    {
        id: 9,
        price: '$4,200,000',
        address: '175-20 Depot Road, Flushing',
        bedrooms: null,
        bathrooms: 6,
        sqft: '8,000',
        type: 'For Sale',
        category: 'commercial',
        image: '🏭',
        propertyType: 'Mixed-Use Building'
    }
    ];
}

// Initialize properties on page load
loadPropertiesData();

// Load Properties
function loadProperties(filter = 'all') {
    const propertiesGrid = document.getElementById('propertiesGrid');
    
    if (!propertiesGrid) return;
    
    // Use static properties data
    let propertiesToUse = properties;
    
    let filteredProperties = propertiesToUse;
    
    if (filter !== 'all') {
        if (filter === 'residential') {
            filteredProperties = propertiesToUse.filter(p => p.category === 'residential');
        } else if (filter === 'commercial') {
            filteredProperties = propertiesToUse.filter(p => p.category === 'commercial');
        } else if (filter === 'sale') {
            filteredProperties = propertiesToUse.filter(p => p.type === 'For Sale');
        } else if (filter === 'rent') {
            filteredProperties = propertiesToUse.filter(p => p.type === 'For Rent');
        }
    }
    
    propertiesGrid.innerHTML = filteredProperties.map(property => {
        const isCommercial = property.category === 'commercial';
        const propertyType = isCommercial ? property.propertyType : 'Residential';
        
        // Handle image - can be URL, local path, or emoji
        let imageDisplay;
        if (property.image && (property.image.startsWith('http') || property.image.startsWith('images/'))) {
            // It's a URL or local image path
            imageDisplay = `<img src="${property.image}" alt="${property.address.street || 'Property'}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" onerror="this.style.display='none'; this.parentElement.innerHTML='<span style=\\'font-size: 4rem; z-index: 1; position: relative;\\'>🏠</span>';">`;
        } else {
            // It's an emoji or no image
            imageDisplay = `<span style="font-size: 4rem; z-index: 1; position: relative;">${property.image || '🏠'}</span>`;
        }
        
        return `
        <div class="property-card" onclick="showPropertyDetails(${property.id})" data-category="${property.category}" data-type="${property.type.toLowerCase().replace(' ', '-')}">
            <div class="property-image">
                ${imageDisplay}
                <span class="property-badge">${property.type}</span>
                ${isCommercial ? `<span class="property-category-badge">Commercial</span>` : ''}
            </div>
            <div class="property-info">
                <div class="property-price">${property.price}</div>
                <div class="property-address">${property.address}</div>
                ${isCommercial ? `<div class="property-type">${propertyType}</div>` : ''}
                <div class="property-details">
                    ${!isCommercial ? `
                    <div class="property-detail">
                        <span>🛏️</span>
                        <span>${property.bedrooms} Beds</span>
                    </div>
                    ` : property.bedrooms && property.bedrooms > 0 ? `
                    <div class="property-detail">
                        <span>🏢</span>
                        <span>${property.bedrooms} Units</span>
                    </div>
                    ` : ''}
                    <div class="property-detail">
                        <span>🚿</span>
                        <span>${property.bathrooms} ${isCommercial ? 'Restrooms' : 'Baths'}</span>
                    </div>
                    <div class="property-detail">
                        <span>📐</span>
                        <span>${property.sqft} sqft</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

// Property View Toggle (Active vs Sold)
function initPropertyViewToggle() {
    const toggleButtons = document.querySelectorAll('.view-toggle-btn');
    const activeView = document.getElementById('activePropertiesView');
    const soldView = document.getElementById('soldPropertiesView');
    const propertyFilters = document.getElementById('propertyFilters');
    
    if (!toggleButtons.length || !activeView || !soldView) return;
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const view = button.getAttribute('data-view');
            
            if (view === 'active') {
                activeView.style.display = 'block';
                soldView.style.display = 'none';
                if (propertyFilters) propertyFilters.style.display = 'flex';
            } else {
                activeView.style.display = 'none';
                soldView.style.display = 'block';
                if (propertyFilters) propertyFilters.style.display = 'none';
                loadSoldProperties();
            }
        });
    });
}

// Property Filter Functionality
function initPropertyFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Load properties with filter
            const filter = button.getAttribute('data-filter');
            loadProperties(filter);
        });
    });
}

// Show Property Details (placeholder function)
function showPropertyDetails(id) {
    const property = properties.find(p => p.id === id);
    if (property) {
        const isCommercial = property.category === 'commercial';
        let details;
        if (isCommercial) {
            details = `${property.propertyType}`;
            if (property.bedrooms && property.bedrooms > 0) {
                details += `\n${property.bedrooms} Units`;
            }
            details += `\n${property.bathrooms} Restrooms`;
        } else {
            details = `${property.bedrooms} Bedrooms, ${property.bathrooms} Bathrooms`;
        }
        
        let message = `Property Details:\n\n${property.address}\n${property.price}\n${details}\n${property.sqft} sqft`;
        
        if (property.description) {
            message += `\n\nDescription:\n${property.description}`;
        }
        
        if (property.amenities && property.amenities.length > 0) {
            message += `\n\nAmenities:\n${property.amenities.join(', ')}`;
        }
        
        message += `\n\nContact us for more information!`;
        
        alert(message);
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
    loadSoldProperties();
    initPropertyViewToggle();
    initPropertyFilters();
    
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

// Recently Sold Properties Data
const soldProperties = [
    {
        address: '145-20 Northern Blvd, Flushing',
        price: '$1,250,000',
        soldDate: 'Dec 2024',
        type: 'Residential'
    },
    {
        address: '168-05 Depot Road, Flushing',
        price: '$850,000',
        soldDate: 'Nov 2024',
        type: 'Residential'
    },
    {
        address: '180-25 Union Turnpike, Flushing',
        price: '$2,100,000',
        soldDate: 'Nov 2024',
        type: 'Commercial'
    },
    {
        address: '156-08 41st Avenue, Flushing',
        price: '$675,000',
        soldDate: 'Oct 2024',
        type: 'Residential'
    },
    {
        address: '135-30 37th Avenue, Flushing',
        price: '$1,800,000',
        soldDate: 'Oct 2024',
        type: 'Commercial'
    },
    {
        address: '142-15 Roosevelt Avenue, Flushing',
        price: '$950,000',
        soldDate: 'Sep 2024',
        type: 'Residential'
    }
];

// Load Sold Properties
function loadSoldProperties() {
    const soldGrid = document.getElementById('soldPropertiesGrid');
    if (!soldGrid) return;
    
    // Use static sold properties data
    let soldPropertiesToUse = soldProperties;
    
    const lang = window.currentLanguage || 'en';
    const t = translations[lang] || translations.en;
    const soldLabel = t.sold.sold || 'Sold';
    const residentialLabel = t.properties.filters?.residential || 'Residential';
    const commercialLabel = t.properties.filters?.commercial || 'Commercial';
    
    soldGrid.innerHTML = soldPropertiesToUse.map(property => {
        const typeLabel = property.type === 'Residential' ? residentialLabel : commercialLabel;
        return `
        <div class="sold-property-card">
            <div class="sold-property-info">
                <div class="sold-price">${property.price}</div>
                <div class="sold-address">${property.address}</div>
                <div class="sold-meta">
                    <span class="sold-date">${soldLabel}: ${property.soldDate}</span>
                    <span class="sold-type">${typeLabel}</span>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

// Mortgage Calculator Functions
function openMortgageCalculator() {
    document.getElementById('mortgageCalculatorModal').style.display = 'block';
}

function closeMortgageCalculator() {
    document.getElementById('mortgageCalculatorModal').style.display = 'none';
}

function openNeighborhoodModal() {
    document.getElementById('neighborhoodModal').style.display = 'block';
}

function closeNeighborhoodModal() {
    document.getElementById('neighborhoodModal').style.display = 'none';
}

function openResourcesModal() {
    document.getElementById('resourcesModal').style.display = 'block';
}

function closeResourcesModal() {
    document.getElementById('resourcesModal').style.display = 'none';
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    const mortgageModal = document.getElementById('mortgageCalculatorModal');
    const neighborhoodModal = document.getElementById('neighborhoodModal');
    const resourcesModal = document.getElementById('resourcesModal');
    
    if (e.target === mortgageModal) {
        closeMortgageCalculator();
    }
    if (e.target === neighborhoodModal) {
        closeNeighborhoodModal();
    }
    if (e.target === resourcesModal) {
        closeResourcesModal();
    }
});

function calculateMortgage() {
    const homePrice = parseFloat(document.getElementById('homePrice').value) || 0;
    const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
    const interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
    const loanTerm = parseInt(document.getElementById('loanTerm').value) || 30;
    
    const loanAmount = homePrice - downPayment;
    const monthlyRate = (interestRate / 100) / 12;
    const numberOfPayments = loanTerm * 12;
    
    if (loanAmount <= 0 || monthlyRate <= 0) {
        document.getElementById('mortgageResult').innerHTML = '<p style="color: red;">Please enter valid values.</p>';
        return;
    }
    
    const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;
    
    const lang = window.currentLanguage || 'en';
    const t = translations[lang] || translations.en;
    document.getElementById('mortgageResult').innerHTML = `
        <div class="calc-result-box">
            <h3>${t.tools.calcMonthlyPayment}</h3>
            <p class="calc-amount">$${monthlyPayment.toFixed(2)}</p>
        </div>
        <div class="calc-result-box">
            <h3>${t.tools.calcTotalInterest}</h3>
            <p class="calc-amount">$${totalInterest.toLocaleString('en-US', {maximumFractionDigits: 2})}</p>
        </div>
        <div class="calc-result-box">
            <h3>${t.tools.calcTotalPayment}</h3>
            <p class="calc-amount">$${totalPayment.toLocaleString('en-US', {maximumFractionDigits: 2})}</p>
        </div>
    `;
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('mortgageCalculatorModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

