import { Component } from 'react';
import NAV_REGIONS from '../components/Nav_header/Nav_regions';

class Personale_page extends Component {
    render() {
        return (
            <div>
                <NAV_REGIONS />
                <h1>Личная страница</h1>
            </div>
        );
    }
}

export default Personale_page;