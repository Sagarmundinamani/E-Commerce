import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";

const Cart = () => {
    const { cartItems, all_products } = useContext(ShopContext);

    return (
        <div>
            <h2>Shopping Cart</h2>
            {Object.keys(cartItems).map(itemId => {
                const product = all_products.find(product => product.id === parseInt(itemId));
                if (!product) return null;

                return (
                    <div key={itemId}>
                        <h3>{product.name}</h3>
                        <p>Quantity: {cartItems[itemId]}</p>
                    </div>
                );
            })}
        </div>
    );
}

export default Cart;
