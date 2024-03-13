const form = document.getElementById('addProductForm');
const productList = document.getElementById('productList');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const productId = document.getElementById('productId').value;
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;

    const response = await fetch('/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productId,
            name,
            price: parseFloat(price),
            description
        })
    });

    if (response.ok) {
        const product = await response.json();
        productList.innerHTML += `<li>${product.productId} - ${product.name} - ${product.price} - ${product.description}</li>`;
        form.reset();
    } else {
        alert('Failed to add product');
    }
});

window.onload = async () => {
    const response = await fetch('/products');
    const products = await response.json();
    
    products.forEach(product => {
        productList.innerHTML += `<li>${product.productId} - ${product.name} - ${product.price} - ${product.description}</li>`;
    });
};
