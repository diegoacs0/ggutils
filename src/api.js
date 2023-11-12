import * as token from './api/token.js'
import * as user from './api/user.js'
import * as dispenser from './api/dispenser.js'




export default class Api {
  constructor() {
    this.token = token.getToken()
  }

    async getToken() {
        return await this.token
    }

    
    async getAnnouncements(additionals) {
        this.token = await this.token
        return user.getAnnouncements(this.token, additionals)
    }

    async getAnnouncement(id, additionals) {
        this.token = await this.token
        return user.getAnnouncement(this.token, id, additionals)
    }

    async getOrders(additionals) {
        this.token = await this.token
        return user.getOrders(this.token, additionals)
    }

    async getOrder(order_id, additionals) {
        this.token = await this.token
        return user.getOrder(this.token, order_id, additionals)
    }


    async makeReview(order_id, review, additionals) {
        this.token = await this.token
        return user.makeReview(this.token, order_id, review, additionals)
    }

    dispenser() {
        return {
            getItems: async (announcement_id, additionals) => {
                this.token = await this.token
                return dispenser.getItems(this.token, announcement_id, additionals)
            },

            getItem: async (announcement_id, item_id, additionals) => {
                this.token = await this.token
                return dispenser.getItem(this.token, announcement_id, item_id, additionals)
            },

            removeItem: async (announcement_id, announcement_item) => {
                this.token = await this.token
                return dispenser.removeItem(this.token, announcement_id, announcement_item)
            },

            disableItem: async (announcement_id, announcement_item) => {
                this.token = await this.token
                return dispenser.disableItem(this.token, announcement_id, announcement_item)
            },

            addItem: async (announcement_id, content, announcement_item_id) => {
                this.token = await this.token
                return dispenser.addItem(this.token, announcement_id, content, announcement_item_id)
            },

            addItems: async (announcement_id, items, announcement_item_id) => {
                this.token = await this.token
                return dispenser.addItems(this.token, announcement_id, items, announcement_item_id)
            },
        }
    }

}

/*
(async () => {
    const teste = new Api()
    let announcements = await teste.getAnnouncements();
    let orders = await teste.getOrders();
    console.log(announcements.data.announcements);
    console.log(orders.data.orders);


    let announcement = await teste.getAnnouncement(announcements.data.announcements[0].id);
    let order = await teste.getOrder(orders.data.orders[5].id);
    let rev = {
        "message": "Mtt Obg!!",
        "review_type": "positive"
    };
    console.log(announcement);
    console.log(order);

    let review = await teste.makeReview(order.data.id, rev);
    console.log(review);

console.log(announcement);
console.log(announcement.data.items)
    const dispenser = teste.dispenser();

    let items = await dispenser.getItems(announcement.data.id);
  console.log(items);

    let item = await dispenser.getItem(announcement.data.id, items.data.items[0].id);
  console.log(item);

  //  let remove = await dispenser.removeItem(announcement.data.id, item.data);
  // console.log(remove);

  // let add = await dispenser.addItem(announcement.data.id, "Teste", announcement.data.items[0].id);
 //  console.log(add);

})();
*/