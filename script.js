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
    
    // Get translations
    const lang = window.currentLanguage || 'en';
    const t = translations[lang] || translations.en;
    
    propertiesGrid.innerHTML = filteredProperties.map(property => {
        const isCommercial = property.category === 'commercial';
        const propertyType = isCommercial ? property.propertyType : 'Residential';
        
        // Get translated type
        const typeLabel = property.type === 'For Sale' ? t.properties.forSale : 
                         property.type === 'For Rent' ? t.properties.forRent : property.type;
        const categoryLabel = isCommercial ? t.properties.filters.commercial : t.properties.filters.residential;
        
        // Handle image - use main image (property.image) for card display
        let imageDisplay;
        const mainImage = property.image || (property.images && property.images[0]) || '🏠';
        if (mainImage && (mainImage.startsWith('http') || mainImage.startsWith('images/'))) {
            // It's a URL or local image path
            imageDisplay = `<img src="${mainImage}" alt="${property.address.street || 'Property'}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" onerror="this.style.display='none'; this.parentElement.innerHTML='<span style=\\'font-size: 4rem; z-index: 1; position: relative;\\'>🏠</span>';">`;
        } else {
            // It's an emoji or no image
            imageDisplay = `<span style="font-size: 4rem; z-index: 1; position: relative;">${mainImage}</span>`;
        }
        
        return `
        <div class="property-card" onclick="showPropertyDetails(${property.id})" data-category="${property.category}" data-type="${property.type.toLowerCase().replace(' ', '-')}">
            <div class="property-image">
                ${imageDisplay}
                <span class="property-badge">${typeLabel}</span>
                ${isCommercial ? `<span class="property-category-badge">${categoryLabel}</span>` : ''}
            </div>
            <div class="property-info">
                <div class="property-price">${property.price}</div>
                <div class="property-address">${property.address}</div>
                ${isCommercial ? `<div class="property-type">${propertyType}</div>` : ''}
                <div class="property-details">
                    ${!isCommercial ? `
                    <div class="property-detail">
                        <span>🛏️</span>
                        <span>${property.bedrooms} ${t.properties.beds}</span>
                    </div>
                    ` : property.bedrooms && property.bedrooms > 0 ? `
                    <div class="property-detail">
                        <span>🏢</span>
                        <span>${property.bedrooms} ${t.properties.units}</span>
                    </div>
                    ` : ''}
                    <div class="property-detail">
                        <span>🚿</span>
                        <span>${property.bathrooms} ${isCommercial ? t.properties.restrooms : t.properties.baths}</span>
                    </div>
                    <div class="property-detail">
                        <span>📐</span>
                        <span>${property.sqft} ${t.properties.sqft}</span>
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
        // Get translations
        const lang = window.currentLanguage || 'en';
        const t = translations[lang] || translations.en;
        
        const isCommercial = property.category === 'commercial';
        let details = [];
        
        // Basic details
        if (isCommercial) {
            details.push(property.propertyType);
            if (property.bedrooms && property.bedrooms > 0) {
                details.push(`${property.bedrooms} ${t.properties.units}`);
            }
            details.push(`${property.bathrooms} ${t.properties.restrooms}`);
        } else {
            details.push(`${property.bedrooms} ${t.properties.bedrooms}`);
            details.push(`${property.bathrooms} ${t.properties.bathrooms}`);
        }
        
        if (property.kitchens) details.push(`${property.kitchens} ${isCommercial ? t.properties.kitchenAreas : t.properties.kitchens}`);
        if (property.floors) details.push(`${property.floors} ${property.floors === 1 ? t.properties.floor : t.properties.floors}`);
        if (property.sqft) details.push(`${property.sqft} ${t.properties.sqft}`);
        
        // Property details
        let propertyDetails = [];
        if (property.yearBuilt) propertyDetails.push(`${t.properties.yearBuilt}: ${property.yearBuilt}`);
        if (property.heatingType) propertyDetails.push(`${t.properties.heating}: ${property.heatingType}`);
        if (property.centralAir) propertyDetails.push(`${t.properties.centralAir}: ${property.centralAir}`);
        if (property.gasAvailable) propertyDetails.push(`${t.properties.gasAvailable}: ${property.gasAvailable}`);
        
        // Utilities included
        if (property.utilities) {
            const includedUtilities = [];
            if (property.utilities.water === 'Yes') includedUtilities.push(t.properties.water);
            if (property.utilities.gas === 'Yes') includedUtilities.push(t.properties.gas);
            if (property.utilities.electricity === 'Yes') includedUtilities.push(t.properties.electricity);
            if (property.utilities.sewer === 'Yes') includedUtilities.push(t.properties.sewer);
            if (property.utilities.trash === 'Yes') includedUtilities.push(t.properties.trash);
            if (property.utilities.internet === 'Yes') includedUtilities.push(t.properties.internet);
            if (includedUtilities.length > 0) {
                propertyDetails.push(`${t.properties.utilitiesIncluded}: ${includedUtilities.join(', ')}`);
            }
        }
        
        if (isCommercial) {
            if (property.parkingSpaces) propertyDetails.push(`${t.properties.parkingSpaces}: ${property.parkingSpaces}`);
            if (property.zoning) propertyDetails.push(`${t.properties.zoning}: ${property.zoning}`);
            if (property.buildingClass) propertyDetails.push(`${t.properties.buildingClass}: ${property.buildingClass}`);
        } else {
            if (property.lotSize) propertyDetails.push(`${t.properties.lotSize}: ${property.lotSize} ${t.properties.sqft}`);
            if (property.basement) propertyDetails.push(`${t.properties.basement}: ${property.basement}`);
            if (property.condition) propertyDetails.push(`${t.properties.condition}: ${property.condition}`);
        }
        
        // Show modal instead of alert
        showPropertyModal(property, details, propertyDetails, isCommercial);
    }
}

// Show Property Details Modal with Image Gallery
function showPropertyModal(property, details, propertyDetails, isCommercial) {
    const modal = document.getElementById('propertyModal');
    const modalContent = document.getElementById('propertyModalContent');
    
    if (!modal || !modalContent) return;
    
    // Get translations
    const lang = window.currentLanguage || 'en';
    const t = translations[lang] || translations.en;
    
    // Get all images
    const allImages = property.images && property.images.length > 0 
        ? property.images 
        : (property.image ? [property.image] : []);
    
    // Build image gallery HTML
    let imageGalleryHTML = '';
    if (allImages.length > 0) {
        const firstImage = allImages[0].replace(/'/g, "\\'");
        imageGalleryHTML = `
            <div class="property-image-gallery">
                <div class="gallery-main">
                    <img id="galleryMainImage" src="${firstImage}" alt="Property Image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'800\\' height=\\'600\\'%3E%3Crect fill=\\'%23ddd\\' width=\\'800\\' height=\\'600\\'/%3E%3Ctext fill=\\'%23999\\' font-family=\\'sans-serif\\' font-size=\\'24\\' x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\'%3EProperty Image%3C/text%3E%3C/svg%3E';">
                </div>
                ${allImages.length > 1 ? `
                <div class="gallery-thumbnails">
                    ${allImages.map((img, index) => {
                        const safeImg = img.replace(/'/g, "\\'");
                        return `<img src="${safeImg}" alt="Thumbnail ${index + 1}" 
                             onclick="changeGalleryImage('${safeImg}')" 
                             class="gallery-thumb ${index === 0 ? 'active' : ''}"
                             onerror="this.style.display='none';">`;
                    }).join('')}
                </div>
                ` : ''}
            </div>
        `;
    }
    
    // Format address
    const addressDisplay = typeof property.address === 'object' 
        ? `${property.address.street || ''}, ${property.address.city || ''}, ${property.address.state || ''} ${property.address.zip || ''}`.trim()
        : property.address;
    
    modalContent.innerHTML = `
        ${imageGalleryHTML}
        <div class="property-modal-content">
            <h2>${addressDisplay}</h2>
            <div class="property-modal-price">${property.price}</div>
            <div class="property-modal-details">${details.join(' • ')}</div>
            
            ${propertyDetails.length > 0 ? `
            <div class="property-modal-info">
                <h3>${t.properties.propertyInformation}</h3>
                ${propertyDetails.map(d => `<div>${d}</div>`).join('')}
            </div>
            ` : ''}
            
            ${property.description ? `
            <div class="property-modal-description">
                <h3>${t.properties.description}</h3>
                <p>${property.description.replace(/\n/g, '<br>')}</p>
            </div>
            ` : ''}
            
            ${property.amenities && property.amenities.length > 0 ? `
            <div class="property-modal-amenities">
                <h3>${t.properties.amenities}</h3>
                <div class="amenities-list">${property.amenities.map(a => `<span class="amenity-tag">${a}</span>`).join('')}</div>
            </div>
            ` : ''}
            
            <div class="property-modal-contact">
                <a href="tel:718-353-9300" class="btn-contact">📞 ${t.properties.callUs}: 718-353-9300</a>
                <a href="index.html#contact" class="btn-contact" onclick="closePropertyModal()">📧 ${t.properties.contactUs}</a>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Change gallery main image
function changeGalleryImage(imageSrc) {
    const mainImg = document.getElementById('galleryMainImage');
    if (mainImg) {
        mainImg.src = imageSrc;
        // Update active thumbnail
        document.querySelectorAll('.gallery-thumb').forEach(thumb => {
            thumb.classList.remove('active');
            if (thumb.src === imageSrc || thumb.getAttribute('src') === imageSrc) {
                thumb.classList.add('active');
            }
        });
    }
}

// Close property modal
function closePropertyModal() {
    const modal = document.getElementById('propertyModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('propertyModal');
    if (event.target === modal) {
        closePropertyModal();
    }
});

// EmailJS Configuration
// To enable automated email sending, create an emailjs-config.js file with:
// window.EMAILJS_SERVICE_ID = 'your_service_id';
// window.EMAILJS_TEMPLATE_ID = 'your_template_id';
// window.EMAILJS_PUBLIC_KEY = 'your_public_key';
// See EMAILJS_SETUP.md for detailed instructions

// Contact Form Handler
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        console.warn('Contact form not found. Retrying in 100ms...');
        setTimeout(initContactForm, 100);
        return;
    }
    
    console.log('✅ Contact form found and initialized');
    
    // Remove existing listeners to prevent duplicates
    const newForm = contactForm.cloneNode(true);
    contactForm.parentNode.replaceChild(newForm, contactForm);
    
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            id: Date.now(),
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            message: document.getElementById('message').value.trim(),
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        try {
            // Save to localStorage
            let submissions = JSON.parse(localStorage.getItem('midasContactSubmissions') || '[]');
            submissions.unshift(formData); // Add to beginning (newest first)
            localStorage.setItem('midasContactSubmissions', JSON.stringify(submissions));
            
            // Debug: Log saved submission
            console.log('=== CONTACT FORM SUBMISSION DEBUG ===');
            console.log('Contact submission saved:', formData);
            console.log('Current URL:', window.location.href);
            console.log('Current origin:', window.location.origin);
            console.log('All localStorage keys:', Object.keys(localStorage));
            
            const allSubmissions = JSON.parse(localStorage.getItem('midasContactSubmissions') || '[]');
            console.log('All submissions in localStorage:', allSubmissions);
            console.log('Total submissions count:', allSubmissions.length);
            
            // Verify save was successful
            const verifySave = JSON.parse(localStorage.getItem('midasContactSubmissions') || '[]');
            if (verifySave.length === 0) {
                console.error('❌ Failed to save submission - localStorage is empty');
                alert('There was an error saving your submission. Please try again.');
                return;
            }
            
            const foundSubmission = verifySave.find(s => s.id === formData.id);
            if (!foundSubmission) {
                console.error('❌ Failed to save submission - ID not found in localStorage');
                console.log('Looking for ID:', formData.id);
                console.log('Found IDs:', verifySave.map(s => s.id));
                alert('There was an error saving your submission. Please try again.');
                return;
            }
            
            console.log('✅ Submission saved successfully. Total submissions:', verifySave.length);
            console.log('Saved submission ID:', formData.id);
            console.log('=== END DEBUG ===');
            
            // Save to JSON file (for persistence) - non-blocking
            saveContactSubmission(formData).catch(err => console.error('Error saving to file:', err));
            
            // Send email automatically using EmailJS (if configured) - non-blocking
            if (typeof emailjs !== 'undefined' && window.EMAILJS_SERVICE_ID && window.EMAILJS_TEMPLATE_ID && window.EMAILJS_PUBLIC_KEY) {
                emailjs.send(
                    window.EMAILJS_SERVICE_ID,
                    window.EMAILJS_TEMPLATE_ID,
                    {
                        to_email: 'midasrealtyonline@gmail.com',
                        from_name: formData.name,
                        from_email: formData.email,
                        phone: formData.phone || 'Not provided',
                        message: formData.message,
                        date: formData.date,
                        subject: `New Contact Form Submission from ${formData.name}`
                    },
                    window.EMAILJS_PUBLIC_KEY
                ).then(() => {
                    console.log('Email sent successfully via EmailJS');
                }).catch((emailError) => {
                    console.error('EmailJS error:', emailError);
                    // Don't show error to user, submission is saved
                });
            } else {
                console.log('EmailJS not configured. Submission saved to admin panel.');
            }
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            form.reset();
        } catch (error) {
            console.error('Error saving contact submission:', error);
            console.error('Error details:', error.stack);
            alert('There was an error submitting your form. Please try again.\n\nError: ' + error.message);
            if (form) form.reset();
        }
    });
}

// Initialize contact form when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
} else {
    initContactForm();
}

// Save contact submission to JSON file
async function saveContactSubmission(submission) {
    try {
        // Try to save to data/contact-submissions.json
        const response = await fetch('data/contact-submissions.json');
        let submissions = [];
        
        if (response.ok) {
            submissions = await response.json();
        }
        
        submissions.unshift(submission);
        
        // Note: In a static site, we can't directly write to files
        // This would require a backend API endpoint
        // For now, we'll rely on localStorage and the mailto link
        console.log('Contact submission saved:', submission);
    } catch (error) {
        console.error('Error saving to file:', error);
        // Continue anyway - localStorage is working
    }
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

