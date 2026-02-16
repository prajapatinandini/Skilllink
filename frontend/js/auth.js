const msg = document.getElementById("message");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const forgotForm = document.getElementById("forgotForm");
const resetForm = document.getElementById("resetForm");
const API_BASE = "http://localhost:5000/api/auth";

function saveToken(token) {
  localStorage.setItem("token", token);
}





document.addEventListener("DOMContentLoaded", () => {

  const msg = document.getElementById("message");

  /* ---------------- REGISTER ---------------- */
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = {
        name: name.value,
        email: email.value,
        password: password.value,
        role: role.value
      };

      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      msg.textContent = result.message;

      if (result.token) {
        saveToken(result.token);
        window.location.href = "dashboard.html"; // ✅
      }
    });
  }

  /* ---------------- LOGIN ---------------- */
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log("Login clicked");

      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail.value,
          password: loginPassword.value
        })
      });

      const result = await res.json();
      msg.textContent = result.message;

      if (result.token) {
        saveToken(result.token);
        window.location.href = "dashboard.html"; // ✅ FIXED
      }
    });
  }

});





/* ---------------- FORGOT PASSWORD ---------------- */
if (forgotForm) {
  const forgotEmailInput = document.getElementById("forgotEmail");

  forgotForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: forgotEmailInput.value })
    });

    const result = await res.json();
    msg.textContent = result.message;
  });
}


/* ---------------- RESET PASSWORD ---------------- */
if (resetForm) {
  const otpInput = document.getElementById("otp");
  const newPasswordInput = document.getElementById("newPassword");
  const forgotEmailInput = document.getElementById("forgotEmail");

  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: forgotEmailInput.value,
        otp: otpInput.value,
        newPassword: newPasswordInput.value
      })
    });

    const result = await res.json();
    msg.textContent = result.message;
  });
}

/* ---------------- FIREBASE LOGIN ---------------- */
// ⚠️ Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const firebaseBtn = document.getElementById("firebaseBtn");
if (firebaseBtn) {
  firebaseBtn.addEventListener("click", async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const userCred = await auth.signInWithPopup(provider);
    const user = userCred.user;

    const res = await fetch(`${API_BASE}/firebase-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firebaseUID: user.uid,
        email: user.email,
        name: user.displayName
      })
    });

    const result = await res.json();
    saveToken(result.token);
    window.location.href = "profile.html";
  });
}
