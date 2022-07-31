// 修改商详页滑动来源于bloomchic.com
let productDetailSlideshow = function () {
  var startx, starty
  //获得角度
  function getAngle(angx, angy) {
    return (Math.atan2(angy, angx) * 180) / Math.PI
  }

  //根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
  function getDirection(startx, starty, endx, endy) {
    var angx = endx - startx
    var angy = endy - starty
    var result = 0

    //如果滑动距离太短
    if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
      return result
    }

    var angle = getAngle(angx, angy)
    // if (angle >= -135 && angle <= -45) {
    //     result = 1;
    // } else if (angle > 45 && angle < 135) {
    //     result = 2;
    // } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
    //     result = 3;
    // } else if (angle >= -45 && angle <= 45) {
    //     result = 4;
    // }
    if (angle >= -120 && angle <= -60) {
      result = 1
    } else if (angle > 60 && angle < 120) {
      result = 2
    } else if (
      (angle >= 120 && angle <= 180) ||
      (angle >= -180 && angle < -120)
    ) {
      result = 3
    } else if (angle >= -60 && angle <= 60) {
      result = 4
    }

    return result
  }
  console.log(meta.page)
  let { pageType, resourceId } = meta.page;
  if(pageType==='product'){
      let productSlideShow = document.getElementById('ProductPhotos-'+resourceId);
      console.log(productSlideShow)
  }
  let productSlideShow = document.getElementsByClassName("product-slideshow")[0]
  if (productSlideShow) {
    //手指接触屏幕
    productSlideShow.addEventListener(
      "touchstart",
      function (e) {
        startx = e.touches[0].pageX
        starty = e.touches[0].pageY
      },
      {
        passive: false
      }
    )
    //手指离开屏幕
    productSlideShow.addEventListener(
      "touchmove",
      function (e) {
        var endx, endy
        endx = e.changedTouches[0].pageX
        endy = e.changedTouches[0].pageY
        var direction = getDirection(startx, starty, endx, endy)
        var angle = getAngle(endx - startx, endy - starty)
        switch (direction) {
          case 0:
            // alert("未滑动！");
            break
          case 1:
            // alert("向上！"+angle);
            break
          case 2:
            // alert("向下！"+angle);
            break
          case 3:
            // alert("向左！"+angle);
            if (e.cancelable) {
              e.preventDefault()
            }
            break
          case 4:
            // alert("向右！"+angle);
            if (e.cancelable) {
              e.preventDefault()
            }
            break
          default:
        }
      },
      {
        passive: false
      }
    )
  }
}
