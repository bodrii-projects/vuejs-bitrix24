<template>
  <v-dialog
      v-model="state.show"

  >
    <v-card class="pa-2">

      <v-card-title> Перечень задач</v-card-title>
      <v-card-text>
        <v-data-table
            :item-class="classRow"
            locale="RU"
            v-if="state.items"
            :headers="headers"
            :items="state.items"
            :disable-pagination="true"
            :hide-default-footer="true"
            :items-per-page="-1"
            item-key="id"
            class="table_project"
        >

          <template v-slot:item.id="{item}">
            <a @click="openTask(item.id)" class="userLink"> {{
                item.id
              }}</a>
          </template>
          <template v-slot:item.creator="{item}">
            <a class="userLink" target="_blank" :href="'https://bitrix.ellara.ru'+item.creator.link"> {{
                item.creator.name
              }}</a>
          </template>
          <template v-slot:item.responsible="{item}">
            <a class="userLink" target="_blank" :href="'https://bitrix.ellara.ru'+item.responsible.link"> {{
                item.responsible.name
              }}</a>
          </template>
          <template v-slot:item.accomplicesData="{item}">
            <a :key="acc.id" v-for="acc in item.accomplicesData" class="userLink" target="_blank"
               :href="'https://bitrix.ellara.ru'+acc.link"> {{
                acc.name
              }}</a><br/>

          </template>
          <template v-slot:item.auditorsData="{item}">
            <a :key="aud.id" v-for="aud in item.auditorsData" class="userLink" target="_blank"
               :href="'https://bitrix.ellara.ru'+aud.link"> {{
                aud.name
              }}<br/></a>

          </template>
          <template v-slot:item.deadline="{item}">
            <span>{{ item.deadline | formatDate }}</span>
          </template>
          <template v-slot:item.closedDate="{item}">
            <span>{{ item.closedDate | formatDate }}</span>
          </template>
          <template v-slot:item.createdDate="{item}">
            <span>{{ item.createdDate | formatDate }}</span>
          </template>
          <template v-slot:item.activityDate="{item}">
            <span>{{ item.activityDate | formatDate }}</span>
          </template>


        </v-data-table>
      </v-card-text>


      <v-card-actions>
        <v-btn  absolute top right @click="state.show = false" icon>
          <v-icon> mdi-close</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>


export default {
  name: "Modal",
  props: {

    state: {
      type: Object,
      required: true
    }
  },
  data: () => {
    return {
      headers: [

        {
          text: 'ID',
          align: 'start',

          value: 'id',
        },
        {
          text: 'Наименование',
          align: 'start',
          value: 'title',
        },
        {
          text: 'Крайний срок',
          align: 'start',
          value: 'deadline',
        },
        {
          text: 'Постановщик',
          align: 'start',
          sortable: false,
          value: 'creator',
        },
        {
          text: 'Ответственный',
          align: 'start',
          sortable: false,
          value: 'responsible',
        },
        {
          text: 'Соисполнители',
          align: 'start',
          sortable: false,
          value: 'accomplicesData',
        },
        {
          text: 'Наблюдатели',
          align: 'start',
          sortable: false,
          value: 'auditorsData',
        },
        {
          text: 'Последняя активность',
          align: 'start',
          value: 'activityDate',
        },
        {
          text: 'Дата создания',
          align: 'start',
          value: 'createdDate',
        },
        {
          text: 'Дата закрытия',
          align: 'start',
          value: 'closedDate',
        },

      ],
    }
  },
  async created() {


  },
  filters: {
    formatDate(date) {
      if (!date) return '';

      return window.$moment(date).format('DD/MM/YYYY  HH:mm')
    }
  },
  methods: {
    classRow(item) {
      if (!item.deadline) return  '';
      let deadline = this.moment(item.deadline);
      if (item.status == '5' ) {
       let  closedDate =  this.moment(item.closedDate);
        if (closedDate.isAfter(deadline)) return 'yellowRow';
      }
      else  {
      let currDate =  this.moment();
      if (currDate.isAfter(deadline)) return 'redRow';
      }


    },
    openTask(id) {
      window.open('https://bitrix.ellara.ru/company/personal/user/' + window.USER.ID + '/tasks/task/view/' + id + '/', '_blank');
    },

  }
}
</script>

<style>
.userLink {
  text-decoration-line: none;
}

.yellowRow {
  background-color: #fff70057;
}
.redRow {
  background-color: rgba(255, 0, 77, 0.34);
}
</style>
