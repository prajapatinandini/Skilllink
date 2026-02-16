const form = document.getElementById("profileForm");
const msg = document.getElementById("message");

const college = document.getElementById("college");
const branch = document.getElementById("branch");
const semester = document.getElementById("semester");
const skills = document.getElementById("skills");
const githubUsername = document.getElementById("githubUsername");
const resume = document.getElementById("resume");

let isUpdateMode = false;

// ================= PREFILL PROFILE =================
document.addEventListener("DOMContentLoaded", async () => {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch("/api/profile/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) return;

    const user = await res.json();

    if (user.profileCompleted) {
      isUpdateMode = true;

      college.value = user.college || "";
      branch.value = user.branch || "";
      semester.value = user.semester || "";
      skills.value = user.skills ? user.skills.join(", ") : "";
      githubUsername.value = user.githubUsername || "";

      // Prefill tech stack checkboxes
      if (user.techStack && Array.isArray(user.techStack)) {
        user.techStack.forEach(tech => {
          const checkbox = document.querySelector(
            `.tech-checkbox-group input[value="${tech}"]`
          );
          if (checkbox) checkbox.checked = true;
        });
      }

      // Show current resume
      if (user.resumeUrl) {
        msg.innerHTML = `
          Current Resume: 
          <a href="${user.resumeUrl}" target="_blank">View Resume</a>
        `;
      }
    }

  } catch (err) {
    console.error(err);
  }
});


// ================= SUBMIT FORM =================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = getToken();

  const techStackArray = Array.from(
    document.querySelectorAll(".tech-checkbox-group input[type='checkbox']:checked")
  ).map(cb => cb.value);

  if (techStackArray.length === 0) {
    msg.textContent = "Please select at least one technology";
    return;
  }

  const formData = new FormData();
  formData.append("college", college.value);
  formData.append("branch", branch.value);
  formData.append("semester", semester.value);
  formData.append("skills", skills.value);
  formData.append("githubUsername", githubUsername.value);
  formData.append("techStack", techStackArray.join(","));

  if (resume.files[0]) {
    formData.append("resume", resume.files[0]);
  }

  const url = isUpdateMode
    ? "/api/profile/update"
    : "/api/profile/complete";

  const method = isUpdateMode ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  const result = await res.json();
  msg.textContent = result.message;

  if (res.ok) {
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);
  }
});
