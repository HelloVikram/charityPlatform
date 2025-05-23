const endpoint=`http://localhost:3000`
document.getElementById('charityForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('token');
  if (!token) return alert('Please login first.');

  const data = {
    name: document.getElementById('name').value,
    description: document.getElementById('description').value,
    goal_amount: parseFloat(document.getElementById('goal_amount').value),
    category: document.getElementById('category').value,
    location: document.getElementById('location').value
  };

  try {
    const res = await axios.post(`${endpoint}/charity/register`, data, {
  headers: {
    Authorization: `Bearer ${token}` 
  }
});
    alert('Charity registered successfully');
    document.getElementById('charityForm').reset();
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to register charity');
  }
});
