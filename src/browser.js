import * as Gluon from '@gluon-framework/gluon';
import fs from 'fs';
import * as gg from './lib/gluonSetup.js';


export async function superWindow() {
  const Window = await Gluon.open('https://ggmax.com.br/conta', {
  allowNavigation: true,
  data_path: './gluon_data',
});


/*
EMARANHADO DE FUNÇÕES PARA MANIPULAR COOKIES
*/

async function waitForCookiesLoad() {
  let cookies = await Window.page.eval('document.cookie');
  if (cookies.length > 0) {
    return;
  }
  return await waitForCookiesLoad();
}
async function waitForCookie(name) {
  let cookies = await Window.page.eval('document.cookie');
  if (cookies.includes(name)) {
    cookies = cookies.split('; ');
    cookies = cookies.map((cookie) => {
      var [name, value] = cookie.split('=');
      return { name, value };
    });
    const cookie = cookies.find((cookie) => cookie.name === name);
    if (cookie && cookie.value != 'false') {
      return cookie;
    }
  }
  return await waitForCookie(name);

}

async function cookieExists(name) {
  let cookies = await Window.page.eval('document.cookie');
  if (cookies.includes(name)) {
    cookies = cookies.split('; ');
    cookies = cookies.map((cookie) => {
      var [name, value] = cookie.split('=');
      return { name, value };
    });
    const cookie = cookies.find((cookie) => cookie.name === name);
    if (cookie && cookie.value != 'false') {
      return true;
    }
  }
  return false;
}

/* Função para aguardar a pagina do ggmax carregar */
async function waitForPageTitle(includes) {
    const title = await Window.page.title();
    if (title.includes(includes)) {
        return title;
    }
    return await waitForPageTitle(includes);
}

/* Função waitForElement tipo o selenium ou puppeteer */
async function waitForElement(selector) {
  let el = await Window.page.eval(`document.querySelector('${selector}')`);
  if (el.result.value !== null) {
    el.click = async () => {
      await Window.page.eval(`document.querySelector('${selector}').click()`);
    };
    return el;
  }
  return await waitForElement(selector);
}

async function waitForNavigation() {
  let st = await Window.page.eval(`document.readyState`);
  if (st === 'complete') {
    return;
  }
  return await waitForNavigation();
}

// delete gluon_data folder on close
Window._close = Window.close;
let removeFolderLoop = async (folder) => {
  if (fs.existsSync(folder)) {
    try {
    return await fs.promises.rm(folder, { recursive: true, force: true });
    } catch {
      await removeFolderLoop(folder);
    }
  }
}
Window.close = async () => {
  let close = await Window._close();
  // wait for file to be removable
  if (fs.existsSync('./gluon_data')) {
  await removeFolderLoop('./gluon_data');
  }

  return close;

}

Window.waitForCookiesLoad = waitForCookiesLoad;
Window.waitForCookie = waitForCookie;
Window.cookieExists = cookieExists;
Window.waitForPageTitle = waitForPageTitle;
Window.waitForElement = waitForElement;
Window.waitForNavigation = waitForNavigation;


return Window;


}

export async function getGGToken() {
const Window = await superWindow();
/* Esperando pelo botão de login e clicando */
await Window.waitForNavigation();
await Window.waitForCookiesLoad();

if (!await Window.cookieExists('auth._token.local')) {
  const loginButton = await Window.waitForElement('.instruction-container p:nth-child(3) > a:nth-child(1)');
  await loginButton.click();
}

let cookie = await Window.waitForCookie('auth._refresh_token.local');
cookie.value = cookie.value.replace('%20', ' ');

await Window.close();
return cookie.value;
}

