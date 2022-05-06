import React, {useState, useEffect} from 'react';

import appstoreicon from './icons/app-store-icon.svg'

export const AppFooter = () => {
    const [footerBodyData, setFooterBodyData] = useState([]);
    const [test, setTest] = useState([]);

    useEffect(() => {
        setFooterBodyData(footerBodyDataExp)
        setTest(footerBodyItems)
    }, []);

    const footerBodyDataExp = [
        {
            id: 0,
            header: "Trend Burada",
            items: [
                {
                    id: 0,
                    value: "Biz Kimiz"
                },
                {
                    id: 1,
                    value: "İletişim"
                },
                {
                    id: 2,
                    value: "Kurumsal Hediye Çeki"
                },
            ]
        },
        {
            id: 1,
            header: "Hakkımızda",
            items: [
                {
                    id: 0,
                    value: "Biz Kimiz"
                },
                {
                    id: 1,
                    value: "İletişim"
                },
                {
                    id: 2,
                    value: "Kariyer"
                },
            ]
        },
        {
            id: 2,
            header: "Kampanyalar",
            items: [
                {
                    id: 0,
                    value: "Aktif Kampanyalar"
                },
                {
                    id: 1,
                    value: "Üyelik"
                },
                {
                    id: 2,
                    value: "Hediye Fikirleri"
                },
                {
                    id: 3,
                    value: "Trend Burada Fırsatları"
                },
            ]
        },
        {
            id: 3,
            header: "Yardım",
            items: [
                {
                    id: 0,
                    value: "Sukça Sorulan Sorular"
                },
                {
                    id: 1,
                    value: "Canlı Yardım"
                },
                {
                    id: 2,
                    value: "Nasıl İade Ederim"
                },
                {
                    id: 3,
                    value: "İşlem Rehberi"
                },
            ]
        },
    ]

    const footerBodyHeaderItems = footerBodyData.map((x) => {
            return (
                <div className="footer-body-header-items">
                    <span> <a href="">{x.header}</a> </span>
                    {x.items.map((y) => {
                        return (
                            <a href="">{y.value}</a>
                        )
                    })}
                </div>
            )
        }
    )

    const footerBodyItems = footerBodyData.map((x) => {
            return (
                <a href="">{x.items.value}</a>
            )
        }
    )

    return (
        <div className="footer">
            <div className="footer-body">
                <div className="footer-body-header">
                    {footerBodyHeaderItems}
                </div>

                <div className="footer-body-content">
                    <div className="footer-body-content-items">
                        <span><a href="">Güvenli Alışveriş</a></span>
                        <div className="pay-method-icon">
                            <div className="troy-img"/>
                            <div className="master-card-img"/>
                            <div className="visa-img"/>
                            <div className="amex-img"/>
                        </div>
                    </div>

                    <div className="footer-body-content-items">
                        <span><a href="">Mobil Uygulamalar</a></span>
                        <a href="https://www.apple.com/tr/app-store/"><img src={appstoreicon} alt=""/></a>
                    </div>

                    <div className="footer-body-content-items">
                        <span><a href="">Sosyal Medya</a></span>
                        <div className="mobil-app-icon">
                            <a className="pi pi-facebook" href="https://tr-tr.facebook.com"/>
                            <a className="pi pi-twitter" href="https://twitter.com"/>
                            <a className="pi pi-youtube" href="https://www.youtube.com"/>
                            <a className="pi pi-instagram" href="https://www.instagram.com/"/>
                        </div>

                    </div>
                </div>

                <div className="footer-body-bottom">
                    <span className="font-medium ml-2">© {(new Date().getFullYear())} Trend Burada</span>
                </div>
            </div>
        </div>
    );
}
