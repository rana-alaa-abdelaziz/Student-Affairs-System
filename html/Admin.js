function signinCheck(event) {
    event.preventDefault();

    const emailInput = document.getElementById("email").value.trim();
    const passwordInput = document.getElementById("password").value.trim();

    if (!emailInput || !passwordInput) {
        alert("Please fill in both fields");
        return;
    }

    const savedEmail = "RanaAlaa@gmail.com";
    const savedPass = "123";

    if (emailInput === savedEmail && passwordInput === savedPass) {
        alert("Sign-In successful");
        window.location.href = "dashboard.html"; 
    } else {
        alert("Email does not exist or password is wrong");
    }
}
