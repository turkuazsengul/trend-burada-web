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
import {USE_DEMO_LOCAL_AUTH} from "../../constants/UrlConstans";
import DemoAuthService from "../../service/DemoAuthService";


export const Register = () => {
    const myContext = useContext(AppContext)
    const t = myContext?.t || ((key) => key);

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
                    setSuccessMessage(t('register.success'));
                    setMail("");
                    setPass("");
                    setFirstName("");
                    setLastName("");
                } else {
                    setWrongAccountInfo(true);
                    setSuccessMessage("");
                    setLabelMessage(response.message || t('register.genericError'));
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
                        setLabelMessage(t('register.genericError'))
                    }
                } else {
                    setWrongAccountInfo(true);
                    setSuccessMessage("");
                    setLabelMessage(t('register.genericError'))
                }

                setLoading(false);
            }, (error) => {
                setWrongAccountInfo(true);
                setSuccessMessage("");
                setLabelMessage(t('register.genericError'))
            })
        }
    }

    const checkValidation = () => {
        if (mail === "" || firstName === "" || lastName === "" || pass === "") {
            setWrongAccountInfo(true);
            setSuccessMessage("");
            if (firstName === "") {
                setLabelMessage(t('register.invalidName'))
            } else if (lastName === "") {
                setLabelMessage(t('register.invalidSurname'))
            } else if (mail === "") {
                setLabelMessage(t('register.invalidEmail'))
            } else if (pass === "") {
                setLabelMessage(t('register.invalidPassword'))
            }
            return false;
        } else {
            if (!validator.isEmail(mail)) {
                setWrongAccountInfo(true);
                setSuccessMessage("");
                setLabelMessage(t('register.invalidEmail'))
                return false;
            } else if (!validator.isStrongPassword(pass, {minLength: 7, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})) {
                setWrongAccountInfo(true);
                setSuccessMessage("");
                setLabelMessage(t('register.weakPassword'))
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

    const header = <h6>{t('register.password')}</h6>;
    const footer = (
        <React.Fragment>
            <Divider/>
            <p className="mt-2">{t('common.suggestions')}</p>
            <ul className="pl-2 ml-2 mt-0" style={{lineHeight: '1.5'}}>
                <li>{t('common.passwordRuleLower')}</li>
                <li>{t('common.passwordRuleUpper')}</li>
                <li>{t('common.passwordRuleNumeric')}</li>
                <li>{t('common.passwordRuleMin')}</li>
            </ul>
        </React.Fragment>
    );

    return (
        <div>
            <div className="login">
                {failRegisterMessageLabel()}
                {successRegisterMessageLabel()}
                <div className="login-item">
                    <label>{t('register.name')}</label>
                    <InputText
                        placeholder={t('register.name')}
                        value={firstName}
                        type="text"
                        onChange={(e) => {
                            setFirstName(e.target.value)
                            setWrongAccountInfo(false);
                        }}
                    />
                </div>

                <div className="login-item">
                    <label>{t('register.surname')}</label>
                    <InputText
                        placeholder={t('register.surname')}
                        value={lastName}
                        type="text"
                        onChange={(e) => {
                            setLastName(e.target.value)
                            setWrongAccountInfo(false);
                        }}
                    />
                </div>

                <div className="login-item">
                    <label>{t('register.email')}</label>
                    <InputText
                        placeholder={t('login.emailPlaceholder')}
                        value={mail}
                        type="text"
                        onChange={(e) => {
                            setMail(e.target.value)
                            setWrongAccountInfo(false);
                        }}
                    />
                </div>

                <div className="login-item">
                    <label>{t('register.password')}</label>
                    <Password placeholder={t('login.passwordPlaceholder')}
                              header={header} footer={footer}
                              value={pass}
                              toggleMask
                              style={{width: '100%', fontSize: '1px'}}
                              onChange={(e) => {
                                  setPass(e.target.value)
                                  setWrongAccountInfo(false);
                              }}
                    />
                    <span className="password-validate-message">{t('register.passwordHint')}</span>
                </div>

                <div className="login-item">
                    <Button className="login-submit-button" label={t('register.submit')} onClick={registerButtonClick}/>
                </div>

                <div className="login-item social-login-section">
                <div className="social-login-divider">
                    <span>{t('register.or')}</span>
                </div>

                    <div className="social-login-actions">
                        <Button type="button" className="social-login-button social-facebook">
                            <span className="social-facebook-icon pi pi-facebook" aria-hidden="true"/>
                            <span className="social-label">{t('register.facebook')}</span>
                        </Button>
                        <Button type="button" className="social-login-button social-google">
                            <img
                                className="social-google-icon"
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt=""
                                aria-hidden="true"
                            />
                            <span className="social-label">{t('register.google')}</span>
                        </Button>
                    </div>
                </div>
            </div>

            {ModalTemp()}

        </div>


    );
}
