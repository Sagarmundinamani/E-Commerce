import React, { useContext } from "react";
import { useParams } from 'react-router-dom';
import { ShopContext } from "../Context/ShopContext";
import Breadcrum from "../components/Breadcrums/Breadcrum";
import ProductDisplay from "../components/ProductDisplay/ProductDisplay";
import DescriptionBox from "../components/DescriptionBox/DescriptionBox";
import RelatedProducts from "../components/RelatedProducts/RelatedProducts";

const Product = () => {
    const { all_products } = useContext(ShopContext);
    const { productId } = useParams();

    // Ensure all_products is loaded before trying to find a product
    if (!all_products) {
        return <p>Loading...</p>; // Prevents rendering errors
    }

    const product = all_products.find((item) => item.id === Number(productId));

    return (
      <div>
         {product ? (
           <>
             <Breadcrum product={product} />
             <ProductDisplay product={product} />
             <DescriptionBox/>
             <RelatedProducts/>
           </>
         ) : (
           <p>Product not found</p>
         )}
      </div>
    );
};

export default Product;
