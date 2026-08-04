document.addEventListener('DOMContentLoaded', () => {
  // Initialize CAPTCHA Generator
  const captcha = new CaptchaGenerator('captchaCanvas');

  // DOM Elements
  const resultForm = document.getElementById('resultForm');
  const captchaInput = document.getElementById('captchaInput');
  const refreshBtn = document.getElementById('refreshCaptchaBtn');
  const submitBtn = document.getElementById('submitBtn');
  const errorMessage = document.getElementById('errorMessage');

  /**
   * Refresh CAPTCHA Handler
   */
  refreshBtn.addEventListener('click', () => {
    captcha.generate();
    captchaInput.value = '';
    captchaInput.focus();
    hideError();
  });

  /**
   * Form Submission & Validation
   */
  resultForm.addEventListener('submit', (e) => {
    e.preventDefault();
    hideError();

    const userInput = captchaInput.value;

    // 1. Empty Input Check
    if (!userInput) {
      showError('Please enter the CAPTCHA code.');
      captchaInput.focus();
      return;
    }

    // 2. CAPTCHA Validation Check
    if (!captcha.validate(userInput)) {
      showError('Incorrect CAPTCHA. Please try again.');
      captcha.generate(); // Generate new code on failure
      captchaInput.value = '';
      captchaInput.focus();
      return;
    }

    // 3. Successful Verification -> Trigger Loading State
    startLoadingState();

    // 4. Wait 2 seconds, then open result.pdf
    setTimeout(() => {
      resetLoadingState();
      
      // Open result.pdf in a new tab
      window.open('result.pdf', '_blank');
      
      // Optional: Regenerate CAPTCHA for security upon returning
      captcha.generate();
      captchaInput.value = '';
    }, 2000);
  });

  /**
   * Helper: Show Error Alert
   */
  function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.add('show');
  }

  /**
   * Helper: Hide Error Alert
   */
  function hideError() {
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');
  }

  /**
   * Helper: Activate Loading State
   */
  function startLoadingState() {
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    captchaInput.disabled = true;
    refreshBtn.disabled = true;
  }

  /**
   * Helper: Reset Loading State
   */
  function resetLoadingState() {
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    captchaInput.disabled = false;
    refreshBtn.disabled = false;
  }
});
