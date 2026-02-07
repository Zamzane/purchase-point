let user = localStorage.getItem("user");
let usersDB = JSON.parse(localStorage.getItem("usersDB")) || {};
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

// Products with realistic images
let products = [
  { name: "Sneakers", price: 300, img: "https://cdn.pixabay.com/photo/2016/03/27/19/48/sneakers-1284259_1280.jpg" },
  { name: "Headphones", price: 120, img: "https://cdn.pixabay.com/photo/2016/11/29/05/08/headphones-1868612_1280.jpg" },
  { name: "Watch", price: 200, img: "https://cdn.pixabay.com/photo/2017/03/27/13/41/wristwatch-2178583_1280.jpg" },
  { name: "iPhone 14", price: 4500, img: "https://cdn.pixabay.com/photo/2022/01/28/16/54/iphone-6976787_1280.jpg" },
  { name: "MacBook Pro", price: 12000, img: "https://cdn.pixabay.com/photo/2020/03/03/11/30/macbook-4895781_1280.jpg" },
  { name: "Samsung Galaxy S23", price: 4200, img: "https://cdn.pixabay.com/photo/2023/03/15/18/53/galaxy-7847634_1280.jpg" },
  { name: "Dell XPS Laptop", price: 9500, img: "https://cdn.pixabay.com/photo/2018/01/14/23/12/laptop-3087585_1280.jpg" }
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

// PAYMENT
function pay(){
  let momo=document.getElementById("momo").value;
  if(!/^\d{9,}$/.test(momo)){ alert("Enter valid MoMo number"); return; }
  if(cart.length==0){ alert("Cart empty"); return; }
  alert("Payment Successful!\n₵"+total); cart=[]; saveCart(); updateCart();
}
