


 //const BASEPATH = 'http://localhost:8000'; 
const BASEPATH = 'https://pwan.traisoft.com';  


// const QUASR_PATH =  'http://localhost';
// const QUASR_PATH =  'http://localhost';
const QUASR_PATH =  'https://propertyconnect.traisoft.com';

const APP_PATH = BASEPATH + '/api/pwanproperties/'; 
const path = {
  ESTATE_AGENCY_URL: 'https://estateagency.traisoft.com/?ref=',
  ORIGIN_PATH: QUASR_PATH, 
  USER_AUTHENTICATEE: BASEPATH + '/api/token/',
  CLIENT_CREATE: APP_PATH + 'client/create/',
  CLIENT_UPDATE: APP_PATH + 'client/update/',
  CLIENT_FIND_BY_CREATOR: APP_PATH + 'client/findbycreator/',
  CLIENT_SEARCH: APP_PATH + 'client/search/',
  CLIENT_REMOVE: APP_PATH + 'client/remove/',
  CLIENT_ACTIVATE: APP_PATH + 'client/activate/',
  CLIENT_DEACTIVATE: APP_PATH + 'client/deactivate/',
  CLIENT_LOGO: APP_PATH + 'client/getclientlogo/',

  ORGANISATION_CREATE: APP_PATH + 'organisation/create/',
  ORGANISATION_UPDATE: APP_PATH + 'organisation/update/',
  ORGANISATION_SEARCH: APP_PATH + 'organisation/search/',
  ORGANISATION_REMOVE: APP_PATH + 'organisation/remove/',
  ORGANISATION_ACTIVATE: APP_PATH + 'organisation/activate/',
  ORGANISATION_DEACTIVATE: APP_PATH + 'organisation/deactivate/',
  ORGANISATION_FIND_BY_CREATOR: APP_PATH + 'organisation/findbycreator/',

  PROSPECT_CUSTOMER_ALL: APP_PATH + 'prospect/',
  PROSPECT_CUSTOMER_FIND_BY_USER: APP_PATH + 'prospect/listbyuser/',
  PROSPECT_CUSTOMER_CREATE: APP_PATH + 'prospect/create/',
  PROSPECT_CUSTOMER_UPDATE: APP_PATH + 'prospect/update/',
  PROSPECT_CUSTOMER_REMOVE: APP_PATH + 'prospect/remove/',
  PROSPECT_CUSTOMER_SEARCH: APP_PATH + 'prospect/search/',
  PROSPECT_CUSTOMER_CONVERT_TO_INVESTOR:
    APP_PATH + 'prospect/converttoinvestor/',
  COUNTRY_ALL: APP_PATH + 'country/', 

  STATE_ALL: APP_PATH + 'state/',
  STATE_CREATE: APP_PATH + 'state/create/',
  STATE_UPDATE: APP_PATH + 'state/update/',
  STATE_REMOVE: APP_PATH + 'state/remove/',
  STATE_SEARCH: APP_PATH + 'state/search/',
  STATE_SEARCH_BY_COUNTRY: APP_PATH + 'state/findbycountry/',

  STATUS_ALL: APP_PATH + 'status/',

  MENU_CREATE: APP_PATH + 'menu/create/',
  MENU_UPDATE: APP_PATH + 'menu/update/',
  MENU_SEARCH: APP_PATH + 'menu/search/',
  MENU_SEARCH_ALL: APP_PATH + 'menu/',
  MENU_REMOVE: APP_PATH + 'menu/remove/',

  MENUITEM_CREATE: APP_PATH + 'menuitem/create/',
  MENUITEM_UPDATE: APP_PATH + 'menuitem/update/',
  MENUITEM_SEARCH: APP_PATH + 'menuitem/search/',
  MENUITEM_SEARCH_ALL: APP_PATH + 'menuitem/',
  MENUITEM_REMOVE: APP_PATH + 'menuitem/remove/',

  USER_PROFILE: APP_PATH + 'user/profiles/',

  FIND_USER_BY_EMAIL: APP_PATH + 'user/findbyemail/',
  USER_UPDATE: APP_PATH + 'user/update/',
  USER_CREATE: APP_PATH + 'user/create/',

  ACTIVE_USER_CLIENT_SEARCH: APP_PATH + 'userclient/findactiveuseclient/',

  ACTIVE_ORG_USER_SEARCH: APP_PATH + 'orguser/findactiveorganisationuser/',
  ORG_USER_SEARCH: APP_PATH + 'orguser/search/',
  ORG_USER_REPORT: APP_PATH + 'report/orguserreport/',

  USER_PROFILES: APP_PATH + 'user/profiles/',

  SALES_CREATE: APP_PATH + 'sales/create/',
  SALES_UPDATE: APP_PATH + 'sales/update/',
  SALES_SEARCH: APP_PATH + 'sales/search/',
  SALES_SEARCH_ALL: APP_PATH + 'sales/',
  SALES_REMOVE: APP_PATH + 'sales/remove/',

  PRODUCTTYPE_CREATE: APP_PATH + 'producttype/create/',
  PRODUCTTYPE_UPDATE: APP_PATH + 'producttype/update/',
  PRODUCTTYPE_SEARCH: APP_PATH + 'producttype/search/',
  PRODUCTTYPE_REMOVE: APP_PATH + 'producttype/remove/',

  
  TRANSACTIONTYPE_SEARCH: APP_PATH + 'transtype/search/',

  PAYMENTTYPE_CREATE: APP_PATH + 'paymenttype/create/',
  PAYMENTTYPE_UPDATE: APP_PATH + 'paymenttype/update/',
  PAYMENTTYPE_SEARCH: APP_PATH + 'paymenttype/search/',
  PAYMENTTYPE_REMOVE: APP_PATH + 'paymenttype/remove/',

  PRODUCTDEF_CREATE: APP_PATH + 'productdef/create/',
  PRODUCTDEF_UPDATE: APP_PATH + 'productdef/update/',
  PRODUCTDEF_SEARCH: APP_PATH + 'productdef/search/',
  PRODUCTDEF_REMOVE: APP_PATH + 'productdef/remove/',
  PRODUCTDEF_IMAGE: APP_PATH + 'productdef/getProductTypeDefImage/',
  PRODUCTDEF_BYTES: APP_PATH + 'productdef/getProductTypeDefBytes/',   
  PRODUCTDEF_VIDEO: APP_PATH + 'productdef/getProductTypeDefVideo/',
  PRODUCTDEF_SUBSCRIPTION_FORM: APP_PATH + 'productdef/getProductTypeDefSubscription/',
  PRODUCTDEF_UPDATE_IMAGE: APP_PATH + 'productdef/updateimage/',
  PRODUCTDEF_UPDATE_SUBSCRIPTION: APP_PATH + 'productdef/updatesubscription/',
  PRODUCTDEF_UPDATE_VIDEO: APP_PATH + 'productdef/updatevideo/',

  PAYMENTDEF_CREATE: APP_PATH + 'paymentdef/create/',
  PAYMENTDEF_UPDATE: APP_PATH + 'paymentdef/update/',
  PAYMENTDEF_SEARCH: APP_PATH + 'paymentdef/search/',
  PAYMENTDEF_REMOVE: APP_PATH + 'paymentdef/remove/',

  DIMENSION_CREATE: APP_PATH + 'dimension/create/',
  DIMENSION_UPDATE: APP_PATH + 'dimension/update/',
  DIMENSION_SEARCH: APP_PATH + 'dimension/search/',
  DIMENSION_REMOVE: APP_PATH + 'dimension/remove/',
  DIMENSION_SEARCH_ALL: APP_PATH + 'dimension/',

  PRODUCTSTATUS_SEARCH_ALL: APP_PATH + 'productstatus/',

  COUNTY_ALL: APP_PATH + 'county/',
  COUNTY_CREATE: APP_PATH + 'county/create/',
  COUNTY_UPDATE: APP_PATH + 'county/update/',
  COUNTY_REMOVE: APP_PATH + 'county/remove/',
  COUNTY_SEARCH: APP_PATH + 'county/search/',

  PAYMENTSTATUS_CREATE: APP_PATH + 'paymentstatus/create/',
  PAYMENTSTATUS_UPDATE: APP_PATH + 'paymentstatus/update/',
  PAYMENTSTATUS_SEARCH: APP_PATH + 'paymentstatus/search/',
  PAYMENTSTATUS_REMOVE: APP_PATH + 'paymentstatus/remove/',
  PAYMENTSTATUS_SEARCH_ALL: APP_PATH + 'paymentstatus/',  
  PAYMENTSTATUS_DELETE: APP_PATH + 'paymentstatus/delete/', 

  PAYMENTMODE_CREATE: APP_PATH + 'paymentmode/create/',
  PAYMENTMODE_UPDATE: APP_PATH + 'paymentmode/update/',
  PAYMENTMODE_SEARCH: APP_PATH + 'paymentmode/search/',
  PAYMENTMODE_REMOVE: APP_PATH + 'paymentmode/remove/',  
  PAYMENTMODE_DELETE: APP_PATH + 'paymentmode/delete/',  

  SALESSTATUS_CREATE: APP_PATH + 'salesstatus/create/',
  SALESSTATUS_UPDATE: APP_PATH + 'salesstatus/update/',
  SALESSTATUS_SEARCH: APP_PATH + 'salesstatus/search/',
  SALESSTATUS_REMOVE: APP_PATH + 'salesstatus/remove/',
  SALESSTATUS_SEARCH_ALL: APP_PATH + 'salesstatus/',

  SALESTRANS_CREATE: APP_PATH + 'sales/create/',
  SALESTRANS_UPDATE: APP_PATH + 'sales/update/',
  SALESTRANS_SEARCH: APP_PATH + 'sales/search/',
  SALESTRANS_REMOVE: APP_PATH + 'sales/remove/',

  USER_SEARCH_AUTOCOMPLETER: APP_PATH + 'user/autocomplete/',
  USER_IMAGE: APP_PATH + 'user/getuserimage/',
  USER_SEARCH_BY_EMAIL: APP_PATH + 'user/findbyemail/',

  CONTACTINFO_CREATE: APP_PATH + 'contactinfo/create/',
  CONTACTINFO_UPDATE: APP_PATH + 'contactinfo/update/',
  CONTACTINFO_REMOVE: APP_PATH + 'contactinfo/remove/',
  CONTACTINFO_SEARCH: APP_PATH + 'contactinfo/search/',

  PRODUCTDEF_AUTOCOMPLETER: APP_PATH + 'productdef/autocomplete/',

  PRODUCTCONTACT_CREATE: APP_PATH + 'productcontact/create/',
  PRODUCTCONTACT_UPDATE: APP_PATH + 'productcontact/update/',
  PRODUCTCONTACT_SEARCH: APP_PATH + 'productcontact/search/',
  PRODUCTCONTACT_REMOVE: APP_PATH + 'productcontact/remove/',

  INVESTORS_FIND_BY_USER: APP_PATH + 'investor/listbyuser/',

  DASHBOARD: APP_PATH + 'user/dashboard/',

  PROSPECTTYPE_CREATE: APP_PATH + 'prospecttype/create/',
  PROSPECTTYPE_UPDATE: APP_PATH + 'prospecttype/update/',
  PROSPECTTYPE_SEARCH: APP_PATH + 'prospecttype/search/',
  PROSPECTTYPE_REMOVE: APP_PATH + 'prospecttype/remove/',
  PROSPECTTYPE_SEARCH_ALL: APP_PATH + 'prospecttype/',

  GENDER_SEARCH_ALL: APP_PATH + 'gender/',

  ORG_ANNUAL_PAYMENT_CREATE: APP_PATH + 'organnualpymt/create/',
  ORG_ANNUAL_PAYMENT_UPDATE: APP_PATH + 'organnualpymt/update/',
  ORG_ANNUAL_PAYMENT_SEARCH: APP_PATH + 'organnualpymt/search/',
  ORG_ANNUAL_PAYMENT_REMOVE: APP_PATH + 'organnualpymt/remove/',
  ORG_ANNUAL_PAYMENT_YEARS: APP_PATH + 'organnualpymt/findorgyears/',

  USR_OUTSTANDING_PAYMENT_CREATE: APP_PATH + 'useroutstanding/create/',
  USR_OUTSTANDING_PAYMENT_UPDATE: APP_PATH + 'useroutstanding/update/',
  USR_OUTSTANDING_PAYMENT_SEARCH: APP_PATH + 'useroutstanding/search/',
  USR_OUTSTANDING_PAYMENT_REMOVE: APP_PATH + 'useroutstanding/remove/',
  USRS_OUTSTANDING_PAYMENT_CREATE: APP_PATH + 'useroutstanding/generateMembersOutStandingPayment/',
  USR_OUTSTANDING_PAYMENT_SEARCH_GROUP_BY_ORGANISATION: APP_PATH + 'useroutstanding/findbyuser/',
  USR_OUTSTANDING_PAYMENTS_GENERATE: APP_PATH + 'useroutstanding/generateOutstandingPaymentsForMembers/',
  


  ORGUSER_SEARCH: APP_PATH + 'orguser/search/', 
  ORGUSER_SAVE: APP_PATH + 'orguser/save/',
  ORGUSER_DEACTIVATE: APP_PATH + 'orguser/deactivate/',
  ORGUSER_ACTIVATE: APP_PATH + 'orguser/activate/',
  

  USR_PAYMENT_TRANSACTION_CREATE: APP_PATH + 'userpayment/create/',


  USR_PAYMENT_TRANSACTION_SEARCH: APP_PATH + 'userpayment/search/',

  USR_LEDGER_PAYMENT_TRANSACTION_SEARCH: APP_PATH + 'userledger/search/',

  USR_PAYMENT_TRANSACTION_REPORT: APP_PATH + 'report/usertransactionreport/',
  USR_LEDGER_PAYMENT_TRANSACTION_REPORT: APP_PATH + 'report/userledgerreport/',
  USR_OUTSTANDING_PAYMENT_REPORT: APP_PATH + 'report/outstandingpayment/',

  VENDOR_CREATE: APP_PATH + 'vendor/create/',
  VENDOR_UPDATE: APP_PATH + 'vendor/update/',
  VENDOR_REMOVE: APP_PATH + 'vendor/remove/',
  VENDOR_SEARCH: APP_PATH + 'vendor/search/',

  VENDOR_PAYMENT_TRANSACTION_CREATE: APP_PATH + 'vendorpayment/create/',
  VENDOR_PAYMENT_TRANSACTION_SEARCH: APP_PATH + 'vendorpayment/search/',
  VENDOR_PAYMENT_TRANSACTION_REPORT: APP_PATH + 'report/vendortransactionreport/',




  VENDOR_LEDGER_PAYMENT_TRANSACTION_SEARCH: APP_PATH + 'vendorledger/search/', 
  VENDOR_LEDGER_PAYMENT_TRANSACTION_REPORT: APP_PATH + 'report/vendorledgerreport/',

  SELF_VENDOR_PAYMENT_TRANSACTION_SEARCH: APP_PATH + 'vendorpayment/selfServiceIncome/', 
  SELF_VENDOR_PAYMENT_TRANSACTION_REPORT: APP_PATH + 'report/selfServiceIncomeReport/', 

  PROSPECT_TYPE_CREATE: APP_PATH + 'prospecttype/create/',
  PROSPECT_TYPE_UPDATE: APP_PATH + 'prospecttype/update/',
  PROSPECT_TYPE_SEARCH: APP_PATH + 'prospecttype/search/',
  PROSPECT_TYPE_REMOVE: APP_PATH + 'prospecttype/remove/',
  PROSPECT_TYPE_SEARCH_ALL: APP_PATH + 'prospecttype/', 


  ROLE_CREATE: APP_PATH + 'role/create/',
  ROLE_UPDATE: APP_PATH + 'role/update/',
  ROLE_SEARCH: APP_PATH + 'role/search/',
  ROLE_SEARCH_ALL: APP_PATH + 'role/',
  ROLE_REMOVE: APP_PATH + 'role/remove/',


  USERROLE_CREATE: APP_PATH + 'userrole/create/',
  USERROLE_UPDATE: APP_PATH + 'userrole/update/',
  USERROLE_SEARCH: APP_PATH + 'userrole/search/',
  USERROLE_REMOVE: APP_PATH + 'userrole/remove/',



  PROFILE_DETAIL: APP_PATH + 'profile/details/',

  PROFILE_CREATE: APP_PATH + 'profile/create/',

  ATTENDANCE_SEARCH: APP_PATH + 'attendance/search/', 
  ATTENDANCE_SEARCH_ALL: APP_PATH + 'attendance/',
  ATTENDANCE_REPORT: APP_PATH + 'report/attendancereport',  

  REGISTER_ATTENDANCE: APP_PATH + 'attendance/register/', 

  PASSWORD_CHANGE: APP_PATH + 'pwdchange/forgetpass/', 
  PASSWORD_FINALIZE: APP_PATH + 'pwdchange/finalize/',  

   
  USER_REGISTER: APP_PATH + 'userreg/register/', 
  USER_REGISTER_FINALIZE: APP_PATH + 'userreg/finalize/', 

  COMMISSION_SETTINGS_CREATE: APP_PATH + 'commission/create/', 
  COMMISSION_SETTINGS_SEARCH: APP_PATH + 'commission/search/', 
  COMMISSION_SETTINGS_UPDATE: APP_PATH + 'commission/update/', 
  COMMISSION_SETTINGS_DELETE: APP_PATH + 'commission/delete/',  
  COMMISSION_SETTINGS_REMOVE: APP_PATH + 'commission/remove/',  
  COMMISSION_CALCULATE: APP_PATH + 'commission/calculate/', 


  BANK_CREATE: APP_PATH + 'bank/create/', 
  BANK_SEARCH: APP_PATH + 'bank/search/', 
  BANK_UPDATE: APP_PATH + 'bank/update/', 
  BANK_DELETE: APP_PATH + 'bank/delete/',  
  BANK_REMOVE: APP_PATH + 'bank/remove/',


  COUNTRY_CREATE: APP_PATH + 'country/create/', 
  COUNTRY_SEARCH: APP_PATH + 'country/search/', 
  COUNTRY_UPDATE: APP_PATH + 'country/update/', 
  COUNTRY_DELETE: APP_PATH + 'country/delete/',  
  COUNTRY_REMOVE: APP_PATH + 'country/remove/',

  GENDER_CREATE: APP_PATH + 'gender/create/', 
  GENDER_SEARCH: APP_PATH + 'gender/search/', 
  GENDER_UPDATE: APP_PATH + 'gender/update/', 
  GENDER_DELETE: APP_PATH + 'gender/delete/',  
  GENDER_REMOVE: APP_PATH + 'gender/remove/',


  MARITALSTATUS_CREATE: APP_PATH + 'maritalstatus/create/', 
  MARITALSTATUS_SEARCH: APP_PATH + 'maritalstatus/search/', 
  MARITALSTATUS_UPDATE: APP_PATH + 'maritalstatus/update/', 
  MARITALSTATUS_DELETE: APP_PATH + 'maritalstatus/delete/',  
  MARITALSTATUS_REMOVE: APP_PATH + 'maritalstatus/remove/',

  
  MEMBERSHIP_TYPE_CREATE: APP_PATH + 'membershiptype/create/', 
  MEMBERSHIP_TYPE_SEARCH: APP_PATH + 'membershiptype/search/', 
  MEMBERSHIP_TYPE_UPDATE: APP_PATH + 'membershiptype/update/', 
  MEMBERSHIP_TYPE_DELETE: APP_PATH + 'membershiptype/delete/',  
  MEMBERSHIP_TYPE_REMOVE: APP_PATH + 'membershiptype/remove/',


   

  STATUS_CREATE: APP_PATH + 'status/create/', 
  STATUS_SEARCH: APP_PATH + 'status/search/', 
  STATUS_UPDATE: APP_PATH + 'status/update/', 
  STATUS_DELETE: APP_PATH + 'status/delete/',  
  STATUS_REMOVE: APP_PATH + 'status/remove/',
  
 
  STATE_DELETE: APP_PATH + 'state/delete/',  

  PRODUCTSTATUS_CREATE: APP_PATH + 'productstatus/create/', 
  PRODUCTSTATUS_SEARCH: APP_PATH + 'productstatus/search/', 
  PRODUCTSTATUS_UPDATE: APP_PATH + 'productstatus/update/', 
  PRODUCTSTATUS_DELETE: APP_PATH + 'productstatus/delete/',  
  PRODUCTSTATUS_REMOVE: APP_PATH + 'productstatus/remove/',

  USER_WEBSITE_CREATE: APP_PATH + 'userwebsitesetup/create/',
  USER_WEBSITE_ACTIVATE: APP_PATH + 'userwebsitesetup/activate/',
  USER_WEBSITE_DEACTIVATE: APP_PATH + 'userwebsitesetup/deactivate/',
  USER_WEBSITE_SEARCH : APP_PATH + 'userwebsitesetup/search/',

  LEADS_SEARCH: APP_PATH + 'leadcontact/search/',
  IMAGE_UPLOAD : QUASR_PATH + '/upload_image', 
  VIDEO_UPLOAD : QUASR_PATH + '/upload_video', 
  SUBSCRIPTION_UPLOAD : QUASR_PATH + '/upload_subscription/', 
  UPLOAD_DESINATION: QUASR_PATH + '/uploads/', 


  TESTIMONIAL_CREATE: APP_PATH + 'testimonial/create/',
  TESTIMONIAL_UPDATE: APP_PATH + 'testimonial/update/',
  TESTIMONIAL_SEARCH: APP_PATH + 'testimonial/search/',
  TESTIMONIAL_REMOVE: APP_PATH + 'testimonial/remove/',  
  TESTIMONIAL_UPDATE_IMAGE: APP_PATH + 'testimonial/updatetestimonialimage/',
  USER_UPLOAD: APP_PATH + 'userupload/upload/',
  USER_UPLOAD_PROCESS: APP_PATH + 'userupload/processupload/', 

  ORGANISATION_UPLOAD: APP_PATH + 'orgupload/upload/',
  ORGANISATION_UPLOAD_PROCESS: APP_PATH + 'orgupload/processupload/', 

  PRODUCTDEF_UPLOAD: APP_PATH + 'productupload/upload/',
  PRODUCTDEF_UPLOAD_PROCESS: APP_PATH + 'productupload/processupload/', 
  
  PAYMENTCHANNEL_CREATE: APP_PATH + 'paymentchannel/create/', 
  PAYMENTCHANNEL_SEARCH: APP_PATH + 'paymentchannel/search/', 
  PAYMENTCHANNEL_UPDATE: APP_PATH + 'paymentchannel/update/', 
  PAYMENTCHANNEL_DELETE: APP_PATH + 'paymentchannel/delete/',  
  PAYMENTCHANNEL_REMOVE: APP_PATH + 'paymentchannel/remove/',

  
  PAYMENTINTEGRATION_CREATE: APP_PATH + 'integration/create/', 
  PAYMENTINTEGRATION_SEARCH: APP_PATH + 'integration/search/', 
  PAYMENTINTEGRATION_UPDATE: APP_PATH + 'integration/update/', 
  PAYMENTINTEGRATION_DELETE: APP_PATH + 'integration/delete/',  
  PAYMENTINTEGRATION_REMOVE: APP_PATH + 'integration/remove/',

  
  PAYMENTINTEGRATIONLOG_CREATE: APP_PATH + 'paymentlog/create/',
  PAYMENTINTEGRATIONLOG_UPDATE: APP_PATH + 'paymentlog/update/',

 

  MESSAGINGCHANNEL_CREATE: APP_PATH + 'messagingchannel/create/', 
  MESSAGINGCHANNEL_SEARCH: APP_PATH + 'messagingchannel/search/', 
  MESSAGINGCHANNEL_UPDATE: APP_PATH + 'messagingchannel/update/', 
  MESSAGINGCHANNEL_DELETE: APP_PATH + 'messagingchannel/delete/',  
  MESSAGINGCHANNEL_REMOVE: APP_PATH + 'messagingchannel/remove/',


  
  MESSAGINGINTEGRATION_CREATE: APP_PATH + 'msgintegration/create/', 
  MESSAGINGINTEGRATION_SEARCH: APP_PATH + 'msgintegration/search/', 
  MESSAGINGINTEGRATION_UPDATE: APP_PATH + 'msgintegration/update/', 

  MESSAGETYPE_CREATE: APP_PATH + 'messagetype/create/', 
  MESSAGETYPE_SEARCH: APP_PATH + 'messagetype/search/', 
  MESSAGETYPE_UPDATE: APP_PATH + 'messagetype/update/', 
  MESSAGETYPE_DELETE: APP_PATH + 'messagetype/delete/',  
  MESSAGETYPE_REMOVE: APP_PATH + 'messagetype/remove/',
 

  MESSAGINGSETUP_CREATE: APP_PATH + 'msgingstup/create/', 
  MESSAGINGSETUP_SEARCH: APP_PATH + 'msgingstup/search/', 
  MESSAGINGSETUP_UPDATE: APP_PATH + 'msgingstup/update/', 
  MESSAGINGSETUP_DELETE: APP_PATH + 'msgingstup/delete/',  
  MESSAGINGSETUP_REMOVE: APP_PATH + 'msgingstup/remove/', 

  SEND_MESSAGE : APP_PATH + 'msgingstup/sendmessage/',
  SEND_BIRTHDATY_MESSAGE : APP_PATH + 'msgingstup/runBirthDayMessageToMembersByCordinators/',

  
  GENERAL_LEDGER_TRANSACTION_SEARCH: APP_PATH + 'generalledger/search/', 
 GENERAL_LEDGER_TRANSACTION_REPORT: APP_PATH + 'report/generalledgerreport/',
 

 DYNAMICTYPE_CREATE: APP_PATH + 'dantype/create/', 
 DYNAMICTYPE_SEARCH: APP_PATH + 'dantype/search/', 
 DYNAMICTYPE_UPDATE: APP_PATH + 'dantype/update/', 
 DYNAMICTYPE_DELETE: APP_PATH + 'dantype/delete/',  
 DYNAMICTYPE_REMOVE: APP_PATH + 'dantype/remove/',


 DYNAMICNUMBER_CREATE: APP_PATH + 'dannumber/create/', 
 DYNAMICNUMBER_SEARCH: APP_PATH + 'dannumber/search/', 
 DYNAMICNUMBER_LOAD: APP_PATH + 'dannumber/load/',
 DYNAMICNUMBER_VALIDATE: APP_PATH + 'dannumber/validate/',
  

 FUNDINGTYPE_CREATE: APP_PATH + 'fundingtype/create/',
 FUNDINGTYPE_UPDATE: APP_PATH + 'fundingtype/update/',
 FUNDINGTYPE_SEARCH: APP_PATH + 'fundingtype/search/',
 FUNDINGTYPE_REMOVE: APP_PATH + 'fundingtype/remove/', 
 

FUNDINGPAYMENT_TRANSACTION_CREATE: APP_PATH + 'fundingpayment/create/',



DANVALIDATE_CREATE: APP_PATH + 'danvalidate/create/',
DANVALIDATE_UPDATE: APP_PATH + 'fundingtype/update/', 


PRODUCTPORTFOLIO_CREATE: APP_PATH + 'productportfolio/create/',
PRODUCTPORTFOLIO_UPDATE: APP_PATH + 'productportfolio/update/', 
PRODUCTPORTFOLIO_REMOVE: APP_PATH + 'productportfolio/remove/', 
PRODUCTPORTFOLIO_SEARCH: APP_PATH + 'productportfolio/search/', 


USER_MESSAGINGINTEGRATION_CREATE: APP_PATH + 'usermsgintegration/create/', 
USER_MESSAGINGINTEGRATION_SEARCH: APP_PATH + 'usermsgintegration/search/', 
USER_MESSAGINGINTEGRATION_UPDATE: APP_PATH + 'usermsgintegration/update/',


USER_MESSAGINGCHANNEL_CREATE: APP_PATH + 'usermessagingchannel/create/', 
USER_MESSAGINGCHANNEL_SEARCH: APP_PATH + 'usermessagingchannel/search/', 
USER_MESSAGINGCHANNEL_UPDATE: APP_PATH + 'usermessagingchannel/update/', 
USER_MESSAGINGCHANNEL_DELETE: APP_PATH + 'usermessagingchannel/delete/',  
USER_MESSAGINGCHANNEL_REMOVE: APP_PATH + 'usermessagingchannel/remove/',




  

  

  



};

export default path;
