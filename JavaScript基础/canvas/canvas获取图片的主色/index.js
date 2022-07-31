var imgSrc = 'https://p3.qhimg.com/bdm/1000_618_80/t015d03c0ae16974bdc.jpg';
const imgEle = document.createElement('img');
const canvas = document.createElement('canvas');
imgEle.src = imgSrc;
imgEle.setAttribute('crossOrigin', ''); // 防止跨域
imgEle.onload = function () {
    let ctx = canvas.getContext('2d');
    let naturlaImgSize = [imgEle.naturalWidth, imgEle.naturalHeight];
    canvas.width = naturlaImgSize[0];
    canvas.height = naturlaImgSize[1];

    // 绘制到canvas
    ctx.drawImage(imgEle, 0, 0);

    // 获取imgaeData: rgba像素点
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let leftSectionData = [], rightSectionData = [], onelineImgDataLen = canvas.width * 4;
    console.log(imageData)
    imageData.data.forEach((colorVal, i) => {
        if (i % onelineImgDataLen < 0.5 * onelineImgDataLen || i % onelineImgDataLen >= 0.5 * onelineImgDataLen) {
            let inLeft = i % onelineImgDataLen <= 0.5 * onelineImgDataLen;
            if (i % 4 === 0) {
                // 获取rgb均值
                let curAverageRGB = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
                let leftOrRightRef = inLeft ? leftSectionData : rightSectionData
                // 每个数组里存四个值：本颜色中的r,g,b的均值，以及r,g,b三个值
                //均值一方面用于累加计算本区域的整体均值，然后再跟每个均值对比拿到与整体均值最接近的项的索引，再取该数组里的后三个值：rgb，对应着颜色
                leftOrRightRef[leftOrRightRef.length] = [curAverageRGB, imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]]
            }
        }
    })
    // generate average rgb
    let averageOfLeft = Math.floor(leftSectionData.reduce((_cur, item) => {
        return _cur + item[0]
    }, 0) / leftSectionData.length)
    let averageOfRight = Math.floor(rightSectionData.reduce((_cur, item) => {
        return _cur + item[1]
    }, 0) / leftSectionData.length)

    // find the most near color
    const findNearestIndex = (averageVal, arrBox) => {
        let _gapValue = Math.abs(averageVal - arrBox[0])
        let _nearColorIndex = 0
        arrBox.forEach((item, index) => {
            const curGapValue = Math.abs(item - averageVal)
            if (curGapValue < _gapValue) {
                _gapValue = curGapValue
                _nearColorIndex = index
            }
        })
        return _nearColorIndex
    }

    const leftNearestColor = leftSectionData[findNearestIndex(averageOfLeft, leftSectionData)]
    const rightNearestColor = rightSectionData[findNearestIndex(averageOfRight, rightSectionData)]
    console.log(leftNearestColor, rightNearestColor)
}