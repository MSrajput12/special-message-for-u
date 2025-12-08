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

  // 🔥 DELETE ALL BUTTON (Correct Code)
  const deleteAllBtn = document.getElementById("deleteAllBtn");

  deleteAllBtn.addEventListener("click", async () => {
    try {
      const response = await fetch(`${API_URL}/responses`, {
        method: "DELETE"
      });

      const result = await response.json();

      if (result.success) {
        await loadData(); // refresh table
      } else {
        console.log("❌ Failed to delete all!");
      }

    } catch (err) {
      console.error("Delete all error:", err);
    }
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

      // FIX: protect against null / undefined
      allData = Array.isArray(result.data) ? result.data : [];

      if (allData.length > 0) {
        displayData(allData);
        updateStats(allData);
        noData.style.display = "none";
      } else {
        tableBody.innerHTML = "";  // clear table
        updateStats([]);           // reset stats counters
        noData.style.display = "block";
      }

      loading.classList.add("hidden");

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
      row.setAttribute("data-id", item._id);
      row.style.animationDelay = `${index * 0.05}s`;

      const date = new Date(item.timestamp);
      const formattedDate = date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const formattedTime = date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      row.innerHTML = `
        <td><strong>${index + 1}</strong></td>
        <td><strong>${item.userName}</strong></td>

        <td>
          <span class="response-badge ${item.buttonClicked === "YES" ? "badge-yes" : "badge-no"}">
            ${item.buttonClicked === "YES" ? "❤️ YES" : "💔 NO"}
          </span>
        </td>

        <td><span class="yes-clicks">${item.yesClickCount || 0}</span></td>

        <td><span class="no-clicks">${item.noClickCount || 0}</span></td>

        <td>${formattedDate} • ${formattedTime}</td>

        <td>
          <button class="delete-btn" onclick="deleteResponse('${item._id}')">🗑️</button>
        </td>
      `;

      tableBody.appendChild(row);
    });
  }

  // Delete response by ID
  // 
async function deleteResponse(id) {
  console.log("Deleting:", id);

  // Remove row immediately from UI
  const row = document.querySelector(`[data-id="${id}"]`);
  if (row) row.remove();

  try {
    const response = await fetch(`${API_URL}/response/${id}`, {
      method: "DELETE",
    });

    let result = {};
    try {
      result = await response.json();
    } catch (e) {
      result.success = response.ok;
    }

    if (!result.success) {
      console.error("Failed to delete:", result);
    }

    await loadData(); // refresh

  } catch (error) {
    console.error("Error deleting response:", error);
  }
}

window.deleteResponse = deleteResponse;


  // Update statistics
  function updateStats(data) {
    const totalYes = data.filter(item => item.buttonClicked === 'YES').length;
    const totalNo = data.filter(item => item.buttonClicked === 'NO').length;
    const totalViews = data.length;
    
    // Calculate average NO clicks ONLY for users who clicked NO
    const noUsersData = data.filter(item => item.buttonClicked === 'NO');
    const avgNoClicks = noUsersData.length > 0 
      ? (noUsersData.reduce((sum, item) => sum + item.noClickCount, 0) / noUsersData.length).toFixed(1)
      : 0;

    // Animate numbers
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

  // Change Password Modal
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

  // Eye toggle for password inputs
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
      alert("❌ All fields are required!");
      return;
    }
    
    if (newPass !== confirm) {
      alert("❌ New passwords don't match!");
      confirmPasswordInput.value = "";
      return;
    }
    
    if (newPass.length < 4) {
      alert("❌ Password must be at least 4 characters!");
      return;
    }
    
    submitChangePassword.textContent = "Updating...";
    submitChangePassword.disabled = true;
    
    try {
      const response = await fetch(`${API_URL}/admin/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: current,
          newPassword: newPass
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert("✅ Password changed successfully!");
        changePasswordModal.classList.add("hidden");
      } else {
        alert("❌ " + data.message);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("❌ Error changing password!");
    } finally {
      submitChangePassword.textContent = "Update Password";
      submitChangePassword.disabled = false;
    }
  });