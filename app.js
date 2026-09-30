const products=[
{id:1,name:"Higher Than Yesterday Tee",category:"tees",price:1499,badge:"SIGNATURE"},
{id:2,name:"Mountain Within Tee",category:"tees",price:1499,badge:"NEW"},
{id:3,name:"Rise / Evolve Hoodie",category:"hoodies",price:2499,badge:"LIMITED"},
{id:4,name:"Rise. Evolve. Become. Tee",category:"tees",price:1399,badge:"ESSENTIAL"}];
let cart=JSON.parse(localStorage.getItem("aaroh-cart")||"[]");
const money=n=>"₹"+n.toLocaleString("en-IN"),grid=document.getElementById("products");
function renderProducts(filter="all"){grid.innerHTML=products.filter(p=>filter==="all"||p.category===filter).map((p,i)=>`<article class="product p${i+1}" data-id="${p.id}"><div class="product-media"><img src="assets/products-strip.jpg" alt="${p.name}"><span class="badge">${p.badge}</span></div><div class="product-info"><div><h3>${p.name}</h3><p>AAROH / 2026 EDIT</p></div><span class="price">${money(p.price)}</span></div></article>`).join("");document.querySelectorAll(".product").forEach(el=>el.onclick=()=>addToCart(+el.dataset.id))}
renderProducts();
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderProducts(b.dataset.filter)});
function addToCart(id){const p=products.find(x=>x.id===id),f=cart.find(x=>x.id===id);f?f.qty++:cart.push({...p,qty:1});saveCart();openCart()}
function saveCart(){localStorage.setItem("aaroh-cart",JSON.stringify(cart));renderCart()}
function renderCart(){document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);const box=document.getElementById("cartItems");if(!cart.length){box.innerHTML='<p class="empty">Your bag is empty.</p>';document.getElementById("subtotal").textContent="₹0";return}box.innerHTML=cart.map(x=>`<div class="cart-row"><div class="cart-thumb"></div><div><h4>${x.name}</h4><p>${money(x.price)} × ${x.qty}</p></div><button class="remove" data-remove="${x.id}">×</button></div>`).join("");box.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{cart=cart.filter(x=>x.id!==+b.dataset.remove);saveCart()});document.getElementById("subtotal").textContent=money(cart.reduce((s,x)=>s+x.price*x.qty,0))}
function openCart(){cartDrawer.classList.add("open");overlay.classList.add("show")}function closeCart(){cartDrawer.classList.remove("open");overlay.classList.remove("show")}
const cartDrawer=document.getElementById("cartDrawer"),overlay=document.getElementById("overlay");
cartBtn.onclick=openCart;closeCart.onclick=closeCart;overlay.onclick=closeCart;checkout.onclick=()=>alert("Checkout is ready to connect to your payment gateway.");
menuBtn.onclick=()=>document.querySelector(".nav").classList.toggle("open");document.querySelectorAll("#mainNav a").forEach(a=>a.onclick=()=>document.querySelector(".nav").classList.remove("open"));
searchBtn.onclick=()=>document.getElementById("shop").scrollIntoView({behavior:"smooth"});
newsletterForm.onsubmit=e=>{e.preventDefault();newsletterMsg.textContent="Welcome to the AAROH letter.";e.target.reset()};renderCart();