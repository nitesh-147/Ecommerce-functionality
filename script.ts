
interface ratingDesc {
    rate: number;
    count: number;
}
interface product {
    id: number;
    title: string;
    description: string;
    image: string;
    category: string;
    rating: ratingDesc;
    price: number;
    isCarted: boolean;
    isWishlisted: boolean;
}

interface cartProduct {
    id: number;
    title: string;
    description: string;
    category: string;
    image: string;
    rating: ratingDesc;
    price: number;
    quantity: number;
}

fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(json => {

        const headerComponent = document.getElementById('header');
        const contentBox = document.getElementById('content');
        const pageHeader = document.getElementById('pageHeader');
        class EcommerceApp {
            products: Array<product> = [];
            cartItems: Array<cartProduct> = [];
            wishlistItems: Array<product> = [];
            category: string = "all";
            productsToBeShown: any = this.products;
            sortingParameter: string = "priceLowToHigh";
            cartQuantity: number = 0;
            wishlistQuantity: number = 0;

            updateData() {
                json.forEach((item) => {
                    this.products.push({ ...item, price: item.price * 10, isCarted: false, isWishlisted: false });
                });
            }

            displayProductsPage() {
                contentBox.innerHTML = "";
                pageHeader.innerHTML = "";
                headerComponent.style.display = "block";
                this.productsToBeShown.forEach(product => {
                    this.createProductBox(product);
                });
            }

            createProductBox(product: any): any {
                let productBox = document.createElement('div');
                productBox.setAttribute("class", "product-box");

                let productImage = document.createElement('img');
                productImage.setAttribute("src", product.image);
                productBox.appendChild(productImage);

                let productName = document.createElement('strong');
                let tempText = product.title; //tempText is for modifying large product Title
                if (tempText.length > 15) {
                    tempText = tempText.substring(0, 15);
                }
                productName.innerText = tempText;
                productName.style.cursor="pointer";
                productName.addEventListener('click',()=>this.productPage(product));
                productBox.appendChild(productName);

                let productPrice = document.createElement('span');
                productPrice.setAttribute('class', 'price');
                productPrice.innerText = "₹" + product.price.toFixed(2);
                productBox.appendChild(productPrice);

                let addToCartButton = document.createElement('a');
                addToCartButton.setAttribute("class", "cart-btn");
                if (product.isCarted) {
                    addToCartButton.style.backgroundColor = "purple";
                    addToCartButton.innerHTML = "Item Added to Cart";
                }
                else {
                    addToCartButton.innerHTML = `<i class="fas fa-shopping-bag"></i> Add Cart`;
                }

                addToCartButton.addEventListener("click", () => {
                    if (addToCartButton.innerHTML !== "Item Added to Cart") {
                        addToCartButton.style.backgroundColor = "purple";
                        addToCartButton.innerHTML = "Item Added to Cart";
                        this.addToCart(product);
                    }
                });
                productBox.appendChild(addToCartButton);

                let addToWishlistButton = document.createElement('a');
                addToWishlistButton.setAttribute('class', 'like-btn');
                if (product.isWishlisted) {
                    addToWishlistButton.innerHTML = "&#10084;";
                }
                else {
                    addToWishlistButton.innerHTML = "&#9825;";
                }
                addToWishlistButton.addEventListener("click", () => {
                    if (addToWishlistButton.innerHTML === "♡") {
                        console.log(addToWishlistButton.innerHTML);
                        addToWishlistButton.innerHTML = "&#10084;";
                        this.wishlistItems.push(product);
                        product.isWishlisted = true;
                    }
                    else {
                        addToWishlistButton.innerHTML = "&#9825;"
                        this.wishlistItems = this.wishlistItems.filter((element) => element.id !== product.id);
                        product.isWishlisted = false;
                    }
                    this.updateWishlistQuantity();
                })
                productBox.appendChild(addToWishlistButton);

                let ratingDisplayButton = document.createElement('span');
                ratingDisplayButton.innerHTML = "" + product.rating.rate + "⭐";
                ratingDisplayButton.setAttribute("class", "ratingButton");
                productBox.appendChild(ratingDisplayButton);

                contentBox?.appendChild(productBox);
            }

            addToCart(product: any) {
                // let index = -1;
                // this.cartItems.forEach(element => {
                //     if (element.id === product.id) {
                //         product.quantity += 1;
                //         index = 0;
                //     }
                // });
                this.products.forEach(element => {
                    if (element.id === product.id) {
                        element.isCarted = true;
                    }
                });
                this.productsToBeShown.forEach(element => {
                    if (element.id === product.id) {
                        element.isCarted = true;
                    }
                });
                this.cartItems.push({ ...product, quantity: 1 });

                this.updateCartQuantity();
            }

            updateProductsToBeDisplayedByCategory() {
                let tempCategory = this.category;
                if (this.category === "mens") tempCategory = "men's clothing";
                if (this.category === "womens") tempCategory = "women's clothing";
                this.productsToBeShown = this.products.filter((product) => product.category === tempCategory || tempCategory === "all");
                this.updateSortingParameter();
                this.displayProductsPage();
            }

            updateCategory(category: string) {
                document.getElementById(this.category)?.classList.remove("active");
                this.category = category;
                document.getElementById(category)?.classList.add("active");
                this.updateProductsToBeDisplayedByCategory();
            }

            updateSortingParameter() {
                this.sortingParameter = document.getElementsByTagName('select')[0]?.value;
                if (this.sortingParameter === "priceLowToHigh") {
                    this.productsToBeShown.sort((a: product, b: product) => a.price - b.price);

                } else if (this.sortingParameter === "priceHighToLow") {
                    this.productsToBeShown.sort((a: product, b: product) => b.price - a.price);
                }
                else if (this.sortingParameter === "ratingLowToHigh") {
                    this.productsToBeShown.sort((a: product, b: product) => a.rating.rate - b.rating.rate);
                } else {
                    this.productsToBeShown.sort((a: product, b: product) => b.rating.rate - a.rating.rate);
                }
                this.displayProductsPage();
            }

            updateCartQuantity() {
                document.getElementById('cartquantity').innerText = "" + this.cartItems.length;
            }

            updateWishlistQuantity() {
                document.getElementById('wishlistquantity').innerHTML = "" + this.wishlistItems.length;
            }

            displayWishlistPage() {
                contentBox.innerHTML = " ";
                this.designpageHeader("WISHLIST PAGE");
                headerComponent.style.display = "none";





                if (this.wishlistItems.length === 0) {
                    let displayMessage = document.createElement('h1');
                    displayMessage.innerHTML = "Your WishList is Empty!!!";
                    displayMessage.style.textAlign = "center";
                    contentBox?.appendChild(displayMessage);
                }
                this.wishlistItems.forEach((product) => {
                    let productBox = document.createElement('div');
                    productBox.setAttribute("class", "product-box");

                    let productImage = document.createElement('img');
                    productImage.setAttribute("src", product.image);
                    productBox.appendChild(productImage);

                    let productName = document.createElement('strong');
                    let tempText = product.title; //tempText is for modifying large product Title
                    if (tempText.length > 15) {
                        tempText = tempText.substring(0, 15);
                    }
                    productName.innerText = tempText;
                    productBox.appendChild(productName);

                    let productPrice = document.createElement('span');
                    productPrice.setAttribute('class', 'price');
                    productPrice.innerText = "₹" + product.price;
                    productBox.appendChild(productPrice);

                    let addToCartButton = document.createElement('a');
                    addToCartButton.setAttribute("class", "cart-btn");
                    if (product.isCarted) {
                        addToCartButton.style.backgroundColor = "purple";
                        addToCartButton.innerHTML = "Item Added to Cart";
                    }
                    else {
                        addToCartButton.innerHTML = `<i class="fas fa-shopping-bag"></i> Add Cart`;
                    }

                    addToCartButton.addEventListener("click", () => {
                        if (addToCartButton.innerHTML !== "Item Added to Cart") {
                            addToCartButton.style.backgroundColor = "purple";
                            addToCartButton.innerHTML = "Item Added to Cart";
                            this.addToCart(product);
                        }
                    });
                    productBox.appendChild(addToCartButton);

                    let removeButton = document.createElement('a');
                    removeButton.setAttribute('class', 'like-btn');
                    removeButton.innerHTML = "X";
                    removeButton.addEventListener("click", () => {
                        this.wishlistItems = this.wishlistItems.filter((item) => item.id != product.id);
                        this.products.forEach(element => {
                            if (element.id === product.id) {
                                element.isWishlisted = false;
                            }
                        });
                        this.productsToBeShown.forEach(element => {
                            if (element.id === product.id) {
                                element.isWishlisted = false;
                            }
                        });
                        this.updateWishlistQuantity();
                        this.displayWishlistPage();
                    });
                    productBox.appendChild(removeButton);

                    let ratingDisplayButton = document.createElement('span');
                    ratingDisplayButton.innerHTML = "" + product.rating.rate + "⭐";
                    ratingDisplayButton.setAttribute("class", "ratingButton");
                    productBox.appendChild(ratingDisplayButton);

                    contentBox?.appendChild(productBox);
                });
            }

            designpageHeader(name: string) {
                pageHeader.innerHTML = "";
                let pageHeading = document.createElement('h1');
                pageHeading.innerHTML = name;
                pageHeading.style.textAlign = "center";
                pageHeading.style.maxWidth="95vw";
                pageHeader?.appendChild(pageHeading);
                pageHeader?.appendChild(document.createElement('hr'));

                let goBackButton = document.createElement('button');
                goBackButton.innerHTML = "<< continue back to shopping";
                goBackButton.setAttribute('class', 'btn btn-primary');
                goBackButton.style.maxWidth="95vw";
                goBackButton.addEventListener('click', () => this.displayProductsPage());
                pageHeader?.appendChild(goBackButton);
            }

            displayCartPage() {
                headerComponent.style.display = "none";
                this.designpageHeader("CART PAGE");
                contentBox.innerHTML = "";
                if (this.cartItems.length === 0) {
                    let displayMessage = document.createElement('h1');
                    displayMessage.innerHTML = "Your Cart is Empty!!!";
                    displayMessage.style.textAlign = "center";
                    contentBox?.appendChild(displayMessage);
                }
                else {
                    let cartDiv = document.createElement('div');
                    cartDiv.setAttribute('class', 'container');
                    let totalAmount: number = 0;
                    this.cartItems.forEach(element => {
                        totalAmount += element.price * element.quantity;
                        let cartRow = document.createElement('div');
                        cartRow.style.display = "flex";
                        cartRow.style.alignItems = "center";
                        cartRow.style.justifyContent = "space-evenly";

                        let removeButton = document.createElement('span');
                        removeButton.innerHTML = "X";
                        removeButton.style.color = "red";
                        removeButton.style.cursor = "pointer";
                        removeButton.addEventListener('click', () => {
                            this.cartItems = this.cartItems.filter((item) => item.id !== element.id);
                            this.products.forEach(product => {
                                if (product.id === element.id) {
                                    product.isCarted = false;
                                }
                            });
                            this.productsToBeShown.forEach(product => {
                                if (product.id === element.id) {
                                    product.isCarted = false;
                                }
                            });
                            this.updateCartQuantity();
                            this.displayCartPage();
                        });
                        cartRow.appendChild(removeButton);

                        // removeButton.style.width="10vw";

                        let imageName = document.createElement('div');
                        let image = document.createElement('img');
                        image.setAttribute('src', element.image);
                        image.style.width = "100px";
                        image.style.maxWidth = "100%";
                        image.style.height = "100px";
                        let name = document.createElement('h6');
                        name.innerHTML = "" + element.title.substring(0, 20);
                        imageName.appendChild(image);
                        imageName.appendChild(name);
                        cartRow.appendChild(imageName);

                        imageName.style.width = "25vw";

                        let quantityButton = document.createElement('div');
                        quantityButton.style.display = "flex";
                        quantityButton.style.columnGap = "1vw";
                        quantityButton.setAttribute("id", "quantity-button");
                        let decButton = document.createElement('button');
                        decButton.setAttribute('class', 'btn btn-primary');
                        decButton.innerHTML = "-";
                        decButton.addEventListener('click', () => {
                            if (element.quantity > 1) {
                                element.quantity -= 1;
                                this.displayCartPage();
                            }
                        });
                        let incButton = document.createElement('button');
                        incButton.setAttribute('class', 'btn btn-primary');
                        incButton.innerHTML = "+";
                        incButton.addEventListener('click', () => {
                            element.quantity += 1;
                            this.displayCartPage();
                        });
                        let quantityDisplay = document.createElement('span');
                        quantityDisplay.innerHTML = "" + element.quantity;
                        quantityButton.appendChild(decButton);
                        quantityButton.appendChild(quantityDisplay);
                        quantityButton.appendChild(incButton);
                        // quantityButton.style.width="25vw";
                        cartRow.appendChild(quantityButton);

                        let price = document.createElement('h4');
                        price.innerHTML = "₹" + (element.quantity * element.price).toFixed(2);

                        cartRow.appendChild(price);

                        cartDiv.appendChild(cartRow);
                    });

                    let subTotalDiv = document.createElement('div');
                    subTotalDiv.style.display = "flex";
                    subTotalDiv.style.justifyContent = "space-between";
                    subTotalDiv.innerHTML = `<h1 style="font-size:4vw">SUBTOTAL</h1><h1 style="font-size:4vw">₹${totalAmount.toFixed(2)}</h1>`;
                    cartDiv.appendChild(subTotalDiv);
                    const checkoutButton = document.createElement('button');
                    checkoutButton.innerHTML = "CHECKOUT";
                    checkoutButton.setAttribute('class', "btn btn-primary");
                    checkoutButton.style.width = "100%";
                    checkoutButton.style.textAlign = "center";
                    checkoutButton.addEventListener("click", () => this.checkoutPage(totalAmount));
                    cartDiv.appendChild(checkoutButton);
                    contentBox?.appendChild(cartDiv);
                }

            }

            checkoutPage(totalAmount: number) {
                pageHeader.innerHTML = "";
                contentBox.innerHTML = "";
                const checkOutMessage = document.createElement('h1');
                checkOutMessage.innerHTML = "THANK YOU FOR SHOPPING WITH US🎁💝";
                checkOutMessage.style.textAlign = "center";
                contentBox?.appendChild(checkOutMessage);
                while (this.cartItems.length > 0) {
                    let length: number = this.cartItems.length;
                    let lastItem: cartProduct = this.cartItems[length - 1];
                    this.products.forEach(element => {
                        if (element.id === lastItem.id) {
                            element.isCarted = false;
                        }
                    });
                    this.productsToBeShown.forEach(element => {
                        if (element.id === lastItem.id) {
                            element.isCarted = false;
                        }
                    });
                    this.cartItems.pop();
                }
                this.updateCartQuantity();
                setTimeout(() => this.displayProductsPage(), 3000);
                // paymentCheckout(totalAmount);
            }

            productPage(product: any) {
                headerComponent.style.display = "none";
                this.designpageHeader("Product Description");
                contentBox.innerHTML = "";

                let productDiv = document.createElement('div');
                productDiv.setAttribute('class', 'productDiv');

                let imageDiv = document.createElement('div');
                let image = document.createElement('img');
                image.setAttribute('src', product.image);
                imageDiv.appendChild(image);
                // imageDiv.style.width="400px";
                // imageDiv.style.maxWidth="100%";
                imageDiv.setAttribute('class','imageDiv-product');

                productDiv.appendChild(imageDiv);

                let descDiv = document.createElement('div');
                let category = document.createElement('p');
                category.innerHTML = product.category;
                descDiv.appendChild(category);

                let productName = document.createElement('h2');
                productName.innerHTML = product.title;
                descDiv.appendChild(productName);

                let productDescription = document.createElement('p');
                productDescription.innerHTML = product.description;
                descDiv.appendChild(productDescription);

                let productReview = document.createElement('h6');
                productReview.innerHTML = product.rating.rate + "⭐";
                descDiv.appendChild(productReview);

                let productPrice = document.createElement('h2');
                productPrice.innerHTML = "₹" + product.price;
                descDiv.appendChild(productPrice);

                let addToCartButton = document.createElement('a');
                addToCartButton.setAttribute("class", "btn btn-primary");
                if (product.isCarted) {
                    addToCartButton.style.backgroundColor = "purple";
                    addToCartButton.innerHTML = "Item Added to Cart";
                }
                else {
                    addToCartButton.innerHTML = `<i class="fas fa-shopping-bag"></i> Add Cart`;
                }

                addToCartButton.addEventListener("click", () => {
                    if (addToCartButton.innerHTML !== "Item Added to Cart") {
                        addToCartButton.style.backgroundColor = "purple";
                        addToCartButton.innerHTML = "Item Added to Cart";
                        this.addToCart(product);
                    }
                });
                descDiv.appendChild(addToCartButton);
                // descDiv.style.width="600px";
                // descDiv.style.maxWidth="100%";
                descDiv.setAttribute('class','descDiv-product');
                productDiv.appendChild(descDiv);
                contentBox?.appendChild(productDiv);
            }

            handleNavigation() {
                // Initially sorting the items according to price..
                this.productsToBeShown.sort((a: product, b: product) => a.price - b.price);
                // categories changing
                document.getElementById('logo')?.addEventListener('click', () => this.updateCategory('all'));
                document.getElementById('all')?.addEventListener('click', () => this.updateCategory('all'));
                document.getElementById('mens')?.addEventListener('click', () => this.updateCategory('mens'));
                document.getElementById('womens')?.addEventListener('click', () => this.updateCategory('womens'));
                document.getElementById('electronics')?.addEventListener('click', () => this.updateCategory('electronics'));
                document.getElementById('jewelery')?.addEventListener('click', () => this.updateCategory('jewelery'));

                // sorting parameter changing
                document.getElementsByTagName('select')[0]?.addEventListener('input', () => this.updateSortingParameter());

                // handling wishlist page
                document.getElementById('wishlist')?.addEventListener('click', () => this.displayWishlistPage());
                document.getElementById('cartpage')?.addEventListener('click', () => this.displayCartPage());
            }
        }

        let Ecommerce = new EcommerceApp();
        Ecommerce.updateData();
        Ecommerce.handleNavigation();
        Ecommerce.displayProductsPage();
    });




//web integration
let Razorpay: any;
function paymentCheckout(totalAmount: number) {
    var options = {
        "key": "",
        "amount": totalAmount * 100,
        "currency": "INR",
        "name": "Acme Corp",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": null,
        "handler": function (response) {
            alert(response.razorpay_payment_id);
            alert(response.razorpay_order_id);
            alert(response.razorpay_signature)
        },
        "prefill": {
            "name": "Gaurav Kumar", //your customer's name
            "email": "gaurav.kumar@example.com",
            "contact": "9000090000"  //Provide the customer's phone number for better conversion rates
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.open();
    rzp1.on('payment.failed', function (response) {
        console.log(response.error);
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
    });
}