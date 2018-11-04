'use strict'
/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome');
Route.on('/test').render('test')

Route.on('/Business').render('business.index')
//=======啟動 Crontab==========
Route.get('Cron','CronJobController.index')
Route.get('CronStart','CronJobController.start')


//===============default_zone===================
Route.group(()=>{
    Route.get('/:size/:site',( {view,params}) => {
        const path = "DemoPage.page.default_zone."+params.size+"."+params.site;
        return view.render(path);
    })
}).prefix('DemoPage/page/default_zone')