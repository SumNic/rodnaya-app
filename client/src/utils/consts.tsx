export const ADMIN_ROUTE = '/admin';
export const REGISTRATION_ROUTE = '/registration';
export const RESTORE_PROFILE_ROUTE = '/restore-profile';

export const MESSAGES_ROUTE = '/messages';
export const EXIT_ROUTE = '/exit';
export const FILES_ROUTE = '/files';

export const HOME_ROUTE = '/home';
export const FOUNDERS_ROUTE = '/founders';
export const PERSONALE_ROUTE = '/founder';
export const GROUP_ROUTE = '/group';
export const ONE_GROUP_ROUTE = '/one-group';
export const MAIL_ROUTE = '/mail';

export const VK_ROUTE = '/vk';
export const VK_CALLBACK_ROUTE = '/vk-auth';
export const RULES_ROUTE = '/rules';

export const ERROR_ROUTE = '/error';
export const PAGE_404_ROUTE = '/404_not_faund';

export const DONATIONS_ROUTE = '/donations';
export const PUBLICATION_ROUTE = '/publications';
export const PUBLICATION_ID_ROUTE = '/get-publication';

export const BLOCKED_ROUTE = '/blocked';

// export const HOST = import.meta.env.DEV
// 	? 'https://prosaically-permanent-wheatear.cloudpub.ru'
// 	: 'https://rod-partya.ru';

export const HOST = import.meta.env.DEV ? 'http://localhost' : 'https://rod-partya.ru';
console.log(import.meta.env.DEV, 'process.env.REACT_APP_MODE');

export const VK_ID_APP = import.meta.env.DEV ? 52706932 : 51729608;
export const API_URL = `${HOST}/api`;

export const SMARTPHONE_WIDTH = 450; // При смене также необходимо заменить в css-файлах "@media (max-width: 450px)"

export enum LocationEnum {
	locality = 'locality',
	region = 'region',
	country = 'country',
	world = 'world',
}

export const LOCAL_STORAGE_END_READ_MESSAGE_ID = 'endReadMessageId';
export const LOCAL_STORAGE_DEVICE = 'device';
export const LOCAL_STORAGE_TOKEN = 'token';
export const LOCAL_STORAGE_IS_MY_GROUPS = 'isMyGroups';

export const FOUL_MESSAGES = 'Нарушение';
export const EDIT_MESSAGES = 'Редактировать';
export const DELETE_MESSAGES = 'Удалить';
export const SHARE = 'Поделиться';
export const GO = 'Перейти';
export const GO_OUT = 'Выйти';

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
	'Удалить все сообщения пользователя',
}

export enum Punishment {
	'Не блокировать.',
	'Блокировка на сутки.',
	'Блокировка на неделю.',
	'Блокировка на месяц.',
	'Блокировка на год.',
	'Блокировка навсегда.',
}

export const COUNT_RESPONSE_POSTS = 20;

export const MESSAGES = 'messages';
export const PUBLICATIONS = 'publications';
export const GROUPS = 'groups';
export const GROUP = 'group';
export const CHAT = 'chat';

export const YANDEX_COUNTER_ID = import.meta.env.DEV ? 104827200 : 104841811;

export const ALLOWED_VIDEO_HOSTS = [
	'youtube.com',
	'youtu.be',
	'vimeo.com',
	'vk.com',
	'rutube.ru',
	'dailymotion.com',
	'ok.ru',
	'odnoklassniki.ru',
	'drive.google.com',
	'tiktok.com',
	't.me',
];
