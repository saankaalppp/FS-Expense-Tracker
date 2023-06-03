const cn = document.getElementById('container');
const form = document.getElementById('form');
const expense = document.getElementById('expense');
const desc = document.getElementById('desc');
const type = document.getElementById('type');
const expenseId = document.getElementById('id');
const submitBtn = document.getElementById('submit-btn');
const myModal = document.getElementById('addExpenseModal');
const premBtnC = document.getElementById('prembtnc');
const premBtn = document.getElementById('prembtn');
let content = document.getElementById('content');

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000'
});

window.addEventListener('DOMContentLoaded', () => {
    render();
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    console.log('entered');

    const newExpense = {
        amount: expense.value,
        description: desc.value,
        category: type.value
    }

    console.log(desc.value === '');

        try {
            const token = localStorage.getItem('token');
            await axiosInstance.post('/add-expense', newExpense, { headers: { "Authorization": token} });
        } catch(err) {
            console.log(err);
        }

    form.reset();
    render();
    console.log('done');
});



async function render() {
    let result;
    try {
        const token = localStorage.getItem('token');
        result = await axiosInstance.get('/expenses', { headers: { "Authorization": token} });
    } catch(err) {
        console.log(err);
    }
    console.log(result);
    const expenses = result.data.expenses;
    content.innerHTML = "";

    if(expenses.length == 0) {
        content.innerHTML = `
            <h2>Currently no expenses to show</h2>
        `;
        content.className = 'd-flex justify-content-center align-items-center bg-info mt-5 p-5';
        return;
    }

    content.className = 'data';

    for(let i=0;i<expenses.length;i++) {
        const curr = expenses[i];

        content.innerHTML += `
            <table class="table table-hover table-info table-borderless">
                <tbody class="text-dark" style="font-family: 'DM Serif Display', serif;">
                    <tr>
                        <th class="col-1">${i+1}</th>
                        <td class="col-3">${curr.category}</td>
                        <td class="col-4">${curr.description}</td>
                        <td class="col-2">${curr.amount}</td>
                        <td class="col-2"><button id="dt" class="btn btn-primary" onclick="deleteExpense(${curr.id})">Delete</button></td>
                    </tr>
                </tbody>
            </table>
            `;
    }

    if(content.scrollHeight > content.clientHeight)
        document.getElementById('scroll-text').hidden = "";
    else
        document.getElementById('scroll-text').hidden = "hidden";

}

async function deleteExpense(id) {
    const token = localStorage.getItem('token');
    await axiosInstance.post(`/delete-expense`, { expenseId: id }, { headers: { "Authorization": token} });
    render();
}
// premium feature

premBtn.onclick = async function(e) {
    const token = localStorage.getItem('token');
    try {
        var response = await axiosInstance.get('/purchase/premiumMembership', { headers: { 'Authorization': token } });
        console.log(response);
    } catch(err) {
        console.log(err);
        return;
    }

    const options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function(response) {
            await axiosInstance.post('http://localhost:3000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            }, { headers: { 'Authorization': token } });

            alert('You are premium user now.');

            premBtnC.style.display = 'none';
        }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', async function(response) {
        console.log(response);
        await axiosInstance.post('http://localhost:3000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            }, { headers: { 'Authorization': token } });
        alert("Something went wrong!");
    });
}