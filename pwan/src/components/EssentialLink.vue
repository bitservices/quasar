<template>
  <div class='q-pa-md' style='max-width: 50px'>
    <q-menu auto-close class='pwan-blue text-white'>
      <q-list style='min-width: 100px' separator> 
          <q-item
            v-for='link in props.menuitems'
            :key='link.title'
            :items='link.menuitems'
            clickable
            tag='a'
            target='_blank'
            @click='handleClick(link.link)'
          >
            <q-item-section v-if='link.icon' avatar>
              <q-icon :name='link.icon' />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ link.title }} </q-item-label> 
            </q-item-section>
          </q-item>  
      </q-list> 
    </q-menu>
    {{ props.title }}
  </div> 
</template>
<script setup>
import { useRouter } from 'vue-router'; 
import { LocalStorage, SessionStorage } from 'quasar';
const router = useRouter();
defineOptions({
  name: 'EssentialLink',
});

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  menuitems: {
    type: Array,
    required: true,
    default: () => [
      {
        caption: {
          type: String,
          default: '',
        },

        link: {
          type: String,
          default: '#',
        },

        icon: {
          type: String,
          default: '',
        },
      },
    ],
  },
});

const handleClick = (prop) => {
  console.log('>>>>>>prop>>>>>>',prop.trim());
  var pageStacking =   LocalStorage.getItem('pagestack')
  console.log(">>>>pageStack>>>",pageStacking)
  if(pageStacking == null){ 
     const pagestack = ["/dashboard"]
      pagestack.push(prop.trim())
      LocalStorage.set('pagestack', pagestack); 
  }else{
  pageStacking.push(prop.trim())
   LocalStorage.set('pagestack',pageStacking)
  console.log(router);
}
  router.push(prop.trim());
};
</script>
