import Page1 from '../views/page1/index.jsx';
import HomePage from '../views/HomePage';

const routes = 
  {
    path: "/",
    component: HomePage,
    routes: [
      {
        path: "/page1",
        component: Page1,
      },
    ]
  };

export default routes;