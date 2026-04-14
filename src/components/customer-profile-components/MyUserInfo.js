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

const MyUserInfo = () => {
    const {t = (key) => key} = useContext(AppContext) || {};
    const DISABLE_INPUT_TOOLTIP_MESSAGE = t('profile.readonlyTooltip');
    const history = useHistory();
    const location = useLocation();
    const profileSections = useMemo(() => buildProfileSections(t), [t]);

    const toastCenter = useRef(null);

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
            setFullName(`${user.name || ''} ${user.surname || ''}`.trim())
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

    const clickUserInformationUpdateBtn = () => {
        const user = {
            pkId: userId,
            gsm_no: phoneNumber,
            dob: birthDate,
            name: firstName,
            email: email,
            surname: lastName
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
                <div className="process-row">
                    <div className="process-user-form-layer">
                        <div className="user-detail">
                            <div className="user-detail-header">
                                <label>{t('profile.membershipInfo')}</label>
                                <hr/>
                            </div>
                            <div className="user-detail-body">
                                <div className="detail-row-1">
                                    <div className="user-detail-item">
                                        <div className="header-item">{t('profile.name')}</div>
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
                                        <div className="header-item">{t('profile.surname')}</div>
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
                                        <div className="header-item">{t('profile.email')}</div>
                                        <InputText
                                            disabled={true}
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className="user-detail-item">
                                        <div className="header-item">{t('profile.phone')}</div>
                                        <InputMask
                                            mask="0(999)-999-99-99"
                                            placeholder="(___)-___-__-__"
                                            keyfilter="int"
                                            value={phoneNumber}
                                            onClick={() => {
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
                                        <div className="header-item">{t('profile.birthDate')}</div>
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
                                                label={t('profile.update')}
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
                                <label>{t('profile.passwordUpdate')}</label>
                                <hr/>
                            </div>
                            <div className="password-change-body">
                                <div className="password-row-1">
                                    <div className="password-item">
                                        <div className="header-item">{t('profile.currentPassword')}</div>
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
                                        <div className="header-item">{t('profile.newPassword')}</div>
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
                                        <div className="header-item">{t('profile.repeatPassword')}</div>
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
                                                label={t('profile.update')}
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
