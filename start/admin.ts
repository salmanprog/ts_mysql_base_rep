/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
*/
import Route from '@ioc:Adonis/Core/Route'

Route.group( () => {
  Route.post('login', 'Api/Admin/AuthController.login').as('login');
  Route.resource('application-content', 'Api/Admin/ContentController')
      .middleware({
        index: ['apiAuth'],
  })
}).prefix('api/admin').middleware(['apiAuthorization'])


// authentication routes
Route
.group(() => {

  Route.resource('user', 'Api/Admin/AuthController')
      .middleware({
        index: ['apiAuth'],
  })
  Route.resource('users', 'Api/Admin/UsersController')
      .middleware({
        index: ['apiAuth'],
        update: ['apiAuth'],
  })
  Route.resource('vendors', 'Api/Admin/VendorController')
      .middleware({
        index: ['apiAuth'],
  })
  Route.resource('insights', 'Api/Admin/InsightController')
      .middleware({
        index: ['apiAuth'],
  })
  Route.resource('insights_data', 'Api/Admin/InsightDataController')
      .middleware({
        index: ['apiAuth'],
  })
  Route.resource('properties_types', 'Api/Admin/PropertyCategoryController')
      .middleware({
        index: ['apiAuth'],
  })

  Route.resource('vendor_category', 'Api/Admin/VendorCategoryController')
      .middleware({
        index: ['apiAuth'],
  })
  
  Route.get('dashboard','Api/Admin/UsersController.userDashboard').as('dashboard').middleware('apiAuth')
  Route.post('user/change-password','Api/UsersController.changePassword').as('user.change-password').middleware('apiAuth')
  Route.post('logout','Api/Admin/AuthController.userLogout').as('logout');
  //Menu
  Route.route('application/setting',['GET','POST'],'Api/Admin/ApplicationSettingController.getSetting').as('application.setting');
  
})
.prefix('api/admin')
.as('api/admin')
.middleware(['apiAuthorization','apiAuth'])