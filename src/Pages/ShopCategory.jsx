import React, { useContext, useEffect } from "react";
import './css/ShopCategory.css';
import dropdown_icon from '../components/Assets/dropdown_icon.png';
import { ShopContext } from '../Context/ShopContext';
import Item from '../components/Item/Item';

const ShopCategory = (props) => {
    const { all_product } = useContext(ShopContext);

    useEffect(() => {
        console.log("All Products:", all_product);
        console.log("Current Category:", props.category);
    }, [all_product, props.category]);

    return (
      <div className='shop-category'>
        <img className='shopcategory-banner' src={props.banner} alt=""/>
        <div className="shopcategory-indexSort">
          <p>
            <span>Showing 1-12</span> out of 36 products
          </p>
          <div className="shopcategory-sort">
            sort by <img src={dropdown_icon} alt=""/>
          </div>
        </div>
        <div className="shopcategory-products">
          {all_product && all_product.map((item, i) => {
            console.log(`Checking item: ${item.name}, Category: ${item.category}`);
            if (props.category.trim().toLowerCase() === item.category.trim().toLowerCase()) {
              return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />;
            } else {
              return null;
            }
          })}
        </div>
      </div>
    );
}

export default ShopCategory;
