import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from "./router";
import moment from "moment";

import VueMask from 'v-mask'
import './directives/maindirectives';
import {bx24methods} from './utils/methodsBX24'



Vue.prototype.$eventBus = new Vue();
Vue.use(VueMask);
Vue.mixin(bx24methods)
Vue.prototype.moment = moment;
window.$moment = moment;

Vue.config.productionTip = false


start();

async function start() {
    let {default: BX24Init} = await import('./utils/bx24');
    const BX24 = await BX24Init();

    if (BX24) {

        await BX24.init(function () {
            BX24.callMethod('user.current', {}, async function (res) {
                window.USER = res.answer.result;
                await BX24.callMethod('entity.item.get', {
                    ENTITY: 'SETTINGS',
                    SORT: {DATE_ACTIVE_FROM: 'ASC', ID: 'ASC'},
                    FILTER: {}
                }, (resp) => {

                    if ( window.USER.ID == 19 || window.USER.ID == 311 || JSON.parse(resp.answer.result.find((el)=> el.NAME === 'SUPERUSERS').PROPERTY_VALUES.VALUE).find((el) => el.id === window.USER.ID)) {
                        window.isSuper = true;
                    }
                    new Vue({
                        vuetify,
                        router,
                        render: h => h(App),
                    }).$mount('#app');
                })

            })

            BX24.callMethod("entity.get", {}, (respon) => {
                if (!respon.answer.result.length) {
                    BX24.callMethod('entity.add', {
                        'ENTITY': 'SETTINGS',
                        'NAME': 'SETTINGS',
                        'ACCESS': {AU: 'X'}
                    }, () =>
                    {
                        BX24.callMethod("entity.item.property.add", {
                            ENTITY: 'SETTINGS',
                            PROPERTY: 'VALUE',
                            NAME: 'VALUE',
                            TYPE: 'S'
                        }, () =>
                        {
                            BX24.callMethod('entity.item.add', {
                                ENTITY: 'SETTINGS',
                                NAME: 'SUPERUSERS',
                                PROPERTY_VALUES: {
                                    VALUE: JSON.stringify([])
                                },
                            })
                        })
                    })
                }


            })


        });

    } else {
        new Vue({
            router,
            vuetify,
            render: h => h(App),
        }).$mount('#app');
    }
}
