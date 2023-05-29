var form=document.getElementById('addForm')

form.addEventListener('submit', saveUser);//

  function saveUser(e){

        e.preventDefault();
        console.log(e.target.email.value);

        const signupDetails ={
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value

        }
        console.log(signupDetails)
        // let response = await axios.post("http://localhost:4000/user/signup",signupDetails)
    }