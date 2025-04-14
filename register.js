    
 let arr = JSON.parse(localStorage.getItem("users")) || [];

function validateForm(event) {
  event.preventDefault(); // Stop default form submission

  let name = document.forms["RegForm"]["Name"].value.trim();
  let email = document.forms["RegForm"]["EMail"].value.trim();
  let password = document.forms["RegForm"]["Password"].value;
  let confirmPassword = document.forms["RegForm"]["Confirm"].value;

  if (!name || !email || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return false;
  }

  if (password !== confirmPassword) {
    alert("Password and Confirm Password should be the same.");
    return false;
  }

  if (isUserExists(email)) {
    alert("User already registered with this email.");
    return false;
  }

  // Create new user object
  let userObj = {
    id: Date.now(),
    name,
    email,
    password
  };

  arr.push(userObj);
  localStorage.setItem("users", JSON.stringify(arr));
  alert("Registration successful!");

  // Redirect to login/home page
  window.location.href = "/index.html";
  return true;
}

function isUserExists(email) {
  return arr.some((user) => user.email === email);
}
