/**
 * Portfolio Website - Main JavaScript
 * Complete implementation with all requirements
 */

// ==========================================
// CORE MESSAGE FORM FUNCTIONALITY
// ==========================================

// Get DOM elements
const messageForm = document.querySelector('form[name="leave_message"]');
const messageSection = document.getElementById('messages');
const messageList = document.getElementById('message-list');

// Initially hide the messages section
if (messageSection) {
    messageSection.style.display = 'none';
}

// Main form submission handler
if (messageForm) {
    messageForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const userName = event.target.usersName.value.trim();
        const userEmail = event.target.usersEmail.value.trim();
        const userMessage = event.target.usersMessage.value.trim();
        
        // Log values as required by assignment
        console.log(userName, userEmail, userMessage);
        
        // Validate required fields
        if (!userName) {
            alert('Please enter your name');
            return;
        }
        
        if (!userEmail) {
            alert('Please enter your email');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Remove any existing thank you messages before creating new one
        const existingThankYouMessages = document.querySelectorAll('.thank-you-message');
        existingThankYouMessages.forEach(msg => msg.remove());
        
        // Process submission based on whether message was provided
        if (userMessage && userMessage.length > 0) {
            // User provided a message - create list item and show section
            createMessageListItem(userName, userEmail, userMessage);
            
            // Show the messages section
            if (messageSection) {
                messageSection.style.display = 'block';
            }
            
            // Show thank you message for submission WITH message
            showThankYouMessage(
                `Thank you ${userName} for your message and visiting my portfolio page. I will get back to you as soon as possible and have a wonderful day.`
            );
        } else {
            // No message provided - just show thank you, don't create list item
            // Messages section stays hidden
            
            // Show thank you message for submission WITHOUT message
            showThankYouMessage(
                `Thank you ${userName} for visiting my portfolio page and have a wonderful day.`
            );
        }
        
        // Reset the form
        event.target.reset();
    });
}

/**
 * Create a message list item with edit and remove buttons
 */
function createMessageListItem(name, email, message) {
    if (!messageList) return;
    
    // Create list item
    const li = document.createElement('li');
    
    // Create message content container
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // Create email link
    const emailLink = document.createElement('a');
    emailLink.href = `mailto:${email}`;
    emailLink.textContent = name;
    
    // Create message text span
    const messageText = document.createElement('span');
    messageText.className = 'message-text';
    messageText.textContent = message;
    
    // Create edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'edit';
    editButton.type = 'button';
    editButton.className = 'edit-btn';
    editButton.addEventListener('click', function() {
        const currentMessage = messageText.textContent;
        const newMessage = prompt('Edit your message:', currentMessage);
        if (newMessage !== null && newMessage.trim() !== '') {
            messageText.textContent = newMessage.trim();
        }
    });
    
    // Create remove button
    const removeButton = document.createElement('button');
    removeButton.textContent = 'remove';
    removeButton.type = 'button';
    removeButton.className = 'remove-btn';
    removeButton.addEventListener('click', function() {
        li.remove();
        // Check if message list is empty and hide section if it is
        checkMessageListVisibility();
    });
    
    // Assemble the message content
    messageContent.appendChild(emailLink);
    messageContent.appendChild(messageText);
    messageContent.appendChild(editButton);
    messageContent.appendChild(removeButton);
    
    // Add content to list item
    li.appendChild(messageContent);
    
    // Add to message list
    messageList.appendChild(li);
}

/**
 * Show thank you message that auto-removes after 5 seconds
 */
function showThankYouMessage(messageText) {
    // Create thank you message div
    const thankYouDiv = document.createElement('div');
    thankYouDiv.className = 'thank-you-message';
    thankYouDiv.setAttribute('role', 'alert');
    thankYouDiv.setAttribute('aria-live', 'polite');
    
    // Create paragraph with message
    const paragraph = document.createElement('p');
    paragraph.textContent = messageText;
    thankYouDiv.appendChild(paragraph);
    
    // Insert after the form
    if (messageForm && messageForm.parentNode) {
        messageForm.parentNode.insertBefore(thankYouDiv, messageForm.nextSibling);
    }
    
    // Remove after 5 seconds
    setTimeout(function() {
        if (thankYouDiv.parentNode) {
            thankYouDiv.remove();
        }
    }, 5000);
}

/**
 * Check if messages section should be visible
 */
function checkMessageListVisibility() {
    if (messageSection && messageList) {
        if (messageList.children.length > 0) {
            messageSection.style.display = 'block';
        } else {
            messageSection.style.display = 'none';
        }
    }
}

// ==========================================
// SKILLS SECTION
// ==========================================

/**
 * Initialize skills section with predefined skills
 */
function initializeSkills() {
    const skills = [
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
    ];

    const skillsSection = document.querySelector('#skills');
    if (!skillsSection) return;

    const skillsList = skillsSection.querySelector('ul');
    if (!skillsList) return;

    // Clear existing content
    skillsList.innerHTML = '';
    
    // Add each skill as a list item
    skills.forEach(function(skill) {
        const li = document.createElement('li');
        li.textContent = skill;
        skillsList.appendChild(li);
    });
}

// ==========================================
// FOOTER
// ==========================================

/**
 * Create and append footer to the page
 */
function createFooter() {
    // Check if footer already exists
    const existingFooter = document.querySelector('footer');
    if (existingFooter) return;
    
    // Create footer element
    const footer = document.createElement('footer');
    
    // Apply styles
    footer.style.textAlign = 'center';
    footer.style.padding = '20px';
    footer.style.background = 'rgba(0, 0, 0, 0.8)';
    footer.style.color = 'white';
    footer.style.marginTop = '40px';
    footer.style.fontSize = '16px';
    footer.style.fontWeight = '400';
    footer.style.width = '100%';
    
    // Create copyright paragraph
    const copyright = document.createElement('p');
    const currentYear = new Date().getFullYear();
    copyright.innerHTML = `© ${currentYear} Mia Smith`;
    
    // Add copyright to footer
    footer.appendChild(copyright);
    
    // Add footer to body
    document.body.appendChild(footer);
}

// ==========================================
// INITIALIZATION
// ==========================================

/**
 * Initialize all components when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize skills if section exists
    initializeSkills();
    
    // Create footer
    createFooter();
    
    // Log successful initialization
    console.log('Portfolio application initialized successfully');
});