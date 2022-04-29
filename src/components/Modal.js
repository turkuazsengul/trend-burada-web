import React, {useState,useContext} from 'react';
import {Dialog} from 'primereact/dialog';
import AppContext from "../AppContext";
// import './css/dialog.css'


export const Modal = ({dialogHeaderMessage: header, component: component}) => {

    const myContext = useContext(AppContext)
    const [visible, setVisible] = useState(true);

    // const onHide = () => {
    //     myContext.setAppModalVisible(false);
    // }

    return (
        <div className="base-dialog">
            <Dialog style="p-dialog-titlebar-close" header={header} visible={myContext.appModalVisible}>
                {component}
            </Dialog>
        </div>

    );
}
