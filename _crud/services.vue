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
      //Default filters
      let defaultFilters = (config('app.mode') == 'ipanel') ? {createdBy: this.$store.state.quserAuth.userId} : {}
      //Crud data
      return {
        crudId: this.crudId,
        entityName: config("main.qbooking.entityNames.services"),
        apiRoute: 'apiRoutes.qbooking.services',
        permission: 'ibooking.services',
        extraFormFields: 'ibooking.crud-fields.services',
        create: {
          title: this.$tr('qbooking.layout.newService')
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px'},
            {name: 'title', label: this.$tr('ui.form.title'), field: 'title', align: 'rigth'},
            {
              name: 'category', label: this.$tr('ui.form.category'),
              align: 'left', field: 'category', sortable: true,
              format: val => ((val && val.title) ? val.title : '-')
            },
            {name: 'status', label: this.$tr('ui.form.status'), field: 'status', align: 'left'},
            {
              name: 'shiftTime', label: this.$tr('qsite.layout.shiftTime'), field: 'shiftTime', align: 'left',
              format: val => val ? `${val} ${this.$trp('ui.label.minute')}` : '-'
            },
            {
              name: 'price', label: this.$tr('ui.form.price'), field: 'price', align: 'left',
              format: val => val ? `$${this.$trn(val)}` : 0
            },
            {
              name: 'withMeeting', label: this.$tr('ui.label.meeting'), field: 'withMeeting', align: 'left',
              format: val => val ? this.$tr('ui.label.yes') : this.$tr('ui.label.no')
            },
            {
              name: 'form', label: this.$tr('ui.label.form'), field: 'form',
              align: 'left', format: val => val ? val.title : '-'
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
          requestParams: {include: 'category', filter: {...defaultFilters}}
        },
        update: {
          title: this.$tr('qbooking.layout.updateService'),
          requestParams: {include: 'categories', filter: {...defaultFilters}}
        },
        delete: true,
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
          formId: {
            type: 'crud',
            props: {
              crudType: 'select',
              crudData: import('@imagina/qform/_crud/crudForms'),
              crudProps: {
                label: `${this.$tr('ui.label.form')}`,
                clearable: true
              },
              config: {
                options: {
                  label: 'title', value: 'id'
                }
              },
            },
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
          withMeeting: {
            value: '0',
            type: 'select',
            props: {
              label: `${this.$tr('ui.label.meeting')}`,
              options: [
                {label: this.$tr('ui.label.enabled'), value: '1'},
                {label: this.$tr('ui.label.disabled'), value: '0'}
              ]
            }
          },
          price: {
            value: 0,
            type: 'input',
            props: {
              label: `${this.$tr('ui.form.price')}`,
              type: 'number'
            },
          },
          shiftTime: {
            value: 30,
            type: 'select',
            props: {
              label: this.$tr('qsite.layout.shiftTime'),
              useInput: false,
              options: this.$helper.getShiftTimeOptions({
                hour: this.$tr('ui.label.hour'),
                hours: this.$trp('ui.label.hour'),
                minutes: this.$trp('ui.label.minute'),
                and: this.$tr('ui.label.and'),
              })
            }
          },
          categoryId: {
            value: null,
            type: 'crud',
            props: {
              crudType: 'select',
              crudData: import('@imagina/qbooking/_crud/categories'),
              crudProps: {
                label: `${this.$tr('ui.form.category')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              },
            },
          },
          categories: {
            value: [],
            type: 'crud',
            props: {
              crudType: 'select',
              crudData: import('@imagina/qbooking/_crud/categories'),
              crudProps: {
                label: this.$trp('ui.form.category'),
                multiple: true,
                useChips: true
              },
            },
          },
          mediasSingle: {
            name: 'mediasSingle',
            value: {},
            type: 'media',
            props: {
              label: this.$tr('ui.form.firstImage'),
              zone: 'mainimage',
              entity: "Modules\\Ibooking\\Entities\\Service",
              entityId: null
            }
          }
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
