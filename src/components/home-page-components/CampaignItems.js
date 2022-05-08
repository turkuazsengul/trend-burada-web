import React, {useState, useEffect} from 'react';

export const CampaignItems = () => {
    const [campaignData, setCampaignData] = useState([]);

    useEffect(() => {
        // setCampaignData(campaignDataExp);
        /*
        ** Bu alanda datalar servislerden alınacaktır.
         */
    }, []);

    const campaignDataExp = [
        {
            id: 1,
            value: "https://cdn.dsmcdn.com/ty403/campaign/banners/original/603949/e03b7e086a_1.jpg",
            description: "Baharda Bahçenizin Kurun"
        },
        {
            id: 2,
            value: "https://cdn.dsmcdn.com/ty386/campaign/banners/original/594571/305971c6c1_1.jpg",
            description: "Yaz Sezonu Yenilikleri"
        },
        {
            id: 3,
            value: "https://cdn.dsmcdn.com/ty419/pimWidgetApi/mobile_20220506084614_mobile20220505093405mobile20220429135703stwidgetmobile.jpg",
            description: "Baharda Bahçenizin Kurun"
        },
        {
            id: 4,
            value: "https://cdn.dsmcdn.com/ty412/campaign/banners/original/594810/c1f40349a5_0.jpg",
            description: "Baharda Bahçenizin Kurun"
        },
        {
            id: 5,
            value: "https://cdn.dsmcdn.com/ty403/campaign/banners/original/603949/e03b7e086a_1.jpg",
            description: "Baharda Bahçenizin Kurun"
        },
        {
            id: 6,
            value: "https://cdn.dsmcdn.com/ty386/campaign/banners/original/594571/305971c6c1_1.jpg",
            description: "Yaz Sezonu Yenilikleri"
        },
        {
            id: 7,
            value: "https://cdn.dsmcdn.com/ty419/pimWidgetApi/mobile_20220506084614_mobile20220505093405mobile20220429135703stwidgetmobile.jpg",
            description: "Baharda Bahçenizin Kurun"
        },
        {
            id: 8,
            value: "https://cdn.dsmcdn.com/ty412/campaign/banners/original/594810/c1f40349a5_0.jpg",
            description: "Baharda Bahçenizin Kurun"
        },
        {
            id: 9,
            value: "https://cdn.dsmcdn.com/ty403/campaign/banners/original/603949/e03b7e086a_1.jpg",
            description: "Baharda Bahçenizin Kurun"
        },
        {
            id: 10,
            value: "https://cdn.dsmcdn.com/ty386/campaign/banners/original/594571/305971c6c1_1.jpg",
            description: "Yaz Sezonu Yenilikleri"
        },
        {
            id: 11,
            value: "https://cdn.dsmcdn.com/ty419/pimWidgetApi/mobile_20220506084614_mobile20220505093405mobile20220429135703stwidgetmobile.jpg",
            description: "Baharda Bahçenizin Kurun"
        },
        {
            id: 12,
            value: "https://cdn.dsmcdn.com/ty412/campaign/banners/original/594810/c1f40349a5_0.jpg",
            description: "Baharda Bahçenizin Kurun"
        },
    ]

    const style = (x) => {
        return(
            {
                background: 'url("'+x+'") no-repeat',
                backgroundSize: 'cover',
            }
        )
    }

    const campaignItemList = campaignDataExp.map((x) => {
        return (
            <div key={x.id} className="campaign-item">
                <a href="/product">
                    <span>
                        <div className="campaign-item-img" style={style(x.value)}/>
                    </span>
                    <summary>
                        <span>{x.description}</span>
                    </summary>
                </a>
            </div>
        )
    })


    return (
        <div className="catalog">
            <div className="campaign-list">
                <div className="campaign-list-item">
                    {campaignItemList}
                </div>
            </div>

            {/*<div className="campaign-slider">*/}
            {/*    <div className="campaign-slider-item">*/}

            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
}
