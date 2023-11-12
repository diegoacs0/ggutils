import config from './config.json' assert { type: 'json' };

export async function getAnnouncements(token, additionals = 'offset=0&announcement_status=active,pending,reproved,disabled,suspended') {
    if (!token.startsWith('Bearer ')) token = 'Bearer ' + token;
    /*
    "data": {
        "announcements": [
            {
                "id": 287052,
                "category_id": 249,
                "user_id": 284422,
                "announcement_dispenser_id": 23814,
                "account_reputation_id": null,
                "title": "PROMO\u00c7\u00c3O \u2705 15x contas Hotmail - Microsoft Outlook Email (1 m\u00eas ~ 2 anos) \u26a1\ud83e\udd16",
                "slug": "promocao-15x-contas-hotmail-microsoft-outlook-email-1-mes-2-anos",
                "is_vip": 0,
                "has_auto_delivery": 1,
                "model": "normal",
                "type": "diamond",
                "max_plan": 1,
                "description": "\u26a1\ud83e\udd16 Entrega autom\u00e1tica ap\u00f3s o pagamento.\n\n\ud83d\udc68\ud83c\udffb\u200d\ud83d\udcbb SUPORTE: Caso venha alguma conta ruim fazemos a troca IMEDIATA do email.\n\n\ud83d\ude4b\ud83c\udffb\u200d\u2642 OBS: Ap\u00f3s a compra voc\u00ea recebera 15 unidades de e-mail Microsoft. Alguns deles podem j\u00e1 ter e-mails recebidos na caixa de entrada devido \u00e0 este ser um e-mail normal.\n\n\ud83d\udcf1 ( N\u00e3o precisa por SMS pra entrar: Garantia de troca ou devolu\u00e7\u00e3o )\n\n\u2705 Conta N\u00e3o \u00e9 Hackeada.\n\u2705 N\u00e3o verificado por SMS, nem e-mail de recupera\u00e7\u00e3o ou 2 fatores.\n\u2705 Correio do formul\u00e1rio mail@hotmail.com.\n\u2705 Nomes e sobrenomes estrangeiros (exemplo: Evelyn Grace)\n\u2705 O g\u00eanero \u00e9 masculino ou feminino.\n\u2705 Idade 1 m\u00eas at\u00e9 2 anos.\n\u2705 IP: MIX\n\n\ud83d\udd27 Formato da entrega:\n      e-mail:senha\n\n\n-------------------------\nDou total suporte e geralmente respondo em menos de meia hora.",
                "auto_message_on_sell": null,
                "unit_price": "2.00",
                "sale_count": 476,
                "item_sale_count": 3074,
                "stock_quantity": 523,
                "date_created": "2023-09-18 21:38:45",
                "date_updated": "2023-11-11 21:07:50",
                "status": "active",
                "announcement_type_id": 11,
                "verified_authorship": 0,
                "images": [
                    {
                        "id": 1429598,
                        "announcement_id": 287052,
                        "is_cover": 1,
                        "name": "eb20a8d8b08bb08ef5de4f22ed354710.jpg",
                        "has_webp": 1,
                        "date_updated": "2023-11-02 13:01:31",
                        "date_created": "2023-09-18 22:01:39"
                    }
                ],
                "click_count": 1254,
                "reproved_reason": null
            }, ...
        ],
        "total": 1,
    */
    var res = await fetch(`${config.endpoint_user}/announcements?${additionals}`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "authorization": `${token}`,
            "content-type": "application/json",
        },
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });

    let json = await res.json();
    return json;
}


export async function getOrders(token, additionals = 'filter=sales') {
    /*
    {
    "success": true,
    "data": {
        "orders": [
            {
                "id": "30nq42",
                "user_id": 284422,
                "subtotal": "7.00",
                "is_delivered": 0,
                "is_recharge": 0,
                "description": "",
                "date_received": null,
                "is_received": 0,
                "date_delivered": null,
                "date_created": "2023-11-08 18:07:08",
                "date_updated": "2023-11-08 18:07:08",
                "status": "pending",
                "refunded_by_seller": 0,
                "refunded_at": null,
                "refund_reason": null,
                "order_announcements": [
                    {
                        "id": 1698049,
                        "announcement_id": 323627,
                        "announcement_item_id": null,
                        "order_id": 1830501,
                        "title": "DESCARGA DE PLASMA 144 x10",
                        "item_title": null,
                        "quantity": 1,
                        "unit_price": "7.00",
                        "type_amount": "0.91",
                        "description": "10 DESCARGA DE PLASMA 144\nEntrega gravada na sua base\n\n\n---------- CARACTER\u00cdSTICAS ---------- \n\nTipo de an\u00fancio: Item\n\n",
                        "auto_message_on_sell": null,
                        "is_auto_message_sent": 0,
                        "max_plan": 0,
                        "max_plan_amount": "0.00",
                        "max_plan_pct": 0,
                        "type_pct": 12.99,
                        "date_created": "2023-11-08 18:07:08",
                        "date_updated": "2023-11-08 18:07:08",
                        "status": "pending",
                        "announcement": {
                            "id": 323627,
                            "category_id": 214,
                            "user_id": 66158,
                            "announcement_dispenser_id": null,
                            "account_reputation_id": null,
                            "title": "DESCARGA DE PLASMA 144 x10",
                            "slug": "descarga-de-plasma-144-x10",
                            "is_header_highlighted": 0,
                            "is_vip": 0,
                            "is_fixed_type_pct": 0,
                            "has_auto_delivery": 0,
                            "model": "normal",
                            "type": "diamond",
                            "type_pct": "12.99",
                            "max_plan": 0,
                            "max_plan_pct": "0.00",
                            "click_count": 0,
                            "description": "10 DESCARGA DE PLASMA 144\nEntrega gravada na sua base",
                            "auto_message_on_sell": null,
                            "unit_price": "7.00",
                            "sale_count": 0,
                            "item_sale_count": 0,
                            "stock_quantity": 3,
                            "reproved_reason": null,
                            "is_adult": 0,
                            "date_created": "2023-11-08 17:57:07",
                            "date_updated": "2023-11-08 17:59:12",
                            "status": "active",
                            "announcement_type_id": 3,
                            "verified_authorship": 0,
                            "times_reproved_in_sequence": null,
                            "user": {
                                "id": 66158,
                                "avatar": "63c45f09fdd2a4103af8e2ef65f97509.jpg",
                                "has_webp": 1,
                                "identification": "60a32360cdb09",
                                "username": "LeeoMNGsz",
                                "signature": null,
                                "type": "client",
                                "theme": "default",
                                "is_vip": 0,
                                "date_last_access": "2023-11-11 20:40:19",
                                "date_created": "2021-05-17 23:16:00",
                                "date_updated": "2023-11-11 20:40:19",
                                "status": "active",
                                "ban_reason": null
                            }
                        }
                    }
                ],
                "order_payments": [],
                "order_problems": []
            }, ...
        ],
        "total": 1,
        "filters": []
    */

    if (!token.startsWith('Bearer ')) token = 'Bearer ' + token;
    var res = await fetch(`${config.endpoint_user}/v2/orders?${additionals}`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "authorization": `${token}`,
            "content-type": "application/json",
        },
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });

    let json = await res.json();
    return json;
}


export async function getAnnouncement(token, id, additionals) {
    /*
 Testa aí kkj
  */
    if (!token.startsWith('Bearer ')) token = 'Bearer ' + token;
    if (typeof additionals === 'undefined') additionals = '';
    var res = await fetch(`${config.endpoint_announcements}/${id}?${additionals}`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "authorization": `${token}`,
            "content-type": "application/json",
        },
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });
    let json = await res.json();
    return json;
}

export async function getOrder(token, id, additionals) {
    if (!token.startsWith('Bearer ')) token = 'Bearer ' + token;
    if (typeof additionals === 'undefined') additionals = '';
    var res = await fetch(`${config.endpoint_orders}/${id}`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "authorization": `${token}`,
            "content-type": "application/json",
        },
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });

    let json = await res.json();
    json.makeReview = async (review, additionals) => {
        return await makeReview(token, id, review, additionals);
    }
    return json;
}
export async function makeReview(token, id, review, additionals) {
    /*
    {
        "message": "Mtt Obg!!",
        "review_type": "positive"
    }
    https://ggmax.com.br/api/orders/bnz4wk/user-review
    
    {"message":"Mtt Obg!!","review_type":"positive"}
    */


    if (!token.startsWith('Bearer ')) token = 'Bearer ' + token;
    if (typeof additionals === 'undefined') additionals = '';
    
    var res = await fetch(`${config.endpoint_orders}/${id}/user-reviews`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "authorization": `${token}`,
            "content-type": "application/json",
        },
        "body": JSON.stringify(review),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });

    let json = await res.json();
    return json;
}