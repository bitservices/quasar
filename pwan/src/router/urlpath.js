const BASEPATH = "http://localhost:8000";
const APP_PATH = BASEPATH + "/api/pwanproperties/";
const path = {
  CLIENT_CREATE: APP_PATH + "client/create/",
  CLIENT_UPDATE: APP_PATH + "client/update/",
  CLIENT_FIND_BY_CREATOR: APP_PATH + "client/findbycreator/",
  CLIENT_SEARCH: APP_PATH + "client/search/",
  CLIENT_REMOVE: APP_PATH + "client/remove/",
  CLIENT_ACTIVATE: APP_PATH + "client/activate/",
  CLIENT_DEACTIVATE: APP_PATH + "client/deactivate/",

  PROSPECT_CUSTOMER_ALL: APP_PATH + "prospect/",
  PROSPECT_CUSTOMER_FIND_BY_USER: APP_PATH + "prospect/listbyuser/",
  PROSPECT_CUSTOMER_CREATE: APP_PATH + "prospect/create/",
  PROSPECT_CUSTOMER_UPDATE: APP_PATH + "prospect/update/",
  PROSPECT_CUSTOMER_REMOVE: APP_PATH + "prospect/remove/",
  PROSPECT_CUSTOMER_SEARCH: APP_PATH + "prospect/search/",
  COUNTRY_ALL: APP_PATH + "country/",

  STATE_ALL: APP_PATH + "state/",
  STATE_CREATE: APP_PATH + "state/create/",
  STATE_UPDATE: APP_PATH + "state/update/",
  STATE_REMOVE: APP_PATH + "state/remove",
  STATE_SEARCH: APP_PATH + "state/search",

  STATUS_ALL: APP_PATH + "status/",

  MENU_CREATE: APP_PATH + "menu/create/",
  MENU_UPDATE: APP_PATH + "menu/update/",
  MENU_SEARCH: APP_PATH + "menu/search/",
  MENU_SEARCH_ALL: APP_PATH + "menu/",
  MENU_REMOVE: APP_PATH + "menu/remove/",

  USER_PROFILE: APP_PATH + "user/profiles/",

  ACTIVE_USER_CLIENT_SEARCH: APP_PATH + "userclient/findactiveuseclient/",

  ACTIVE_ORG_USER_SEARCH: APP_PATH + "orguser/findactiveorganisationuser/",

  USER_PROFILES: APP_PATH + "user/profiles/",
};

export default path;
