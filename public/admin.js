// API URL
const API_URL = "/api";

// Elements
const backBtn = document.getElementById("backBtn");
const changePasswordBtn = document.getElementById("changePasswordBtn");
const searchInput = document.getElementById("searchInput");
const tableBody = document.getElementById("tableBody");
const loading = document.getElementById("loading");
const noData = document.getElementById("noData");

// Password modal elements
const changePasswordModal = document.getElementById("changePasswordModal");
const currentPasswordInput = document.getElementById("currentPassword");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");
const cancelChangePassword = document.getElementById("cancelChangePassword");
const submitChangePassword = document.getElementById("submitChangePassword");

// Stats elements
const totalYesEl = document.getElementById("totalYes");
const totalNoEl = document.getElementById("totalNo");
const totalViewsEl = document.getElementById("totalViews");
const avgNoClicksEl = document.getElementById("avgNoClicks");

let allData = [];

// Back to home
backBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

// Load data on page load
window.addEventListener("load", loadData);

// Search functionality
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredData = allData.filter(item => 
    item.userName.toLowerCase().includes(searchTerm)
  );
  displayData(filteredData);
});

// Fetch data from API
async function loadData() {
  try {
    loading.classList.remove("hidden");
    noData.style.display = "none";

    const response = await fetch(`${API_URL}/responses`);
    const result = await response.json();

    if (result.success && result.data.length > 0) {
      allData = result.data;
      displayData(allData);
      updateStats(allData);
      loading.classList.add("hidden");
    } else {
      loading.classList.add("hidden");
      noData.style.display = "block";
    }
  } catch (error) {
    console.error("Error loading data:", error);
    loading.classList.add("hidden");
    noData.style.display = "block";
  }
}

// Display data in table
function displayData(data) {
  tableBody.innerHTML = "";

  data.forEach((item, index) => {
    const row = document.createElement("tr");
    row.style.animationDelay = `${index * 0.05}s`;
    
    const date = new Date(item.timestamp);
    const formattedDate = date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    row.innerHTML = `
      <td><strong>${index + 1}</strong></td>
      <td><strong>${item.userName}</strong></td>
      <td>
        <span class="response-badge ${item.buttonClicked === 'YES' ? 'badge-yes' : 'badge-no'}">
          ${item.buttonClicked === 'YES' ? '❤️ YES' : '💔 NO'}
        </span>
      </td>
      <td><span class="no-clicks">${item.noClickCount}</span></td>
      <td>${formattedDate} • ${formattedTime}</td>
      <td>
        <button class="delete-btn" onclick="deleteResponse('${item._id}')">🗑️</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// Delete response - NO PROMPT, just smooth delete
async function deleteResponse(id) {
  const row = event.target.closest('tr');
  
  // Smooth fade animation
  row.style.transition = 'all 0.4s ease';
  row.style.opacity = '0.5';
  row.style.transform = 'scale(0.95)';

  try {
    const response = await fetch(`${API_URL}/response/${id}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (data.success) {
      // Complete fade out
      row.style.opacity = '0';
      row.style.transform = 'scale(0.9) translateX(-30px)';
      
      setTimeout(async () => {
        await loadData();
      }, 400);
    } else {
      // Reset on failure
      row.style.opacity = '1';
      row.style.transform = 'scale(1)';
      alert("❌ Failed to delete!");
    }
  } catch (error) {
    console.error("Error:", error);
    row.style.opacity = '1';
    row.style.transform = 'scale(1)';
    alert("❌ Error deleting!");
  }
}

// Make deleteResponse global
window.deleteResponse = deleteResponse;

// Update statistics
function updateStats(data) {
  const totalYes = data.filter(item => item.buttonClicked === 'YES').length;
  const totalNo = data.filter(item => item.buttonClicked === 'NO').length;
  const totalViews = data.length;
  
  const noUsersData = data.filter(item => item.buttonClicked === 'NO');
  const avgNoClicks = noUsersData.length > 0 
    ? (noUsersData.reduce((sum, item) => sum + item.noClickCount, 0) / noUsersData.length).toFixed(1)
    : 0;

  animateNumber(totalYesEl, totalYes);
  animateNumber(totalNoEl, totalNo);
  animateNumber(totalViewsEl, totalViews);
  animateNumber(avgNoClicksEl, avgNoClicks);
}

// Animate number counting
function animateNumber(element, target) {
  const duration = 1200;
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = Math.round(target);
      clearInterval(timer);
    } else {
      element.textContent = Math.round(current);
    }
  }, 16);
}

// Change Password
changePasswordBtn.addEventListener("click", () => {
  changePasswordModal.classList.remove("hidden");
  currentPasswordInput.value = "";
  newPasswordInput.value = "";
  confirmPasswordInput.value = "";
  currentPasswordInput.focus();
});

cancelChangePassword.addEventListener("click", () => {
  changePasswordModal.classList.add("hidden");
});

// Eye toggle
document.querySelectorAll('.eye-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const inputId = btn.getAttribute('data-input');
    const input = document.getElementById(inputId);
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
    btn.textContent = type === 'password' ? '👁️' : '🙈';
  });
});

// Submit password change
submitChangePassword.addEventListener("click", async () => {
  const current = currentPasswordInput.value.trim();
  const newPass = newPasswordInput.value.trim();
  const confirm = confirmPasswordInput.value.trim();
  
  if (!current || !newPass || !confirm) {
    alert("❌ All fields required!");
    return;
  }
  
  if (newPass !== confirm) {
    alert("❌ Passwords don't match!");
    confirmPasswordInput.value = "";
    return;
  }
  
  if (newPass.length < 4) {
    alert("❌ Min 4 characters!");
    return;
  }
  
  submitChangePassword.textContent = "Updating...";
  submitChangePassword.disabled = true;
  
  try {
    const response = await fetch(`${API_URL}/admin/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: current,
        newPassword: newPass
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert("✅ Password changed!");
      changePasswordModal.classList.add("hidden");
    } else {
      alert("❌ " + data.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("❌ Error changing password!");
  } finally {
    submitChangePassword.textContent = "Update Password";
    submitChangePassword.disabled = false;
  }
});