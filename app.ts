const axios = require('axios');
const ChromeLauncher = require('chrome-launcher');

const targetUrl = 'http://www.yes24.com/Product/Goods/97812984?OzSrank=1';
const targetUrl2 = 'http://www.yes24.com/Product/Goods/79668098';
const matchWord = '<em class="txt">바로구매</em>';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function* timer(interval: number) {
  const startTime = Date.now();
  while (true) {
    yield Date.now () - startTime;
    await sleep(interval);
  }
}

async function request(url: string) {
  const requestStart = Date.now();
  const { data } = await axios.get(url);
  const result = data.indexOf(matchWord) !== -1;
  console.log('request duration: ', Date.now() - requestStart);
  console.log('request result: ', result);
  return result;
}

async function iterate() {
  let found;
  for await (let pastTime of timer(200)) {
    request(targetUrl).then((res) => found = res);
    if (found) break;
  }
}

async function launchChrome(url: string) {
  const options = {
    logLevel: 'verbose',
    startingUrl: url,
    userDataDir: false,
  };
  return ChromeLauncher.launch(options);
}

async function main(){
  console.log('program start');
  await iterate();
  await launchChrome(targetUrl);
  console.log('program end');
}

main()
