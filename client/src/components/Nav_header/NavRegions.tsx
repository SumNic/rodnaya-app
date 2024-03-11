import { Component } from 'react';
import { Link } from 'react-router-dom';
import { MESSAGES_ROUTE } from '../../utils/consts';
import { observer } from 'mobx-react-lite';
// import { COUNTRY_ROUTE, LOCALITY_ROUTE, REGION_ROUTE, WORLD_ROUTE } from '../../utils/consts';

interface Props {
    location: string;
  }

function NavRegions (props: Props) {

	let style1 = {}
	let style2 = {}
	let style3 = {}
	let style4 = {}
	let classN1 = ''
	let classN2 = ''

	if (props.location === 'locality') {
		style1 = {borderBottom:"none", borderRadius: "20px 20px 0 0"}
		style2 ={backgroundColor: "white", borderRadius: "20px 0 0 20px"}
		style3 ={backgroundColor: "white"}
		style4 ={backgroundColor: "white"}
	}
	if (props.location === 'region') {
		style1 = {backgroundColor: "white", borderRadius: "20px 20px 20px 0", borderRight: "1px solid black", zIndex:"0"}
		style2= {borderBottom:"none", borderRadius: "20px 20px 0 0", borderLeft:"none"}
		style3= {backgroundColor:"white", borderRadius: "20px 0 0 20px"}
		style4= {backgroundColor:"white"}
	}
	if (props.location === 'country') {
		style1 = {backgroundColor: "white"}
		style2 = {backgroundColor: "white", borderRadius: "0 20px 20px 0", borderRight: "1px solid black", zIndex:"0"}
		classN1 = 'header__item_second'
		style3= {borderBottom:"none", borderRadius: "20px 20px 0 0", borderLeft:"none"}
		style4 ={backgroundColor: "white", borderRadius: "20px 20px 0 20px"}
	}
	if (props.location === 'world') {
		style1 = {backgroundColor:"white"}
		style2 = {backgroundColor:"white"}
		style3 = {backgroundColor: "white", borderRadius: "0 20px 20px 0", borderRight: "1px solid black", zIndex:"0"}
		classN2 = 'header__item_second'
		style4= {borderBottom:"none", borderRadius: "20px 20px 0 0", borderLeft:"none"}
	}

	return (
		<nav className="header__menu">
			<ul className="header__list">
				<li className='header__item  header__item_second' style={style1}>
					<Link to={`${MESSAGES_ROUTE}/locality`} className="header__link">Район</Link>
				</li>
				<li className={"header__item " + classN1} style={style2}>
					<Link to={`${MESSAGES_ROUTE}/region`} className="header__link">Регион</Link>
				</li>
				<li className={"header__item " + classN2} style={style3}>
					<Link to={`${MESSAGES_ROUTE}/country`} className="header__link">Страна</Link>
				</li>
				<li className="header__item" style={style4}>
					<Link to={`${MESSAGES_ROUTE}/world`} className="header__link">Планета</Link>
				</li>											
			</ul>
		</nav>
	);
}

export default observer(NavRegions);