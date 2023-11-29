<template>
  <v-card elevation="2" class="mt-1 mx-1">
    <v-card :elevation="0" class="mt-2 mb-3 pa-4 text-center">
      <div class="d-flex align-center justify-center">
        <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="dates"
            persistent
            width="290px"
        >
          <template v-slot:activator="{ on, attrs }">

            <v-text-field
                style="min-width: 300px "
                v-model="dateRangeText"
                label="Выберите период"
                persistent-hint
                hint=""
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
            ></v-text-field>

          </template>
          <v-date-picker
              v-model="dates"
              no-title
              locale="ru"
              range
          >
            <v-spacer></v-spacer>
            <v-btn
                text
                color="primary"
                @click="modal = false"
            >
              Отмена
            </v-btn>
            <v-btn
                text
                color="primary"
                @click="createReport"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>

        <v-autocomplete
            v-model="currentDepartment"
            clearable
            @change="changeDepartment"
            item-text="NAME"
            return-object label="Выберите отдел ответственного"
            v-if="departments.length>1"
            class="ml-5" :items="departments">
        </v-autocomplete>


        <v-autocomplete
            v-model="filterUserCreated"
            item-value="ID"
            clearable
            multiple
            @change="createReport"
            v-if="users.length>1"
            :item-text="(el) =>el.NAME+' '+ el.LAST_NAME"
            label="Кем поставлена"
            class="ml-5" :items="users">

          <template v-slot:selection="data">
            <div class="userItem d-flex flex-row align-center justify-center"><img
                style="width: 24px; margin-left: 8px; margin-right: 8px;  border-radius: 50%;"
                :src=" data.item.PERSONAL_PHOTO ? data.item.PERSONAL_PHOTO: `data:image/svg+xml;charset=US-ASCII,%3Csvg%20viewBox%3D%220%200%2089%2089%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Ctitle%3Euserpic%3C/title%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Ccircle%20fill%3D%22%23535C69%22%20cx%3D%2244.5%22%20cy%3D%2244.5%22%20r%3D%2244.5%22/%3E%3Cpath%20d%3D%22M68.18%2071.062c0-3.217-3.61-16.826-3.61-16.826%200-1.99-2.6-4.26-7.72-5.585-1.734-.483-3.383-1.233-4.887-2.223-.33-.188-.28-1.925-.28-1.925l-1.648-.25c0-.142-.14-2.225-.14-2.225%201.972-.663%201.77-4.574%201.77-4.574%201.252.695%202.068-2.4%202.068-2.4%201.482-4.3-.738-4.04-.738-4.04.388-2.625.388-5.293%200-7.918-.987-8.708-15.847-6.344-14.085-3.5-4.343-.8-3.352%209.082-3.352%209.082l.942%202.56c-1.85%201.2-.564%202.65-.5%204.32.09%202.466%201.6%201.955%201.6%201.955.093%204.07%202.1%204.6%202.1%204.6.377%202.556.142%202.12.142%202.12l-1.786.217c.024.58-.023%201.162-.14%201.732-2.1.936-2.553%201.485-4.64%202.4-4.032%201.767-8.414%204.065-9.193%207.16-.78%203.093-3.095%2015.32-3.095%2015.32H68.18z%22%20fill%3D%22%23FFF%22/%3E%3C/g%3E%3C/svg%3E`"
                alt="">
              <span>  {{
                  data.item.NAME || data.item.LAST_NAME ? (data.item.NAME + ' ' + data.item.LAST_NAME) : data.item.EMAIL
                }}</span>
            </div>

          </template>

          <template v-slot:item="data">
            <template>
              <div class="d-flex flex-row align-center justify-center"><img
                  style="width: 24px; margin-right: 8px;border-radius: 50%;"
                  :src=" data.item.PERSONAL_PHOTO ? data.item.PERSONAL_PHOTO: `data:image/svg+xml;charset=US-ASCII,%3Csvg%20viewBox%3D%220%200%2089%2089%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Ctitle%3Euserpic%3C/title%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Ccircle%20fill%3D%22%23535C69%22%20cx%3D%2244.5%22%20cy%3D%2244.5%22%20r%3D%2244.5%22/%3E%3Cpath%20d%3D%22M68.18%2071.062c0-3.217-3.61-16.826-3.61-16.826%200-1.99-2.6-4.26-7.72-5.585-1.734-.483-3.383-1.233-4.887-2.223-.33-.188-.28-1.925-.28-1.925l-1.648-.25c0-.142-.14-2.225-.14-2.225%201.972-.663%201.77-4.574%201.77-4.574%201.252.695%202.068-2.4%202.068-2.4%201.482-4.3-.738-4.04-.738-4.04.388-2.625.388-5.293%200-7.918-.987-8.708-15.847-6.344-14.085-3.5-4.343-.8-3.352%209.082-3.352%209.082l.942%202.56c-1.85%201.2-.564%202.65-.5%204.32.09%202.466%201.6%201.955%201.6%201.955.093%204.07%202.1%204.6%202.1%204.6.377%202.556.142%202.12.142%202.12l-1.786.217c.024.58-.023%201.162-.14%201.732-2.1.936-2.553%201.485-4.64%202.4-4.032%201.767-8.414%204.065-9.193%207.16-.78%203.093-3.095%2015.32-3.095%2015.32H68.18z%22%20fill%3D%22%23FFF%22/%3E%3C/g%3E%3C/svg%3E`"
                  alt="">
                <span>  {{
                    data.item.NAME || data.item.LAST_NAME ? (data.item.NAME + ' ' + data.item.LAST_NAME) : data.item.EMAIL
                  }}</span>
              </div>
            </template>
          </template>
        </v-autocomplete>


        <v-autocomplete
            v-model="filterUser"
            item-value="ID"
            clearable
            multiple
            @change="createReport"
            v-if="users.length>1"
            :item-text="(el) =>el.NAME+' '+ el.LAST_NAME"
            return-object label="Кому поставлена"
            class="ml-5" :items="users">

          <template v-slot:selection="data">
            <div class="userItem d-flex flex-row align-center justify-center"><img
                style="width: 24px; margin-left: 8px; margin-right: 8px;  border-radius: 50%;"
                :src=" data.item.PERSONAL_PHOTO ? data.item.PERSONAL_PHOTO: `data:image/svg+xml;charset=US-ASCII,%3Csvg%20viewBox%3D%220%200%2089%2089%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Ctitle%3Euserpic%3C/title%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Ccircle%20fill%3D%22%23535C69%22%20cx%3D%2244.5%22%20cy%3D%2244.5%22%20r%3D%2244.5%22/%3E%3Cpath%20d%3D%22M68.18%2071.062c0-3.217-3.61-16.826-3.61-16.826%200-1.99-2.6-4.26-7.72-5.585-1.734-.483-3.383-1.233-4.887-2.223-.33-.188-.28-1.925-.28-1.925l-1.648-.25c0-.142-.14-2.225-.14-2.225%201.972-.663%201.77-4.574%201.77-4.574%201.252.695%202.068-2.4%202.068-2.4%201.482-4.3-.738-4.04-.738-4.04.388-2.625.388-5.293%200-7.918-.987-8.708-15.847-6.344-14.085-3.5-4.343-.8-3.352%209.082-3.352%209.082l.942%202.56c-1.85%201.2-.564%202.65-.5%204.32.09%202.466%201.6%201.955%201.6%201.955.093%204.07%202.1%204.6%202.1%204.6.377%202.556.142%202.12.142%202.12l-1.786.217c.024.58-.023%201.162-.14%201.732-2.1.936-2.553%201.485-4.64%202.4-4.032%201.767-8.414%204.065-9.193%207.16-.78%203.093-3.095%2015.32-3.095%2015.32H68.18z%22%20fill%3D%22%23FFF%22/%3E%3C/g%3E%3C/svg%3E`"
                alt="">
              <span>  {{
                  data.item.NAME || data.item.LAST_NAME ? (data.item.NAME + ' ' + data.item.LAST_NAME) : data.item.EMAIL
                }}</span>
            </div>

          </template>

          <template v-slot:item="data">
            <template>
              <div class="d-flex flex-row align-center justify-center"><img
                  style="width: 24px; margin-right: 8px;border-radius: 50%;"
                  :src=" data.item.PERSONAL_PHOTO ? data.item.PERSONAL_PHOTO: `data:image/svg+xml;charset=US-ASCII,%3Csvg%20viewBox%3D%220%200%2089%2089%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Ctitle%3Euserpic%3C/title%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Ccircle%20fill%3D%22%23535C69%22%20cx%3D%2244.5%22%20cy%3D%2244.5%22%20r%3D%2244.5%22/%3E%3Cpath%20d%3D%22M68.18%2071.062c0-3.217-3.61-16.826-3.61-16.826%200-1.99-2.6-4.26-7.72-5.585-1.734-.483-3.383-1.233-4.887-2.223-.33-.188-.28-1.925-.28-1.925l-1.648-.25c0-.142-.14-2.225-.14-2.225%201.972-.663%201.77-4.574%201.77-4.574%201.252.695%202.068-2.4%202.068-2.4%201.482-4.3-.738-4.04-.738-4.04.388-2.625.388-5.293%200-7.918-.987-8.708-15.847-6.344-14.085-3.5-4.343-.8-3.352%209.082-3.352%209.082l.942%202.56c-1.85%201.2-.564%202.65-.5%204.32.09%202.466%201.6%201.955%201.6%201.955.093%204.07%202.1%204.6%202.1%204.6.377%202.556.142%202.12.142%202.12l-1.786.217c.024.58-.023%201.162-.14%201.732-2.1.936-2.553%201.485-4.64%202.4-4.032%201.767-8.414%204.065-9.193%207.16-.78%203.093-3.095%2015.32-3.095%2015.32H68.18z%22%20fill%3D%22%23FFF%22/%3E%3C/g%3E%3C/svg%3E`"
                  alt="">
                <span>  {{
                    data.item.NAME || data.item.LAST_NAME ? (data.item.NAME + ' ' + data.item.LAST_NAME) : data.item.EMAIL
                  }}</span>
              </div>
            </template>
          </template>
        </v-autocomplete>



          <v-select  @change="createReport" class="ml-5" style="max-width: 288px"  v-model="additionalFilter"   :items="additionalFilterOptions">


          </v-select>
<!--          <v-checkbox-->
<!--              @change="createReport"-->
<!--              class="ml-5"-->
<!--              v-model="isBeforeOpened"-->
<!--              label="Открыта до отчетного периода"-->
<!--          ></v-checkbox>-->


          <v-checkbox
              @change="createReport"
              class="ml-5"
              v-model="isOverdue"
              label="Выполнена не в срок"
          ></v-checkbox>

      </div>

    </v-card>


    <v-data-table
        locale="RU"
        v-if="items"
        :headers="headers"
        :items="items"
        sort-by="name"
        :disable-pagination="true"
        :hide-default-footer="true"
        item-key="name"
        :items-per-page="-1"
        class="table_project mb-4"
    >

      <template v-slot:header="">
        <thead>
        <tr>
          <th class="text-center" colspan="1"></th>
          <th class="text-center" colspan="5"></th>
          <th class="text-center" colspan="2"></th>
        </tr>
        </thead>
      </template>

      <template v-slot:item.debt="{item}">
        <span class="clicknumber" @click="showDetails(item['debt'])">{{ item['debt'].length }}</span>
      </template>
      <template v-slot:item.2="{item}">
        <span class="clicknumber" @click="showDetails(item['2'])"> {{ item['2'].length }}</span>
      </template>
      <template v-slot:item.3="{item}">
        <span class="clicknumber" @click="showDetails(item['3'])">{{ item['3'].length }}</span>
      </template>
      <template v-slot:item.4="{item}">
        <span class="clicknumber" @click="showDetails(item['4'])">{{ item['4'].length }}</span>
      </template>
      <template v-slot:item.5="{item}">
        <span class="clicknumber" @click="showDetails(item['5'])">{{ item['5'].length }}</span>
      </template>
      <template v-slot:item.6="{item}">
        <span class="clicknumber" @click="showDetails(item['6'])">{{ item['6'].length }}</span>
      </template>
      <template v-slot:item.summary="{item}">
        <span class="clicknumber" @click="showDetails(item['summary'])">{{ item['summary'].length }}</span>
      </template>

      <template slot="body.append">
        <tr class="black--text">
          <th style="font-weight: bold" class="subtitle-1 clicknumber">Общий итог</th>
          <th style="font-weight: bold" class="subtitle-1 clicknumber" @click="showDetails(allSummary['2'])">
            {{ allSummary['2'].length }}
          </th>
          <th style="font-weight: bold" class="subtitle-1 clicknumber" @click="showDetails(allSummary['3'])">
            {{ allSummary['3'].length }}
          </th>
          <th style="font-weight: bold" class="subtitle-1 clicknumber" @click="showDetails(allSummary['4'])">
            {{ allSummary['4'].length }}
          </th>
          <th style="font-weight: bold" class="subtitle-1 clicknumber" @click="showDetails(allSummary['5'])">
            {{ allSummary['5'].length }}
          </th>
          <th style="font-weight: bold" class="subtitle-1 clicknumber" @click="showDetails(allSummary['6'])">
            {{ allSummary['6'].length }}
          </th>
          <th style="font-weight: bold" class="subtitle-1 clicknumber" @click="showDetails(allSummary['summary'])">
            {{ allSummary['summary'].length }}
          </th>
          <th style="font-weight: bold" class="subtitle-1 clicknumber" @click="showDetails(allSummary['debt'])">{{
              allSummary['debt'].length
            }}
          </th>
        </tr>
      </template>


    </v-data-table>

    <v-btn @click="exportToFile" left bottom class="" color="grey" text>
      <v-icon>mdi-table-arrow-right</v-icon>
      Экспорт
    </v-btn>
    <Modal v-if="modalState.show" :state="modalState"></Modal>
  </v-card>
  <!--  <div v-if="groupData"> {{groupData}}-->

</template>

<script>
import Modal from "@/components/Modal";

export default {
  name: "Main",
  components: {Modal},
  data: () => {
    return {
      additionalFilterOptions: [
        {
          text: "Все",
          value: 'allOpened'
        },
        {
          text: "Открыта в отчетном периоде",
          value: 'inDiapazonOpened'
        },
        {
          text: "Открыта до отчетного периода",
          value: 'beforeOpened'
        }
      ],

      additionalFilter: 'inDiapazonOpened',

      isOverdue: false,
      modal: false,
      modalState: {show: false},
      dates: [],

      headers: [
        {
          text: 'Наименование проекта',
          align: 'start',
          divider: true,
          value: 'name',
        },
        {text: 'Ждет выполнения', value: '2'},
        {text: 'Выполняется', value: '3'},
        {text: 'Ожидает контроля', value: '4'},
        {text: 'Завершена', value: '5'},
        {text: 'Отложена', divider: true, value: '6'},
        {text: 'Общий итог', divider: true, value: 'summary'},
        {
          text: 'Долг',
          value: 'debt',

        },


      ],
      items: [],
      allSummary: {
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        summary: [],
        debt: [],
      },
      users: [],
      departments: [],
      currentUsers: undefined,
      currentDepartment: undefined,
      filterUser: undefined,
      filterUserCreated: '',

      window: undefined,

    }
  },
  computed: {
    dateRangeText() {
      if (this.dates.length === 1) {
        return "Отчёт за " + this.formatDate(this.dates[0]);
      } else {
        if (this.dates[0] < this.dates[1])
          return "Период с " + this.formatDate(this.dates[0]) + " по " + this.formatDate(this.dates[1]);
        else return "Период с " + this.formatDate(this.dates[1]) + " по " + this.formatDate(this.dates[0]);
      }
    }
  },
  filters: {
    secondsToHoursAndMinutes(seconds) {
      seconds = Number(seconds);
      var h = Math.floor(seconds / 3600);
      var m = Math.floor(seconds % 3600 / 60);

      var hDisplay = h > 0 ? h + 'ч. ' : "";
      var mDisplay = m > 0 ? m + "мин. " : "";
      if (!h && !m) {
        return 0
      }
      return hDisplay + mDisplay;

    }
  },
  methods: {
    showDetails(items) {
      this.modalState.items = items;
      this.modalState.show = true;

    },


    async findChildDepartments(id) {
      if (!id) return [];
      else {
        let res = await this.callMethod(
            'department.get', {"PARENT": id}
        )
        let inner = [];
        for (const key of res) {
          inner = inner.concat(await this.findChildDepartments(key.ID));
        }
        return res.concat(inner)
      }
    },


    async setValidUsers() {

      let users = [];
      let departments = [];

      if (window.isSuper) {

        users = await this.callMethod(
            'user.get', {
              FILTER: {},
              ADMIN_MODE: true
            }
        );

        departments = await this.callMethod(
            'department.get', {}
        )
      } else {

        departments = await this.callMethod(
            'department.get', {"UF_HEAD": window.USER.ID}
        )

        for (const department of departments) {
          departments = departments.concat(await this.findChildDepartments(department.ID));
        }

        users = await this.callMethod('user.get', {
              FILTER: {
                // ACTIVE: true,
                UF_DEPARTMENT: departments.map((dep) => dep.ID)
              }
            }
        )
        users.push(window.USER);

      }

      this.users = users
      this.departments = departments;
    },


    formatDate(arg) {
      let date = new Date(arg);
      let dd = date.getDate();
      if (dd < 10) dd = '0' + dd;
      let mm = date.getMonth() + 1;
      if (mm < 10) mm = '0' + mm;
      let yy = date.getFullYear() % 100;
      if (yy < 10) yy = '0' + yy;
      return dd + '.' + mm + '.' + yy;
    },


    async fetchGroups() {
      let groups = [];

      let startDate;
      let finishDate;
      if (this.dates.length === 1) {
        startDate = new Date(this.dates[0]);
        finishDate = new Date(this.dates[0]);
      } else {
        if (new Date(this.dates[0]) > new Date(this.dates[1])) {
          startDate = new Date(this.dates[1]);
          finishDate = new Date(this.dates[0]);
        } else {
          startDate = new Date(this.dates[0]);
          finishDate = new Date(this.dates[1]);
        }
      }
      startDate.setHours(0, 0, 0);
      finishDate.setHours(23, 59, 59);

      let filter = {
        // '>=DATE_CREATE': startDate.toISOString(),
        // '<=DATE_CREATE': finishDate.toISOString(),
        'CHECK_PERMISSIONS': 'N',
        'PROJECT': 'Y',
      }

      await this.callMethod(
          'sonet_group.get',
          {
            FILTER: filter,
          }).then(function (res) {
        groups = res;
      });
      return groups;
    },


    formatDateFilter(dates) {
      let startDate;
      let finishDate;
      if (dates.length === 1) {
        startDate = new Date(dates[0]);
        finishDate = new Date(dates[0]);
      } else {
        if (new Date(dates[0]) > new Date(dates[1])) {
          startDate = new Date(dates[1]);
          finishDate = new Date(dates[0]);
        } else {
          startDate = new Date(dates[0]);
          finishDate = new Date(dates[1]);
        }
      }
      startDate.setHours(0, 0, 0);
      finishDate.setHours(23, 59, 59);
      return [startDate, finishDate];
    },

    async fetchTasks(filter) {

      let tasks = [];
      await this.callMethod(
          'tasks.task.list',
          {
            filter: {
              ...filter,
              'CREATED_BY': this.filterUserCreated,
              'RESPONSIBLE_ID': this.filterUser ? this.filterUser.map(el => el.ID) : this.currentUsers.map(el => el.ID),
              '!RESPONSIBLE_ID' : this.filterUserCreated
            },
            select: [
              'ID',
              'TITLE',
              'STATUS',
              'GROUP_ID',
              'CREATED_BY',
              'CREATED_DATE',
              'RESPONSIBLE_ID',
              'ACCOMPLICES',
              'AUDITORS',
              'CHANGED_BY',
              'CHANGED_DATE',
              'CLOSED_DATE',
              'ACTIVITY_DATE',
              'DATE_START',
              'DEADLINE',
              // '*',
            ]
          }).then(function (res) {
        res.forEach(el => {
          tasks = el['tasks'] ? tasks.concat(el['tasks']) : tasks.concat(el)
        });
      });

      await this.callMethod(
          'tasks.task.list',
          {
            filter: {
              ...filter,
              'CREATED_BY': this.filterUserCreated,
              ACCOMPLICE: this.filterUser ? this.filterUser.map(el => el.ID) : this.currentUsers.map(el => el.ID)
            },
            select: [
              'ID',
              'TITLE',
              'STATUS',
              'GROUP_ID',
              'CREATED_BY',
              'CREATED_DATE',
              'RESPONSIBLE_ID',
              'ACCOMPLICES',
              'AUDITORS',
              'CHANGED_BY',
              'CHANGED_DATE',
              'CLOSED_DATE',
              'ACTIVITY_DATE',
              'DATE_START',
              'DEADLINE',
              // '*',
            ]
          }).then(function (res) {
        res.forEach(el => {
          tasks = el['tasks'] ? tasks.concat(el['tasks']) : tasks.concat(el)
        });
      });


      // if (this.currentUser && this.currentUser.ID) {
      //   tasks = tasks.filter(el => el.responsibleId === this.currentUser.ID || el.accomplices.find(l => l === this.currentUser.ID))
      // }

      tasks = tasks.filter(el=> el.createdBy!==el.responsibleId)
      return tasks;
    },

    changeDepartment() {
      if (this.currentDepartment) {
        this.currentUsers = this.users.filter((el) => el.UF_DEPARTMENT.find(dp => dp == this.currentDepartment.ID))
      } else {
        this.currentUsers = this.users;
      }


      this.createReport();
    },

    async createReport() {


      this.items = []
      this.allSummary = {
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        summary: [],
        debt: [],

      }
      this.$refs?.dialog?.save(this.dates)
      let formatDateFilter = this.formatDateFilter(this.dates)

      let tasks = []


      if (this.additionalFilter === 'beforeOpened') {

        let filterCreatedTasks = {
          '<CREATED_DATE': formatDateFilter[0],
          "!REAL_STATUS": 5
        };
        tasks = tasks.concat(await this.fetchTasks(filterCreatedTasks))

      }

      else if (this.additionalFilter === 'inDiapazonOpened') {
        let filterCreatedTasks = {
          '>CREATED_DATE': formatDateFilter[0],
          '<CREATED_DATE': formatDateFilter[1]
        };
        tasks = tasks.concat(await this.fetchTasks(filterCreatedTasks))
      }
      else  {
        let filterCreatedTasks = {
          "!REAL_STATUS": 5,
          '<CREATED_DATE': formatDateFilter[0],
        };
        tasks = tasks.concat(await this.fetchTasks(filterCreatedTasks))

        filterCreatedTasks = {
          '>CREATED_DATE': formatDateFilter[0],
          '<CREATED_DATE': formatDateFilter[1]
        };
        tasks = tasks.concat(await this.fetchTasks(filterCreatedTasks))

      }


      if (this.isOverdue) {
        let currDate = this.moment();
        tasks = tasks.filter(task => {
          if (!task.deadline) return false;
          let deadline = this.moment(task.deadline);
          if (task.status == '5') {
            let closedDate = this.moment(task.closedDate);
            if (closedDate.isAfter(deadline)) return true;
          } else {
            if (currDate.isAfter(deadline)) return true;
          }
        })

      }


      let data = {};
      let alreadyIterated = [];
      tasks.forEach(task => {
        if (!alreadyIterated.find((elem) => elem === task.id)) {
          alreadyIterated.push(task.id)

          if (!data[task.groupId]) {
            data[task.groupId] = {
              name: task.groupId !== '0' ? task.group?.name : 'Без группы'
            };
            data[task.groupId]['2'] = [];
            data[task.groupId]['3'] = [];
            data[task.groupId]['4'] = [];
            data[task.groupId]['5'] = [];
            data[task.groupId]['6'] = [];
            data[task.groupId]['summary'] = [];
            data[task.groupId]['debt'] = [];
          }


          this.allSummary[task.status].push(task)
          this.allSummary['summary'].push(task)
          data[task.groupId][task.status].push(task);
          data[task.groupId]['summary'].push(task);

          if (task.status != '5') {
            data[task.groupId]['debt'].push(task)
            this.allSummary['debt'].push(task)
          }


        }
      })

      this.items = Object.values(data);
    },

    exportToFile() {
      let exportData = [["Проект", "Ждет выполнения", "Выполняется", "Ожидает контроля", "Завершена", "Отложена", "Общий итог", "Долг"]];

      this.items.forEach(project => {
        exportData.push([project.name, project['2']?.length, project['3']?.length, project['4']?.length, project['5']?.length, project['6']?.length, project.summary?.length, project.debt?.length])
      })
      //


      let tbl = document.createElement('table');
      tbl.style.borderSpacing = '0';
      tbl.style.textAlign = 'center';

      for (let i = 0; i < exportData.length; i++) {
        const tr = tbl.insertRow();
        for (let j = 0; j < exportData[i].length; j++) {


          let text = '';


          text = exportData[i][j];

          const td = tr.insertCell();
          td.appendChild(document.createTextNode(text));

          if (i === 0) {

            td.style.width = '180px';
            td.style.color = '#ff0000';
            td.style.backgroundColor = '#fc0000';
          }


          td.style.border = '1px solid black';


        }
      }


      this.tableToExcel()(tbl, 'test', "file");
    },

    tableToExcel() {
      var uri = 'data:application/vnd.ms-excel;base64,'
          ,
          template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
          , base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)))
          }
          , format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
              return c[p];
            })
          }
          , downloadURI = function (uri, name) {
            var link = document.createElement("a");
            link.download = name;
            link.href = uri;
            link.click();
          }

      return function (table, name, fileName) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
        var resuri = uri + base64(format(template, ctx))
        downloadURI(resuri, fileName);
      }
    },


  },


  async created() {

    this.dates = [this.moment().startOf('month').format('YYYY-MM-DD'), this.moment().endOf('month').format('YYYY-MM-DD')];


    await this.setValidUsers()
    this.currentUsers = this.users;
    this.window = window;
    await this.createReport();


  }
}
</script>

<style scoped>


</style>
<style>

thead span {
  font-size: 14px !important;
}

.collapse thead {
  visibility: collapse !important;
}

.clicknumber {
  cursor: pointer;
}

.clicknumber:hover {
  color: #0043ff;

}

.v-select__selections .userItem:nth-child(n+6) {
  display: none;
}

.v-input--selection-controls {
  margin-top: 0 !important;
}
</style>
