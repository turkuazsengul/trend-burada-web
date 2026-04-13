import React, {useContext, useState} from 'react';
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import validator from 'validator'
import RegisterService from "../../service/RegisterService";
import {Dialog} from "primereact/dialog";
import {Password} from "primereact/password";
import {Divider} from 'primereact/divider';
import {Confirm} from "./RegisterConfirm";
import AppContext from "../../AppContext";
import {useHistory} from "react-router-dom";
import {USE_DEMO_LOCAL_AUTH} from "../../constants/UrlConstans";
import DemoAuthService from "../../service/DemoAuthService";


export const Register = () => {
    const myContext = useContext(AppContext)

    const [confirmValue, setConfirmValue] = useState("");

    const [modalVisible, setModalVisible] = useState(false);
    const [createdUserId, setCreatedUserId] = useState(0);


    const [loading, setLoading] = useState(false);

    const [mail, setMail] = useState("");
    const [pass, setPass] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [wrongAccountInfo, setWrongAccountInfo] = useState(false);
    const [labelMessage, setLabelMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const failMailLabelMessage = "Lütfen geçerli bir e-posta adresi giriniz";
    const failNameLabelMessage = "Lütfen adınızı giriniz";
    const failSurnameLabelMessage = "Lütfen soyadınızı giriniz";
    const failPassLabelMessage = "Lütfen belirleyeceğiniz şifrenizi giriniz";
    const failStrongPasswordMessage = "Lütfen daha uygun bir şifre belirleyin";

    const registerButtonClick = () => {
        const request = {
            enabled: true,
            username: mail,
            emailVerified: false,
            firstName: firstName,
            lastName: lastName,
            email: mail,
            credentials: [
                {
                    type: "password",
                    value: pass,
                    temporary: false
                }
            ],
            access: {
                manageGroupMembership: true,
                view: true,
                mapRoles: true,
                impersonate: true,
                manage: true
            },
            realmRoles: ["USER"]
        }

        if (checkValidation()) {
            if (USE_DEMO_LOCAL_AUTH) {
                const response = DemoAuthService.register({
                    firstName,
                    lastName,
                    email: mail,
                    password: pass
                });

                if (response.success) {
                    setWrongAccountInfo(false);
                    setSuccessMessage("Kayıt başarılı. Şimdi Giriş Yap sekmesinden giriş yapabilirsiniz.");
                    setMail("");
                    setPass("");
                    setFirstName("");
                    setLastName("");
                } else {
                    setWrongAccountInfo(true);
                    setSuccessMessage("");
                    setLabelMessage(response.message || "Kayıt esnasında hata oluştu.");
                }
                return;
            }

            setLoading(true);
            // setModalVisible(true)
            RegisterService.register(request).then(response => {
                if (response !== 11 && response.data) {
                    if (response.data.returnCode === 99) {
                        setCreatedUserId(response.data.returnData[0].pkId);
                        setWrongAccountInfo(false);
                        setSuccessMessage("");
                        setModalVisible(true)
                    } else {
                        setWrongAccountInfo(true);
                        setSuccessMessage("");
                        setLabelMessage("Kayıt esnasında hata oluştu.")
                    }
                } else {
                    setWrongAccountInfo(true);
                    setSuccessMessage("");
                    setLabelMessage("Kayıt esnasında hata oluştu.")
                }

                setLoading(false);
            }, (error) => {
                setWrongAccountInfo(true);
                setSuccessMessage("");
                setLabelMessage("Kayıt esnasında hata oluştu.")
            })
        }
    }

    const checkValidation = () => {
        if (mail === "" || firstName === "" || lastName === "" || pass === "") {
            setWrongAccountInfo(true);
            setSuccessMessage("");
            if (firstName === "") {
                setLabelMessage(failNameLabelMessage)
            } else if (lastName === "") {
                setLabelMessage(failSurnameLabelMessage)
            } else if (mail === "") {
                setLabelMessage(failMailLabelMessage)
            } else if (pass === "") {
                setLabelMessage(failPassLabelMessage)
            }
            return false;
        } else {
            if (!validator.isEmail(mail)) {
                setWrongAccountInfo(true);
                setSuccessMessage("");
                setLabelMessage(failMailLabelMessage)
                return false;
            } else if (!validator.isStrongPassword(pass, {minLength: 7, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})) {
                setWrongAccountInfo(true);
                setSuccessMessage("");
                setLabelMessage(failStrongPasswordMessage)
                return false;
            } else {
                setWrongAccountInfo(false);
                return true;
            }
        }
    }

    const ModalTemp = () => {
        if (modalVisible) {
            return (
                <div className="base-dialog">
                    <Dialog className="p-dialog-titlebar-close" header={"Hesap Onay"} visible={modalVisible} onHide={onHide}>
                        <Confirm UserId={96}/>
                    </Dialog>
                </div>
            )
        }

    }

    const failRegisterMessageLabel = () => {
        if (wrongAccountInfo) {
            return (
                <div className="fail-login-message-item">
                    <i className="pi pi-exclamation-circle"/>
                    <label>{labelMessage}</label>
                </div>
            )
        }
    }

    const successRegisterMessageLabel = () => {
        if (successMessage) {
            return (
                <div className="success-login-message-item">
                    <i className="pi pi-check-circle"/>
                    <label>{successMessage}</label>
                </div>
            );
        }
    };

    const onHide = () => {
        setModalVisible(false)
        clearInterval(myContext.timer);
    }

    const header = <h6>Pick a password</h6>;
    const footer = (
        <React.Fragment>
            <Divider/>
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0" style={{lineHeight: '1.5'}}>
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 7 characters</li>
            </ul>
        </React.Fragment>
    );

    return (
        <div>
            <div className="login">
                {failRegisterMessageLabel()}
                {successRegisterMessageLabel()}
                <div className="login-item">
                    <label>Ad</label>
                    <InputText
                        placeholder="Ad"
                        value={firstName}
                        type="text"
                        onChange={(e) => {
                            setFirstName(e.target.value)
                            setWrongAccountInfo(false);
                        }}
                    />
                </div>

                <div className="login-item">
                    <label>Soyad</label>
                    <InputText
                        placeholder="Soyad"
                        value={lastName}
                        type="text"
                        onChange={(e) => {
                            setLastName(e.target.value)
                            setWrongAccountInfo(false);
                        }}
                    />
                </div>

                <div className="login-item">
                    <label>E-Posta</label>
                    <InputText
                        placeholder="E-Posta Adresi"
                        value={mail}
                        type="text"
                        onChange={(e) => {
                            setMail(e.target.value)
                            setWrongAccountInfo(false);
                        }}
                    />
                </div>

                <div className="login-item">
                    <label>Şifre</label>
                    <Password placeholder="Kullanıcı Şifresi"
                              header={header} footer={footer}
                              value={pass}
                              toggleMask
                              style={{width: '100%', fontSize: '1px'}}
                              onChange={(e) => {
                                  setPass(e.target.value)
                                  setWrongAccountInfo(false);
                              }}
                    />
                    <span className="password-validate-message">Şifreniz en az 7 karakter olmalı. harf ve karakter içermelidir.</span>
                </div>

                <div className="login-item">
                    <Button className="login-submit-button" label={"Üye Ol"} onClick={registerButtonClick}/>
                </div>

                <div className="login-item social-login-section">
                    <div className="social-login-divider">
                        <span>veya</span>
                    </div>

                    <div className="social-login-actions">
                        <Button type="button" className="social-login-button social-facebook">
                            <span className="social-facebook-icon pi pi-facebook" aria-hidden="true"/>
                            <span className="social-label">Facebook ile Devam Et</span>
                        </Button>
                        <Button type="button" className="social-login-button social-google">
                            <img
                                className="social-google-icon"
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt=""
                                aria-hidden="true"
                            />
                            <span className="social-label">Google ile Devam Et</span>
                        </Button>
                    </div>
                </div>
            </div>

            {ModalTemp()}

        </div>


    );
}
