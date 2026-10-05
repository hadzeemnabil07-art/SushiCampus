const items = [
  {name:"Inari", icon:"🍙", desc:"Sweet, marinated tofu pockets full of fluffy rice—soft and flavorful."},
  {name:"Cheese Slice", icon:"🧀", desc:"A creamy twist adding smoothness and richness to our rolls."},
  {name:"Crab Stick", icon:"🦀", desc:"Light and savory imitation crab meat, perfect for classic sushi rolls."},
  {name:"Creamy Squid", icon:"🦑", desc:"Tender squid mixed with a special creamy dressing for extra taste."},
  {name:"Crab Mayo", icon:"🦀", desc:"A luscious blend of crab meat with mayonnaise, adding a rich, savory flavor."},
  {name:"Spicy Chicken Roll", icon:"🌶️", desc:"Tender chicken with a bold spicy kick, wrapped in fresh seaweed and rice."},
  {name:"Creamy Chicken Roll", icon:"🍗", desc:"Soft chicken pieces blended with creamy sauce for a smooth flavor experience."},
  {name:"Buttermilk Chicken Roll", icon:"🍗", desc:"Juicy chicken marinated in buttermilk, creating a tender and rich taste."},
  {name:"Bolognese Meatball Roll", icon:"🍝", desc:"Savory meatballs combined with classic Bolognese sauce inside a sushi roll."},
  {name:"Big Mac Meat Roll", icon:"🍔", desc:"Inspired by the famous burger, this roll features seasoned beef and a tangy sauce."},
  {name:"Spicy Prawn Roll", icon:"🍤", desc:"Succulent prawns with a spicy mayo drizzle to heat up your palate."},
  {name:"Cheesy Prawn Roll", icon:"🧀", desc:"Delicious prawns paired with melted cheese for a rich, indulgent bite."}
];

// CHANGE THIS to your WhatsApp number in international format, without + or spaces.
// Example Malaysia: 60123456789
const WHATSAPP_NUMBER = "60123456789";

const cart = {};

function money(n){ return "RM" + n.toFixed(2); }
function unitPrice(){
  const total = Object.values(cart).reduce((a,b)=>a+b,0);
  return total >= 10 ? 1.50 : total >= 5 ? 1.60 : 1.70;
}
function totalPieces(){ return Object.values(cart).reduce((a,b)=>a+b,0); }

function renderMenu(){
  const grid = document.getElementById("menuGrid");
  grid.innerHTML = items.map((item,i)=>`
    <article class="menu-card">
      <div>
        <div class="food-icon">${item.icon}</div>
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
      </div>
      <div class="card-bottom">
        <span class="base-price">RM1.70</span>
        <button class="add-btn" aria-label="Add ${item.name}" onclick="addItem(${i})">+</button>
      </div>
    </article>
  `).join("");
}

function addItem(i){ cart[i]=(cart[i]||0)+1; renderCart(); document.getElementById("order").scrollIntoView({behavior:"smooth"}); }
function changeQty(i,delta){ cart[i]=(cart[i]||0)+delta; if(cart[i]<=0) delete cart[i]; renderCart(); }
function removeItem(i){ delete cart[i]; renderCart(); }

function renderCart(){
  const empty=document.getElementById("cartEmpty"), content=document.getElementById("cartContent");
  const keys=Object.keys(cart);
  if(!keys.length){ empty.classList.remove("hidden"); content.classList.add("hidden"); return; }
  empty.classList.add("hidden"); content.classList.remove("hidden");
  document.getElementById("cartItems").innerHTML=keys.map(k=>{
    const i=Number(k), q=cart[k];
    return `<div class="cart-item">
      <div><h4>${items[i].name}</h4><small>${money(q*unitPrice())}</small></div>
      <div class="qty"><button type="button" onclick="changeQty(${i},-1)">−</button><strong>${q}</strong><button type="button" onclick="changeQty(${i},1)">+</button></div>
      <button class="remove" type="button" onclick="removeItem(${i})">×</button>
    </div>`;
  }).join("");
  const pieces=totalPieces(), price=unitPrice();
  document.getElementById("totalPieces").textContent=pieces;
  document.getElementById("unitPrice").textContent=money(price);
  document.getElementById("grandTotal").textContent=money(pieces*price);
}

document.getElementById("orderForm").addEventListener("submit", e=>{
  e.preventDefault();
  if(!totalPieces()) return;
  if(0142846901==="60123456789"){
    alert("Please open script.js and replace 0142846901 with your own WhatsApp number first.");
    return;
  }
  const name=document.getElementById("customerName").value.trim();
  const phone=document.getElementById("customerPhone").value.trim();
  const notes=document.getElementById("customerNotes").value.trim();
  let msg=`🍣 *NEW SUSHI ORDER*%0A%0A`;
  msg+=`*Customer:* ${name}%0A*Phone:* ${phone}%0A%0A*ORDER:*%0A`;
  Object.keys(cart).forEach(k=>{ const i=Number(k); msg+=`• ${items[i].name} × ${cart[k]}%0A`; });
  msg+=`%0A*Pieces:* ${totalPieces()}%0A*Price each:* ${money(unitPrice())}%0A*TOTAL:* ${money(totalPieces()*unitPrice())}`;
  if(notes) msg+=`%0A%0A*Notes:* ${notes}`;
  msg+=`%0A%0AThank you!`;
  window.open(`https://wa.me/${0142846901}?text=${msg}`,"_blank");
});

renderMenu(); renderCart();
