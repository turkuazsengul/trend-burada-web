import React, {useEffect, useRef, useState} from 'react';
import ProfileNavigation from "./ProfileNavigation";
import '../../css/customer-profile.css'
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Password} from "primereact/password";
import {InputMask} from "primereact/inputmask";
import UserService from "../../service/UserService.";
import {useHistory} from "react-router-dom";
import {Calendar} from "primereact/calendar";
import {Toast} from "primereact/toast";

const MyUserInfo = () => {
    const DISABLE_INPUT_TOOLTIP_MESSAGE = "Bu Alanlar Kullanıcı Tarafından Güncellenemez. Lütfen Müşteri Hizmetleri İle İrtibata Geçiniz.";
    const history = useHistory();

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

    useEffect(async () => {
        const storedUserStr = localStorage.getItem("user");
        const user = JSON.parse(storedUserStr);

        if (user) {
            // setUser(user);

            setUserId(user.pkId)
            setPhoneNumber(user.gsm_no)
            setBirthDate(new Date(user.dob))
            setFirstName(user.name)

            setEmail(user.email)
            setLastName(user.surname)
            setFullName(user.name + ' ' + user.surname)
        } else {
            localStorage.removeItem("token");
            history.push("/login");
            window.location.reload()

            const detailMessage = "Sistemsel bir hata sebebi ile şuan için bilgilerinize erişemiyoruz. Lütfen daha sonra tekrar deneyiniz."
            showMessage("Kullanıcı Bilgisine Erişilemedi.", detailMessage, toastCenter, 'warn')
        }
    }, []);

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

    return (

        <div className="catalog">
            <div className="container-items">
                <div className="my-account-page">
                    <Toast ref={toastCenter} position="center"/>

                    <ProfileNavigation userFullName={fullName}/>

                    <div className="process-column">
                        <div className="process-row">
                            <div className="process-header-item">
                                Kullanıcı Bilgilerim
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
                                                <div className="header-item">Yeni Şifre Tekrar</div>
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
                                                <div className="header-item">Yeni Şifre Tekrar</div>
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
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MyUserInfo;
