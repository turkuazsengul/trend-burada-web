import React, {useState} from 'react';
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import AuthService from "../service/AuthService";
import validator from 'validator'
import {useHistory} from "react-router-dom";
import {Password} from 'primereact/password';

export const Login = () => {

    const history = useHistory();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [wrongAccountInfo, setWrongAccountInfo] = useState(false);
    const [labelMessage, setLabelMessage] = useState("");

    const failMailLabelMessage = "Lütfen geçerli bir e-posta adresi giriniz";
    const failPasswordLabelMessage = "Lütfen şifrenizi giriniz";

    const loginButtonOnClick = () => {

        if (checkValidation()) {
            AuthService.login(username, password).then(() => {
                history.push("/")
                window.location.reload();
            }, (error) => {
                setWrongAccountInfo(true);
                setLabelMessage("Kullanıcı adı veya şifre hatalı")
            })
        }
    }

    const checkValidation = () => {
        if (username === "" || password === "") {
            setWrongAccountInfo(true);
            if (username === "") {
                setLabelMessage(failMailLabelMessage)
            } else if (password === "") {
                setLabelMessage(failPasswordLabelMessage)
            }
            return false;
        } else {
            if (!validator.isEmail(username)) {
                setWrongAccountInfo(true);
                setLabelMessage(failMailLabelMessage)
                return false;
            } else {
                return true;
            }
        }
    }

    const failLoginMessageLabel = () => {
        if (wrongAccountInfo) {
            return (
                <div className="fail-login-message-item">
                    <i className="pi pi-exclamation-circle"/>
                    <label>{labelMessage}</label>
                </div>
            )
        }
    }

    const forgetPasswordClick = () => {

    }


    return (
        <div className="login">
            {failLoginMessageLabel()}
            <div className="login-item">
                <label>E-Posta</label>
                <InputText placeholder={"Kullanıcı e-posta adresi"}
                           value={username} type="text"
                           onChange={(e) => {
                               setUsername(e.target.value)
                               setWrongAccountInfo(false);
                           }}
                />
            </div>

            <div className="login-item">
                <label>Şifre</label>
                <Password placeholder={"Kullanıcı Şifresi"}
                          feedback={false}
                          value={password}
                          toggleMask
                          style={{width: '100%',fontSize:'1px'}}
                          onChange={(e) => {
                              setPassword(e.target.value)
                              setWrongAccountInfo(false);
                          }}
                />
            </div>

            <div className="login-item">
                <div className="forget-password">
                    <Button onClick={forgetPasswordClick}>Şifremi Unuttum</Button>
                </div>
            </div>

            <div className="login-item">
                <Button label={"Giriş"} onClick={loginButtonOnClick}/>
            </div>
        </div>

    );
}
