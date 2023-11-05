import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Footer';
import HeaderLogoMobile from '../HeaderLogoMobile';
import HeaderLogoPc from '../HeaderLogoPc';
import HeaderLogoRegistr from '../HeaderLogoRegistr';
import NavHeaderLoad from '../Nav_header/NavHeaderLoad';
import Nav_registr from '../Nav_header/Nav_registr';
import NavMiddle from '../Nav_middle/NavMiddle';
import logo512 from './logo512.png'
import "./LogoLoad.css";
// import "../../App.css";


class LogoLoad extends Component {
    render() {
        return (
            <div className="LogoLoad">
                <div className="LoadText">
                    <h3>Загрузка...</h3>
                </div>
                
            </div>
        );
        // return (
        //     <div>
        //         <div className="header">
        //             <div className="header__wrapper">
        //                 <div className="header__logo__registr">
        //                     {/* <Link to="home" className="header__logo-link__registr">
        //                         <img src={logo} alt="Родная партия" className="header__logo-pic"></img>
        //                     </Link> */}
        //                 </div>
        //             </div>
        //         </div>

        //         <div className="middle">
        //             <div className="middle__wrapper">
        //                 <nav className="middle__menu" style={{visibility: "hidden"}}>
        //                     <input id="menu-toggle" type="checkbox" />
        //                     <label className='menu-button-container' htmlFor="menu-toggle">
        //                         <div className='menu-button'></div>
        //                     </label>

        //                     <NavMiddle />

        //                     <div className="logo">
        //                         <Link to="/home" className="header__logo-link">
        //                             <img src="../images/svg/Logotip-Rodnoj-parti-40x40.svg" alt="Родная партия" className=""></img>
        //                         </Link>
		// 	                </div>
		//                 </nav>
        //                 <div className="main__screen main__screen_load">
                            

        //                     <div className="main__screen-flag">
                            
        //                     </div>
		//                 </div>
	    //             </div>
        //         </div>

        //         <Footer />

        //     </div>
        // );
    }
    
}

export default LogoLoad;