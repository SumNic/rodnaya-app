import { Component } from 'react';
import { Link } from 'react-router-dom';

class Footer extends Component {
    render() {
        return (
            <footer className="footer">
                <div className="footer__wrapper">
                    <div className="footer__bufer">
                    </div>
                    <div className="footer__">
                        <div className="footer__prices">
                            <Link to="donations" className="footer__link">Поддержать проект</Link>
                        </div>	
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;