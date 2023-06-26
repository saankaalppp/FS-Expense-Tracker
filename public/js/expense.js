const formAddExpense = document.getElementById('form-add-expense');
const formAddIncome = document.getElementById('form-add-income');
const expense = document.getElementById('expense');
const income = document.getElementById('income');
const expenseDesc = document.getElementById('expense-desc');
const incomeDesc = document.getElementById('income-desc');
const type = document.getElementById('type');
const expenseDate = document.getElementById('expense-date');
const incomeDate = document.getElementById('income-date');
const expenseId = document.getElementById('id');
const submitBtn = document.getElementById('submit-btn');
const myModal = document.getElementById('addExpenseModal');
const premBtnC = document.getElementById('prembtnc');
const premBtn = document.getElementById('prembtn');

const downloadFileBtn = document.getElementById('downloadfile');
const expensesTable = document.getElementById('expenses-table');
const expensesTableBody = document.getElementById('expenses-table-body');
const reportTypeBtn = document.getElementById('report-type-btn');
const content = document.getElementById('content');
const items = document.getElementsByClassName('item');
const itemsArr = Array.from(items);
let token, expenses;

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000'
});

window.addEventListener('DOMContentLoaded', () => {
    token = localStorage.getItem('token');
    renderPremiumFeatures();
    reportTypeBtn.innerText = 'Daily';
    renderDaily();
});
itemsArr.forEach(item => {
    item.addEventListener('click', (e) => {
        const reportType = e.target.innerText;
        reportTypeBtn.innerText = reportType;

        switch (reportType) {
            case 'Daily':
                renderDaily();
                break;
            case 'Monthly':
                renderMonthly();
                break;
            case 'Yearly':
                renderYearly();
                break;
            case 'All':
                renderAll();
            default:
                renderNone();
        }
    });
})

formAddExpense.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newExpense = {
        amount: expense.value,
        description: expenseDesc.value,
        category: type.value,
        date: expenseDate.value
    }
    try {
        await axiosInstance.post('/add-expense', newExpense, { headers: { "Authorization": token } });
    } catch (err) {
        console.log(err);
    }
    formAddExpense.reset();
    expenses = await getAllExpenses();
    renderDataMonthly();
});

formAddIncome.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newIncome = { 
        amount: income.value,
        description: incomeDesc.value,
        date: incomeDate.value
    }
    try {
        await axiosInstance.post('/add-income', newIncome, { headers: { "Authorization": token } });
    } catch (err) {
        console.log(err);
    }

    console.log(result);

    formAddIncome.reset();
    render();
    async function renderDaily() {
        const curr = new Date();
        let currMonth = curr.getMonth() + 1;
        let currDate = curr.getDay();
        if (currMonth < 10)
            currMonth = '0' + currMonth;
        if(currDate < 10)
            currDate = '0' + currDate;

            content.innerHTML = `
            <div class="container mb-4 d-flex flex-column justify-content-center align-items-center">
                        <div class="d-flex mb-3">
                                <label for="dateInput" style="font-weight: bold;">Select date:</label>
                                <input type="date" min="2010-01-01" max="2050-12-01" value="${curr.getFullYear()}-${currMonth}-${currDate}" class="w-auto ms-2" id="dateInput">
                                <button class="btn btn-primary ms-2" id="search">Search</button>
                        </div>
                            <table id="expenses-table" class="table text-white table-hover table-bordered">
                                <thead class="mb-5" style="font-family: 'Exo 2', sans-serif;background-color: rgb(32,144,158)">
                                    <tr class="mt-5">
                                        <th class="title col-2">Date (yyyy/mm/dd)</th>
                                        <th class="title col-2">Category</th>
                                        <th class="title col-4">Description</th>
                                        <th class="title col-2">Income</th>
                                        <th class="title col-2">Expense</th>
                                    </tr>
                                </thead>
                                <tbody id="expenses-table-body" class="body text-dark">
                                </tbody>
                            </table>
                </div>
            `;
        
            document.getElementById('search').addEventListener('click', (e) => {
                renderDataDaily();
            });
            renderDataDaily();
        }
        
        async function renderDataDaily() {
            try {
                expenses = await getAllExpenses();
            } catch(err) {
                alert('Something went wrong!');
                return;
            }
    }
    let dateInput = document.getElementById('dateInput').value;
    dateInput = new Date(dateInput);

    const filteredExpenses = expenses.filter(expense => {
        const date = new Date(expense.date);
        return (date.getFullYear() === dateInput.getFullYear()) && (date.getMonth() === dateInput.getMonth()) && (date.getDate() === dateInput.getDate());
    });

    const tableBody = document.getElementById('expenses-table-body');
    const expensesTable = document.getElementById('expenses-table');
    let totalIncome = 0, totalExpense = 0, totSavings = 0;

    tableBody.innerHTML = '';
    filteredExpenses.forEach(expense => {
        tableBody.innerHTML += `
            <tr style="background-color: #C4C4C4;">
                <td class="data col-2">${expense.date}</td>
                <td class="data col-2">${expense.category}</td>
                <td class="data col-4">${expense.description}</td>
                <td class="income col-2">--</td>
                <td class="expense col-2">${expense.amount}</td>
            </tr>
        `;
        totalExpense += expense.amount;
    })

    tableBody.innerHTML += `
        <tr class="total">
            <td class="col-2"></td>
            <td class="col-2"></td>
            <td class="col-4"></td>
            <td class="income col-2">&#8377;0</td>
            <td class="expense col-2">&#8377;${totalExpense}</td>
        </tr>
        <tr class="total">
            <td class="col-2"></td>
            <td class="col-2"></td>
            <td class="col-4"></td>
            <td class="col-2"></td>
            <td class="savings col-2">Savings=&#8377;0</td>
        </tr>
    `;
}

async function renderMonthly() {
    content.innerHTML = '';

    const curr = new Date();
    let currMonth = curr.getMonth() + 1;
    if (currMonth < 10)
        currMonth = '0' + currMonth;
        content.innerHTML = `
        <div class="container mb-4 d-flex flex-column justify-content-center align-items-center position-relative">
                    <div class="d-flex mb-3">
                            <label for="dateInput" style="font-weight: bold;">Select month:</label>
                            <input type="month" min="2010-01" max="2050-12" value="${curr.getFullYear()}-${currMonth}" class="w-auto ms-2" id="dateInput">
                            <button class="btn btn-primary ms-2" id="search">Search</button>
                    </div>
                        <table id="expenses-table" class="table text-white table-hover table-bordered">
                            <thead class="mb-5" style="font-family: 'Exo 2', sans-serif;background-color: rgb(32,144,158)">
                                <tr class="mt-5">
                                    <th class="title col-2">Date (yyyy/mm/dd)</th>
                                    <th class="title col-2">Category</th>
                                    <th class="title col-4">Description</th>
                                    <th class="title col-2">Income</th>
                                    <th class="title col-2">Expense</th>
                                </tr>
                            </thead>
                            <tbody id="expenses-table-body" class="body text-dark">
                            </tbody>
                        </table>
            </div>
        `;
    
        document.getElementById('search').addEventListener('click', (e) => {
            // console.log();
            renderDataMonthly();
        });
    
        renderDataMonthly();
    }
    
    async function renderDataMonthly() {
        const tableBody = document.getElementById('expenses-table-body');
        const expensesTable = document.getElementById('expenses-table');
        let totalIncome = 0, totalExpense = 0, totSavings = 0;
    
        expenses = await getAllExpenses();
        expenses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
        tableBody.innerHTML = '';
    
        const date = document.getElementById('dateInput').value;
        const month = new Date(date).getMonth();
        const year = new Date(date).getFullYear();
    
        const filteredExpenses = expenses.filter(expense => {
            return new Date(expense.date).getMonth() === month && new Date(expense.date).getFullYear() === year;
        });
    
        filteredExpenses.forEach(expense => {
            tableBody.innerHTML += `
                <tr style="background-color: #C4C4C4;">
                    <td class="data col-2">${expense.date}</td>
                    <td class="data col-2">${expense.category}</td>
                    <td class="data col-4">${expense.description}</td>
                    <td class="income col-2">--</td>
                    <td class="expense col-2">${expense.amount}</td>
                </tr>
                `;
                totalExpense += expense.amount;
            })
        
            tableBody.innerHTML += `
                <tr class="total">
                    <td class="col-2"></td>
                    <td class="col-2"></td>
                    <td class="col-4"></td>
                    <td class="income col-2">&#8377;0</td>
                    <td class="expense col-2">&#8377;${totalExpense}</td>
                </tr>
                <tr class="total">
                    <td class="col-2"></td>
                    <td class="col-2"></td>
                    <td class="col-4"></td>
                    <td class="col-2"></td>
                    <td class="savings col-2">Savings=&#8377;0</td>
                </tr>
            `;
        }
        
        function renderYearly() {
            content.innerHTML = '';
        
            content.innerHTML = `
            <div class="container mb-4 d-flex flex-column justify-content-center align-items-center">
                <div class="d-flex mb-3">
                    <label for="dateInput" style="font-weight: bold;">Select year:</label>
                    <input type="number" min="2010" max="2023" value="${new Date().getFullYear()}" class="w-auto ms-2" id="yearInput">
                    <button class="btn btn-primary ms-2" id="search">Search</button>
                </div>
                <table id="expenses-table" class="table text-white table-hover table-bordered">
                <thead class="mb-5" style="font-family: 'Exo 2', sans-serif;background-color: rgb(32,144,158)">
                    <tr class="title mt-5">
                        <th class="col-2">Month</th>
                        <th class="col-3">Income</th>
                        <th class="col-3">Expense</th>
                        <th class="col-4">Savings</th>
                    </tr>
                </thead>
                <tbody id="expenses-table-body" class="text-dark">
                </tbody>
                </table>
            </div>
            `;
        
            document.getElementById('search').addEventListener('click', (e) => {
                renderDataYearly();
            });
        
            renderDataYearly();
        }
        
        async function renderDataYearly() {
            const yearInput = document.getElementById('yearInput').value;
            console.log(yearInput);
            const date = new Date();
            if(yearInput > date.getFullYear() || yearInput < 2010) {
                alert(`Enter year between 2010 and ${date.getFullYear()}`);
        return;
    }

    expenses = await getAllExpenses();
        expenses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const expensesTable = document.getElementById('expenses-table');
        const tableBody = document.getElementById('expenses-table-body');
        let totalIncome = 0, totalExpense = 0, totSavings = 0;

        tableBody.innerHTML = '';

        const expensesByMonths = getExpensesByMonths(expenses, yearInput);
    // console.log(expensesByMonths);

    expensesByMonths.forEach((value, key) => {
        console.log(key + " " + value);
        currMonth = new Date(expense.date).getMonth()+1;
            tableBody.innerHTML += `
                <tr class="body">
                    <td class="data col-2">${months[key]}</td>
                    <td class="income col-3">--</td>
                    <td class="expense col-3">${value}</td>
                    <td class="savings col-4">0</td>
                </tr>
            `;
            totalExpense += value;
        })

    tableBody.innerHTML += `
        <tr class="total">
            <td class="col-2"></td>
            <td class="income col-3">&#8377;0</td>
            <td class="expense col-3">&#8377;${totalExpense}</td>
            <td class="savings col-4">&#8377;0</td>
        </tr>
    `;
}

function getExpensesByMonths(expenses, year) {
    const filteredExpenses = expenses.filter(expense => {
        return new Date(expense.date).getFullYear() === Number(year);
    });

    console.log(filteredExpenses);

    const expensesByMonths = new Map();

    filteredExpenses.forEach(expense => {
        console.log(expense);
        const month = new Date(expense.date).getMonth();
        if(expensesByMonths.has(month))
            expensesByMonths.set(month, expensesByMonths.get(month)+expense.amount);
        else
            expensesByMonths.set(month, expense.amount);
    })

    return expensesByMonths;
}

async function renderAll() {
    content.innerHTML = `
    <div class="container mb-4 d-flex flex-column justify-content-center align-items-center">
                    <table id="expenses-table" class="table text-white table-hover table-bordered">
                        <thead class="mb-5" style="font-family: 'Exo 2', sans-serif;background-color: rgb(32,144,158)">
                            <tr class="mt-5">
                                <th class="title col-2">Date (yyyy/mm/dd)</th>
                                <th class="title col-2">Category</th>
                                <th class="title col-4">Description</th>
                                <th class="title col-2">Income</th>
                                <th class="title col-2">Expense</th>
                            </tr>
                        </thead>
                        <tbody id="expenses-table-body" class="body text-dark">
                        </tbody>
                    </table>
        </div>
    `;

    try {
        expenses = await getAllExpenses();
    } catch(err) {
        alert('Something went wrong!');
        return;
    }

    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    const tableBody = document.getElementById('expenses-table-body');
    const expensesTable = document.getElementById('expenses-table');
    let totalIncome = 0, totalExpense = 0, totSavings = 0;

    tableBody.innerHTML = '';

    expenses.forEach(expense => {
        tableBody.innerHTML += `
            <tr style="background-color: #C4C4C4;">
                <td class="data col-2">${expense.date}</td>
                <td class="data col-2">${expense.category}</td>
                <td class="data col-4">${expense.description}</td>
                <td class="income col-2">--</td>
                <td class="expense col-2">${expense.amount}</td>
            </tr>
        `;
        totalExpense += expense.amount;
    })

    tableBody.innerHTML += `
        <tr class="total">
            <td class="col-2"></td>
            <td class="col-2"></td>
            <td class="col-4"></td>
            <td class="income col-2">&#8377;0</td>
            <td class="expense col-2">&#8377;${totalExpense}</td>
        </tr>
        <tr class="total">
            <td class="col-2"></td>
            <td class="col-2"></td>
            <td class="col-4"></td>
            <td class="col-2"></td>
            <td class="savings col-2">Savings=&#8377;0</td>
        </tr>
    `;
}

async function renderNone() {

}

function renderPremiumFeatures() {
    const user = decodeToken(token);
    const isPremium = user.isPremium;

    if (isPremium) {
        premBtnC.style.display = 'none';
        downloadFileBtn.onclick = downloadFile;
    }
}

function getAllExpenses() {
    return new Promise(async (resolve, reject) => {
        let result;
        try {
            result = await axiosInstance.get('/expenses', { headers: { "Authorization": token } });
            if (!result) {
                alert("Something went wrong!");
                return;
            }
            resolve(result.data.expenses);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}


function decodeToken(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// async function deleteExpense(id) {
//     const token = localStorage.getItem('token');
//     await axiosInstance.post(`/delete-expense`, { expenseId: id }, { headers: { "Authorization": token} });
//     render();
// }

// premium feature

premBtn.onclick = async function (e) {
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
            const result = await axiosInstance.post('http://localhost:3000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            }, { headers: { 'Authorization': token } });
            alert('You are premium user now.');
            console.log(result.data);

            localStorage.setItem('token', result.data.token);

            window.reload();
        }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
    rzp1.on('payment.failed', async function (response) {
        console.log(response);
        await axiosInstance.post('http://localhost:3000/purchase/updatetransactionstatus', {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id
        }, { headers: { 'Authorization': token } });
        alert("Something went wrong!");
        render();
    });

}

async function downloadFile() {
    try {
        const response = await axiosInstance.get('/download', { headers: { 'Authorization': token } });
        if (response.data.success) {
            const z = document.createElement('a');
            z.href = response.data.fileUrl;
            z.click();
        }
        else
            alert('Something went wrong!');
    } catch (err) {
        alert(err);
    }
}