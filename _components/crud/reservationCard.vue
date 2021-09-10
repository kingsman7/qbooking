<template>
  <div id="crudCardAppoinments">
    <!--Card content-->
    <div class="box box-auto-height" v-if="row">
      <!--Label-->
      <div class="text-grey-6 text-caption">
        {{ row.categoryTitle }}, {{ row.serviceTitle }}
      </div>
      <!--Resource-->
      <div class="q-mb-xs">{{ row.resourceTitle }}</div>
      <!--Shifts date-->
      <div class="text-blue">
        {{ $trd(row.startDate, {type: 'shortHuman'}) }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    row: {default: false},
    permitAction: {default: false},
    fieldActions: {default: false}
  },
  components: {},
  watch: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      configApp: config('app'),
      loading: false,
      showAllInfo: false,
      showConversation: false
    }
  },
  computed: {
    rowData() {
      console.warn(this.row)
      return this.row
    }
  },
  methods: {
    init() {

    }
  }
}
</script>
<style lang="stylus">
</style>
