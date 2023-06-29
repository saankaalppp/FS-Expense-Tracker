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
try {
    result = await axiosInstance.get(`/user/filesdownloaded?page=${page}`, { headers: { 'Authorization': token } });
    } catch (err) {
        console.log(err);
        // return;  
    }

    const filesData = result.data.filesData;
    const data = result.data.pageData;
    content.innerHTML = '';

    if (filesData.length == 0) {
        content.innerHTML = `
            <h4>No files downloaded</h4>
        `;
        content.className = 'd-flex justify-content-center align-items-center bg-info mt-5 p-5';
        return;
    }

    let fileUrls = [];

    content.innerHTML = `
    <div class="container mb-4 d-flex flex-column justify-content-center align-items-center col-lg-8 col-10">
    <table id="downloadstable" class="table text-white table-hover table-bordered">
        <thead class="mb-5" style="font-family: 'Exo 2', sans-serif;background-color: rgb(32,144,158)">
            <tr class="mt-5">
                <th class="title col-lg-3 col-4">Date (dd/mm/yyyy)</th>
                <th class="title col-lg-3 col-4">Time (hr:min:sec)</th>
                <th class="title col-lg-1 col-2"></th>
            </tr>    
        </thead>
        <tbody id="downloads-table-body" class="body text-dark">
        </tbody>
    </table>
</div>
    `;

    const tableBody = document.getElementById('downloads-table-body');

    for (let i = 0; i < filesData.length; i++) {
        const file = filesData[i];

        fileUrls.push(file.fileUrl);

        const date = new Date(file.dateDownloaded);

        tableBody.innerHTML += `
            <tr class="mt-5">
                <td class="data col-1">${i+1}</td>
                <td class="data col-lg-3 col-4">${date.getDate()}/${date.getMonth()}/${date.getFullYear()}</td>
                <td class="data col-lg-3 col-4">${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</td>
                <td class="data col-lg-1 col-lg-1 col-2"><i id="btn${i+1}" class="download btn fa-solid fa-download text-dark"></i></td>
                </tr>
                `;
    }

    const downloadBtns = document.getElementsByClassName('download');

    for (let i = 0; i < downloadBtns.length; i++) {
        const fileUrl = fileUrls[i];

        document.getElementById('btn' + (i + 1)).onclick = function download(file) {
            try {
                const z = document.createElement('a');
                z.href = fileUrl;
                z.click();
            } catch (err) {
                console.log(err);
                alert('Something went wrong!');
            }
        }
    }

addPaginationBtns(data);
}