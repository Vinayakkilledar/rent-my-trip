// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (min 6 characters, at least one letter and one number)
export const isValidPassword = (password) => {
  return password.length >= 6 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
};

// Phone validation (10 digits)
export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/[^\d]/g, ''));
};

// License number validation (basic)
export const isValidLicense = (license) => {
  return license.length >= 5;
};

// Validate registration form
export const validateRegistrationForm = (formData, userType) => {
  const errors = {};

  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!isValidEmail(formData.email)) {
    errors.email = 'Invalid email format';
  }

  if (!isValidPassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters with letters and numbers';
  }

  if (!isValidPhone(formData.phone)) {
    errors.phone = 'Phone must be 10 digits';
  }

  if (userType === 'driver') {
    if (!isValidLicense(formData.licenseNumber)) {
      errors.licenseNumber = 'License number must be at least 5 characters';
    }

    if (!formData.vehicleType) {
      errors.vehicleType = 'Please select a vehicle type';
    }
  }

  return errors;
};

// Validate login form
export const validateLoginForm = (formData) => {
  const errors = {};

  if (!isValidEmail(formData.email)) {
    errors.email = 'Invalid email format';
  }

  if (!formData.password || formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
};
