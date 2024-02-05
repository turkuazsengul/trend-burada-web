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
            value: "https://cdn.dsmcdn.com/ty1157/pimWidgetApi/mobile_20240201202326_2522913EvYasamMobile202402011501.jpg",
            description: "Mudo Concept"
        },
        {
            id: 3,
            value: "https://cdn.dsmcdn.com/ty1158/pimWidgetApi/mobile_20240205071956_2524256ElektronikMobile202402021201.jpg",
            description: "Müziği Doyasıya Yaşa "
        },
        {
            id: 4,
            value: "https://cdn.dsmcdn.com/ty1137/pimWidgetApi/mobile_20240118070002_mobile20240108065243mobile2023.jpg",
            description: "Gs Store"
        },
        {
            id: 5,
            value: "https://cdn.dsmcdn.com/ty1143/pimWidgetApi/mobile_20240124071226_2401147KadinMobile202401231802.jpg",
            description: "Sporda En Rahat O"
        },
        {
            id: 6,
            value: "https://cdn.dsmcdn.com/ty1138/pimWidgetApi/mobile_20240118065730_columbia.jpg",
            description: "Yaz Sezonu Yenilikleri"
        },
        {
            id: 7,
            value: "https://cdn.dsmcdn.com/ty1129/pimWidgetApi/mobile_20240111153218_2249025KadinMobile202401111801.jpg",
            description: "İç Giyim"
        },
        {
            id: 8,
            value: "https://cdn.dsmcdn.com/ty1155/pimWidgetApi/mobile_20240202153542_2527400ElektronikMobile202402021801.jpg",
            description: "Kahve Keyfi"
        },
        {
            id: 9,
            value: "https://cdn.dsmcdn.com/ty1111/pimWidgetApi/mobile_20231229092657_2397375ElektronikMobile202312.jpg",
            description: "Küçük Ev Aletleri"
        },
        {
            id: 10,
            value: "https://cdn.dsmcdn.com/ty1153/pimWidgetApi/mobile_20240131064937_SevginiziGosterenTakilar1.jpg",
            description: "Sevgililer Günü"
        },
        {
            id: 11,
            value: "https://cdn.dsmcdn.com/ty1120/pimWidgetApi/mobile_20240105130028_2414392ElektronikMobile202401041901.jpg",
            description: "Elektronik Alışverişi"
        },
        {
            id: 12,
            value: "https://cdn.dsmcdn.com/ty1082/pimWidgetApi/mobile_20231207122821_2357602SupermarketMobile202312071302.jpg",
            description: "Sevimli Dostlarımız"
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

    // const toolTipMenuStyle= {
    //     // visible:'hidden'
    //     visible:'hidden',
    //     width:'130rem',
    //     height:'20rem,',
    //     backgroundColor:'red',
    // }

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
