import React, { Component } from 'react';
import ConditionsForm from '../components/ConditionsForm';
import Footer from '../components/Footer';
import FooterCondition from '../components/FooterCondition';
import HeaderLogoRegistr from '../components/HeaderLogoRegistr';
import MyButtonNext from '../components/MyButtonNext/MyButtonNext';

class Registration extends Component {
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

                                <ConditionsForm />

                                <MyButtonNext />
                                
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />

            </div>
        );
    }
}

export default Registration;