const bcrypt = require('bcryptjs');

const toggleButton = document.querySelector('.toggle-nav-btn');
const closeNavButton = document.querySelector('.mobile-header__close-btn');
const mobileNav = document.querySelector('.header-mobile-nav');

toggleButton.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});

closeNavButton.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});

// admin password

const getAdminPassword = async () => {
  const res = await fetch('/admin');
  const data = await res.json();
  return data;
};

const deleteButton = document.querySelector('.btn-danger.delete-btn');
const updateButton = document.querySelector('.btn-form-primary');
const adminPasswordModal = document.querySelector('.admin-password-modal');
const passwordInput = document.querySelector('.password-input');

const modelSubmitBtn = document.querySelector('.modal-submit-delete-btn');
const modalCloseBtn = document.querySelector('.modal-cancel-btn');

const modelError = document.querySelector('.modal-error');

const form = document.querySelector('.form');

[deleteButton, updateButton].forEach((btn) => {
  btn?.addEventListener('click', (e) => {
    e.preventDefault();
    adminPasswordModal?.classList.toggle('open');
  });
});
adminPasswordModal?.addEventListener('click', (e) => {
  if (e.target === adminPasswordModal) {
    adminPasswordModal.classList.toggle('open');
  }
});

modalCloseBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  adminPasswordModal.classList.toggle('open');
});

modelSubmitBtn?.addEventListener('click', async (e) => {
  e.preventDefault();
  const adminPasswordData = await getAdminPassword();
  const adminPassword = adminPasswordData.password;
  const password = passwordInput.value;
  const isMatch = await bcrypt.compare(password, adminPassword);
  if (isMatch) {
    if (updateButton) {
      form.submit();
      return;
    }
    fetch(window.location.href, {
      method: 'POST',
    }).then((res) => {
      if (res.status === 200) {
        window.location.href = '/';
      }
    });
  } else {
    modelError.textContent = 'Incorrect Password';
    setTimeout(() => {
      modelError.textContent = '';
    }, 3000);
  }
});
