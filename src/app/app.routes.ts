import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Panel } from './panel/panel';
import { NewsPanel } from './news-panel/news-panel';
import { SaveNews } from './save-news/save-news';
import { NewsEdit } from './news-edit/news-edit';


export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'panel', component: Panel },
  { path: 'panel_news', component: NewsPanel },
  { path: 'save_news', component: SaveNews },
  { path: 'news/edit/:id', component: NewsEdit },
];
