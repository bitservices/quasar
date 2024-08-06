const BASEPATH = "http://localhost:8000";
const APP_PATH = BASEPATH + "/api/pwanproperties/";
const path = {
  ORIGIN_PATH : "http://localhost:9000",
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
  PROSPECT_CUSTOMER_CONVERT_TO_INVESTOR:
    APP_PATH + "prospect/converttoinvestor/",
  COUNTRY_ALL: APP_PATH + "country/",

  STATE_ALL: APP_PATH + "state/",
  STATE_CREATE: APP_PATH + "state/create/",
  STATE_UPDATE: APP_PATH + "state/update/",
  STATE_REMOVE: APP_PATH + "state/remove/",
  STATE_SEARCH: APP_PATH + "state/search/",
  STATE_SEARCH_BY_COUNTRY: APP_PATH + "state/findbycountry/",

  STATUS_ALL: APP_PATH + "status/",

  MENU_CREATE: APP_PATH + "menu/create/",
  MENU_UPDATE: APP_PATH + "menu/update/",
  MENU_SEARCH: APP_PATH + "menu/search/",
  MENU_SEARCH_ALL: APP_PATH + "menu/",
  MENU_REMOVE: APP_PATH + "menu/remove/",

  MENUITEM_CREATE: APP_PATH + "menuitem/create/",
  MENUITEM_UPDATE: APP_PATH + "menuitem/update/",
  MENUITEM_SEARCH: APP_PATH + "menuitem/search/",
  MENUITEM_SEARCH_ALL: APP_PATH + "menuitem/",
  MENUITEM_REMOVE: APP_PATH + "menuitem/remove/",

  USER_PROFILE: APP_PATH + "user/profiles/",

  ACTIVE_USER_CLIENT_SEARCH: APP_PATH + "userclient/findactiveuseclient/",

  ACTIVE_ORG_USER_SEARCH: APP_PATH + "orguser/findactiveorganisationuser/",

  USER_PROFILES: APP_PATH + "user/profiles/",

  SALES_CREATE: APP_PATH + "sales/create/",
  SALES_UPDATE: APP_PATH + "sales/update/",
  SALES_SEARCH: APP_PATH + "sales/search/",
  SALES_SEARCH_ALL: APP_PATH + "sales/",
  SALES_REMOVE: APP_PATH + "sales/remove/",

  PRODUCTTYPE_CREATE: APP_PATH + "producttype/create/",
  PRODUCTTYPE_UPDATE: APP_PATH + "producttype/update/",
  PRODUCTTYPE_SEARCH: APP_PATH + "producttype/search/",
  PRODUCTTYPE_REMOVE: APP_PATH + "producttype/remove/",

  PAYMENTTYPE_CREATE: APP_PATH + "paymenttype/create/",
  PAYMENTTYPE_UPDATE: APP_PATH + "paymenttype/update/",
  PAYMENTTYPE_SEARCH: APP_PATH + "paymenttype/search/",
  PAYMENTTYPE_REMOVE: APP_PATH + "paymenttype/remove/",


  PRODUCTDEF_CREATE: APP_PATH + "productdef/create/",
  PRODUCTDEF_UPDATE: APP_PATH + "productdef/update/",
  PRODUCTDEF_SEARCH: APP_PATH + "productdef/search/",
  PRODUCTDEF_REMOVE: APP_PATH + "productdef/remove/",

  PAYMENTDEF_CREATE: APP_PATH + "paymentdef/create/",
  PAYMENTDEF_UPDATE: APP_PATH + "paymentdef/update/",
  PAYMENTDEF_SEARCH: APP_PATH + "paymentdef/search/",
  PAYMENTDEF_REMOVE: APP_PATH + "paymentdef/remove/",



  DIMENSION_CREATE: APP_PATH + "dimension/create/",
  DIMENSION_UPDATE: APP_PATH + "dimension/update/",
  DIMENSION_SEARCH: APP_PATH + "dimension/search/",
  DIMENSION_REMOVE: APP_PATH + "dimension/remove/",
  DIMENSION_SEARCH_ALL: APP_PATH + "dimension/",

  PRODUCTSTATUS_SEARCH_ALL: APP_PATH + "productstatus/",

  COUNTY_ALL: APP_PATH + "county/",
  COUNTY_CREATE: APP_PATH + "county/create/",
  COUNTY_UPDATE: APP_PATH + "county/update/",
  COUNTY_REMOVE: APP_PATH + "county/remove/",
  COUNTY_SEARCH: APP_PATH + "county/search/",

  PAYMENTSTATUS_CREATE: APP_PATH + "paymentstatus/create/",
  PAYMENTSTATUS_UPDATE: APP_PATH + "paymentstatus/update/",
  PAYMENTSTATUS_SEARCH: APP_PATH + "paymentstatus/search/",
  PAYMENTSTATUS_REMOVE: APP_PATH + "paymentstatus/remove/",
  PAYMENTSTATUS_SEARCH_ALL: APP_PATH + "paymentstatus/",

  SALESSTATUS_CREATE: APP_PATH + "salesstatus/create/",
  SALESSTATUS_UPDATE: APP_PATH + "salesstatus/update/",
  SALESSTATUS_SEARCH: APP_PATH + "salesstatus/search/",
  SALESSTATUS_REMOVE: APP_PATH + "salesstatus/remove/",
  SALESSTATUS_SEARCH_ALL: APP_PATH + "salesstatus/",

  SALESTRANS_CREATE: APP_PATH + "sales/create/",
  SALESTRANS_UPDATE: APP_PATH + "sales/update/",
  SALESTRANS_SEARCH: APP_PATH + "sales/search/",
  SALESTRANS_REMOVE: APP_PATH + "sales/remove/",
  USER_SEARCH_AUTOCOMPLETER: APP_PATH + "user/autocomplete/",

  CONTACTINFO_CREATE: APP_PATH + "contactinfo/create/",
  CONTACTINFO_UPDATE: APP_PATH + "contactinfo/update/",
  CONTACTINFO_REMOVE: APP_PATH + "contactinfo/remove/",
  CONTACTINFO_SEARCH: APP_PATH + "contactinfo/search/",

  PRODUCTDEF_AUTOCOMPLETER: APP_PATH + "productdef/autocomplete/",

  PRODUCTCONTACT_CREATE: APP_PATH + "productcontact/create/",
  PRODUCTCONTACT_UPDATE: APP_PATH + "productcontact/update/",
  PRODUCTCONTACT_SEARCH: APP_PATH + "productcontact/search/",
  PRODUCTCONTACT_REMOVE: APP_PATH + "productcontact/remove/",

  INVESTORS_FIND_BY_USER: APP_PATH + "investor/listbyuser/",

  DASHBOARD: APP_PATH + "user/dashboard/",


  
  PROSPECTTYPE_CREATE: APP_PATH + "prospecttype/create/",
  PROSPECTTYPE_UPDATE: APP_PATH + "prospecttype/update/",
  PROSPECTTYPE_SEARCH: APP_PATH + "prospecttype/search/",
  PROSPECTTYPE_REMOVE: APP_PATH + "prospecttype/remove/",
  PROSPECTTYPE_SEARCH_ALL: APP_PATH + "prospecttype/",

};

export default path;
