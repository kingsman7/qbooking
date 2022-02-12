<template>
  <master-modal v-model="modal.show" @hide="resetModal()" :loading="modal.loading"
                :title="modal.title" custom-position>
    <div class="box">
      <q-list separator dense>
        <q-item v-for="(item, itemKey) in modal.requestData" :key="itemKey" style="padding: 8px 0">
          <q-item-section>
            <q-item-label v-if="item.fieldType != 'media'">{{ item.label }}</q-item-label>
            <!--File preview-->
            <q-item-label v-if="item.fieldType == 'media'">
              <file-list v-model="item.value" grid-col-class="col-12" hide-header/>
            </q-item-label>
            <!--value-->
            <q-item-label v-else caption>{{ item.value }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </master-modal>
</template>
<script>
export default {
  data() {
    return {
      crudId: this.$uid(),
      modal: {
        title: null,
        show: false,
        loading: false,
        requestData: []
      }
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config("main.qbooking.entityNames.reservation"),
        apiRoute: 'apiRoutes.qbooking.reservationItems',
        permission: 'ibooking.reservations',
        extraFormFields: 'ibooking.crud-fields.reservations',
        create: {
          to: {name: 'qbooking.panel.reservations.create'}
        },
        read: {
          hideHeader: true,
          columns: [
            {name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px'},
            {name: 'resourceTitle', label: this.$tr('ui.label.resource'), field: 'resourceTitle', align: 'left'},
            {
              name: 'service', label: this.$tr('ui.label.service'), align: 'left',
              format: (val, row) => `${row.categoryTitle}, ${row.serviceTitle}`
            },
            {name: 'statusName', label: this.$tr('ui.form.status'), field: 'statusName', align: 'left'},
            {
              name: 'startDate', label: this.$tr('ui.form.startDate'), field: 'startDate', align: 'left',
              format: val => val ? this.$trd(val, {type: 'shortHuman'}) : '-',
            },
            {
              name: 'customer', label: this.$tr('ui.label.customer'), align: 'left',
              format: (val, row) => !row.reservation || !row.reservation.customer ? '-' :
                  `${row.reservation.customer.firstName} ${row.reservation.customer.lastName}`,
            },
            {
              name: 'created_at', label: this.$tr('ui.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {
              name: 'updated_at', label: this.$tr('ui.form.updatedAt'), field: 'updatedAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {name: 'actions', label: this.$tr('ui.form.actions'), align: 'left'},
          ],
          requestParams: {include: 'reservation.customer,meetings,service,fields'},
          grid: {
            component: () => import('@imagina/qbooking/_components/crud/reservationCard'),
          },
          filters: {
            userId: {
              value: null,
              type: 'select',
              props: {
                label: this.$tr('ui.label.user')
              },
              loadOptions: {
                apiRoute: 'apiRoutes.quser.users',
                select: {label: 'fullName', id: 'id'}
              }
            },
          },
          actions: [
            {
              name: 'viewLead',
              icon: 'fas fa-info-circle',
              color: 'info',
              tooltip: this.$tr('ui.label.information'),
              format: (field) => {
                return (field.row.service && field.row.service.form) ? {} : {vIf: false}
              },
              action: (item) => {
                this.showRequestData(item)
              }
            }
          ]
        },
        update: {
          title: this.$tr('qbooking.layout.updateReservation')
        },
        delete: true,
        formLeft: {
          id: {value: ''},
          categoryId: {
            value: null,
            type: 'select',
            props: {
              label: this.$tr('ui.label.category'),
              readonly: true
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qbooking.categories'
            }
          },
          serviceId: {
            value: null,
            type: 'select',
            props: {
              label: this.$tr('ui.label.service'),
              readonly: true
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qbooking.services'
            }
          },
          resourceId: {
            value: null,
            type: 'select',
            props: {
              label: this.$tr('ui.label.resource'),
              readonly: true
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qbooking.resources'
            }
          },
          status: {
            type: 'select',
            isTranslatable: false,
            props: {
              label: `${this.$tr('ui.form.status')}*`,
              options: [
                {label: this.$tr('ui.label.pending'), value: '0'},
                {label: this.$tr('ui.label.approved'), value: '1'},
                {label: this.$tr('ui.label.cancelled'), value: '2'}
              ],
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            }
          },
          startDate: {
            type: 'fullDate',
            props: {
              label: this.$tr('ui.form.startDate')
            }
          }
        }
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
  methods: {
    //Fields to show
    async showRequestData(requestData) {
      //Set modal data
      this.modal = {
        title: requestData.service.title,
        show: true,
        loading: true,
        requestData: [],
      }

      //Get form data
      let form = requestData.service?.form || false

      //Merge values
      if (form) {
        //Get field values
        let requestValues = {}
        requestData.fields.forEach(item => requestValues[item.name] = item.value)
        //get files
        let files = this.$clone(requestData.files || [])
        //Request data
        let requestFormParams = {refresh: true, params: {include: 'fields'}}
        //Get form
        this.$crud.show('apiRoutes.qform.forms', form.id, requestFormParams).then(response => {
          this.$clone(response.data.fields).forEach(field => {
            let fieldType = field.dynamicField?.type || 'input'//get field type
            let fieldValue = requestValues[this.$helper.convertStringToSnakeCase(field.name)] || '-'//get field value
            //Get field file
            let fieldFile = (fieldType != 'media') ? null :
                files.find(item => item.zone == (field.dynamicField.props.zone || 'mainimage'))

            //Add extra data to field
            this.modal.requestData.push({
              ...field,
              label: field.label.replace('*', ''),
              value: (fieldType != 'media') ? fieldValue : [{
                id: this.$uid(),
                ...fieldFile,
                filename: field.label,
              }],
              fieldType: fieldType
            })
          })

          this.modal.loading = false
        }).catch(error => {
          this.modal.loading = false
        })
      }
    },
    //Reset Modal
    resetModal() {
      this.modal = {show: false, request: false}
    }
  }
}
</script>
