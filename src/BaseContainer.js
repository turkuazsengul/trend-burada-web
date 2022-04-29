import React, {useRef, useState, useEffect} from 'react';
import {Carousel} from 'primereact/carousel';
import {CampaignItems} from "./components/home-page-components/CampaignItems";
import AppContext from "./AppContext";

export const BaseContainer = ({components:components}) => {

    const [campaignVisibility, setCampaignVisibility] = useState("visibility");

    useEffect(() => {
        // setCampaignVisibility("visibility")
        // setCampaignData(campaignDataExp);
    }, []);

    const responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '600px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '480px',
            numVisible: 1,
            numScroll: 1
        }
    ];
    const data = [
        {
            "id": "1000",
            "code": "f230fh0g3",
            "name": "Bamboo Watch",
            "description": "Product Description",
            "image": "bamboo-watch.jpg",
            "price": 65,
            "category": "Accessories",
            "quantity": 24,
            "inventoryStatus": "INSTOCK",
            "rating": 5
        },
        {
            "id": "1001",
            "code": "nvklal433",
            "name": "Black Watch",
            "description": "Product Description",
            "image": "black-watch.jpg",
            "price": 72,
            "category": "Accessories",
            "quantity": 61,
            "inventoryStatus": "INSTOCK",
            "rating": 4
        },
    ]

    return (
        <div className="container-items">
            <div className="container">
                {components}
            </div>
        </div>
    )
}
