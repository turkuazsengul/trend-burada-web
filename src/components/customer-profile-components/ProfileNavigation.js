import React from 'react';
import '../../css/customer-profile/customer-profile.css'

export const PROFILE_SECTIONS = [
    {
        group: 'Kullanıcı Hesabım',
        items: [
            {key: 'user-info', icon: 'pi pi-user', label: 'Kullanıcı Bilgilerim'},
            {key: 'address', icon: 'pi pi-map-marker', label: 'Adres Bilgilerim'},
            {key: 'saved-cards', icon: 'pi pi-credit-card', label: 'Kayıtlı Kartlarım'}
        ]
    },
    {
        group: 'Siparişlerim',
        items: [
            {key: 'orders', icon: 'pi pi-box', label: 'Tüm Siparişlerim'},
            {key: 'seller-messages', icon: 'pi pi-envelope', label: 'Satıcı Mesajları'},
            {key: 'reviews', icon: 'pi pi-comment', label: 'Değerlendirmelerim'},
            {key: 'buy-again', icon: 'pi pi-shopping-cart', label: 'Yeniden Satın Al'}
        ]
    },
    {
        group: 'Sana Özel',
        items: [
            {key: 'coupons', icon: 'pi pi-tags', label: 'İndirim Kuponlarım'},
            {key: 'history', icon: 'pi pi-clock', label: 'Önceden Gezdiklerim'},
            {key: 'followed-stores', icon: 'pi pi-shopping-bag', label: 'Takip Ettiğim Mağazalar'}
        ]
    }
];

const ProfileNavigation = ({userFullName, activeSection, onChangeSection}) => {
    return (
        <div className="navigation-column">
            <div className="navi-row">
                <label>{userFullName || 'Hesabım'}</label>
            </div>

            {PROFILE_SECTIONS.map((sectionGroup) => (
                <div key={sectionGroup.group} className="navi-row">
                    <label>{sectionGroup.group}</label>
                    <hr/>
                    {sectionGroup.items.map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            className={`navi-item navi-item-button ${activeSection === item.key ? 'is-active' : ''}`}
                            onClick={() => onChangeSection && onChangeSection(item.key)}
                        >
                            <i className={item.icon} style={{color: '#708090'}}/>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default ProfileNavigation;

