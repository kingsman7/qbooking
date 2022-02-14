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
            <dynamic-form v-model="form.schedule" v-bind="formProps.schedule"/>
          </div>
          <!--Meet-->
          <div class="col-12">
            <div id="meetSection" class="box box-auto-height">
              <dynamic-form v-model="form.meet" v-bind="formProps.meet"/>
              <div class="text-right">
                <q-btn color="grey-3" :label="$tr('ibooking.cms.registerZoom')" unelevated rounded no-caps
                       @click="$helper.openExternalURL('https://zoom.us/signin', true)"
                       text-color="grey-8"/>
              </div>
            </div>
          </div>
          <!--Description user Resource-->
          <div class="col-12">
            <dynamic-form v-if="!loading" v-model="form.description" v-bind="formProps.description"
                          @submit="saveResource"/>
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
      form: {description: {}, meet: {}, schedule: {}}
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
          label: this.$tr(`isite.cms.label.share`),
          vIf: this.userResource ? true : false,
          props: {
            icon: 'fas fa-share-alt'
          },
          action: () => {
            let baseUrl = this.$store.state.qsiteApp.baseUrl
            let path = `ibooking/recursos/${this.userResource.id}`
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
          title: this.$tr('isite.cms.label.availability'),
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
        meet: {
          title: this.$trp('ibooking.cms.meetingPlatform'),
          defaultColClass: 'col-12',
          noActions: true,
          blocks: [
            {
              fields: {
                textInfo: {
                  type: 'banner',
                  props: {
                    textColor: 'white',
                    ...this.meetInfoConfig
                  }
                },
                email: {
                  value: null,
                  type: 'input',
                  fakeFieldName: 'options',
                  help: {description: this.$tr('ibooking.cms.termsZoom')},
                  props: {
                    label: `Zoom | ${this.$tr('isite.cms.form.email')}`,
                    rules: [
                      //val => !!val || this.$tr('isite.cms.message.fieldRequired')
                      val => this.$helper.validateEmail(val) || this.$tr('isite.cms.message.fieldEmail')
                    ],
                  }
                }
              }
            }
          ]
        },
        description: {
          title: this.$tr('ibooking.cms.myResource'),
          defaultColClass: 'col-12',
          blocks: [
            {
              fields: {
                mediasSingle: {
                  name: 'mediasSingle',
                  value: {},
                  type: 'media',
                  fieldItemId: this.userResource.id || null,
                  props: {
                    label: this.$tr('isite.cms.form.firstImage'),
                    zone: 'mainimage',
                    entity: "Modules\\Ibooking\\Entities\\Resource",
                    entityId: this.userResource.id || null
                  }
                },
                title: {
                  value: this.userData.fullName,
                  type: 'input',
                  isTranslatable: true,
                  props: {
                    label: `${this.$tr('isite.cms.form.title')}*`,
                    rules: [
                      val => !!val || this.$tr('isite.cms.message.fieldRequired')
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
                    label: `${this.$tr('isite.cms.form.status')}*`,
                    options: [
                      {label: this.$tr('isite.cms.label.enabled'), value: '1'},
                      {label: this.$tr('isite.cms.label.disabled'), value: '0'}
                    ],
                    rules: [
                      val => !!val || this.$tr('isite.cms.message.fieldRequired')
                    ],
                  }
                },
                services: {
                  value: [],
                  type: 'select',
                  props: {
                    label: `${this.$trp('isite.cms.label.service')}*`,
                    multiple: true,
                    useChips: true,
                    rules: [
                      val => val.length || this.$tr('isite.cms.message.fieldRequired')
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
                  type: 'input',
                  isTranslatable: true,
                  props: {
                    label: `${this.$tr('isite.cms.form.description')}*`,
                    rules: [
                      val => !!val || this.$tr('isite.cms.message.fieldRequired')
                    ],
                    type: 'textarea',
                    rows: "3"
                  }
                }
              }
            }
          ]
        }
      }
    },
    //help banner to meet
    meetInfoConfig() {
      //Instance config key
      let configKey = (!this.userResource || !this.userResource.meetingConfig) ? 0 :
          this.userResource.meetingConfig.providerStatus

      //instance banner config
      let configs = {
        //No added to zoom
        0: {
          color: 'amber',
          icon: 'fas fa-exclamation-triangle',
          message: this.$tr('ibooking.cms.message.meet.notFound')
        },
        //Pending to verified
        1: {
          color: 'info',
          icon: 'fas fa-info-circle',
          message: this.$tr('ibooking.cms.message.meet.pending')
        },
        //Added
        2: {
          color: 'green',
          icon: 'fas fa-check-circle',
          message: this.$tr('ibooking.cms.message.meet.success')
        }
      }

      //Response
      return configs[configKey]
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
            filter: {field: 'created_by', allTranslations: true, withMeetingConfig: 'zoom'}
          }
        }

        //Request
        this.$crud.show('apiRoutes.qbooking.resources', this.userData.id, requestParams).then(response => {
          this.userResource = response.data
          setTimeout(() => {
            this.form.description = this.$clone(response.data)
            this.form.schedule = this.$clone(response.data)
            this.form.meet = this.$clone(response.data)
            this.loading = false
          }, 200)
        }).catch(error => {
          this.loading = false
        })
      })
    },
    //Save resource
    saveResource() {
      return new Promise((resolve, reject) => {
        this.loading = true
        //instance formData
        let formData = {
          ...this.form.schedule, ...this.form.description,
          options: {email: this.form.meet.options.email},
          meetingConfig: {
            providerName: 'zoom',
            email: this.form.meet.options.email
          }
        }

        //Update resource
        if (this.userResource) {
          this.$crud.update('apiRoutes.qbooking.resources', this.userResource.id, formData).then(response => {
            this.$alert.info(this.$tr('isite.cms.message.recordUpdated'))
            this.getUserResource()
          }).catch(error => {
            console.error('update', error)
            this.loading = false
            this.$alert.error({message: this.$tr('isite.cms.message.recordNoUpdated')})
          })
        }
        //cretae resource
        if (!this.userResource) {
          this.$crud.create('apiRoutes.qbooking.resources', formData).then(response => {
            this.$alert.info({message: this.$tr('isite.cms.message.recordUpdated')})
            this.getUserResource()
          }).catch(error => {
            console.error('create', error)
            this.loading = false
            this.$alert.error(this.$tr('isite.cms.message.recordNoUpdated'))
          })
        }
      })
    }
  }
}
</script>
<style lang="stylus">
#userReousrcePage
  #meetSection
    #dynamicFormComponentContent
      box-shadow none
      padding 0
</style>
