/* ===================================
   TBILISI BITES — form.js
   Form validation: regex, show/hide password, tabs
=================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Tab switching ----
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      tabContents.forEach(tc => {
        tc.classList.toggle('active', tc.dataset.tabContent === tab);
      });
    });
  });

  // ---- Show / Hide Password ----
  const togglePwd = document.getElementById('togglePwd');
  const pwdInput = document.getElementById('ctPassword');

  togglePwd?.addEventListener('click', () => {
    const isHidden = pwdInput.type === 'password';
    pwdInput.type = isHidden ? 'text' : 'password';
    togglePwd.textContent = isHidden ? '🙈' : '👁';
  });

  // ---- Regex patterns ----
  const REGEX = {
    name: /^[\u10D0-\u10FF\u0041-\u005A\u0061-\u007A\s]{2,60}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^(\+995|0)\s?[5-9]\d{2}\s?\d{3}\s?\d{3}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  };

  // ---- Helper: show/clear error ----
  function showError(inputId, errId, msg) {
    const input = document.getElementById(inputId);
    const err = document.getElementById(errId);
    if (!input || !err) return false;
    input.classList.add('error');
    err.textContent = msg;
    return false;
  }

  function clearError(inputId, errId) {
    const input = document.getElementById(inputId);
    const err = document.getElementById(errId);
    if (!input || !err) return;
    input.classList.remove('error');
    err.textContent = '';
  }

  // ---- Live validation ----
  function liveValidate(inputEl, errEl, validateFn) {
    if (!inputEl) return;
    inputEl.addEventListener('input', () => {
      const result = validateFn(inputEl.value);
      if (result === true) {
        inputEl.classList.remove('error');
        errEl.textContent = '';
      } else {
        inputEl.classList.add('error');
        errEl.textContent = result;
      }
    });
  }

  liveValidate(
    document.getElementById('resName'),
    document.getElementById('resNameErr'),
    v => REGEX.name.test(v.trim()) ? true : 'სახელი არ არის სწორი (მინ. 2 სიმბოლო)'
  );
  liveValidate(
    document.getElementById('resEmail'),
    document.getElementById('resEmailErr'),
    v => REGEX.email.test(v) ? true : 'შეიყვანეთ სწორი ელ-ფოსტა'
  );
  liveValidate(
    document.getElementById('resPhone'),
    document.getElementById('resPhoneErr'),
    v => REGEX.phone.test(v.trim()) ? true : 'ფორმატი: +995 5XX XXX XXX'
  );

  // ---- Reservation Form ----
  const resForm = document.getElementById('reservationForm');
  resForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('resName').value.trim();
    const phone = document.getElementById('resPhone').value.trim();
    const email = document.getElementById('resEmail').value.trim();
    const date = document.getElementById('resDate').value;
    const time = document.getElementById('resTime').value;
    const guests = document.getElementById('resGuests').value;

    // Clear errors
    ['resName','resPhone','resEmail','resDate','resTime','resGuests'].forEach(id => {
      document.getElementById(id)?.classList.remove('error');
    });
    ['resNameErr','resPhoneErr','resEmailErr','resDateErr','resTimeErr','resGuestsErr'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });

    if (!REGEX.name.test(name)) {
      showError('resName', 'resNameErr', 'სახელი/გვარი სავალდებულოა (მინ. 2 სიმბოლო)');
      valid = false;
    }
    if (!REGEX.phone.test(phone)) {
      showError('resPhone', 'resPhoneErr', 'სწორი ტელეფონი: +995 5XX XXX XXX');
      valid = false;
    }
    if (!REGEX.email.test(email)) {
      showError('resEmail', 'resEmailErr', 'შეიყვანეთ სწორი ელ-ფოსტა');
      valid = false;
    }
    if (!date) {
      showError('resDate', 'resDateErr', 'აირჩიეთ თარიღი');
      valid = false;
    } else {
      const selected = new Date(date);
      const today = new Date(); today.setHours(0,0,0,0);
      if (selected < today) {
        showError('resDate', 'resDateErr', 'გასული თარიღი არ გამოდგება');
        valid = false;
      }
    }
    if (!time) {
      showError('resTime', 'resTimeErr', 'აირჩიეთ დრო (12:00–23:00)');
      valid = false;
    }
    if (!guests) {
      showError('resGuests', 'resGuestsErr', 'სტუმრების რაოდენობა სავალდებულოა');
      valid = false;
    }

    if (valid) {
      // Save to sessionStorage
      const reservation = { name, phone, email, date, time, guests };
      sessionStorage.setItem('lastReservation', JSON.stringify(reservation));

      resForm.reset();
      const success = document.getElementById('resSuccess');
      if (success) {
        success.style.display = 'block';
        setTimeout(() => { success.style.display = 'none'; }, 5000);
      }
    }
  });

  // ---- Contact Form ----
  const ctForm = document.getElementById('contactForm');
  ctForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('ctName').value.trim();
    const email = document.getElementById('ctEmail').value.trim();
    const password = document.getElementById('ctPassword').value;
    const msg = document.getElementById('ctMsg').value.trim();

    ['ctName','ctEmail','ctPassword','ctMsg'].forEach(id => {
      document.getElementById(id)?.classList.remove('error');
    });
    ['ctNameErr','ctEmailErr','ctPwdErr','ctMsgErr'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });

    if (!REGEX.name.test(name)) {
      showError('ctName', 'ctNameErr', 'სახელი სავალდებულოა');
      valid = false;
    }
    if (!REGEX.email.test(email)) {
      showError('ctEmail', 'ctEmailErr', 'სწორი ელ-ფოსტა');
      valid = false;
    }
    if (!REGEX.password.test(password)) {
      showError('ctPassword', 'ctPwdErr', 'მინ. 8 სიმბოლო, დიდი/პატარა ასო და ციფრი');
      valid = false;
    }
    if (msg.length < 10) {
      showError('ctMsg', 'ctMsgErr', 'შეტყობინება ძალიან მოკლეა (მინ. 10 სიმბოლო)');
      valid = false;
    }

    if (valid) {
      ctForm.reset();
      pwdInput.type = 'password';
      if (togglePwd) togglePwd.textContent = '👁';
      const success = document.getElementById('ctSuccess');
      if (success) {
        success.style.display = 'block';
        setTimeout(() => { success.style.display = 'none'; }, 5000);
      }
    }
  });

});