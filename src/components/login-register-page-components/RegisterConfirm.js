import React, {useState, useContext, useEffect} from 'react';
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import RegisterService from "../../service/RegisterService";
import AppContext from "../../AppContext";
import {LoginPage} from "./LoginPage";
import {InputNumber} from "primereact/inputnumber";

export const Confirm = ({UserId: userId}) => {

    const myContext = useContext(AppContext)

    const [confirmValue, setConfirmValue] = useState("");
    const [wrongAccountInfo, setWrongAccountInfo] = useState(false);
    const [labelMessage, setLabelMessage] = useState("");
    const [disableConfirm, setDisableConfirm] = useState(false);
    const [timeValue, setTimeValue] = useState(120);
    const [timerEnable, settimerEnable] = useState(true);

    useEffect(() => {
        // setCampaignData(campaignDataExp);
        /*
        ** Bu alanda datalar servislerden alınacaktır.
        *
         */
        confirmTimer();
    }, []);

    const confirmButtonClick = () => {
        RegisterService.confirm(userId, confirmValue).then(response => {
            if (response !== 11 && response.data) {
                if (response.data.returnCode === 99) {
                    myContext.setComponent(<LoginPage/>)
                    window.location.reload();
                } else {
                    setLabelMessage(response.data.detail.exceptionDetailMessage)
                    setWrongAccountInfo(true);
                }
            } else {

            }

        }, (error) => {
            setWrongAccountInfo(true);
            setLabelMessage("Kod doğrulama sırasında bir hata oluştu.")
        })
    }

    const createConfirmClick = () => {
        RegisterService.createConfirm(userId, confirmValue).then(response => {
            if (response === 99 && response.data) {
                if (response.data.returnCode === 99) {
                    settimerEnable(true);
                    confirmTimer();
                    setDisableConfirm(false);
                }
            } else {
                setLabelMessage(response.data.detail.exceptionDetailMessage)
                setWrongAccountInfo(true);
            }

        }, (error) => {
            setWrongAccountInfo(true);
            setLabelMessage("Kod doğrulama sırasında bir hata oluştu.")
        })
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

    const confirmTimer = () => {
        let number = 10;
        const timer = setInterval(() => {
            number--;
            document.getElementById("timer").innerText = number;

            if (number === 0) {
                clearInterval(timer)
                settimerEnable(false);
                setDisableConfirm(true)
            }

        }, 1000);
        myContext.setTimer(timer);
    }

    const confirmTimerBody = () => {
        if (timerEnable) {
            return (
                <div className="confirm-timer-area">
                    <label id="timerLabel">{"Kalan Süre: "}</label>
                    <label id="timer">10</label>
                </div>
            )
        } else {
            return (
                <Button className="p-button-text"
                        style={{fontSize: '14px', color: '#64748b', textDecoration: 'underline'}}
                        label={"Yeniden Kod Gönder"}
                        onClick={createConfirmClick}
                />
            )
        }
    }


    return (
        <div className="register-confirm">
            <div className="register-confirm-item">
                <label>E-Posta ile iletilmiş olan onaylama kodunu giriniz. Hesap aktivasyonunuz bu kodun doğrulanması ardından gerçekleştirilecektir.</label>
            </div>

            <div className="register-confirm-item">
                {failRegisterConfirmMessageLabel()}
                {confirmTimerBody()}
            </div>

            <div className="register-confirm-item">
                <InputText style={{width: '100%'}}
                           placeholder={"Confirm kodunu giriniz"}
                           value={confirmValue}
                           type="text"
                           onChange={(e) => {
                               setConfirmValue(e.target.value)
                           }
                           }
                />
            </div>

            <div className="register-confirm-item confirm-button">
                <Button className="p-button-warning"
                        style={{width: '100%', height: '45px'}}
                        label={"Doğrula"}
                        disabled={disableConfirm}
                        onClick={confirmButtonClick}/>
            </div>

        </div>
    );
}
