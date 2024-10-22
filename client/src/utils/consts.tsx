export const ADMIN_ROUTE = '/admin';
export const LOGIN_ROUTE = '/login';
export const REGISTRATION_ROUTE = '/registration';
export const RESTORE_PROFILE_ROUTE = '/restore-profile';

export const PERSONALE_ROUTE = '/personale_page';
export const MESSAGES_ROUTE = '/messages';
export const EXIT_ROUTE = '/exit';
export const FILES_ROUTE = '/files';

export const HOME_ROUTE = '/home';
export const FOUNDERS_ROUTE = '/founders';
export const PERSONALE_CARD_ROUTE = '/founder';
export const WORKGROUP_ROUTE = '/workgroup';
export const MAIL_ROUTE = '/mail';

export const VK_ROUTE = '/vk';
export const VK_CALLBACK_ROUTE = '/vk-auth';
export const RULES_ROUTE = '/rules';

export const ERROR_ROUTE = '/error';
export const PAGE_404_ROUTE = '/404_not_faund';

export const DONATIONS_ROUTE = '/donations';

export const BLOCKED_ROUTE = '/blocked';

export const HOST = 'http://localhost:3000';
export const DOMEN = 'http://localhost:5000';
export const API_URL = 'http://localhost:5000';

export const SMARTPHONE_WIDTH = 450; // При смене также необходимо заменить в css-файлах "@media (max-width: 450px)"

export enum LocationEnum {
	'locality',
	'region',
	'country',
	'world',
}

export const LOCAL_STORAGE_END_READ_MESSAGE_ID = 'endReadMessageId';
export const LOCAL_STORAGE_DEVICE = 'device';
export const LOCAL_STORAGE_TOKEN = 'token';

export const FOUL_MESSAGES = 'Нарушение';

export enum Rules {
	'Оскорбления участников сайта, автора книг серии Звенящие кедры России (ЗКР) Владимира Мегре, героев этих книг, любых людей.',
	'Разжигать рассовую, межрелигиозную, межнациональную и другую вражду.',
	'Распространять информацию, порочащую честь и достоинство других людей.',
	'Распространять ложную информацию, которая может причинить вред другим людям.',
	'Использовать ненормативную лексику, вести себя грубо, агрессивно.',
	'Многократно тиражировать одни и теже сообщения.',
	'Пропагандировать и распростанять учения и движения, не входящие в рамки идей ЗКР.',
	'Передавать конфиденциальную информацию.',
	'Сообщать о нарушении правил, когда правила не нарушены.',
	'Любые другие нарушения, не попавшие в этот список.',
}

export enum ActionWithFoulMessages {
    'Удалить данное сообщение',
    'Удалить все сообщения пользователя'
}

export enum Punishment {
	'Не блокировать.',
    'Блокировка на сутки.',
    'Блокировка на неделю.',
    'Блокировка на месяц.',
    'Блокировка на год.',
    'Блокировка навсегда.',
}
