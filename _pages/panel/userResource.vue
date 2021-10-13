<template>
  <div id="userReousrcePage">
    <!--Content-->
    <div id="userReousrcePageContent" class="row q-col-gutter-md">
      <div class="col-12 col-lg-6 offset-lg-3 relative-position ">
        <!--page actions-->
        <div class="box box-auto-height q-mb-md">
          <page-actions :title="$tr($route.meta.title)" @refresh="init" :extra-actions="extraPageActions"/>
        </div>
        <!--Form-->
        <div class="row q-col-gutter-md">
          <!--Schedule user Resource-->
          <div class="col-12">
            <dynamic-form v-model="form.schedule" v-bind="formProps.schedule" class="box"/>
          </div>
          <!--Description user Resource-->
          <div class="col-12">
            <dynamic-form v-model="form.description" v-bind="formProps.description" class="box" @submit="saveResource"/>
          </div>
        </div>
        <!--Inner loading-->
        <inner-loading :visible="loading"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  watch: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      loading: false,
      userResource: false,
      form: {description: {}, schedule: {}}
    }
  },
  computed: {
    //Return user data
    userData() {
      return this.$store.state.quserAuth.userData
    },
    //Extra Page actions
    extraPageActions() {
      return [
        {//action to copy user resource link, new reservation
          label: this.$tr(`ui.label.share`),
          vIf: this.userResource ? true : false,
          props: {
            icon: 'fas fa-share-alt'
          },
          action: () => {
            let baseUrl = this.$store.state.qsiteApp.baseUrl
            let path = this.$router.resolve({
              name: 'qbooking.panel.reservations.create',
              query: {resource: this.userResource.id}
            }).href
            //copy to clipboard
            this.$helper.copyToClipboard(`${baseUrl}/${path}`)
          }
        }
      ]
    },
    //Return user resource form
    formProps() {
      return {
        schedule: {
          title: this.$tr('ui.label.availability'),
          defaultColClass: 'col-12',
          noActions: true,
          blocks: [
            {
              fields: {
                schedule: {
                  value: null,
                  type: 'schedulable',
                  props: {},
                },
              }
            }
          ]
        },
        description: {
          title: this.$tr('qbooking.layout.myResource'),
          defaultColClass: 'col-12',
          blocks: [
            {
              fields: {
                title: {
                  value: this.userData.fullName,
                  type: 'input',
                  isTranslatable: true,
                  props: {
                    label: `${this.$tr('ui.form.title')}*`,
                    rules: [
                      val => !!val || this.$tr('ui.message.fieldRequired')
                    ],
                  },
                },
                slug: {
                  value: this.$helper.getSlug(this.userData.fullName) + '-' + this.$store.state.quserAuth.userId,
                  isTranslatable: true
                },
                status: {
                  value: '1',
                  type: 'select',
                  isTranslatable: false,
                  props: {
                    label: `${this.$tr('ui.form.status')}*`,
                    options: [
                      {label: this.$tr('ui.label.enabled'), value: '1'},
                      {label: this.$tr('ui.label.disabled'), value: '0'}
                    ],
                    rules: [
                      val => !!val || this.$tr('ui.message.fieldRequired')
                    ],
                  }
                },
                services: {
                  value: [],
                  type: 'select',
                  props: {
                    label: `${this.$trp('ui.label.service')}*`,
                    multiple: true,
                    useChips: true,
                    rules: [
                      val => val.length || this.$tr('ui.message.fieldRequired')
                    ],
                  },
                  loadOptions: {
                    apiRoute: 'apiRoutes.qbooking.services',
                    requestParams: !this.$auth.hasAccess('ibooking.services.manage') ? {} : {
                      filter: {createdBy: this.$store.state.quserAuth.userId}
                    }
                  }
                },
                description: {
                  value: `${this.userData.fullName}...`,
                  type: 'html',
                  isTranslatable: true,
                  props: {
                    label: `${this.$tr('ui.form.description')}*`,
                    rules: [
                      val => !!val || this.$tr('ui.message.fieldRequired')
                    ],
                  }
                }
              }
            }
          ]
        }
      }
    }
  },
  methods: {
    init() {
      this.getUserResource()
    },
    //Get user resource
    getUserResource() {
      return new Promise((resolve, reject) => {
        this.loading = true

        //Requets params
        let requestParams = {
          refresh: true,
          params: {
            include: 'services,schedule.workTimes',
            filter: {field: 'created_by', allTranslations: true}
          }
        }

        //Request
        this.$crud.show('apiRoutes.qbooking.resources', this.userData.id, requestParams).then(response => {
          this.userResource = response.data
          this.form.description = this.$clone(response.data)
          this.form.schedule = this.$clone(response.data)
          this.loading = false
        }).catch(error => {
          this.loading = false
        })
      })
    },
    //Save resource
    saveResource() {
      return new Promise((resolve, reject) => {
        this.loading = true
        let formData = {...this.form.schedule, ...this.form.description}
        //Update resource
        if (this.userResource) {
          this.$crud.update('apiRoutes.qbooking.resources', this.userResource.id, formData).then(response => {
            this.loading = false
            this.$alert.info(this.$tr('ui.message.recordUpdated'))
          }).catch(error => {
            console.error('update', error)
            this.loading = false
            this.$alert.error({message: this.$tr('ui.message.recordNoUpdated')})
          })
        }
        //cretae resource
        if (!this.userResource) {
          this.$crud.create('apiRoutes.qbooking.resources', formData).then(response => {
            this.loading = false
            this.$alert.info({message: this.$tr('ui.message.recordUpdated')})
          }).catch(error => {
            console.error('create', error)
            this.loading = false
            this.$alert.error(this.$tr('ui.message.recordNoUpdated'))
          })
        }
      })
    }
  }
}
</script>
<style lang="stylus">
</style>
