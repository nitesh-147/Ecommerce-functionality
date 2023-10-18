var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
fetch('https://fakestoreapi.com/products')
    .then(function (res) { return res.json(); })
    .then(function (json) {
    var headerComponent = document.getElementById('header');
    var contentBox = document.getElementById('content');
    var pageHeader = document.getElementById('pageHeader');
    var EcommerceApp = /** @class */ (function () {
        function EcommerceApp() {
            this.products = [];
            this.cartItems = [];
            this.wishlistItems = [];
            this.category = "all";
            this.productsToBeShown = this.products;
            this.sortingParameter = "priceLowToHigh";
            this.cartQuantity = 0;
            this.wishlistQuantity = 0;
        }
        EcommerceApp.prototype.updateData = function () {
            var _this = this;
            json.forEach(function (item) {
                _this.products.push(__assign(__assign({}, item), { price: item.price * 10, isCarted: false, isWishlisted: false }));
            });
        };
        EcommerceApp.prototype.displayProductsPage = function () {
            var _this = this;
            contentBox.innerHTML = "";
            pageHeader.innerHTML = "";
            headerComponent.style.display = "block";
            this.productsToBeShown.forEach(function (product) {
                _this.createProductBox(product);
            });
        };
        EcommerceApp.prototype.createProductBox = function (product) {
            var _this = this;
            var productBox = document.createElement('div');
            productBox.setAttribute("class", "product-box");
            var productImage = document.createElement('img');
            productImage.setAttribute("src", product.image);
            productBox.appendChild(productImage);
            var productName = document.createElement('strong');
            var tempText = product.title; //tempText is for modifying large product Title
            if (tempText.length > 15) {
                tempText = tempText.substring(0, 15);
            }
            productName.innerText = tempText;
            productName.style.cursor = "pointer";
            productName.addEventListener('click', function () { return _this.productPage(product); });
            productBox.appendChild(productName);
            var productPrice = document.createElement('span');
            productPrice.setAttribute('class', 'price');
            productPrice.innerText = "₹" + product.price.toFixed(2);
            productBox.appendChild(productPrice);
            var addToCartButton = document.createElement('a');
            addToCartButton.setAttribute("class", "cart-btn");
            if (product.isCarted) {
                addToCartButton.style.backgroundColor = "purple";
                addToCartButton.innerHTML = "Item Added to Cart";
            }
            else {
                addToCartButton.innerHTML = "<i class=\"fas fa-shopping-bag\"></i> Add Cart";
            }
            addToCartButton.addEventListener("click", function () {
                if (addToCartButton.innerHTML !== "Item Added to Cart") {
                    addToCartButton.style.backgroundColor = "purple";
                    addToCartButton.innerHTML = "Item Added to Cart";
                    _this.addToCart(product);
                }
            });
            productBox.appendChild(addToCartButton);
            var addToWishlistButton = document.createElement('a');
            addToWishlistButton.setAttribute('class', 'like-btn');
            if (product.isWishlisted) {
                addToWishlistButton.innerHTML = "&#10084;";
            }
            else {
                addToWishlistButton.innerHTML = "&#9825;";
            }
            addToWishlistButton.addEventListener("click", function () {
                if (addToWishlistButton.innerHTML === "♡") {
                    console.log(addToWishlistButton.innerHTML);
                    addToWishlistButton.innerHTML = "&#10084;";
                    _this.wishlistItems.push(product);
                    product.isWishlisted = true;
                }
                else {
                    addToWishlistButton.innerHTML = "&#9825;";
                    _this.wishlistItems = _this.wishlistItems.filter(function (element) { return element.id !== product.id; });
                    product.isWishlisted = false;
                }
                _this.updateWishlistQuantity();
            });
            productBox.appendChild(addToWishlistButton);
            var ratingDisplayButton = document.createElement('span');
            ratingDisplayButton.innerHTML = "" + product.rating.rate + "⭐";
            ratingDisplayButton.setAttribute("class", "ratingButton");
            productBox.appendChild(ratingDisplayButton);
            contentBox === null || contentBox === void 0 ? void 0 : contentBox.appendChild(productBox);
        };
        EcommerceApp.prototype.addToCart = function (product) {
            // let index = -1;
            // this.cartItems.forEach(element => {
            //     if (element.id === product.id) {
            //         product.quantity += 1;
            //         index = 0;
            //     }
            // });
            this.products.forEach(function (element) {
                if (element.id === product.id) {
                    element.isCarted = true;
                }
            });
            this.productsToBeShown.forEach(function (element) {
                if (element.id === product.id) {
                    element.isCarted = true;
                }
            });
            this.cartItems.push(__assign(__assign({}, product), { quantity: 1 }));
            this.updateCartQuantity();
        };
        EcommerceApp.prototype.updateProductsToBeDisplayedByCategory = function () {
            var tempCategory = this.category;
            if (this.category === "mens")
                tempCategory = "men's clothing";
            if (this.category === "womens")
                tempCategory = "women's clothing";
            this.productsToBeShown = this.products.filter(function (product) { return product.category === tempCategory || tempCategory === "all"; });
            this.updateSortingParameter();
            this.displayProductsPage();
        };
        EcommerceApp.prototype.updateCategory = function (category) {
            var _a, _b;
            (_a = document.getElementById(this.category)) === null || _a === void 0 ? void 0 : _a.classList.remove("active");
            this.category = category;
            (_b = document.getElementById(category)) === null || _b === void 0 ? void 0 : _b.classList.add("active");
            this.updateProductsToBeDisplayedByCategory();
        };
        EcommerceApp.prototype.updateSortingParameter = function () {
            var _a;
            this.sortingParameter = (_a = document.getElementsByTagName('select')[0]) === null || _a === void 0 ? void 0 : _a.value;
            if (this.sortingParameter === "priceLowToHigh") {
                this.productsToBeShown.sort(function (a, b) { return a.price - b.price; });
            }
            else if (this.sortingParameter === "priceHighToLow") {
                this.productsToBeShown.sort(function (a, b) { return b.price - a.price; });
            }
            else if (this.sortingParameter === "ratingLowToHigh") {
                this.productsToBeShown.sort(function (a, b) { return a.rating.rate - b.rating.rate; });
            }
            else {
                this.productsToBeShown.sort(function (a, b) { return b.rating.rate - a.rating.rate; });
            }
            this.displayProductsPage();
        };
        EcommerceApp.prototype.updateCartQuantity = function () {
            document.getElementById('cartquantity').innerText = "" + this.cartItems.length;
        };
        EcommerceApp.prototype.updateWishlistQuantity = function () {
            document.getElementById('wishlistquantity').innerHTML = "" + this.wishlistItems.length;
        };
        EcommerceApp.prototype.displayWishlistPage = function () {
            var _this = this;
            contentBox.innerHTML = " ";
            this.designpageHeader("WISHLIST PAGE");
            headerComponent.style.display = "none";
            if (this.wishlistItems.length === 0) {
                var displayMessage = document.createElement('h1');
                displayMessage.innerHTML = "Your WishList is Empty!!!";
                displayMessage.style.textAlign = "center";
                contentBox === null || contentBox === void 0 ? void 0 : contentBox.appendChild(displayMessage);
            }
            this.wishlistItems.forEach(function (product) {
                var productBox = document.createElement('div');
                productBox.setAttribute("class", "product-box");
                var productImage = document.createElement('img');
                productImage.setAttribute("src", product.image);
                productBox.appendChild(productImage);
                var productName = document.createElement('strong');
                var tempText = product.title; //tempText is for modifying large product Title
                if (tempText.length > 15) {
                    tempText = tempText.substring(0, 15);
                }
                productName.innerText = tempText;
                productBox.appendChild(productName);
                var productPrice = document.createElement('span');
                productPrice.setAttribute('class', 'price');
                productPrice.innerText = "₹" + product.price;
                productBox.appendChild(productPrice);
                var addToCartButton = document.createElement('a');
                addToCartButton.setAttribute("class", "cart-btn");
                if (product.isCarted) {
                    addToCartButton.style.backgroundColor = "purple";
                    addToCartButton.innerHTML = "Item Added to Cart";
                }
                else {
                    addToCartButton.innerHTML = "<i class=\"fas fa-shopping-bag\"></i> Add Cart";
                }
                addToCartButton.addEventListener("click", function () {
                    if (addToCartButton.innerHTML !== "Item Added to Cart") {
                        addToCartButton.style.backgroundColor = "purple";
                        addToCartButton.innerHTML = "Item Added to Cart";
                        _this.addToCart(product);
                    }
                });
                productBox.appendChild(addToCartButton);
                var removeButton = document.createElement('a');
                removeButton.setAttribute('class', 'like-btn');
                removeButton.innerHTML = "X";
                removeButton.addEventListener("click", function () {
                    _this.wishlistItems = _this.wishlistItems.filter(function (item) { return item.id != product.id; });
                    _this.products.forEach(function (element) {
                        if (element.id === product.id) {
                            element.isWishlisted = false;
                        }
                    });
                    _this.productsToBeShown.forEach(function (element) {
                        if (element.id === product.id) {
                            element.isWishlisted = false;
                        }
                    });
                    _this.updateWishlistQuantity();
                    _this.displayWishlistPage();
                });
                productBox.appendChild(removeButton);
                var ratingDisplayButton = document.createElement('span');
                ratingDisplayButton.innerHTML = "" + product.rating.rate + "⭐";
                ratingDisplayButton.setAttribute("class", "ratingButton");
                productBox.appendChild(ratingDisplayButton);
                contentBox === null || contentBox === void 0 ? void 0 : contentBox.appendChild(productBox);
            });
        };
        EcommerceApp.prototype.designpageHeader = function (name) {
            var _this = this;
            pageHeader.innerHTML = "";
            var pageHeading = document.createElement('h1');
            pageHeading.innerHTML = name;
            pageHeading.style.textAlign = "center";
            pageHeading.style.maxWidth = "95vw";
            pageHeader === null || pageHeader === void 0 ? void 0 : pageHeader.appendChild(pageHeading);
            pageHeader === null || pageHeader === void 0 ? void 0 : pageHeader.appendChild(document.createElement('hr'));
            var goBackButton = document.createElement('button');
            goBackButton.innerHTML = "<< continue back to shopping";
            goBackButton.setAttribute('class', 'btn btn-primary');
            goBackButton.style.maxWidth = "95vw";
            goBackButton.addEventListener('click', function () { return _this.displayProductsPage(); });
            pageHeader === null || pageHeader === void 0 ? void 0 : pageHeader.appendChild(goBackButton);
        };
        EcommerceApp.prototype.displayCartPage = function () {
            var _this = this;
            headerComponent.style.display = "none";
            this.designpageHeader("CART PAGE");
            contentBox.innerHTML = "";
            if (this.cartItems.length === 0) {
                var displayMessage = document.createElement('h1');
                displayMessage.innerHTML = "Your Cart is Empty!!!";
                displayMessage.style.textAlign = "center";
                contentBox === null || contentBox === void 0 ? void 0 : contentBox.appendChild(displayMessage);
            }
            else {
                var cartDiv_1 = document.createElement('div');
                cartDiv_1.setAttribute('class', 'container');
                var totalAmount_1 = 0;
                this.cartItems.forEach(function (element) {
                    totalAmount_1 += element.price * element.quantity;
                    var cartRow = document.createElement('div');
                    cartRow.style.display = "flex";
                    cartRow.style.alignItems = "center";
                    cartRow.style.justifyContent = "space-evenly";
                    var removeButton = document.createElement('span');
                    removeButton.innerHTML = "X";
                    removeButton.style.color = "red";
                    removeButton.style.cursor = "pointer";
                    removeButton.addEventListener('click', function () {
                        _this.cartItems = _this.cartItems.filter(function (item) { return item.id !== element.id; });
                        _this.products.forEach(function (product) {
                            if (product.id === element.id) {
                                product.isCarted = false;
                            }
                        });
                        _this.productsToBeShown.forEach(function (product) {
                            if (product.id === element.id) {
                                product.isCarted = false;
                            }
                        });
                        _this.updateCartQuantity();
                        _this.displayCartPage();
                    });
                    cartRow.appendChild(removeButton);
                    // removeButton.style.width="10vw";
                    var imageName = document.createElement('div');
                    var image = document.createElement('img');
                    image.setAttribute('src', element.image);
                    image.style.width = "100px";
                    image.style.maxWidth = "100%";
                    image.style.height = "100px";
                    var name = document.createElement('h6');
                    name.innerHTML = "" + element.title.substring(0, 20);
                    imageName.appendChild(image);
                    imageName.appendChild(name);
                    cartRow.appendChild(imageName);
                    imageName.style.width = "25vw";
                    var quantityButton = document.createElement('div');
                    quantityButton.style.display = "flex";
                    quantityButton.style.columnGap = "1vw";
                    quantityButton.setAttribute("id", "quantity-button");
                    var decButton = document.createElement('button');
                    decButton.setAttribute('class', 'btn btn-primary');
                    decButton.innerHTML = "-";
                    decButton.addEventListener('click', function () {
                        if (element.quantity > 1) {
                            element.quantity -= 1;
                            _this.displayCartPage();
                        }
                    });
                    var incButton = document.createElement('button');
                    incButton.setAttribute('class', 'btn btn-primary');
                    incButton.innerHTML = "+";
                    incButton.addEventListener('click', function () {
                        element.quantity += 1;
                        _this.displayCartPage();
                    });
                    var quantityDisplay = document.createElement('span');
                    quantityDisplay.innerHTML = "" + element.quantity;
                    quantityButton.appendChild(decButton);
                    quantityButton.appendChild(quantityDisplay);
                    quantityButton.appendChild(incButton);
                    // quantityButton.style.width="25vw";
                    cartRow.appendChild(quantityButton);
                    var price = document.createElement('h4');
                    price.innerHTML = "₹" + (element.quantity * element.price).toFixed(2);
                    cartRow.appendChild(price);
                    cartDiv_1.appendChild(cartRow);
                });
                var subTotalDiv = document.createElement('div');
                subTotalDiv.style.display = "flex";
                subTotalDiv.style.justifyContent = "space-between";
                subTotalDiv.innerHTML = "<h1 style=\"font-size:4vw\">SUBTOTAL</h1><h1 style=\"font-size:4vw\">\u20B9".concat(totalAmount_1.toFixed(2), "</h1>");
                cartDiv_1.appendChild(subTotalDiv);
                var checkoutButton = document.createElement('button');
                checkoutButton.innerHTML = "CHECKOUT";
                checkoutButton.setAttribute('class', "btn btn-primary");
                checkoutButton.style.width = "100%";
                checkoutButton.style.textAlign = "center";
                checkoutButton.addEventListener("click", function () { return _this.checkoutPage(totalAmount_1); });
                cartDiv_1.appendChild(checkoutButton);
                contentBox === null || contentBox === void 0 ? void 0 : contentBox.appendChild(cartDiv_1);
            }
        };
        EcommerceApp.prototype.checkoutPage = function (totalAmount) {
            var _this = this;
            pageHeader.innerHTML = "";
            contentBox.innerHTML = "";
            var checkOutMessage = document.createElement('h1');
            checkOutMessage.innerHTML = "THANK YOU FOR SHOPPING WITH US🎁💝";
            checkOutMessage.style.textAlign = "center";
            contentBox === null || contentBox === void 0 ? void 0 : contentBox.appendChild(checkOutMessage);
            var _loop_1 = function () {
                var length_1 = this_1.cartItems.length;
                var lastItem = this_1.cartItems[length_1 - 1];
                this_1.products.forEach(function (element) {
                    if (element.id === lastItem.id) {
                        element.isCarted = false;
                    }
                });
                this_1.productsToBeShown.forEach(function (element) {
                    if (element.id === lastItem.id) {
                        element.isCarted = false;
                    }
                });
                this_1.cartItems.pop();
            };
            var this_1 = this;
            while (this.cartItems.length > 0) {
                _loop_1();
            }
            this.updateCartQuantity();
            setTimeout(function () { return _this.displayProductsPage(); }, 3000);
            // paymentCheckout(totalAmount);
        };
        EcommerceApp.prototype.productPage = function (product) {
            var _this = this;
            headerComponent.style.display = "none";
            this.designpageHeader("Product Description");
            contentBox.innerHTML = "";
            var productDiv = document.createElement('div');
            productDiv.setAttribute('class', 'productDiv');
            var imageDiv = document.createElement('div');
            var image = document.createElement('img');
            image.setAttribute('src', product.image);
            imageDiv.appendChild(image);
            // imageDiv.style.width="400px";
            // imageDiv.style.maxWidth="100%";
            imageDiv.setAttribute('class', 'imageDiv-product');
            productDiv.appendChild(imageDiv);
            var descDiv = document.createElement('div');
            var category = document.createElement('p');
            category.innerHTML = product.category;
            descDiv.appendChild(category);
            var productName = document.createElement('h2');
            productName.innerHTML = product.title;
            descDiv.appendChild(productName);
            var productDescription = document.createElement('p');
            productDescription.innerHTML = product.description;
            descDiv.appendChild(productDescription);
            var productReview = document.createElement('h6');
            productReview.innerHTML = product.rating.rate + "⭐";
            descDiv.appendChild(productReview);
            var productPrice = document.createElement('h2');
            productPrice.innerHTML = "₹" + product.price;
            descDiv.appendChild(productPrice);
            var addToCartButton = document.createElement('a');
            addToCartButton.setAttribute("class", "btn btn-primary");
            if (product.isCarted) {
                addToCartButton.style.backgroundColor = "purple";
                addToCartButton.innerHTML = "Item Added to Cart";
            }
            else {
                addToCartButton.innerHTML = "<i class=\"fas fa-shopping-bag\"></i> Add Cart";
            }
            addToCartButton.addEventListener("click", function () {
                if (addToCartButton.innerHTML !== "Item Added to Cart") {
                    addToCartButton.style.backgroundColor = "purple";
                    addToCartButton.innerHTML = "Item Added to Cart";
                    _this.addToCart(product);
                }
            });
            descDiv.appendChild(addToCartButton);
            // descDiv.style.width="600px";
            // descDiv.style.maxWidth="100%";
            descDiv.setAttribute('class', 'descDiv-product');
            productDiv.appendChild(descDiv);
            contentBox === null || contentBox === void 0 ? void 0 : contentBox.appendChild(productDiv);
        };
        EcommerceApp.prototype.handleNavigation = function () {
            var _this = this;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            // Initially sorting the items according to price..
            this.productsToBeShown.sort(function (a, b) { return a.price - b.price; });
            // categories changing
            (_a = document.getElementById('logo')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () { return _this.updateCategory('all'); });
            (_b = document.getElementById('all')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () { return _this.updateCategory('all'); });
            (_c = document.getElementById('mens')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () { return _this.updateCategory('mens'); });
            (_d = document.getElementById('womens')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', function () { return _this.updateCategory('womens'); });
            (_e = document.getElementById('electronics')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', function () { return _this.updateCategory('electronics'); });
            (_f = document.getElementById('jewelery')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', function () { return _this.updateCategory('jewelery'); });
            // sorting parameter changing
            (_g = document.getElementsByTagName('select')[0]) === null || _g === void 0 ? void 0 : _g.addEventListener('input', function () { return _this.updateSortingParameter(); });
            // handling wishlist page
            (_h = document.getElementById('wishlist')) === null || _h === void 0 ? void 0 : _h.addEventListener('click', function () { return _this.displayWishlistPage(); });
            (_j = document.getElementById('cartpage')) === null || _j === void 0 ? void 0 : _j.addEventListener('click', function () { return _this.displayCartPage(); });
        };
        return EcommerceApp;
    }());
    var Ecommerce = new EcommerceApp();
    Ecommerce.updateData();
    Ecommerce.handleNavigation();
    Ecommerce.displayProductsPage();
});
//web integration
var Razorpay;
function paymentCheckout(totalAmount) {
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
            alert(response.razorpay_signature);
        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9000090000" //Provide the customer's phone number for better conversion rates
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
