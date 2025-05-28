export default function decorate(block) {
  if (!block || !block.children.length) return;

  const wrapper = block;
  const loginChildren = Array.from(block.children);

  // Create container with responsive classes
  const container = document.createElement('div');
  container.className = 'container';

  const row = document.createElement('div');
  row.className = 'row';

  // Center the login form
  const col = document.createElement('div');
  col.className = 'col-xl-6 col-md-4 col-sm-4 login-column';

  // Create login form container
  const loginContainer = document.createElement('div');
  loginContainer.className = 'login-container';

  // Get title and description from the block content
  const titleText = loginChildren[0]?.children[0]?.textContent?.trim() || 'Login';
  const descriptionText = loginChildren[1]?.children[0]?.textContent?.trim() || 'Please enter your credentials';

  // Create title
  const title = document.createElement('h2');
  title.className = 'login-title';
  title.textContent = titleText;

  // Create description
  const description = document.createElement('p');
  description.className = 'login-description';
  description.textContent = descriptionText;

  // Create form
  const form = document.createElement('form');
  form.className = 'login-form';
  form.setAttribute('novalidate', '');

  // Create username field
  const usernameGroup = document.createElement('div');
  usernameGroup.className = 'form-group';

  const usernameLabel = document.createElement('label');
  usernameLabel.className = 'form-label';
  usernameLabel.setAttribute('for', 'username');
  usernameLabel.textContent = 'Username';

  const usernameInput = document.createElement('input');
  usernameInput.type = 'text';
  usernameInput.id = 'username';
  usernameInput.name = 'username';
  usernameInput.className = 'form-input';
  usernameInput.setAttribute('required', '');
  usernameInput.setAttribute('aria-describedby', 'username-error');
  usernameInput.setAttribute('autocomplete', 'username');

  const usernameError = document.createElement('div');
  usernameError.id = 'username-error';
  usernameError.className = 'form-error';
  usernameError.setAttribute('role', 'alert');
  usernameError.setAttribute('aria-live', 'polite');

  usernameGroup.appendChild(usernameLabel);
  usernameGroup.appendChild(usernameInput);
  usernameGroup.appendChild(usernameError);

  // Create password field
  const passwordGroup = document.createElement('div');
  passwordGroup.className = 'form-group';

  const passwordLabel = document.createElement('label');
  passwordLabel.className = 'form-label';
  passwordLabel.setAttribute('for', 'password');
  passwordLabel.textContent = 'Password';

  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.id = 'password';
  passwordInput.name = 'password';
  passwordInput.className = 'form-input';
  passwordInput.setAttribute('required', '');
  passwordInput.setAttribute('aria-describedby', 'password-error');
  passwordInput.setAttribute('autocomplete', 'current-password');

  const passwordError = document.createElement('div');
  passwordError.id = 'password-error';
  passwordError.className = 'form-error';
  passwordError.setAttribute('role', 'alert');
  passwordError.setAttribute('aria-live', 'polite');

  passwordGroup.appendChild(passwordLabel);
  passwordGroup.appendChild(passwordInput);
  passwordGroup.appendChild(passwordError);

  // Create submit button
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'login-button';
  submitButton.textContent = 'Login';

  // Create general error message
  const generalError = document.createElement('div');
  generalError.className = 'form-error general-error';
  generalError.setAttribute('role', 'alert');
  generalError.setAttribute('aria-live', 'polite');

  // Assemble form
  form.appendChild(usernameGroup);
  form.appendChild(passwordGroup);
  form.appendChild(submitButton);
  form.appendChild(generalError);

  // Assemble login container
  loginContainer.appendChild(title);
  loginContainer.appendChild(description);
  loginContainer.appendChild(form);

  // Assemble layout
  col.appendChild(loginContainer);
  row.appendChild(col);
  container.appendChild(row);

  // Validation functions
  function clearErrors() {
    usernameError.textContent = '';
    passwordError.textContent = '';
    generalError.textContent = '';
    usernameInput.classList.remove('error');
    passwordInput.classList.remove('error');
  }

  function showError(element, errorElement, message) {
    element.classList.add('error');
    errorElement.textContent = message;
  }

  function validateForm() {
    clearErrors();
    let isValid = true;

    // Validate username
    if (!usernameInput.value.trim()) {
      showError(usernameInput, usernameError, 'Username is required');
      isValid = false;
    }

    // Validate password
    if (!passwordInput.value.trim()) {
      showError(passwordInput, passwordError, 'Password is required');
      isValid = false;
    }

    return isValid;
  }

  function authenticateUser(username, password) {
    // Check credentials
    if (username === 'admin' && password === 'admin') {
      return true;
    }
    return false;
  }

  // Form submission handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (authenticateUser(username, password)) {
      // Success - redirect to /aboutus
      window.location.href = '/aboutus';
    } else {
      // Show error message
      generalError.textContent = 'Invalid credentials. Please try again.';
      usernameInput.classList.add('error');
      passwordInput.classList.add('error');
      
      // Focus on username field for retry
      usernameInput.focus();
    }
  });

  // Clear errors on input
  usernameInput.addEventListener('input', () => {
    if (usernameInput.classList.contains('error')) {
      usernameInput.classList.remove('error');
      usernameError.textContent = '';
      generalError.textContent = '';
    }
  });

  passwordInput.addEventListener('input', () => {
    if (passwordInput.classList.contains('error')) {
      passwordInput.classList.remove('error');
      passwordError.textContent = '';
      generalError.textContent = '';
    }
  });

  // Replace original content
  wrapper.innerHTML = '';
  wrapper.appendChild(container);

  // Focus on username field when form loads
  setTimeout(() => {
    usernameInput.focus();
  }, 100);
} 