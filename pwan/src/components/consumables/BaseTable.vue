<template>
  <div v-if="loading">
    <BaseSkeletonTable></BaseSkeletonTable>
  </div>
  <div class="q-pa-md" v-else>
    <q-table
      class="my-sticky-header-table"
      flat
      bordered
      :title="title"
      :rows="data"
      :columns="columns"
      :row-key="rowKey"
      :selection="selection"
      v-model:selected="selected"
      style="height: 500px"
      :pagination="{ rowsPerPage: 10 }"
      :rows-per-page-options="[5, 10, 20, 30, 50, 100, 0]"
    >
      <template v-if="hasSlot('top')" v-slot:top="props">
        <slot name="top" v-bind="props"></slot>
      </template>
      <template v-if="hasSlot('top-left')" v-slot:top-left="props">
        <slot name="top-left" v-bind="props"></slot>
      </template>
      <template v-if="hasSlot('top-right')" v-slot:top-right="props">
        <slot name="top-right" v-bind="props"></slot>
      </template>
    </q-table>
  </div>
</template>

<script>
import BaseSkeletonTable from "src/components/consumables/atom/BaseSkeletonTable.vue";
import { useQuasar } from "quasar";
import { ref, useSlots, watch } from "vue";

export default {
  name: "BaseTable",
  props: {
    label: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    data: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    rowKey: {
      type: String,
      default: "id",
    },
    visibleColumns: {
      type: Array,
      default: () => [],
    },
    invisibleColumns: {
      type: Array,
      default: () => [],
    },
    stickyLastColumn: {
      type: Boolean,
      default: false,
    },
    stickyHeader: {
      type: Boolean,
      default: false,
    },
    maxHeightOffset: {
      type: Number,
      default: null,
    },
    pagination: {
      type: Object,
      default: () => ({}),
    },
    selected: {
      type: Array,
      default: () => [],
    },
    selection: {
      type: String,
      default: "none",
    },
    selectForAction: {
      type: Boolean,
      default: false,
    },
    rowsPerPageOptions: {
      type: Array,
      default: () => [5, 7, 10, 15, 20, 25, 50, 0],
    },
  },
  components: {
    BaseSkeletonTable,
  },

  data() {
    const loading = ref(true);
    const selected = ref([]);
    const slots = useSlots();

    return {
      loading,
      selected,
      slots,
    };
  },
  // computed: {
  //   formattedDate() {
  //     // Format the date for display
  //     return this.selectedDate
  //       ? date.formatDate(this.selectedDate, "YYYY-MM-DD")
  //       : "";
  //   },
  // },
  methods: {
    hasSlot(name) {
      return !!this.slots[name];
    },
  },
  beforeCreate() {
    console.log("beforeCreate");
  },
  created() {
    console.log("created");
  },
  beforeMount() {
    console.log("before Mount");
  },
  mounted() {
    console.log(">>>>>>>>>mounted>>>>>>>>>>");
  },
  unmounted() {},
  updated() {
    if (this.data) {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
