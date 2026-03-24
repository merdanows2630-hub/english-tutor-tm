import React, { createContext, useContext, useState } from 'react';

const LangContext = createContext();

export const translations = {
  tk: {
    home: 'Baş sahypa', dictionary: 'Sözlük', tests: 'Testler',
    rebuses: 'Rebus', profile: 'Profil', admin: 'Admin',
    welcome: 'Hoş geldiňiz!', subtitle: 'Iňlis dilini öwreniň',
    login: 'Giriş', register: 'Hasap açmak', logout: 'Çykmak',
    username: 'Ulanyjy ady', password: 'Açar sözi', email: 'Email',
    search: 'Gözleg...', score: 'Bal', level: 'Dereje',
    startTest: 'Testi başlat', next: 'Indiki', finish: 'Gutarmak',
    correct: 'Dogry!', wrong: 'Nädogry!', result: 'Netije',
    users: 'Ulanyjylar', totalUsers: 'Jemi ulanyjylar',
    noAccount: 'Hasabyňyz ýokmy?', hasAccount: 'Hasabyňyz barmy?',
    name: 'Ady', surname: 'Familiýasy', save: 'Saklamak',
    lessons: 'Sapaklar', words: 'Sözler', completed: 'Tamamlandy',
    stats: 'Statistika', editUser: 'Ulanyjyny üýtget', deleteUser: 'Pozmak',
    allWords: 'Ähli sözler', favorites: 'Saýlananlar',
    addFav: 'Saýlananlara goş', removeFav: 'Aýyr',
    beginner: 'Başlangyç', intermediate: 'Orta', advanced: 'Ösen',
    myProgress: 'Meniň ösüşim', testHistory: 'Test taryhy',
  },
  ru: {
    home: 'Главная', dictionary: 'Словарь', tests: 'Тесты',
    rebuses: 'Ребусы', profile: 'Профиль', admin: 'Админ',
    welcome: 'Добро пожаловать!', subtitle: 'Учите английский язык',
    login: 'Войти', register: 'Регистрация', logout: 'Выйти',
    username: 'Имя пользователя', password: 'Пароль', email: 'Email',
    search: 'Поиск...', score: 'Очки', level: 'Уровень',
    startTest: 'Начать тест', next: 'Далее', finish: 'Завершить',
    correct: 'Правильно!', wrong: 'Неправильно!', result: 'Результат',
    users: 'Пользователи', totalUsers: 'Всего пользователей',
    noAccount: 'Нет аккаунта?', hasAccount: 'Уже есть аккаунт?',
    name: 'Имя', surname: 'Фамилия', save: 'Сохранить',
    lessons: 'Уроки', words: 'Слова', completed: 'Завершено',
    stats: 'Статистика', editUser: 'Изменить', deleteUser: 'Удалить',
    allWords: 'Все слова', favorites: 'Избранные',
    addFav: 'В избранное', removeFav: 'Убрать',
    beginner: 'Начинающий', intermediate: 'Средний', advanced: 'Продвинутый',
    myProgress: 'Мой прогресс', testHistory: 'История тестов',
  },
  en: {
    home: 'Home', dictionary: 'Dictionary', tests: 'Tests',
    rebuses: 'Rebuses', profile: 'Profile', admin: 'Admin',
    welcome: 'Welcome!', subtitle: 'Learn English language',
    login: 'Login', register: 'Register', logout: 'Logout',
    username: 'Username', password: 'Password', email: 'Email',
    search: 'Search...', score: 'Score', level: 'Level',
    startTest: 'Start Test', next: 'Next', finish: 'Finish',
    correct: 'Correct!', wrong: 'Wrong!', result: 'Result',
    users: 'Users', totalUsers: 'Total users',
    noAccount: 'No account?', hasAccount: 'Have an account?',
    name: 'Name', surname: 'Surname', save: 'Save',
    lessons: 'Lessons', words: 'Words', completed: 'Completed',
    stats: 'Statistics', editUser: 'Edit', deleteUser: 'Delete',
    allWords: 'All words', favorites: 'Favorites',
    addFav: 'Add to favorites', removeFav: 'Remove',
    beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced',
    myProgress: 'My progress', testHistory: 'Test history',
  },
};

export function LangProvider({ children }) {
  const [lang, setLang] = useState('tk');
  const t = translations[lang];
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
