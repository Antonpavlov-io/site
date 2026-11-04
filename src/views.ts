import { courses, currentModule, portalStats, testQuestions, weeklyBriefs } from './content';
import { getProgressPercent } from './progress';
import { resolveRoute, type Route } from './router';
import type { PortalState } from './types';

const escapeHtml = (value: string): string => value.replace(/[&<>'"]/g, (symbol) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
})[symbol] ?? symbol);

const icon = (name: 'arrow' | 'shield' | 'spark' | 'book' | 'chart'): string => {
  const paths = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    shield: '<path d="M12 3 5.5 6v5.3c0 4.1 2.8 7.9 6.5 9.7 3.7-1.8 6.5-5.6 6.5-9.7V6L12 3Z"/><path d="m9.5 12 1.7 1.7 3.6-4"/>',
    spark: '<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/>',
    book: '<path d="M4 5.8C6.7 4.4 9.3 4.5 12 6v13c-2.7-1.5-5.3-1.6-8 0v-13.2Z"/><path d="M20 5.8c-2.7-1.4-5.3-1.3-8 .2v13c2.7-1.5 5.3-1.6 8 0v-13.2Z"/>',
    chart: '<path d="M5 20V10M12 20V4M19 20v-7"/><path d="M3 20h18"/>',
  };

  return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
};

const header = (activeRoute: Route, authenticated: boolean): string => `
  <header class="site-header">
    <a class="brand" href="#/dashboard" aria-label="Платформа обучения">
      <span class="brand-mark"><i></i><i></i><i></i></span>
      <span><strong>Пульс сервиса</strong><small>обучение в движении</small></span>
    </a>
    ${authenticated ? `
      <nav class="top-nav" aria-label="Основная навигация">
        <a class="${activeRoute === 'dashboard' ? 'is-active' : ''}" href="#/dashboard">Главная</a>
        <a class="${activeRoute === 'courses' ? 'is-active' : ''}" href="#/courses">Модули</a>
        <a class="${activeRoute === 'profile' ? 'is-active' : ''}" href="#/profile">Результаты</a>
      </nav>
      <button class="avatar-button" type="button" data-action="logout" aria-label="Выйти из демо">${escapeHtml(activeRoute === 'entry' ? '' : 'Выйти')}</button>` : ''}
  </header>`;

const entryView = (): string => `
  <main class="entry-shell">
    <section class="entry-copy">
      <p class="eyebrow">Платформа навыков для команды</p>
      <h1>Сервис, который<br><em>остаётся с гостем.</em></h1>
      <p class="lead">Короткие модули, проверка знаний и понятный личный прогресс — в одном спокойном рабочем пространстве.</p>
      <div class="feature-pills">
        <span>${icon('spark')} 4 мини-модуля</span>
        <span>${icon('chart')} личный прогресс</span>
      </div>
    </section>
    <section class="entry-panel" aria-labelledby="entry-title">
      <div class="panel-glow"></div>
      <p class="panel-kicker">Демонстрационный доступ</p>
      <h2 id="entry-title">Начать обучение</h2>
      <p>Назовите себя так, как вам удобно. Никакие данные не отправляются и не хранятся на сервере.</p>
      <form class="entry-form" data-form="entry">
        <label for="nickname">Ваше имя на этой вкладке</label>
        <input id="nickname" name="nickname" maxlength="32" autocomplete="off" placeholder="Например, Саша" />
        <button class="button button-primary" type="submit">Продолжить ${icon('arrow')}</button>
      </form>
      <button class="button button-quiet" type="button" data-action="guest">Войти как гость</button>
      <p class="privacy-note">${icon('shield')} Это не защищённый аккаунт. Прогресс хранится только в cookie этого браузера.</p>
    </section>
    <aside class="rail-card" aria-label="Преимущества платформы">
      <div class="rail-window"><span></span><span></span><span></span></div>
      <div class="rail-card-content">
        <span class="rail-tag">Новый маршрут</span>
        <h2>Учиться в своём темпе — даже между рейсами.</h2>
        <p>Один короткий модуль за раз. Без перегруза и лишних форм.</p>
      </div>
      <div class="rail-metric"><strong>08</strong><span>минут<br>на модуль</span></div>
    </aside>
  </main>`;

const dashboardView = (state: PortalState): string => `
  <main class="portal-shell">
    <section class="welcome-card">
      <div>
        <p class="eyebrow">Добро пожаловать, ${escapeHtml(state.nickname)}</p>
        <h1>Ваш маршрут на сегодня</h1>
        <p>Выберите короткую тему, отметьте пройденное и посмотрите, как растёт ваш личный прогресс.</p>
        <a class="button button-primary" href="#/courses">Открыть модули ${icon('arrow')}</a>
      </div>
      <div class="welcome-orbit" aria-hidden="true"><span></span><span></span><b>${icon('spark')}</b></div>
    </section>
    <section class="stats-grid" aria-label="Статистика платформы">
      ${portalStats.map((stat) => `<article><strong>${stat.value}</strong><span>${stat.label}</span></article>`).join('')}
    </section>
    <section class="dashboard-grid">
      <article class="module-card">
        <div class="card-icon card-icon-red">${icon('book')}</div>
        <p class="eyebrow">${currentModule.eyebrow}</p>
        <h2>${currentModule.title}</h2>
        <p>${currentModule.description}</p>
        <footer><span>${currentModule.duration}</span><a href="#/courses">К модулю ${icon('arrow')}</a></footer>
      </article>
      <article class="progress-card">
        <p class="eyebrow">Ваш прогресс</p>
        <div class="progress-ring" style="--progress: ${getProgressPercent(state, courses.length)}"><strong>${getProgressPercent(state, courses.length)}<small>%</small></strong></div>
        <p>${state.completedCourseIds.length === 0 ? 'Начните с первого модуля — результат появится здесь.' : 'Ваши отметки хранятся только на этом устройстве.'}</p>
        <a href="#/profile">Посмотреть результаты</a>
      </article>
    </section>
    <section class="quick-grid">
      <a href="#/test"><span class="card-icon">${icon('chart')}</span><strong>Проверить знания</strong><small>4 коротких вопроса</small></a>
      <a href="#/survey"><span class="card-icon">${icon('spark')}</span><strong>Оставить отзыв</strong><small>анонимно, в этом браузере</small></a>
    </section>
    <section class="dashboard-section">
      <div class="section-title"><div><p class="eyebrow">Небольшой фокус</p><h2>На этой неделе</h2></div><span>3 шага для команды</span></div>
      <div class="briefing-grid">${weeklyBriefs.map((brief, index) => `<article class="briefing-card briefing-${brief.accent}"><span>${brief.day}</span><div><small>Шаг ${index + 1}</small><h3>${brief.title}</h3><p>${brief.text}</p></div></article>`).join('')}</div>
    </section>
    <section class="dashboard-section split-section">
      <article class="activity-panel"><div><p class="eyebrow">Коллекция навыков</p><h2>Ваш следующий маленький шаг</h2><p>Пройдите любой модуль, чтобы открыть первый знак прогресса.</p><a href="#/courses">Выбрать модуль ${icon('arrow')}</a></div><div class="badge-stack" aria-hidden="true"><span>01</span><span>02</span><span>03</span></div></article>
      <article class="tip-panel"><span class="tip-symbol">✦</span><p class="eyebrow">Подсказка дня</p><h2>Один точный вопрос часто полезнее длинного объяснения.</h2><p>Попробуйте начать разговор с гостем с простого: «Чем я могу помочь прямо сейчас?»</p></article>
    </section>
  </main>`;

const coursesView = (state: PortalState): string => `
  <main class="portal-shell learning-page">
    <div class="page-heading">
      <div><p class="eyebrow">Библиотека навыков</p><h1>Модули обучения</h1><p>Короткие карточки для уверенной работы в сервисе.</p></div>
      <label class="filter-control">Показать <select data-course-filter><option value="all">Все темы</option><option value="Сервис">Сервис</option><option value="Команда">Команда</option><option value="Безопасность">Безопасность</option></select></label>
    </div>
    <section class="course-grid" aria-label="Список учебных модулей">
      ${courses.map((course, index) => {
        const completed = state.completedCourseIds.includes(course.id);
        return `<article class="course-card course-card-${course.tone}" data-course-category="${course.category}">
          <div class="course-card-top"><span>${course.category}</span><small>0${index + 1}</small></div>
          <div class="course-symbol">${icon(index % 2 === 0 ? 'book' : 'spark')}</div>
          <h2>${course.title}</h2><p>${course.description}</p>
          <footer><span>${course.duration}</span><button class="course-action ${completed ? 'is-complete' : ''}" type="button" data-action="complete-course" data-course-id="${course.id}" ${completed ? 'disabled' : ''}>${completed ? 'Пройдено' : 'Отметить пройденным'}</button></footer>
        </article>`;
      }).join('')}
    </section>
  </main>`;

const testView = (state: PortalState): string => `
  <main class="portal-shell learning-page">
    <div class="page-heading"><div><p class="eyebrow">Самопроверка</p><h1>Четыре вопроса</h1><p>Это тренировочный тест. Итог остаётся только в cookie вашего браузера.</p></div>${state.testScore !== null ? `<div class="score-chip">Лучший результат <strong>${state.testScore}%</strong></div>` : ''}</div>
    <form class="quiz-card" data-form="quiz">
      ${testQuestions.map((item, questionIndex) => `<fieldset><legend><span>0${questionIndex + 1}</span>${item.question}</legend>${item.answers.map((answer, answerIndex) => `<label class="answer-option"><input type="radio" name="${item.id}" value="${answerIndex}" required /><span>${answer}</span></label>`).join('')}</fieldset>`).join('')}
      <button class="button button-primary" type="submit">Показать результат ${icon('arrow')}</button>
    </form>
  </main>`;

const surveyView = (state: PortalState): string => `
  <main class="portal-shell learning-page">
    <section class="survey-card"><p class="eyebrow">Пульс команды</p><h1>Как вам формат?</h1><p>Один анонимный выбор поможет сохранить обратную связь прямо в этой вкладке. Никуда он не отправляется.</p><div class="rating-row" role="group" aria-label="Оцените формат">${[1, 2, 3, 4, 5].map((rating) => `<button type="button" class="rating-button ${state.surveyChoice === String(rating) ? 'is-selected' : ''}" data-action="survey" data-choice="${rating}" aria-label="Оценка ${rating} из 5">${rating}</button>`).join('')}</div>${state.surveyChoice ? `<p class="survey-thanks">Спасибо! Ваша оценка: ${state.surveyChoice}/5.</p>` : ''}</section>
  </main>`;

const profileView = (state: PortalState): string => {
  const progress = getProgressPercent(state, courses.length);
  return `<main class="portal-shell learning-page"><section class="profile-hero"><div class="profile-initial">${escapeHtml(state.nickname.slice(0, 1).toUpperCase())}</div><div><p class="eyebrow">Личное пространство</p><h1>${escapeHtml(state.nickname)}</h1><p>Демонстрационный профиль без персональных данных.</p></div><button class="button button-quiet-dark" type="button" data-action="reset">Сбросить мои данные</button></section><section class="results-grid"><article><span>Общий прогресс</span><strong>${progress}%</strong><div class="bar"><i style="width: ${progress}%"></i></div></article><article><span>Модули</span><strong>${state.completedCourseIds.length}/${courses.length}</strong><p>отмечено пройденными</p></article><article><span>Лучший тест</span><strong>${state.testScore === null ? '—' : `${state.testScore}%`}</strong><p>${state.testScore === null ? 'ещё не пройден' : 'сохранён локально'}</p></article></section><section class="local-note">${icon('shield')} <div><strong>Всё хранится только в этом браузере.</strong><span>Кнопка сброса удалит псевдоним, отметки, тест и оценку. Настоящей авторизации здесь нет.</span></div></section></main>`;
};

export const renderApp = (root: HTMLElement, state: PortalState): void => {
  const route = resolveRoute(window.location.hash, state.authenticated);

  if (state.authenticated && route !== 'entry' && window.location.hash !== `#/${route}`) {
    window.location.hash = `#/${route}`;
  }

  const views: Record<Route, string> = {
    entry: entryView(),
    dashboard: dashboardView(state),
    courses: coursesView(state),
    test: testView(state),
    survey: surveyView(state),
    profile: profileView(state),
  };

  root.innerHTML = `${header(route, state.authenticated)}${views[route]}`;
};
