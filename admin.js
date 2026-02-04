// Admin Panel JavaScript
const ADMIN_PASSWORD = 'midas2024'; // Change this to a secure password

// Store uploaded images
let uploadedImages = [];

// Check if user is logged in
function checkAuth() {
    return sessionStorage.getItem('adminAuthenticated') === 'true';
}

// Property type options for each category
const PROPERTY_TYPES = {
    residential: [
        { value: 'House', label: 'House' },
        { value: 'Condo', label: 'Condo' },
        { value: 'Townhouse', label: 'Townhouse' },
        { value: 'Apartment', label: 'Apartment' },
        { value: 'Land', label: 'Land' }
    ],
    commercial: [
        { value: 'Retail Space', label: 'Retail Space' },
        { value: 'Office Building', label: 'Office Building' },
        { value: 'Mixed-Use Building', label: 'Mixed-Use Building' },
        { value: 'Warehouse', label: 'Warehouse' },
        { value: 'Industrial', label: 'Industrial' },
        { value: 'Restaurant Space', label: 'Restaurant Space' },
        { value: 'Medical Office', label: 'Medical Office' },
        { value: 'Retail Store', label: 'Retail Store' }
    ]
};

// Update property type options based on category selection
function updatePropertyTypeOptions() {
    const categorySelect = document.getElementById('category');
    const propertyTypeSelect = document.getElementById('propertyType');
    
    if (!categorySelect || !propertyTypeSelect) return;
    
    const category = categorySelect.value;
    const currentValue = propertyTypeSelect.value;
    const types = PROPERTY_TYPES[category] || PROPERTY_TYPES.residential;
    
    // Clear existing options
    propertyTypeSelect.innerHTML = '';
    
    // Add options for selected category
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type.value;
        option.textContent = type.label;
        propertyTypeSelect.appendChild(option);
    });
    
    // Try to preserve current selection if it exists in new category, otherwise select first
    const hasCurrentValue = types.some(t => t.value === currentValue);
    if (hasCurrentValue) {
        propertyTypeSelect.value = currentValue;
    } else if (types.length > 0) {
        propertyTypeSelect.value = types[0].value;
    }
    
    // Update field labels based on category
    updateFieldLabels(category);
}

// Update field labels based on category
function updateFieldLabels(category) {
    const bedroomsLabel = document.getElementById('bedroomsLabel');
    const bathroomsLabel = document.getElementById('bathroomsLabel');
    const bedroomsInput = document.getElementById('bedrooms');
    const kitchensLabel = document.getElementById('kitchensLabel');
    const residentialExtras = document.getElementById('residentialExtras');
    const commercialExtras = document.getElementById('commercialExtras');
    
    if (!bedroomsLabel || !bathroomsLabel) return; // Elements not available yet
    
    if (category === 'commercial') {
        bedroomsLabel.textContent = 'Units/Suites';
        bathroomsLabel.textContent = 'Restrooms';
        if (kitchensLabel) kitchensLabel.textContent = 'Kitchen Areas';
        if (bedroomsInput) bedroomsInput.placeholder = '0 (e.g., number of units/suites)';
        if (residentialExtras) residentialExtras.style.display = 'none';
        if (commercialExtras) commercialExtras.style.display = 'grid';
    } else {
        bedroomsLabel.textContent = 'Bedrooms';
        bathroomsLabel.textContent = 'Bathrooms';
        if (kitchensLabel) kitchensLabel.textContent = 'Kitchens';
        if (bedroomsInput) bedroomsInput.placeholder = '0';
        if (residentialExtras) residentialExtras.style.display = 'grid';
        if (commercialExtras) commercialExtras.style.display = 'none';
    }
    
    // Update amenities visibility
    updateAmenitiesVisibility(category);
}

// Update amenities visibility based on category
function updateAmenitiesVisibility(category) {
    const amenityCheckboxes = document.querySelectorAll('.amenity-checkbox');
    amenityCheckboxes.forEach(label => {
        const checkbox = label.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.dataset.category === category) {
            label.style.display = 'flex';
        } else if (checkbox && checkbox.dataset.category !== category) {
            label.style.display = 'none';
            checkbox.checked = false; // Uncheck amenities from other category
        }
    });
}

// Wait for DOM to load before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Login function
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('loginError');
            
            if (password === ADMIN_PASSWORD) {
                sessionStorage.setItem('adminAuthenticated', 'true');
                showAdminPanel();
            } else {
                errorDiv.textContent = 'Invalid password';
                errorDiv.style.display = 'block';
            }
        });
    }
    
    // Check authentication on page load
    if (checkAuth()) {
        showAdminPanel();
    }
    
    // Initialize property type options based on default category
    // Wait a bit to ensure form elements are available
    setTimeout(() => {
        updatePropertyTypeOptions();
    }, 100);
    
    // Also attach change listener to category dropdown
    const categorySelect = document.getElementById('category');
    if (categorySelect) {
        categorySelect.addEventListener('change', updatePropertyTypeOptions);
    }
    
    // Handle image URLs textarea (on blur or Enter)
    const imageUrlsTextarea = document.getElementById('imageUrls');
    if (imageUrlsTextarea) {
        imageUrlsTextarea.addEventListener('blur', handleImageUrls);
        imageUrlsTextarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                handleImageUrls();
            }
        });
    }
});

// Show admin panel
function showAdminPanel() {
    if (!checkAuth()) {
        // Redirect to admin page (works for both admin.html and admin/index.html)
        const currentPath = window.location.pathname;
        if (currentPath.includes('/admin/') || currentPath === '/admin') {
            window.location.href = '/admin/';
        } else {
            window.location.href = 'admin.html';
        }
        return;
    }
    
    const loginScreen = document.getElementById('loginScreen');
    const adminPanel = document.getElementById('adminPanel');
    
    if (loginScreen) loginScreen.style.display = 'none';
    if (adminPanel) {
        adminPanel.style.display = 'block';
        loadProperties();
        
        // Load contact submissions if on that section
        const activeSection = document.querySelector('.admin-section.active');
        if (activeSection && activeSection.id === 'contact-submissions-section') {
            setTimeout(() => {
                loadContactSubmissions();
            }, 100);
        }
        
        // Initialize property type options when panel is shown
        setTimeout(() => {
            updatePropertyTypeOptions();
        }, 100);
    }
}

// Logout
function logout() {
    sessionStorage.removeItem('adminAuthenticated');
    const currentPath = window.location.pathname;
    if (currentPath.includes('/admin/')) {
        window.location.href = '/admin/';
    } else {
        window.location.href = 'admin.html';
    }
}

// Show section
function showSection(section) {
    // Update nav buttons
    document.querySelectorAll('.admin-nav button').forEach(btn => {
        btn.classList.remove('active');
    });
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Show/hide sections
    document.querySelectorAll('.admin-section').forEach(sec => {
        sec.classList.remove('active');
    });
    const targetSection = document.getElementById(section + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Reset form only if switching to add property AND not editing (no propertyId set)
    if (section === 'add-property' && !document.getElementById('propertyId').value) {
        resetForm();
    }
    
    // Load data when switching sections
    if (section === 'properties') {
        loadProperties();
    } else if (section === 'contact-submissions') {
        loadContactSubmissions();
    }
}

// Get correct path for JSON file based on current location
function getJsonPath() {
    const path = window.location.pathname;
    if (path.includes('/admin/') || path === '/admin' || path.endsWith('/admin')) {
        return '../data/properties.json';
    }
    return 'data/properties.json';
}

// Load properties from JSON file
async function loadProperties() {
    try {
        const response = await fetch(getJsonPath());
        const properties = await response.json();
        displayProperties(properties);
    } catch (error) {
        console.error('Error loading properties:', error);
        // If file doesn't exist, create it with empty array
        if (error.message.includes('404')) {
            await saveProperties([]);
            displayProperties([]);
        }
    }
}

// Display properties in table
function displayProperties(properties) {
    const container = document.getElementById('propertiesList');
    
    if (properties.length === 0) {
        container.innerHTML = '<p>No properties yet. Click "Add New Property" to get started.</p>';
        return;
    }
    
    let html = `
        <table class="properties-table">
            <thead>
                <tr>
                    <th>Address</th>
                    <th>Price</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Details</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    properties.forEach((property, index) => {
        const address = `${property.address.street}, ${property.address.city}, ${property.address.state} ${property.address.zip}`;
        const details = property.category === 'commercial' 
            ? `${property.bathrooms} Baths, ${property.sqft} sqft`
            : `${property.bedrooms} Beds, ${property.bathrooms} Baths, ${property.sqft} sqft`;
        
        html += `
            <tr>
                <td>${address}</td>
                <td>${property.price}</td>
                <td>${property.propertyType || 'N/A'}</td>
                <td>${property.type}</td>
                <td>${details}</td>
                <td>
                    <button class="btn-edit" onclick="editProperty(${index})">Edit</button>
                    <button class="btn-delete" onclick="deleteProperty(${index})">Delete</button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

// Save properties to JSON file
async function saveProperties(properties) {
    // In a real application, you'd send this to a server
    // For now, we'll use localStorage as a fallback and show instructions
    localStorage.setItem('midasProperties', JSON.stringify(properties));
    
    // Try to save to file (this requires a server endpoint)
    try {
        // This would need a backend endpoint to work
        // For now, we'll use localStorage and provide instructions
        return true;
    } catch (error) {
        console.error('Error saving properties:', error);
        return false;
    }
}

// Handle multiple image uploads
function handleMultipleImageUpload(event) {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    
    files.forEach(file => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert(`Skipping ${file.name}: Not an image file`);
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert(`Skipping ${file.name}: File size must be less than 5MB`);
            return;
        }
        
        // Generate unique filename
        const timestamp = Date.now() + Math.random();
        const extension = file.name.split('.').pop();
        const filename = `property-${timestamp}.${extension}`;
        const imagePath = `images/listings/${filename}`;
        
        // Read and add to preview
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImages.push({
                path: imagePath,
                url: e.target.result,
                isMain: uploadedImages.length === 0 // First image is main
            });
            updateImagePreview();
        };
        reader.readAsDataURL(file);
    });
}

// Handle image URLs from textarea
function handleImageUrls() {
    const urlsText = document.getElementById('imageUrls').value.trim();
    if (!urlsText) return;
    
    const urls = urlsText.split('\n').filter(url => url.trim());
    urls.forEach((url, index) => {
        if (url.trim()) {
            uploadedImages.push({
                path: url.trim(),
                url: url.trim(),
                isMain: uploadedImages.length === 0 && index === 0
            });
        }
    });
    updateImagePreview();
    document.getElementById('imageUrls').value = '';
}

// Update image preview display
function updateImagePreview() {
    const preview = document.getElementById('imagePreview');
    if (uploadedImages.length === 0) {
        preview.innerHTML = '';
        return;
    }
    
    preview.innerHTML = uploadedImages.map((img, index) => `
        <div class="image-preview-item ${img.isMain ? 'main-image' : ''}" data-index="${index}">
            <img src="${img.url}" alt="Preview ${index + 1}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'150\\' height=\\'150\\'%3E%3Crect fill=\\'%23ddd\\' width=\\'150\\' height=\\'150\\'/%3E%3Ctext fill=\\'%23999\\' font-family=\\'sans-serif\\' font-size=\\'14\\' x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\'%3EImage%3C/text%3E%3C/svg%3E';">
            ${!img.isMain ? `<button type="button" class="set-main" onclick="setMainImage(${index})">Set Main</button>` : ''}
            <button type="button" class="remove-image" onclick="removeImage(${index})">×</button>
        </div>
    `).join('');
}

// Set main image
function setMainImage(index) {
    uploadedImages.forEach((img, i) => {
        img.isMain = (i === index);
    });
    updateImagePreview();
}

// Remove image
function removeImage(index) {
    uploadedImages.splice(index, 1);
    // If we removed the main image and there are still images, make the first one main
    if (uploadedImages.length > 0 && !uploadedImages.some(img => img.isMain)) {
        uploadedImages[0].isMain = true;
    }
    updateImagePreview();
}

// Clear all images
function clearAllImages() {
    uploadedImages = [];
    document.getElementById('imageFiles').value = '';
    document.getElementById('imageUrls').value = '';
    updateImagePreview();
}

// Add/Edit property form handler
document.getElementById('propertyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Handle image URLs from textarea
    handleImageUrls();
    
    // Get images - use uploadedImages array
    let images = [];
    if (uploadedImages.length > 0) {
        images = uploadedImages.map(img => img.path);
    } else {
        // Fallback to emoji if no images
        images = ['🏠'];
    }
    
    // Get main image (first image or marked as main)
    const mainImage = uploadedImages.find(img => img.isMain) || uploadedImages[0];
    const image = mainImage ? mainImage.path : (images[0] || '🏠');
    
    // Get selected amenities
    const selectedAmenities = [];
    const amenityCheckboxes = document.querySelectorAll('#amenitiesContainer input[type="checkbox"]:checked');
    amenityCheckboxes.forEach(checkbox => {
        selectedAmenities.push(checkbox.value);
    });
    
    // Get utilities included
    const utilities = {
        water: document.getElementById('waterIncluded').checked ? 'Yes' : 'No',
        gas: document.getElementById('gasIncluded').checked ? 'Yes' : 'No',
        electricity: document.getElementById('electricityIncluded').checked ? 'Yes' : 'No',
        sewer: document.getElementById('sewerIncluded').checked ? 'Yes' : 'No',
        trash: document.getElementById('trashIncluded').checked ? 'Yes' : 'No',
        internet: document.getElementById('internetIncluded').checked ? 'Yes' : 'No'
    };
    
    const property = {
        id: Date.now(),
        address: {
            street: document.getElementById('addressStreet').value,
            city: document.getElementById('addressCity').value,
            state: document.getElementById('addressState').value.toUpperCase(),
            zip: document.getElementById('addressZip').value
        },
        price: document.getElementById('price').value,
        bedrooms: parseInt(document.getElementById('bedrooms').value) || null,
        bathrooms: parseFloat(document.getElementById('bathrooms').value) || null,
        sqft: document.getElementById('sqft').value,
        kitchens: parseInt(document.getElementById('kitchens').value) || null,
        floors: parseInt(document.getElementById('floors').value) || null,
        yearBuilt: document.getElementById('yearBuilt').value || null,
        heatingType: document.getElementById('heatingType').value || null,
        centralAir: document.getElementById('centralAir').value || null,
        gasAvailable: document.getElementById('gasAvailable').value || null,
        lotSize: document.getElementById('lotSize').value || null,
        basement: document.getElementById('basement').value || null,
        condition: document.getElementById('condition').value || null,
        parkingSpaces: document.getElementById('parkingSpaces').value || null,
        zoning: document.getElementById('zoning').value || null,
        buildingClass: document.getElementById('buildingClass').value || null,
        utilities: utilities,
        type: document.getElementById('status').value,
        category: document.getElementById('category').value,
        propertyType: document.getElementById('propertyType').value,
        description: document.getElementById('description').value || '',
        amenities: selectedAmenities,
        image: image, // Main/featured image
        images: images, // All images array
        mlsNumber: document.getElementById('mlsNumber').value || undefined
    };
    
    try {
        // Try relative path first, then absolute
        let jsonPath = 'data/properties.json';
        if (window.location.pathname.includes('/admin/')) {
            jsonPath = '../data/properties.json';
        }
        const response = await fetch(jsonPath);
        let properties = [];
        
        if (response.ok) {
            properties = await response.json();
        }
        
        const propertyId = document.getElementById('propertyId').value;
        if (propertyId) {
            // Edit existing - preserve the original ID
            const index = parseInt(propertyId);
            property.id = properties[index].id; // Preserve original ID
            properties[index] = property; // Replace entire property object
        } else {
            // Add new
            properties.push(property);
        }
        
        // Save to localStorage (temporary solution)
        localStorage.setItem('midasProperties', JSON.stringify(properties));
        
        // Update script.js file (this requires a server endpoint)
        updateScriptFile(properties);
        
        document.getElementById('formMessage').innerHTML = 
            '<div class="success-message">Property saved successfully! Refresh the main website to see changes.</div>';
        
        setTimeout(() => {
            resetForm();
            showSection('properties');
            loadProperties();
        }, 2000);
        
    } catch (error) {
        document.getElementById('formMessage').innerHTML = 
            '<div class="error-message">Error saving property. Please try again.</div>';
        console.error('Error:', error);
    }
});

// Update script.js with new properties
function updateScriptFile(properties) {
    // This is a simplified version - in production, you'd use a backend API
    // For now, we'll store in localStorage and provide instructions
    console.log('Properties updated. To apply changes:');
    console.log('1. Copy properties from localStorage');
    console.log('2. Update the properties array in script.js');
    console.log('Or set up a backend API to handle file updates');
}

// Edit property
async function editProperty(index) {
    try {
        const response = await fetch(getJsonPath());
        const properties = await response.json();
        const property = properties[index];
        
        // Clear uploadedImages array first
        uploadedImages = [];
        
        // Load all images from property into uploadedImages array
        if (property.images && Array.isArray(property.images) && property.images.length > 0) {
            property.images.forEach((imgPath, imgIndex) => {
                // Determine if this is the main image
                const isMain = imgPath === property.image || (imgIndex === 0 && !property.image);
                uploadedImages.push({
                    path: imgPath,
                    url: imgPath, // Use path as URL for preview
                    isMain: isMain
                });
            });
        } else if (property.image && property.image !== '🏠') {
            // Fallback: if only single image exists
            uploadedImages.push({
                path: property.image,
                url: property.image,
                isMain: true
            });
        }
        
        // Populate form fields
        document.getElementById('propertyId').value = index;
        document.getElementById('addressStreet').value = property.address.street || '';
        document.getElementById('addressCity').value = property.address.city || '';
        document.getElementById('addressState').value = property.address.state || '';
        document.getElementById('addressZip').value = property.address.zip || '';
        document.getElementById('price').value = property.price || '';
        document.getElementById('bedrooms').value = property.bedrooms || 0;
        document.getElementById('bathrooms').value = property.bathrooms || 0;
        document.getElementById('sqft').value = property.sqft || '';
        document.getElementById('kitchens').value = property.kitchens || 1;
        document.getElementById('floors').value = property.floors || 1;
        document.getElementById('yearBuilt').value = property.yearBuilt || '';
        document.getElementById('heatingType').value = property.heatingType || '';
        document.getElementById('centralAir').value = property.centralAir || '';
        document.getElementById('gasAvailable').value = property.gasAvailable || '';
        document.getElementById('lotSize').value = property.lotSize || '';
        document.getElementById('basement').value = property.basement || '';
        document.getElementById('condition').value = property.condition || '';
        document.getElementById('parkingSpaces').value = property.parkingSpaces || '';
        document.getElementById('zoning').value = property.zoning || '';
        document.getElementById('buildingClass').value = property.buildingClass || '';
        
        // Set utilities
        if (property.utilities) {
            document.getElementById('waterIncluded').checked = property.utilities.water === 'Yes';
            document.getElementById('gasIncluded').checked = property.utilities.gas === 'Yes';
            document.getElementById('electricityIncluded').checked = property.utilities.electricity === 'Yes';
            document.getElementById('sewerIncluded').checked = property.utilities.sewer === 'Yes';
            document.getElementById('trashIncluded').checked = property.utilities.trash === 'Yes';
            document.getElementById('internetIncluded').checked = property.utilities.internet === 'Yes';
        } else {
            // Reset utilities if not set
            document.getElementById('waterIncluded').checked = false;
            document.getElementById('gasIncluded').checked = false;
            document.getElementById('electricityIncluded').checked = false;
            document.getElementById('sewerIncluded').checked = false;
            document.getElementById('trashIncluded').checked = false;
            document.getElementById('internetIncluded').checked = false;
        }
        
        document.getElementById('status').value = property.type || 'For Sale';
        document.getElementById('category').value = property.category || 'residential';
        
        // Update property type options and field labels first, then set the value
        updatePropertyTypeOptions(); // This will also call updateFieldLabels
        document.getElementById('propertyType').value = property.propertyType || (property.category === 'commercial' ? 'Retail Space' : 'House');
        document.getElementById('description').value = property.description || '';
        
        // Set amenities
        const amenityCheckboxes = document.querySelectorAll('#amenitiesContainer input[type="checkbox"]');
        amenityCheckboxes.forEach(checkbox => {
            checkbox.checked = property.amenities && property.amenities.includes(checkbox.value);
        });
        
        // Clear image input fields
        document.getElementById('imageFiles').value = '';
        document.getElementById('imageUrls').value = '';
        
        // Update image preview with all images
        updateImagePreview();
        
        document.getElementById('mlsNumber').value = property.mlsNumber || '';
        
        document.getElementById('formTitle').textContent = 'Edit Property';
        
        // Show add-property section without resetting form
        document.querySelectorAll('.admin-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById('add-property-section').classList.add('active');
        
        // Update nav buttons
        document.querySelectorAll('.admin-nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        const addPropertyBtn = document.querySelector('.admin-nav button:last-child');
        if (addPropertyBtn) addPropertyBtn.classList.add('active');
        
    } catch (error) {
        console.error('Error loading property:', error);
        alert('Error loading property. Please try again.');
    }
}

// Delete property
async function deleteProperty(index) {
    if (!confirm('Are you sure you want to delete this property?')) {
        return;
    }
    
    try {
        const response = await fetch(getJsonPath());
        let properties = await response.json();
        
        properties.splice(index, 1);
        localStorage.setItem('midasProperties', JSON.stringify(properties));
        
        loadProperties();
    } catch (error) {
        console.error('Error deleting property:', error);
    }
}

// Reset form
function resetForm() {
    document.getElementById('propertyForm').reset();
    document.getElementById('propertyId').value = '';
    document.getElementById('formTitle').textContent = 'Add New Property';
    document.getElementById('formMessage').innerHTML = '';
    document.getElementById('bedrooms').value = '0';
    document.getElementById('bathrooms').value = '0';
    document.getElementById('kitchens').value = '1';
    document.getElementById('floors').value = '1';
    document.getElementById('yearBuilt').value = '';
    document.getElementById('heatingType').value = '';
    document.getElementById('centralAir').value = '';
    document.getElementById('gasAvailable').value = '';
    document.getElementById('lotSize').value = '';
    document.getElementById('basement').value = '';
    document.getElementById('condition').value = '';
    document.getElementById('parkingSpaces').value = '';
    document.getElementById('zoning').value = '';
    document.getElementById('buildingClass').value = '';
    document.getElementById('description').value = '';
    
    // Clear all images
    clearAllImages();
    
    // Uncheck all utilities
    document.getElementById('waterIncluded').checked = false;
    document.getElementById('gasIncluded').checked = false;
    document.getElementById('electricityIncluded').checked = false;
    document.getElementById('sewerIncluded').checked = false;
    document.getElementById('trashIncluded').checked = false;
    document.getElementById('internetIncluded').checked = false;
    
    // Uncheck all amenities
    const amenityCheckboxes = document.querySelectorAll('#amenitiesContainer input[type="checkbox"]');
    amenityCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) imagePreview.innerHTML = '';
    const imageFile = document.getElementById('imageFile');
    if (imageFile) imageFile.value = '';
    // Reset property type options to default (residential)
    updatePropertyTypeOptions();
}

// Batch Import Functions
let batchImportData = [];

// Handle batch file selection
function handleBatchFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const extension = file.name.split('.').pop().toLowerCase();
    
    // Check if it's a CSV file
    if (extension !== 'csv' && extension !== 'txt') {
        alert('Please upload a CSV file. If you have an Excel file, please save it as CSV first (File → Save As → CSV).');
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        
        try {
            parseCSV(content);
        } catch (error) {
            alert('Error parsing CSV file: ' + error.message + '\n\nPlease check that:\n1. The file is a valid CSV\n2. It has a header row\n3. Data rows are properly formatted');
            console.error('Parse error:', error);
            event.target.value = '';
        }
    };
    
    reader.onerror = () => {
        alert('Error reading file. Please try again.');
        event.target.value = '';
    };
    
    reader.readAsText(file, 'UTF-8');
}

// Parse CSV file
function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
        alert('CSV file must have at least a header row and one data row.');
        return;
    }
    
    // Parse header
    const headers = parseCSVLine(lines[0]);
    
    // Parse data rows
    batchImportData = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length === 0) continue;
        
        const property = mapCSVRowToProperty(headers, values);
        if (property) {
            batchImportData.push(property);
        }
    }
    
    showBatchPreview();
}

// Parse CSV line (handles quoted values and Excel-style formatting)
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote (double quote)
                current += '"';
                i++; // Skip next quote
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // Field separator
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    // Add the last field
    result.push(current.trim());
    
    // Clean up quoted fields (remove surrounding quotes if present)
    return result.map(field => {
        if (field.startsWith('"') && field.endsWith('"')) {
            return field.slice(1, -1).replace(/""/g, '"');
        }
        return field;
    });
}

// Parse JSON file
function parseJSON(jsonText) {
    const data = JSON.parse(jsonText);
    
    // Handle array of properties
    if (Array.isArray(data)) {
        batchImportData = data.map(item => mapJSONToProperty(item)).filter(p => p !== null);
    } else if (data.properties || data.listings) {
        // Handle object with properties/listings array
        const propertiesArray = data.properties || data.listings;
        batchImportData = propertiesArray.map(item => mapJSONToProperty(item)).filter(p => p !== null);
    } else {
        // Single property object
        const property = mapJSONToProperty(data);
        batchImportData = property ? [property] : [];
    }
    
    showBatchPreview();
}

// Map CSV row to property object
function mapCSVRowToProperty(headers, values) {
    const row = {};
    headers.forEach((header, index) => {
        row[header.toLowerCase().trim()] = values[index] || '';
    });
    
    return mapMLSDataToProperty(row);
}

// Map JSON object to property
function mapJSONToProperty(data) {
    return mapMLSDataToProperty(data);
}

// Map MLS data (CSV or JSON) to our property format
function mapMLSDataToProperty(mlsData) {
    // Common MLS field mappings
    const fieldMap = {
        // Address fields
        'street': ['street', 'streetaddress', 'address', 'street address', 'propertyaddress', 'property address'],
        'city': ['city', 'propertycity', 'property city'],
        'state': ['state', 'propertystate', 'property state', 'st'],
        'zip': ['zip', 'zipcode', 'zip code', 'postalcode', 'postal code'],
        
        // Basic property info
        'price': ['price', 'listprice', 'list price', 'saleprice', 'sale price', 'askingprice', 'asking price'],
        'bedrooms': ['bedrooms', 'beds', 'bedrooms_total', 'totalbedrooms', 'total bedrooms'],
        'bathrooms': ['bathrooms', 'baths', 'bathrooms_total', 'totalbathrooms', 'total bathrooms'],
        'sqft': ['sqft', 'squarefeet', 'square feet', 'squarefootage', 'square footage', 'livingarea', 'living area'],
        'propertyType': ['propertytype', 'property type', 'proptype', 'prop type', 'type'],
        'category': ['category', 'propertycategory', 'property category'],
        'status': ['status', 'listingstatus', 'listing status', 'salestatus', 'sale status'],
        
        // Additional fields
        'yearBuilt': ['yearbuilt', 'year built', 'year', 'built'],
        'lotSize': ['lotsize', 'lot size', 'lotsqft', 'lot sqft'],
        'description': ['description', 'remarks', 'publicremarks', 'public remarks', 'listingremarks', 'listing remarks'],
        'mlsNumber': ['mlsnumber', 'mls number', 'mls', 'listingid', 'listing id', 'mlsid', 'mls id'],
        
        // Images
        'images': ['images', 'photos', 'photourl', 'photo url', 'photourls', 'photo urls', 'imageurls', 'image urls'],
        'image': ['image', 'mainimage', 'main image', 'primaryphoto', 'primary photo', 'photourl', 'photo url']
    };
    
    function findValue(fieldName) {
        const possibleKeys = fieldMap[fieldName] || [fieldName];
        for (const key of possibleKeys) {
            // Try exact match first
            if (mlsData[key] !== undefined && mlsData[key] !== '') {
                return mlsData[key];
            }
            // Try case-insensitive match
            const lowerKey = key.toLowerCase();
            for (const dataKey in mlsData) {
                if (dataKey.toLowerCase() === lowerKey) {
                    return mlsData[dataKey];
                }
            }
        }
        return null;
    }
    
    // Build address object
    const street = findValue('street') || '';
    const city = findValue('city') || '';
    const state = findValue('state') || '';
    const zip = findValue('zip') || '';
    
    if (!street && !city) {
        // Try to parse full address
        const fullAddress = findValue('address') || findValue('fulladdress') || '';
        if (fullAddress) {
            // Simple address parsing (can be improved)
            const parts = fullAddress.split(',').map(p => p.trim());
            if (parts.length >= 2) {
                return mapMLSDataToProperty({
                    ...mlsData,
                    street: parts[0],
                    city: parts[1],
                    state: parts[2] || state,
                    zip: parts[3] || zip
                });
            }
        }
    }
    
    // Get images
    let images = [];
    const imagesValue = findValue('images');
    if (imagesValue) {
        if (Array.isArray(imagesValue)) {
            images = imagesValue;
        } else if (typeof imagesValue === 'string') {
            // Try to parse as JSON array or comma-separated
            try {
                images = JSON.parse(imagesValue);
            } catch {
                images = imagesValue.split(',').map(url => url.trim()).filter(url => url);
            }
        }
    }
    
    // Fallback to single image field
    if (images.length === 0) {
        const singleImage = findValue('image');
        if (singleImage) {
            images = [singleImage];
        }
    }
    
    // Determine category
    let category = findValue('category') || 'residential';
    if (category) {
        category = category.toLowerCase();
        if (!['residential', 'commercial'].includes(category)) {
            // Try to infer from property type
            const propType = (findValue('propertyType') || '').toLowerCase();
            if (propType.includes('commercial') || propType.includes('retail') || propType.includes('office') || propType.includes('warehouse')) {
                category = 'commercial';
            } else {
                category = 'residential';
            }
        }
    }
    
    // Determine status/type
    let status = findValue('status') || 'For Sale';
    if (status) {
        status = status.toString();
        if (!['For Sale', 'For Rent', 'Sold'].includes(status)) {
            const statusLower = status.toLowerCase();
            if (statusLower.includes('rent') || statusLower.includes('lease')) {
                status = 'For Rent';
            } else if (statusLower.includes('sold') || statusLower.includes('closed')) {
                status = 'Sold';
            } else {
                status = 'For Sale';
            }
        }
    }
    
    // Build property object
    const property = {
        id: Date.now() + Math.random(), // Generate unique ID
        address: {
            street: street || 'Address TBD',
            city: city || '',
            state: (state || '').toUpperCase().substring(0, 2) || 'NY',
            zip: zip || ''
        },
        price: findValue('price') || '$0',
        bedrooms: parseInt(findValue('bedrooms')) || null,
        bathrooms: parseFloat(findValue('bathrooms')) || null,
        sqft: findValue('sqft') || '',
        kitchens: parseInt(findValue('kitchens')) || null,
        floors: parseInt(findValue('floors')) || null,
        yearBuilt: findValue('yearBuilt') || null,
        heatingType: findValue('heatingType') || null,
        centralAir: findValue('centralAir') || null,
        gasAvailable: findValue('gasAvailable') || null,
        lotSize: findValue('lotSize') || null,
        basement: findValue('basement') || null,
        condition: findValue('condition') || null,
        parkingSpaces: findValue('parkingSpaces') || null,
        zoning: findValue('zoning') || null,
        buildingClass: findValue('buildingClass') || null,
        type: status,
        category: category,
        propertyType: findValue('propertyType') || (category === 'commercial' ? 'Retail Space' : 'House'),
        description: findValue('description') || '',
        amenities: [],
        image: images.length > 0 ? images[0] : '🏠',
        images: images.length > 0 ? images : ['🏠'],
        mlsNumber: findValue('mlsNumber') || undefined
    };
    
    return property;
}

// Show batch preview
function showBatchPreview() {
    if (batchImportData.length === 0) {
        alert('No valid properties found in the file.');
        return;
    }
    
    document.getElementById('previewCount').textContent = batchImportData.length;
    const previewTable = document.getElementById('batchPreviewTable');
    
    // Create preview table
    let tableHTML = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: var(--primary-color); color: white;">
                    <th style="padding: 0.75rem; text-align: left;">Address</th>
                    <th style="padding: 0.75rem; text-align: left;">Price</th>
                    <th style="padding: 0.75rem; text-align: left;">Type</th>
                    <th style="padding: 0.75rem; text-align: left;">Beds/Baths</th>
                    <th style="padding: 0.75rem; text-align: left;">Images</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    batchImportData.forEach((property, index) => {
        const address = property.address.street || 'N/A';
        const imageCount = property.images ? property.images.length : (property.image ? 1 : 0);
        tableHTML += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 0.75rem;">${address}</td>
                <td style="padding: 0.75rem;">${property.price}</td>
                <td style="padding: 0.75rem;">${property.propertyType}</td>
                <td style="padding: 0.75rem;">${property.bedrooms || 0}/${property.bathrooms || 0}</td>
                <td style="padding: 0.75rem;">${imageCount} image(s)</td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    previewTable.innerHTML = tableHTML;
    document.getElementById('batchPreview').style.display = 'block';
}

// Process batch import
async function processBatchImport() {
    if (batchImportData.length === 0) {
        alert('No properties to import.');
        return;
    }
    
    const progressDiv = document.getElementById('batchProgress');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const resultsDiv = document.getElementById('batchResults');
    const resultsContent = document.getElementById('batchResultsContent');
    
    progressDiv.style.display = 'block';
    document.getElementById('batchPreview').style.display = 'none';
    
    try {
        // Load existing properties
        const response = await fetch(getJsonPath());
        let existingProperties = [];
        if (response.ok) {
            existingProperties = await response.json();
        }
        
        const results = {
            success: 0,
            failed: 0,
            errors: []
        };
        
        // Import each property
        for (let i = 0; i < batchImportData.length; i++) {
            const property = batchImportData[i];
            
            try {
                // Add property to existing properties
                existingProperties.push(property);
                results.success++;
            } catch (error) {
                results.failed++;
                results.errors.push(`Property ${i + 1} (${property.address.street || 'Unknown'}): ${error.message}`);
            }
            
            // Update progress
            const percent = Math.round(((i + 1) / batchImportData.length) * 100);
            progressBar.style.width = percent + '%';
            progressBar.textContent = percent + '%';
            progressText.textContent = `Imported ${i + 1} of ${batchImportData.length} properties...`;
        }
        
        // Save all properties
        localStorage.setItem('midasProperties', JSON.stringify(existingProperties));
        
        // Show results
        progressDiv.style.display = 'none';
        resultsDiv.style.display = 'block';
        
        let resultsHTML = `
            <h4 style="color: var(--success-color); margin-top: 0;">✅ Successfully imported ${results.success} properties</h4>
        `;
        
        if (results.failed > 0) {
            resultsHTML += `
                <h4 style="color: #f44336;">❌ Failed to import ${results.failed} properties</h4>
                <ul style="color: #666;">
                    ${results.errors.map(err => `<li>${err}</li>`).join('')}
                </ul>
            `;
        }
        
        resultsContent.innerHTML = resultsHTML;
        
        // Clear batch data
        batchImportData = [];
        document.getElementById('batchFile').value = '';
        
    } catch (error) {
        alert('Error during batch import: ' + error.message);
        console.error('Batch import error:', error);
    }
}

// Contact Submissions Functions
function loadContactSubmissions() {
    try {
        // Load from localStorage
        const stored = localStorage.getItem('midasContactSubmissions');
        console.log('Loading contact submissions from localStorage. Raw data:', stored);
        
        if (!stored || stored === 'null' || stored === 'undefined') {
            console.log('No submissions found in localStorage');
            displayContactSubmissions([]);
            return;
        }
        
        const submissions = JSON.parse(stored);
        console.log('Parsed submissions:', submissions);
        console.log('Number of submissions:', submissions.length);
        
        if (!Array.isArray(submissions)) {
            console.error('Submissions is not an array:', submissions);
            displayContactSubmissions([]);
            return;
        }
        
        displayContactSubmissions(submissions);
    } catch (error) {
        console.error('Error loading contact submissions:', error);
        const container = document.getElementById('contactSubmissionsList');
        if (container) {
            container.innerHTML = `<p style="padding: 2rem; text-align: center; color: #ef4444;">Error loading submissions: ${error.message}<br>Check browser console for details.</p>`;
        }
    }
}

function displayContactSubmissions(submissions) {
    const container = document.getElementById('contactSubmissionsList');
    
    if (!container) {
        console.error('Contact submissions container not found');
        return;
    }
    
    if (!submissions || submissions.length === 0) {
        container.innerHTML = '<p style="padding: 2rem; text-align: center; color: #64748b;">No contact submissions yet.</p>';
        return;
    }
    
    let html = `
        <table class="properties-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Message</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    submissions.forEach(submission => {
        const messagePreview = submission.message.length > 100 
            ? submission.message.substring(0, 100) + '...' 
            : submission.message;
        
        html += `
            <tr>
                <td>${submission.date || new Date(submission.timestamp).toLocaleString()}</td>
                <td><strong>${submission.name}</strong></td>
                <td><a href="mailto:${submission.email}" style="color: #2196F3;">${submission.email}</a></td>
                <td>${submission.phone || '<em style="color: #94a3b8;">Not provided</em>'}</td>
                <td>
                    <div style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;" title="${submission.message.replace(/"/g, '&quot;')}">
                        ${messagePreview}
                    </div>
                </td>
                <td>
                    <button class="btn-edit" onclick="viewContactSubmission(${submission.id})">View</button>
                    <button class="btn-delete" onclick="deleteContactSubmission(${submission.id})">Delete</button>
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

function viewContactSubmission(id) {
    const submissions = JSON.parse(localStorage.getItem('midasContactSubmissions') || '[]');
    const submission = submissions.find(s => s.id === id);
    
    if (!submission) {
        alert('Submission not found.');
        return;
    }
    
    const details = `
Name: ${submission.name}
Email: ${submission.email}
Phone: ${submission.phone || 'Not provided'}
Date: ${submission.date || new Date(submission.timestamp).toLocaleString()}

Message:
${submission.message}
    `;
    
    alert(details);
}

function deleteContactSubmission(id) {
    if (!confirm('Are you sure you want to delete this contact submission?')) {
        return;
    }
    
    try {
        const submissions = JSON.parse(localStorage.getItem('midasContactSubmissions') || '[]');
        const filtered = submissions.filter(s => s.id !== id);
        localStorage.setItem('midasContactSubmissions', JSON.stringify(filtered));
        loadContactSubmissions();
    } catch (error) {
        console.error('Error deleting submission:', error);
        alert('Error deleting submission.');
    }
}

// Cancel edit
function cancelEdit() {
    resetForm();
    showSection('properties');
    document.querySelector('.admin-nav button:first-child').click();
}

// Initialization is handled in DOMContentLoaded above
