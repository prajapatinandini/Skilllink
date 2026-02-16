const form = document.getElementById("projectForm");
const msg = document.getElementById("message");
const token = localStorage.getItem("token");

if (!token) window.location.href = "login.html";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const res = await fetch("http://localhost:5000/api/projects/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      title: title.value,
      repoUrl: repoUrl.value
    })
  });

  const result = await res.json();
  msg.textContent = result.message;

  if (res.ok) {
    setTimeout(() => {
      window.location.href = "dashboard.html"; // back to dashboard
    }, 1000);
  }
});
