'use strict'

class AdminController {
  async index({view,auth}) {
    var isAdmin = auth.user.isAdmin;
    if (isAdmin == 0) {
      return view.render('admin.index')
    }else{
        return view.render('error.notadmin')
    }
  }

  async demopage({view,auth}) {
    var isAdmin = auth.user.isAdmin;
    if (isAdmin == 0) {
      console.log('demopage admin2');

      return view.render('admin.business.demopage')
    }
  }

  async demopage_add({view,auth}){
    var isAdmin = auth.user.isAdmin;
    if (isAdmin == 0) {
      return view.render('admin.business.demopage_add')
    }else{
        return view.render('error.notadmin')
    }
  }

  async download_site({view,auth}){
    var isAdmin = auth.user.isAdmin;
    if (isAdmin == 0) {
      return view.render('admin.download_site')
    }else{
        return view.render('error.notadmin')
    }
  }
}

module.exports = AdminController
