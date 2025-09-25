<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card>
        <q-card-section class="pwan-blue text-white">
          <HeaderPage :label="pageName" :hint="hint" />
        </q-card-section>
      </q-card>
      <BaseTable
        ref="tableRef"
        :columns="columns"
        :data="rows"
        :rowKey="(row) => row.id"
        :selection="selection"
        :title="title"
        :pagination="pagination"
        :max-height-offset="260"
      >
        <template #top-right>
          <q-space />
          <q-btn rounded color="green" icon="add" size="sm" @click="addItem" />
          <q-btn
            rounded
            color="blue"
            label="Add Payment"
            size="sm"
            @click="editItem"
          />
          <q-btn
            rounded
            color="info"
            icon="visibility"
            size="sm"
            @click="viewItem"
          />
          <!--
          <q-btn
            rounded
            color="red"
            icon="delete"
            size="sm"
            @click="deleteItem"
          />-->
        </template>
      </BaseTable>

      <Done />
    </div>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage } from "quasar";
import axios from "axios";
import { ref, computed } from "vue";
import Done from "src/components/Done.vue";
import path from "src/router/urlpath";
import HeaderPage from "src/components/HeaderPage.vue";
import BaseTable from "src/components/consumables/BaseTable.vue";
import { useSubscriptionStore } from "src/stores/subscriptionStore";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { format } from "date-fns";

export default {
  name: "Subscription",
  components: {
    Done,
    BaseTable,
    HeaderPage,
  },

  data() {
    const { t } = useI18n();
    const pageName = computed(() => t("subscription.pagename"));
    const hint = computed(() => t("subscription.hint"));
    const useStore = useSubscriptionStore();
    const router = useRouter();
    const headers = SessionStorage.getItem("headers");
    const title = ref("Subscription");
    const selection = ref("single");
    const userEmail = LocalStorage.getItem("userEmail");

    const pagination = ref({
      // sortBy: "name",
      descending: false,
      page: 1,
      rowsPerPage: 50,
      rowsNumber: 50,
      keyword: "",
    });
    const columns = [
      {
        name: "subscriber",
        required: false,
        label: "Subscriber Name",
        align: "left",
        field: (row) =>
          row.subscriber.lastName +
          " " +
          row.subscriber.firstName +
          " " +
          row.subscriber.middleName,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "product",
        align: "center",
        label: "Product",
        field: (row) => row.subscribedProduct.name,
        sortable: true,
      },
      {
        name: "amount",
        align: "center",
        label: "Product Amount",
        field: (row) =>
          new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(row.subscribedProduct.amount),
        sortable: true,
      },
      {
        name: "quantity",
        align: "center",
        label: "Quantity",
        field: (row) => row.quantity,
        sortable: true,
      },
      {
        name: "amount",
        align: "center",
        label: "Amount Paid so Far",
        field: (row) =>
          new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(row.totalAmount),
        sortable: true,
      },

      {
        name: "Affillate",
        align: "center",
        label: "Affilate/Company",
        field: (row) => row.client.name,
        sortable: true,
      },
      {
        name: "paymentStatus",
        align: "center",
        label: "Status",
        field: (row) => row.paymentStatus.name,
        sortable: true,
      },
      {
        name: "subscriptionDate",
        align: "center",
        label: "Subscription Date",
        field: (row) => format(row.subscriptionDate, "yyyy-MM-dd"),
        sortable: true,
      },
    ];

    const showFormDialog = ref(false);
    const action = ref("");
    const rows = ref([]);
    const medium_dialog = ref(false);
    const childRef = ref({
      label: "",
      message: "",
      textClass: "",
      cardClass: "",
      buttonClass: "",
      data: {},
    });

    return {
      formData: {
        stateCode: "select State",
      },
      childRef,
      columns,
      rows,
      headers,
      medium_dialog,
      action,
      showFormDialog,
      selection,
      title,
      pagination,
      useStore,
      router,
      pageName,
      hint,
      dense: "true",
      userEmail,
    };
  },
  methods: {
    fetchData() {
      try {
        const requestParams = {
          params: {
            realtor: this.userEmail,
            order_by: "-subscriptionDate",
          },
        };
        axios
          .get(path.SUBSCRIPTION_SEARCH, requestParams, this.headers)
          .then((response) => {
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            console.log(">>>>>>>>>response.data>>>>>>>>>", response.data.data);
            if (response.data.data) {
              this.useStore.data = [...response.data.data];
              this.rows = response.data.data;
              this.$refs.tableRef.selected = [];
            }
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },

    addItem() {
      this.setRecord(null);
      this.useStore.reload = false;
      this.useStore.mode = "create";
      this.useStore.data = this.rows;
      this.router.push("/subscription/form");
    },
    editItem() {
      if (this.$refs.tableRef.selected.length > 0) {
        const record = Object.assign({}, this.$refs.tableRef.selected[0]);
        console.log(">>>>>>>>>>>>>>>record>>>>>>>>>>", record);
        this.setRecord(record);
        this.useStore.mode = "update";

        this.router.push("/subscription/addamount");
      }
    },
    viewItem() {
      if (this.$refs.tableRef.selected.length > 0) {
        const record = Object.assign({}, this.$refs.tableRef.selected[0]);
        console.log(">>>>>>>.record>>>>>>>>", record);
        this.setRecord(record);
        this.useStore.mode = "view";
        this.router.push("/subscription/view");
      }
    },

    deleteItem() {
      console.log(">>>>>calling delete item >>>>>>>>>>>");
      if (this.$refs.tableRef.selected.length > 0) {
        const record = Object.assign({}, this.$refs.tableRef.selected[0]);
        this.useStore.mode = "delete";
        this.setRecord(record);
        this.router.push("/subscription/form");
      }
    },
    setRecord(record) {
      if (record == null) {
        this.useStore.reset();
        this.useStore.formData.client = {
          label: "Select Affilate/Client",
          value: "",
        };
        this.useStore.formData.subscribedProduct = {
          label: "Select Product",
          value: "",
        };
        this.useStore.formData.paymentPlans = {
          label: "Select Payment Plan",
          value: "",
        };

        this.useStore.formData.quantity = 1;
        this.useStore.formData.productType = {
          label: "Select Product Type",
          value: "",
        };

        this.useStore.formData.salesStatus = {
          label: "Select Payment Plan",
          value: "",
        };

        this.useStore.formData.subscriber.maritalStatus = {
          label: "Select Marital Status",
          value: "",
        };

        this.useStore.formData.subscriber.relationShipType = {
          label: "Select RelationShip Type To Next of Kin",
          value: "",
        };

        this.useStore.formData.subscriber.country = {
          label: "Select Country",
          value: "",
        };
        this.useStore.formData.subscriber.state = {
          label: "Select State",
          value: "",
        };
        this.useStore.formData.subscriber.county = {
          label: "Select County",
          value: "",
        };
        this.useStore.formData.subscriber.gender = {
          label: "Select Gender",
          value: "",
        };
        this.useStore.formData.subscriber.occupation = {
          label: "Select Occupation",
          value: "",
        };

        this.useStore.formData.subscriber.nextOfKin.maritalStatus = {
          label: "Select Marital Status",
          value: "",
        };

        this.useStore.formData.subscriber.nextOfKin.country = {
          label: "Select Country",
          value: "",
        };
        this.useStore.formData.subscriber.nextOfKin.state = {
          label: "Select State",
          value: "",
        };
        this.useStore.formData.subscriber.nextOfKin.county = {
          label: "Select County",
          value: "",
        };
        this.useStore.formData.subscriber.nextOfKin.gender = {
          label: "Select Gender",
          value: "",
        };
        this.useStore.formData.subscriber.nextOfKin.occupation = {
          label: "Select Occupation",
          value: "",
        };
      } else {
        this.useStore.formData = record;
        this.useStore.formData.client = {
          label: record.client.name,
          value: record.client.code,
        };
        this.useStore.formData.subscribedProduct = {
          label: record.subscribedProduct.name,
          value: record.subscribedProduct.id,
          amount: record.subscribedProduct.amount,
        };

        this.useStore.formData.salesStatus = {
          label: record.paymentPlans.name,
          value: record.paymentPlans.code,
        };

        this.useStore.formData.subscriber.maritalStatus = {
          label: record.subscriber.maritalStatus.name,
          value: record.subscriber.maritalStatus.code,
        };

        this.useStore.formData.subscriber.country = {
          label: record.subscriber.country.name,
          value: record.subscriber.country.code,
        };

        this.useStore.formData.subscriber.state = {
          label: record.subscriber.state.name,
          value: record.subscriber.state.code,
        };
        this.useStore.formData.subscriber.county = {
          label: record.subscriber.county.name,
          value: record.subscriber.county.code,
        };
        this.useStore.formData.subscriber.gender = {
          label: record.subscriber.gender.name,
          value: record.subscriber.gender.code,
        };
        this.useStore.formData.subscriber.occupation = {
          label: record.subscriber.occupation.name,
          value: record.subscriber.occupation.code,
        };
        this.useStore.formData.subscriber.relationShipType = {
          label: record.subscriber.relationshipType.name,
          value: record.subscriber.relationshipType.code,
        };

        this.useStore.formData.subscriber.nextOfKin.maritalStatus = {
          label: record.subscriber.nextOfKin.maritalStatus.name,
          value: record.subscriber.nextOfKin.maritalStatus.code,
        };

        this.useStore.formData.subscriber.nextOfKin.country = {
          label: record.subscriber.nextOfKin.country.name,
          value: record.subscriber.nextOfKin.country.code,
        };
        this.useStore.formData.subscriber.nextOfKin.state = {
          label: record.subscriber.nextOfKin.state.name,
          value: record.subscriber.nextOfKin.state.code,
        };
        this.useStore.formData.subscriber.nextOfKin.county = {
          label: record.subscriber.nextOfKin.county.name,
          value: record.subscriber.nextOfKin.county.code,
        };
        this.useStore.formData.subscriber.nextOfKin.gender = {
          label: record.subscriber.nextOfKin.gender.name,
          value: record.subscriber.nextOfKin.gender.code,
        };
        this.useStore.formData.subscriber.nextOfKin.occupation = {
          label: record.subscriber.nextOfKin.occupation.name,
          value: record.subscriber.nextOfKin.occupation.code,
        };

        this.useStore.reload = false;
      }
    },
  },
  beforeCreate() {
    console.log("beforeCreate");
  },
  created() {
    console.log("created");
  },
  beforeMount() {
    console.log(">>>>>>>>>>>>>>beforeMount>>>>>>>>>>>>>");
  },
  mounted() {
    console.log("this.useStore.formData.reload>>>>>", this.useStore.reload);
    if (!this.useStore.reload && this.useStore.data.length > 0) {
      this.rows = [...this.useStore.data];
    } else {
      console.log("Try to reload");
      this.fetchData();
    }
  },
  updated() {
    console.log(">>>>>>this.useStore.reload>>>>>>>>", this.useStore.reload);
    if (!this.useStore.reload && this.useStore.data.length > 0) {
      this.rows = [...this.useStore.data];
    } else {
      console.log("Try to reload");
      this.formData.client = { label: "Select Client", value: "" };
      this.fetchData();
    }
  },
};
</script>

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 310px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #0c0144
    -webkit-text-fill-color: white

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
  tbody tr:nth-child(even)
</style>
