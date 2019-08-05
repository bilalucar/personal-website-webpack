import 'bootstrap/js/src/carousel';
import 'bootstrap/js/src/tab';
import 'bootstrap/js/src/util';
import 'bootstrap/js/src/collapse';
import 'bootstrap/js/src/dropdown';
import WOW from 'wow.js';

const wow = new WOW({
    boxClass:     'wow',
    animateClass: 'animated',
    offset:       0,
    mobile:       true,
    live:         true
});

(function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js', {scope: '/'})
            .then(() => console.log('Service Worker registered successfully.'))
            .catch(error => console.log('Service Worker registration failed:', error));
    }
})();
