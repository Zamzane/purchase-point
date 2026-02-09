
let user = localStorage.getItem("user");
let usersDB = JSON.parse(localStorage.getItem("usersDB")) || {};
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

// Products with realistic images
let products = [
  {
    name: "Sneakers",
    price: 300,
    img: "images/sneakers.jpg"
  },
  {
    name: "Headphones",
    price: 120,
    img: "images/headphones.jpg"
  },
  {
    name: "Watch",
    price: 200,
    img: "images/watch.jpg"
  },
  {
    name: "iPhone 14",
    price: 4500,
    img: "images/iPhone.jpg"
  },
  {
    name: "MacBook Pro",
    price: 12000,
    img: "images/macBookPro.jpg"
  },
  {
    name: "Samsung Galaxy S23 Ultra",
    price: 4200,
    img: "images/phone.jpg"
  },
  {
    name: "Dell XPS Laptop",
    price: 9500,
    img: "images/laptop.jpg"
  }

];


// LOGIN
function login() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  if(!username || !password){ alert("Enter username and password"); return; }
  if(usersDB[username] && usersDB[username] === password){
    localStorage.setItem("user", username);
    location.reload();
  } else { alert("Invalid username or password"); }
}

// REGISTER
function register() {
  let username = document.getElementById("regUsername").value;
  let password = document.getElementById("regPassword").value;
  if(!username || !password){ alert("Enter username and password to register"); return; }
  if(usersDB[username]){ alert("Username already exists"); return; }
  usersDB[username] = password;
  localStorage.setItem("usersDB", JSON.stringify(usersDB));
  alert("Registration successful! You can now login.");
  document.getElementById("regUsername").value = "";
  document.getElementById("regPassword").value = "";
}

// LOGOUT
function logout(){ localStorage.removeItem("user"); localStorage.removeItem("cart"); location.reload(); }

// CHECK LOGIN
if(user){ document.getElementById("loginBox").style.display="none"; document.getElementById("shop").style.display="block"; loadProducts(); updateCart(); }

// LOAD PRODUCTS
function loadProducts(filteredProducts = products){
  let box = document.getElementById("products"); box.innerHTML="";
  filteredProducts.forEach((p, i) => {
    box.innerHTML += `
    <article class="product">
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₵${p.price}</p>
      <button onclick="add(${i})">Add</button>
    </article>`;
  });
}

// SEARCH PRODUCTS
function searchProducts(){
  let term = document.getElementById("searchInput").value.toLowerCase();
  loadProducts(products.filter(p => p.name.toLowerCase().includes(term)));
}

// ADD TO CART
function add(i){
  let existing = cart.find(item => item.name===products[i].name);
  if(existing){ existing.quantity+=1; } else { cart.push({...products[i], quantity:1}); }
  saveCart(); updateCart();
}

// REMOVE ITEM
function remove(index){ cart.splice(index,1); saveCart(); updateCart(); }

// UPDATE QUANTITY
function updateQuantity(index,value){ if(value<1) return; cart[index].quantity=parseInt(value); saveCart(); updateCart(); }

// UPDATE CART
function updateCart(){
  let list=document.getElementById("cart"); let t=document.getElementById("total"); total=0; list.innerHTML="";
  cart.forEach((item,index)=>{
    total+=item.price*item.quantity;
    list.innerHTML+=`
      <li>${item.name} - ₵${item.price*item.quantity} 
        <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)">
        <button onclick="remove(${index})" class="removeBtn">Remove</button>
      </li>`;
  });
  t.textContent=total;
}

// SAVE CART
function saveCart(){ localStorage.setItem("cart",JSON.stringify(cart)); }

document.getElementById("payButton").addEventListener("click", function() {
    let momoNumber = document.getElementById("momo").value;
    
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    if (momoNumber.length < 9) {
        alert("Enter a valid MoMo number!");
        return;
    }

    // Use your Paystack public test key here
    let handler = PaystackPop.setup({
        key: "pk_live_20f22868f4c1953cfb20bac4149bbfc26b81ca9d", // replace with your Paystack public key
        email: "customer@example.com", // can be dynamic or placeholder
        amount: total * 100, // total in kobo
        currency: "GHS",
        ref: 'PP-' + Math.floor((Math.random() * 1000000000) + 1), // unique reference
        metadata: {
            custom_fields: [
                {
                    display_name: "Mobile Number",
                    variable_name: "mobile_number",
                    value: momoNumber
                }
            ]
        },
        callback: function(response) {
            // Payment successful
            alert("Payment successful! Reference: " + response.reference);
            cart = [];
            total = 0;
            updateCart();
        },
        onClose: function() {
            alert("Payment window closed.");
        }
    });

    handler.openIframe();
});

