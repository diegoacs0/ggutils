// chalk and prompt sync
import chalk from 'chalk';
import promptSync from 'prompt-sync';

import Api from './api.js';
import * as plugin from './plugins/menu.js'
import fs from 'fs';

const prompt = promptSync();

const title = 'GGUtils v2 By Diego';

const lang = {
    'AnnouncementSelector': 'Selecione um anúncio',
    'AnnouncementS_question': 'Anúncio: ',
    'AnnoncementS_Item_question': 'Item: ',

    'MenuItems': [
        'Adicionar Estoque à partir de um arquivo',
        'Remover Estoque e salvar em um arquivo',
        'Salvar Estoque em um arquivo',

        'Auto Avaliar'
    ],

    'choose_option': 'Escolha uma opção: ',
};

function getTitle(title) {
    if (title.length > process.stdout.columns - 2) {
        // split title
        let titles = [];
        let current = '';
        for (let i = 0; i < title.length; i++) {
            if (current.length >= process.stdout.columns - 2) {
                titles.push(current);
                current = '';
            }
            current += title[i];
        }
        titles.push(current);
        for (title of titles) {
            // center
            let str = ' '.repeat((process.stdout.columns -2 - title.length) / 2) + title;
            // chalk and spaces til end
            titles[titles.indexOf(title)] = chalk.bgBlue(str + ' '.repeat(process.stdout.columns - str.length));
        }
        return titles.join('');
    } else {
        // center
        let str = ' '.repeat((process.stdout.columns - title.length) / 2) + title;
        // chalk and spaces til end
        return chalk.bgBlue(str + ' '.repeat(process.stdout.columns - str.length));
    }
}
// test chalk and prompt
function makeMenu(items, an_title) {
    // center things
    let menu = getTitle(title) + '\n';
    // white line
    menu += chalk.bgBlue(' '.repeat(process.stdout.columns));
    menu += getTitle(an_title);
    for (let i = 0; i < items.length; i++) {
        menu += chalk.bgBlue(` ${i} `) + ' - ' + items[i] + '\n';
    }
    return menu;
}

let frame = 0;
function loadingBar(msg='Carregando ') {
    let frames = ['|', '/', '-', '\\'];
        // center
        let str = msg + frames[frame++ % frames.length];
        // center
        process.stdout.write('\r'+' '.repeat((process.stdout.columns - str.length) / 2) + str + ' '.repeat((process.stdout.columns - str.length) / 2));
}

function clearConsole() {
    console.clear();
}

let data = {
    selectedAnnouncement: null,
    selectedAnnouncementItem: null,
    selectedOrder: null,
}

async function start() {
    clearConsole();
    console.log(getTitle(title));
    const load = setInterval(loadingBar, 100);
    const ggutils = new Api();
    let announcements = await ggutils.getAnnouncements();
    clearInterval(load);
    clearConsole();

    console.log(makeMenu(announcements.data.announcements.map(x => x.title), lang.AnnouncementSelector));
    let announcement = await prompt(lang.AnnouncementS_question);
    announcement = announcements.data.announcements[Number.parseInt(announcement)];
    clearConsole();

    console.log(getTitle(announcement.title));
    const load2 = setInterval(loadingBar, 100);
    announcement = await ggutils.getAnnouncement(announcement.id);
    data.selectedAnnouncement = announcement.data;
    clearInterval(load2);

    if (data.selectedAnnouncement.model == 'dynamic') {

        clearInterval(load);
        clearConsole();
        console.log(makeMenu(data.selectedAnnouncement.items.map(x => x.title), data.selectedAnnouncement.title));
        let announcementItem = await prompt(lang.AnnoncementS_Item_question);
        announcementItem = data.selectedAnnouncement.items[Number.parseInt(announcementItem)];
        data.selectedAnnouncementItem = announcementItem;
        
    } else if (data.selectedAnnouncement.model == 'normal') {

    } else throw new Error('Unknown announcement model: ' + data.selectedAnnouncement.model);
    clearConsole();

    var menuTitle = (data.selectedAnnouncement.title + (data.selectedAnnouncementItem == null ? '' : ' - ' + data.selectedAnnouncementItem.title));
    console.log(makeMenu(lang.MenuItems, menuTitle));
    let option = await prompt(lang.choose_option);
    option = Number.parseInt(option);
    clearConsole();

    console.log(getTitle(title));

    const load3 = setInterval(loadingBar, 100);
    let file;
    if ([0,1,2].includes(option)) {
        file = await prompt('Arquivo: data/');
    }
    let items;
    switch (option) {
        case 0:
            file = fs.readFileSync('data/' + file, 'utf-8');
            let linhasjump = prompt('De quantas linhas em quantas linhas? (ex: 1 <- Uma em uma) ');
            linhasjump = Number.parseInt(linhasjump);
            // fazer um emaranhado de arrays, cada um com linhasjump linhas do arquivo, e se o arquivo tiver menos linhas que o linhasjump, dar erro
            // jumplines with \r\n or \n or \r
            let lines = file.split(/\r\n|\n|\r/);
            
            if (lines.length < linhasjump) throw new Error('Less lines than what it should have');
            let emaranhado = [];
            for (let i = 0; i < lines.length; i+=linhasjump) {
                let emaranhado2 = [];
                for (let j = 0; j < linhasjump; j++) {
                    emaranhado2.push(lines[i+j]);
                }
                emaranhado2 = emaranhado2.join('\n');
                emaranhado.push(emaranhado2);
            }
            // check for empty items and remove 'em
            emaranhado = emaranhado.filter(x => x != '');
            const res = await ggutils.dispenser().addItems(data.selectedAnnouncement.id, emaranhado, data.selectedAnnouncementItem == null ? null : data.selectedAnnouncementItem.id);
            clearInterval(load3);
            process.stdout.write('\r' + ' '.repeat(process.stdout.columns)); // clear loading bar
            if (res.success) {
                console.log(chalk.green('Sucesso!'));
            } else {
                console.log(chalk.red('Erro!'));
                console.log(chalk.red(res));
            }
             break;
        case 1:
            items = [];
            let itemsQuantity = await prompt('Quantidade de itens à partir do mais novo (0 para todos): ');
            itemsQuantity = Number.parseInt(itemsQuantity);

            const dispenser = ggutils.dispenser();
            let itemsRes = await dispenser.getItems(data.selectedAnnouncement.id, 'status=available&'+(data.selectedAnnouncementItem == null ? '' : 'announcement_item_id='+data.selectedAnnouncementItem.id));
            if (!itemsRes.success) throw new Error('Error getting items: ' + itemsRes);
            items = itemsRes.data.items;
            if (itemsQuantity != 0) items = items.slice(0, itemsQuantity);

            let itemsStr = '';
            for (let item of items) {
                let remove = await dispenser.removeItem(data.selectedAnnouncement.id, item);
                if (remove.success) {
                    itemsStr += item.content + '\n';
                } else {
                    process.stdout.write('\r' + ' '.repeat(process.stdout.columns)); // clear loading bar
                    console.log(chalk.red(`Erro ao remover item: ${item.id} | ` + item.content));
                    console.log(remove)
                }
            }

            clearInterval(load3);
            process.stdout.write('\r' + ' '.repeat(process.stdout.columns));
            // if file doesn't exist, create it
            if (!await fs.existsSync('data/'+file)) await fs.writeFileSync('data/' + file, '');
            await fs.appendFileSync('data/' + file, itemsStr);
            console.log(chalk.green('Sucesso!'));
            break;

        case 2:
            items = [];
            let itemsQuantity2 = await prompt('Quantidade de itens à partir do mais novo (0 para todos): ');
            itemsQuantity2 = Number.parseInt(itemsQuantity2);

            const dispenser2 = ggutils.dispenser();
            let itemsRes2 = await dispenser2.getItems(data.selectedAnnouncement.id, 'limit=99999&status=available&'+(data.selectedAnnouncementItem == null ? '' : 'announcement_item_id='+data.selectedAnnouncementItem.id));
            if (!itemsRes2.success) throw new Error('Error getting items: ' + itemsRes2);
            items = itemsRes2.data.items;
            if (itemsQuantity2 != 0) items = items.slice(0, itemsQuantity2);

            let itemsStr2 = '';
            for (let item of items) {
                itemsStr2 += item.content + '\n';
            }

            clearInterval(load3);
            process.stdout.write('\r' + ' '.repeat(process.stdout.columns));
            // if file doesn't exist, create it
            if (!await fs.existsSync('data/'+file)) await fs.writeFileSync('data/' + file, '');
            await fs.appendFileSync('data/' + file, itemsStr2);
            console.log(chalk.green('Sucesso!'));
            break;
        case 3:
            clearInterval(load3);
            process.stdout.write('\r' + ' '.repeat(process.stdout.columns));

            let string = await prompt('Texto da avaliação: ');
            const load4 = setInterval(loadingBar, 100);
            let pendentReviews = await ggutils.getOrders('filter=sales&offset=0&payment_status=approved&only_pending_reviews=true&limit=999999');
            if (!pendentReviews.success) throw new Error('Error getting pendent reviews: ' + pendentReviews);
            pendentReviews = pendentReviews.data.orders;
            let announcementItemID = data.selectedAnnouncementItem == null ? null : data.selectedAnnouncementItem.id;

            for (let review of pendentReviews) {
                let orderAnnouncement = review.order_announcements[0];
                if (orderAnnouncement.announcement_id == data.selectedAnnouncement.id && orderAnnouncement.announcement_item_id == announcementItemID ) {
                    let reviewSend = {
                        "message": string,
                        "review_type": "positive"
                    };
                    try {
                    let reviewRes = await ggutils.makeReview(review.id, reviewSend);
                    if (!reviewRes.success) throw new Error('Error making review: ' + reviewRes);
                    } catch (e) {
                    }
                }
            }

            clearInterval(load4);
            process.stdout.write('\r' + ' '.repeat(process.stdout.columns));
            console.log(chalk.green('Sucesso!'));
            break;
        default:
            throw new Error('Invalid option: ' + option);
    }
}
start()
