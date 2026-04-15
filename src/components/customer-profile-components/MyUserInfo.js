import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import ProfileNavigation, {buildProfileSections} from "./ProfileNavigation";
import '../../css/customer-profile/customer-profile.css'
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Password} from "primereact/password";
import {InputMask} from "primereact/inputmask";
import UserService from "../../service/UserService.";
import {useHistory, useLocation} from "react-router-dom";
import {Calendar} from "primereact/calendar";
import {Toast} from "primereact/toast";
import AppContext from "../../AppContext";
import {InputTextarea} from "primereact/inputtextarea";
import UserActivityService from "../../service/UserActivityService";

const MyUserInfo = () => {
    const {t = (key) => key} = useContext(AppContext) || {};
    const safeText = (key, fallback) => {
        const value = t(key);
        return value === key ? fallback : value;
    };
    const DISABLE_INPUT_TOOLTIP_MESSAGE = t('profile.readonlyTooltip');
    const history = useHistory();
    const location = useLocation();
    const profileSections = useMemo(() => buildProfileSections(t), [t]);

    const toastCenter = useRef(null);

    const [userId, setUserId] = useState("");
    const [fullName, setFullName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [email, setEmail] = useState("");
    const [birthDate, setBirthDate] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [againNewPassword, setAgainNewPassword] = useState("");
    const [updateBtnDisabled, setUpdateBtnDisabled] = useState(true);
    const [passUpdateBtnDisabled, setPassUpdateBtnDisabled] = useState(true);
    const [activeSection, setActiveSection] = useState('user-info');
    const [compactProfileNav, setCompactProfileNav] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
    const [accountSubTab, setAccountSubTab] = useState('membership');
    const [newPhoneNumber, setNewPhoneNumber] = useState("");
    const [phoneOtpModalOpen, setPhoneOtpModalOpen] = useState(false);
    const [phoneOtpCode, setPhoneOtpCode] = useState("");
    const [phoneOtpError, setPhoneOtpError] = useState("");
    const [contactPrefs, setContactPrefs] = useState({
        email: true,
        sms: false,
        push: false
    });
    const [addresses, setAddresses] = useState([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [orderHistory, setOrderHistory] = useState([]);
    const [viewedProducts, setViewedProducts] = useState([]);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [addressForm, setAddressForm] = useState({
        title: '',
        fullName: '',
        phone: '',
        city: '',
        district: '',
        fullAddress: '',
        type: 'home'
    });

    const showMessage = (labelText, detailText, ref, severity) => {
        ref.current.show({severity: severity, summary: labelText, detail: detailText, life: 3000});
    };

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
            setGender(user.gender || "")
            setFullName(`${user.name || ''} ${user.surname || ''}`.trim())
            setNewPhoneNumber(user.gsm_no || "")
        } else {
            localStorage.removeItem("token");
            history.push("/login");
            window.location.reload()

            showMessage(t('profile.noUserTitle'), t('profile.noUserDetail'), toastCenter, 'warn')
        }
    }, [history, t]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const requestedSection = params.get('section');
        const availableSections = profileSections.flatMap((group) => group.items.map((item) => item.key));

        if (requestedSection && availableSections.includes(requestedSection)) {
            setActiveSection(requestedSection);
            return;
        }

        setActiveSection('user-info');
    }, [location.search, profileSections]);

    useEffect(() => {
        const onResize = () => {
            setCompactProfileNav(window.innerWidth <= 768);
        };

        onResize();
        window.addEventListener('resize', onResize, {passive: true});
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const addressStorageKey = `tb_addresses_${userId || 'guest'}`;

    useEffect(() => {
        if (!userId) {
            return;
        }

        const stored = localStorage.getItem(addressStorageKey);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    const normalized = parsed.map((item) => {
                        if (item?.title === t('profile.homeAddressTitle') || item?.title === 'profile.homeAddressTitle') {
                            return {...item, title: ''};
                        }
                        return item;
                    });
                    setAddresses(normalized);
                    return;
                }
            } catch (e) {
                // ignore invalid localStorage data
            }
        }

        setAddresses([
            {
                id: `addr-${Date.now()}-1`,
                title: '',
                fullName: fullName || 'Kullanıcı',
                phone: phoneNumber || '0(5__) ___ __ __',
                city: 'İstanbul',
                district: 'Kadıköy',
                fullAddress: 'Moda Mah. Caferağa Sok. No:12 D:8',
                type: 'home',
                isDefault: true
            }
        ]);
    }, [addressStorageKey, userId, fullName, phoneNumber, t]);

    useEffect(() => {
        if (!userId) {
            return;
        }

        localStorage.setItem(addressStorageKey, JSON.stringify(addresses));
    }, [addresses, userId, addressStorageKey]);

    useEffect(() => {
        if (!userId) {
            return;
        }
        setOrderHistory(UserActivityService.getOrders());
        setViewedProducts(UserActivityService.getViewedProducts());
    }, [userId, activeSection]);

    const clickUserInformationUpdateBtn = () => {
        const user = {
            pkId: userId,
            gsm_no: phoneNumber,
            dob: birthDate,
            name: firstName,
            email: email,
            surname: lastName,
            gender: gender
        };

        UserService.updateUser(user).then((response) => {
            if (response) {
                localStorage.setItem("user", JSON.stringify(user));
                window.location.reload()
            }
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem("token");
                history.push("/login");
            } else {
                showMessage(t('profile.noUserTitle'), t('profile.noUserDetail'), toastCenter, 'warn')
            }
        })
    }

    const PHONE_OTP_DEMO_CODE = '428613';

    const handleSendPhoneOtp = () => {
        const digits = String(newPhoneNumber || '').replace(/\D/g, '');
        if (digits.length !== 11) {
            showMessage(
                safeText('profile.phoneInvalidTitle', 'Geçersiz Telefon'),
                safeText('profile.phoneInvalidDetail', 'Lütfen geçerli bir cep telefonu numarası girin.'),
                toastCenter,
                'warn'
            );
            return;
        }

        setPhoneOtpCode('');
        setPhoneOtpError('');
        setPhoneOtpModalOpen(true);
    };

    const handleApprovePhoneOtp = () => {
        if (phoneOtpCode !== PHONE_OTP_DEMO_CODE) {
            setPhoneOtpError(safeText('profile.phoneOtpInvalid', 'Doğrulama kodu hatalı. Demo kod: 428613'));
            return;
        }

        setPhoneNumber(newPhoneNumber);
        setUpdateBtnDisabled(false);
        setPhoneOtpModalOpen(false);
        setPhoneOtpError('');
        setPhoneOtpCode('');

        try {
            const storedUserStr = localStorage.getItem("user");
            const user = storedUserStr ? JSON.parse(storedUserStr) : null;
            if (user) {
                user.gsm_no = newPhoneNumber;
                localStorage.setItem("user", JSON.stringify(user));
            }
        } catch (e) {
            // no-op
        }

        showMessage(
            safeText('profile.phoneUpdatedTitle', 'Başarılı'),
            safeText('profile.phoneUpdatedDetail', 'Cep telefonu numaranız güncellendi.'),
            toastCenter,
            'success'
        );
    };

    const sectionMeta = {
        'user-info': {title: t('profile.accountInfoTitle'), subtitle: t('profile.accountInfoSubtitle')},
        'address': {title: t('profile.sectionTitleAddress'), subtitle: t('profile.sectionSubtitleAddress')},
        'saved-cards': {title: t('profile.sectionTitleCards'), subtitle: t('profile.sectionSubtitleCards')},
        'orders': {title: t('profile.sectionTitleOrders'), subtitle: t('profile.sectionSubtitleOrders')},
        'seller-messages': {title: t('profile.sectionTitleMessages'), subtitle: t('profile.sectionSubtitleMessages')},
        'reviews': {title: t('profile.sectionTitleReviews'), subtitle: t('profile.sectionSubtitleReviews')},
        'buy-again': {title: t('profile.sectionTitleBuyAgain'), subtitle: t('profile.sectionSubtitleBuyAgain')},
        'coupons': {title: t('profile.sectionTitleCoupons'), subtitle: t('profile.sectionSubtitleCoupons')},
        'history': {title: t('profile.sectionTitleHistory'), subtitle: t('profile.sectionSubtitleHistory')},
        'followed-stores': {title: t('profile.sectionTitleFollowed'), subtitle: t('profile.sectionSubtitleFollowed')}
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
                            <h4>{t('profile.demoComponent')}</h4>
                            <span>{t('profile.demoComponentText')}</span>
                        </div>
                        <div className="profile-placeholder-card">
                            <h4>{t('profile.quickAction')}</h4>
                            <span>{t('profile.quickActionText')}</span>
                        </div>
                        <div className="profile-placeholder-card">
                            <h4>{t('profile.statusBox')}</h4>
                            <span>{t('profile.statusBoxText')}</span>
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
                        {t('profile.accountInfoTitle')}
                    </div>
                </div>
                <div className="process-row user-info-layout user-info-shell">
                    <div className="user-info-tabs">
                        <button
                            type="button"
                            className={`user-info-tab ${accountSubTab === 'membership' ? 'is-active' : ''}`}
                            onClick={() => setAccountSubTab('membership')}
                        >
                            {safeText('profile.membershipInfo', 'Üyelik Bilgilerim')}
                        </button>
                        <button
                            type="button"
                            className={`user-info-tab ${accountSubTab === 'password' ? 'is-active' : ''}`}
                            onClick={() => setAccountSubTab('password')}
                        >
                            {safeText('profile.passwordUpdate', 'Şifre Değişikliği')}
                        </button>
                        <button
                            type="button"
                            className={`user-info-tab ${accountSubTab === 'contact' ? 'is-active' : ''}`}
                            onClick={() => setAccountSubTab('contact')}
                        >
                            {safeText('profile.contactPreferences', 'İletişim Tercihlerim')}
                        </button>
                    </div>

                    {accountSubTab === 'membership' ? (
                        <div className="user-detail">
                            <div className="user-detail-body">
                                <div className="detail-row-1">
                                    <div className="user-detail-item">
                                        <div className="header-item">{t('profile.name')}</div>
                                        <InputText
                                            tooltip={DISABLE_INPUT_TOOLTIP_MESSAGE}
                                            tooltipOptions={{position: 'top'}}
                                            value={firstName}
                                            disabled={true}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>
                                    <div className="user-detail-item">
                                        <div className="header-item">{t('profile.surname')}</div>
                                        <InputText
                                            value={lastName}
                                            disabled={true}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="detail-row-2">
                                    <div className="user-detail-item">
                                        <div className="header-item">{t('profile.email')}</div>
                                        <InputText
                                            disabled={true}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="user-detail-item">
                                        <div className="header-item">{safeText('profile.gender', 'Cinsiyet')}</div>
                                        <div className="gender-check-list">
                                            <label className="gender-check-item">
                                                <input
                                                    type="radio"
                                                    name="profile-gender"
                                                    checked={gender === 'female'}
                                                    onChange={() => {
                                                        setGender('female');
                                                        setUpdateBtnDisabled(false);
                                                    }}
                                                />
                                                <span>{safeText('profile.genderFemale', 'Kadın')}</span>
                                            </label>
                                            <label className="gender-check-item">
                                                <input
                                                    type="radio"
                                                    name="profile-gender"
                                                    checked={gender === 'male'}
                                                    onChange={() => {
                                                        setGender('male');
                                                        setUpdateBtnDisabled(false);
                                                    }}
                                                />
                                                <span>{safeText('profile.genderMale', 'Erkek')}</span>
                                            </label>
                                            <label className="gender-check-item">
                                                <input
                                                    type="radio"
                                                    name="profile-gender"
                                                    checked={gender === 'unspecified' || !gender}
                                                    onChange={() => {
                                                        setGender('unspecified');
                                                        setUpdateBtnDisabled(false);
                                                    }}
                                                />
                                                <span>{safeText('profile.genderUnspecified', 'Belirtmek İstemiyorum')}</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-row-3">
                                    <div className="user-detail-item">
                                        <div className="header-item">{t('profile.birthDate')}</div>
                                        <Calendar
                                            dateFormat={"dd.mm.yy"}
                                            id="buttondisplay"
                                            value={birthDate}
                                            placeholder={safeText('profile.birthDatePlaceholder', 'GG.AA.YYYY')}
                                            onChange={(e) => {
                                                setBirthDate(e.value)
                                                setUpdateBtnDisabled(false)
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="detail-row-4">
                                    <div className="user-detail-item">
                                        <div className="user-detail-button">
                                            <Button
                                                className="profile-action-btn"
                                                onClick={clickUserInformationUpdateBtn}
                                                label={t('profile.update')}
                                                disabled={updateBtnDisabled}
                                                size="large"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="user-subsection-divider"/>

                            <div className="contact-preference-box phone-update-box">
                                <h4>{safeText('profile.contactInfo', 'İletişim Bilgisi')}</h4>
                                <p>{safeText('profile.phoneTabInfo', 'Telefon numaranızı doğrulama kodu ile güvenli şekilde güncelleyebilirsiniz.')}</p>

                                <div className="phone-update-grid">
                                    <label className="phone-update-field">
                                        <span>{safeText('profile.phoneTab', 'Cep Telefonu')}</span>
                                        <InputMask
                                            mask="0(999)-999-99-99"
                                            placeholder="0(5__) ___ __ __"
                                            keyfilter="int"
                                            value={newPhoneNumber}
                                            onChange={(e) => setNewPhoneNumber(e.value)}
                                        />
                                    </label>
                                </div>

                                <div className="user-detail-button">
                                    <Button
                                        className="profile-action-btn"
                                        label={safeText('profile.sendPhoneOtp', 'SMS Kodu Gönder')}
                                        onClick={handleSendPhoneOtp}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {accountSubTab === 'password' ? (
                        <div className="password-change">
                            <div className="password-change-info">
                                {safeText('profile.passwordHintAccount', 'Şifreniz en az bir harf, rakam veya özel karakter içermeli ve en az 8 karakterden oluşmalıdır.')}
                            </div>
                            <div className="password-change-body">
                                <div className="password-row-1">
                                    <div className="password-item">
                                        <div className="header-item">{t('profile.currentPassword')}</div>
                                        <Password
                                            feedback={false}
                                            value={currentPassword}
                                            toggleMask
                                            className="account-password-input"
                                            onChange={(e) => {
                                                setCurrentPassword(e.target.value)
                                                setPassUpdateBtnDisabled(false)
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="password-row-2">
                                    <div className="password-item">
                                        <div className="header-item">{t('profile.newPassword')}</div>
                                        <Password
                                            value={newPassword}
                                            toggleMask
                                            className="account-password-input"
                                            onChange={(e) => {
                                                setNewPassword(e.target.value)
                                                setPassUpdateBtnDisabled(false)
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="password-row-3">
                                    <div className="password-item">
                                        <div className="header-item">{t('profile.repeatPassword')}</div>
                                        <Password
                                            feedback={false}
                                            value={againNewPassword}
                                            toggleMask
                                            className="account-password-input"
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
                                                className="profile-action-btn"
                                                label={t('profile.update')}
                                                disabled={passUpdateBtnDisabled}
                                                size="large"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {accountSubTab === 'contact' ? (
                        <div className="contact-preference-box">
                            <h4>{safeText('profile.contactPreferences', 'İletişim Tercihlerim')}</h4>
                            <p>{safeText('profile.contactPrefText', 'Kampanya, bildirim ve fırsat mesajları için tercihlerinizi buradan yönetebilirsiniz.')}</p>
                            <label className="contact-preference-item">
                                <input
                                    type="checkbox"
                                    checked={contactPrefs.email}
                                    onChange={(e) => setContactPrefs((prev) => ({...prev, email: e.target.checked}))}
                                />
                                <span>{safeText('profile.contactByEmail', 'E-posta ile bilgilendirme')}</span>
                            </label>
                            <label className="contact-preference-item">
                                <input
                                    type="checkbox"
                                    checked={contactPrefs.sms}
                                    onChange={(e) => setContactPrefs((prev) => ({...prev, sms: e.target.checked}))}
                                />
                                <span>{safeText('profile.contactBySms', 'SMS ile bilgilendirme')}</span>
                            </label>
                            <label className="contact-preference-item">
                                <input
                                    type="checkbox"
                                    checked={contactPrefs.push}
                                    onChange={(e) => setContactPrefs((prev) => ({...prev, push: e.target.checked}))}
                                />
                                <span>{safeText('profile.contactByPush', 'Uygulama bildirimi')}</span>
                            </label>
                            <div className="user-detail-button">
                                <Button
                                    className="profile-action-btn"
                                    label={t('profile.update')}
                                    onClick={() => showMessage('Bilgi', 'İletişim tercihleriniz demo olarak güncellendi.', toastCenter, 'info')}
                                />
                            </div>
                        </div>
                    ) : null}

                </div>
            </>
        );
    };

    const clearAddressForm = () => {
        setAddressForm({
            title: '',
            fullName: '',
            phone: '',
            city: '',
            district: '',
            fullAddress: '',
            type: 'home'
        });
        setEditingAddressId(null);
        setShowAddressForm(false);
    };

    const handleOpenNewAddressForm = () => {
        setEditingAddressId(null);
        setAddressForm({
            title: '',
            fullName: fullName || '',
            phone: phoneNumber || '',
            city: '',
            district: '',
            fullAddress: '',
            type: 'home'
        });
        setShowAddressForm(true);
    };

    const handleEditAddress = (address) => {
        setEditingAddressId(address.id);
        setAddressForm({
            title: address.title || '',
            fullName: address.fullName || '',
            phone: address.phone || '',
            city: address.city || '',
            district: address.district || '',
            fullAddress: address.fullAddress || '',
            type: address.type || 'home'
        });
        setShowAddressForm(true);
    };

    const handleAddressFieldChange = (field, value) => {
        setAddressForm((prev) => ({...prev, [field]: value}));
    };

    const handleDeleteAddress = (addressId) => {
        setAddresses((prev) => {
            const next = prev.filter((item) => item.id !== addressId);
            if (next.length > 0 && !next.some((item) => item.isDefault)) {
                next[0] = {...next[0], isDefault: true};
            }
            return next;
        });
    };

    const handleSetDefaultAddress = (addressId) => {
        setAddresses((prev) => prev.map((item) => ({...item, isDefault: item.id === addressId})));
    };

    const handleAddressSave = () => {
        if (!addressForm.title || !addressForm.fullName || !addressForm.phone || !addressForm.city || !addressForm.district || !addressForm.fullAddress) {
            showMessage(t('profile.addressFormErrorTitle'), t('profile.addressFormErrorDetail'), toastCenter, 'warn');
            return;
        }

        if (editingAddressId) {
            setAddresses((prev) => prev.map((item) => (item.id === editingAddressId ? {...item, ...addressForm} : item)));
        } else {
            const isFirstAddress = addresses.length === 0;
            setAddresses((prev) => [
                ...prev,
                {
                    ...addressForm,
                    id: `addr-${Date.now()}`,
                    isDefault: isFirstAddress
                }
            ]);
        }

        clearAddressForm();
    };

    const renderAddressSection = () => {
        return (
            <>
                <div className="process-row">
                    <div className="process-header-item">{t('profile.sectionTitleAddress')}</div>
                    <div className="address-toolbar">
                        <p>{t('profile.sectionSubtitleAddress')}</p>
                        <Button
                            className="address-add-btn"
                            icon="pi pi-plus"
                            label={t('profile.addAddress')}
                            onClick={handleOpenNewAddressForm}
                        />
                    </div>
                </div>

                <div className="process-row">
                    {addresses.length === 0 ? (
                        <div className="address-empty-state">{t('profile.addressEmpty')}</div>
                    ) : (
                        <div className="address-grid">
                            {addresses.map((address) => (
                                <div key={address.id} className={`address-card ${address.isDefault ? 'is-default' : ''}`}>
                                    <div className="address-card-top">
                                        <div className="address-card-title-group">
                                            <div className="address-card-title-line">
                                                <h4>{(address.title || '').trim() || safeText('profile.addressCardFallbackTitle', 'Teslimat Adresim')}</h4>
                                                <span className={`address-type-tag ${address.type === 'work' ? 'is-work' : 'is-home'}`}>
                                                    <i className={address.type === 'work' ? 'pi pi-briefcase' : 'pi pi-home'} />
                                                    {address.type === 'work'
                                                        ? safeText('profile.workAddressType', 'İş Adresi')
                                                        : safeText('profile.homeAddressType', 'Ev Adresi')}
                                                </span>
                                            </div>
                                        </div>
                                        {address.isDefault ? <div className="address-default-tag">{t('profile.defaultAddress')}</div> : null}
                                    </div>

                                    <div className="address-card-content">
                                        <strong>{address.fullName}</strong>
                                        <span>{address.phone}</span>
                                        <span>{address.district} / {address.city}</span>
                                        <p>{address.fullAddress}</p>
                                    </div>

                                    <div className="address-card-actions">
                                        {!address.isDefault ? (
                                            <button type="button" onClick={() => handleSetDefaultAddress(address.id)}>
                                                {t('profile.setDefault')}
                                            </button>
                                        ) : <span className="address-action-placeholder"/>}
                                        <button type="button" onClick={() => handleEditAddress(address)}>{t('profile.editAddress')}</button>
                                        <button type="button" className="is-danger" onClick={() => handleDeleteAddress(address.id)}>{t('profile.deleteAddress')}</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {showAddressForm ? (
                    <div className="process-row">
                        <div className="address-form-panel">
                            <h3>{editingAddressId ? t('profile.editAddressTitle') : t('profile.newAddressTitle')}</h3>

                            <div className="address-form-grid">
                                <div className="address-form-field">
                                    <label>{t('profile.addressTitle')}</label>
                                    <InputText value={addressForm.title} onChange={(e) => handleAddressFieldChange('title', e.target.value)}/>
                                </div>
                                <div className="address-form-field">
                                    <label>{t('profile.addressType')}</label>
                                    <div className="address-type-switch">
                                        <button
                                            type="button"
                                            className={addressForm.type === 'home' ? 'is-active' : ''}
                                            onClick={() => handleAddressFieldChange('type', 'home')}
                                        >
                                            {t('profile.homeType')}
                                        </button>
                                        <button
                                            type="button"
                                            className={addressForm.type === 'work' ? 'is-active' : ''}
                                            onClick={() => handleAddressFieldChange('type', 'work')}
                                        >
                                            {t('profile.workType')}
                                        </button>
                                    </div>
                                </div>

                                <div className="address-form-field">
                                    <label>{t('profile.nameSurname')}</label>
                                    <InputText value={addressForm.fullName} onChange={(e) => handleAddressFieldChange('fullName', e.target.value)}/>
                                </div>
                                <div className="address-form-field">
                                    <label>{t('profile.phone')}</label>
                                    <InputMask
                                        mask="0(999)-999-99-99"
                                        placeholder="0(5__) ___ __ __"
                                        keyfilter="int"
                                        value={addressForm.phone}
                                        onChange={(e) => handleAddressFieldChange('phone', e.target.value)}
                                    />
                                </div>

                                <div className="address-form-field">
                                    <label>{t('profile.city')}</label>
                                    <InputText value={addressForm.city} onChange={(e) => handleAddressFieldChange('city', e.target.value)}/>
                                </div>
                                <div className="address-form-field">
                                    <label>{t('profile.district')}</label>
                                    <InputText value={addressForm.district} onChange={(e) => handleAddressFieldChange('district', e.target.value)}/>
                                </div>
                            </div>

                            <div className="address-form-field">
                                <label>{t('profile.fullAddressLabel')}</label>
                                <InputTextarea
                                    autoResize
                                    rows={4}
                                    value={addressForm.fullAddress}
                                    onChange={(e) => handleAddressFieldChange('fullAddress', e.target.value)}
                                />
                            </div>

                            <div className="address-form-actions">
                                <Button label={t('profile.cancel')} className="p-button-text" onClick={clearAddressForm}/>
                                <Button label={t('profile.saveAddress')} onClick={handleAddressSave}/>
                            </div>
                        </div>
                    </div>
                ) : null}
            </>
        );
    };

    const renderOrdersSection = () => {
        return (
            <div className="process-row">
                <div className="process-header-item">{t('profile.sectionTitleOrders')}</div>
                {orderHistory.length === 0 ? (
                    <div className="profile-placeholder-panel">
                        <p>{safeText('profile.noOrdersText', 'Henüz sipariş bulunmuyor.')}</p>
                    </div>
                ) : (
                    <div className="profile-order-list">
                        {orderHistory.map((order) => (
                            <div key={order.id} className="profile-order-card">
                                <div className="profile-order-head">
                                    <strong>#{order.id}</strong>
                                    <span>{new Date(order.createdAt).toLocaleDateString('tr-TR')}</span>
                                </div>
                                <div className="profile-order-items">
                                    {(order.items || []).slice(0, 3).map((item) => (
                                        <div key={`${order.id}-${item.id}`} className="profile-order-item">
                                            <img src={item.img} alt={item.title}/>
                                            <div>
                                                <strong>{item.mark}</strong>
                                                <span>{item.title}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="profile-order-foot">
                                    <span>{safeText('profile.orderTotal', 'Toplam')}</span>
                                    <strong>{Number(order?.summary?.total || 0).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} TL</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderViewedSection = () => {
        return (
            <div className="process-row">
                <div className="process-header-item">{t('profile.sectionTitleHistory')}</div>
                {viewedProducts.length === 0 ? (
                    <div className="profile-placeholder-panel">
                        <p>{safeText('profile.noViewedText', 'Henüz incelediğiniz ürün bulunmuyor.')}</p>
                    </div>
                ) : (
                    <div className="profile-viewed-grid">
                        {viewedProducts.slice(0, 16).map((item) => (
                            <a key={item.id} href={`/detail/${item.id}`} className="profile-viewed-card">
                                <img src={item.img} alt={item.title}/>
                                <strong>{item.mark}</strong>
                                <span>{item.title}</span>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const onChangeSection = (sectionKey) => {
        setActiveSection(sectionKey);
        history.replace(`${location.pathname}?section=${sectionKey}`);
    };

    return (

        <div className="catalog">
            <div className="container-items">
                <Toast ref={toastCenter} position="center"/>
                <div className="my-account-page">
                    <ProfileNavigation
                        userFullName={fullName}
                        activeSection={activeSection}
                        onChangeSection={onChangeSection}
                        compact={compactProfileNav}
                    />

                    <div className="process-column">
                        {activeSection === 'user-info' && renderUserInfoSection()}
                        {activeSection === 'address' && renderAddressSection()}
                        {activeSection === 'orders' && renderOrdersSection()}
                        {activeSection === 'history' && renderViewedSection()}
                        {!['user-info', 'address', 'orders', 'history'].includes(activeSection) && renderPlaceholderSection()}
                    </div>
                </div>
            </div>

            {phoneOtpModalOpen && (
                <div className="bank-demo-modal-backdrop" onClick={() => setPhoneOtpModalOpen(false)}>
                    <div className="bank-demo-modal phone-otp-modal" onClick={(event) => event.stopPropagation()}>
                        <div className="bank-demo-head">
                            <h3>{safeText('profile.phoneOtpTitle', 'SMS Doğrulama')}</h3>
                            <button type="button" onClick={() => setPhoneOtpModalOpen(false)}>
                                {safeText('common.close', 'Kapat')}
                            </button>
                        </div>

                        <div className="bank-demo-content">
                            <div className="bank-demo-info">
                                {safeText('profile.phoneOtpInfo', 'Numaranızı doğrulamak için telefonunuza SMS kodu gönderildi.')}
                            </div>
                            <div className="bank-demo-row">
                                <span>{safeText('profile.newPhone', 'Yeni Telefon')}</span>
                                <strong>{newPhoneNumber || '-'}</strong>
                            </div>
                            <div className="bank-demo-row">
                                <span>{safeText('profile.phoneOtpDemoCode', 'Demo SMS Kodu')}</span>
                                <strong>{PHONE_OTP_DEMO_CODE}</strong>
                            </div>

                            <div className="bank-otp-area">
                                <label htmlFor="phone-otp-input">{safeText('profile.phoneOtpCode', 'SMS Kodu')}</label>
                                <input
                                    id="phone-otp-input"
                                    type="text"
                                    value={phoneOtpCode}
                                    onChange={(event) => setPhoneOtpCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder={safeText('profile.phoneOtpPlaceholder', '6 haneli kod')}
                                />
                                {phoneOtpError && <div className="bank-otp-error">{phoneOtpError}</div>}
                            </div>
                        </div>

                        <div className="bank-demo-actions">
                            <button type="button" className="cancel" onClick={() => setPhoneOtpModalOpen(false)}>
                                {safeText('profile.cancel', 'Vazgeç')}
                            </button>
                            <button
                                type="button"
                                className="approve"
                                onClick={handleApprovePhoneOtp}
                                disabled={phoneOtpCode.length !== 6}
                            >
                                {safeText('profile.phoneOtpApprove', 'Onayla')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default MyUserInfo;
