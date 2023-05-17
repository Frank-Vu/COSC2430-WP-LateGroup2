function C_validate_password() {

    var pass = document.getElementById('C_password').value;
    var confirm_pass = document.getElementById('C_confirm_password').value;
    if (pass != confirm_pass) {
        document.getElementById('C_wrong_pass_alert').style.color = 'red';
        document.getElementById('C_wrong_pass_alert').innerHTML
            = '☒ Use same password';
        document.getElementById('C_create_submit').disabled = true;
        document.getElementById('C_create_submit').style.opacity = (0.4);
    } else {
        document.getElementById('C_wrong_pass_alert').style.color = 'green';
        document.getElementById('C_wrong_pass_alert').innerHTML =
            '🗹 Password Matched';
        document.getElementById('C_create_submit').disabled = false;
        document.getElementById('C_create_submit').style.opacity = (1);
    }
}

function S_validate_password() {

    var pass = document.getElementById('S_password').value;
    var confirm_pass = document.getElementById('S_confirm_password').value;
    if (pass != confirm_pass) {
        document.getElementById('S_wrong_pass_alert').style.color = 'red';
        document.getElementById('S_wrong_pass_alert').innerHTML
            = '☒ Use same password';
        document.getElementById('S_create_submit').disabled = true;
        document.getElementById('S_create_submit').style.opacity = (0.4);
    } else {
        document.getElementById('S_wrong_pass_alert').style.color = 'green';
        document.getElementById('S_wrong_pass_alert').innerHTML =
            '🗹 Password Matched';
        document.getElementById('S_create_submit').disabled = false;
        document.getElementById('S_create_submit').style.opacity = (1);
    }
}

function V_validate_password() {

    var pass = document.getElementById('V_password').value;
    var confirm_pass = document.getElementById('V_confirm_password').value;
    if (pass != confirm_pass) {
        document.getElementById('V_wrong_pass_alert').style.color = 'red';
        document.getElementById('V_wrong_pass_alert').innerHTML
            = '☒ Use same password';
        document.getElementById('V_create_submit').disabled = true;
        document.getElementById('V_create_submit').style.opacity = (0.4);
    } else {
        document.getElementById('V_wrong_pass_alert').style.color = 'green';
        document.getElementById('V_wrong_pass_alert').innerHTML =
            '🗹 Password Matched';
        document.getElementById('V_create_submit').disabled = false;
        document.getElementById('V_create_submit').style.opacity = (1);
    }
}

/* function C_wrong_pass_alert() {
    if (document.getElementById('C_password').value != "" &&
        document.getElementById('C_confirm_password').value != "") {
        alert("Your response is submitted");
    } else {
        alert("Please fill all the fields");
    }
}

function S_wrong_pass_alert() {
    if (document.getElementById('S_password').value != "" &&
        document.getElementById('S_confirm_password').value != "") {
        alert("Your response is submitted");
    } else {
        alert("Please fill all the fields");
    }
}

function V_wrong_pass_alert() {
    if (document.getElementById('V_password').value != "" &&
        document.getElementById('V_confirm_password').value != "") {
        alert("Your response is submitted");
    } else {
        alert("Please fill all the fields");
    }
}
 */