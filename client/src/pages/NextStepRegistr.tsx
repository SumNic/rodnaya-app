import React, { Component } from 'react';
import Footer from '../components/Footer';
import HeaderLogoRegistr from '../components/HeaderLogoRegistr';
import LoginForm from '../components/LoginForm/LoginForm';
import RegistrationForm from '../components/LoginForm/RegistrationForm';
import OnChangeForm from '../components/OnChangeForm/OnChangeForm';

class NextStepRegistr extends Component {
    render() {
        return (
            <div>
                <header className="header">
                    < HeaderLogoRegistr />
                </header>

                <div className="middle">
                    <div className="middle__wrapper">
                        <div className="main__screen main__screen__registr" style={{backgroundSize: "491.4px 491.4px"}}>
                            <div className="form__registr" style={{textAlign: "justify"}}> 

                                <OnChangeForm />                           

                                <RegistrationForm />
                                
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />

            </div>
        );
    }
}

export default NextStepRegistr;