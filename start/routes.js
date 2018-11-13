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

  Route.get('/Business', ({view}) => view.render('business/index'));

  //=======啟動 Crontab==========
  Route.get('Cron', 'CronJobController.index')
  // Route.get('CronStart', 'CronJobController.start')
  Route.get('CronStart','CronJobController.start2')

}).middleware(['auth']);

Route.group(()=>{
  //======管理頁面===============
  Route.get('/','AdminController.index') 
  Route.get('/business/demopage','AdminController.demopage')
  Route.get('/business/demopage/add','AdminController.demopage_add')
  Route.get('/download_site','AdminController.download_site')
}).prefix('/admin');
