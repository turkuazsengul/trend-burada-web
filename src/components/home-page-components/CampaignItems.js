import React, {useState, useEffect} from 'react';

export const CampaignItems = () => {
    const [campaignData, setCampaignData] = useState([]);

    useEffect(() => {
        setCampaignData(campaignDataExp);
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
            id: 1,
            value: "https://cdn.dsmcdn.com/ty386/campaign/banners/original/594571/305971c6c1_1.jpg",
            description: "Yaz Sezonu Yenilikleri"
        },
        {
            id: 1,
            value: "https://cdn.dsmcdn.com/ty403/campaign/banners/original/594568/ef34f6a343_1.jpg",
            description: "Baharda Bahçenizin Kurun"
        },
        {
            id: 1,
            value: "https://cdn.dsmcdn.com/ty395/pimWidgetApi/mobile_20220411102014_908706KadinMobile202204111301.jpg",
            description: "Baharda Bahçenizin Kurun"
        },
        {
            id: 1,
            value: "https://cdn.dsmcdn.com/ty403/pimWidgetApi/mobile_20220419045626_ipekyolmobilanneler.jpg",
            description: "Baharda Bahçenizin Kurun"
        },
        {
            id: 1,
            value: "https://cdn.dsmcdn.com/ty387/campaign/banners/original/594810/f28b3ce95a_1.jpg",
            description: "Trend Burada Collection - Yeni Sezon"
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

    const campaignItemList = campaignData.map((x) => {
        return (
            <div className="campaign-item">
                <a href="">
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

            <div className="campaign-slider">
                <div className="campaign-slider-item">

                </div>
            </div>
        </div>
    );
}
