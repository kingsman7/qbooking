<template></template>
<script>
export default {
  data() {
    return {
      crudId: this.$uid()
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
          requestParams: {include: 'reservation.customer,meetings'},
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
          }
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
}
</script>
