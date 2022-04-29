import React, {useState,useContext} from 'react';
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import RegisterService from "../../service/RegisterService";
import AppContext from "../../AppContext";
import {LoginPage} from "./LoginPage";

export const Confirm = ({UserId:userId}) => {

    const myContext = useContext(AppContext)

    const [confirmValue, setConfirmValue] = useState("");
    const [wrongAccountInfo, setWrongAccountInfo] = useState(false);
    const [labelMessage, setLabelMessage] = useState("");


    const confirmButtonClick = () =>{
        RegisterService.confirm(userId,confirmValue).then(response => {
            if(response !== 11 && response.data){
                if(response.data.returnCode === 99){
                    // myContext.setAppModalVisible(false);
                    myContext.setComponent(<LoginPage/>)
                    window.location.reload();
                }else{
                    setWrongAccountInfo(true);
                }
            }else{

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

    return (
        <div className="register-confirm">
            <div className="register-confirm-item">
                <label>E-Posta ile iletilmiş olan confirm kodunu giriniz. Kayıt işleminiz bu kodun doğrulanması ardından gerçekleştirilecektir.</label>
            </div>

            {failRegisterConfirmMessageLabel()}

            <div className="register-confirm-item">
                <InputText style={{width:'100%'}} placeholder={"Confirm kodunu giriniz"} value={confirmValue} type="text" onChange={(e) => setConfirmValue(e.target.value)}/>
            </div>

            <div className="register-confirm-item">
                <Button className="p-button-warning" style={{width:'100%',height:'45px'}} label={"Üye Ol"} onClick={confirmButtonClick}/>
            </div>

        </div>
    );
}
