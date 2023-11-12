import config from './config.json' assert { type: 'json' };

// https://ggmax.com.br/api/announcements/287052/dispenser/items?offset=0
export async function getItems(token, announcement_id, additionals='offset=0') {
    if (!token.startsWith('Bearer ')) token = 'Bearer ' + token;
    var res = await fetch(`${config.endpoint_announcements}/${announcement_id}/dispenser/items?${additionals}`, {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "content-type": "application/json",
          "authorization": token,
        },
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
      });

    let json = await res.json();
    return json;
}

export async function getItem(token, announcement_id, item_id, additionals='') {
    if (!token.startsWith('Bearer ')) token = 'Bearer ' + token;
    var res = await fetch(`${config.endpoint_announcements}/${announcement_id}/dispenser/items/${item_id}?${additionals}`, {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "content-type": "application/json",
          "authorization": token,
        },
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
      });

    let json = await res.json();
    return json;
}

export async function addItem(token, announcement_id, content, announcement_item_id) {
  if (!token.startsWith('Bearer ')) token = 'Bearer ' + token;
  let body =   [{
    "id": null,
    "announcementModel": typeof announcement_item_id == 'undefined'? "normal" : "dynamic",
    "content": content,
    "status": "available",
    "itemId": typeof announcement_item_id == 'undefined'? null : announcement_item_id
  }]

  var res = await fetch(`${config.endpoint_announcements}/${announcement_id}/dispenser/items`, {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "content-type": "application/json",
      "authorization": token,
    },
    "method": "POST",
    "body": JSON.stringify(body),
    "mode": "cors",
    "credentials": "include"
  });

  let json = await res.json();
  return json;
}

export async function addItems(token, announcement_id, items, announcement_item_id) {
  /*
  Notas sobre o uso responsável desta função: à depender da quantidade de itens enviados, o servidor pode demorar para responder. Favor, parcelar os envios em grupos de 10 itens.
  */
  if (!token.startsWith('Bearer ')) token = 'Bearer ' + token;
  let body = items.map(i=>({
    "id": null,
    "announcementModel": ( typeof announcement_item_id == 'undefined' || announcement_item_id == null )? "normal" : "dynamic",
    "content": i,
    "status": "available",
    "itemId": ( typeof announcement_item_id == 'undefined' || announcement_item_id == null )? null : announcement_item_id
  }));

  var res = await fetch(`${config.endpoint_announcements}/${announcement_id}/dispenser/items`, {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "content-type": "application/json",
      "authorization": token,
    },
    "method": "POST",
    "body": JSON.stringify(body),
    "mode": "cors",
    "credentials": "include"
  });

  let json = await res.json();
  return json;
}

async function changeItemStatus(token, announcement_id, announcement_item, status) {
    if (!token.startsWith('Bearer ')) token = 'Bearer ' + token;
  let body = {
    id: announcement_item.id,
    itemId: announcement_item.announcement_item_id,
    content: announcement_item.content,
    status: status,
    announcementModel: announcement_item.announcement_item_id == null ? "normal" : "dynamic"
  }

  var res = await fetch(`${config.endpoint_announcements}/${announcement_id}/dispenser/items/${announcement_item.id}`, {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "content-type": "application/json",
      "authorization": token,
    },
    "method": "PATCH",
    "body": JSON.stringify(body),
    "mode": "cors",
    "credentials": "include"
  });

  let json = await res.json();
  json.data = body;
  return json;
}

export async function removeItem(token, announcement_id, announcement_item) {
  return await changeItemStatus(token, announcement_id, announcement_item, "removed");
  }

  export async function disableItem(token, announcement_id, announcement_item) {
    return await changeItemStatus(token, announcement_id, announcement_item, "disabled");
  }



