import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '..';
import { RULES_ROUTE } from '../utils/consts';
import { Link } from 'react-router-dom';

function ConditionsForm() {

        const {store} = useContext(Context)

        const Condition = (event: { preventDefault: () => void; }) => {            

            event.preventDefault();
            store.setRegistrationEnd(true);
        }                

        return (
            <form id="condition" onSubmit={Condition}>
                <div className="registr__block">
                    <p className="personale_p">Подтвердите своё согласие с указанными утвеждениями:</p>
                </div>

                <div className="registr__block">
                    <input type="checkbox" className="checkbox" id="registr1" name="registr1" value="idea" required />
                    <label htmlFor="registr1">
                        Я являюсь приверженцем идей, изложенных в серии книг Владимира Мегре Звенящие кедры Росии
                    </label>
                </div>
                <div className="registr__block">
                    <input type="checkbox" className="checkbox" id="registr2" name="registr2" value="founder" required />
                    <label htmlFor="registr2">
                        Я являюсь учредителем своей Родной партии. Целью моей Родной 
                        партии является возвращение в семьи энергии Любви. Моя Родная партия вернет народу 
                        образ жизни и обряды, способные навечно в семьях сохранять любовь. Моя Родная партия 
                        Родину законом узаконит.
                    </label>
                </div>	
                <div className="registr__block">
                    <input type="checkbox" className="checkbox" id="registr3" name="registr3" value="regulations" required />
                    <label htmlFor="registr3">
                        Я согласен(на) с<Link to={RULES_ROUTE} className="regul"> правилами</Link> сайта Родная партия
                    </label>
                </div>
                <div className="registr__block">
                    <input type="checkbox" className="checkbox" id="registr4" name="registr4" value="social" required />
                    <label htmlFor="registr4">
                        Я согласен, что информация о том, что я учредил свою Родную партию и декларация моей Родной партии, 
                        будут размещены в открытом доступе в интернете.
                    </label>
                </div>
            </form> 
        );
    
}

export default observer(ConditionsForm);