const formAddExpense = document.getElementById('form-add-expense');
const formAddIncome = document.getElementById('form-add-income');
const expense = document.getElementById('expense');
const income = document.getElementById('income');
const expenseDesc = document.getElementById('expense-desc');
const incomeDesc = document.getElementById('income-desc');
const expenseType = document.getElementById('expensetype');
const incomeType = document.getElementById('incometype');
const expenseDate = document.getElementById('expense-date');
const incomeDate = document.getElementById('income-date');
const expenseId = document.getElementById('id');
const submitBtn = document.getElementById('submit-btn');
const myModal = document.getElementById('addExpenseModal');
const reportTypeBtn = document.getElementById('report-type-btn');
const downloadFileBtn = document.getElementById('downloadfile');
const content = document.getElementById('content');
const items = document.getElementsByClassName('item');
const itemsArr = Array.from(items);
let entries;
const incomeRowColor = '#a2ddd5';
let page;
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
window.addEventListener('DOMContentLoaded', () => {
    downloadFileBtn.onclick = downloadFile;
    reportTypeBtn.innerText = 'Daily';
    page=1;
    renderDaily();
});
itemsArr.forEach(item => {
    item.addEventListener('click', (e) => {
        const reportType = e.target.innerText;
        reportTypeBtn.innerText = reportType;
        page=1;
        
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
        }
    });
})
function renderData(view) {
    switch (view) {
        case 'Daily':
            renderDataDaily();
            break;
        case 'Monthly':
            renderDataMonthly();
            break;
        case 'Yearly':
            renderDataYearly();
            break;
        case 'All':
            renderAll();
    }
}
function addPaginationBtns(data, view) {
    const btnsC = document.createElement('div');
    btnsC.id='btnsC';
    btnsC.style.display = 'inline-block';
    btnsC.className = 'w-25 d-flex justify-content-center align-items-center m-auto mt-5';
    if(data.hasPreviousPage) {
        const btn2 = document.createElement('button');
        btn2.innerHTML = data.previousPage;
        btn2.addEventListener('click', (e) => {
            page=e.target.innerHTML;
            renderData(view);
        });
        btnsC.appendChild(btn2);
    }
    const btn1 = document.createElement('button');
    btn1.innerHTML = data.currentPage;
    btn1.className = 'mx-2 bg-dark text-white';
    btn1.addEventListener('click', (e) => {
        page=e.target.innerHTML;
        renderData(view);
    });
    btnsC.appendChild(btn1);
    console.log(data.hasNextPage);
    if(data.hasNextPage) {
        const btn3 = document.createElement('button');
        btn3.innerHTML = data.nextPage;
        btn3.addEventListener('click', (e) => {
            page=e.target.innerHTML;
            renderData(view);
        });
        btnsC.appendChild(btn3);
    }
    content.appendChild(btnsC);
}
formAddExpense.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newExpense = {
        amount: expense.value,
        description: expenseDesc.value,
        category: expenseType.value,
        date: expenseDate.value,
        entryType: 'expense'
    };
    postEntryAndUpdate(newExpense, formAddExpense);
});
formAddIncome.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log(incomeType.value);
    const newIncome = {
        amount: income.value,
        category: incomeType.value,
        description: incomeDesc.value,
        date: incomeDate.value,
        entryType: 'income'
    };
    postEntryAndUpdate(newIncome, formAddIncome);
})
async function postEntryAndUpdate(data, form) {
    return new Promise(async (resolve, reject) => {
        try {
            await axiosInstance.post('/add-entry', data, { headers: { "Authorization": token } });
            form.reset();
            page=1;
            renderDaily();
            resolve();
        } catch (err) {
            console.log(err);
            reject();
        }
    })
}

function addSelectRowsView() {
    const view = document.createElement('div');
    view.id = 'pageLimitC';
    view.className = 'd-flex justify-content-center align-items-center mt-3 mb-5';
    view.innerHTML += `
        <label for="pageLimit" class="mx-2">Rows per page:</label>
        <select name="pageLimit" id="pageLimit" onChange=changePageLimit()>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
            <option value="35">35</option>
            <option value="40">40</option>
        </select>
    `;

    content.appendChild(view);

    const RowPreference = localStorage.getItem('userRowPreference');
    const pageLimit = document.getElementById('pageLimit');
    if(RowPreference)
        pageLimit.value = RowPreference;
    else
        pageLimit.value = '10';
}

function changePageLimit() {
    const pageLimit = document.getElementById('pageLimit');
    localStorage.setItem('userRowPreference', pageLimit.value);
    page=1;
    renderData(reportTypeBtn.innerText);
}

function removeViews() {
    if(document.getElementById('btnsC'))
        document.getElementById('btnsC').remove();

    if(document.getElementById('pageLimitC'))
        document.getElementById('pageLimitC').remove();
}

async function renderDaily() {
    reportTypeBtn.innerText = 'Daily';
    async function renderDaily() {
  
    const curr = new Date();
    let currMonth = curr.getMonth() + 1;
    let currDate = curr.getDate();
    if (currMonth < 10)
        currMonth = '0' + currMonth;
    if (currDate < 10)
        currDate = '0' + currDate;
    content.innerHTML = `
    <div class="container mb-4 d-flex flex-column justify-content-center align-items-center">
                <div class="d-flex mb-3">
                        <label for="dateInput" style="font-weight: bold;">Select date:</label>
                        <input type="date" min="2010-01-01" max="2050-12-01" value="${curr.getFullYear()}-${currMonth}-${currDate}" class="w-auto ms-2" id="dateInput">
                        <button class="btn btn-primary ms-2" id="search" onclick="renderDataDaily()">Search</button>
                </div>
                <div class="mt-4 mb-3" style="margin:0;padding:0;"><h5 id="data-title"></h5></div>
                    <table id="entries-table" class="table text-white table-hover table-bordered">

async function renderDaily() {
  
                        <thead class="mb-5" style="font-family: 'Exo 2', sans-serif;background-color: rgb(32,144,158)">
                            <tr class="mt-5">
                                <th class="title col-2">Category</th>
                                <th class="title col-4">Description</th>
                                <th class="title col-2">Income</th>
                                <th class="title col-2">Expense</th>
                            </tr>
                        </thead>
                        <tbody id="entries-table-body" class="body text-dark">
                        </tbody>
                    </table>
        </div>
    `;

    // document.getElementById('search').addEventListener('click', (e) => {
    //     renderDataDaily();
    // });
    renderDataDaily();
}

async function renderDataDaily() {
    removeViews();

    let dateInput = document.getElementById('dateInput').value;
    dateInput = new Date(dateInput);

    
          
            async function renderDataDaily() {
  
    document.getElementById('data-title').innerHTML = `${dateInput.getDate()} ${months[dateInput.getMonth()]} ${dateInput.getFullYear()}`;
    let responseData, pageData;
    try {
         responseData = await getAllEntries(`date=${dateInput}`);
         entries = responseData.entries;
         pageData = responseData.pageData;
    } catch (err) {
        alert('Something went wrong!');
        return;
    }
    const tableBody = document.getElementById('entries-table-body');
    const entriesTable = document.getElementById('entries-table');
    let totalIncome = 0, totalExpense = 0;
    tableBody.innerHTML = '';
    entries.forEach(entry => {
        let currIncome, currExpense, bgColor;
        if (entry.entryType === 'expense') {
            currExpense = entry.amount;
            totalExpense += currExpense;
            currIncome = '--';
            bgColor = '#C4C4C4';
        }
        else {
            currIncome = entry.amount;
            totalIncome += currIncome;
            currExpense = '--';
            bgColor = incomeRowColor;
        }
        tableBody.innerHTML += `
            <tr style="background-color: ${bgColor};">
                <td class="data col-2">${entry.category}</td>
                <td class="data col-4">${entry.description}</td>
                <td class="income col-2">${currIncome}</td>
                <td class="expense col-2">${currExpense}</td>
            </tr>
        `;
    })
    tableBody.innerHTML += `
        <tr class="total">
            <td class="col-2">Total</td>
            <td class="col-4"></td>
            <td class="income col-2">&#8377;${totalIncome}</td>
            <td class="expense col-2">&#8377;${totalExpense}</td>
        </tr>
        <tr class="total">
            <td class="col-2"></td>
            <td class="col-4"></td>
            <td class="col-2"></td>
            <td class="savings col-2">Savings=&#8377;${totalIncome - totalExpense}</td>
        </tr>
    `;

    addPaginationBtns(pageData, 'Daily');
    addSelectRowsView();
}

async function renderMonthly() {

    
          
            async function renderMonthly() {
  
    reportTypeBtn.innerText = 'Monthly';
    content.innerHTML = '';
    const curr = new Date();
    let currMonth = curr.getMonth() + 1;
    if (currMonth < 10)
        currMonth = '0' + currMonth;
    content.innerHTML = `
    <div class="container mb-4 d-flex flex-column justify-content-center align-items-center position-relative">
                <div class="d-flex mb-3">
                        <label for="dateInput" style="font-weight: bold;">Select month:</label>
                        <input type="month" min="2010-01" max="2050-12" value="${curr.getFullYear()}-${currMonth}" class="w-auto ms-2" id="monthInput">
                        <button class="btn btn-primary ms-2" id="search">Search</button>
                </div>
                <div class="mt-3 mb-3" style="margin:0;padding:0;"><h5 id="data-title"></h5></div>
                    <table id="entries-table" class="table text-white table-hover table-bordered">
                        <thead class="mb-5" style="font-family: 'Exo 2', sans-serif;background-color: rgb(32,144,158)">
                            <tr class="mt-5">
                                <th class="title col-2">Date (yyyy/mm/dd)</th>
                                <th class="title col-2">Category</th>
                                <th class="title col-4">Description</th>
                                <th class="title col-2">Income</th>
                                <th class="title col-2">Expense</th>
                            </tr>
                        </thead>
                        <tbody id="entries-table-body" class="body text-dark">
                        </tbody>
                    </table>
        </div>
    `;

    document.getElementById('search').addEventListener('click', (e) => {
        console.log('clicked');
        renderDataMonthly();
    });

    renderDataMonthly();
}

async function renderDataMonthly() {
    removeViews();

    const tableBody = document.getElementById('entries-table-body');
    const entriesTable = document.getElementById('entries-table');

    
          
    async function renderDataMonthly() {
  
    let totalIncome = 0, totalExpense = 0;
    const date = new Date(document.getElementById('monthInput').value);
    const month = date.getMonth();
    const year = date.getFullYear();
    console.log(date);
    document.getElementById('data-title').innerHTML = `${months[month]} ${year}`;
    let responseData, pageData;
    try {
         responseData = await getAllEntries(`month=${month}`);
         entries = responseData.entries;
         pageData = responseData.pageData;
    } catch(err) {
        console.log(err);
    }
    entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    tableBody.innerHTML = '';
    entries.forEach(entry => {
        let currIncome, currExpense, bgColor;
        if (entry.entryType === 'expense') {
            currExpense = entry.amount;
            totalExpense += currExpense;
            currIncome = '--';
            bgColor = '#C4C4C4';
        }
        else {
            currIncome = entry.amount;
            totalIncome += currIncome;
            currExpense = '--';
            bgColor = incomeRowColor;
        }
        tableBody.innerHTML += `
            <tr style="background-color: ${bgColor};">
                <td class="data col-2">${entry.date}</td>
                <td class="data col-2">${entry.category}</td>
                <td class="data col-4">${entry.description}</td>
                <td class="income col-2">${currIncome}</td>
                <td class="expense col-2">${currExpense}</td>
            </tr>
        `;
    })
    tableBody.innerHTML += `
        <tr class="total">
            <td class="col-2">Total</td>
            <td class="col-2"></td>
            <td class="col-4"></td>
            <td class="income col-2">&#8377;${totalIncome}</td>
            <td class="expense col-2">&#8377;${totalExpense}</td>
        </tr>
        <tr class="total">
            <td class="col-2"></td>
            <td class="col-2"></td>
            <td class="col-4"></td>
            <td class="col-2"></td>
            <td class="savings col-2">Savings=&#8377;${totalIncome - totalExpense}</td>
        </tr>
    `;

    addPaginationBtns(pageData, 'Monthly');
    addSelectRowsView();
}

function renderYearly() {

    
          
         function getEntriesByMonths(entries, year) {
  
    reportTypeBtn.innerText = 'Yearly';
    content.innerHTML = '';
    content.innerHTML = `
    <div class="container mb-4 d-flex flex-column justify-content-center align-items-center">
        <div class="d-flex mb-3">
            <label for="dateInput" style="font-weight: bold;">Select year:</label>
            <input type="number" min="2010" max="2023" value="${new Date().getFullYear()}" class="w-auto ms-2" id="yearInput">
            <button class="btn btn-primary ms-2" id="search">Search</button>
        </div>
        <div class="mt-3 mb-3" style="margin:0;padding:0;"><h5 id="data-title"></h5></div>
        <table id="entries-table" class="table text-white table-hover table-bordered">
        <thead class="mb-5" style="font-family: 'Exo 2', sans-serif;background-color: rgb(32,144,158)">
            <tr class="title mt-5">
                <th class="col-2">Month</th>
                <th class="col-3">Income</th>
                <th class="col-3">Expense</th>
                <th class="col-4">Savings</th>
            </tr>
        </thead>
        <tbody id="entries-table-body" class="text-dark">
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
    if(document.getElementById('btnsC'))
        document.getElementById('btnsC').remove();
    const yearInput = document.getElementById('yearInput').value;
    const date = new Date();
    if (yearInput > date.getFullYear() || yearInput < 2010) {
        alert(`Enter year between 2010 and ${date.getFullYear()}`);
        return;
    }
    document.getElementById('data-title').innerHTML = `${yearInput}`;
    let responseData, pageData;
    try {
         responseData = await getAllEntries(`year=${yearInput}`);
         entries = responseData.entries;
         pageData = responseData.pageData;
    } catch(err) {
        console.log(err);
    }
    entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const entriesTable = document.getElementById('entries-table');
    const tableBody = document.getElementById('entries-table-body');
    let totalIncome = 0, totalExpense = 0;
    tableBody.innerHTML = '';
    const entriesByMonths = getEntriesByMonths(entries, yearInput);
    entriesByMonths.forEach((value, key) => {
        tableBody.innerHTML += `
                <tr class="body">
                    <td class="data col-2">${months[key]}</td>
                    <td class="income col-3">${value.income}</td>
                    <td class="expense col-3">${value.expense}</td>
                    <td class="savings col-4">${value.income - value.expense}</td>
                </tr>
            `;
        totalExpense += value.expense;
        totalIncome += value.income;
    })
    tableBody.innerHTML += `
        <tr class="total">
            <td class="col-2">Total</td>
            <td class="income col-3">&#8377;${totalIncome}</td>
            <td class="expense col-3">&#8377;${totalExpense}</td>
            <td class="savings col-4">&#8377;${totalIncome - totalExpense}</td>
        </tr>
    `;
}
function getEntriesByMonths(entries, year) {
    const entriesByMonths = new Map();
    entries.forEach(entry => {
        const month = new Date(entry.date).getMonth();
        if (entriesByMonths.has(month)) {
            if (entry.entryType === 'expense') {
                entriesByMonths.set(month, {
                    income: entriesByMonths.get(month).income,
                    expense: entriesByMonths.get(month).expense + entry.amount
                });
            }
            else {
                entriesByMonths.set(month, {
                    income: entriesByMonths.get(month).income + entry.amount,
                    expense: entriesByMonths.get(month).expense
                });
            }
        }
        else {
            if (entry.entryType === 'expense') {
                entriesByMonths.set(month, {
                    income: 0,
                    expense: entry.amount
                });
            }
            else {
                entriesByMonths.set(month, {
                    income: entry.amount,
                    expense: 0
                });
            }
        }
    })
    return entriesByMonths;
}

async function renderAll() {
    removeViews();

    reportTypeBtn.innerText = 'All';

    content.innerHTML = `

        async function renderAll() {
  
    <div class="container mb-4 d-flex flex-column justify-content-center align-items-center">
                    <div class="mt-2 mb-3" style="margin:0;padding:0;"><h5 id="data-title">All time</h5></div>
                    <table id="entries-table" class="table text-white table-hover table-bordered">
                        <thead class="mb-5" style="font-family: 'Exo 2', sans-serif;background-color: rgb(32,144,158)">
                            <tr class="mt-5">
                                <th class="title col-2">Date (yyyy/mm/dd)</th>
                                <th class="title col-2">Category</th>
                                <th class="title col-4">Description</th>
                                <th class="title col-2">Income</th>
                                <th class="title col-2">Expense</th>
                            </tr>
                        </thead>
                        <tbody id="entries-table-body" class="body text-dark">
                        </tbody>
                    </table>
        </div>
    `;
    let responseData, pageData;
    try {
         responseData = await getAllEntries();
         entries = responseData.entries;
         pageData = responseData.pageData;
    } catch (err) {
        alert('Something went wrong!');
        return;
    }
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    const tableBody = document.getElementById('entries-table-body');
    const entriesTable = document.getElementById('entries-table');
    let totalIncome = 0, totalExpense = 0, totSavings = 0;
    console.log(content);
    tableBody.innerHTML = '';
    entries.forEach(entry => {
        let currIncome, currExpense, bgColor;
        if (entry.entryType === 'expense') {
            currExpense = entry.amount;
            totalExpense += currExpense;
            currIncome = '--';
            bgColor = '#C4C4C4';
        }
        else {
            currIncome = entry.amount;
            totalIncome += currIncome;
            currExpense = '--';
            bgColor = incomeRowColor;
        }
        tableBody.innerHTML += `
            <tr style="background-color: ${bgColor};">
                <td class="data col-2">${entry.date}</td>
                <td class="data col-2">${entry.category}</td>
                <td class="data col-4">${entry.description}</td>
                <td class="income col-2">${currIncome}</td>
                <td class="expense col-2">${currExpense}</td>
            </tr>
        `;
    })
    tableBody.innerHTML += `
        <tr class="total">
            <td class="col-2">Total</td>
            <td class="col-2"></td>
            <td class="col-4"></td>
            <td class="income col-2">&#8377;${totalIncome}</td>
            <td class="expense col-2">&#8377;${totalExpense}</td>
        </tr>
        <tr class="total">
            <td class="col-2"></td>
            <td class="col-2"></td>
            <td class="col-4"></td>
            <td class="col-2"></td>
            <td class="savings col-2">Savings=&#8377;${totalIncome - totalExpense}</td>
        </tr>
    `;

    addPaginationBtns(pageData, 'All');
    addSelectRowsView();
}

async function renderNone() {}    
function getAllEntries(query) {
  
    content.innerHTML = `
        <div class="d-flex justify-content-center align-items-center mt-5"><h3>Something went wrong!</h3></div>
    `;
}
function getAllEntries(query) {
    return new Promise(async (resolve, reject) => {
        let result;
        try {
            const pageLimit = localStorage.getItem('userRowPreference');
            result = await axiosInstance.get(`/entries?${query}&page=${page}&pageLimit=${pageLimit}`, { headers: { "Authorization": token } });
            if (!result) {
                alert("Something went wrong!");
                return;

  
            }
            resolve(result.data);
        } catch (err) {
            console.log(err);
            reject(err);
        }
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
        alert(err.response.data.message);
    }
}
}}}}}
// async function deleteExpense(id) {
//     await axiosInstance.post(`/delete-entry`, { expenseId: id }, { headers: { "Authorization": token } });
//     render();
// }