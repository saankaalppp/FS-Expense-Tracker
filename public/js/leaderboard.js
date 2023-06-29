let content = document.getElementById('content');
let page;


window.addEventListener('DOMContentLoaded', () => {
    page=1;
    render();
});
function addPaginationBtns(data) {
    const btnsC = document.createElement('div');
    btnsC.id='btnsC';
    btnsC.style.display = 'inline-block';
    btnsC.className = 'w-25 d-flex justify-content-center align-items-center m-auto mt-5';

    if(data.hasPreviousPage) {
        const btn2 = document.createElement('button');
        btn2.innerHTML = data.previousPage;
        btn2.addEventListener('click', (e) => {
            page=e.target.innerHTML;
            render();
        });
        btnsC.appendChild(btn2);
    }

    const btn1 = document.createElement('button');
    btn1.innerHTML = data.currentPage;
    btn1.className = 'mx-2 bg-dark text-white';

    btn1.addEventListener('click', (e) => {
        page=e.target.innerHTML;
        render();
    });
    btnsC.appendChild(btn1);

    console.log(data.hasNextPage);

    if(data.hasNextPage) {
        const btn3 = document.createElement('button');
        btn3.innerHTML = data.nextPage;
        btn3.addEventListener('click', (e) => {
            page=e.target.innerHTML;
            render();
        });
        btnsC.appendChild(btn3);
    }

    content.appendChild(btnsC);
}

async function render() {
    if(document.getElementById('btnsC'))
        document.getElementById('btnsC').remove();
    let result;
    try{
        result = await axiosInstance.get('/premium/leaderboard', { headers: { 'Authorization': token } });
    } catch(err) {
        console.log(err);
        return;
    }
    const lbData = result.data.lbData;
    content.innerHTML = '';


    if(lbData.length == 0) {
        content.innerHTML = `
            <h2>Leaderboard Empty</h2>
        `;
        content.className = 'd-flex justify-content-center align-items-center bg-info mt-5 p-5';
        return;
    }
    content.className = 'data col-lg-6 col-10 m-auto';

    for(let i=0;i<lbData.length;i++) {
        const user = lbData[i];
        content.innerHTML += `
            <table class="table table-hover table-info table-borderless">
                <tbody class="text-dark" style="font-family: 'DM Serif Display', serif;">
                    <tr>
                        <th class="col-1">${i+1}</th>
                        <td class="col-3">${user.name}</td>
                        <td class="col-2">${user.totalExpense}</td>
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

goBackBtn.onclick = function(e) {

    window.location = 'C:\Users\Sankalp\Desktop\Expense Tracker Project\views\expense.html';

}