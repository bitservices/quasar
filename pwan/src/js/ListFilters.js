
 function  filterAffilates(val, update) {
    console.log('>>>>val>>>>>>',val)
  if (val === '') {
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
};

 function filterCountries(val, update) {
    console.log('>>>>val>>>>>>',val)
  if (val === '') {
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
};
 function filterStates(val, update) {
    console.log('>>>>val>>>>>>',val)
  if (val === '') {
    update(() => {
      this.states = this.allStates;
    });
    return;
  }

  const needle = val.toLowerCase();
  update(() => {
    this.states = this.allStates.filter((option) =>
      option.label.toLowerCase().includes(needle)
    );
  });
};
 function filterCounties(val, update) {
    console.log('>>>>val>>>>>>',val)
  if (val === '') {
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
}

 export default {filterAffilates, filterCountries,filterStates, filterCounties}