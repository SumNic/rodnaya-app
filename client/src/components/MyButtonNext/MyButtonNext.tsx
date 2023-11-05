import React, { Component } from 'react';
import  './MyButtonNext.css'

class MyButtonNext extends Component {
    render() {
        return (
            <div className="block_button">
                <div className="my_batton_next">
                    <input type="submit" form="condition" id="submit" value="Продолжить" />
                </div>
            </div>
            
        );
    }
}

export default MyButtonNext;