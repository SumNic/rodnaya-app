import React, { Component, useContext } from 'react';
import { Context } from '..';
import ConditionsForm from '../components/ConditionsForm';
import Footer from '../components/Footer';
// import FooterCondition from '../components/FooterCondition';
import HeaderLogoRegistr from '../components/HeaderLogoRegistr';
import MyButtonNext from '../components/MyButtonInput';
import OnChangeForm from '../components/OnChangeForm';

function Registration() {

    const {store} = useContext(Context)

        return (
            <div>
                <header className="header">
                    < HeaderLogoRegistr />
                </header>

                <div className="middle">
                    <div className="middle__wrapper">
                        <div className="main__screen main__screen__registr" style={{backgroundSize: "491.4px 491.4px"}}>
                            <div className="form__registr" style={{textAlign: "justify"}}>

                                {!store.isCondition && <ConditionsForm />}

                                {store.isCondition && <OnChangeForm />}

                                <MyButtonNext />
                                
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />

            </div>
        );
}

export default Registration;