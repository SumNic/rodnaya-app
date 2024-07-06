import { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/logo_registr.png'

class HeaderLogoRegistr extends Component {
    render() {
        return (
            <div className="header__item__registr">
                <div className="header__logo__registr">
                    <Link to="/home" className="header__logo-link__registr">
                        <img src={logo} alt="Родная партия" className="header__logo-pic"></img>
                    </Link>
                </div>
            </div>
        );
    }
}

export default HeaderLogoRegistr;