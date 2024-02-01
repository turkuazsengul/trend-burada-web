import React, {useState} from 'react';
import '../../css/customer-profile.css'
import {MY_ORDER_URL, MY_USER_INFO_URL} from "../../constants/UrlConstans";

const ProfileNavigation = ({user}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleHover = () => {
        setIsHovered(!isHovered);
    };

    const MyOrder = () => {
        return (
            <div className="navi-row">
                <label>Siparişlerim</label>
                <hr/>
                <a href={MY_ORDER_URL}>
                    <div className={`navi-item ${isHovered ? 'hovered' : ''}`} onMouseEnter={handleHover} onMouseLeave={handleHover}>
                        <i className="pi pi-box" style={{color: '#708090'}}></i>
                        <span>Tüm Siparişlerim</span>
                    </div>
                </a>

                <a href="#">
                    <div className={`navi-item ${isHovered ? 'hovered' : ''}`} onMouseEnter={handleHover} onMouseLeave={handleHover}>
                        <i className="pi pi-inbox" style={{color: '#708090'}}></i>
                        <span>Satıcı Mesajları</span>
                    </div>
                </a>

                <a href="#">
                    <div className={`navi-item ${isHovered ? 'hovered' : ''}`} onMouseEnter={handleHover} onMouseLeave={handleHover}>
                        <i className="pi pi-comment" style={{color: '#708090'}}></i>
                        <span>Değerlendirmelerim</span>
                    </div>
                </a>

                <a href="#">
                    <div className={`navi-item ${isHovered ? 'hovered' : ''}`} onMouseEnter={handleHover} onMouseLeave={handleHover}>
                        <i className="pi pi-shopping-cart" style={{color: '#708090'}}></i>
                        <span>Yeniden Satın Al</span>
                    </div>
                </a>

            </div>
        )
    }

    const SpecialForYou = () => {
        return (
            <div className="navi-row">
                <label>Sana Özel</label>
                <hr/>
                <a href="#">
                    <div className={`navi-item ${isHovered ? 'hovered' : ''}`} onMouseEnter={handleHover} onMouseLeave={handleHover}>
                        <i className="pi pi-tags" style={{color: '#708090'}}></i>
                        <span>İndirim Kuponlarım</span>
                    </div>
                </a>

                <a href="#">
                    <div className={`navi-item ${isHovered ? 'hovered' : ''}`} onMouseEnter={handleHover} onMouseLeave={handleHover}>
                        <i className="pi pi-clock" style={{color: '#708090'}}></i>
                        <span>Önceden Gezdiklerim</span>
                    </div>
                </a>

                <a href="#">
                    <div className={`navi-item ${isHovered ? 'hovered' : ''}`} onMouseEnter={handleHover} onMouseLeave={handleHover}>
                        <i className="pi pi-shopping-bag" style={{color: '#708090'}}></i>
                        <span>Takip Ettiğim Mağazalar</span>
                    </div>
                </a>
            </div>
        )
    }

    const MyUserInformation = () => {
        return (
            <div className="navi-row">
                <label>Kullanıcı Hesabım</label>
                <hr/>
                <a href={MY_USER_INFO_URL}>
                    <div className={`navi-item ${isHovered ? 'hovered' : ''}`} onMouseEnter={handleHover} onMouseLeave={handleHover}>
                        <i className="pi pi-user" style={{color: '#708090'}}></i>
                        <span>Kullanıcı Bilgilerim</span>
                    </div>
                </a>

                <a href="#">
                    <div className={`navi-item ${isHovered ? 'hovered' : ''}`} onMouseEnter={handleHover} onMouseLeave={handleHover}>
                        <i className="pi pi-map-marker" style={{color: '#708090'}}></i>
                        <span>Adres Bilgilerim</span>
                    </div>
                </a>

                <a href="#">
                    <div className={`navi-item ${isHovered ? 'hovered' : ''}`} onMouseEnter={handleHover} onMouseLeave={handleHover}>
                        <i className="pi pi-credit-card" style={{color: '#708090'}}></i>
                        <span>Kayıtlı Kartlarım</span>
                    </div>
                </a>
            </div>
        )
    }

    return (
        <div className="navigation-column">
            <div className="navi-row">
                <label>{user.name}</label>
            </div>
            <MyOrder/>
            <SpecialForYou/>
            <MyUserInformation/>
        </div>
    )
}

export default ProfileNavigation;

