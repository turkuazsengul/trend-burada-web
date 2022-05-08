import React, {useState} from 'react';
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import validator from 'validator'
import RegisterService from "../../service/RegisterService";
import {Dialog} from "primereact/dialog";
import {Password} from "primereact/password";
import { Divider } from 'primereact/divider';


export const Register = () => {

    const [confirmValue, setConfirmValue] = useState("");

    const [modalVisible, setModalVisible] = useState(false);
    const [createdUserId, setCreatedUserId] = useState(true);


    const [loading, setLoading] = useState(false);

    const [mail, setMail] = useState("");
    const [pass, setPass] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");

    const [wrongAccountInfo, setWrongAccountInfo] = useState(false);
    const [labelMessage, setLabelMessage] = useState("");

    const failMailLabelMessage = "Lütfen geçerli bir e-posta adresi giriniz";
    const failNameLabelMessage = "Lütfen adınızı giriniz";
    const failSurnameLabelMessage = "Lütfen soyadınızı giriniz";
    const failPassLabelMessage = "Lütfen belirleyeceğiniz şifrenizi giriniz";
    const failStrongPasswordMessage = "Lütfen daha uygun bir şifre belirleyin";

    const registerButtonClick = () => {
        const request = {
            email: mail,
            password: pass,
            name: name,
            surname: surname,
            roleList: [
                {
                    pkId: 1,
                    name: "CUSTOMER"
                }
            ],
        }

        if (checkValidation()) {
            setLoading(true);
            RegisterService.register(request).then(response => {
                if (response !== 11 && response.data) {
                    if (response.data.returnCode === 99) {
                        setCreatedUserId(response.data.returnData[0].pkId);
                        setWrongAccountInfo(false);
                        setModalVisible(true)
                    } else {
                        setWrongAccountInfo(true);
                        setLabelMessage("Kayıt esnasında hata oluştu.")
                    }
                } else {
                    setWrongAccountInfo(true);
                    setLabelMessage("Kayıt esnasında hata oluştu.")
                }

                setLoading(false);
            }, (error) => {
                setWrongAccountInfo(true);
                setLabelMessage("Kayıt esnasında hata oluştu.")
            })
        }
    }

    const checkValidation = () => {
        if (mail === "" || name === "" || surname === "" || pass === "") {
            setWrongAccountInfo(true);
            if (name === "") {
                setLabelMessage(failNameLabelMessage)
            } else if (surname === "") {
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
                setLabelMessage(failMailLabelMessage)
                return false;
            } else if (!validator.isStrongPassword(pass, {minLength: 7, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})) {
                setWrongAccountInfo(true);
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
                        <div className="register-confirm">
                            <div className="register-confirm-item">
                                <label>E-Posta ile iletilmiş olan confirm kodunu giriniz. Kayıt işleminiz bu kodun doğrulanması ardından gerçekleştirilecektir.</label>
                            </div>

                            {failRegisterConfirmMessageLabel()}

                            <div className="register-confirm-item">
                                <InputText style={{width: '100%'}} placeholder={"Confirm kodunu giriniz"} value={confirmValue} type="text" onChange={(e) => setConfirmValue(e.target.value)}/>
                            </div>

                            <div className="register-confirm-item">
                                <Button className="p-button-warning" style={{width: '100%', height: '45px'}} label={"Üye Ol"} onClick={confirmButtonClick}/>
                            </div>

                        </div>
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

    const clearState = () => {
        setName("");
        setSurname("");
        setMail("");
        setPass("");
    }

    const confirmButtonClick = () => {
        if (confirmValue !== "") {
            RegisterService.confirm(createdUserId, confirmValue).then(response => {
                if (response !== 11 && response.data) {
                    if (response.data.returnCode === 99) {
                        clearState();
                        setModalVisible(false)
                        window.location.reload();
                    } else {
                        setWrongAccountInfo(true);
                        setLabelMessage("Kod doğrulama sırasında bir hata oluştu.")
                    }
                } else {
                    setWrongAccountInfo(true);
                    setLabelMessage("Kod doğrulama sırasında bir hata oluştu.")
                }
            }, (error) => {
                setWrongAccountInfo(true);
                setLabelMessage("Kod doğrulama sırasında bir hata oluştu.")
            })
        } else {
            setWrongAccountInfo(true);
            setLabelMessage("Doğrulama kodu alanı boş olamaz.")
        }
    }

    const failRegisterConfirmMessageLabel = () => {
        if (wrongAccountInfo) {
            return (
                <div className="fail-login-message-item">
                    <i className="pi pi-exclamation-circle"/>
                    <label>{labelMessage}</label>
                </div>
            )
        }
    }

    const onHide = () => {
        setModalVisible(false)
    }

    const header = <h6>Pick a password</h6>;
    const footer = (
        <React.Fragment>
            <Divider />
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
                <div className="login-item">
                    <label>Ad</label>
                    <InputText placeholder="Ad" value={name} type="text" onChange={(e) => setName(e.target.value)}/>
                </div>

                <div className="login-item">
                    <label>Soyad</label>
                    <InputText placeholder="Soyad" value={surname} type="text" onChange={(e) => setSurname(e.target.value)}/>
                </div>

                <div className="login-item">
                    <label>E-Posta</label>
                    <InputText placeholder="E-Posta Adresi" value={mail} type="text" onChange={(e) => setMail(e.target.value)}/>
                </div>

                <div className="login-item">
                    <label>Şifre</label>
                    <Password placeholder="Kullanıcı Şifresi"
                              header={header} footer={footer}
                              value={pass}
                              toggleMask
                              style={{width: '100%',fontSize:'1px'}}
                              onChange={(e) => {
                                  setPass(e.target.value)
                              }}
                    />
                    <span className="password-validate-message">Şifreniz en az 7 karakter olmalı. harf ve karakter içermelidir.</span>
                </div>

                <div className="login-item">
                    <Button label={"Üye Ol"} onClick={registerButtonClick}/>
                </div>
            </div>

            {ModalTemp()}

        </div>


    );
}
