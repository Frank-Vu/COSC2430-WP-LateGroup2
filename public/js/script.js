/*   RMIT University Vietnam
  Course: COSC2430 Web Programming
  Semester: 2023A
  Assessment: Assignment 2
  Author: Le Quang Dat, Lai Dong Khoa, Nguyen Ich Kiet, Phung Hoang Long, Chu Khai Minh, Vu Thanh Tung.
  ID: s3927251, s3926689, s3978724, s3965673, s3864172, s3963172
*/

let list = document.querySelectorAll('.list .item');
list.forEach(item => {
    item.addEventListener('click', function (event) {
        if (event.target.classList.contains('add')) {
            var itemNew = item.cloneNode(true);
            let checkIsset = false;

            let listCart = document.querySelectorAll('.cart .item');
            listCart.forEach(cart => {
                if (cart.getAttribute('data-key') == itemNew.getAttribute('data-key')) {
                    checkIsset = true;
                    cart.classList.add('danger');
                    setTimeout(function () {
                        cart.classList.remove('danger');
                    }, 1000)
                }
            })
            if (checkIsset == false) {
                document.querySelector('.listCart').appendChild(itemNew);
            }

        }
    })
})
function Remove($key) {
    let listCart = document.querySelectorAll('.cart .item');
    listCart.forEach(item => {
        if (item.getAttribute('data-key') == $key) {
            item.remove();
            return;
        }
    })
}