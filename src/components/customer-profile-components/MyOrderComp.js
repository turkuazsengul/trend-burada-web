import React, {useContext} from 'react';
import ProfileNavigation from "./ProfileNavigation";
import '../../css/customer-profile.css'
import AppContext from "../../AppContext";

const MyOrderComp = () => {
    const myContext = useContext(AppContext)

    return (

        <div className="catalog">
            <div className="container-items">
                <div className="my-account-page">
                    <ProfileNavigation
                        // user={myContext.user.name}
                        user="TEST"

                    />


                    <div className="process-column">
                        <div className="process-row">
                            <div>TEST-ACCOUNT</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyOrderComp;
