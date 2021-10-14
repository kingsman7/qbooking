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
          showAs: 'grid',
          allowToggleView: false,
          columns: [
            {name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px'},
            {name: 'title', label: this.$tr('ui.form.title'), field: 'title', align: 'rigth'},
            {name: 'slug', label: this.$tr('ui.form.slug'), field: 'slug', align: 'left'},
            {name: 'status', label: this.$tr('ui.form.status'), field: 'status', align: 'left'},
            {
              name: 'services', label: this.$trp('ui.label.service'), field: 'services',
              align: 'left', classes: 'ellipsis', style: 'max-width : 250px',
              format: val => val ? val.map(item => item.title).join(', ') : ''
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
          }
        },
        update: false,
        delete: false,
        formLeft: {
          id: {value: ''},
          userId: {value: this.$store.state.quserAuth.userId},
          title: {
            value: '',
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
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('ui.form.slug')}*`,
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            }
          },
          description: {
            value: '',
            type: 'html',
            isTranslatable: true,
            props: {
              label: `${this.$tr('ui.form.description')}*`,
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            }
          }
        },
        formRight: {
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
            type: 'crud',
            props: {
              crudType: 'select',
              crudData: import('@imagina/qbooking/_crud/services'),
              crudProps: {
                label: this.$trp('ui.label.service'),
                multiple: true,
                useChips: true
              },
            },
          },
        },
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
}
</script>
