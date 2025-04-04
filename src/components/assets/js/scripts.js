//Toogle pasword visibility

document.addEventListener("DOMContentLoaded", function () {
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");

    togglePassword.addEventListener("click", function () {
        let icon = this.querySelector("i");

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
        } else {
            passwordInput.type = "password";
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
        }
    });
});

//Toogle resize textarea
document.addEventListener("DOMContentLoaded", function () {
    let textarea = document.getElementById("job-info");

    function autoResizeTextarea() {
        this.style.height = "auto"; // Đặt về auto để tính lại
        this.style.height = this.scrollHeight + "px"; // Cập nhật theo nội dung
    }

    // Lắng nghe sự kiện input để tự động thay đổi chiều cao
    if (textarea) {
        textarea.addEventListener("input", autoResizeTextarea);
    }
});
