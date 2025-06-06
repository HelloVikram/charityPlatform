const endpoint = `http://localhost:3000`
document.getElementById('signupform').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('username-signup').value.trim();
    const email = document.getElementById('email-signup').value.trim();
    const password = document.getElementById('password-signup').value;
    const user_type = document.getElementById('usertype').value;

    try {
        const res = await axios.post(`${endpoint}/register`, { name, email, password, user_type });
        alert(res.data.message);
        e.target.reset();
        document.getElementById('signupFormContainer').style.display = 'none';
        document.getElementById('loginFormContainer').style.display = 'block';
    } catch (err) {
        alert(err.response?.data?.message || 'Registration failed');
    }
});

document.getElementById('loginform').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email-login').value.trim();
    const password = document.getElementById('password-login').value;

    try {
        const res = await axios.post(`${endpoint}/login`, { email, password });
        alert('Login successful');
        localStorage.setItem('token', res.data.token);
        window.location.href=`../home.html`;
        e.target.reset();
    } catch (err) {
        alert(err.response?.data?.message || 'Login failed');
    }
});



