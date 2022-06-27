const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { writeFile } = require('./PromisifedFunctions');
const app = express();
const port = 3000
const regex = '###';

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.post('/pixelData', async (req, res) => {
    const { data } = req.body;
    await processCSVs(data);
    res.send("Complete");
})

function slicer (data) {
    const size = data.length;
    const lists = [];
    let x = 0;
    while(x < size){
        if (x + 1000 < size){
            lists.push(data.slice(x, x + 1000))
        }
        else {
            lists.push(data.slice(x, size - 1))
        }
        x += 1000;
    }
    return lists;
}

function cleaner (lists){
    return lists.map(list => {
        list.unshift("x,y,z")
        return list.map((row, i) => row+regex).toString();;
    });
}

async function makeFile(content, id){
    const path = './outputFiles';
    const name = `out_${id}.csv`;
    const destination = `${path}/${name}`;
    await writeFile(destination, content);
}

async function processCSVs(data){
    const lists = slicer(data);
    const updatedLists = cleaner(lists);
    Promise.all(updatedLists.map(async (updatedContent, id) => {
        let cont = addNewLines(updatedContent);
        console.log(cont)
        await makeFile(addNewLines(updatedContent), id);
    }))
}

function addNewLines(content) {
    const updatedContent = content.replaceAll(`${regex},`, '\n');
    return updatedContent
}

app.listen(port)
