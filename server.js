import express from 'express';

const app = express();

app.set('port', process.env.PORT || 4001);

app.use('/test', (req, res) => {
    res.send('asldfjliasjdfajsdfjalisdfj')
})

import { handler } from "./app/build/handler.js"
app.use(handler);


app.get('/chkserver', (req, res) => {
    res.send('서버 생성 완료!!!!')
})



app.listen(app.get('port'), () => {
    console.log(`server running in port ${app.get('port')}`);
})