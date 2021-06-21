<template>
  <v-container fluid>
    <div class="text-center text-sm-h4 pa-5">
      Currency API
    </div>
    <div class="pl-10 pr-10" style="display: flex">
      <v-text-field
        v-model="currFrom"
        :rules="[validCurrency]"
        label="Enter currency"
        style="display: inline-block;"
      >
      </v-text-field>
      <v-btn @click="fetchResults" style="display: inline-block; margin-left: 10px">Check</v-btn>
    </div>
      <div class="pa-10">
        <v-data-table :headers="headers" :items="currencies" :loading="loading">
          <template v-slot:item.rate="{ item }">
            <v-chip :color="getColor(item.rate)">
              1 {{ item.fromName.toUpperCase() }} <div class="pl-4 pr-4 mdi mdi-arrow-right-bold-circle-outline"></div> {{item.rate}} {{item.shortName}}
            </v-chip>
          </template>
        </v-data-table>
      </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {Currency} from "@/types/currency";
import {getCurrencyList, init, validateCurrency} from "@/api/api";
import colors from "vuetify/lib/util/colors";

export default Vue.extend({
  name: "Main",
  data: function () {
    return {
      currFrom: "",
      currFromStatic: "",
      currencies: [] as Currency[],
      headers: [{text: "Currency", value: "shortName"},
        {text: "Full Name", value: "fullName"},
        {text: "Date", value: "date"},
        {text: "Rate", value: "rate"}
      ],
      loading: false,
    };
  },
  methods: {
    validCurrency:
      function (value: string): string | boolean {
        return (validateCurrency(value.toLowerCase()) ? true : "Not a valid currency!");
      },
    fetchResults:
      async function () {
        this.currFromStatic = this.currFrom;
        this.loading = true;
        this.currencies = [];
        await getCurrencyList(this.currFrom, "latest", this);
        this.loading = false;
      },
    getColor:
      function (val: number): string {
        if (val > 150) return colors.green.lighten2;
        else if (val < 1) return colors.red.lighten2;
        else return colors.yellow.lighten2;
      }
  },
  async mounted() {
    await init();
  },
});
</script>
