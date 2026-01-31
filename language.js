// Language switching functionality
// Make currentLanguage globally accessible
window.currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
let currentLanguage = window.currentLanguage;

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    changeLanguage(currentLanguage, false);
    
    // Language dropdown toggle
    const languageBtn = document.getElementById('languageBtn');
    const languageDropdown = document.getElementById('languageDropdown');
    
    if (languageBtn && languageDropdown) {
        languageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            languageDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
                languageDropdown.classList.remove('show');
            }
        });
    }
});

// Change language function
function changeLanguage(lang, save = true) {
    currentLanguage = lang;
    window.currentLanguage = lang; // Make globally accessible
    
    if (save) {
        localStorage.setItem('selectedLanguage', lang);
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update current language indicator
    const langCodes = { en: 'EN', ko: 'KO', es: 'ES', zh: 'ZH' };
    const currentLangEl = document.getElementById('currentLang');
    if (currentLangEl) {
        currentLangEl.textContent = langCodes[lang] || 'EN';
    }
    
    // Get translations
    const t = translations[lang] || translations.en;
    
    // Translate all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const keys = key.split('.');
        let value = t;
        
        for (const k of keys) {
            value = value?.[k];
        }
        
        if (value !== undefined) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = value;
            } else if (element.tagName === 'A' || element.tagName === 'BUTTON') {
                element.textContent = value;
            } else if (element.classList.contains('company-motto') || element.classList.contains('hero-motto') || element.classList.contains('footer-motto')) {
                element.textContent = `"${value}"`;
            } else {
                // Check if element has child elements that should be preserved
                const hasStrong = element.querySelector('strong');
                if (hasStrong && (key.includes('Desc') || key.includes('companyDesc') || key.includes('aboutMeDesc'))) {
                    // For paragraphs with strong tags, we need special handling
                    // Skip this element - it will be handled by translateComplexContent function
                    return; // Skip this element in the main loop
                } else {
                    element.textContent = value;
                }
            }
        }
    });
    
    // Translate specific sections that need HTML content
    translateSectionHeaders(t);
    translateProperties(t);
    translateServices(t);
    translateBenefits(t);
    translateTools(t);
    translateContact(t);
    translateFooter(t);
    
    // Handle complex translations with HTML content (call once at the end)
    translateComplexContent(t);
    
    // Translate license number
    const licenseNumberEl = document.querySelector('.license-number');
    if (licenseNumberEl && t.about.licenseNumber) {
        licenseNumberEl.textContent = t.about.licenseNumber;
    }
    
    // Translate modals if they exist
    translateModals(t);
    
    // Reload sold properties with new language
    if (typeof loadSoldProperties === 'function') {
        loadSoldProperties();
    }
    
    // Close dropdown
    const languageDropdown = document.getElementById('languageDropdown');
    if (languageDropdown) {
        languageDropdown.classList.remove('show');
    }
}

// Translate section headers
function translateSectionHeaders(t) {
    const sectionHeaders = {
        'properties-title': t.properties.title,
        'properties-subtitle': t.properties.subtitle,
        'sold-title': t.sold.title,
        'sold-subtitle': t.sold.subtitle,
        'about-title': t.about.title,
        'about-subtitle': t.about.subtitle,
        'services-title': t.services.title,
        'services-subtitle': t.services.subtitle,
        'benefits-title': t.benefits.title,
        'benefits-subtitle': t.benefits.subtitle,
        'tools-title': t.tools.title,
        'tools-subtitle': t.tools.subtitle,
        'contact-title': t.contact.title,
        'contact-subtitle': t.contact.subtitle
    };
    
    Object.keys(sectionHeaders).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = sectionHeaders[id];
        }
    });
}

// Translate properties section
function translateProperties(t) {
    // Update view toggle buttons
    const toggleButtons = document.querySelectorAll('.view-toggle-btn');
    toggleButtons.forEach(btn => {
        const view = btn.getAttribute('data-view');
        if (view === 'active' && t.properties.viewActive) {
            btn.textContent = t.properties.viewActive;
        } else if (view === 'sold' && t.properties.viewSold) {
            btn.textContent = t.properties.viewSold;
        }
    });
    
    // Update filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        const filter = btn.getAttribute('data-filter');
        if (filter && t.properties.filters[filter]) {
            btn.textContent = t.properties.filters[filter];
        }
    });
}

// Translate services section
function translateServices(t) {
    // Service categories
    const categoryTitles = document.querySelectorAll('.category-title');
    if (categoryTitles.length >= 2) {
        categoryTitles[0].textContent = t.services.residential;
        categoryTitles[1].textContent = t.services.commercial;
    }
    
    // Service descriptions are handled by data-translate attributes
}

// Translate benefits section
function translateBenefits(t) {
    // Benefit titles and content are handled by data-translate attributes
    // This function can be used for any dynamic benefit content if needed
}

// Translate tools section
function translateTools(t) {
    // Tool cards are handled by data-translate attributes
    
    // Translate mortgage calculator modal labels
    const calcLabels = document.querySelectorAll('.calc-input-group label');
    if (calcLabels.length >= 4) {
        calcLabels[0].textContent = t.tools.calcHomePrice;
        calcLabels[1].textContent = t.tools.calcDownPayment;
        calcLabels[2].textContent = t.tools.calcInterestRate;
        calcLabels[3].textContent = t.tools.calcLoanTerm;
    }
    
    // Translate calculator options
    const calcOptions = document.querySelectorAll('#loanTerm option');
    if (calcOptions.length >= 2) {
        calcOptions[0].textContent = t.tools.calcYears15;
        calcOptions[1].textContent = t.tools.calcYears30;
    }
    
    // Update calculator result labels when calculating
    window.translateCalcResults = function() {
        const resultBoxes = document.querySelectorAll('.calc-result-box h3');
        if (resultBoxes.length >= 3) {
            resultBoxes[0].textContent = t.tools.calcMonthlyPayment;
            resultBoxes[1].textContent = t.tools.calcTotalInterest;
            resultBoxes[2].textContent = t.tools.calcTotalPayment;
        }
    };
}

// Translate contact section
function translateContact(t) {
    const contactItems = document.querySelectorAll('.contact-item h3');
    contactItems.forEach((item, index) => {
        const labels = [t.contact.address, t.contact.phone, t.contact.email, t.contact.hours];
        if (labels[index]) {
            item.textContent = labels[index];
        }
    });
    
    // Update hours content
    const hoursContent = document.querySelector('.contact-item:last-of-type p');
    if (hoursContent) {
        hoursContent.innerHTML = t.contact.hoursContent;
    }
    
    // Update form labels
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    formInputs.forEach(input => {
        const name = input.getAttribute('name');
        if (name === 'name') input.placeholder = t.contact.name;
        if (name === 'email') input.placeholder = t.contact.emailPlaceholder;
        if (name === 'phone') input.placeholder = t.contact.phonePlaceholder;
        if (name === 'message') input.placeholder = t.contact.message;
    });
    
    const submitBtn = document.querySelector('.contact-form button[type="submit"]');
    if (submitBtn) {
        submitBtn.textContent = t.contact.sendMessage;
    }
}

// Translate footer
function translateFooter(t) {
    const footerSections = document.querySelectorAll('.footer-section h4');
    footerSections.forEach((section, index) => {
        const labels = [t.footer.quickLinks, t.footer.services, t.footer.connect];
        if (labels[index]) {
            section.textContent = labels[index];
        }
    });
    
    // Translate footer description
    const footerDesc = document.querySelector('.footer-section p:not(.footer-motto)');
    if (footerDesc && !footerDesc.querySelector('a')) {
        footerDesc.textContent = t.footer.description;
    }
    
    // Translate footer links
    const footerLinks = document.querySelectorAll('.footer-section ul a');
    footerLinks.forEach((link, index) => {
        if (index < 5) {
            // Navigation links
            const navKeys = ['home', 'properties', 'about', 'services', 'contact'];
            if (navKeys[index] && t.nav[navKeys[index]]) {
                link.textContent = t.nav[navKeys[index]];
            }
        } else if (index >= 5 && index < 9) {
            // Service links
            const serviceKeys = ['propertySales', 'rentals', 'investment', 'propertyManagement'];
            const serviceIndex = index - 5;
            if (serviceKeys[serviceIndex] && t.footer[serviceKeys[serviceIndex]]) {
                link.textContent = t.footer[serviceKeys[serviceIndex]];
            }
        }
    });
}

// Translate complex content with HTML tags
function translateComplexContent(t) {
    // Company description paragraphs with strong tags
    const companyDescP = document.querySelector('.about-text p');
    if (companyDescP && companyDescP.textContent.includes('2001')) {
        const strongTag = companyDescP.querySelector('strong');
        if (strongTag) {
            companyDescP.innerHTML = `${t.about.companyDesc1}<strong>${t.about.companyDesc2}</strong>${t.about.companyDesc3}`;
        }
    }
    
    const companyDescP2 = document.querySelector('.about-text p:nth-of-type(2)');
    if (companyDescP2 && !companyDescP2.querySelector('strong')) {
        companyDescP2.textContent = t.about.companyDesc4;
    }
    
    // About Me description paragraphs with strong tags
    const aboutMeParas = document.querySelectorAll('.about-me-text p');
    if (aboutMeParas.length >= 4) {
        aboutMeParas[0].textContent = t.about.aboutMeIntro;
        aboutMeParas[1].textContent = t.about.aboutMeDesc1;
        
        if (aboutMeParas[2].querySelector('strong')) {
            aboutMeParas[2].innerHTML = `${t.about.aboutMeDesc2}<strong>${t.about.aboutMeDesc3}</strong>${t.about.aboutMeDesc4}`;
        }
        
        if (aboutMeParas[3]) {
            // aboutMeDesc5 now contains the full text with language mention
            const desc5 = t.about.aboutMeDesc5;
            // Check if we need to add strong tags around language mention
            const langPatterns = {
                en: /(both )([Kk]orean and [Ee]nglish)/,
                ko: /(한국어와 영어)/,
                es: /(coreano e inglés)/,
                zh: /(韩语和英语)/
            };
            
            const pattern = langPatterns[currentLanguage] || langPatterns.en;
            const match = desc5.match(pattern);
            
            if (match) {
                if (currentLanguage === 'en') {
                    aboutMeParas[3].innerHTML = desc5.replace(pattern, '$1<strong>$2</strong>');
                } else {
                    aboutMeParas[3].innerHTML = desc5.replace(pattern, '<strong>$1</strong>');
                }
            } else {
                aboutMeParas[3].textContent = desc5;
            }
        }
    }
}

// Translate modals
function translateModals(t) {
    // Translate neighborhood modal
    const neighborhoodModal = document.getElementById('neighborhoodModal');
    if (neighborhoodModal && t.neighborhood) {
        const elements = neighborhoodModal.querySelectorAll('[data-translate]');
        elements.forEach(el => {
            const key = el.getAttribute('data-translate');
            if (key && key.startsWith('neighborhood.')) {
                const keys = key.split('.');
                let value = t.neighborhood;
                for (let k of keys.slice(1)) {
                    value = value?.[k];
                }
                if (value) {
                    el.textContent = value;
                }
            }
        });
    }
    
    // Translate resources modal
    const resourcesModal = document.getElementById('resourcesModal');
    if (resourcesModal && t.resources) {
        const elements = resourcesModal.querySelectorAll('[data-translate]');
        elements.forEach(el => {
            const key = el.getAttribute('data-translate');
            if (key && key.startsWith('resources.')) {
                const keys = key.split('.');
                let value = t.resources;
                for (let k of keys.slice(1)) {
                    value = value?.[k];
                }
                if (value) {
                    el.textContent = value;
                }
            }
        });
    }
}
