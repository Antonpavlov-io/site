import './styles.css';
import { clearSession, getCookieName, loadState, saveState, startSession } from './state';
import { completeCourse, recordTestScore } from './progress';
import { testQuestions } from './content';
import { renderApp } from './views';

const root = document.querySelector<HTMLElement>('#app');

if (!root) {
  throw new Error('Application root was not found.');
}

let state = loadState(document.cookie);

const persist = (): void => {
  document.cookie = saveState(state);
};

const resetCookie = (): void => {
  document.cookie = `${getCookieName()}=; Path=/; Max-Age=0; SameSite=Lax`;
};

const render = (): void => {
  renderApp(root, state);
};

root.addEventListener('submit', (event) => {
  const form = event.target;

  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  if (form.dataset.form === 'quiz') {
    event.preventDefault();
    const values = new FormData(form);
    const correctAnswers = testQuestions.filter((question) => Number(values.get(question.id)) === question.correctIndex).length;
    state = recordTestScore(state, Math.round((correctAnswers / testQuestions.length) * 100));
    persist();
    window.location.hash = '#/profile';
    render();
    return;
  }

  if (form.dataset.form !== 'entry') {
    return;
  }

  event.preventDefault();
  const nickname = new FormData(form).get('nickname');
  state = startSession(typeof nickname === 'string' ? nickname : '');

  if (!state.authenticated) {
    const field = form.elements.namedItem('nickname');

    if (field instanceof HTMLInputElement) {
      field.setCustomValidity('Введите имя или выберите гостевой режим.');
      field.reportValidity();
      field.setCustomValidity('');
    }

    return;
  }

  persist();
  window.location.hash = '#/dashboard';
});

root.addEventListener('click', (event) => {
  const actionTarget = (event.target as HTMLElement).closest<HTMLElement>('[data-action]');

  if (!actionTarget) {
    return;
  }

  if (actionTarget.dataset.action === 'guest') {
    state = startSession('Гость');
    persist();
    window.location.hash = '#/dashboard';
  }

  if (actionTarget.dataset.action === 'complete-course') {
    const courseId = actionTarget.dataset.courseId;

    if (courseId) {
      state = completeCourse(state, courseId);
      persist();
      render();
    }
  }

  if (actionTarget.dataset.action === 'survey') {
    const choice = actionTarget.dataset.choice;

    if (choice) {
      state = { ...state, surveyChoice: choice };
      persist();
      render();
    }
  }

  if (actionTarget.dataset.action === 'reset') {
    state = clearSession();
    resetCookie();
    window.location.hash = '#/';
  }

  if (actionTarget.dataset.action === 'logout') {
    state = clearSession();
    resetCookie();
    window.location.hash = '#/';
  }
});

root.addEventListener('change', (event) => {
  const target = event.target;

  if (!(target instanceof HTMLSelectElement) || !target.matches('[data-course-filter]')) {
    return;
  }

  root.querySelectorAll<HTMLElement>('[data-course-category]').forEach((card) => {
    card.hidden = target.value !== 'all' && card.dataset.courseCategory !== target.value;
  });
});

window.addEventListener('hashchange', render);
render();
