import React, {useState} from 'react';
import {Rating} from 'primereact/rating';

export const ProductCard = ({product: product}) => {

    const style = (x) => {
        return (
            {
                background: 'url("' + x + '") no-repeat',
                backgroundSize: 'cover',
            }
        )
    }

    return (
        <div key={product.id} className="product-card">
            <a href={"/detail/"+product.id}>
                <div className="product-img" style={style(product.img)}/>
                <div className="product-card-title">
                    <span style={{marginRight:'8px',fontWeight:'bold',color:'#9c54e1',fontSize:'15px'}}>{product.mark}</span>
                    <span>{product.title}</span>
                </div>

                <div className="product-rating">
                    <Rating value={product.rating} readOnly cancel={false}/>
                </div>

                <div className="product-price">
                    <span>{product.price}</span>
                </div>
            </a>
        </div>
    )
}

