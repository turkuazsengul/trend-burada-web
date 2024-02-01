import React, {useContext, useState} from 'react';
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import AuthService from "../../service/AuthService";
import {useHistory} from "react-router-dom";
import {Password} from 'primereact/password';
import AppContext from "../../AppContext";
import UserService from "../../service/UserService.";

export const Login = () => {
    const myContext = useContext(AppContext)
    const history = useHistory();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [wrongAccountInfo, setWrongAccountInfo] = useState(false);
    const [labelMessage, setLabelMessage] = useState("");

    const failMailLabelMessage = "Lütfen geçerli bir e-posta adresi giriniz";
    const failPasswordLabelMessage = "Lütfen şifrenizi giriniz";

    const loginButtonOnClick = async () => {
        try {
            const responseLogin = await AuthService.login(username, password);
            const responseUser = await UserService.getUser(responseLogin.data.access_token);
            localStorage.setItem("token", responseLogin.data.access_token);
            localStorage.setItem("user", JSON.stringify(responseUser.data.returnData[0]));
        }catch (error){
            console.error('Error fetching data:', error);
            if (error.response.status === 401) {
                localStorage.removeItem("token");
                history.push("/login");
                window.location.reload()
            }
        }


        if (checkValidation()) {
            AuthService.login(username, password).then((response) => {
                localStorage.setItem("token", response.data.access_token);
                history.push("/")
                window.location.reload();
            }).catch((error) => {
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
            return true;
            // if (!validator.isEmail(username)) {
            //     setWrongAccountInfo(true);
            //     setLabelMessage(failMailLabelMessage)
            //     return false;
            // } else {
            //     return true;
            // }
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
                <label>Kullanıcı Adı</label>
                <InputText placeholder={"Kullanıcı Adı"}
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
                          style={{width: '100%', fontSize: '1px'}}
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
