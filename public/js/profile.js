const endpoint = `http://localhost:3000`
document.getElementById('updateForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const updatedName = document.getElementById('update-name').value.trim();
    const updatedEmail = document.getElementById('update-email').value.trim();
    const newPassword = document.getElementById('update-password').value;
    const token = localStorage.getItem('token');

    try {
        const res = await axios.put(`${endpoint}/profile`, {
            name: updatedName,
            email: updatedEmail,
            password: newPassword
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        alert(res.data.message || 'Profile updated!');
         e.target.reset();
         window.location.href='./home.html'
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to update profile');
    }
});