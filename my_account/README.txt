1. read html file for js input instruction

2. for shippers: 
    remove class "hidden" from:
        _ <a class="left-nav-item hidden" id="shipper" href="#shipper-info">Shipping Details</a>
        _ <div class="main-container hidden" id="shipper-info">

    add class "hidden" to:
        _ <div class="sub-container" id="accomodation">

3. for vendors, remove class "hidden" from:
        _ <a class="left-nav-item hidden" id="vendor" href="#vendor-info">My Shop</a>
        _ <div class="main-container hidden" id="vendor-info">

    add class "hidden" to:
        _ <div class="info-box">
        _ <div class="sub-container" id="accomodation">