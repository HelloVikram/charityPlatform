const endpoint = 'http://localhost:3000';
const token = localStorage.getItem('token');

async function donate(charityId) {
    const amountInput = document.getElementById(`amount-${charityId}`);
    const amount = parseFloat(amountInput.value);
    if (!amount || amount <= 0) return alert("Please enter a valid amount");

    try {
        const res = await axios.post(`${endpoint}/donate`, {
            amount,
            charityId
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const { order } = res.data;

        const options = {
            key: `rzp_test_0zj1qyTgEe1UKm`,
            amount: order.amount,
            currency: 'INR',
            name: 'Charity Donation',
            description: 'Thank you for your support!',
            order_id: order.id,
            handler: async function (response) {
                try {
                    await axios.put(`${endpoint}/donate/verify`, {
                        orderId: response.razorpay_order_id,
                        paymentId: response.razorpay_payment_id,
                        status: 'success'
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    alert('Donation successful!');
                    loadDonationSummary();
                    loadDonationHistory();
                } catch (err) {
                    console.error('Failed to verify donation', err);
                    alert('Donation verification failed');
                }
            },
            prefill: {
                name: "Your Name",
                email: "email@example.com"
            },
            theme: {
                color: "#3399cc"
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();
    } catch (err) {
        console.error('Donation failed', err);
        alert('Failed to initiate donation');
    }
}

async function loadDonationSummary() {
    try {
        const res = await axios.get(`${endpoint}/donation-summary`);
        const charities = res.data;
        const listDiv = document.getElementById('charity-list');
        listDiv.innerHTML = '';

        charities.forEach(charity => {
            const div = document.createElement('div');
            div.innerHTML = `
     <div class="card h-100 shadow-sm">
     <div class="card-body">
      <h5 class="card-title">${charity.name}</h5>
      <p class="card-text">${charity.description}</p>
      <p class="text-muted"><strong>Location:</strong> ${charity.location}</p>
      <p class="text-muted"><strong>Category:</strong> ${charity.category}</p>
      <p class="text-muted"><strong>Goal:</strong> ₹${charity.goal_amount}</p>
      <p class="text-muted"><strong>Donated:</strong> ₹${charity.totalDonated}</p>
      <div class="progress">
        <div class="progress-bar bg-success" role="progressbar" style="width: ${charity.progress.toFixed(
                1
            )}%;" aria-valuenow="${charity.progress.toFixed(1)}" aria-valuemin="0" aria-valuemax="100">
          ${charity.progress.toFixed(1)}%
        </div>
        </div>
        <input type="number" id="amount-${charity.id}" class="form-control form-control-sm mt-2" placeholder="Enter amount" />
       <button class="btn btn-success btn-sm mt-2" onclick="donate(${charity.id})">Donate</button>
    </div>
  </div>
`;
            listDiv.appendChild(div);
        });
    } catch (err) {
        console.error('Failed to load donation summary', err);
    }
}
async function loadDonationHistory() {
    try {
        const res = await axios.get(`${endpoint}/user-history`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const donations = res.data;
        const historyDiv = document.getElementById('donation-history');
        historyDiv.innerHTML = '';

        if (donations.length === 0) {
            historyDiv.innerHTML = '<p>No donations made yet.</p>';
            return;
        }

        donations.forEach(donation => {
            const div = document.createElement('div');
            div.innerHTML = `
                <p>Charity: ${donation.Charity.name}</p>
                <p>Amount: ₹${donation.amount}</p>
                <p>Date: ${new Date(donation.createdAt).toLocaleDateString()}</p>
                ${donation.status === 'SUCCESS' ? `<button onclick="downloadReceipt(${donation.id})">Download Receipt</button>` : '<p>Status: ' + donation.status + '</p>'}
                <hr>
            `;
            historyDiv.appendChild(div);
        });
    } catch (err) {
        console.log('Failed to load donation history', err);
    }
}

function downloadReceipt(donationId) {
    window.open(`${endpoint}/receipt/${donationId}`, '_blank');
}

async function applyFilters() {
    const name = document.getElementById('filter-name').value;
    const category = document.getElementById('filter-category').value;
    const location = document.getElementById('filter-location').value;

    try {
        const res = await axios.get(`${endpoint}/approved`, {
            params: { name, category, location }
        });
        const charities = res.data;
        const listDiv = document.getElementById('charity-list');
        listDiv.innerHTML = '';
        charities.forEach(charity => {
            const div = document.createElement('div');
            div.innerHTML = `
 <div class="card h-100 shadow-sm">
    <div class="card-body">
      <h5 class="card-title">${charity.name}</h5>
      <p class="card-text">${charity.description}</p>
      <p class="text-muted"><strong>Location:</strong> ${charity.location}</p>
      <p class="text-muted"><strong>Category:</strong> ${charity.category}</p>
      <p class="text-muted"><strong>Goal:</strong> ₹${charity.goal_amount}</p>
      <input type="number" id="amount-${charity.id}" class="form-control form-control-sm mt-2" placeholder="Enter amount" />
      <button class="btn btn-success btn-sm" onclick=donate(${charity.id})>Donate</button>
    </div>
  </div>
`;
            listDiv.appendChild(div);
        });
    } catch (err) {
        console.error('Failed to filter charities', err);
    }
}
loadDonationSummary();
loadDonationHistory();
