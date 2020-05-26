importScripts('firebase-app.js');
importScripts('firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': `${process.env.firebase_messagingSenderId}`
});

const messaging = firebase.messaging();

self.addEventListener("fetch", function (event) {
  if (event.request.url.endsWith('index.html')) {
    return false;
  }

  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});

 self.addEventListener("push", function (event) {
   if (event.data) {
     showLocalNotification(event.data.text(), self.registration);
   } else {
     console.log("Push event contains no data");
   }
 });

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
    console.log(`SW Opening App from Notification: ${notification}`);
    clients.openWindow("https://blog.nateduff.com");
    notification.close();
  }
});

// register a custom navigation route
const customRoute = new workbox.routing.NavigationRoute(({ event }) => {
    
}, 
{
    whitelist: [/^(?!\/admin\/)/]
})

workbox.routing.registerRoute(customRoute)