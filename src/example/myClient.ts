import fetch from 'node-fetch'

fetch('http://localhost:1212/services/userxx', {
    method: 'GET'
}).then((res) => {
    return res.text()
}).then((text) => {
    console.log(text);
}).catch((ex) => {
    console.log(ex);
});