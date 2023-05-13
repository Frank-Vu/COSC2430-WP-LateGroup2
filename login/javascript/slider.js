let counter = 2;
setInterval(function(){
    document.getElementById('customer-pos' + counter).checked = true;
    document.getElementById('shipper-pos' + counter).checked = true;
    document.getElementById('vendor-pos' + counter).checked = true;
    counter++;

    if (counter > 3){
        counter = 1;
    };
}, 3500);