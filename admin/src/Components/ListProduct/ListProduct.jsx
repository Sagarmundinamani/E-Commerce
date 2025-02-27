import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {
  const [allproducts, setAllproducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInfo = async () => {
    try {
      const response = await fetch('http://localhost:4000/allproducts');
      if (!response.ok) {
        throw new Error("Failed to fetch products.");
      }
      const data = await response.json();

      if (Array.isArray(data)) {
        setAllproducts(data);
      } else {
        console.error("Invalid data format received:", data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <div className="list-product">
      <h1>All Products List</h1>
      {loading ? (
        <p>Loading products...</p>
      ) : allproducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <>
          <div className="listproduct-format-main">
            <p>Products</p>
            <p>Title</p>
            <p>Old Price</p>
            <p>New Price</p>
            <p>Category</p>
            <p>Remove</p>
          </div>
          <div className="listproduct-allproducts">
            <hr />
            {allproducts.map((product, index) => (
              <div key={index} className="listproduct-format-main">
                <img 
                  src={product.image || "https://via.placeholder.com/50"} 
                  className="list-product-icon" 
                  alt="Product" 
                />
                <p>{product.name || "N/A"}</p>
                <p>${product.old_price || "0.00"}</p>
                <p>${product.new_price || "0.00"}</p>
                <p>{product.category || "Uncategorized"}</p>
                <img className="listproduct-remove-icon" src={cross_icon} alt="Remove" />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ListProduct;
