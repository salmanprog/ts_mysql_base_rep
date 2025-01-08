/*
|--------------------------------------------------------------------------
| Api Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
*/
import Route from '@ioc:Adonis/Core/Route'
//guest routes
Route
  .group(() => {

    Route.post('user/resend/code','Api/UsersController.resendCode').as('user.resent-code').middleware('apiAuth')
    Route.post('user/verify/code','Api/UsersController.verifyCode').as('user.verify-code').middleware('apiAuth')
    Route.post('user/social-login','Api/UsersController.socialLogin').as('user.social-login')
    Route.post('user/change-password','Api/UsersController.changePassword').as('user.change-password').middleware('apiAuth')
    Route.post('user/forgot-password','Api/UsersController.forgotPassword').as('user.forgot-password')
    Route.post('user/forgot-password-mobile','Api/UsersController.forgotPasswordByMobile').as('user.forgot-password-mobile')
    Route.post('user/login','Api/UsersController.login').as('user.login');
    Route.resource('user', 'Api/UsersController')
      .except(['destroy'])
      .middleware({
        index: ['apiAuth'],
        show: ['apiAuth'],
        update: ['apiAuth'],
      })
  })
  .prefix('api')
  .as('api')
  .middleware(['apiAuthorization'])
// authentication routes
Route
  .group(() => {

    Route.post('user/logout','Api/UsersController.userLogout').as('user.logout');
    Route.post('user/reset-password','Api/UsersController.resetPassword').as('user.reset-password')

    Route.post('notification/test-notification','Api/NotificationController.sendTestNotification').as('test-notification');

    Route.post('gateway/customer','Api/GatewayController.customer').as('gateway-customer');
    Route.post('gateway/card','Api/GatewayController.customerCard').as('gateway-card');
    Route.post('gateway/card/default','Api/GatewayController.makeDefaultCard').as('gateway-default-card');
    Route.post('gateway/card/delete','Api/GatewayController.deleteGatewayCard').as('gateway-delete-card');
    Route.post('gateway/charge','Api/GatewayController.gatewayCharge').as('gateway-charge');
    Route.resource('subscription', 'Api/SubscriptionController').except(['create','update','destroy'])
    Route.resource('property_categories', 'Api/PropertyCategoryController').except(['create','update','destroy'])
    Route.resource('property', 'Api/PropertyController')
    Route.resource('property_task', 'Api/PropertyTaskController')
    Route.resource('insights', 'Api/InsightController').except(['create','update','destroy'])
    Route.get('notification/read', 'Api/NotificationController.readNotification').as('read-notification');
    Route.get('notification/badge-count', 'Api/NotificationController.getBadgeCount').as('notification-badge-count');
    Route.get('notification', 'Api/NotificationController.index').as('notification');
    Route.resource('favourite/insights', 'Api/InsightFavoriteController').except(['update','destroy'])
    Route.delete('delete/favourite/insights','Api/InsightFavoriteController.deleteFavouriteItem').as('delete-favourite-item');
    Route.resource('vendor_categories', 'Api/VendorCategoryController').except(['create','update','destroy'])
    Route.get('subcategories/:id', 'Api/VendorCategoryController.getVendorSubCategory').as('get_vendor_sub_category');
    Route.resource('vendor', 'Api/VendorController').except(['create']);

  })
  .prefix('api')
  .as('api')
  .middleware(['apiAuthorization','apiAuth'])

