// Admin Panel JavaScript
const ADMIN_PASSWORD = 'midas2024'; // Change this to a secure password

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
    event.target.classList.add('active');
    
    // Show/hide sections
    document.querySelectorAll('.admin-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(section + '-section').classList.add('active');
    
    // Reset form if switching to add property
    if (section === 'add-property') {
        resetForm();
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

// Handle image upload
let uploadedImagePath = null;

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `property-${timestamp}.${extension}`;
    uploadedImagePath = `images/listings/${filename}`;
    
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = `
            <div class="image-preview-item">
                <img src="${e.target.result}" alt="Preview">
                <button type="button" class="remove-image" onclick="removeImagePreview()">×</button>
            </div>
            <p style="grid-column: 1/-1; font-size: 0.85rem; color: #666; margin-top: 0.5rem;">
                Will be saved as: ${uploadedImagePath}<br>
                <strong>Note:</strong> You'll need to manually copy this file to the /images/listings/ folder, or set up a backend to handle uploads.
            </p>
        `;
        document.getElementById('image').value = uploadedImagePath;
    };
    reader.readAsDataURL(file);
}

function removeImagePreview() {
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('imageFile').value = '';
    uploadedImagePath = null;
    document.getElementById('image').value = '';
}

// Add/Edit property form handler
document.getElementById('propertyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get image value (from upload or manual entry)
    let imageValue = document.getElementById('image').value || '🏠';
    
    // If image was uploaded, save it (in a real app, this would upload to server)
    if (uploadedImagePath && document.getElementById('imageFile').files.length > 0) {
        // For static site: save file info and provide instructions
        const file = document.getElementById('imageFile').files[0];
        const fileData = {
            name: uploadedImagePath.split('/').pop(),
            path: uploadedImagePath,
            size: file.size,
            type: file.type
        };
        
        // Store file info in localStorage for reference
        const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
        uploadedFiles.push(fileData);
        localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
        
        // Show instructions
        alert(`Image ready to upload!\n\nTo complete the upload:\n1. Copy the file to: ${uploadedImagePath}\n2. Or use the file data stored in localStorage\n\nFor now, the path "${uploadedImagePath}" has been saved.`);
    }
    
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
        type: document.getElementById('status').value,
        category: document.getElementById('category').value,
        propertyType: document.getElementById('propertyType').value,
        image: imageValue,
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
            // Edit existing
            const index = parseInt(propertyId);
            properties[index] = { ...properties[index], ...property };
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
        
        document.getElementById('propertyId').value = index;
        document.getElementById('addressStreet').value = property.address.street;
        document.getElementById('addressCity').value = property.address.city;
        document.getElementById('addressState').value = property.address.state;
        document.getElementById('addressZip').value = property.address.zip;
        document.getElementById('price').value = property.price;
        document.getElementById('bedrooms').value = property.bedrooms || 0;
        document.getElementById('bathrooms').value = property.bathrooms || 0;
        document.getElementById('sqft').value = property.sqft;
        document.getElementById('status').value = property.type;
        document.getElementById('category').value = property.category;
        // Update property type options first, then set the value
        updatePropertyTypeOptions();
        document.getElementById('propertyType').value = property.propertyType || (property.category === 'commercial' ? 'Retail Space' : 'House');
        document.getElementById('image').value = property.image || '🏠';
        document.getElementById('imageFile').value = '';
        
        // Show image preview if it's a URL or path
        if (property.image && (property.image.startsWith('http') || property.image.startsWith('images/'))) {
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = `
                <div class="image-preview-item">
                    <img src="${property.image}" alt="Current image" onerror="this.parentElement.innerHTML='<p style=\\'color:red;\\'>Image not found</p>'">
                </div>
            `;
        } else {
            document.getElementById('imagePreview').innerHTML = '';
        }
        document.getElementById('mlsNumber').value = property.mlsNumber || '';
        
        document.getElementById('formTitle').textContent = 'Edit Property';
        showSection('add-property');
        document.querySelector('.admin-nav button:last-child').click();
    } catch (error) {
        console.error('Error loading property:', error);
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
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) imagePreview.innerHTML = '';
    const imageFile = document.getElementById('imageFile');
    if (imageFile) imageFile.value = '';
    // Reset property type options to default (residential)
    updatePropertyTypeOptions();
}

// Cancel edit
function cancelEdit() {
    resetForm();
    showSection('properties');
    document.querySelector('.admin-nav button:first-child').click();
}

// Initialization is handled in DOMContentLoaded above
