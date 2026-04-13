import React, {useEffect, useRef, useState} from 'react';
import ProfileNavigation from "./ProfileNavigation";
import '../../css/customer-profile/customer-profile.css'
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Password} from "primereact/password";
import {InputMask} from "primereact/inputmask";
import UserService from "../../service/UserService.";
import {useHistory, useLocation} from "react-router-dom";
import {Calendar} from "primereact/calendar";
import {Toast} from "primereact/toast";
import {PROFILE_SECTIONS} from "./ProfileNavigation";

const MyUserInfo = () => {
    const DISABLE_INPUT_TOOLTIP_MESSAGE = "Bu Alanlar Kullanıcı Tarafından Güncellenemez. Lütfen Müşteri Hizmetleri İle İrtibata Geçiniz.";
    const history = useHistory();
    const location = useLocation();

    const toastCenter = useRef(null);

    // const [user, setUser] = useState({});
    const [userId, setUserId] = useState("");
    const [fullName, setFullName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [birthDate, setBirthDate] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [againNewPassword, setAgainNewPassword] = useState("");
    const [updateBtnDisabled, setUpdateBtnDisabled] = useState(true);
    const [passUpdateBtnDisabled, setPassUpdateBtnDisabled] = useState(true);
    const [activeSection, setActiveSection] = useState('user-info');

    useEffect(() => {
        const storedUserStr = localStorage.getItem("user");
        const user = storedUserStr ? JSON.parse(storedUserStr) : null;

        if (user) {
            setUserId(user.pkId || user.id || "")
            setPhoneNumber(user.gsm_no || "")
            setBirthDate(user.dob ? new Date(user.dob) : null)
            setFirstName(user.name || "")
            setEmail(user.email || "")
            setLastName(user.surname || "")
            setFullName(`${user.name || ''} ${user.surname || ''}`.trim())
        } else {
            localStorage.removeItem("token");
            history.push("/login");
            window.location.reload()

            const detailMessage = "Sistemsel bir hata sebebi ile şuan için bilgilerinize erişemiyoruz. Lütfen daha sonra tekrar deneyiniz."
            showMessage("Kullanıcı Bilgisine Erişilemedi.", detailMessage, toastCenter, 'warn')
        }
    }, [history]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const requestedSection = params.get('section');
        const availableSections = PROFILE_SECTIONS.flatMap((group) => group.items.map((item) => item.key));

        if (requestedSection && availableSections.includes(requestedSection)) {
            setActiveSection(requestedSection);
            return;
        }

        setActiveSection('user-info');
    }, [location.search]);

    const showMessage = (labelText, detailText, ref, severity) => {
        ref.current.show({severity: severity, summary: labelText, detail: detailText, life: 3000});
    };

    const clickUserInformationUpdateBtn = () => {
        const user =
            {
                pkId: userId,
                gsm_no: phoneNumber,
                dob: birthDate,
                name:firstName,
                email:email,
                surname: lastName
            };
        
        UserService.updateUser(user).then((response) => {
            if (response) {
                // setPhoneNumber(response.gsm_no)
                // setBirthDate(new Date(response.bod))
                localStorage.setItem("user", JSON.stringify(user));
                window.location.reload()
            }
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem("token");
                history.push("/login");
            } else {
                const detailMessage = "Sistemsel bir hata sebebi ile şuan için bilgilerinize erişemiyoruz. Lütfen daha sonra tekrar deneyiniz."
                showMessage("Kullanıcı Bilgisine Erişilemedi.", detailMessage, toastCenter, 'warn')
            }
        })
    }

    const sectionMeta = {
        'user-info': {title: 'Hesabım Bilgileri', subtitle: 'Üyelik bilgilerinizi ve şifrenizi buradan yönetebilirsiniz.'},
        'address': {title: 'Adres Bilgilerim', subtitle: 'Kayıtlı teslimat ve fatura adreslerinizi düzenleyin.'},
        'saved-cards': {title: 'Kayıtlı Kartlarım', subtitle: 'Ödemelerde kullanmak için kartlarınızı güvenle saklayın.'},
        'orders': {title: 'Tüm Siparişlerim', subtitle: 'Geçmiş siparişlerinizin durumlarını buradan takip edin.'},
        'seller-messages': {title: 'Satıcı Mesajları', subtitle: 'Satıcılarla yaptığınız yazışmaları görüntüleyin.'},
        'reviews': {title: 'Değerlendirmelerim', subtitle: 'Ürün değerlendirme ve yorum geçmişinizi yönetin.'},
        'buy-again': {title: 'Yeniden Satın Al', subtitle: 'Sık aldığınız ürünleri hızlıca tekrar sepete ekleyin.'},
        'coupons': {title: 'İndirim Kuponlarım', subtitle: 'Size tanımlı kupon ve kampanya haklarınızı görüntüleyin.'},
        'history': {title: 'Önceden Gezdiklerim', subtitle: 'Yakın zamanda ziyaret ettiğiniz ürünleri tekrar inceleyin.'},
        'followed-stores': {title: 'Takip Ettiğim Mağazalar', subtitle: 'Takip ettiğiniz mağaza güncellemelerini buradan görün.'}
    };

    const renderPlaceholderSection = () => {
        const info = sectionMeta[activeSection] || sectionMeta['user-info'];

        return (
            <div className="process-row">
                <div className="process-header-item">{info.title}</div>
                <div className="profile-placeholder-panel">
                    <p>{info.subtitle}</p>
                    <div className="profile-placeholder-grid">
                        <div className="profile-placeholder-card">
                            <h4>Demo Bileşen</h4>
                            <span>Bu alan ilgili modül için örnek içerik panelidir.</span>
                        </div>
                        <div className="profile-placeholder-card">
                            <h4>Hızlı İşlem</h4>
                            <span>Filtreleme, arama, aksiyon butonları bu panelde yer alacak.</span>
                        </div>
                        <div className="profile-placeholder-card">
                            <h4>Durum Kutusu</h4>
                            <span>Aktif kayıtlar, istatistikler ve özet bilgiler burada gösterilecek.</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderUserInfoSection = () => {
        return (
            <>
                <div className="process-row">
                    <div className="process-header-item">
                        Hesabım Bilgileri
                    </div>
                </div>
                <div className="process-row">
                    <div className="process-user-form-layer">
                        <div className="user-detail">
                            <div className="user-detail-header">
                                <label>Üyelik Bilgilerim</label>
                                <hr/>
                            </div>
                            <div className="user-detail-body">
                                <div className="detail-row-1">
                                    <div className="user-detail-item">
                                        <div className="header-item">Ad</div>
                                        <InputText
                                            tooltip={DISABLE_INPUT_TOOLTIP_MESSAGE}
                                            tooltipOptions={{position: 'top'}}
                                            value={firstName}
                                            disabled={true}
                                            onChange={(e) => {
                                                setFirstName(e.target.value)
                                            }}

                                        />
                                    </div>
                                    <div className="user-detail-item">
                                        <div className="header-item">Soyad</div>
                                        <InputText
                                            value={lastName}
                                            disabled={true}
                                            onChange={(e) => {
                                                setLastName(e.target.value)
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="detail-row-2">
                                    <div className="user-detail-item">
                                        <div className="header-item">E-Mail</div>
                                        <InputText
                                            disabled={true}
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className="user-detail-item">
                                        <div className="header-item">Cep Telefonu</div>
                                        <InputMask
                                            mask="0(999)-999-99-99"
                                            placeholder="(___)-___-__-__"
                                            keyfilter="int"
                                            value={phoneNumber}
                                            onClick={(e) => {
                                                setPhoneNumber("")
                                            }}
                                            onChange={(e) => {
                                                setPhoneNumber(e.target.value)
                                                setUpdateBtnDisabled(false)
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="detail-row-3">
                                    <div className="user-detail-item">
                                        <div className="header-item">Doğum Tarihi</div>
                                        <div>
                                            <Calendar
                                                dateFormat={"dd.mm.yy"}
                                                id="buttondisplay"
                                                value={birthDate}
                                                onChange={(e) => {
                                                    setBirthDate(e.value)
                                                    setUpdateBtnDisabled(false)
                                                }}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="detail-row-4">
                                    <div className="user-detail-item">
                                        <div className="user-detail-button">
                                            <Button
                                                onClick={clickUserInformationUpdateBtn}
                                                label={"Güncelle"}
                                                disabled={updateBtnDisabled}
                                                size="large"
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="divider"></div>

                        <div className="password-change">
                            <div className="password-header">
                                <label>Şifre Güncelleme</label>
                                <hr/>
                            </div>
                            <div className="password-change-body">
                                <div className="password-row-1">
                                    <div className="password-item">
                                        <div className="header-item">Mevcut Şifre</div>
                                        <Password
                                            feedback={false}
                                            value={currentPassword}
                                            toggleMask
                                            style={{width: '100%', fontSize: '1px', marginRight: "0rem"}}
                                            onChange={(e) => {
                                                setCurrentPassword(e.target.value)
                                                setPassUpdateBtnDisabled(false)
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="password-row-2">
                                    <div className="password-item">
                                        <div className="header-item">Yeni Şifre</div>
                                        <Password
                                            value={newPassword}
                                            toggleMask
                                            style={{width: '100%', fontSize: '1px', marginRight: "0rem"}}
                                            onChange={(e) => {
                                                setNewPassword(e.target.value)
                                                setPassUpdateBtnDisabled(false)
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="password-row-3">
                                    <div className="password-item">
                                        <div className="header-item">Yeni Şifre Tekrar</div>
                                        <Password
                                            feedback={false}
                                            value={againNewPassword}
                                            toggleMask
                                            style={{width: '100%', fontSize: '1px', marginRight: "0rem"}}
                                            onChange={(e) => {
                                                setAgainNewPassword(e.target.value)
                                                setPassUpdateBtnDisabled(false)
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="password-row-4">
                                    <div className="password-item">
                                        <div className="user-detail-button">
                                            <Button
                                                label={"Güncelle"}
                                                disabled={passUpdateBtnDisabled}
                                                size="large"
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const onChangeSection = (sectionKey) => {
        setActiveSection(sectionKey);
        history.replace(`${location.pathname}?section=${sectionKey}`);
    };

    return (

        <div className="catalog">
            <div className="container-items">
                <div className="my-account-page">
                    <Toast ref={toastCenter} position="center"/>

                    <ProfileNavigation
                        userFullName={fullName}
                        activeSection={activeSection}
                        onChangeSection={onChangeSection}
                    />

                    <div className="process-column">
                        {activeSection === 'user-info' ? renderUserInfoSection() : renderPlaceholderSection()}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MyUserInfo;
