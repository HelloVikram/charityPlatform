const endpoint = 'http://localhost:3000'; 
const token = localStorage.getItem('token'); 

async function loadPendingCharities() {
  try {
    const res = await axios.get(`${endpoint}/pending`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const container = document.getElementById('pending-charities');
    container.innerHTML = '';

   res.data.forEach(charity => {
  const div = document.createElement('div');
  div.className = 'card mb-3 shadow-sm';

  div.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${charity.name}</h5>
      <p class="card-text">${charity.description}</p>
      <p class="card-text"><small class="text-muted">Location: ${charity.location}</small></p>
      <div class="d-flex justify-content-end gap-2">
        <button class="btn btn-success btn-sm" onclick="approve(${charity.id})">Approve</button>
        <button class="btn btn-danger btn-sm" onclick="reject(${charity.id})">Reject</button>
      </div>
    </div>
  `;
  
  container.appendChild(div);
});

  } catch (err) {
    console.error('Failed to load charities', err);
  }
}

async function approve(id) {
  try {
    await axios.put(`${endpoint}/approve/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('Charity approved');
    loadPendingCharities();
  } catch (err) {
    console.error('Approval failed', err);
  }
}

async function reject(id) {
  try {
    await axios.delete(`${endpoint}/reject/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('Charity rejected');
    loadPendingCharities();
  } catch (err) {
    console.error('Rejection failed', err);
  }
}

loadPendingCharities();
