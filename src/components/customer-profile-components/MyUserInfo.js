import React, {useEffect, useState} from 'react';
import ProfileNavigation from "./ProfileNavigation";

import '../../css/customer-profile.css'

const MyUserInfo = () => {
    const [user, setUser] = useState([]);
    // const history = useHistory();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if(storedUser){
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (

        <div className="catalog">
            <div className="container-items">
                <div className="my-account-page">
                    <ProfileNavigation
                        user={user}
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
export default MyUserInfo;
