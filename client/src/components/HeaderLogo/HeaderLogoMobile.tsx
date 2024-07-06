import { Link } from 'react-router-dom';
import logo from '../../images/svg/Logotip-Rodnoj-parti-40x40.svg';

function HeaderLogoMobile () {
    return (
        <div className="header__logo-mobile">
            <Link to="/home" className="header__logo-link">
                <img src={logo} alt="Родная партия" className="header__logo-pic"></img>
            </Link>
        </div> 
    );
}

export default HeaderLogoMobile;