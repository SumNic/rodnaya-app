import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
// import { Context } from "..";
import MyButton from "./MyButton";
import { useNavigate } from "react-router-dom";
import { LOCAL_STORAGE_END_READ_MESSAGE_ID, PERSONALE_ROUTE } from "../utils/consts";
import { useStoreContext } from "../contexts/StoreContext";
import { LocationUser } from "../models/LocationUser";

function OnChangeForm(props: any) {
    const { id, secret } = props;

    const navigate = useNavigate();

    const [country, setCountry] = useState<string>("");
    const [region, setRegion] = useState<string>("");
    const [locality, setLocality] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    // const { store } = useContext(Context);
    const { store } = useStoreContext();

    const [click, setClick] = useState<boolean>(true);

    const [clickCount, setClickCount] = useState<boolean>(true);
    const [selectCount, setSelectCount] = useState<boolean>(false);

    const [clickButton, setClickButton] = useState<boolean>(false);

    function getCount() {
        if (click) {
            store.getCountry();
            setClick(false);
        }
        return;
    }

    getCount();

    function selectCountry(e: string): void {
        setCountry(e);
        store.getRegion(e);
        setSelectCount(true);
    }

    function selectRegion(e: string): void {
        setLocality("");
        store.getRegion(country);
        setRegion(e);
        store.getLocality(e);
    }

    function resetCountry() {
        if (selectCount) {
            setSelectCount(false);
        }

        setRegion("");
        if (clickCount && !selectCount) {
            setClickCount(false);
            return;
        }
        setClickCount(true);
    }

    useEffect(() => {
        setClickButton(false);
    }, [click, clickCount]);

    function buttonClick() {
        setClickButton(true);
        if (country && region && locality) {
            const dto = {
                id,
                country,
                region,
                locality,
                secret,
            };
            store.saveResidency(dto).then((data: any) => {
                if (data.error) {
                    var options: {} = {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        timezone: "UTC",
                        hour: "numeric",
                        minute: "numeric",
                    };
                    let dataStopEditResidency = new Date(
                        +data.error
                    ).toLocaleString("ru", options);
                    setMessage(dataStopEditResidency);
                } else {
                    localStorage.removeItem(LOCAL_STORAGE_END_READ_MESSAGE_ID);
                    const userWithoutResidency = {...store.user, residency: {} as LocationUser}
                    store.setUser(userWithoutResidency)
                    store
                        .loginVk(dto.id, dto.secret)
                        .then(() => navigate(PERSONALE_ROUTE));
                    store.setCancelAction(true); // закрывается окно редактирования в Personale_page
                }
            });
        }
    }

    function cancel() {
        store.setRegistrationEnd(false);
        store.setCancelAction(true); // закрывается окно редактирования в Personale_page
    }

    return (
        <>
            <h2 style={{ fontSize: "20px" }}>
                При сохранении либо изменении места жительства учитывайте, что
                при неправильном указании данных, в следующий раз поменять
                данные о месте жительства можно будет только через 1 месяц!
            </h2>
            <div className="block_login_form">
                <select
                    id="country"
                    name="country"
                    onChange={(e) => selectCountry(e.target.value)}
                    onClick={resetCountry}
                    style={{ color: !country && clickButton ? "red" : "" }}
                    required
                >
                    <option>Укажите Вашу страну проживания</option>
                    {store.country.map((item: any, index: any) => (
                        <option key={index}>{item.country}</option>
                    ))}
                </select>
                <select
                    id="region"
                    name="region"
                    onChange={(e) => selectRegion(e.target.value)}
                    onClick={() => setClickButton(false)}
                    style={{ color: !region && clickButton ? "red" : "" }}
                    required
                >
                    <option>Укажите Ваш регион проживания</option>
                    {country &&
                        clickCount &&
                        store.region.map((item: any, index: any) => (
                            <option key={index}>{item.region}</option>
                        ))}
                </select>
                <select
                    id="locality"
                    name="locality"
                    onChange={(e) => setLocality(e.target.value)}
                    onClick={() => setClickButton(false)}
                    style={{ color: !locality && clickButton ? "red" : "" }}
                    required
                >
                    <option>Укажите Ваш район проживания</option>
                    {region &&
                        store.locality.map((item: any, index: any) => (
                            <option key={index}>{item.locality}</option>
                        ))}
                </select>
                <h2 style={{ fontSize: "20px", color: "red" }}>
                    {message &&
                        `Вы не можете сменить место жительства до ${message}`}
                </h2>
                <div style={{ display: "flex" }}>
                    <MyButton text="Сохранить" func={buttonClick} />
                    <MyButton
                        text="Отменить"
                        func={cancel}
                        style={{ background: "#bbbb50" }}
                    />
                </div>
            </div>
        </>
    );
}

export default observer(OnChangeForm);
