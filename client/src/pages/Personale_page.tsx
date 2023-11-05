import React, { Component } from 'react';
import Nav_regions from '../components/Nav_header/Nav_regions';
import Nav from '../components/Nav_header/Nav_registr';

class Personale_page extends Component {
    render() {
        return (
            <div>
                <Nav_regions />
                <h1>Личная страница</h1>
            </div>
        );
    }
}

export default Personale_page;