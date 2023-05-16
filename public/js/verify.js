function validate_password() {

    var pass = document.getElementById('password').value;
    var confirm_pass = document.getElementById('confirm_password').value;
    if (pass != confirm_pass) {
        document.getElementById('wrong_pass_alert').style.color = 'red';
        document.getElementById('wrong_pass_alert').innerHTML
            = '☒ Use same password';
        document.getElementById('create_submit').disabled = true;
        document.getElementById('create_submit').style.opacity = (0.4);
    } else {
        document.getElementById('wrong_pass_alert').style.color = 'green';
        document.getElementById('wrong_pass_alert').innerHTML =
            '🗹 Password Matched';
        document.getElementById('create_submit').disabled = false;
        document.getElementById('create_submit').style.opacity = (1);
    }
}

function wrong_pass_alert() {
    if (document.getElementById('password').value != "" &&
        document.getElementById('confirm_password').value != "") {
        alert("Your response is submitted");
    } else {
        alert("Please fill all the fields");
    }
}
