document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const showPassword = document.getElementById("showPassword");
  const passwordInput = document.getElementById("password");
  const errorMsg = document.getElementById("errorMsg");

  if (showPassword) {
    showPassword.addEventListener("change", () => {
      passwordInput.type = showPassword.checked ? "text" : "password";
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = passwordInput.value;

      const storedEmail = localStorage.getItem("email");
      const storedPassword = localStorage.getItem("password");

      if (email === storedEmail && password === storedPassword) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", email.split("@")[0]);
        window.location.href = "home.html";
      } else {
        errorMsg.textContent = "Invalid email or password!";
      }
    });
  }

  if (window.location.pathname.includes("home.html")) {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      window.location.href = "index.html";
    }
    renderPosts();
  }
});

// Create demo account
function createDemoAccount() {
  const email = prompt("Enter new email:");
  const password = prompt("Enter password:");
  if (email && password) {
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    alert("Demo account created. Now login.");
  }
}

// Logout
function logout() {
  localStorage.setItem("isLoggedIn", "false");
  window.location.href = "index.html";
}

// Create post
function createPost() {
  const content = document.getElementById("post-content").value;
  if (!content.trim()) return;

  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const username = localStorage.getItem("username") || "User";
  const avatar = `https://ui-avatars.com/api/?name=${username}&background=random`;
  const timestamp = new Date().toLocaleString();

  posts.unshift({ username, content, avatar, timestamp });
  localStorage.setItem("posts", JSON.stringify(posts));
  document.getElementById("post-content").value = "";
  renderPosts();
}

// Render posts
function renderPosts() {
  const container = document.getElementById("posts-container");
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  container.innerHTML = "";

  posts.forEach((post, index) => {
    const postDiv = document.createElement("div");
    postDiv.className = "post";

    postDiv.innerHTML = `
      <div class="post-header">
        <img src="${post.avatar}" alt="avatar" class="avatar"/>
        <div>
          <strong>${post.username}</strong>
          <div class="timestamp">${post.timestamp}</div>
        </div>
      </div>
      <p>${post.content}</p>
      <div class="actions">
        <button onclick="editPost(${index})">Edit</button>
        <button onclick="deletePost(${index})">Delete</button>
      </div>
    `;
    container.appendChild(postDiv);
  });
}

// Delete post
function deletePost(index) {
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  posts.splice(index, 1);
  localStorage.setItem("posts", JSON.stringify(posts));
  renderPosts();
}

// Edit post
function editPost(index) {
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const newText = prompt("Edit your post:", posts[index].content);
  if (newText !== null) {
    posts[index].content = newText;
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
  }
}
