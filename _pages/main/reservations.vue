<template>
  <div id="reservationsPage">
    <!--page actions-->
    <div class="box box-auto-height q-mb-md">
      <page-actions :title="$tr($route.meta.title)" @refresh="init" :extra-actions="extraPageActions"
                    @new="$router.push({name : 'qbooking.panel.reservations.create'})"/>
    </div>
    <!--Calendar-->
    <div v-if="view=='calendar'">
      <calendar />
    </div>
    <!--Crud-->
    <crud v-else :crud-data="import('@imagina/qbooking/_crud/reservations')"/>
  </div>
</template>
<script>
//Components
import calendar from '@imagina/qsite/_components/master/calendar'

export default {
  props: {},
  components: {calendar},
  watch: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      loading: false,
      view: 'calendar',
      data: []
    }
  },
  computed: {
    //Extra Page actions
    extraPageActions() {
      return [
        'search',
        'new',
        {//action to turn view type
          label: this.$tr(`ui.label.view`),
          props: {
            icon: this.view == "calendar" ? 'fas fa-grip-horizontal' : 'fas fa-calendar-alt'
          },
          action: () => {
            this.view = (this.view == 'calendar') ? 'crud' : 'calendar'
          }
        }
      ]
    },
  },
  methods: {
    init() {
    },
    //Get data
    getData(refresh = false) {
      return new Promise((resolve, reject) => {
        this.loading = true
        //Requets params
        let requestParams = {
          refresh: refresh
        }
        //Request
        this.$crud.index('apiRoutes', requestParams).then(response => {
          this.data = response.data
          this.loading = false
        }).catch(error => {
          this.loading = false
        })
      })
    }
  }
}
</script>
<style lang="stylus">
</style>
