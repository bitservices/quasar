<template>
  <!--Desktop-->
  <div>
    <div class="flex justify-between bg-grey-4 q-pa-md">
      <div><q-skeleton class="bg-blue-grey-3" width="500px" /></div>
      <div><q-skeleton class="bg-blue-grey-3" width="500px" /></div>
    </div>
    <q-markup-table>
      <thead>
        <tr>
          <th class="text-left">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="n in 8" :key="n">
          <td class="text-left">
            <q-skeleton animation="blink" type="text" width="85px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="50px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="35px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="65px" />
          </td>
          <td class="text-right flex justify-center items-center">
            <q-skeleton
              animation="blink"
              type="text"
              class="q-mr-md"
              width="60px"
              height="40px"
            />
            <q-skeleton
              animation="blink"
              type="text"
              width="60px"
              height="40px"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
  <!--Mobile
  <div>
    <q-card v-for="n in 5" :key="n" square class="bg-grey-3" style="width: 100%; padding: 20px">
      <q-item class="bg-blue-grey-3">
        <q-item-section>
          <q-skeleton height="30px" class="bg-light-blue-7 glossy" width="80px" />
        </q-item-section>

        <q-item-section>
          <q-item-label align="right">
            <q-skeleton type="text" width="10px" height="50px" class="bg-white" animation="fade" />
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-card-section class="bg-white">
        <q-skeleton type="text" width="30%" class="text-subtitle2" animation="fade" />
        <q-skeleton type="text" width="80%" class="text-subtitle2" animation="fade" />
        <q-separator class="q-my-md" />
        <q-skeleton type="text" width="30%" class="text-subtitle2" animation="fade" />
        <q-skeleton type="text" width="80%" class="text-subtitle2" animation="fade" />
        <q-separator class="q-my-md" />
        <q-skeleton type="text" width="30%" class="text-subtitle2" animation="fade" />
        <q-skeleton type="text" width="80%" class="text-subtitle2" animation="fade" />
        <q-separator class="q-my-md" />
        <q-skeleton height="50px" width="100%" class="bg-teal-3" />
      </q-card-section>
    </q-card>
  </div>-->
</template>

<script setup></script>
