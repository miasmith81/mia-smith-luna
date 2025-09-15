/**
 * Portfolio Website - Main JavaScript
 * Refactored implementation with best practices
 * 
 * Features:
 * - Message form handling with conditional thank you messages
 * - Dynamic message list with edit/remove functionality
 * - Skills section initialization
 * - Footer generation
 */

'use strict';

// ==========================================
// CONFIGURATION
// ==========================================

const CONFIG = {
    selectors: {
        messageForm: 'form[name="leave_message"]',
        messageSection: '#messages',
        messageList: '#message-list',
        skillsSection: '#skills',
        formFields: {
            name: 'usersName',
            email: 'usersEmail',
            message: 'usersMessage'
        }
    },
    messages: {
        withMessage: (name) => `Thank you ${name} for your message and visiting my portfolio page. I will get back to you as soon as possible and have a wonderful day.`,
        withoutMessage: (name) => `Thank you ${name} for visiting my portfolio page and have a wonderful day.`,
        validation: {
            name: 'Please enter your name',
            email: 'Please enter your email',
            invalidEmail: 'Please enter a valid email address'
        }
    },
    timing: {
        thankYouDuration: 5000
    },
    skills: [
        "HTML5 & Semantic Markup",
        "CSS3 & Modern Layouts",
        "JavaScript (ES6+)",
        "React.js",
        "Node.js",
        "Express.js",
        "MongoDB",
        "RESTful APIs",
        "Git Version Control",
        "Responsive Design",
        "Web Accessibility",
        "MERN Stack"
    ]
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Sanitize user input to prevent XSS
 * @param {string} str - String to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeInput(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ==========================================
// MESSAGE FORM FUNCTIONALITY
// ==========================================

class MessageFormHandler {
    constructor() {
        this.form = document.querySelector(CONFIG.selectors.messageForm);
        this.messageSection = document.querySelector(CONFIG.selectors.messageSection);
        this.messageList = document.querySelector(CONFIG.selectors.messageList);
        
        this.init();
    }
    
    /**
     * Initialize the message form handler
     */
    init() {
        // Hide messages section initially
        this.hideMessagesSection();
        
        // Set up form submission handler
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
    
    /**
     * Handle form submission
     * @param {Event} event - Submit event
     */
    handleSubmit(event) {
        event.preventDefault();
        
        // Extract and trim form values
        const formData = this.extractFormData(event.target);
        
        // Log values as required
        console.log(formData.name, formData.email, formData.message);
        
        // Validate form
        if (!this.validateForm(formData)) {
            return;
        }
        
        // Clear any existing thank you messages
        this.clearThankYouMessages();
        
        // Process submission based on message presence
        if (formData.message) {
            // User provided a message
            this.handleSubmissionWithMessage(formData);
        } else {
            // No message provided
            this.handleSubmissionWithoutMessage(formData);
        }
        
        // Reset the form
        this.form.reset();
    }
    
    /**
     * Extract form data
     * @param {HTMLFormElement} form - Form element
     * @returns {Object} - Form data
     */
    extractFormData(form) {
        return {
            name: form[CONFIG.selectors.formFields.name].value.trim(),
            email: form[CONFIG.selectors.formFields.email].value.trim(),
            message: form[CONFIG.selectors.formFields.message].value.trim()
        };
    }
    
    /**
     * Validate form data
     * @param {Object} formData - Form data to validate
     * @returns {boolean} - True if valid
     */
    validateForm(formData) {
        // Validate name
        if (!formData.name) {
            alert(CONFIG.messages.validation.name);
            return false;
        }
        
        // Validate email presence
        if (!formData.email) {
            alert(CONFIG.messages.validation.email);
            return false;
        }
        
        // Validate email format
        if (!isValidEmail(formData.email)) {
            alert(CONFIG.messages.validation.invalidEmail);
            return false;
        }
        
        return true;
    }
    
    /**
     * Handle submission when message is provided
     * @param {Object} formData - Form data
     */
    handleSubmissionWithMessage(formData) {
        // Create message list item
        this.createMessageListItem(formData);
        
        // Show messages section
        this.showMessagesSection();
        
        // Show appropriate thank you message
        this.showThankYouMessage(CONFIG.messages.withMessage(formData.name));
    }
    
    /**
     * Handle submission when no message is provided
     * @param {Object} formData - Form data
     */
    handleSubmissionWithoutMessage(formData) {
        // Don't create list item or show messages section
        // Just show thank you message
        this.showThankYouMessage(CONFIG.messages.withoutMessage(formData.name));
    }
    
    /**
     * Create a message list item with edit and remove functionality
     * @param {Object} data - Message data
     */
    createMessageListItem(data) {
        if (!this.messageList) return;
        
        // Create list item
        const li = document.createElement('li');
        li.className = 'message-item';
        
        // Create message content container
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Create email link
        const emailLink = document.createElement('a');
        emailLink.href = `mailto:${sanitizeInput(data.email)}`;
        emailLink.textContent = sanitizeInput(data.name);
        emailLink.className = 'message-sender';
        
        // Create message text
        const messageText = document.createElement('span');
        messageText.className = 'message-text';
        messageText.textContent = sanitizeInput(data.message);
        
        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'message-buttons';
        
        // Create edit button
        const editButton = this.createEditButton(messageText);
        
        // Create remove button
        const removeButton = this.createRemoveButton(li);
        
        // Assemble the components
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(removeButton);
        
        messageContent.appendChild(emailLink);
        messageContent.appendChild(messageText);
        messageContent.appendChild(buttonContainer);
        
        li.appendChild(messageContent);
        
        // Add to message list
        this.messageList.appendChild(li);
    }
    
    /**
     * Create edit button
     * @param {HTMLElement} messageText - Message text element to edit
     * @returns {HTMLButtonElement} - Edit button
     */
    createEditButton(messageText) {
        const button = document.createElement('button');
        button.textContent = 'Edit';
        button.type = 'button';
        button.className = 'edit-btn';
        button.setAttribute('aria-label', 'Edit message');
        
        button.addEventListener('click', () => {
            const currentMessage = messageText.textContent;
            const newMessage = prompt('Edit your message:', currentMessage);
            
            if (newMessage !== null && newMessage.trim() !== '') {
                messageText.textContent = sanitizeInput(newMessage.trim());
            }
        });
        
        return button;
    }
    
    /**
     * Create remove button
     * @param {HTMLElement} listItem - List item to remove
     * @returns {HTMLButtonElement} - Remove button
     */
    createRemoveButton(listItem) {
        const button = document.createElement('button');
        button.textContent = 'Remove';
        button.type = 'button';
        button.className = 'remove-btn';
        button.setAttribute('aria-label', 'Remove message');
        
        button.addEventListener('click', () => {
            listItem.remove();
            this.checkMessageListVisibility();
        });
        
        return button;
    }
    
    /**
     * Show thank you message
     * @param {string} messageText - Thank you message text
     */
    showThankYouMessage(messageText) {
        // Create thank you message container
        const thankYouDiv = document.createElement('div');
        thankYouDiv.className = 'thank-you-message';
        thankYouDiv.setAttribute('role', 'alert');
        thankYouDiv.setAttribute('aria-live', 'polite');
        
        // Create paragraph with message
        const paragraph = document.createElement('p');
        paragraph.textContent = messageText;
        thankYouDiv.appendChild(paragraph);
        
        // Insert after the form
        if (this.form && this.form.parentNode) {
            this.form.parentNode.insertBefore(thankYouDiv, this.form.nextSibling);
        }
        
        // Auto-remove after specified duration
        setTimeout(() => {
            if (thankYouDiv.parentNode) {
                thankYouDiv.remove();
            }
        }, CONFIG.timing.thankYouDuration);
    }
    
    /**
     * Clear existing thank you messages
     */
    clearThankYouMessages() {
        const existingMessages = document.querySelectorAll('.thank-you-message');
        existingMessages.forEach(msg => msg.remove());
    }
    
    /**
     * Show messages section
     */
    showMessagesSection() {
        if (this.messageSection) {
            this.messageSection.style.display = 'block';
        }
    }
    
    /**
     * Hide messages section
     */
    hideMessagesSection() {
        if (this.messageSection) {
            this.messageSection.style.display = 'none';
        }
    }
    
    /**
     * Check if messages section should be visible
     */
    checkMessageListVisibility() {
        if (this.messageSection && this.messageList) {
            if (this.messageList.children.length > 0) {
                this.showMessagesSection();
            } else {
                this.hideMessagesSection();
            }
        }
    }
}

// ==========================================
// SKILLS SECTION
// ==========================================

class SkillsHandler {
    /**
     * Initialize skills section with predefined skills
     */
    static init() {
        const skillsSection = document.querySelector(CONFIG.selectors.skillsSection);
        if (!skillsSection) return;
        
        const skillsList = skillsSection.querySelector('ul');
        if (!skillsList) return;
        
        // Clear existing content
        skillsList.innerHTML = '';
        
        // Create document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        // Add each skill as a list item
        CONFIG.skills.forEach(skill => {
            const li = document.createElement('li');
            li.textContent = skill;
            fragment.appendChild(li);
        });
        
        // Append all at once
        skillsList.appendChild(fragment);
    }
}

// ==========================================
// FOOTER
// ==========================================

class FooterHandler {
    /**
     * Create and append footer to the page
     */
    static create() {
        // Check if footer already exists
        if (document.querySelector('footer')) return;
        
        // Create footer element
        const footer = document.createElement('footer');
        
        // Apply styles
        Object.assign(footer.style, {
            textAlign: 'center',
            padding: '20px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            marginTop: '40px',
            fontSize: '16px',
            fontWeight: '400',
            width: '100%'
        });
        
        // Create copyright paragraph
        const copyright = document.createElement('p');
        const currentYear = new Date().getFullYear();
        copyright.innerHTML = `© ${currentYear} Mia Smith`;
        
        // Add copyright to footer
        footer.appendChild(copyright);
        
        // Add footer to body
        document.body.appendChild(footer);
    }
}

// ==========================================
// APPLICATION INITIALIZATION
// ==========================================

class PortfolioApp {
    /**
     * Initialize the portfolio application
     */
    static init() {
        try {
            // Initialize message form handler
            new MessageFormHandler();
            
            // Initialize skills section
            SkillsHandler.init();
            
            // Create footer
            FooterHandler.create();
            
            // Log successful initialization
            console.log('Portfolio application initialized successfully');
        } catch (error) {
            console.error('Error initializing portfolio application:', error);
        }
    }
}

// ==========================================
// BOOTSTRAP APPLICATION
// ==========================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', PortfolioApp.init);
} else {
    // DOM is already loaded
    PortfolioApp.init();
}