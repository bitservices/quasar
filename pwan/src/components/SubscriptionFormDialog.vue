<template>
  <q-page padding>
    <HeaderPage :label="pageName" :hint="hint" />
    <q-stepper v-model="step" flat animated>
      <!-- Step 1 -->
      <q-step
        :name="1"
        :title="$q.screen.lt.md ? '' : 'Product Type Definition Detail'"
        icon="person"
      >
        <div v-if="$q.screen.lt.md">
          <p>Subscribed product Detail</p>
          <hr />
        </div>

        <q-form @submit.prevent="validateInfo" ref="productInfoForm">
          <q-select
            filled
            bottom-slots
            v-model="useStore.formData.client"
            :options="clients"
            label="Affilate/Client"
            :dense="dense"
            clearable
            @filter="filterAffilates"
            @update:model-value="handleClientChange"
            :readonly="isReadonly"
            :rules="[requiredRule]"
          />

          <q-select
            filled
            bottom-slots
            v-model="useStore.formData.subscribedProduct"
            :options="productList"
            label="Select Products"
            :dense="dense"
            clearable
            @update:model-value="handleProductChange"
            :readonly="isReadonly"
            :rules="[requiredRule]"
          />

          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.quantity"
            label="Enter Quantity"
            type="number"
            :readonly="isReadonly"
            :rules="[moreThanZero]"
            @change="calcuateProductAmount"
          />

          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.amount"
            label="Enter Amount"
            type="text"
            step="0.01"
            @blur="formatAmount"
            @change="
              formatAmount();
              checkBalance();
            "
            @keypress="onlyNumberKey"
            :rules="[moreThanZero]"
          />

          <q-select
            filled
            bottom-slots
            v-model="useStore.formData.salesStatus"
            :options="salesStatusList"
            label="Select Payment Plans"
            :dense="dense"
            clearable
            :readonly="isReadonly"
            :rules="[requiredRule]"
          />
          <div class="q-pa-md">
            <DatePicker
              v-model="useStore.formData.subscriptionDate"
              label="SubScription Date"
              @setDate="setSubscriptionDate"
              ref="subscriptionDateRef"
            />
          </div>
          <q-stepper-navigation>
            <div class="row justify-end q-gutter-sm">
              <q-btn
                size="md"
                color="negative"
                label="Cancel"
                @click="cancel"
              />
              <q-btn type="submit" label="Continue" color="primary" />
            </div>
          </q-stepper-navigation>
        </q-form>
      </q-step>
      <q-step
        :name="2"
        :title="$q.screen.lt.md ? '' : 'Payment Evidence'"
        icon="person"
      >
        <div v-if="$q.screen.lt.md">
          <p>Payment Evidence</p>
          <hr />
        </div>
        <q-form
          @submit.prevent="validatePaymentEvidence"
          ref="paymentEvidencefoForm"
        >
          <div class="row">
            <div class="cols-6 col-12">
              <div class="row">
                <div class="col-8">
                  <q-file
                    bottom-slots
                    filled
                    v-model="useStore.formData.paymentEvidence"
                    label="Upload Payment Evidence"
                    clearable
                    accept=".jpg,.jpeg,.png"
                    @update:model-value="validatePaymentEvidenceFile"
                    :rules="[
                      (val) => !!val || 'Payment Evidence File is required',
                      (val) =>
                        (val && val.size < 2000000) ||
                        'Payment Evidence File must be < 2MB',
                    ]"
                  >
                    <template v-slot:append>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                </div>
                <!-- Error message -->
                <div
                  v-if="evidenceError"
                  class="text-negative text-caption q-mt-sm"
                >
                  {{ evidenceError }}
                </div>

                <!-- Preview for images -->
                <div class="cols-6 col-12 q-mt-md">
                  <q-img
                    v-if="previewEvidenceUrl"
                    :src="previewEvidenceUrl"
                    spinner-color="primary"
                    style="width: 100%; height: 50%"
                  />
                </div>
              </div>
            </div>
          </div>

          <q-stepper-navigation>
            <div class="row justify-end q-gutter-sm">
              <q-btn
                size="md"
                color="negative"
                label="Cancel"
                @click="cancel"
              />
              <q-btn @click="step = 1" label="Back" />
              <q-btn
                v-if="showButton"
                type="submit"
                label="continue"
                color="primary"
              />
            </div>
          </q-stepper-navigation>
        </q-form>
      </q-step>
      <q-step
        :name="3"
        :title="$q.screen.lt.md ? '' : 'Subscribers Detail'"
        icon="info"
      >
        <div v-if="$q.screen.lt.md">
          <p>Subscriber's Detail</p>
          <hr />
        </div>
        <q-form
          @submit.prevent="validateSubscriberInfo"
          ref="subscriberInfoForm"
        >
          <q-input type="hidden" v-model="useStore.formData.subscriber.id" />
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.subscriber.fullName"
            @keyup="handleInput"
            @keydown.enter="handleEnter"
            placeholder="Search for Subscriber/Client"
            :dense="dense"
          >
          </q-input>
          <q-list v-if="showSuggestions && filteredSuggestions.length > 0">
            <q-item
              clickable
              v-for="item in filteredSuggestions"
              :key="item.id"
              @click="selectRecord(item)"
            >
              <q-item-section>{{ item.name }}</q-item-section>
              <q-item-section side>
                <!-- Side content -->
                <q-item-label caption lines="1">
                  <img :src="item.image" />
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.subscriber.lastName"
            label="Last Name"
            :dense="dense"
            :rules="[inputFieldRule]"
            :readonly="subscriberReadOnly"
          />
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.subscriber.firstName"
            label="First Name"
            :dense="dense"
            :rules="[inputFieldRule]"
            :readonly="subscriberReadOnly"
          />
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.subscriber.middleName"
            label="Middle Name"
            :dense="dense"
            :readonly="subscriberReadOnly"
          />
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.subscriber.phoneNumber"
            label="Subscriber Phone Number"
            :dense="dense"
            :rules="[inputFieldRule]"
            :readonly="subscriberReadOnly"
          />
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.subscriber.emailAddress"
            label="Subscriber Email"
            :readonly="subscriberReadOnly"
            :dense="dense"
            :rules="[inputFieldRule]"
          />
          <q-select
            filled
            bottom-slots
            v-model="useStore.formData.subscriber.gender"
            :options="genderList"
            label="Select Gender"
            :dense="dense"
            :rules="[requiredRule]"
            :readonly="subscriberReadOnly"
          />

          <q-select
            filled
            bottom-slots
            v-model="useStore.formData.subscriber.maritalStatus"
            :options="maritalStatusList"
            label="Select Marital Status"
            :dense="dense"
            :readonly="subscriberReadOnly"
            :rules="[requiredRule]"
          />
          <q-select
            filled
            bottom-slots
            v-model="useStore.formData.subscriber.occupation"
            :options="occupationList"
            label="Select Occupation"
            :dense="dense"
            :readonly="subscriberReadOnly"
            :rules="[requiredRule]"
          />
          <q-select
            filled
            bottom-slots
            v-model="useStore.formData.subscriber.relationShipType"
            :options="relationshipList"
            label="Select RelationShip To Next ofKin"
            :dense="dense"
            :rules="[requiredRule]"
          />

          <div class="q-pa-md">
            <DatePicker
              v-model="useStore.formData.subscriber.dateOfBirth"
              label="Date of Birth"
              @setDate="setSubscriberDateOfBirth"
              ref="subscriberDateOfBirthRef"
              :readonly="subscriberReadOnly"
            />
          </div>

          <q-stepper-navigation>
            <div class="row justify-end q-gutter-sm">
              <q-btn
                size="md"
                color="negative"
                label="Cancel"
                @click="cancel"
              />
              <q-btn @click="step = 2" label="Back" />
              <q-btn type="submit" label="Continue" color="primary" />
            </div>
          </q-stepper-navigation>
        </q-form>
      </q-step>
      <q-step
        :name="4"
        :title="$q.screen.lt.md ? '' : 'Subscriber Addtess'"
        icon="email"
      >
        <div v-if="$q.screen.lt.md">
          <p>SubScriber Address</p>
          <hr />
        </div>
        <q-form
          @submit.prevent="validateSubscriberAddress"
          ref="subscriberAddressForm"
        >
          <div class="row">
            <div class="cols-6 col-12">
              <q-input
                filled
                bottom-slots
                v-model="useStore.formData.subscriber.address"
                label="Street"
                type="textarea"
                rows="2"
                maxlength="1000"
                :readonly="subscriberReadOnly"
              />

              <q-select
                filled
                bottom-slots
                v-model="useStore.formData.subscriber.country"
                :options="countries"
                label="Select Country"
                @update:model-value="handleCountryUpdate"
                :dense="dense"
                :rules="[requiredRule]"
                use-input
                input-debounce="200"
                clearable
                @filter="filterCountries"
                :readonly="subscriberReadOnly"
              />
              <q-select
                filled
                bottom-slots
                v-model="useStore.formData.subscriber.state"
                :options="stateList"
                label="Select State"
                @update:model-value="handleStateUpdate"
                :dense="dense"
                :rules="[requiredRule]"
                use-input
                input-debounce="200"
                clearable
                @filter="filterStates"
                :readonly="subscriberReadOnly"
              />
              <q-select
                filled
                bottom-slots
                v-model="useStore.formData.subscriber.county"
                :options="counties"
                label="Select County"
                :dense="dense"
                :rules="[requiredRule]"
                use-input
                input-debounce="200"
                clearable
                @filter="filterCounties"
                :readonly="subscriberReadOnly"
              />
            </div>
          </div>
          <q-stepper-navigation>
            <div class="row justify-end q-gutter-sm">
              <q-btn
                size="md"
                color="negative"
                label="Cancel"
                @click="cancel"
              />
              <q-btn @click="step = 3" label="Back" />
              <q-btn type="submit" label="Continue" color="primary" />
            </div>
          </q-stepper-navigation>
        </q-form>
      </q-step>
      <q-step
        :name="5"
        :title="$q.screen.lt.md ? '' : 'SubScriber Image & Signature'"
        icon="person"
      >
        <div v-if="$q.screen.lt.md">
          <p>SubScriber Image & Signature'</p>
          <hr />
        </div>
        <q-form
          @submit.prevent="validateSubscriberImage"
          ref="subscriberImageForm"
        >
          <div class="row">
            <div class="cols-6 col-12">
              <div class="row">
                <div class="col-8">
                  <q-file
                    v-if="previewImageUrl"
                    bottom-slots
                    filled
                    v-model="useStore.formData.subscriber.imageUrl"
                    label="Subscriber Image"
                    clearable
                    accept=".jpg,.jpeg,.png"
                    @update:model-value="validateImageFile"
                  >
                    <template v-slot:append>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                  <q-file
                    v-else
                    bottom-slots
                    filled
                    v-model="useStore.formData.subscriber.imageUrl"
                    label="Subscriber Image"
                    clearable
                    accept=".jpg,.jpeg,.png"
                    @update:model-value="validateImageFile"
                    :rules="[
                      (val) => !!val || 'Subscriber Image File is required',
                      (val) =>
                        (val && val.size < 2000000) ||
                        'Subscriber Image File must be < 2MB',
                    ]"
                  >
                    <template v-slot:append>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                </div>
                <!-- Error message -->
                <div v-if="imgError" class="text-negative text-caption q-mt-sm">
                  {{ imgError }}
                </div>

                <!-- Preview for images -->
                <div class="cols-6 col-12 q-mt-md">
                  <q-img
                    v-if="previewImageUrl"
                    :src="previewImageUrl"
                    spinner-color="primary"
                    style="width: 100%; height: 50%"
                  />
                </div>
              </div>
              <br />
              <hr />
              <div class="row">
                <div class="col-8">
                  <q-file
                    v-if="previewSignatureUrl"
                    bottom-slots
                    filled
                    v-model="useStore.formData.subscriber.signature"
                    label="Subscriber Signature"
                    clearable
                    accept=".jpg,.jpeg,.png"
                    @update:model-value="validateSignatureFile"
                  >
                    <template v-slot:append>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                  <q-file
                    v-else
                    bottom-slots
                    filled
                    v-model="useStore.formData.subscriber.signature"
                    label="Subscriber Signature"
                    clearable
                    accept=".jpg,.jpeg,.png"
                    @update:model-value="validateSignatureFile"
                    :rules="[
                      (val) => !!val || 'Subscriber Signature File is required',
                      (val) =>
                        (val && val.size < 2000000) ||
                        'Subscriber Signature File must be < 2MB',
                    ]"
                  >
                    <template v-slot:append>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                </div>
                <!-- Error message -->
                <div v-if="imgError" class="text-negative text-caption q-mt-sm">
                  {{ imgError }}
                </div>

                <!-- Preview for images -->
                <div class="cols-6 col-12 q-mt-md">
                  <q-img
                    v-if="previewSignatureUrl"
                    :src="previewSignatureUrl"
                    spinner-color="primary"
                    style="width: 100%; height: 50%"
                  />
                </div>
              </div>
            </div>
          </div>

          <q-stepper-navigation>
            <div class="row justify-end q-gutter-sm">
              <q-btn
                size="md"
                color="negative"
                label="Cancel"
                @click="cancel"
              />
              <q-btn @click="step = 4" label="Back" />
              <q-btn type="submit" label="Continue" color="primary" />
            </div>
          </q-stepper-navigation>
        </q-form>
      </q-step>

      <q-step
        :name="6"
        :title="$q.screen.lt.md ? '' : 'Subscribers Next of Kin'"
        icon="info"
      >
        <div v-if="$q.screen.lt.md">
          <p>Subscribers Next of Kin</p>
          <hr />
        </div>
        <q-form @submit.prevent="validateNextOfkinInfo" ref="nextofkinInfoForm">
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.subscriber.nextOfKin.lastName"
            label="Last Name"
            :dense="dense"
            :rules="[inputFieldRule]"
            :readonly="nextOfKinReadOnly"
          />
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.subscriber.nextOfKin.firstName"
            label="First Name"
            :dense="dense"
            :rules="[inputFieldRule]"
            :readonly="nextOfKinReadOnly"
          />
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.subscriber.nextOfKin.middleName"
            label="Middle Name"
            :dense="dense"
            :readonly="nextOfKinReadOnly"
          />
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.subscriber.nextOfKin.phoneNumber"
            label="Phone Number"
            :dense="dense"
            :rules="[inputFieldRule]"
            :readonly="nextOfKinReadOnly"
          />
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.subscriber.nextOfKin.emailAddress"
            label="Email"
            :readonly="nextOfKinReadOnly"
            :dense="dense"
            :rules="[inputFieldRule]"
          />
          <q-select
            filled
            bottom-slots
            v-model="useStore.formData.subscriber.nextOfKin.gender"
            :options="genderList"
            label="Select Gender"
            :dense="dense"
            :rules="[requiredRule]"
            :readonly="nextOfKinReadOnly"
          />

          <q-select
            filled
            bottom-slots
            v-model="useStore.formData.subscriber.nextOfKin.maritalStatus"
            :options="maritalStatusList"
            label="Select Marital Status"
            :dense="dense"
            :readonly="nextOfKinReadOnly"
          />
          <q-select
            filled
            bottom-slots
            v-model="useStore.formData.subscriber.nextOfKin.occupation"
            :options="occupationList"
            label="Select Occupation"
            :dense="dense"
            :readonly="nextOfKinReadOnly"
          />

          <div class="q-pa-md">
            <DatePicker
              v-model="useStore.formData.subscriber.nextOfKin.dateOfBirth"
              label="Date of Birth"
              @setDate="setNextOfKinDateOfBirth"
              ref="nextofKinDateOfBirthRef"
              :readonly="nextOfKinReadOnly"
            />
          </div>

          <q-stepper-navigation>
            <div class="row justify-end q-gutter-sm">
              <q-btn
                size="md"
                color="negative"
                label="Cancel"
                @click="cancel"
              />
              <q-btn @click="step = 5" label="Back" />
              <q-btn type="submit" label="Continue" color="primary" />
            </div>
          </q-stepper-navigation>
        </q-form>
      </q-step>
      <q-step
        :name="7"
        :title="$q.screen.lt.md ? '' : 'Next of Kin Addtess'"
        icon="email"
      >
        <div v-if="$q.screen.lt.md">
          <p>Next of Kin Address</p>
          <hr />
        </div>
        <q-form
          @submit.prevent="validateNextOfKinAddress"
          ref="nextofkinAddressForm"
        >
          <div class="row">
            <div class="cols-6 col-12">
              <q-input
                filled
                bottom-slots
                v-model="useStore.formData.subscriber.nextOfKin.address"
                label="Street"
                type="textarea"
                rows="2"
                maxlength="1000"
                :rules="[inputFieldRule]"
                :readonly="nextOfKinReadOnly"
              />

              <q-select
                filled
                bottom-slots
                v-model="useStore.formData.subscriber.nextOfKin.country"
                :options="countries"
                label="Select Country"
                @update:model-value="handleNextOfKinCountryUpdate"
                :dense="dense"
                :rules="[requiredRule]"
                use-input
                input-debounce="200"
                clearable
                @filter="filterNextOfKinCountries"
                :readonly="nextOfKinReadOnly"
              />
              <q-select
                filled
                bottom-slots
                v-model="useStore.formData.subscriber.nextOfKin.state"
                :options="nextOfKinStateList"
                label="Select State"
                @update:model-value="handleNextOfKinStateUpdate"
                :dense="dense"
                :rules="[requiredRule]"
                use-input
                input-debounce="200"
                clearable
                @filter="filterNextOfKinStates"
                :readonly="nextOfKinReadOnly"
              />
              <q-select
                filled
                bottom-slots
                v-model="useStore.formData.subscriber.nextOfKin.county"
                :options="nextOfKinCounties"
                label="Select County"
                :dense="dense"
                :rules="[requiredRule]"
                use-input
                input-debounce="200"
                clearable
                @filter="filterNextOfKinCounties"
                :readonly="nextOfKinReadOnly"
              />
            </div>
          </div>
          <q-stepper-navigation>
            <div class="row justify-end q-gutter-sm">
              <q-btn
                size="md"
                color="negative"
                label="Cancel"
                @click="cancel"
              />
              <q-btn @click="step = 6" label="Back" />
              <q-btn type="submit" label="Continue" color="primary" />
            </div>
          </q-stepper-navigation>
        </q-form>
      </q-step>

      <q-step
        :name="8"
        :title="$q.screen.lt.md ? '' : 'Next of Kin  Image'"
        icon="person"
      >
        <div v-if="$q.screen.lt.md">
          <p>Next of Kin Image'</p>
          <hr />
        </div>
        <q-form @submit.prevent="submitForm" ref="nextOfKinImageForm">
          <div class="row">
            <div class="cols-6 col-12">
              <div class="row">
                <div class="col-8">
                  <q-file
                    v-if="previewNextOfKinImageUrl"
                    bottom-slots
                    filled
                    v-model="useStore.formData.subscriber.nextOfKin.imageUrl"
                    label="Select Next of Kin Image"
                    clearable
                    accept=".jpg,.jpeg,.png"
                    @update:model-value="validateNextOfKinImageFile"
                  >
                    <template v-slot:append>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                  <q-file
                    v-else
                    bottom-slots
                    filled
                    v-model="useStore.formData.subscriber.nextOfKin.imageUrl"
                    label="Select Next of Kin Image"
                    clearable
                    accept=".jpg,.jpeg,.png"
                    @update:model-value="validateNextOfKinImageFile"
                    :rules="[
                      (val) =>
                        !!val ||
                        'Subscriber next of Kin Image File is required',
                      (val) =>
                        (val && val.size < 2000000) ||
                        'Subscriber next of Kin Image must be < 2MB',
                    ]"
                  >
                    <template v-slot:append>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                </div>
                <!-- Error message -->
                <div
                  v-if="nextOfKinImgError"
                  class="text-negative text-caption q-mt-sm"
                >
                  {{ nextOfKinImgError }}
                </div>

                <!-- Preview for images -->
                <div class="cols-6 col-12 q-mt-md">
                  <q-img
                    v-if="previewNextOfKinImageUrl"
                    :src="previewNextOfKinImageUrl"
                    spinner-color="primary"
                    style="width: 100%; height: 50%"
                  />
                </div>
              </div>
            </div>
          </div>

          <q-stepper-navigation>
            <div class="row justify-end q-gutter-sm">
              <q-btn
                size="md"
                color="negative"
                label="Cancel"
                @click="cancel"
              />
              <q-btn @click="step = 7" label="Back" />
              <q-btn
                v-if="showButton"
                :label="actionLabel"
                :color="colourLabel"
                type="submit"
              />
            </div>
          </q-stepper-navigation>
        </q-form>
      </q-step>
    </q-stepper>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage, Loading, QSpinnerGears } from "quasar";
import { useI18n } from "vue-i18n";
import { ref, computed, nextTick } from "vue";
import axios from "axios";
import path from "src/router/urlpath";
import { useSubscriptionStore } from "src/stores/subscriptionStore";
import { useRouter } from "vue-router";
import helper from "src/utils/helper";
import { useQuasar } from "quasar";
import HeaderPage from "src/components/HeaderPage.vue";
import {
  isRequired,
  amountFieldRequired,
  inputFieldRequired,
  greaterThanZero,
} from "src/validation/validation";
import DatePicker from "src/components/DatePicker.vue";

export default {
  components: {
    HeaderPage,
    DatePicker,
  },
  name: "ProductTypeFormDialog",

  data() {
    const useStore = useSubscriptionStore();
    const router = useRouter();
    const $q = useQuasar();
    const { t } = useI18n();
    const pageName = computed(() => t("subscription.pagename"));
    const hint = computed(() => t("subscription.maintain.hint"));
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // Set the width and height of the dialog to cover the viewport
    const controlWidth = viewportWidth * 0.9; // 90% of the viewport width
    const controlHeight = viewportHeight * 0.9; // 90% of the viewport height
    const dialogWidth = controlWidth + "px";
    const dialogHeight = controlHeight + "px";
    const userEmail = LocalStorage.getItem("userEmail");
    const headers = SessionStorage.getItem("headers");

    const file = ref(null);
    const previewImageUrl = ref(null);
    const previewVideoUrl = ref(null);
    const previewSignatureUrl = ref(null);
    const previewEvidenceUrl = ref(null);
    const previewNextOfKinImageUrl = ref(null);

    const imgError = ref(null);
    const videoError = ref(null);
    const pdfError = ref(null);
    const evidenceError = ref(null);
    const nextOfKinImgError = ref(null);

    const step = ref(1);

    return {
      previewNextOfKinImageUrl,
      nextOfKinImgError,
      dialogWidth,
      dialogHeight,
      clients: [],
      allClients: [],
      userEmail,
      headers,
      countries: [],
      allCountries: [],
      stateList: [],
      allStates: [],
      counties: [],
      allCounties: [],
      nextOfKinCountries: [],
      allNextOfKinCountries: [],
      nextOfKinStateList: [],
      allNextOfKinStates: [],
      nextOfKinCounties: [],
      allNextOfKinCounties: [],
      salesStatusList: [],
      dense: true,
      isReadonly: false,
      subscriberReadOnly: false,
      nextOfKinReadOnly: false,
      pageName,
      hint,
      requiredRule: (value) => isRequired(value),
      moreThanZero: (value) => amountFieldRequired(value),
      inputFieldRule: (value) => inputFieldRequired(value),
      productTypes: [],
      useStore,
      actionLabel: "Create",
      colourLabel: "posotive",
      router,
      $q,
      step,
      showButton: true,
      dimensions: [],
      previewImageUrl,
      previewVideoUrl,
      previewEvidenceUrl,
      evidenceError,
      file,
      imgError,
      videoError,
      previewSignatureUrl,
      pdfError,
      balanceAmount: 0.0,
      filteredSuggestions: [],
      productList: [],
      showSuggestions: false,
      data: {},
      paymentEvidenceFileBase64: null,
      subscriberImageBase64: null,
      subscriberSignatureBase64: null,
      nextOfKinImgageBase64: null,
      relationshipList: [],
    };
  },
  watch: {
    step: {
      async handler(newVal, oldVal) {
        console.log(`Step changed from ${oldVal} → ${newVal}`);
        console.log(
          "formData inside wwatch>>>>>>>>>>>",
          this.useStore.formData
        );
        await nextTick();
        console.log(
          ">>>>>>this.useStore.formData.subscriptionDate>>>>>>>>",
          this.useStore.formData.subscriptionDate
        );

        const subscriptionDateEl = this.$refs.subscriptionDateRef;
        const subscriberDateOfBirthEl = this.$refs.subscriberDateOfBirthRef;
        const nextOfKinDateOfBirth = this.$refs.nextofKinDateOfBirthRef;
        if (subscriptionDateEl) {
          subscriptionDateEl.onChangeDate(
            this.useStore.formData.subscriptionDate
          );
        }

        console.log(
          ">>>>>> this.useStore.formData.subscriber.dateOfBirth>>>>>>>>",
          this.useStore.formData.subscriber.dateOfBirth
        );
        if (subscriberDateOfBirthEl) {
          subscriberDateOfBirthEl.onChangeDate(
            this.useStore.formData.subscriber.dateOfBirth
          );
        }

        if (nextOfKinDateOfBirth) {
          nextOfKinDateOfBirth.onChangeDate(
            this.useStore.formData.subscriber.nextOfKin.dateOfBirth
          );
        }
      },
    },
  },
  methods: {
    setNextOfKinDateOfBirth(value) {
      this.useStore.formData.subscriber.nextOfKin.dateOfBirth = value;
    },
    setSubscriptionDate(value) {
      this.useStore.formData.subscriptionDate = value;
    },

    setSubscriberDateOfBirth(value) {
      this.useStore.formData.subscriber.dateOfBirth = value;
    },

    validatePaymentEvidenceFile(files) {
      this.evidenceError = null;
      this.previewEvidenceUrl = null;

      const f = files[0] || files;
      console.log(">>>>>>>file >>>>>>>>>>", f);
      if (!f) return;

      // 1. Check size (e.g. max 2MB)
      const maxSize = 5 * 1024 * 1024;
      console.log(">>>>>f size >>>>>>>>", f.size);
      if (f.size > maxSize) {
        this.evidenceError = "File size must be less than 2MB";
        this.file = null;
        return;
      }

      // 2. Check type
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(f.type)) {
        this.evidenceError = "Only JPG, PNG, and PDF files are allowed";
        this.file = null;
        return;
      }

      // 3. Generate preview if it's an image
      if (f.type.startsWith("image/")) {
        this.previewEvidenceUrl = URL.createObjectURL(f);
        console.log(
          ">>>>>this.previewEvidenceUrl>>>>>>>",
          this.previewEvidenceUrl
        );
      }

      if (f) {
        const reader = new FileReader();
        reader.onload = (e) => {
          // e.target.result includes base64 with prefix like "data:image/png;base64,...."
          this.paymentEvidenceFileBase64 = e.target.result;
        };
        reader.readAsDataURL(f);
      }
    },

    validatePaymentEvidence() {
      if (this.$refs.paymentEvidencefoForm.validate()) {
        this.step = 3;
      }
    },
    onlyNumberKey(e) {
      const charCode = e.which ? e.which : e.keyCode;
      // Allow only 0-9 and dot (.)
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        e.preventDefault();
      }
    },
    formatAmount() {
      let cleanAmount = this.useStore.formData.amount;
      try {
        cleanAmount = cleanAmount.replace(/,/g, "");
        this.useStore.formData.amount = cleanAmount;
      } catch (e) {
        console.log("Error >>>>>", e);
      }

      if (this.useStore.formData.amount) {
        let value = parseFloat(
          this.useStore.formData.amount.toString().replace(/,/g, "")
        );
        this.useStore.formData.amount = value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        });
      }
    },

    filterAffilates(val, update) {
      if (val === "") {
        update(() => {
          this.clients = this.allClients;
        });
        return;
      }

      const needle = val.toLowerCase();
      update(() => {
        this.clients = this.allClients.filter((option) =>
          option.label.toLowerCase().includes(needle)
        );
      });
    },

    filterCountries(val, update) {
      if (val === "") {
        update(() => {
          this.countries = this.allCountries;
        });
        return;
      }

      const needle = val.toLowerCase();
      update(() => {
        this.countries = this.allCountries.filter((option) =>
          option.label.toLowerCase().includes(needle)
        );
      });
    },

    filterStates(val, update) {
      if (val === "") {
        update(() => {
          this.stateList = this.allStates;
        });
        return;
      }

      const needle = val.toLowerCase();
      update(() => {
        this.stateList = this.allStates.filter((option) =>
          option.label.toLowerCase().includes(needle)
        );
      });
    },
    filterCounties(val, update) {
      if (val === "") {
        update(() => {
          this.counties = this.allCounties;
        });
        return;
      }

      const needle = val.toLowerCase();
      update(() => {
        this.counties = this.allCounties.filter((option) =>
          option.label.toLowerCase().includes(needle)
        );
      });
    },

    filterNextOfKinCountries(val, update) {
      if (val === "") {
        update(() => {
          this.nextOfKinCountries = this.allNextOfKinCountries;
        });
        return;
      }

      const needle = val.toLowerCase();
      update(() => {
        this.nextOfKinCountries = this.allNextOfKinCountries.filter((option) =>
          option.label.toLowerCase().includes(needle)
        );
      });
    },

    filterNextOfKinStates(val, update) {
      if (val === "") {
        update(() => {
          this.nextOfKinStateList = this.allNextOfKinStates;
        });
        return;
      }

      const needle = val.toLowerCase();
      update(() => {
        this.nextOfKinStateList = this.allNextOfKinStates.filter((option) =>
          option.label.toLowerCase().includes(needle)
        );
      });
    },
    filterNextOfKinCounties(val, update) {
      if (val === "") {
        update(() => {
          this.nextOfKinCounties = this.allNextOfKinCounties;
        });
        return;
      }

      const needle = val.toLowerCase();
      update(() => {
        this.nextOfKinCounties = this.allNextOfKinCounties.filter((option) =>
          option.label.toLowerCase().includes(needle)
        );
      });
    },

    loadUserClients() {
      const requestParam = {
        params: {
          isAnAffilate: true,
          status: "A",
        },
      };
      try {
        axios
          .get(path.CLIENT_SEARCH, requestParam, this.headers)
          .then((response) => {
            this.clients = response.data.data.map((option) => ({
              label: option.name,
              value: option.code,
            }));

            this.allClients = this.clients;
          })
          .catch((error) => {
            console.error("Error fetching options:", error);
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
    handleClientChange(selectedItem) {
      try {
        const requestParam = {
          params: {
            client: selectedItem.value,
          },
        };
        axios
          .get(path.PRODUCTDEF_SEARCH, requestParam, this.headers)
          .then((response) => {
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            this.productList = response.data.data.map((option) => ({
              label: option.name,
              value: option.id,
              amount: option.amount,
            }));
          })
          .catch((error) => {
            console.error("Error fetching options:", error);
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },

    handleProductChange(selectedItem) {
      let productAmount = parseFloat(selectedItem.amount);
      let quantity = parseFloat(
        this.useStore.formData.quantity == null
          ? 1
          : this.useStore.formData.quantity
      );
      let calculatedAmount = productAmount * quantity;
      this.useStore.formData.amount = calculatedAmount;

      this.balanceAmount = calculatedAmount;
      this.formatAmount();
    },
    handleInput() {
      this.filteredSuggestions = [];
      if (
        this.useStore.formData.subscriber.fullName === "" ||
        this.useStore.formData.subscriber.fullName.length < 4
      ) {
        this.showSuggestions = false;
      } else {
        const filter = {
          params: {
            term: this.useStore.formData.subscriber.fullName,
            email: this.userEmail,
          },
        };
        axios
          .get(path.SUBSCRIBER_AUTOCOMPLETER, filter, this.headers)
          .then((response) => {
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            this.filteredSuggestions = response.data.data.map((option) => ({
              name:
                option.lastName +
                " " +
                option.firstName +
                " " +
                option.middleName,
              email: option.email,
              image: option.imageUrl,
              id: option.id,
              obj: option,
            }));
          })
          .catch((error) => {
            console.error("Error fetching options:", error);
          });
        // this.filteredSuggestions = this.suggestions.filter((item) =>
        //   item.toLowerCase().includes(this.inputValue.toLowerCase())
        // );
        this.showSuggestions = true;
      }
    },
    handleEnter() {
      if (this.filteredSuggestions.length > 0) {
        this.selectRecord(this.filteredSuggestions[0]);
      }
    },
    selectRecord(subscriber) {
      console.log(
        "Subscriber information >>>>>>>>>obj>>>>>>>>>>>>>",
        subscriber
      );
      this.useStore.formData.subscriber = subscriber.obj;
      this.useStore.formData.subscriber.fullName = subscriber.name;
      this.useStore.formData.subscriber.id = subscriber.id;
      this.showSuggestions = false;
      this.setSubscriberValues(subscriber.obj);
    },

    validateInfo() {
      if (this.$refs.productInfoForm.validate()) {
        this.step = 2;
      }
    },
    validateSubscriberInfo() {
      if (this.$refs.subscriberInfoForm.validate()) {
        this.step = 4;
      }
    },

    validateSubscriberAddress() {
      if (this.$refs.subscriberAddressForm.validate()) {
        this.step = 5;
      }
    },

    validateSubscriberImage() {
      if (this.$refs.subscriberImageForm.validate()) {
        this.step = 6;
      }
    },

    validateNextOfkinInfo() {
      if (this.$refs.nextofkinInfoForm.validate()) {
        this.step = 7;
      }
    },

    validateNextOfKinAddress() {
      if (this.$refs.nextofkinAddressForm.validate()) {
        this.step = 8;
      }
    },

    jsonToFormData(obj, form = new FormData(), namespace = "") {
      for (let key in obj) {
        if (!obj.hasOwnProperty(key)) continue;

        const formKey = namespace ? `${namespace}[${key}]` : key;
        const value = obj[key];

        if (value instanceof File) {
          // Handle file
          form.append(formKey, value);
        } else if (typeof value === "object" && value !== null) {
          // Recursively handle nested objects
          this.jsonToFormData(value, form, formKey);
        } else {
          // Handle primitives
          form.append(formKey, value);
        }
      }
      return form;
    },
    submitForm() {
      if (this.$refs.nextOfKinImageForm.validate()) {
        this.data = Object.assign({}, this.useStore.formData);

        const record = {
          ...this.data,
          client: this.data.client?.value || null,
          subscribedProduct: this.data.subscribedProduct?.value || null,
          salesStatus: this.data.salesStatus?.value || null,
          salesStatus: this.data.salesStatus?.value || null,
          paymentPlan: this.data.salesStatus?.value || null,
          paymentEvidence: this.paymentEvidenceFileBase64.split(",")[1],
          realtor: this.userEmail,
          subscriber: {
            ...this.data.subscriber,
            gender: this.data.subscriber.gender?.value || null,
            maritalStatus: this.data.subscriber.maritalStatus?.value || null,
            occupation: this.data.subscriber.occupation?.value || null,
            relationShipType:
              this.data.subscriber.relationShipType?.value || null,
            country: this.data.subscriber.country?.value || null,
            state: this.data.subscriber.state?.value || null,
            county: this.data.subscriber.county?.value || null,
            imageUrl: this.subscriberImageBase64.split(",")[1],
            signature: this.subscriberSignatureBase64.split(",")[1],
            nextOfKin: {
              ...this.data.subscriber.nextOfKin,
              gender: this.data.subscriber.nextOfKin.gender?.value || null,
              maritalStatus:
                this.data.subscriber.nextOfKin.maritalStatus?.value || null,
              occupation:
                this.data.subscriber.nextOfKin.occupation?.value || null,
              country: this.data.subscriber.nextOfKin.country?.value || null,
              state: this.data.subscriber.nextOfKin.state?.value || null,
              county: this.data.subscriber.nextOfKin.county?.value || null,
              imageUrl: this.nextOfKinImgageBase64.split(",")[1],
            },
          },
        };

        console.log(">>>>>>>record>>>>>>>>>", record);
        record.amount = record.amount.replace(/,/g, "");
        record.createdBy = this.userEmail;
        let promise = "";
        if (this.useStore.mode == "create") {
          record.status = "A";
          promise = axios.post(path.SUBSCRIPTION_CREATE, record, this.headers);
        }
        if (this.useStore.mode == "update") {
          promise = axios.put(path.SUBSCRIPTION_UPDATE, record, this.headers);
        } else if (this.useStore.mode == "delete") {
          promise = axios.post(path.SUBSCRIPTION_REMOVE, record, this.headers);
        }

        promise
          .then((response) => {
            const result = response.data;
            //Loading.hide();
            if (result.success) {
              this.useStore.reload = true;
              this.$q.notify({
                type: "positive",
                message: result.message,
                position: "center",
              });
            } else {
              this.$q.notify({
                type: "negative",
                message: result.message,
                position: "center",
              });
            }

            this.router.push("/subscription");
          })
          .catch((error) => {
            console.error("Error fetching options:", error);
            this.$q.notify({
              type: "negative",
              message: error.message,
              position: "center",
            });
          });
      }
    },
    handleCountryUpdate(value) {
      this.useStore.formData.subscriber.county = { value: "", label: "" };
      this.useStore.formData.subscriber.state = { value: "", label: "" };
      this.handleCountryChange(value);
    },
    handleStateUpdate(value) {
      this.useStore.formData.subscriber.county = { value: "", label: "" };
      this.handleStateChange(value);
    },
    handleCountryChange(selectedItem) {
      const requestParams = {
        params: {
          countryCode: selectedItem.value,
        },
      };
      axios
        .get(path.STATE_SEARCH, requestParams, this.headers)
        .then((response) => {
          // Assuming the response data is an array of objects with 'value' and 'label' properties
          this.stateList = response.data.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
          this.allStates = this.stateList;
        })
        .catch((error) => {
          console.error("Error fetching options:", error);
        });
    },
    handleStateChange(selectedItem) {
      console.log(">>>>>>>selectedItem>>>>>>>>>>>>", selectedItem);
      const requestParams = {
        params: {
          countryCode: this.useStore.formData.subscriber.country.value,
          stateCode: selectedItem.value,
        },
      };
      axios
        .get(path.COUNTY_SEARCH, requestParams, this.headers)
        .then((response) => {
          // Assuming the response data is an array of objects with 'value' and 'label' properties
          this.counties = response.data.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
          this.allCounties = this.counties;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    handleNextOfKinCountryUpdate(value) {
      this.useStore.formData.subscriber.nextOfKin.county = {
        value: "",
        label: "",
      };
      this.useStore.formData.subscriber.nextOfKin.state = {
        value: "",
        label: "",
      };
      this.handleNextOfKinCountryChange(value);
    },
    handleNextOfKinStateUpdate(value) {
      this.useStore.formData.subscriber.nextOfKin.county = {
        value: "",
        label: "",
      };
      this.handleNextOfKinStateChange(value);
    },
    handleNextOfKinCountryChange(selectedItem) {
      const requestParams = {
        params: {
          countryCode: selectedItem.value,
        },
      };
      axios
        .get(path.STATE_SEARCH, requestParams, this.headers)
        .then((response) => {
          // Assuming the response data is an array of objects with 'value' and 'label' properties
          this.nextOfKinStateList = response.data.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
          this.allNextOfKinStates = this.nextOfKinStateList;
        })
        .catch((error) => {
          console.error("Error fetching options:", error);
        });
    },
    handleNextOfKinStateChange(selectedItem) {
      console.log(">>>>>>>selectedItem>>>>>>>>>>>>", selectedItem);
      const requestParams = {
        params: {
          countryCode:
            this.useStore.formData.subscriber.nextOfKin.country.value,
          stateCode: selectedItem.value,
        },
      };
      axios
        .get(path.COUNTY_SEARCH, requestParams, this.headers)
        .then((response) => {
          // Assuming the response data is an array of objects with 'value' and 'label' properties
          this.nextOfKinCounties = response.data.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
          this.allNextOfKinCounties = this.nextOfKinCounties;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    cancel() {
      this.useStore.reload = false;
      this.router.push("/subscription");
    },
    validateImageFile(files) {
      this.imgError = null;
      this.previewImageUrl = null;

      const f = files[0] || files;
      console.log(">>>>>>>f>>>>>>>>>>", f);
      if (!f) return;

      // 1. Check size (e.g. max 2MB)
      const maxSize = 5 * 1024 * 1024;
      console.log(">>>>>f size >>>>>>>>", f.size);
      if (f.size > maxSize) {
        this.imgError = "File size must be less than 2MB";
        this.file = null;
        return;
      }

      // 2. Check type
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(f.type)) {
        this.imgError = "Only JPG, PNG, and PDF files are allowed";
        this.file = null;
        return;
      }

      // 3. Generate preview if it's an image
      if (f.type.startsWith("image/")) {
        this.previewImageUrl = URL.createObjectURL(f);
        console.log(">>>>>this.previewImageUrl>>>>>>>", this.previewImageUrl);
      }
      if (f) {
        const reader = new FileReader();
        reader.onload = (e) => {
          // e.target.result includes base64 with prefix like "data:image/png;base64,...."
          this.subscriberImageBase64 = e.target.result;
        };
        reader.readAsDataURL(f);
      }
    },

    validateSignatureFile(files) {
      console.log(">>>>>>>inside validte File>>>>>>>>>>", files);
      this.signatureError = null;
      this.previewSignatureUrl = null;

      const f = files[0] || files;
      console.log(">>>>>>>f>>>>>>>>>>", f);
      if (!f) return;

      // 1. Check size (e.g. max 2MB)
      const maxSize = 5 * 1024 * 1024;
      console.log(">>>>>f size >>>>>>>>", f.size);
      if (f.size > maxSize) {
        this.signatureError = "File size must be less than 2MB";
        this.file = null;
        return;
      }

      // 2. Check type
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(f.type)) {
        this.signatureError = "Only JPG, PNG, and PDF files are allowed";
        this.file = null;
        return;
      }

      // 3. Generate preview if it's an image
      if (f.type.startsWith("image/")) {
        this.previewSignatureUrl = URL.createObjectURL(f);
        console.log(
          ">>>>>this.previewImageUrl>>>>>>>",
          this.previewSignatureUrl
        );
      }

      if (f) {
        const reader = new FileReader();
        reader.onload = (e) => {
          // e.target.result includes base64 with prefix like "data:image/png;base64,...."
          this.subscriberSignatureBase64 = e.target.result;
        };
        reader.readAsDataURL(f);
      }
    },
    validateNextOfKinImageFile(files) {
      console.log(">>>>>>>inside validte File>>>>>>>>>>", files);
      this.nextOfKinImgError = null;
      this.previewNextOfKinImageUrl = null;

      const f = files[0] || files;
      console.log(">>>>>>>f>>>>>>>>>>", f);
      if (!f) return;

      // 1. Check size (e.g. max 2MB)
      const maxSize = 5 * 1024 * 1024;
      console.log(">>>>>f size >>>>>>>>", f.size);
      if (f.size > maxSize) {
        this.nextOfKinImgError = "File size must be less than 2MB";
        this.file = null;
        return;
      }

      // 2. Check type
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(f.type)) {
        this.nextOfKinImgError = "Only JPG, PNG, and PDF files are allowed";
        this.file = null;
        return;
      }

      // 3. Generate preview if it's an image
      if (f.type.startsWith("image/")) {
        this.previewNextOfKinImageUrl = URL.createObjectURL(f);
        console.log(
          ">>>>>this.previewImageUrl>>>>>>>",
          this.previewNextOfKinImageUrl
        );
      }

      if (f) {
        const reader = new FileReader();
        reader.onload = (e) => {
          // e.target.result includes base64 with prefix like "data:image/png;base64,...."
          this.nextOfKinImgageBase64 = e.target.result;
        };
        reader.readAsDataURL(f);
      }
    },

    updateData() {
      console.log(">>>>>>at updated value >>>>>>>>>", this.useStore.formData);
      this.isReadonly = false;
      if (this.useStore.mode == "view") {
        this.showButton = false;
      } else {
        this.showButton = true;
      }
      this.actionLabel = this.useStore.mode;
      if (this.useStore.mode == "delete") {
        this.colourLabel = "negative";
      } else {
        this.colourLabel = "secondary";
      }
      if (this.useStore.mode != "create") {
        this.isReadonly = true;
      }
      if (this.useStore.formData.imageUrl) {
        this.previewImageUrl = this.useStore.formData.imageUrl;
      } else {
        this.previewImageUrl = null;
      }

      if (this.useStore.formData.subscriptionFormUrl) {
        this.previewSignatureUrl = this.useStore.formData.subscriptionFormUrl;
      } else {
        this.previewSignatureUrl = null;
      }

      if (this.useStore.formData.videoUrl) {
        this.previewVideoUrl = this.useStore.formData.videoUrl;
      } else {
        this.previewVideoUrl = null;
      }

      if (this.useStore.formData.subscribedProduct.amount) {
        this.balanceAmount =
          parseFloat(this.useStore.formData.subscribedProduct.amount) *
            parseFloat(this.useStore.formData.quantity) -
          parseFloat(this.useStore.formData.totalAmount);
        this.useStore.formData.amount = this.balanceAmount;
        this.formatAmount();
      }
      if (
        this.useStore.formData.subscriptionDate &&
        this.$refs.subscriptionDateRef
      ) {
        this.$refs.subscriptionDateRef.onChangeDate(
          this.useStore.formData.subscriptionDate
        );
      }
      if (
        this.useStore.formData.subscriber.dateOfBirth &&
        this.$refs.subscriberDateOfBirthRef
      ) {
        this.$refs.subscriberDateOfBirthRef.onChangeDate(
          this.useStore.formData.subscriber.dateOfBirth
        );
      }
    },
    loadSaleStatus() {
      axios
        .get(path.SALESSTATUS_SEARCH)
        .then((response) => {
          console.log(">>>>>sales status response>>>>>>>", response.data.data);
          this.salesStatusList = response.data.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
        })
        .catch((error) => {
          console.error("Error fetching options:", error);
        });
    },

    loadMaritalStatus() {
      axios
        .get(path.MARITALSTATUS_SEARCH)
        .then((response) => {
          console.log(">>>>>sales status response>>>>>>>", response.data.data);
          this.maritalStatusList = response.data.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
        })
        .catch((error) => {
          console.error("Error fetching options:", error);
        });
    },
    loadOccupation() {
      axios
        .get(path.OCCUPATION_SEARCH)
        .then((response) => {
          console.log(
            ">>>>>sales occupationList response>>>>>>>",
            response.data.data
          );
          this.occupationList = response.data.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
        })
        .catch((error) => {
          console.error("Error fetching options:", error);
        });
    },

    loadrelationShipTypes() {
      axios
        .get(path.RELATIONSHIPTYPE_SEARCH)
        .then((response) => {
          console.log(
            ">>>>>sales occupationList response>>>>>>>",
            response.data.data
          );
          this.relationshipList = response.data.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
        })
        .catch((error) => {
          console.error("Error fetching options:", error);
        });
    },

    calcuateProductAmount(value) {
      const productAmount = this.useStore.formData.subscribedProduct.amount;
      try {
        let cleanAmount = parseFloat(productAmount);
        let caluclatedAmount = cleanAmount * value;
        this.useStore.formData.amount = caluclatedAmount;
        this.formatAmount();
      } catch (e) {
        console.log("Error >>>>>", e);
      }
    },
    checkBalance() {
      let cleanAmount = this.useStore.formData.amount;
      try {
        cleanAmount = cleanAmount.replace(/,/g, "");
      } catch (e) {
        console.log("Error >>>>>", e);
      }
      if (parseFloat(cleanAmount) > this.balanceAmount) {
        this.useStore.formData.amount = this.balanceAmount;
      }
      this.formatAmount();
    },

    setSubscriberValues(record) {
      this.subscriberReadOnly = true;
      this.nextOfKinReadOnly = true;
      this.useStore.formData.subscriber.maritalStatus = {
        label: record.maritalStatus.name,
        value: record.maritalStatus.code,
      };

      this.useStore.formData.subscriber.country = {
        label: record.country.name,
        value: record.country.code,
      };
      this.useStore.formData.subscriber.state = {
        label: record.state.name,
        value: record.state.code,
      };
      this.useStore.formData.subscriber.county = {
        label: record.county.name,
        value: record.county.code,
      };
      this.useStore.formData.subscriber.gender = {
        label: record.gender.name,
        value: record.gender.code,
      };
      this.useStore.formData.subscriber.occupation = {
        label: record.occupation.name,
        value: record.occupation.code,
      };
      this.useStore.formData.subscriber.relationShipType = {
        label: record.relationshipType.name,
        value: record.relationshipType.code,
      };

      this.useStore.formData.subscriber.dateOfBirth = record.dateOfBirth;
      this.useStore.formData.subscriber.imageUrl = record.imageUrl;
      this.useStore.formData.subscriber.signature = record.signature;
      this.previewImageUrl = "data:image/jpeg;base64," + record.imageUrl;
      this.subscriberImageBase64 = "data:image/jpeg;base64," + record.imageUrl;
      this.previewSignatureUrl = "data:image/jpeg;base64," + record.signature;

      this.subscriberSignatureBase64 =
        "data:image/jpeg;base64," + record.signature;

      if (this.$refs.subscriberDateOfBirthRef)
        this.$refs.subscriberDateOfBirthRef.onChangeDate(record.dateOfBirth);
      this.useStore.formData.subscriber.nextOfKin.maritalStatus = {
        label: record.nextOfKin.maritalStatus.name,
        value: record.nextOfKin.maritalStatus.code,
      };

      this.useStore.formData.subscriber.nextOfKin.id = record.nextOfKin.id;
      this.useStore.formData.subscriber.nextOfKin.country = {
        label: record.nextOfKin.country.name,
        value: record.nextOfKin.country.code,
      };
      this.useStore.formData.subscriber.nextOfKin.state = {
        label: record.nextOfKin.state.name,
        value: record.nextOfKin.state.code,
      };
      this.useStore.formData.subscriber.nextOfKin.county = {
        label: record.nextOfKin.county.name,
        value: record.nextOfKin.county.code,
      };
      this.useStore.formData.subscriber.nextOfKin.gender = {
        label: record.nextOfKin.gender.name,
        value: record.nextOfKin.gender.code,
      };
      this.useStore.formData.subscriber.nextOfKin.occupation = {
        label: record.nextOfKin.occupation.name,
        value: record.nextOfKin.occupation.code,
      };
      this.useStore.formData.subscriber.nextOfKin.dateOfBirth =
        record.nextOfKin.dateOfBirth;

      if (this.$refs.nextofKinDateOfBirthRef)
        this.$refs.nextofKinDateOfBirthRef.onChangeDate(
          record.nextOFKin.dateOfBirth
        );

      this.useStore.formData.subscriber.nextOfKin.imageUrl =
        record.nextOfKin.imageUrl;
      this.previewNextOfKinImageUrl =
        "data:image/jpeg;base64," + record.nextOfKin.imageUrl;
      this.nextOfKinImgageBase64 =
        "data:image/jpeg;base64," + record.nextOfKin.imageUrl;
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
    this.isReadonly = false;
    const requestParams = {
      params: {
        email: this.userEmail,
      },
    };

    axios
      .get(path.COUNTRY_ALL)
      .then((response) => {
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.countries = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
        this.allCountries = this.countries;
        this.nextOfKinCountries = Object.assign({}, this.countries);
        this.allNextOfKinCountries = Object.assign({}, this.countries);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(path.GENDER_SEARCH_ALL)
      .then((response) => {
        this.genderList = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });

    this.loadUserClients();
    this.loadSaleStatus();
    this.loadMaritalStatus();
    this.loadOccupation();
    this.loadrelationShipTypes();
    this.updateData();
  },
  unmounted() {
    console.log("Calling unmounted>>>>>>>>>>");
  },
  updated() {
    console.log(">>>>>>>>updated >>>>>>>>>>>>>>>", this.useStore.formData);
    this.updateData();
    if (
      this.useStore.formData.subscriber.dateOfBirth &&
      this.$refs.subscriberDateOfBirthRef
    ) {
      this.$refs.subscriberDateOfBirthRef.onChangeDate(
        this.useStore.formData.subscriber.dateOfBirth
      );
    }
  },
};
</script>
<style scoped>
.card-flex-display {
  display: flex;
  flex-direction: column;
}
</style>
