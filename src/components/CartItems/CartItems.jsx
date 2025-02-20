import React, { useContext } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";

const CartItems = () => {
  const { getTotalCartAmount,all_products, cartItems, removeFromCart } = useContext(ShopContext);

  const subtotal = Object.keys(cartItems).reduce((acc, itemId) => {
    const product = all_products.find(product => product.id === parseInt(itemId));
    if (product) {
      acc += product.new_price * cartItems[itemId];
    }
    return acc;
  }, 0);

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

      {all_products.map((e) => {
        if (cartItems[e.id] > 0) {
          return (
            <div key={e.id}>
              <div className="cartitems-format">
                <img src={e.image} alt={e.name} className="carticon-product-icon" />
                <p>{e.name}</p>
                <p>${e.new_price}</p>
                <button className="cartitems-quantity">{cartItems[e.id]}</button>
                <p>${e.new_price * cartItems[e.id]}</p>
                <img
                  src={remove_icon}
                  onClick={() => removeFromCart(e.id)}
                  alt="Remove"
                  className="remove-icon"
                />
              </div>
              <hr />
            </div>
          );
        }
        return null; 
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
            <h1>Cart Totals</h1>
            <div>
                <div className="cartitems-total-item">
                   <p>Subtotal</p>
                   <p>${getTotalCartAmount()}</p>
                    
                 </div>
                 <hr/>
                 <div className="cartitems-total-item">
                    <p>Shipping fee</p>
                    <p>Free</p>
                 </div>
            </div>
            <hr/>
            <div className="cartitems-total-item">
                <h3>Total</h3>
                <h3>${getTotalCartAmount()}</h3>
            </div>
        </div>
        <button>PROCEED TO CHECKOUT</button>
      </div>
      <div className="cartitems-promocode">
        <p>If you have a promo code, enter it here:</p>
        <div className="cartitems-prombox">
            <input type="text" placeholder='Promo code'/></div>
            <button>Submit</button>
        </div>
      </div>
  );
};

export default CartItems;
