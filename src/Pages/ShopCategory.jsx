import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import './CSS/ShopCategory.css';
import dropdown_icon from '../components/Assets/dropdown_icon.png';
import { ShopContext } from '../Context/ShopContext';
import Item from '../components/Item/Item';

const ShopCategory = (props) => {
    const { category } = useParams(); 
    const { all_products } = useContext(ShopContext);

    
    const selectedCategory = props.category || category;


    const filteredProducts = all_products.filter(item => item.category === selectedCategory);

    return (
      <div className='shop-category'>
        <img className='shopcategory-banner' src={props.banner} alt=""/>
        <div className="shopcategory-indexSort">
          <p>
            <span>Showing {filteredProducts.length}</span> products
          </p>
          <div className="shopcategory-sort">
            Sort by <img src={dropdown_icon} alt="Sort dropdown"/>
          </div>
        </div>
        <div className="shopcategory-products">
          {filteredProducts.map((item) => (
            <Item 
              key={item.id} 
              id={item.id} 
              name={item.name} 
              image={item.image} 
              new_price={item.new_price} 
              old_price={item.old_price} 
            />
          ))}
        </div>
        {filteredProducts.length === 0 && <p className="no-products">No products found in this category.</p>}
        <div className="shopcategory-loadmore">
          Explore more
        </div>
      </div>
    );
}

export default ShopCategory;
