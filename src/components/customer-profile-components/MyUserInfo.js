import React, {useEffect, useRef, useState} from 'react';
import ProfileNavigation from "./ProfileNavigation";
import '../../css/customer-profile.css'
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Password} from "primereact/password";
import {InputMask} from "primereact/inputmask";
import {Toast} from "primereact/toast";
import UserService from "../../service/UserService.";
import {useHistory} from "react-router-dom";

const MyUserInfo = () => {
    const history = useHistory();

    const toastCenter  = useRef(null);

    const [user, setUser] = useState({});
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

    // const userDetailDummy = [
    //     {
    //         phoneCode: '+90',
    //         phoneNumber: '+90 (539) 316 47 59',
    //         birthDay: '10/01/1994',
    //     }
    // ];

    useEffect(async () => {
        const storedUserStr = localStorage.getItem("user");
        const user = JSON.parse(storedUserStr);

        setPhoneNumber(user.gsm_no)
        setBirthDate(user.dob)
        setFirstName(user.name)

        setEmail(user.email)
        setLastName(user.surname)
        setFullName(user.name + ' ' + user.surname)

        // const token = localStorage.getItem("token");
        // await UserService.getUser(token)
        //     .then((response) => {
        //         const userDetail = userDetailDummy[0]
        //
        //         setPhoneNumber(userDetail.phoneNumber)
        //         setBirthDate(userDetail.birthDay)
        //         setFirstName(response.firstName)
        //
        //         setEmail(response.email)
        //         setLastName(response.lastName)
        //         setFullName(response.name)
        //     })
        //     .catch((error) => {
        //         if (error.response && error.response.status === 401) {
        //             localStorage.removeItem("token");
        //             history.push("/login");
        //             window.location.reload()
        //         } else {
        //             const detailMessage = "Sistemsel bir hata sebebi ile şuan için bilgilerinize erişemiyoruz. Lütfen daha sonra tekrar deneyiniz."
        //             showMessage("Kullanıcı Bilgisine Erişilemedi.", detailMessage, toastCenter , 'warn')
        //         }
        //
        //     });
    }, []);

    const showMessage = (labelText, detailText, ref, severity) => {
        ref.current.show({severity: severity, summary: labelText, detail: detailText, life: 3000});
    };

    return (

        <div className="catalog">
            <div className="container-items">
                <div className="my-account-page">
                    <Toast ref={toastCenter } position="center"/>

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
                                                    value={lastName}
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
                                                    value={email}
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
