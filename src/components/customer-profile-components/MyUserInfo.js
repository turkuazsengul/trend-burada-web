import React, {useEffect, useState} from 'react';
import ProfileNavigation from "./ProfileNavigation";

import '../../css/customer-profile.css'
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Dropdown} from "primereact/dropdown";
import {Calendar} from "primereact/calendar";
import {Password} from "primereact/password";
import {InputMask} from "primereact/inputmask";

const MyUserInfo = () => {
    const [user, setUser] = useState([]);
    // const [userDetail, setUserDetail] = useState({});
    const [fullName, setFullName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [selectedPhoneCode, setSelectedPhoneCode] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [againNewPassword, setAgainNewPassword] = useState("");
    const [updateBtnDisabled, setUpdateBtnDisabled] = useState(true);
    const [passUpdateBtnDisabled, setPassUpdateBtnDisabled] = useState(true);

    const phoneCodeList = [{code: '+90'}, {code: '+45'}];

    const userDetailDummy = [
        {
            phoneCode: '+90',
            phoneNumber: '+90 (539) 316 47 59',
            birthDay: '10/01/1994',
        }
    ];

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const userJson = JSON.parse(storedUser);
            setFirstName(userJson.firstName)
            setEmail(userJson.email)
            setLastName(userJson.lastName)
            setFullName(userJson.name)
        }
        const userDetail = userDetailDummy[0]
        setPhoneNumber(userDetail.phoneNumber)
        setBirthDate(userDetail.birthDay)
    }, []);

    return (

        <div className="catalog">
            <div className="container-items">
                <div className="my-account-page">
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
                                                    value={firstName}
                                                    onChange={(e) => {
                                                        setFirstName(e.target.value)
                                                        setUpdateBtnDisabled(false)
                                                    }}
                                                />
                                            </div>
                                            <div className="user-detail-item">
                                                <div className="header-item">Soyad</div>
                                                <InputText
                                                    value={lastName || user.lastName}
                                                    onChange={(e) => {
                                                        setLastName(e.target.value)
                                                        setUpdateBtnDisabled(false)
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="detail-row-2">
                                            <div className="user-detail-item">
                                                <div className="header-item">E-Mail</div>
                                                <InputText
                                                    value={email || user.email}
                                                    onChange={(e) => {
                                                        setEmail(e.target.value)
                                                        setUpdateBtnDisabled(false)
                                                    }}
                                                />
                                            </div>
                                            <div className="user-detail-item">
                                                <div className="header-item">Cep Telefonu</div>
                                                <InputMask
                                                    mask="+99-(999)-999-99-99"
                                                    placeholder="+11-(111)-111-11-11"
                                                    keyfilter="int"
                                                    value={phoneNumber}
                                                    onClick={(e) =>{
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
                                                <InputText
                                                    value={birthDate}
                                                    onChange={(e) => {
                                                        setBirthDate(e.target.value)
                                                        setUpdateBtnDisabled(false)
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="detail-row-4">
                                            <div className="user-detail-item">
                                                <Button
                                                    label={"Güncelle"}
                                                    disabled={updateBtnDisabled}
                                                    size="large"
                                                />
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
    )
}
export default MyUserInfo;
