<template>
  <div>


    <v-card v-if="isSuper" elevation="2" class="mt-4 mx-1">
      <v-toolbar dense flat>
        <v-toolbar-title>Настройка прав доступа</v-toolbar-title>
      </v-toolbar>
      <div class="d-flex justify-space-between">
        <div :class="$style.column">
          <v-select label="Администраторы" multiple item-text="name" append-icon="" return-object v-model="superUsers" chips
                    deletable-chips :items="superUsers"
                    hint="Администраторы не имеют ограничений при просмотре отчета">

            <template v-slot:item="">


            </template>
          </v-select>

        </div>
        <div :class="$style.column">
          <div :class="$style.buttons" class="mt-7">
            <v-btn color="primary"
                   @click="addUserToSuperUserList"
                   style="margin-right: 30px;"
                   outlined>
              <v-icon>
                mdi-plus
              </v-icon>
              Добавить

            </v-btn>
          </div>
        </div>
      </div>
    </v-card>

  </div>

</template>
<script>
export default {
  name: "Settings",
  data: () => {
    return {
      search: '',
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        name: '',
        hourRate: 0,
      },
      defaultItem: {
        name: '',
        hourRate: 0,
      },
      headers: [
        {
          text: 'Имя',
          align: 'start',
          sortable: true,
          value: 'name',
        },
        {text: 'Стоимость часа', value: 'hourRate'},
        {text: 'Действия', value: 'actions', sortable: false},

      ],
      copyUsers: [],
      users: [],
      settings: {},
      superUsers: [],
      userOptions: {
        showHeaders: true,
        // allUsersLogs: false
      },
    }
  },
  watch: {

    superUsers() {
      this.callMethod('entity.item.update', {
        ENTITY: 'SETTINGS',
        ID: this.settings.SUPERUSERS.ID,
        PROPERTY_VALUES: {
          VALUE: JSON.stringify(this.superUsers)
        }
      })

    }
  },
  computed: {
    isSuper() {
      return window.isSuper
    },

  },
  async created() {
    this.settings = await this.fetchSettings();
    let options = this.settings;

    // eslint-disable-next-line no-undef
    if (!options.SUPERUSERS?.VALUE) this.superUsers = [];
    // eslint-disable-next-line no-undef
    else this.superUsers = options.SUPERUSERS?.VALUE;

    this.superUsers.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    })
  },

  methods: {


    addUserToSuperUserList() {
      // eslint-disable-next-line no-undef
       BX24.selectUser('Выбор поользователя', (newUser) => {
        if (!this.superUsers.find((el) => el.id === newUser.id)) this.superUsers.push({
          name: newUser.name,
          photo: newUser.photo,
          id: newUser.id
        })
      });


    },

  }
}
</script>

<style lang="scss" module>
.column {
  width: 50%;
  margin: 20px;
}

.buttons {
  position: sticky;
  top: 100px;
  margin-left: 20px;
}


@keyframes show{
  0%{
    opacity:0;
  }
  100% {
    opacity:1;
  }
}
</style>
<style>
.v-menu__content.menuable__content__active {
  display: none;
}
</style>