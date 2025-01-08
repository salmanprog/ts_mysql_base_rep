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


Route
  .group(() => {

      // Named as admin.login

      Route.group( () => {

        Route.route('login',['GET','POST'],'Admin/AuthController.login').as('login')
        Route.route('forgot-password',['GET','POST'],'Admin/AuthController.forgotPassword').as('forgot-password');
        Route.route('reset-pass/:email',['GET','POST'],'Admin/AuthController.resetPassword').as('reset-password');
      }).middleware('adminRedirectIfAuthenticate')


      Route.group( () => {

          Route.get('dashboard/small-widget','Admin/DashboardController.getSmallWidget').as('admin.dashboard.small-widget');
          Route.get('dashboard/line-chart','Admin/DashboardController.getLineChart').as('admin.dashboard.line-chart');
          Route.get('dashboard','Admin/DashboardController.index').as('dashboard')
          Route.route('profile',['GET','POST'],'Admin/AdminController.profile').as('profile');
          Route.route('change-password',['GET','POST'],'Admin/AdminController.changePassword').as('change-password')
          Route.get('logout','Admin/AdminController.logout').as('logout');

          Route.route('application-setting',['GET','POST'],'Admin/ApplicationSettingController.setting').as('application-setting');

          Route.get('user/ajax-listing','Admin/UserController.ajaxListing').as('user.ajaxlsiting');
          Route.resource('user', 'Admin/UserController').except(['store','destroy']);

          Route.get('faq/ajax-listing','Admin/FaqController.ajaxListing').as('faq.ajaxlsiting');
          Route.resource('faq', 'Admin/FaqController');

          Route.get('content/ajax-listing','Admin/ContentController.ajaxListing').as('content.ajaxlsiting');
          Route.resource('content','Admin/ContentController').except(['store','destroy']);

      }).middleware('adminAuth')
   })
  .prefix('admin')
  .as('admin')
