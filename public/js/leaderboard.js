let content = document.getElementById('content');
let goBackBtn = document.getElementById('gobackbtn');

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000'
});
window.addEventListener('DOMContentLoaded', () => {
    render();
});

async function render() {
    const token = localStorage.getItem('token');
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
                        <td class="col-2">${user.total_expense}</td>
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