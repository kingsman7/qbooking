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
          <!--Meet-->
          <div class="col-12">
            <div class="box box-auto-height">
              <dynamic-form v-model="form.meet" v-bind="formProps.meet"/>
              <!--Help Caption-->
              <q-banner v-if="meetBannerHelp" rounded dense :class="meetBannerHelp.class">
                <template v-slot:avatar>
                  <q-icon :name="meetBannerHelp.icon" color="white"/>
                </template>
                <div class="text-white">{{ meetBannerHelp.message }}</div>
              </q-banner>
            </div>
          </div>
          <!--Description user Resource-->
          <div class="col-12">
            <dynamic-form v-if="!loading" v-model="form.description" v-bind="formProps.description"
                          class="box" @submit="saveResource"/>
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
          label: this.$tr(`ui.label.share`),
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
        meet: {
          title: this.$trp('ui.label.meet'),
          defaultColClass: 'col-12',
          noActions: true,
          blocks: [
            {
              fields: {
                email: {
                  value: null,
                  type: 'input',
                  fakeFieldName: 'options',
                  props: {
                    label: `Zoom | ${this.$tr('ui.form.email')}`,
                    rules: [
                      //val => !!val || this.$tr('ui.message.fieldRequired')
                      val => this.$helper.validateEmail(val) || this.$tr('ui.message.fieldEmail')
                    ],
                  }
                },
                providerStatusName: {
                  value: null,
                  type: 'input',
                  fakeFieldName: 'meetingConfig',
                  props: {
                    label: `Zoom | ${this.$tr('ui.form.status')}`,
                    readonly: true
                  }
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
                mediasSingle: {
                  name: 'mediasSingle',
                  value: {},
                  type: 'media',
                  fieldItemId: this.userResource.id || null,
                  props: {
                    label: this.$tr('ui.form.firstImage'),
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
                  type: 'input',
                  isTranslatable: true,
                  props: {
                    label: `${this.$tr('ui.form.description')}*`,
                    rules: [
                      val => !!val || this.$tr('ui.message.fieldRequired')
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
    meetBannerHelp() {
      //Validate
      if (!this.userResource || !this.userResource.meetingConfig) return false

      //instance banner config
      let configs = {
        //No added to zoom
        0: {
          class: 'bg-amber',
          icon: 'fas fa-exclamation-triangle',
          message: this.$tr('qbooking.layout.message.meet.notFound')
        },
        //Pending to verified
        1: {
          class: 'bg-info',
          icon: 'fas fa-info-circle',
          message: this.$tr('qbooking.layout.message.meet.pending')
        },
        //Added
        2: {
          class: 'bg-green',
          icon: 'fas fa-check-circle',
          message: this.$tr('qbooking.layout.message.meet.success')
        }
      }

      //Response
      return configs[this.userResource.meetingConfig.providerStatus]
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
          this.form.description = this.$clone(response.data)
          this.form.schedule = this.$clone(response.data)
          this.form.meet = this.$clone(response.data)
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
        //instance formData
        let formData = {
          ...this.form.schedule, ...this.form.description,
          meetingConfig: {
            providerName: 'zoom',
            email: this.form.meet.options.email
          }
        }

        //Update resource
        if (this.userResource) {
          this.$crud.update('apiRoutes.qbooking.resources', this.userResource.id, formData).then(response => {
            this.$alert.info(this.$tr('ui.message.recordUpdated'))
            this.getUserResource()
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
