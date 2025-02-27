import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: ""
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    if (!image) {
      alert("Please select an image.");
      return;
    }

    console.log("Adding product:", productDetails);

    try {
      let formData = new FormData();
      formData.append('product', image); // Ensure 'product' matches backend key

      // Upload Image
      const imageResponse = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: formData,
      });

      const imageData = await imageResponse.json();

      if (!imageData.success) {
        alert("Image upload failed.");
        return;
      }

      // Set uploaded image URL in product details
      const product = { ...productDetails, image: imageData.image_url };

      // Add Product
      const productResponse = await fetch('http://localhost:4000/addproduct', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      const productData = await productResponse.json();

      if (productData.success) {
        alert("Product Added Successfully!");
        // Reset form after successful submission
        setProductDetails({
          name: "",
          image: "",
          category: "women",
          new_price: "",
          old_price: ""
        });
        setImage(null);
      } else {
        alert("Failed to add product.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className='add-product'>
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input 
          value={productDetails.name} 
          onChange={changeHandler} 
          type="text" 
          name='name' 
          placeholder='Type here' 
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input 
            value={productDetails.old_price} 
            onChange={changeHandler} 
            type="text" 
            name='old_price' 
            placeholder='Type here' 
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input 
            value={productDetails.new_price} 
            onChange={changeHandler} 
            type="text" 
            name='new_price' 
            placeholder='Type here' 
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Product Category</p>
          <select 
            value={productDetails.category} 
            onChange={changeHandler} 
            name="category" 
            className='add-product-selector'
          >
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kid">Kid</option>
          </select>
        </div>
        <div className="addproduct-itemfield">
          <label htmlFor="file-input">
            <img 
              src={image ? URL.createObjectURL(image) : upload_area} 
              className='addproduct-thumbnail' 
              alt="Upload Area" 
            />
          </label>
          <input 
            onChange={imageHandler} 
            type="file" 
            name='image' 
            id='file-input' 
            hidden 
          />   
        </div>
        <button onClick={Add_Product} className='addproduct-btn'>ADD</button>
      </div>
    </div>
  );
};

export default AddProduct;
