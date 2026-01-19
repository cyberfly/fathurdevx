import './style.css'
import './transitions.css'
import './transitions.js'
import Alpine from 'alpinejs'

// Make Alpine available globally
window.Alpine = Alpine

// Start Alpine
Alpine.start()

// Contact Form Handler
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');

  if (!contactForm) return;

  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const successMessage = document.getElementById('successMessage');
  const errorMessage = document.getElementById('errorMessage');

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  // Validation functions
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateName = (name) => {
    return name.trim().length > 0;
  };

  const validateMessage = (message) => {
    return message.trim().length > 0;
  };

  const showError = (input, errorElement, message) => {
    input.classList.add('border-red-500');
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
  };

  const hideError = (input, errorElement) => {
    input.classList.remove('border-red-500');
    errorElement.classList.add('hidden');
  };

  // Real-time validation
  nameInput.addEventListener('blur', () => {
    if (!validateName(nameInput.value)) {
      showError(nameInput, nameError, 'Please enter your name');
    } else {
      hideError(nameInput, nameError);
    }
  });

  emailInput.addEventListener('blur', () => {
    if (!validateEmail(emailInput.value)) {
      showError(emailInput, emailError, 'Please enter a valid email address');
    } else {
      hideError(emailInput, emailError);
    }
  });

  messageInput.addEventListener('blur', () => {
    if (!validateMessage(messageInput.value)) {
      showError(messageInput, messageError, 'Please enter a message');
    } else {
      hideError(messageInput, messageError);
    }
  });

  // Form submission
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Hide previous messages
    successMessage.classList.add('hidden');
    errorMessage.classList.add('hidden');

    // Validate all fields
    let isValid = true;

    if (!validateName(nameInput.value)) {
      showError(nameInput, nameError, 'Please enter your name');
      isValid = false;
    } else {
      hideError(nameInput, nameError);
    }

    if (!validateEmail(emailInput.value)) {
      showError(emailInput, emailError, 'Please enter a valid email address');
      isValid = false;
    } else {
      hideError(emailInput, emailError);
    }

    if (!validateMessage(messageInput.value)) {
      showError(messageInput, messageError, 'Please enter a message');
      isValid = false;
    } else {
      hideError(messageInput, messageError);
    }

    if (!isValid) {
      return;
    }

    // Disable submit button
    submitBtn.disabled = true;
    submitText.textContent = 'Sending...';

    try {
      // Prepare form data
      const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim()
      };

      // Submit to API
      const response = await fetch('https://a.firaform.com/api/f/LpmzlmGdpomgmT2vGCQiU', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Show success message
        successMessage.classList.remove('hidden');
        // Reset form
        contactForm.reset();
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        // Show error message
        errorMessage.classList.remove('hidden');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      errorMessage.classList.remove('hidden');
    } finally {
      // Re-enable submit button
      submitBtn.disabled = false;
      submitText.textContent = 'Send Message';
    }
  });
});
