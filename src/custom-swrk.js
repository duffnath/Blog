importScripts('firebase-app.js');
importScripts('firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': `${process.env.firebase_messagingSenderId}`,
  'apiKey': `${process.env.firebase_apiKey}`,
  'authDomain': `${process.env.firebase_authDomain}`,
  'databaseURL': `${process.env.firebase_databaseURL}`,
  'projectId': `${process.env.firebase_projectId}`,
  'storageBucket': `${process.env.firebase_storageBucket}`,
  'messagingSenderId': `${process.env.firebase_messagingSenderId}`,
  'appId': `${process.env.firebase_appId}`
});

const messaging = firebase.messaging();

self.addEventListener("fetch", function (event) {
  if (event.request.url.endsWith('index.html')) {
    return false;
  }

  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
      })
    );
  }
});

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  return showLocalNotification(payload.data.text(), self.registration);
});

//  self.addEventListener("push", function (event) {
//    if (event.data) {
//      showLocalNotification(event.data.text(), self.registration);
//    } else {
//      console.log("Push event contains no data");
//    }
//  });

const showLocalNotification = (notificationBody, swRegistration) => {
  const body = JSON.parse(notificationBody);

  const message_title = body.notification.title;
  const message_body = body.notification.body;
  const icon = body.notification.icon;
  const image = body.notification.image;
  const tag = body.notification.tag;

  const actionTitle = body.data['gcm.notification.actionTitle'];
  const actionIcon = body.data['gcm.notification.actionIcon'];
  const badge = body.data['gcm.notification.badge'];
  const forceClick = body.data['gcm.notification.forceClick'];

  const options = {
    body: message_body,
    icon: icon,
    image: image,
    badge: badge,
    tag: tag,
    requireInteraction: forceClick,
    actions: [{ action: "Detail", title: actionTitle, icon: actionIcon }],
    data: body
  };

  swRegistration.showNotification(message_title, options);
};

self.addEventListener("notificationclose", function (e) {
  var notification = e.notification;
  var primaryKey = notification.data;

  console.log("Closed notification: " + primaryKey);
});

self.addEventListener("notificationclick", function (e) {
  var notification = e.notification;
  var action = e.action;

  if (action === "close") {
    notification.close();
  } else {
    clients.openWindow(`https://blog.nateduff.com/${notification.data.notification.click_action}`);
    notification.close();
  }
});

if (typeof document.addEventListener === "undefined" || hidden === undefined) {
  console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
} else {
  // Handle page visibility change   
  document.addEventListener(visibilityChange, handleVisibilityChange, false);

// register a custom navigation route
const customRoute = new workbox.routing.NavigationRoute(({ event }) => {
    
}, 
{
    whitelist: [/^(?!\/admin\/)/]
})

workbox.routing.registerRoute(customRoute)