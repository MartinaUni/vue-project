<template>
  <div>
    <h1 style="text-align:center; background-color:beige; padding:3%; margin-left:5%; margin-right:5%;">VAST challenge 2023-Minichallenge 1</h1>
    <barChart :products="products" />
  </div>
</template>

<script>
import barChart from '@/components/barChartC.vue';
import data from '/static/data/MC1.json';

export default {
  name: 'App',
  components: {
    barChart
  },
};
</script>
