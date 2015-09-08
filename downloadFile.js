
'use strict';

// for (var i = 0; i < arr.length; i++) {
// 	console.log(arr[i]);
// }

const fs = require('fs');
const request = require('request');
const ProgressBar = require('progress');

var arr = [];

process.argv.forEach(function(val, index, array) {
    //console.log(index + ': ' + val);
    arr[index] = val;
});

// console.log("======",arr[2]);

var totalBytes, downloadedBytes;
var bar;

let req = request.get(arr[2]);

//https://unsplash.imgix.net/photo-1425235024244-b0e56d3cf907?fit=crop
// request(arr[2], function (error, response, body) {
// 	console.log(error.port);
//   // if (!error && response.statusCode == 200) {
//   //   console.log(body)
//   // }
// })
// var nameImg;
console.time('download');
req.on('error', function(err){
    console.log('Download error', err);
    console.log(err.port);
    if (err.port === 443) {
        console.log("phát sinh lỗi đường dẫn",err.port , arr[2]);
        process.exit(); // chấm dứt tiến trình đang chạy
    }
})
    .on('response', function(res) {
        totalBytes = parseInt(res.headers['content-length'], 10);
        // nameImg = res.caseless.dict['x-imgix-request-id'];
        //downloadedBytes = 0;
        //console.log('Total bytes: ' + totalBytes);
        bar = new ProgressBar('downloading [:bar] :percent :etas', {
            complete: '=',
            incomplete: ' ',
            width: 50,
            total: totalBytes
        });
    })
    .on('data', function(chunk){
        //downloadedBytes += chunk.length;
        //console.log(downloadedBytes + " / " + totalBytes);
        bar.tick(chunk.length);
    });

req.pipe(fs.createWriteStream('nameImg.png')
        .on('finish', function(){
            console.timeEnd('download');
            console.log('Done write to file');
        })

        .on('error', function (err) {
            console.log('Error write to file', err);
        })
);
