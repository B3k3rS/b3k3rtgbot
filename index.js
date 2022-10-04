const TelegramApi = require('node-telegram-bot-api')
const mongoose = require('mongoose')
require('./model/para.model')
require('./model/alert.model')

mongoose.connect(mongo_url)
.then(() => console.log('connected'))
.catch((err) => console.log(err))

const Para = mongoose.model('para_schema')
const AlertM = mongoose.model('alert_schema')


const bot = new TelegramApi(token, {polling: true});

const zvonki =
[
    [08,30,09,50],
    [10,05,11,25],
    [11,55,13,15],
    [13,25,14,45],
    [14,55,16,15],
    [16,45,18,05], // не дай богЁ
    [18,15,19,35], // дожить
    [19,45,21,05], // до этой хуеты
];


bot.setMyCommands([
    {command: '/info', description: 'Выводит инфу о боте'},
    {command: '/tod', description: 'Выводит расписание на сегодня'},
    {command: '/tom', description: 'Выводит расписание на завтра'},
    {command: '/now', description: 'Узнать какая сейчас пара'},
    {command: '/mon', description: 'Расписание на понедельник'},
    {command: '/tue', description: 'Расписание на вторник'},
    {command: '/wed', description: 'Расписание на среду'},
    {command: '/thu', description: 'Расписание на четверг'},
    {command: '/fri', description: 'Расписание на пятницу'},
])

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    try{
        switch(text.split('|')[0]) {
            case '/start':
                bot.sendMessage(chatId,'Ну давай поговорим')
                break;
            case '/info':
                bot.sendMessage(chatId,`Автор бота: @aleksandrnyz\n\nДоступные команды:\n/tod - Выводит расписание пар на сегодня\n/tom - Выводит расписание пар на завтра\n/now - Выводит инфу о паре, которая сейчас идёт\n/mon,/tue и тд. - вывод расписание по интересующему дню`)
                break;
            case '/tod':
                td = new Date()
                getParaByQuery(chatId,{dayofweek:td.getDay()})
                break;
            case '/tom':
                tm = new Date()
                getParaByQuery(chatId,{dayofweek:tm.getDay()+1})
                break;
            case '/now':
                pariNow(chatId)
                break;

            // Дни недели
            case '/mon':
                now_date = new Date();
                date_calc = new Date(now_date.getFullYear(), now_date.getMonth(), now_date.getDate())
                date_start_year = new Date("2022-09-26")

                if (now_date.getDay() <= 1) {
                    getParaByQuery(chatId,{dayofweek:1,numerator: Math.trunc(Math.round((date_calc-date_start_year)/1000/60/60/24+1)/7)%2==0 ? true : false })
                }
                else {
                    getParaByQuery(chatId,{dayofweek:1,numerator: Math.trunc(Math.round((date_calc-date_start_year)/1000/60/60/24+1)/7+1)%2==0 ? true : false })
                }                
                break;
            case '/tue':
                now_date = new Date();
                date_calc = new Date(now_date.getFullYear(), now_date.getMonth(), now_date.getDate())
                date_start_year = new Date("2022-09-26")

                if (now_date.getDay() <= 2) {
                    getParaByQuery(chatId,{dayofweek:2,numerator: Math.trunc(Math.round((date_calc-date_start_year)/1000/60/60/24+1)/7)%2==0 ? true : false })
                }
                else {
                    getParaByQuery(chatId,{dayofweek:2,numerator: Math.trunc(Math.round((date_calc-date_start_year)/1000/60/60/24+1)/7+1)%2==0 ? true : false })
                }    
                break;
            case '/wed':
                now_date = new Date();
                date_calc = new Date(now_date.getFullYear(), now_date.getMonth(), now_date.getDate())
                date_start_year = new Date("2022-09-26")

                if (now_date.getDay() <= 3) {
                    getParaByQuery(chatId,{dayofweek:3,numerator: Math.trunc(Math.round((date_calc-date_start_year)/1000/60/60/24+1)/7)%2==0 ? true : false })
                }
                else {
                    getParaByQuery(chatId,{dayofweek:3,numerator: Math.trunc(Math.round((date_calc-date_start_year)/1000/60/60/24+1)/7+1)%2==0 ? true : false })
                }    
                break;
            case '/thu':
                now_date = new Date();
                date_calc = new Date(now_date.getFullYear(), now_date.getMonth(), now_date.getDate())
                date_start_year = new Date("2022-09-26")

                if (now_date.getDay() <= 4) {
                    getParaByQuery(chatId,{dayofweek:4,numerator: Math.trunc(Math.round((date_calc-date_start_year)/1000/60/60/24+1)/7)%2==0 ? true : false })
                }
                else {
                    getParaByQuery(chatId,{dayofweek:4,numerator: Math.trunc(Math.round((date_calc-date_start_year)/1000/60/60/24+1)/7+1)%2==0 ? true : false })
                }    
                break;
            case '/fri':
                now_date = new Date();
                date_calc = new Date(now_date.getFullYear(), now_date.getMonth(), now_date.getDate())
                date_start_year = new Date("2022-09-26")

                if (now_date.getDay() <= 5) {
                    getParaByQuery(chatId,{dayofweek:5,numerator: Math.trunc(Math.round((date_calc-date_start_year)/1000/60/60/24+1)/7)%2==0 ? true : false })
                }
                else {
                    getParaByQuery(chatId,{dayofweek:5,numerator: Math.trunc(Math.round((date_calc-date_start_year)/1000/60/60/24+1)/7+1)%2==0 ? true : false })
                }    
                break;
            
            // Уведомления
            case '/alerton':
                onAlertChat(chatId)
                break;
            case '/alertoff':
                offAlertChat(chatId)
                break;

            //админ тема
            case '/import':
                if (msg.from.id != '607387456' && msg.from.id != '364295032') {
                    bot.sendMessage(chatId,'Недостаточно прав для использования этой команды')
                }
                else {
                    parse = JSON.parse(text.split('|')[1])
                    if (
                        parse.numerator != null &&
                        parse.dayofweek != null &&
                        parse.counter != null &&
                        parse.title != null &&
                        parse.link != null &&
                        parse.category[0] != null
                    )
                    {
                        paraUpdate(chatId,parse);
                    }
                    else {
                        bot.sendMessage(chatId,"Ошибка импорта!")
                    }
                }                
                break;
            default:
                
                break;
        }
    }
    catch(e){
        
    }
})

 
function getParaByQuery(chatid,query) {
    now_date = new Date();
    date_calc = new Date(now_date.getFullYear(), now_date.getMonth(), now_date.getDate())
    date_start_year = new Date("2022-09-26")


    if (query.counter == null) {
        stroka = ""
        switch (query.dayofweek) {
            case 1:
                stroka+="Понедельник:\n"
                break;
            case 2:
                stroka+="Вторник:\n"
                break;
            case 3:
                stroka+="Среда:\n"
                break;
            case 4:
                stroka+="Четверг:\n"
                break;
            case 5:
                stroka+="Пятница:\n"
                break;
            default:
                stroka+="Выходной, зачилься!"
                break;
        }
        if (query.dayofweek > 5 || query.dayofweek == 0) {
            bot.sendMessage(chatid,stroka)
        }
        else {
            Para.find(query)
            .then(data => {
                data.sort((a, b) => a.counter > b.counter ? 1 : -1)

                data.forEach(pars => {
                    if (query.numerator != null) {
                        if (pars.numerator == query.numerator) {
                            if (pars.title != 'Null') {
                                stroka += `${pars.counter} - [${zvonki[pars.counter-1][0]}:${zvonki[pars.counter-1][1]}-${zvonki[pars.counter-1][2]}:${zvonki[pars.counter-1][3]}] - ${pars.title} - ( ${getCategory(pars.category)}) - ${pars.link}\n`
                            }
                        }
                    }
                    else {
                        if (
                            Math.trunc(Math.round((date_calc-date_start_year)/1000/60/60/24+1)/7)%2==0 &&
                            pars.numerator == true
                        ) {
                            if (pars.title != 'Null') {
                                stroka += `${pars.counter} - [${zvonki[pars.counter-1][0]}:${zvonki[pars.counter-1][1]}-${zvonki[pars.counter-1][2]}:${zvonki[pars.counter-1][3]}] - ${pars.title} - ( ${getCategory(pars.category)}) - ${pars.link}\n`
                            }
                        }
                        else if (
                            Math.trunc(Math.round((date_calc-date_start_year)/1000/60/60/24+1)/7)%2==1 &&
                            pars.numerator == false
                        ){
                            if (pars.title != 'Null') {
                                stroka += `${pars.counter} - [${zvonki[pars.counter-1][0]}:${zvonki[pars.counter-1][1]}-${zvonki[pars.counter-1][2]}:${zvonki[pars.counter-1][3]}] - ${pars.title} - ( ${getCategory(pars.category)}) - ${pars.link}\n`
                            }
                        }
                    }
                })
                if (data[0] == undefined) {
                    stroka = "Ошибка поиска!"                    
                }
                bot.sendMessage(chatid,stroka) 
            })
        }   
    }
    else {
        find_opt = {
            dayofweek: query.dayofweek,
            counter: query.counter,
            numerator: Math.trunc(Math.round((date_calc-date_start_year)/1000/60/60/24+1)/7)%2==0?true:false
        }

        Para.find(find_opt)
        .then(res => {
            if (res[0].title != 'Null') { 
                bot.sendMessage(chatid,`Сейчас идёт пара №${res[0].counter} - [${zvonki[res[0].counter-1][0]}:${zvonki[res[0].counter-1][1]}-${zvonki[res[0].counter-1][2]}:${zvonki[res[0].counter-1][3]}] - ${res[0].title}\nДля -> ( ${getCategory(res[0].category)})\nСсылка -> ${res[0].link}\n`)
            }
            else {
                bot.sendMessage(chatid,'Нет сейчас пары. Зачилься, чумба')
            }
        })
    }
         
}

function paraUpdate(chatid,para) {
    myquery = {
        numerator: para.numerator,
        dayofweek: para.dayofweek,
        counter: para.counter
    }
    
    Para.updateOne(myquery,para,function(err, res) {
        if (err) throw err;
        bot.sendMessage(chatid,"Запись обновлена!")
    })
}

function getCategory(categ) {
    stro = ""
    for (i=0; i < categ.length ;i++) {
        stro += `${categ[i]} `
    }
    return stro;
}

var alert_zvonki = [ 
    [08,25],
    [10,00],
    [11,50],
    [13,20],
    [14,50],
    [16,40], 
    [18,10], 
    [19,40],
]

function pariNow(chatid) {
    now_date = new Date();
    date_calc = new Date(now_date.getFullYear(), now_date.getMonth(), now_date.getDate())
    date_start_year = new Date("2022-09-26")
    week = Math.trunc(Math.round((date_calc-date_start_year)/1000/60/60/24+1)/7)
    console.log(now_date.getHours())
    if (
        now_date.getHours() < alert_zvonki[0][0] || now_date.getHours() == alert_zvonki[0][0] && now_date.getMinutes() < alert_zvonki[0][0]
    ) {
        bot.sendMessage(chatid,"Время видел? Рано для пар")
    }
    else if (
        now_date.getHours() > alert_zvonki[alert_zvonki.length-1][0] || now_date.getHours() == alert_zvonki[alert_zvonki.length-1][0] && now_date.getMinutes() > alert_zvonki[alert_zvonki.length-1][0]
    ) {
        bot.sendMessage(chatid,"Время видел? Поздно для пар")
    }
    else {
        for(i=0;i<alert_zvonki.length;i++) {
            if (
                now_date.getHours() == zvonki[i][0] && now_date.getMinutes() > zvonki[i][1] ||
                now_date.getHours() == zvonki[i][2] && now_date.getMinutes() < zvonki[i][3] 
            ) {
                getParaByQuery(chatid,{dayofweek:now_date.getDay(), counter:i+1})
            }
        }
    }
}

var interval;

function startAlertS() {
    clearInterval(interval)
    interval = setInterval(()=>{
        now_date = new Date();
        date_calc = new Date(now_date.getFullYear(), now_date.getMonth(), now_date.getDate())
        date_start_year = new Date("2022-09-26")
        week = Math.trunc(Math.round((date_calc-date_start_year)/1000/60/60/24+1)/7)

        for (i=0;i<alert_zvonki.length;i++) {
            if (
                now_date.getHours() == alert_zvonki[i][0] && now_date.getMinutes() > alert_zvonki[i][1] && now_date.getMinutes() < alert_zvonki[i][1]+5 
            ) {
                Para.find({dayofweek:now_date.getDay(),counter:i+1,numerator: week%2==0?true:false})
                .then (para_data => {
                    info_about_para = para_data[0]                    
                    if (info_about_para.title != 'Null') {
                        AlertM.find()
                        .then(alert_data => {
                            alert_data.forEach(alerts => {
                                if (alerts.alert_status == true) {
                                    bot.sendMessage(alerts.chat_id, `Скоро начнётся пара №${info_about_para.counter} - [${zvonki[info_about_para.counter-1][0]}:${zvonki[info_about_para.counter-1][1]}-${zvonki[info_about_para.counter-1][2]}:${zvonki[info_about_para.counter-1][3]}] - ${info_about_para.title}\nДля -> ( ${getCategory(info_about_para.category)})\nСсылка -> ${info_about_para.link}\n`)
                                }
                            })
                        })
                    }
                })
            }
        }
    },300000)
}

startAlertS();

function onAlertChat(chatid) {
    AlertM.find({chat_id: chatid})
    .then(data => {
        if (data[0] == null) {
            AlertM({chat_id:chatid,alert_status:true}).save()
            bot.sendMessage(chatid,"Чат добавлен в базу данных, уведомления включены!")
        }
        else {
            AlertM.updateOne(data,{chat_id:chatid,alert_status:true},function(err, res) {
                if (err) throw err;
                bot.sendMessage(chatid,"Информация обновлена!")
            })  
        } 
    })
}

function offAlertChat(chatid) {
    AlertM.find({chat_id: chatid})
    .then(data => {
        if (data[0] == null) {
            bot.sendMessage(chatid,"Что ты собрался отключать? В этом чате выключены обновления")
        }
        else {
            AlertM.updateOne(data,{chat_id:chatid,alert_status:false},function(err, res) {
                if (err) throw err;
                bot.sendMessage(chatid,"Информация обновлена!")
            })
        }
    })
}
