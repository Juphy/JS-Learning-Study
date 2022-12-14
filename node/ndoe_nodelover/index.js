let request = require('request'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    async = require('async');
let options = {
    uri: '',
    dirFile: './output/',
    downLimit: 2
};

const start = () => {
    let url = 'https://nodelover.me/courses';
    down(url);
};

async function down(url) {
    let prolist = await new Promise(resolve => {
        request(url, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                let $ = cheerio.load(body, {
                    normalizeWhitespace: true,
                    decodeEntities: false
                });
                const list = [];
                $('.course-item.c1').each((index, item) => {
                    let json = {
                        title: $(item).find('.link h1').text() + $(item).find('.course-type.vip').text(),
                        othertitle: $(item).find('.desc').text(),
                        class: $(item).find('.subtitle small').eq(0).text(),
                        Releasetime: $(item).find('.subtitle small').eq(0).text(),
                        coursetime: $(item).find('.subtitle small').eq(0).text(),
                        url: $(item).find('.link').attr('href')
                    };
                    list.push(json);
                });
                resolve(list);
            }
        })
    });
    console.log(prolist);
    prolist.length = 2;
    for (var opt of prolist) {
        if (!opt.title) return;
        await mkdir(opt.title);
        let videoList = await new Promise(resolve => {
            request('https://nodelover.me' + opt.url, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    let $ = cheerio.load(body, {
                        normalizeWhitespace: true,
                        decodeEntities: false
                    });
                    const list = [];
                    $('.video-list li').each((index, obj) => {
                        let json = {
                            title: $(obj).find('a').text(),
                            url: 'http://cdn.nodelover.me/video_bucket' + $(obj).find('a').attr('href').replace('/course', '') + '.mp4'
                        };
                        list.push(json);
                    });
                    resolve(list);
                }
            })
        });
        await sleep(2000);
        await downliu(opt.title, videoList, () => {
            console.log(opt.title + '????????????'.info, opt.title);
        })
    }
}

/**
 * ????????????
 */
function mkdir(title) {

    console.log('?????????????????????%s', title);
    if (fs.existsSync(options.dirFile + title)) {
        console.log('?????????%s ????????????'.error, title);

    } else {
        mkdirp(options.dirFile + title, function (err) {
            console.log('?????????%s ????????????'.info, title);
        });
    }
}

function sleep(duration) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, duration);
    });
};

/**
 * ????????????
 */
function downliu(dir, links, callback) {
    console.log('??????%d??????????????????????????????...', links.length);
    //eachLimits ?????????????????????????????? ??????????????? options.downLimit ????????????
    async.eachLimit(links, options.downLimit, function (url, cb) {
        // url?????????link???links???????????????
        //??????url???????????????
        var fileName = path.basename(url.title).replace(/&nbsp;/g, ''); // basename????????????.?????????
        //??????/
        var toPath = path.join(options.dirFile + dir, fileName);
        console.log('?????????????????????%s???????????????%s', fileName, dir);
//???????????????????????????
        request(encodeURI(url.url)).on('error', function (err) {
            cb();
        }).pipe(fs.createWriteStream(toPath + ".mp4")).on('finish', () => {
            console.log('?????????????????????%s', url.url);
            cb();
        })
    }, callback);
}

start();
