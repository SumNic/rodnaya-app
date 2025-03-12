import React, { useEffect, useState } from 'react';
import { useThemeContext } from '../../contexts/ThemeContext';
import NavMiddle from '../../components/Nav_middle/NavMiddle';
import { PUBLICATION_ID_ROUTE, PUBLICATION_ROUTE } from '../../utils/consts';
import HeaderLogoMobile from '../../components/HeaderLogo/HeaderLogoMobile';
import { Spin } from 'antd';
import { observer } from 'mobx-react-lite';
import HeaderLogoRegistr from '../../components/HeaderLogo/HeaderLogoRegistr';
import PublicationsList from '../Publications/components/PublicationsList';
import { useStoreContext } from '../../contexts/StoreContext';
import { useParams } from 'react-router-dom';
import { IPost } from '../../models/IPost';
import Footer from '../../components/Footer';

const OnePublication: React.FC = () => {
    const [isLoadPublications, setIsLoadPublications] = useState(false);
    const [publication, setPublication] = useState<IPost[]>();

    const { currentWidth } = useThemeContext();

    const { id } = useParams();

    const { store } = useStoreContext();
	const { getOnePublication } = store.publicationStore;

    useEffect(() => {
		getPublication();
	}, [id]);

	const getPublication = async () => {
		try {
			if (id) {
                setIsLoadPublications(true);
			const response = await getOnePublication(+id);
			if (response?.data) {
				setPublication([response.data]);
			}
			setIsLoadPublications(false);
            }
		} catch (err) {
			setIsLoadPublications(false);
			console.error(`Ошибка в loadPublications: ${err}`);
		}
	};
    
    return (
        <div>
			<header className="header">
				<div className="header__wrapper">
					{currentWidth && currentWidth < 830 && <NavMiddle item={PUBLICATION_ID_ROUTE} />}
					<HeaderLogoMobile />
					<HeaderLogoRegistr />
				</div>
			</header>

			<div className="middle">
				<div className="middle__wrapper">
					{currentWidth && currentWidth >= 830 && <NavMiddle item={PUBLICATION_ROUTE} />}
					<div className="main__screen main__screen_home">
						<div id="list_founders">
							<Spin spinning={isLoadPublications}>
								<PublicationsList publications={publication} />
							</Spin>
						</div>

						<div className="main__screen-flag"></div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
    );
};

export default observer(OnePublication);