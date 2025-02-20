import React,{useContext} from "react";
import './ProductDisplay.css'
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/ShopContext";

const ProductDisplay = (props) => {
      const{product} = props;
      const{addToCart} = useContext(ShopContext);
    return (
      <div classname='productdisplay'>
        <div classname="productdisplay-left">
           <div classname="productdisplay-img-list">
             <img src={product.image} alt="" />
             <img src={product.image} alt="" />
             <img src={product.image} alt="" />
             <img src={product.image} alt="" />
           </div>
           <div classname="productdisplay-img">
             <img classname="productdisplay-main-img" src={product.image} alt="" />
           </div>
        </div>
        <div classname="productdisplay-right">
           <h1>{product.name}</h1>
           <div classname="productdisplay-right-star">
             <img src={star_icon} alt="" />
             <img src={star_icon}  alt="" />
             <img src={star_icon}  alt="" />
             <img src={star_icon}  alt="" />
             <img src={star_dull_icon}  alt="" />
             <p> (122) </p>
           </div>
           <div classname="productdisplay-right-prices">
            <div classname="productdisplay-right-price-old">${product.old_price}</div>
            <div classname="productdisplay-right-price-new">${product.new_price}</div>
            </div>
            <div classname="productdisplay-right-description">
                A lightweight, usually knitted,pullover product
            </div>
            <div classname="productdisplay-right-size">
                <h1> Select Size</h1>
                <div classname="productdisplay-right-size">
                    <div>S</div>
                    <div>M</div>
                    <div>L</div>
                    <div>XL</div>
                    <div>XXL</div>
                </div>
            </div>
            <button onClick={()=>{addToCart(product.id)}}>Add to cart</button>
            <p className='productdisplay-right-category'><span>Category:</span>Women,T-Shirt,Crop Top</p>
            <p className='productdisplay-right-category'><span>Tags:</span>Mopdern,Latest</p>
           </div>
        </div>
    )
};

export default ProductDisplay
