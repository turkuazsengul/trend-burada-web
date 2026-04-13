import React, {useState} from 'react';
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import AuthService from "../../service/AuthService";
import {useHistory, useLocation} from "react-router-dom";
import {Password} from 'primereact/password';
import {USE_DEMO_LOCAL_AUTH} from "../../constants/UrlConstans";
import DemoAuthService from "../../service/DemoAuthService";

export const Login = () => {
    const history = useHistory();
    const location = useLocation();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [wrongAccountInfo, setWrongAccountInfo] = useState(false);
    const [labelMessage, setLabelMessage] = useState("");

    const failMailLabelMessage = "Lütfen geçerli bir e-posta adresi giriniz";
    const failPasswordLabelMessage = "Lütfen şifrenizi giriniz";
    const redirectTarget = new URLSearchParams(location.search).get('redirect') || "/";

    const loginButtonOnClick = async () => {
        if (checkValidation()) {
            if (USE_DEMO_LOCAL_AUTH) {
                try {
                    const response = DemoAuthService.login(username, password);
                    localStorage.setItem("token", response.token);
                    localStorage.setItem("user", JSON.stringify(response.user));
                    history.push(redirectTarget)
                    window.location.reload();
                } catch (error) {
                    setWrongAccountInfo(true);
                    setLabelMessage("Kullanıcı adı veya şifre hatalı")
                }
                return;
            }

            AuthService.login(username, password).then((response) => {
                localStorage.setItem("token", response.data.returnData[0].accessTokenResponse.access_token);
                localStorage.setItem("user", JSON.stringify(response.data.returnData[0].user));
                history.push(redirectTarget)
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
                <label>E-Posta</label>
                <InputText placeholder={"E-Posta Adresi"}
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
                    <Button className="login-forgot-button" onClick={forgetPasswordClick}>Şifremi Unuttum</Button>
                </div>
            </div>

            <div className="login-item">
                <Button className="login-submit-button" label={"Giriş Yap"} onClick={loginButtonOnClick}/>
            </div>

            <div className="login-item social-login-section">
                <div className="social-login-divider">
                    <span>veya</span>
                </div>

                <div className="social-login-actions">
                    <Button
                        type="button"
                        className="social-login-button social-facebook"
                    >
                        <span className="social-facebook-icon pi pi-facebook" aria-hidden="true"/>
                        <span className="social-label">Facebook ile Devam Et</span>
                    </Button>
                    <Button
                        type="button"
                        className="social-login-button social-google"
                    >
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

    );
}
