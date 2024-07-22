import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    EXIT_ROUTE,
    HOME_ROUTE,
    MAIL_ROUTE,
    MESSAGES_ROUTE,
    PERSONALE_ROUTE,
    WORKGROUP_ROUTE,
} from "../../utils/consts";
import logo_40x40 from "../../images/svg/Logotip-Rodnoj-parti-40x40.svg";
import { Badge, Menu } from "antd";
import { useStoreContext } from "../../contexts/StoreContext";

import { useThemeContext } from "../../contexts/ThemeContext";

import styles from "./Nav_middle.module.css"

interface Item {
    item?: string;
}

const NavMiddle: React.FC<Item> = ({ item = "" }) => {
    const [isCollapse, setIsCollapse] = useState<boolean>(true)

    const { store } = useStoreContext();
    const { currentWidth } = useThemeContext();

    const items = [
        {
            key: HOME_ROUTE,
            // icon: <MailOutlined />,
            label: <Link to={HOME_ROUTE}>Главная</Link>,
        },
        {
            key: PERSONALE_ROUTE,
            // icon: <CalendarOutlined />,
            label: <Link to={PERSONALE_ROUTE}>Учредитель</Link>,
        },
        {
            key: MAIL_ROUTE,
            // icon: <CalendarOutlined />,
            label: (
                <Link to={MAIL_ROUTE} className="middle__link">
                    Почта
                    {store.arrCountMessages.length ? (
                        <Badge style={{ boxShadow: "none" }} dot></Badge>
                    ) : (
                        ""
                    )}
                </Link>
            ),
        },
        {
            key: MESSAGES_ROUTE,
            // icon: <CalendarOutlined />,
            label: (
                <Link
                    to={`${MESSAGES_ROUTE}/locality`}
                    className="middle__link"
                >
                    Сообщения
                    {store.arrCountMessages.length ? (
                        <Badge style={{ boxShadow: "none" }} dot></Badge>
                    ) : (
                        ""
                    )}
                </Link>
            ),
        },
        {
            key: WORKGROUP_ROUTE,
            // icon: <CalendarOutlined />,
            label: (
                <Link
                    to={`${WORKGROUP_ROUTE}/locality`}
                    className="middle__link"
                >
                    Группы
                    {store.arrCountMessages.length ? (
                        <Badge style={{ boxShadow: "none" }} dot></Badge>
                    ) : (
                        ""
                    )}
                </Link>
            ),
        },
        {
            key: EXIT_ROUTE,
            // icon: <CalendarOutlined />,
            label: (
                <Link to={EXIT_ROUTE} className="middle__link">
                    Выйти
                </Link>
            ),
        },
    ];

    useEffect(() => {
        if (currentWidth && currentWidth > 830) setIsCollapse(false)
        else setIsCollapse(true)
    }, [currentWidth])

    return (
        <nav className="middle__menu">
            <input id="menu-toggle" type="checkbox"  onClick={() => setIsCollapse(prev => !prev)}/>
            <label className="menu-button-container" htmlFor="menu-toggle">
                <div className="menu-button"></div>
            </label>

            {!isCollapse && <Menu
                className={styles['selected-menu-item']}
                style={{
                    background: (currentWidth && currentWidth > 830) ? "none" : '',
                    fontFamily: "IzhitsaRegular",
                    fontSize: 16,
                    position: (currentWidth && currentWidth < 831) ? 'absolute' : 'relative',
                    top: (currentWidth && currentWidth < 831) ? 20 : 0,
                    marginTop: (currentWidth && currentWidth < 831) ? 30 : 0,
                    left: 0,
                }}
                selectedKeys={[item]}
                items={items}
            />}

            <div className="logo">
                <Link to={HOME_ROUTE} className="header__logo-link">
                    <img
                        src={logo_40x40}
                        alt="Родная партия"
                        className=""
                    ></img>
                </Link>
            </div>
        </nav>
    );
};

export default NavMiddle;
