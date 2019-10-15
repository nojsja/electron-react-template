import HomePage from 'app/views/HomePage.js';
import StartupPage from 'app/views/startup/StartupPage';

export default [
  {
    path: '/',
    component: HomePage,
    // indexRoute: { component: StartupPage },
    childRoutes: [
      {
        path: 'startup',
        component: StartupPage,
      },
    ],
  },
];
