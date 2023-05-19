let list = document.getElementById('list');
let filter = document.querySelector('.filter');
let count = document.getElementById('count');
let listProducts = [
    {
        id: 1,
        name: 'GOLD STANDARD Weight Protein',
        price: 205,
        quantity: 0,
        image: 'img1.jpg',
        nature: {
            type: 'WP'
        }
    },
    {
        id: 2,
        name: 'RULE1 Weight Protein',
        price: 300,
        quantiy: 30,
        image: 'img2.jpg',
        nature: {
            type: 'WP'
        }
    },
    {
        id: 3,
        name: 'Blend Vegan Protein',
        price: 200,
        quantiy: 30,
        image: 'img3.jpg',
        nature: {
            type: 'VP'
        }
    },
    {
        id: 4,
        name: 'GOLD OAT MILK Vegan Protein',
        price: 400,
        quantiy: 30,
        image: 'img4.jpg',
        nature: {
            type: 'VP'
        }
    },
    {
        id: 5,
        name: 'Chocolate Protein Bar',
        price: 320,
        quantiy: 30,
        image: 'img5.jpg',
        nature: {
            type: 'PB'
        }
    },
    {
        id: 6,
        name: 'Brownie Protein Bar',
        price: 100,
        quantiy: 30,
        image: 'img6.jpg',
        nature: {
            type: 'PB'
        }
    },

];
let productFilter = listProducts;
showProduct(productFilter);
function showProduct(productFilter){
    count.innerText = productFilter.length;
    list.innerHTML = '';
    productFilter.forEach(item => {
        let newItem = document.createElement('div');
        newItem.classList.add('item');

        // create image
        let newImage = new Image();
        newImage.src = item.image;
        newItem.appendChild(newImage);
        // create name product
        let newTitle = document.createElement('div');
        newTitle.classList.add('title');
        newTitle.innerText = item.name;
        newItem.appendChild(newTitle);
        // create price
        let newPrice = document.createElement('div');
        newPrice.classList.add('price');
        newPrice.innerText = item.price.toLocaleString() + ' USD';
        newItem.appendChild(newPrice);

        list.appendChild(newItem);
    });
}
filter.addEventListener('submit', function(event){
    event.preventDefault();
    let valueFilter = event.target.elements;
    productFilter = listProducts.filter(item => {
        // check category
        if(valueFilter.category.value != ''){
            if(item.nature.type != valueFilter.category.value){
                return false;
            }
        }

        // check name
        if(valueFilter.name.value != ''){
            if(!item.name.includes(valueFilter.name.value)){
                return false;
            }
        }
        // check min price
        if(valueFilter.minPrice.value != ''){
            if(item.price < valueFilter.minPrice.value){
                return false;
            }
        }
        //  check max price
        if(valueFilter.maxPrice.value != ''){
            if(item.price > valueFilter.maxPrice.value){
                return false;
            }
        }


        return true;
    })
    showProduct(productFilter);
})