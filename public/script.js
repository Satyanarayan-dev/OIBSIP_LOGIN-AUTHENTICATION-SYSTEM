document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const toastContainer = document.getElementById("toast-container");

  const showToast = (message, isSuccess) => {
    const toast = document.createElement("div");
    toast.classList.add("toast");
    if (isSuccess) {
      toast.innerHTML = '<i class="fas fa-check-circle"></i> ' + message;
    } else {
      toast.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + message;
    }
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
          toast.remove();
        }, 500);
      }, 3000);
    }, 100);
  };

  // Function to get user data from localStorage
  const getUserData = () => {
    return JSON.parse(localStorage.getItem("userData"));
  };

  // Function to save user data in localStorage
  const saveUserData = (username, password) => {
    const userData = { username, password };
    localStorage.setItem("userData", JSON.stringify(userData));
  };

  // Function to clear user data from localStorage
  const clearUserData = () => {
    localStorage.removeItem("userData");
  };

  // Add event listener for registration form submission
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevent form submission
      const username = document.getElementById("regUsername").value;
      const password = document.getElementById("regPassword").value;
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        showToast("Registration successful", true);
      } else {
        if (response.status === 400) {
          showToast(
            "Username already exists. Please choose a different username.",
            false
          );
        } else {
          showToast("Registration failed", false);
        }
      }
      // Clear input fields after displaying toast
      document.getElementById("regUsername").value = "";
      document.getElementById("regPassword").value = "";
    });
  }

  // Add event listener for login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevent form submission
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        showToast("Login successful", true);
        // Save user data in localStorage
        saveUserData(username, password);
        // Redirect to dashboard page
        window.location.href = "/dashboard";
      } else {
        showToast("Login failed. Invalid credentials", false);
      }
      // Clear input fields after displaying toast
      document.getElementById("username").value = "";
      document.getElementById("password").value = "";
    });
  }

  // Add event listener for logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // Show logout spinner
      const logoutSpinner = document.getElementById("logoutSpinner");
      logoutSpinner.style.display = "block";

      // Hide logout button and username
      logoutBtn.style.display = "none";
      const usernameSpan = document.getElementById("username");
      usernameSpan.style.display = "none";

      // Simulate logout process with a delay
      setTimeout(() => {
        // Clear user data from localStorage
        clearUserData();
        // Redirect to login page
        window.location.href = "/login";
      }, 2000); // 2 seconds delay for demonstration
    });
  }

  // Display username on the dashboard page
  const usernameSpan = document.getElementById("username");
  if (usernameSpan) {
    const userData = getUserData();
    if (userData) {
      usernameSpan.textContent = userData.username;
      usernameSpan.style.display = "inline"; // Show username in navbar
      logoutBtn.style.display = "inline"; // Show logout button in navbar
    }
  }
});
