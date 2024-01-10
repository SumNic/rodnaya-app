import React, { Component, useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import store from '../store/store';
import { Context } from '..';

function OnChangeForm () {
    const [country, setCountry] = useState<string>('')
    const [region, setRegion] = useState<string>('')
    const [locality, setLocality] = useState<string>('')
    const {store} = useContext(Context)

    const [click, setClick] = useState<boolean>(true)

    const [clickCount, setClickCount] = useState<boolean>(true)
    const [selectCount, setSelectCount] = useState<boolean>(false)

    function getCount() {
        if (click) {
            store.getCountry()
            setClick(false)
        }
        return
    }

    getCount()

    function selectCountry(e:any):any {
        setCountry(e)
        store.getRegion(e)
        setSelectCount(true)
    }

    function selectRegion(e:any):any {
        setLocality('')
        store.getRegion(country)
        setRegion(e)
        store.getLocality(e)
    }

    function resetCountry() {
        if(selectCount) {
            setSelectCount(false)
        }
        
        setRegion('')
        if(clickCount && !selectCount) {
            setClickCount(false)
            return 
        }
        setClickCount(true)
    }

    return (
        <div className="block_login_form">
            <select id="country" name="country" onChange={e => selectCountry(e.target.value)} onClick={resetCountry} required>
                <option>Укажите Вашу страну проживания</option>
                {store.country.map( (item: any, index: any) => <option key={index}>{item.country}</option> )}
            </select>
            <select id="region" name="region" onChange={e => selectRegion(e.target.value)} required>
                <option>Укажите Ваш регион проживания</option>
                {country && clickCount && store.region.map( (item: any, index: any) => <option key={index}>{item.region}</option> )}
            </select>
            <select id="locality" name="locality" onChange={e => setLocality(e.target.value)} required>
                <option>Укажите Ваш район проживания</option>
                {region && store.locality.map( (item: any, index: any) => <option key={index}>{item.locality}</option> )}
            </select>
            <button className="button_login" onClick={() => store.saveLocation(country, region, locality)}>
                Сохранить
            </button>
        </div>
    );
}

export default observer(OnChangeForm);