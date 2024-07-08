import { boot } from 'quasar/wrappers';
import VueGoogleMaps from '@fawmi/vue-google-maps';

export default boot(({ app }) => {
  app.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyC3dbJ1OHVb94cMyQKMQ-sgcnaf_JaujJQ',
      libraries: 'places', // This is required if you use the Autocomplete plugin
    },
  });
});