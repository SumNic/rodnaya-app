import React, { Component, useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import store from '../store/store';
import { Context } from '..';
import MyButton from './MyButton';

function OnChangeForm () {
    const [country, setCountry] = useState<string>('')
    const [region, setRegion] = useState<string>('')
    const [locality, setLocality] = useState<string>('')
    const {store} = useContext(Context)

    const [click, setClick] = useState<boolean>(true)

    const [clickCount, setClickCount] = useState<boolean>(true)
    const [selectCount, setSelectCount] = useState<boolean>(false)

    const [clickButton, setClickButton] = useState<boolean>(false)

    function getCount() {
        if (click) {
            store.getCountry()
            setClick(false)
        }
        return
    }

    getCount()

    function selectCountry(e: string): void {
        setCountry(e)
        store.getRegion(e)
        setSelectCount(true)
    }

    function selectRegion(e: string): void {
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

    useEffect(()=>{
        setClickButton(false)
    },[click, clickCount])

    function buttonClick() {
        setClickButton(true)
        if(country && region && locality) {
            store.saveLocation(country, region, locality)
        }
    }

    return (
        <div className="block_login_form">
            <select id="country" name="country" onChange={e => selectCountry(e.target.value)} onClick={resetCountry} style={{color: !country && clickButton ? 'red' : ''}} required>
                <option>Укажите Вашу страну проживания</option>
                {store.country.map( (item: any, index: any) => <option key={index}>{item.country}</option> )}
            </select>
            <select id="region" name="region" onChange={e => selectRegion(e.target.value)} onClick={()=>setClickButton(false)} style={{color: !region && clickButton ? 'red' : ''}} required>
                <option>Укажите Ваш регион проживания</option>
                {country && clickCount && store.region.map( (item: any, index: any) => <option key={index}>{item.region}</option> )}
            </select>
            <select id="locality" name="locality" onChange={e => setLocality(e.target.value)} onClick={()=>setClickButton(false)} style={{color: !locality && clickButton ? 'red' : ''}} required>
                <option>Укажите Ваш район проживания</option>
                {region && store.locality.map( (item: any, index: any) => <option key={index}>{item.locality}</option> )}
            </select>
            <MyButton text="Завершить регистрацию" func={buttonClick}/>
        </div>
    );
}

export default observer(OnChangeForm);