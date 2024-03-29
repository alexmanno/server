
/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');
const Env = use('Env');

// Health: Returning if all systems function correctly
Route.get('health', ({
  response,
}) => response.send({
  api: 'success',
  db: 'success',
}));

// API is grouped under '/v1/' route
Route.group(() => {
  // User authentification
  Route.post('auth/signup', 'UserController.signup').middleware('guest');
  Route.post('auth/login', 'UserController.login').middleware('guest');

  // User info
  Route.get('me', 'UserController.me').middleware('auth');

  // Service info
  Route.post('service', 'ServiceController.create').middleware('auth');
  Route.put('service/:id', 'ServiceController.edit').middleware('auth');
  Route.delete('service/:id', 'ServiceController.delete').middleware('auth');
  Route.get('me/services', 'ServiceController.list').middleware('auth');
  Route.put('service/reorder', 'ServiceController.reorder').middleware('auth');
  Route.get('recipe', 'ServiceController.list').middleware('auth');
  Route.post('recipes/update', 'ServiceController.update').middleware('auth');

  // Recipe store
  Route.get('recipes', 'RecipeController.list');
  Route.get('recipes/download/:recipe', 'RecipeController.download');
  Route.get('recipes/search', 'RecipeController.search');
  Route.get('recipes/popular', 'StaticController.popularRecipes');
  Route.get('recipes/update', 'StaticController.emptyArray');

  // Workspaces
  Route.put('workspace/:id', 'WorkspaceController.edit').middleware('auth');
  Route.delete('workspace/:id', 'WorkspaceController.delete').middleware('auth');
  Route.post('workspace', 'WorkspaceController.create').middleware('auth');
  Route.get('workspace', 'WorkspaceController.list').middleware('auth');

  // Static responses
  Route.get('features', 'StaticController.features');
  Route.get('services', 'StaticController.emptyArray');
  Route.get('news', 'StaticController.emptyArray');
  Route.get('payment/plans', 'StaticController.plans');
  Route.get('announcements/:version', 'StaticController.announcement');
}).prefix('v1');

// User dashboard
Route.group(() => {
  // Auth
  Route.get('login', ({ view }) => view.render('dashboard.login')).middleware('guest');
  Route.post('login', 'DashboardController.login').middleware('guest');

  // Dashboard
  Route.get('account', 'DashboardController.account').middleware('auth:session');
  Route.post('account', 'DashboardController.edit').middleware('auth:session');
  Route.get('data', 'DashboardController.data').middleware('auth:session');
  Route.get('delete', ({ view }) => view.render('dashboard.delete')).middleware('auth:session');
  Route.post('delete', 'DashboardController.delete').middleware('auth:session');
  Route.get('logout', 'DashboardController.logout').middleware('auth:session');

  Route.get('*', ({ response }) => response.redirect('/user/account'));
}).prefix('user').middleware('shield');

// Recipe creation
Route.post('new', 'RecipeController.create');
Route.get('new', ({ response, view }) => {
  if (Env.get('IS_CREATION_ENABLED') == 'false') { // eslint-disable-line eqeqeq
    return response.send('This server doesn\'t allow the creation of new recipes.\n\nIf you are the server owner, please set IS_CREATION_ENABLED to true to enable recipe creation.');
  }
  return view.render('others.new');
});

// Franz account import
Route.post('import', 'UserController.import');
Route.get('import', ({ view }) => view.render('others.import'));

// Legal documents
Route.get('terms', ({ response }) => response.redirect('/terms.html'));
Route.get('privacy', ({ response }) => response.redirect('/privacy.html'));

// Index
Route.get('/', ({ view }) => view.render('others.index'));

// 404 handler
Route.get('/*', ({ response }) => response.redirect('/'));
