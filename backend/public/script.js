/* ---------- Elements ---------- */
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const msgEl = document.getElementById("message");
const qEl = document.getElementById("question");
const buttonsRow = document.getElementById("buttons");

const heartRain = document.getElementById("heartRain");
const brokenRain = document.getElementById("brokenRain");
const explosionLayer = document.getElementById("explosionLayer");

// Modal elements
const nameModal = document.getElementById("nameModal");
const nameInput = document.getElementById("nameInput");
const submitNameBtn = document.getElementById("submitNameBtn");

// Password modal elements
const adminViewBtn = document.getElementById("adminViewBtn");
const passwordModal = document.getElementById("passwordModal");
const passwordInput = document.getElementById("passwordInput");
const togglePassword = document.getElementById("togglePassword");
const submitPasswordBtn = document.getElementById("submitPasswordBtn");
const cancelPasswordBtn = document.getElementById("cancelPasswordBtn");

/* ---------- User Data ---------- */
let userName = "";
let noCount = 0;
let finalBroken = false;

// API Base URL
const API_URL = "/api";

/* ---------- Name Modal Handling ---------- */
submitNameBtn.addEventListener("click", submitName);
nameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") submitName();
});

function submitName() {
  const name = nameInput.value.trim();
  
  if (name === "") {
    nameInput.style.borderColor = "#ef4444";
    nameInput.placeholder = "Please enter your name!";
    return;
  }
  
  userName = name;
  nameModal.classList.add("hidden");
  
  // Update question with user name (Colored Name)
  qEl.innerHTML = `<span style="color: #ff0066; font-size: 1.1em; text-transform: uppercase; text-shadow: 0 2px 10px rgba(255,0,102,0.3);">${userName}</span>, meri saari duaaon ka jawaab ho tum...<br>Will you be mine forever? 🌹`;
}

/* ---------- Admin Button & Password Modal Logic ---------- */
adminViewBtn.addEventListener("click", () => {
  passwordModal.classList.remove("hidden");
  passwordInput.value = "";
  passwordInput.focus();
});

cancelPasswordBtn.addEventListener("click", () => {
  passwordModal.classList.add("hidden");
  passwordInput.value = "";
});

togglePassword.addEventListener("click", () => {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
  togglePassword.textContent = type === "password" ? "👁️" : "🙈";
});

passwordInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    submitPasswordBtn.click();
  }
});

submitPasswordBtn.addEventListener("click", async () => {
  const password = passwordInput.value.trim();
  
  if (password === "") {
    passwordInput.style.borderColor = "rgba(255, 100, 100, 0.8)";
    passwordInput.placeholder = "Password required!";
    return;
  }
  
  submitPasswordBtn.textContent = "Checking...";
  submitPasswordBtn.disabled = true;
  
  try {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      passwordModal.classList.add("hidden");
      window.location.href = "admin.html";
    } else {
      passwordInput.value = "";
      passwordInput.style.borderColor = "rgba(255, 100, 100, 0.8)";
      passwordInput.placeholder = "Incorrect password!";
      setTimeout(() => {
        passwordInput.style.borderColor = "rgba(255, 255, 255, 0.4)";
        passwordInput.placeholder = "••••••";
      }, 2000);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("❌ Error connecting to server!");
  } finally {
    submitPasswordBtn.textContent = "Enter";
    submitPasswordBtn.disabled = false;
  }
});

/* ---------- Save to Database ---------- */
async function saveResponse(buttonClicked) {
  try {
    const response = await fetch(`${API_URL}/save-response`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, buttonClicked }) // Only send userName and buttonClicked
    });
    const data = await response.json();
    if (data.success) console.log("✅ Response created/updated!");
  } catch (error) {
    console.error("❌ Error saving response:", error);
  }
}



/* ---------- Spawn Love Hearts (Mixed Red & Pink) ---------- */
function spawnLoveHeart(opts = {}) {
  const el = document.createElement("div");
  el.className = "heart";
  
  // Randomly choose between Red and Pink hearts
  el.innerText = Math.random() > 0.5 ? "❤️" : "💖";
  
  el.style.left = (opts.left ?? Math.random() * 100) + "vw";
  el.style.fontSize = (opts.size ?? (16 + Math.random() * 32)) + "px";
  el.style.animationDuration = (opts.duration ?? (8 + Math.random() * 5)) + "s";
  el.style.opacity = opts.opacity ?? 0.85;
  el.style.animationName = "fall";
  
  el.addEventListener("mouseenter", function(e) {
    createHeartBurst(e.clientX, e.clientY);
  });
  
  heartRain.appendChild(el);
  setTimeout(() => el.remove(), (parseFloat(el.style.animationDuration) + 1) * 1000);
}

/* ---------- Spawn Broken Hearts ---------- */
function spawnBrokenHeart(opts = {}) {
  const el = document.createElement("div");
  el.className = "broken";
  el.innerText = Math.random() > 0.5 ? "💔" : "🖤";
  el.style.left = (opts.left ?? Math.random() * 100) + "vw";
  el.style.fontSize = (opts.size ?? (18 + Math.random() * 32)) + "px";
  
  if (opts.falling) {
    el.style.top = "-10vh";
    el.style.animationName = "brokenFall";
    el.style.animationDuration = (opts.duration ?? (8 + Math.random() * 5)) + "s";
  } else {
    el.style.top = (opts.top ?? (110 + Math.random() * 10)) + "vh";
    el.style.animationName = "floatUp";
    el.style.animationDuration = (opts.duration ?? (9 + Math.random() * 5)) + "s";
  }
  
  el.addEventListener("mouseenter", function(e) {
    createHeartBurst(e.clientX, e.clientY, true);
  });
  
  brokenRain.appendChild(el);
  setTimeout(() => el.remove(), (parseFloat(el.style.animationDuration) + 1) * 1000);
}

/* ---------- YES CLICK (Smooth Explosion + CSS) ---------- */
async function doYes() {
  if (finalBroken) return;

  buttonsRow.style.display = "none";
  qEl.innerHTML = "Mera Sapna Sach Ho Gaya! 💍❤️";
  msgEl.innerHTML = `Na chaahat, na hasrat, na junoon...<br><span style="color: #ff0066; font-weight: bold;">${userName}</span>, bas sukoon ho tum mera. ✨`;
  msgEl.style.opacity = 1;

  if (typeof sadAudio !== 'undefined') sadAudio.pause();
  if (typeof loveAudio !== 'undefined') {
    loveAudio.currentTime = 0;
    loveAudio.loop = true;
    loveAudio.play();
  }

  await saveResponse("YES");

  // --- 🔥 SUPER SMOOTH EXPLOSION LOGIC ---
  for (let i = 0; i < 100; i++) {
    const h = document.createElement("div");
    // Important: Using 'smooth-heart' class for CSS animation
    h.className = "smooth-heart"; 
    h.innerText = Math.random() > 0.6 ? "❤️" : (Math.random() > 0.5 ? "💖" : "✨"); 
    
    h.style.left = Math.random() * 100 + "vw";
    h.style.top = Math.random() * 100 + "vh";
    h.style.fontSize = (25 + Math.random() * 30) + "px";
    
    // Using CSS animation
    h.style.animationName = "floatUpSmooth";
    
    // Slow duration for smoothness
    const duration = 3 + Math.random() * 2; 
    h.style.animationDuration = duration + "s";
    
    // Random Delay for "popping" effect
    h.style.animationDelay = Math.random() * 2 + "s";
    
    document.body.appendChild(h);
    setTimeout(() => h.remove(), (duration + 3) * 1000);
  }

  // Background Rain continues
  const loveInterval = setInterval(() => {
    spawnLoveHeart();
    if (Math.random() > 0.5) spawnLoveHeart();
  }, 300);
  
  setTimeout(() => clearInterval(loveInterval), 25000);
}

/* ---------- NO CLICK (Clean Text Messages) ---------- */
function doNo() {
  if (finalBroken) return;

  // Simple Text Messages
  const noMessages = [
    `Arey! Aisa mat karo, ${userName}, dil dhadakna bhool jayega 💔`,
    `Tumhari 'Na' sunke toh... Duniya hi ruk gayi meri 🥺`,
    `In aankhon mein dekho... Kya sach mein pyaar nahi dikhta? 😢`,
    `Phoolon si muskaan hai tumhari, Mat todo dil hamara... 🌹💔`,
    `Itna bhav mat khao, Jaan nikal rahi hai yaha 😩`,
    `Socho... ${userName}, Hum saath mein kitne perfect lagenge? 👩‍❤️‍👨`,
    `Tumhaari ek 'Haa' ke liye toh Main puri duniya se lad lu... 😣`,
    `Kya main itna bura hu? Ek mauka toh dekar dekho 😭`,
    `Kaach sa dil hai mera, 'No' bolke patthar mat maaro 🔨💔`,
    `Main wait karunga... Chaahe puri zindagi lag jaye 🕰️❤️`,
    `Tuta hua dil jodna aasan nahi, Tum todne par kyu tuli ho? 🧩😢`,
    `Ab toh aansu bhi aane lage hain... Dekho na? 😿`,
    `Mujhse behtar koi pyaar nahi karega tumhe... Ye wada hai! 💯`,
    `Zindagi mein sab mil jayega, Par tumhare bina sab adhoora hai... 🌑`,
    `Khuda se maanga tha tumhe, Tum yu muh modogi toh khuda kya sochega? 🤲☹️`,
    `Himmat toot rahi hai ab... Please thaam lo haath mera 🏳️`,
    `Dard ho raha hai yaha (❤️)... Mazaak nahi kar raha 😭`,
    `Meri saansein atki hain Tumhari ek 'YES' par... 🌬️😰`,
    `Bas ek aakhri baar puch raha hu... Kar do na haan? 🥺🙏`,
    `Theek hai... agar yahi tumhari khushi hai... Toh main haar gaya 🥀💔`
  ];

  noCount++;
  
  // Using innerText for clean simple text
  msgEl.innerText = noMessages[Math.min(noCount - 1, noMessages.length - 1)];
  msgEl.style.opacity = 1;

  saveResponse("NO"); // Upsert, backend will increment noClickCount

  shakeScreen(10, 220);

  for (let i = 0; i < 8; i++) {
    setTimeout(() => spawnBrokenHeart(), i * 80);
  }

  moveButton(noBtn);

  if (noCount >= 20) finalizeBroken();
}

/* ---------- Move Button Logic ---------- */
function moveButton(el) {
  const btnRect = el.getBoundingClientRect();
  const msgRect = msgEl.getBoundingClientRect();
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  
  let x, y;
  let attempts = 0;
  const maxAttempts = 50;
  
  do {
    x = (Math.random() * (screenWidth - 200) - (screenWidth / 2 - 100));
    y = (Math.random() * (screenHeight - 150) - (screenHeight / 2 - 75));
    
    const newBtnX = btnRect.left + x;
    const newBtnY = btnRect.top + y;
    const newBtnRight = newBtnX + btnRect.width;
    const newBtnBottom = newBtnY + btnRect.height;
    
    const overlapsMsg = !(
      newBtnRight < msgRect.left ||
      newBtnX > msgRect.right ||
      newBtnBottom < msgRect.top ||
      newBtnY > msgRect.bottom
    );
    
    if (!overlapsMsg) break;
    attempts++;
  } while (attempts < maxAttempts);
  
  el.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
  el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
}

/* ---------- Shake Screen Logic ---------- */
function shakeScreen(intensity, duration) {
  const start = Date.now();
  const body = document.body;
  let raf;
  
  (function loop() {
    const t = Date.now() - start;
    if (t > duration) {
      body.style.transform = "";
      cancelAnimationFrame(raf);
      return;
    }
    const progress = 1 - (t / duration);
    const currentIntensity = intensity * progress;
    const dx = Math.random() * currentIntensity - currentIntensity / 2;
    const dy = Math.random() * currentIntensity - currentIntensity / 2;
    body.style.transform = `translate(${dx}px, ${dy}px)`;
    raf = requestAnimationFrame(loop);
  })();
}




/* ---------- Final Broken Mode ---------- */
async function finalizeBroken() {
  finalBroken = true;
  document.body.classList.add("sad");
  document.querySelector(".card-box").classList.add("sad");

  qEl.innerHTML = "You Broke My Heart 💔";
  // Colored Name in Final Screen
  msgEl.innerHTML = `Shayad meri kismat mein hi...<br><span style="color: #ff1744; font-weight: bold;">${userName}</span> ka pyaar nahi tha. 🥀😢`;

  yesBtn.disabled = true;
  noBtn.disabled = true;

  await saveResponse("NO");

  clearInterval(loveRainInterval);
  heartRain.innerHTML = '';

  setInterval(() => {
    spawnBrokenHeart({ falling: true });
    if (Math.random() > 0.4) spawnBrokenHeart({ falling: true });
  }, 300);
}

/* ---------- Love Rain Start ---------- */
let loveRainInterval = setInterval(() => {
  if (!finalBroken) {
    spawnLoveHeart();
    if (Math.random() > 0.4) spawnLoveHeart();
  }
}, 300);

/* ---------- Events ---------- */
yesBtn.addEventListener("click", doYes);
noBtn.addEventListener("click", doNo);

/* ---------- Heart Burst (Mixed Hearts) ---------- */
function createHeartBurst(x, y, isBroken = false) {
  for (let i = 0; i < 8; i++) {
    const mini = document.createElement("div");
    
    // Mixed hearts for both love and broken modes
    if (isBroken) {
      mini.innerText = Math.random() > 0.5 ? "💔" : "🖤"; 
    } else {
      mini.innerText = Math.random() > 0.5 ? "❤️" : "💖";
    }
    
    mini.style.position = "fixed";
    mini.style.left = x + "px";
    mini.style.top = y + "px";
    mini.style.fontSize = "12px";
    mini.style.pointerEvents = "none";
    mini.style.zIndex = "10000";
    mini.style.transition = "all 0.6s ease-out";
    
    const angle = (Math.PI * 2 * i) / 8;
    const distance = 40 + Math.random() * 20;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    document.body.appendChild(mini);
    
    requestAnimationFrame(() => {
      mini.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
      mini.style.opacity = "0";
    });
    
    setTimeout(() => mini.remove(), 650);
  }
}