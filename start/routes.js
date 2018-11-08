'use strict'
/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

//==========auth===========================
Route.on('/signup').render('auth.signup');
Route.post('/signup', 'UserController.create').validator('CreateUser');
Route.get('/logout', 'UserController.logout');
Route.on('/login').render('auth.login');
Route.post('/login', 'UserController.login').validator('LoginUser');

//=====================================
Route.group(() => {
  Route.get('/', ({view}) => view.render('welcome'));
  Route.get('/test','CronJobController.start2');

  Route.get('/Business', ({view}) => view.render('business/index'));
  //======管理頁面===============

  //=======啟動 Crontab==========
  Route.get('Cron', 'CronJobController.index')
  Route.get('CronStart', 'CronJobController.start')
}).middleware(['auth']);

