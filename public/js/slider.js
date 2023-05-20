/*   RMIT University Vietnam
  Course: COSC2430 Web Programming
  Semester: 2023A
  Assessment: Assignment 2
  Author: Le Quang Dat, Lai Dong Khoa, Nguyen Ich Kiet, Phung Hoang Long, Chu Khai Minh, Vu Thanh Tung.
  ID: s3927251, s3926689, s3978724, s3965673, s3864172, s3963172
*/

let counter = 2;
setInterval(function () {
    document.getElementById('customer-pos' + counter).checked = true;
    document.getElementById('shipper-pos' + counter).checked = true;
    document.getElementById('vendor-pos' + counter).checked = true;
    counter++;

    if (counter > 3) {
        counter = 1;
    };
}, 3500);