import axios from "axios";
import path from "src/router/urlpath";
import { SessionStorage } from "quasar";

const headers = SessionStorage.getItem("headers");

async function handleCountryChange(selectedItem) {
  const requestParams = {
    params: {
      countryCode: selectedItem.value,
    },
  };
  await axios
    .get(path.STATE_SEARCH, requestParams, headers)
    .then((response) => {
      // Assuming the response data is an array of objects with 'value' and 'label' properties
      console.log(response.data.data);
      const stateList = response.data.data.map((option) => ({
        label: option.name,
        value: option.code,
      }));
      const allStates = this.stateList;
      return { stateList, allStates };
    })
    .catch((error) => {
      error.message;
    });
}

export default {
  handleCountryChange,
};
