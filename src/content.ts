export const portalStats = [
  { value: '4', label: 'учебных модуля' },
  { value: '12', label: 'минут до результата' },
  { value: '0', label: 'данных вне браузера' },
];

export const currentModule = {
  eyebrow: 'Сейчас в работе',
  title: 'Сервис в пути',
  description: 'Короткий стартовый модуль о внимательном сервисе, ритме команды и комфорте гостей.',
  duration: '8 минут',
};

export interface Course {
  id: string;
  category: 'Сервис' | 'Команда' | 'Безопасность';
  title: string;
  description: string;
  duration: string;
  tone: 'coral' | 'blue' | 'gold' | 'ink';
}

export const courses: Course[] = [
  { id: 'service-basics', category: 'Сервис', title: 'Сервис в пути', description: 'Как заметить потребность гостя ещё до обращения.', duration: '8 минут', tone: 'coral' },
  { id: 'team-rhythm', category: 'Команда', title: 'Ритм команды', description: 'Договорённости, которые помогают смене работать спокойнее.', duration: '6 минут', tone: 'blue' },
  { id: 'safe-service', category: 'Безопасность', title: 'Безопасная подача', description: 'Небольшие привычки, которые делают сервис надёжнее.', duration: '10 минут', tone: 'gold' },
  { id: 'warm-dialogue', category: 'Сервис', title: 'Тёплый диалог', description: 'Слова и интонации для простого человеческого контакта.', duration: '7 минут', tone: 'ink' },
  { id: 'first-five-minutes', category: 'Сервис', title: 'Первые пять минут', description: 'Как задать тон встрече и быстро сориентировать гостя.', duration: '5 минут', tone: 'coral' },
  { id: 'clear-handover', category: 'Команда', title: 'Передача смены', description: 'Короткий алгоритм, чтобы важное не потерялось в пути.', duration: '9 минут', tone: 'blue' },
  { id: 'calm-conflict', category: 'Безопасность', title: 'Спокойный диалог', description: 'Как действовать при сложной просьбе без лишнего напряжения.', duration: '12 минут', tone: 'gold' },
  { id: 'smart-display', category: 'Сервис', title: 'Подача без суеты', description: 'Порядок действий, который сохраняет темп и внимание к деталям.', duration: '7 минут', tone: 'ink' },
];

export const weeklyBriefs = [
  { day: 'Пн', title: 'Внимание к маршруту', text: 'Проверьте стартовую подготовку точки до прихода первых гостей.', accent: 'coral' },
  { day: 'Ср', title: 'Ясные договорённости', text: 'Обсудите с коллегой одну задачу, которую можно передавать проще.', accent: 'blue' },
  { day: 'Пт', title: 'Минута обратной связи', text: 'Отметьте один приём, который помог сделать сервис теплее.', accent: 'gold' },
];

export const testQuestions = [
  {
    id: 'attention',
    question: 'С чего лучше начать разговор с гостем?',
    answers: ['С оценки его настроения', 'С спокойного приветствия и открытого вопроса', 'С подробного описания меню'],
    correctIndex: 1,
  },
  {
    id: 'teamwork',
    question: 'Что помогает команде в напряжённый момент?',
    answers: ['Передать короткую понятную информацию', 'Работать молча и отдельно', 'Отложить все вопросы до конца смены'],
    correctIndex: 0,
  },
  {
    id: 'service',
    question: 'Как корректно реагировать на просьбу, которую нельзя выполнить сразу?',
    answers: ['Пообещать без проверки', 'Объяснить следующий шаг и вернуться с ответом', 'Не отвечать, пока не появится решение'],
    correctIndex: 1,
  },
  {
    id: 'care',
    question: 'Какой признак хорошего сервиса самый важный?',
    answers: ['Гость понимает, что его услышали', 'Все действия происходят максимально быстро', 'В разговоре используется формальный тон'],
    correctIndex: 0,
  },
];
